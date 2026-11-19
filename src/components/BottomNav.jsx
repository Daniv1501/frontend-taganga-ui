const MAP_ICON = <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/>
const BOOK_ICON = (
  <>
    <path d="M2 5.5C4.5 4 8 4 12 6c4-2 7.5-2 10-.5V19c-2.5-1.5-6-1.5-10 .5-4-2-7.5-2-10-.5z"/>
    <path d="M12 6v13.5"/>
  </>
)
const CHAT_ICON = (
  <>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    <path d="M8 10h.01M12 10h.01M16 10h.01"/>
  </>
)
const SHIELD_ICON = (
  <>
    <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3z"/>
    <path d="m9 12 2 2 4-4"/>
  </>
)

const ITEMS = [
  { id: 'nav-mapa', module: 'mod-mapa', color: 'azul', label: 'Mapa', longLabel: 'Mapa Territorial', icon: MAP_ICON },
  { id: 'nav-historias', module: 'mod-historias', color: 'verde', label: 'Historias', longLabel: 'Historias', icon: BOOK_ICON },
  { id: 'nav-asistente', module: 'mod-asistente', color: 'caribe', label: 'Asistente', longLabel: 'Asistente Virtual', icon: CHAT_ICON },
  { id: 'nav-decalogo', module: 'mod-decalogo', color: 'dorado', label: 'Decálogo', longLabel: 'Decálogo', icon: SHIELD_ICON },
]

export default function BottomNav({ active, onSelect }) {
  return (
    <nav className="bottom-nav" role="tablist" aria-label="Módulos de Taganga One">
      {ITEMS.map((item) => (
        <button
          key={item.id}
          role="tab"
          id={item.id}
          className={active === item.module ? 'active' : undefined}
          aria-selected={active === item.module}
          aria-controls={item.module}
          data-color={item.color}
          onClick={() => onSelect(item.module)}
        >
          <span className="nav-pill">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{item.icon}</svg>
          </span>
          <span className="nav-label nav-label--short">{item.label}</span>
          <span className="nav-label nav-label--long">{item.longLabel}</span>
        </button>
      ))}
    </nav>
  )
}
