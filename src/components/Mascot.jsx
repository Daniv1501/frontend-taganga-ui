import { useId } from 'react'

// Tagui, el guía digital de Taganga One.
// mood: 'idle' (flota y parpadea) · 'listening' (el visitante escribe: pulso ámbar)
//       'thinking' (prepara respuesta: pulso verde, mira hacia arriba) · 'talking' (acaba de responder)
export default function Mascot({ mood = 'idle', size = 96, compact = false, title }) {
  const uid = useId().replace(/:/g, '')
  const id = (name) => `${name}-${uid}`

  return (
    <svg
      className={`mascot mascot--${mood}${compact ? ' mascot--compact' : ''}`}
      width={size}
      height={size * (compact ? 1 : 1.08)}
      viewBox={compact ? '14 0 92 92' : '0 0 120 130'}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <radialGradient id={id('body')} cx="0.35" cy="0.28" r="0.85">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.55" stopColor="#F3F7FB" />
          <stop offset="1" stopColor="#C9D7E6" />
        </radialGradient>
        <linearGradient id={id('visor')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0E4479" />
          <stop offset="1" stopColor="#041E3B" />
        </linearGradient>
        <radialGradient id={id('eye')} cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#B8F0FF" />
          <stop offset="0.45" stopColor="#38C3F2" />
          <stop offset="1" stopColor="#0A86BF" />
        </radialGradient>
        <radialGradient id={id('bulb')} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#FFE3A3" />
          <stop offset="0.5" stopColor="#F2A007" />
          <stop offset="1" stopColor="#C26B00" />
        </radialGradient>
        <filter id={id('soft')} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#062A4D" floodOpacity="0.22" />
        </filter>
      </defs>

      {!compact && <ellipse className="mascot__shadow" cx="60" cy="124" rx="24" ry="4" fill="#062A4D" opacity="0.18" />}

      <g className="mascot__float">
        {/* Halo que pulsa al escuchar o pensar */}
        <circle className="mascot__halo" cx="60" cy="52" r="44" fill="none" strokeWidth="2.5" />

        {/* Antena con sol ámbar y hojita de cerro */}
        <path d="M60 22 V11" stroke="#0E4479" strokeWidth="3" strokeLinecap="round" />
        <path className="mascot__leaf" d="M60 17 C66 12 72 13 74 15 C70 20 64 20 60 17Z" fill="#1E7B34" />
        <circle className="mascot__bulb-glow" cx="60" cy="8" r="9" fill="#F2A007" opacity="0.35" />
        <circle className="mascot__bulb" cx="60" cy="8" r="5.5" fill={`url(#${id('bulb')})`} />

        {/* Orejas */}
        <rect x="14" y="42" width="11" height="20" rx="5.5" fill="#0A86BF" filter={`url(#${id('soft')})`} />
        <rect x="95" y="42" width="11" height="20" rx="5.5" fill="#0A86BF" filter={`url(#${id('soft')})`} />

        {/* Cabeza */}
        <rect x="21" y="20" width="78" height="62" rx="28" fill={`url(#${id('body')})`} filter={`url(#${id('soft')})`} />
        <ellipse cx="44" cy="30" rx="14" ry="5" fill="#fff" opacity="0.8" />

        {/* Visor */}
        <rect x="30" y="33" width="60" height="38" rx="18" fill={`url(#${id('visor')})`} />
        <rect x="34" y="36" width="34" height="5" rx="2.5" fill="#fff" opacity="0.12" />

        <g className="mascot__eyes">
          <ellipse cx="47" cy="51" rx="6.5" ry="8" fill={`url(#${id('eye')})`} />
          <ellipse cx="73" cy="51" rx="6.5" ry="8" fill={`url(#${id('eye')})`} />
          <circle cx="49.5" cy="47.5" r="2" fill="#fff" />
          <circle cx="75.5" cy="47.5" r="2" fill="#fff" />
        </g>
        <ellipse cx="38" cy="62" rx="4" ry="2.3" fill="#F2A007" opacity="0.55" />
        <ellipse cx="82" cy="62" rx="4" ry="2.3" fill="#F2A007" opacity="0.55" />
        <path className="mascot__mouth" d="M54 62 Q60 67 66 62" stroke="#5FD3FF" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {!compact && (
          <>
            {/* Brazos */}
            <rect className="mascot__arm mascot__arm--left" x="28" y="86" width="10" height="22" rx="5" fill={`url(#${id('body')})`} filter={`url(#${id('soft')})`} />
            <rect className="mascot__arm mascot__arm--right" x="82" y="86" width="10" height="22" rx="5" fill={`url(#${id('body')})`} filter={`url(#${id('soft')})`} />

            {/* Cuerpo con el emblema: sol, cerro y mar */}
            <rect x="36" y="80" width="48" height="36" rx="18" fill={`url(#${id('body')})`} filter={`url(#${id('soft')})`} />
            <circle cx="60" cy="97" r="11" fill="#E3F4FB" />
            <circle cx="64" cy="92.5" r="3" fill="#F2A007" />
            <path d="M51 100 L57 92 L62 99 Z" fill="#1E7B34" />
            <path d="M50 101.5 q2.5-2 5 0 t5 0 t5 0 t5 0" stroke="#0A86BF" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </>
        )}
      </g>
    </svg>
  )
}
