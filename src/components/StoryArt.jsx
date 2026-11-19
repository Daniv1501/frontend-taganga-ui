import { useId } from 'react'
import { CATEGORIES } from '../data/stories'
import { SCENE_ICONS } from '../data/sceneIcons'

// Paisaje de Taganga por capas: cielo, sol, cerros, mar y el emblema de la historia
export default function StoryArt({ story, variant = 'card' }) {
  const uid = useId().replace(/:/g, '')
  const cat = CATEGORIES[story.category]
  const big = variant === 'hero'

  return (
    <svg className={`story-art story-art--${variant}`} viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#062A4D" />
          <stop offset="0.65" stopColor={cat.color} />
          <stop offset="1" stopColor="#F4B44C" />
        </linearGradient>
        <radialGradient id={`sun-${uid}`}>
          <stop offset="0" stopColor="#FFD27A" />
          <stop offset="0.55" stopColor="#F2A007" stopOpacity="0.9" />
          <stop offset="1" stopColor="#F2A007" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`sea-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0A8FC7" />
          <stop offset="1" stopColor="#004A87" />
        </linearGradient>
        <linearGradient id={`hill-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2E8F45" />
          <stop offset="1" stopColor="#0B4D1A" />
        </linearGradient>
      </defs>

      <rect width="320" height="180" fill={`url(#sky-${uid})`} />
      <circle className="story-art__sun" cx="246" cy="62" r="46" fill={`url(#sun-${uid})`} />
      <circle cx="246" cy="62" r="15" fill="#FFC44D" />

      <path d="M0 118 L60 72 L104 102 L150 58 L212 112 L320 86 V180 H0Z" fill="#0B4D1A" opacity="0.45" />
      <path d="M-10 132 L52 96 L98 122 L140 92 L196 128 V180 H-10Z" fill={`url(#hill-${uid})`} />

      <path className="story-art__wave" d="M0 136 Q20 128 40 136 T80 136 T120 136 T160 136 T200 136 T240 136 T280 136 T320 136 T360 136 V180 H0Z" fill={`url(#sea-${uid})`} />
      <path className="story-art__wave story-art__wave--back" d="M0 150 Q20 143 40 150 T80 150 T120 150 T160 150 T200 150 T240 150 T280 150 T320 150 T360 150 V180 H0Z" fill="#004A87" opacity="0.75" />

      <g transform={big ? 'translate(160 62) scale(0.85)' : 'translate(160 86)'}>
        <circle r={big ? 34 : 30} fill="rgba(255,255,255,0.18)" />
        <circle r={big ? 26 : 23} fill="#fff" />
        <g transform={`translate(-12 -12) scale(1)`} stroke={cat.color} fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d={SCENE_ICONS[story.scene]} />
        </g>
      </g>
    </svg>
  )
}
