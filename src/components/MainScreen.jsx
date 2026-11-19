import { useState } from 'react'
import AssistantModule from './AssistantModule'
import BottomNav from './BottomNav'
import BrandLogo from './BrandLogo'
import DecalogueModule from './DecalogueModule'
import MapModule from './MapModule'
import StoriesModule from './StoriesModule'
import { scrollToTop } from '../utils/scroll'

export default function MainScreen({ visitor, onLogout }) {
  const [activeModule, setActiveModule] = useState('mod-mapa')
  // Historia abierta en el módulo Historias (null = lista)
  const [openStoryId, setOpenStoryId] = useState(null)
  // Historia que el mapa debe enfocar; `at` permite repetir la misma historia
  const [mapFocus, setMapFocus] = useState(null)
  const firstName = visitor.fullName.split(' ')[0]
  const people = `${visitor.groupSize} persona${visitor.groupSize > 1 ? 's' : ''}`

  function selectModule(id) {
    // Tocar "Historias" estando dentro de una historia vuelve a la lista
    if (id === 'mod-historias' && activeModule === 'mod-historias') setOpenStoryId(null)
    setActiveModule(id)
    scrollToTop()
  }

  function readStory(storyId) {
    setOpenStoryId(storyId)
    setActiveModule('mod-historias')
    scrollToTop()
  }

  function showStoryOnMap(storyId) {
    setMapFocus({ storyId, at: Date.now() })
    setActiveModule('mod-mapa')
    scrollToTop()
  }

  return (
    <section id="screen-main" aria-label="Taganga One">
      <header className="topbar">
        <BrandLogo size={26} />
        <div className="topbar-title">
          <b>Taganga <span>One</span></b>
          <small>{visitor.fullName} · {people}</small>
        </div>
        <button className="icon-btn" aria-label="Cerrar sesión" title="Cerrar sesión" onClick={onLogout}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
        </button>
      </header>

      {/* Los módulos se ocultan sin desmontarse: el mapa y la conversación conservan su estado */}
      <main>
        <MapModule
          visitor={visitor}
          firstName={firstName}
          active={activeModule === 'mod-mapa'}
          focus={mapFocus}
          onReadStory={readStory}
        />
        <StoriesModule
          active={activeModule === 'mod-historias'}
          openStoryId={openStoryId}
          onOpenStory={readStory}
          onCloseStory={() => setOpenStoryId(null)}
          onShowOnMap={showStoryOnMap}
        />
        <AssistantModule firstName={firstName} active={activeModule === 'mod-asistente'} />
        <DecalogueModule active={activeModule === 'mod-decalogo'} />
      </main>

      <BottomNav active={activeModule} onSelect={selectModule} />
    </section>
  )
}
