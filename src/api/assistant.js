import { request } from './client'

export function getFaqs() {
  return request('/api/assistant/faqs')
}

// history: últimos turnos [{ role: 'user' | 'assistant', text }] en texto plano,
// para que el asistente entienda preguntas de seguimiento
export function askAssistant({ question, visitorName, history = [] }) {
  return request('/api/assistant/questions', {
    method: 'POST',
    body: JSON.stringify({ question, visitorName, history }),
  })
}
