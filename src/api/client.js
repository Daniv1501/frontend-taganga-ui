export class ApiError extends Error {
  constructor({ status, message, details }) {
    super(message)
    this.status = status
    this.details = details ?? {}
  }
}

const UNREACHABLE = 'No se pudo contactar el servidor'

// URL del backend (repositorio taganga-one). Vacía en desarrollo: Vite reenvía /api al backend.
const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export async function request(path, options = {}) {
  let response
  try {
    response = await fetch(API_BASE + path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    // Sin conexión: fetch rechaza antes de recibir respuesta
    throw new ApiError({ status: 0, message: UNREACHABLE })
  }

  if (!response.ok) {
    // El backend responde ErrorResponse; si no (backend caído), usamos un mensaje genérico
    const body = await response.json().catch(() => null)
    throw new ApiError({
      status: body?.status ?? response.status,
      message: body?.message ?? UNREACHABLE,
      details: body?.details,
    })
  }

  return response.json()
}
