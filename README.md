# Taganga One — Frontend

Aplicación web instalable (PWA) de **Taganga One**: mapa territorial, asistente virtual y
decálogo de conducta para el visitante del territorio ancestral de Taganga.

Hecha con React, Vite, TanStack Query y Leaflet.

El backend (API REST en Spring Boot) vive en su propio repositorio:
[Daniv1501/taganga-one](https://github.com/Daniv1501/taganga-one).

## Requisitos

- Node.js 20 o superior
- El backend corriendo (por defecto en `http://localhost:8080`)

## Desarrollo

```bash
npm install
npm run dev
```

Vite reenvía todo lo que empieza por `/api` al backend. Si el backend corre en otro puerto:

```bash
# PowerShell
$env:API_URL="http://localhost:8082"; npm run dev
# bash
API_URL=http://localhost:8082 npm run dev
```

## Producción

Copia `.env.example` a `.env.production` y define la URL pública del backend:

```
VITE_API_URL=https://api.ejemplo.com
```

Luego:

```bash
npm run build     # genera dist/
npm run preview   # sirve dist/ localmente para probarlo
```

El backend debe permitir el origen del frontend en CORS (`APP_CORS_ALLOWED_ORIGINS` en el
repositorio del backend).

## Scripts

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Compilación de producción en `dist/` |
| `npm run preview` | Sirve la compilación de producción |
| `npm run lint` | Revisión estática con oxlint |
| `npm run audio:historias` | Genera la narración de las historias con Azure Speech (ver abajo) |

## Narración de las historias (podcast)

Cada historia puede tener una narración en formato podcast, con voz sintética neuronal de
Azure Speech: una voz narra (`es-CO-SalomeNeural`) y otra lee las citas (`es-CO-GonzaloNeural`).
Los audios se generan **una sola vez** y se publican como archivos estáticos en
`public/audio/historias/`; la app no llama a Azure en ningún momento.

1. Crea un recurso **Speech** en el portal de Azure (el plan gratuito F0 alcanza de sobra:
   las 10 historias suman unos 13.000 caracteres) y copia su clave y región.
2. Crea `.env.local` en la raíz (Git lo ignora, la clave no se sube):
   ```
   AZURE_SPEECH_KEY=tu-clave
   AZURE_SPEECH_REGION=eastus
   ```
3. Genera los audios:
   ```bash
   npm run audio:historias                  # las que falten
   npm run audio:historias -- --force       # todas de nuevo (p. ej. si cambió el texto)
   npm run audio:historias -- isla-aguja    # solo una
   ```
   El script escribe los MP3 y actualiza `src/data/storyAudio.js`. Sube ambos a Git.

Solo las historias con audio muestran el reproductor. Nunca suena solo: el visitante toca
**Escuchar**, y la narración queda guardada para oírla sin conexión. Si algún día se graban
las voces de los mayores, basta con reemplazar el MP3 con el mismo nombre (exportado como MP3
mono de 48 kbps, para que la duración que calcula el script sea correcta) y volver a correr el
script.
