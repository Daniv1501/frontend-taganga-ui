import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// En desarrollo el navegador llama a /api en el mismo origen de Vite, y Vite reenvía
// al backend. Se quita el encabezado Origin para que el backend no aplique CORS a
// estas peticiones: si no, rechaza con 403 cuando Vite usa otro puerto (5174, 5175…).
const proxy = {
  '/api': {
    target: process.env.API_URL ?? 'http://localhost:8080',
    configure: (proxyServer) => {
      proxyServer.on('proxyReq', (proxyReq) => proxyReq.removeHeader('origin'))
    },
  },
}

export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
})
