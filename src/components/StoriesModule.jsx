import { useEffect, useRef, useState } from 'react'
import { CATEGORIES, STORIES, findStory } from '../data/stories'
import StoryArt from './StoryArt'
import StoryPlayer from './StoryPlayer'
import { STORY_AUDIO } from '../data/storyAudio'
import { scrollToTop } from '../utils/scroll'

const FILTERS = [['TODAS', 'Todas'], ...Object.entries(CATEGORIES).map(([key, cat]) => [key, cat.label])]

function CategoryTag({ category }) {
  const cat = CATEGORIES[category]
  return (
    <span className="story-tag" style={{ '--tag': cat.color, '--tag-soft': cat.soft, '--tag-ink': cat.ink }}>
      {cat.label}
    </span>
  )
}

const PIN_ICON = <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />

function StoryReader({ story, active, onClose, onOpen, onShowOnMap }) {
  const headingRef = useRef(null)
  const index = STORIES.indexOf(story)
  const prev = STORIES[index - 1]
  const next = STORIES[index + 1]
  const cat = CATEGORIES[story.category]

  // Al abrir (o cambiar) de historia: arriba y foco en el título, para lectores de pantalla
  useEffect(() => {
    scrollToTop()
    headingRef.current?.focus({ preventScroll: true })
  }, [story.id])

  return (
    <article className="lore" style={{ '--cat': cat.color, '--cat-soft': cat.soft, '--cat-ink': cat.ink }}>
      <div className="lore-hero">
        <StoryArt story={story} variant="hero" />
        <button type="button" className="lore-back" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
          Todas las historias
        </button>
        <div className="lore-hero__text">
          <CategoryTag category={story.category} />
          <h2 ref={headingRef} tabIndex={-1}>{story.title}</h2>
          <p className="lore-place">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{PIN_ICON}</svg>
            {story.place}
          </p>
        </div>
      </div>

      <div className="lore-body">
        {STORY_AUDIO[story.id] && (
          <StoryPlayer key={story.id} story={story} audio={STORY_AUDIO[story.id]} active={active} />
        )}
        <p className="lore-lead">{story.summary}</p>
        {story.body.map((paragraph, i) => (
          <p key={i} className={i === 0 ? 'lore-first' : undefined}>{paragraph}</p>
        ))}

        {story.quote && (
          <blockquote className="lore-quote">
            <p>“{story.quote.text}”</p>
            <cite>{story.quote.author}</cite>
          </blockquote>
        )}

        <div className="lore-notes">
          <section className="lore-note lore-note--teach">
            <h3>Lo que nos enseña</h3>
            <p>{story.teaching}</p>
          </section>
          <section className="lore-note lore-note--respect">
            <h3>Cómo honrarla como visitante</h3>
            <p>{story.respect}</p>
          </section>
        </div>

        <div className="lore-actions">
          <button type="button" className="btn btn-primary" onClick={() => onShowOnMap(story.id)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{PIN_ICON}</svg>
            Ver en el mapa
          </button>
        </div>

        <nav className="lore-pager" aria-label="Otras historias">
          {prev ? (
            <button type="button" onClick={() => onOpen(prev.id)}>
              <small>Anterior</small>
              <span>{prev.title}</span>
            </button>
          ) : <span />}
          {next && (
            <button type="button" className="lore-pager__next" onClick={() => onOpen(next.id)}>
              <small>Siguiente</small>
              <span>{next.title}</span>
            </button>
          )}
        </nav>

        <p className="map-note">Relatos de la memoria oral de Taganga recogidos en el Plan de Vida del Cabildo Indígena (2022). Ubicaciones aproximadas.</p>
      </div>
    </article>
  )
}

export default function StoriesModule({ active, openStoryId, onOpenStory, onCloseStory, onShowOnMap }) {
  const [filter, setFilter] = useState('TODAS')
  const story = findStory(openStoryId)
  const shown = filter === 'TODAS' ? STORIES : STORIES.filter((s) => s.category === filter)

  return (
    <div
      className={active ? 'module' : 'module hidden'}
      id="mod-historias"
      role="tabpanel"
      aria-labelledby="nav-historias"
    >
      {story ? (
        <StoryReader story={story} active={active} onClose={onCloseStory} onOpen={onOpenStory} onShowOnMap={onShowOnMap} />
      ) : (
        <>
          <header className="stories-hero">
            <span className="eyebrow">Memoria viva</span>
            <h2>Historias de Taganga</h2>
            <p>Autoridades espirituales, sitios sagrados y luchas que sostienen la identidad del pueblo taganguero. Cada historia tiene su lugar en el mapa.</p>
          </header>

          <div className="story-filters" role="group" aria-label="Filtrar historias por categoría">
            {FILTERS.map(([key, label]) => (
              <button
                key={key}
                type="button"
                className="chip"
                aria-pressed={filter === key}
                style={key !== 'TODAS' ? { '--chip': CATEGORIES[key].color } : undefined}
                onClick={() => setFilter(key)}
              >
                {key !== 'TODAS' && <span className="dot" style={{ background: CATEGORIES[key].color }}></span>}
                {label}
              </button>
            ))}
          </div>

          <ul className="story-grid">
            {shown.map((item, i) => (
              <li key={item.id} style={{ '--i': i }}>
                <button type="button" className="story-card" onClick={() => onOpenStory(item.id)}>
                  <div className="story-card__art">
                    <StoryArt story={item} />
                    {STORY_AUDIO[item.id] && (
                      <span className="story-card__audio">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"/></svg>
                        {Math.max(1, Math.round(STORY_AUDIO[item.id].duration / 60))} min
                      </span>
                    )}
                  </div>
                  <div className="story-card__body">
                    <CategoryTag category={item.category} />
                    <h3>{item.title}</h3>
                    <p className="story-card__place">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{PIN_ICON}</svg>
                      {item.place}
                    </p>
                    <p className="story-card__summary">{item.summary}</p>
                    <span className="story-card__cta">
                      Leer historia
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
