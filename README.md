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
