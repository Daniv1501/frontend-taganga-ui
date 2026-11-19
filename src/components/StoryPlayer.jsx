import { useEffect, useId, useRef, useState } from 'react'
import { read, save } from '../utils/storage'

// Caché compartida con public/sw.js: la narración queda disponible sin conexión
const AUDIO_CACHE = 'taganga-one-audio'
const RATE_KEY = 'tagangaOne.velocidadAudio'
const RATES = [1, 1.25, 1.5]
const SKIP = 15

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00'
  const s = Math.max(0, Math.round(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

// Guarda el archivo completo para escucharlo después sin conexión
function keepOffline(src) {
  if (!('caches' in window)) return
  caches.open(AUDIO_CACHE)
    .then((cache) => cache.match(src).then((hit) => hit || cache.add(src)))
    .catch(() => {})
}

const ICON_PROPS = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

// Reproductor tipo podcast, minimalista: una píldora que se despliega al escuchar.
// Nunca suena solo: el visitante decide cuándo escuchar.
export default function StoryPlayer({ story, audio, active }) {
  const audioRef = useRef(null)
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(audio.duration)
  const [rate, setRate] = useState(() => (RATES.includes(read(RATE_KEY, 1)) ? read(RATE_KEY, 1) : 1))
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = rate
  }, [rate])

  // Si el visitante cambia de sección, la narración se pausa
  useEffect(() => {
    if (!active) audioRef.current?.pause()
  }, [active])

  // Controles en la pantalla de bloqueo y en los auriculares
  useEffect(() => {
    if (!playing || !('mediaSession' in navigator)) return
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: story.title,
      artist: 'Historias de Taganga · Taganga One',
      album: story.place,
      artwork: [{ src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }],
    })
    const el = audioRef.current
    const handlers = {
      play: () => el.play(),
      pause: () => el.pause(),
      seekbackward: () => { el.currentTime = Math.max(0, el.currentTime - SKIP) },
      seekforward: () => { el.currentTime = Math.min(el.duration || Infinity, el.currentTime + SKIP) },
    }
    Object.entries(handlers).forEach(([action, handler]) => {
      try { navigator.mediaSession.setActionHandler(action, handler) } catch { /* acción no soportada */ }
    })
  }, [playing, story])

  function toggle() {
    const el = audioRef.current
    if (el.paused) {
      setOpen(true)
      setFailed(false)
      setLoading(true)
      el.play().catch(() => {
        setLoading(false)
        setFailed(true)
      })
      keepOffline(audio.src)
    } else {
      el.pause()
    }
  }

  function skip(seconds) {
    const el = audioRef.current
    el.currentTime = Math.min(Math.max(0, el.currentTime + seconds), el.duration || duration)
  }

  function changeRate() {
    const next = RATES[(RATES.indexOf(rate) + 1) % RATES.length]
    setRate(next)
    save(RATE_KEY, next)
  }

  const progress = duration ? Math.min(100, (current / duration) * 100) : 0

  return (
    <section
      className={`player${open ? ' player--open' : ''}${playing ? ' player--playing' : ''}`}
      style={{ '--progress': `${progress}%` }}
      aria-label="Narración de la historia"
    >
      {/* preload="none": no se descarga nada hasta que el visitante toca Escuchar */}
      <audio
        ref={audioRef}
        src={audio.src}
        preload="none"
        onPlaying={() => { setPlaying(true); setLoading(false) }}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setCurrent(0) }}
        onWaiting={() => setLoading(true)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          e.currentTarget.playbackRate = rate
          if (Number.isFinite(e.currentTarget.duration)) setDuration(e.currentTarget.duration)
        }}
        onError={() => { setLoading(false); setPlaying(false); setFailed(true) }}
      />

      <div className="player__head">
        <button
          type="button"
          className="player__play"
          onClick={toggle}
          aria-label={playing ? 'Pausar narración' : 'Escuchar la historia'}
        >
          {loading ? (
            <span className="player__spinner" aria-hidden="true"></span>
          ) : playing ? (
            <svg {...ICON_PROPS} width={16} height={16} strokeWidth={3}><path d="M8 5v14M16 5v14" /></svg>
          ) : (
            <svg {...ICON_PROPS} width={16} height={16} fill="currentColor" strokeWidth={1.5}><path d="M8 5.5v13l11-6.5z" /></svg>
          )}
        </button>

        <div className="player__info">
          <span className="player__label">{playing ? 'Escuchando la historia' : 'Escuchar la historia'}</span>
          <span className="player__meta">
            {playing || current > 0 ? `${formatTime(current)} / ` : ''}{formatTime(duration)} · <span className="player__ai">Voz sintética</span>
          </span>
        </div>

        <button
          type="button"
          className="player__toggle"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? 'Ocultar controles de la narración' : 'Mostrar controles de la narración'}
        >
          <svg {...ICON_PROPS} width={18} height={18}><path d="m6 9 6 6 6-6" /></svg>
        </button>
      </div>

      {/* Avance mínimo, visible con el panel plegado mientras suena */}
      <span className="player__mini" aria-hidden="true"></span>

      <div className="player__panel" id={panelId} inert={!open}>
        <div className="player__panel-inner">
          <div className="player__bar">
            <span className="player__time">{formatTime(current)}</span>
            <input
              type="range"
              min="0"
              max={Math.round(duration) || 0}
              step="1"
              value={Math.round(current)}
              onChange={(e) => {
                audioRef.current.currentTime = Number(e.target.value)
                setCurrent(Number(e.target.value))
              }}
              aria-label="Avance de la narración"
              aria-valuetext={`${formatTime(current)} de ${formatTime(duration)}`}
            />
            <span className="player__time">{formatTime(duration)}</span>
          </div>

          <div className="player__controls">
            <button type="button" onClick={() => skip(-SKIP)} aria-label={`Retroceder ${SKIP} segundos`}>
              <svg {...ICON_PROPS} width={16} height={16}><path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" /></svg>
              {SKIP}s
            </button>
            <button type="button" onClick={changeRate} aria-label={`Velocidad ${rate}x, tocar para cambiar`}>
              {rate}x
            </button>
            <button type="button" onClick={() => skip(SKIP)} aria-label={`Adelantar ${SKIP} segundos`}>
              {SKIP}s
              <svg {...ICON_PROPS} width={16} height={16}><path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5" /></svg>
            </button>
          </div>
        </div>
      </div>

      {failed && <p className="player__error">No se pudo cargar la narración. Revisa tu conexión e inténtalo de nuevo.</p>}
    </section>
  )
}
