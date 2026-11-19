import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { askAssistant } from '../api/assistant'
import { useFaqs } from '../hooks/useFaqs'
import Mascot from './Mascot'

const OFFLINE_ANSWER = '<p>No pude contactar el servidor para responder eso. Las preguntas frecuentes de abajo siguen disponibles sin conexión.</p>'
const TALK_MS = 2200

const STATUS = {
  idle: 'En línea · listo para ayudarte',
  listening: 'Escuchando…',
  thinking: 'Pensando la respuesta…',
  talking: 'Respondiendo',
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function BotMessage({ children }) {
  return (
    <div className="msg-row msg-row--bot">
      <span className="msg-avatar"><Mascot compact size={30} /></span>
      <div className="msg msg-bot">
        <div className="who">Tagui · Taganga One</div>
        {children}
      </div>
    </div>
  )
}

export default function AssistantModule({ firstName, active }) {
  const { data: faqs } = useFaqs()
  const ask = useMutation({ mutationFn: askAssistant })
  const [messages, setMessages] = useState([])
  const [busy, setBusy] = useState(false)
  const [talking, setTalking] = useState(false)
  const [text, setText] = useState('')
  const logRef = useRef(null)
  const nextId = useRef(0)
  const talkTimer = useRef(null)

  const mood = busy ? 'thinking' : talking ? 'talking' : text.trim() ? 'listening' : 'idle'

  // Mantiene visible el último mensaje; display:none deja el scroll en 0 al ocultarse
  useEffect(() => {
    if (active && logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [messages, busy, active])

  useEffect(() => () => clearTimeout(talkTimer.current), [])

  function addMessage(role, content) {
    setMessages((current) => [...current, { id: nextId.current++, role, content }])
  }

  async function send(question, fixedAnswer) {
    if (busy) return
    setBusy(true)
    setTalking(false)
    addMessage('user', question)

    let answer = fixedAnswer
    if (!answer) {
      try {
        const result = await ask.mutateAsync({ question, visitorName: firstName })
        answer = result.answer
      } catch {
        answer = OFFLINE_ANSWER
      }
    }

    // Simula "pensar", igual que el prototipo
    await wait(600 + Math.min(1200, answer.length * 2))
    addMessage('bot', answer)
    setBusy(false)
    setTalking(true)
    clearTimeout(talkTimer.current)
    talkTimer.current = setTimeout(() => setTalking(false), TALK_MS)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const question = text.trim()
    if (!question || busy) return
    setText('')
    send(question)
  }

  return (
    <div
      className={active ? 'module' : 'module hidden'}
      id="mod-asistente"
      role="tabpanel"
      aria-labelledby="nav-asistente"
    >
      <article className="card chat" id="sec-asistente">
        <header className="chat-hero">
          <div className="chat-hero__mascot">
            <Mascot mood={mood} size={92} title="Tagui, el guía de Taganga One" />
          </div>
          <div className="chat-hero__text">
            <span className="eyebrow">Asistente virtual</span>
            <h2>Hola, soy Tagui</h2>
            <p className={`chat-status chat-status--${mood}`} aria-live="polite">
              <span className="chat-status__dot" aria-hidden="true"></span>
              {STATUS[mood]}
            </p>
          </div>
          <div className={`voice-wave voice-wave--${mood}`} aria-hidden="true">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </header>

        <div className="chat-log" ref={logRef} aria-live="polite" aria-label="Conversación con el asistente">
          <BotMessage>
            <p>¡Hola, {firstName}! Soy <b>Tagui</b>, tu guía por el territorio ancestral de Taganga. 🌊</p>
            <p>Toca una pregunta rápida o escríbeme lo que quieras saber.</p>
          </BotMessage>

          {messages.map((message) =>
            message.role === 'user' ? (
              <div key={message.id} className="msg-row msg-row--user">
                <div className="msg msg-user">{message.content}</div>
              </div>
            ) : (
              <BotMessage key={message.id}>
                {/* HTML de la base de conocimiento; el backend escapa el nombre del visitante */}
                <div dangerouslySetInnerHTML={{ __html: message.content }} />
              </BotMessage>
            ),
          )}

          {busy && (
            <div className="msg-row msg-row--bot">
              <span className="msg-avatar"><Mascot compact size={30} mood="thinking" /></span>
              <div className="msg msg-bot typing" aria-label="Tagui está escribiendo">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
        </div>

        <div className="quick">
          <div className="suggest-label">Preguntas rápidas</div>
          <div className="suggestions">
            {faqs?.map((faq) => (
              <button key={faq.code} type="button" disabled={busy} onClick={() => send(faq.question, faq.answer)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/></svg>
                {faq.question}
              </button>
            ))}
          </div>
        </div>

        <form className="chat-bar" autoComplete="off" onSubmit={handleSubmit}>
          <label htmlFor="chat-input" className="hidden">Escribe tu pregunta</label>
          <div className="chat-input-wrap">
            <input
              id="chat-input"
              type="text"
              placeholder="Pregúntale a Tagui…"
              maxLength={300}
              enterKeyHint="send"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <button type="submit" className="send-btn" aria-label="Enviar mensaje" disabled={busy || !text.trim()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </form>
      </article>
    </div>
  )
}
