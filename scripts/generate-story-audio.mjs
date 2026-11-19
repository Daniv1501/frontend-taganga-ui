// Genera la narración (formato podcast) de cada historia con Azure Speech
// y la guarda en public/audio/historias/<id>.mp3.
//
// Uso:
//   1. En .env.local (no se sube a Git):
//        AZURE_SPEECH_KEY=tu-clave
//        AZURE_SPEECH_REGION=eastus
//   2. npm run audio:historias                 → genera las que falten
//      npm run audio:historias -- --force      → regenera todas
//      npm run audio:historias -- isla-aguja   → solo esas historias
//
// Voces (opcional, en .env.local): AZURE_VOICE_NARRATOR y AZURE_VOICE_QUOTE.
import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs'
import { STORIES } from '../src/data/stories.js'

try {
  process.loadEnvFile('.env.local')
} catch {
  // Sin .env.local: se usan las variables de entorno del sistema
}

const KEY = process.env.AZURE_SPEECH_KEY
const REGION = process.env.AZURE_SPEECH_REGION
const NARRATOR = process.env.AZURE_VOICE_NARRATOR || 'es-CO-SalomeNeural'
const QUOTE_VOICE = process.env.AZURE_VOICE_QUOTE || 'es-CO-GonzaloNeural'
// MP3 mono de 48 kbps: ~0,36 MB por minuto, liviano para datos móviles
const FORMAT = 'audio-24khz-48kbitrate-mono-mp3'
const BYTES_PER_SECOND = 48000 / 8
const OUT_DIR = 'public/audio/historias'
const MANIFEST = 'src/data/storyAudio.js'

const args = process.argv.slice(2)
const force = args.includes('--force')
const only = args.filter((arg) => !arg.startsWith('--'))

if (!KEY || !REGION) {
  console.error('Falta AZURE_SPEECH_KEY o AZURE_SPEECH_REGION (ponlas en .env.local).')
  process.exit(1)
}

const escapeXml = (text) => text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c])

// Ajustes para que la voz lea bien abreviaturas y signos
function speakable(text) {
  return escapeXml(
    text
      .replace(/N\.° ?/g, 'número ')
      .replace(/(\d+) ?%/g, '$1 por ciento')
      .replace(/\s?—\s?/g, ', ')
      .replace(/[“”"]/g, ''),
  )
}

const pause = (ms) => `<break time="${ms}ms"/>`

function buildSsml(story) {
  const narrator = (content) => `<voice name="${NARRATOR}"><prosody rate="-6%">${content}</prosody></voice>`
  const parts = [
    narrator(
      `Historias de Taganga.${pause(500)} ${speakable(story.title)}.${pause(350)} ${speakable(story.place)}.${pause(900)}` +
        story.body.map(speakable).join(pause(750)),
    ),
  ]
  if (story.quote) {
    parts.push(narrator(`${pause(500)}Como lo recuerda ${speakable(story.quote.author)}:${pause(300)}`))
    parts.push(`<voice name="${QUOTE_VOICE}"><prosody rate="-4%">${speakable(story.quote.text)}</prosody></voice>`)
  }
  parts.push(
    narrator(
      `${pause(700)}Lo que nos enseña:${pause(300)} ${speakable(story.teaching)}${pause(1000)}` +
        'Escuchaste Historias de Taganga, en Taganga One. Esta narración usa una voz sintética.',
    ),
  )
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="es-CO">${parts.join('')}</speak>`
}

async function synthesize(ssml) {
  const response = await fetch(`https://${REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': KEY,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': FORMAT,
      'User-Agent': 'taganga-one-audio',
    },
    body: ssml,
  })
  if (!response.ok) {
    throw new Error(`Azure respondió ${response.status}: ${await response.text()}`)
  }
  return Buffer.from(await response.arrayBuffer())
}

mkdirSync(OUT_DIR, { recursive: true })
const targets = STORIES.filter((story) => only.length === 0 || only.includes(story.id))
if (only.length && targets.length !== only.length) {
  console.error(`Historias desconocidas: ${only.filter((id) => !STORIES.some((s) => s.id === id)).join(', ')}`)
  process.exit(1)
}

for (const story of targets) {
  const file = `${OUT_DIR}/${story.id}.mp3`
  if (existsSync(file) && !force) {
    console.log(`= ${story.id} (ya existe)`)
    continue
  }
  process.stdout.write(`… ${story.id} `)
  const audio = await synthesize(buildSsml(story))
  writeFileSync(file, audio)
  console.log(`✓ ${(audio.length / 1024 / 1024).toFixed(2)} MB`)
}

// El manifiesto lista todas las narraciones que existen en disco
const manifest = Object.fromEntries(
  STORIES.filter((story) => existsSync(`${OUT_DIR}/${story.id}.mp3`)).map((story) => {
    const bytes = statSync(`${OUT_DIR}/${story.id}.mp3`).size
    return [story.id, { src: `/audio/historias/${story.id}.mp3`, duration: Math.round(bytes / BYTES_PER_SECOND) }]
  }),
)
writeFileSync(
  MANIFEST,
  `// Narraciones de las historias. Archivo generado por \`npm run audio:historias\`
// (scripts/generate-story-audio.mjs): no editar a mano.
// Una historia sin entrada aquí simplemente no muestra el reproductor.
export const STORY_AUDIO = ${JSON.stringify(manifest, null, 2)}
`,
)
console.log(`Manifiesto actualizado: ${Object.keys(manifest).length} narraciones.`)
