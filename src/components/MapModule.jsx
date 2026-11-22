import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import ErrorMessage from './ErrorMessage'
import { useZones } from '../hooks/useZones'
import { GROUPS, ZONE_TYPES, zoneType } from '../data/zoneTypes'
import { CATEGORIES as STORY_CATEGORIES, STORIES } from '../data/stories'
import { SCENE_ICONS } from '../data/sceneIcons'

const STORY_GROUP = 'HISTORIAS'
const STORY_COLOR = '#D17900'
const FILTER_GROUPS = [...GROUPS, [STORY_GROUP, 'Historias']]

// Taganga y sus alrededores: el mapa no deja perderse lejos del territorio
const AREA = L.latLngBounds([11.235, -74.235], [11.325, -74.155])

const HATCH_ID = 'zepat-hatch'

// Capas en orden de dibujo: ZEPAT abajo, afectaciones encima, recorridos arriba
const PANES = { ZEPAT: ['zepat', 410], AREA: ['usos', 420], LINE: ['recorridos', 430] }

const ICONS = {
  fit: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/><circle cx="12" cy="12" r="2.5"/></svg>',
  expand: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>',
  shrink: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/></svg>',
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
}

function paneFor(zone) {
  if (zone.geometry === 'LINE') return PANES.LINE[0]
  return zone.type === 'ZEPAT' ? PANES.ZEPAT[0] : PANES.AREA[0]
}

function polygonStyle(cat, highlighted) {
  if (cat.hatch) {
    return { color: cat.color, weight: highlighted ? 3.5 : 1.5, fillColor: `url(#${HATCH_ID})`, fillOpacity: 1 }
  }
  return { color: cat.color, weight: highlighted ? 3 : 1.5, fillColor: cat.color, fillOpacity: highlighted ? 0.95 : 0.78 }
}

function lineStyle(cat, highlighted) {
  const extra = highlighted ? 2.5 : 0
  const line = cat.line ?? { weight: 3 }
  return {
    main: { color: cat.color, weight: line.weight + extra, dashArray: line.dashArray, lineCap: 'round', lineJoin: 'round' },
    casing: line.casing && { color: line.casing, weight: line.weight + 3 + extra, lineCap: 'round', lineJoin: 'round' },
  }
}

function toLatLngs(zone) {
  return zone.coordinates.map((c) => [c.latitude, c.longitude])
}

// Devuelve la capa de Leaflet y una función para resaltarla o no
function buildLayer(zone) {
  const cat = zoneType(zone.type)
  const pane = paneFor(zone)
  const latlngs = toLatLngs(zone)

  if (zone.geometry === 'POINT') {
    const style = (on) => ({ radius: on ? 13 : 10, color: '#fff', weight: 3, fillColor: cat.color, fillOpacity: 1 })
    const layer = L.circleMarker(latlngs[0], { ...style(false), pane })
    return { layer, highlight: (on) => layer.setStyle(style(on)) }
  }

  if (zone.geometry === 'LINE') {
    const style = lineStyle(cat, false)
    const main = L.polyline(latlngs, { ...style.main, pane })
    const casing = style.casing && L.polyline(latlngs, { ...style.casing, pane })
    const layer = L.featureGroup(casing ? [casing, main] : [main])
    return {
      layer,
      highlight(on) {
        const next = lineStyle(cat, on)
        main.setStyle(next.main)
        casing?.setStyle(next.casing)
        if (on) layer.bringToFront()
      },
    }
  }

  const layer = L.polygon(latlngs, { ...polygonStyle(cat, false), pane })
  return {
    layer,
    highlight(on) {
      layer.setStyle(polygonStyle(cat, on))
      if (on) layer.bringToFront()
    },
  }
}

// Marcador de historia: gota con el ícono de su escena y el color de su categoría
function storyIcon(story) {
  const cat = STORY_CATEGORIES[story.category]
  return L.divIcon({
    className: 'story-marker',
    html: `<span class="story-pin" style="--pin:${cat.color}">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="${SCENE_ICONS[story.scene]}"/></svg>
    </span>`,
    iconSize: [42, 50],
    iconAnchor: [21, 48],
    popupAnchor: [0, -46],
    tooltipAnchor: [0, -46],
  })
}

// Vista previa de la historia; el botón abre la historia completa en el módulo Historias
function storyPreview(story, onRead) {
  const cat = STORY_CATEGORIES[story.category]
  const box = L.DomUtil.create('div', 'story-pop')
  box.innerHTML = `
    <span class="pop-tag" style="background:${cat.color}">${escapeHtml(cat.label)}</span>
    <div class="pop-title">${escapeHtml(story.title)}</div>
    <div class="pop-rule">${escapeHtml(story.place)} · ${escapeHtml(story.summary)}</div>`
  const button = L.DomUtil.create('button', 'story-pop__btn', box)
  button.type = 'button'
  button.innerHTML = 'Leer historia <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  L.DomEvent.on(button, 'click', (event) => {
    L.DomEvent.stop(event)
    onRead(story.id)
  })
  return box
}

// Botón propio en el estilo de los controles de Leaflet
function addButton(map, { title, icon, position = 'topleft', onClick }) {
  const control = L.control({ position })
  let button
  control.onAdd = () => {
    const bar = L.DomUtil.create('div', 'leaflet-bar map-btn-bar')
    button = L.DomUtil.create('a', 'map-btn', bar)
    button.href = '#'
    button.role = 'button'
    button.title = title
    button.setAttribute('aria-label', title)
    button.innerHTML = icon
    L.DomEvent.disableClickPropagation(bar)
    L.DomEvent.on(button, 'click', (event) => {
      L.DomEvent.preventDefault(event)
      onClick()
    })
    return bar
  }
  control.addTo(map)
  return {
    update(nextTitle, nextIcon) {
      button.title = nextTitle
      button.setAttribute('aria-label', nextTitle)
      button.innerHTML = nextIcon
    },
  }
}

function createMap(container) {
  const map = L.map(container, {
    zoomControl: false,
    // Zoom con la rueda del mouse, en pasos suaves
    scrollWheelZoom: true,
    wheelPxPerZoomLevel: 90,
    wheelDebounceTime: 30,
    zoomSnap: 0.25,
    zoomDelta: 0.5,
    minZoom: 12,
    maxZoom: 19,
    maxBounds: AREA.pad(0.5),
    maxBoundsViscosity: 0.8,
    tap: true,
  }).setView([11.2665, -74.194], 15)

  Object.values(PANES).forEach(([name, zIndex]) => {
    map.createPane(name).style.zIndex = zIndex
  })

  L.control.zoom({ position: 'topleft', zoomInTitle: 'Acercar', zoomOutTitle: 'Alejar' }).addTo(map)
  L.control.scale({ metric: true, imperial: false, position: 'bottomleft' }).addTo(map)

  // Teselas Esri: públicas, sin API key ni registro.
  // Nota: Esri usa el orden {z}/{y}/{x} (fila antes que columna).
  const esriAttribution = 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, USGS, OpenStreetMap contributors'
  const streets = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: esriAttribution,
  })
  // Vista satelital por defecto: se reconocen la bahía, los cerros y las playas
  const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    // Esri no tiene fotos de más detalle en la zona: se amplían las de nivel 18
    maxNativeZoom: 18,
    attribution: 'Tiles &copy; Esri &mdash; Esri, Maxar, Earthstar Geographics',
  }).addTo(map)
  L.control.layers({ Satélite: satellite, Calles: streets }, null, { position: 'topright' }).addTo(map)

  // Respaldo automático (también sin clave): si la capa de Esri activa falla varias
  // veces, se cambia a OpenStreetMap
  let usingFallback = false
  const fallBack = (layer) => {
    if (usingFallback || !map.hasLayer(layer)) return
    usingFallback = true
    map.removeLayer(layer)
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      subdomains: 'abc',
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · OSM France',
    }).addTo(map).bringToBack()
  }
  ;[satellite, streets].forEach((layer) => {
    let failures = 0
    layer.on('tileerror', () => {
      if (++failures === 6) fallBack(layer)
    })
  })

  return map
}

// Muestra de la convención en la leyenda, igual a como se dibuja en el mapa
function LegendSwatch({ cat }) {
  if (cat.line) {
    return (
      <svg width="24" height="12" viewBox="0 0 24 12" aria-hidden="true">
        {cat.line.casing && <line x1="2" y1="6" x2="22" y2="6" stroke={cat.line.casing} strokeWidth="6" strokeLinecap="round" />}
        <line x1="2" y1="6" x2="22" y2="6" stroke={cat.color} strokeWidth="3" strokeLinecap="round" strokeDasharray={cat.line.dashArray} />
      </svg>
    )
  }
  return (
    <svg width="24" height="14" viewBox="0 0 24 14" aria-hidden="true">
      <rect x="1" y="1" width="22" height="12" rx="2" fill={cat.hatch ? `url(#${HATCH_ID})` : cat.color} stroke={cat.color} strokeWidth="1.5" />
    </svg>
  )
}

export default function MapModule({ visitor, firstName, active, focus, onReadStory }) {
  const { data: zones, error } = useZones()
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const groupsRef = useRef({})
  const layersRef = useRef(new Map())
  const boundsRef = useRef(null)
  const selectedRef = useRef(null)
  const [selected, setSelected] = useState(null)
  const storyMarkersRef = useRef(new Map())
  const onReadStoryRef = useRef(onReadStory)
  const [visible, setVisible] = useState(() => Object.fromEntries(FILTER_GROUPS.map(([group]) => [group, true])))

  useEffect(() => {
    onReadStoryRef.current = onReadStory
  }, [onReadStory])

  useEffect(() => {
    const container = containerRef.current
    const map = createMap(container)
    mapRef.current = map
    groupsRef.current = Object.fromEntries(FILTER_GROUPS.map(([group]) => [group, L.layerGroup()]))

    // Marcadores de las historias (datos locales: se dibujan aunque la API no responda)
    const storyMarkers = storyMarkersRef.current
    STORIES.forEach((story) => {
      const marker = L.marker(story.position, { icon: storyIcon(story), title: story.title, riseOnHover: true })
      marker.bindPopup(storyPreview(story, (id) => onReadStoryRef.current?.(id)), {
        autoPanPaddingTopLeft: [20, 56],
        autoPanPaddingBottomRight: [20, 20],
        className: 'story-popup',
        maxWidth: 260,
      })
      marker.addTo(groupsRef.current[STORY_GROUP])
      storyMarkers.set(story.id, marker)
    })

    addButton(map, {
      title: 'Ver todas las zonas',
      icon: ICONS.fit,
      onClick: () => {
        if (boundsRef.current) map.flyToBounds(boundsRef.current, { padding: [20, 20], duration: 0.6 })
      },
    })

    // Pantalla completa (no disponible en todos los navegadores, p. ej. iPhone)
    let fullscreenButton = null
    const handleFullscreen = () => {
      const isFull = document.fullscreenElement === container
      fullscreenButton?.update(
        isFull ? 'Salir de pantalla completa' : 'Pantalla completa',
        isFull ? ICONS.shrink : ICONS.expand,
      )
      setTimeout(() => map.invalidateSize(), 100)
    }
    if (container.requestFullscreen) {
      fullscreenButton = addButton(map, {
        title: 'Pantalla completa',
        icon: ICONS.expand,
        onClick: () => {
          if (document.fullscreenElement) document.exitFullscreen()
          else container.requestFullscreen().catch(() => {})
        },
      })
      document.addEventListener('fullscreenchange', handleFullscreen)
    }

    // Si cambia el tamaño de la ventana (p. ej. al proyectar), reajusta el mapa
    const handleResize = () => map.invalidateSize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('fullscreenchange', handleFullscreen)
      storyMarkers.clear()
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Desde una historia, "Ver en el mapa": muestra la capa, vuela al marcador y abre su vista previa
  useEffect(() => {
    const map = mapRef.current
    const marker = focus && storyMarkersRef.current.get(focus.storyId)
    if (!map || !marker) return undefined
    setVisible((current) => (current[STORY_GROUP] ? current : { ...current, [STORY_GROUP]: true }))
    // Espera a que el módulo vuelva a ser visible y Leaflet recalcule su tamaño
    const id = setTimeout(() => {
      map.invalidateSize()
      map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 16), { duration: 0.8 })
      map.once('moveend', () => marker.openPopup())
    }, 120)
    return () => clearTimeout(id)
  }, [focus])

  // Dibuja las zonas cuando llegan de la API
  useEffect(() => {
    const map = mapRef.current
    if (!zones || !map) return undefined
    const groups = groupsRef.current
    const layers = layersRef.current

    zones.forEach((zone) => {
      const cat = zoneType(zone.type)
      const entry = buildLayer(zone)
      const { layer } = entry
      layer.bindPopup(
        `<span class="pop-tag" style="background:${cat.color};color:${cat.ink || '#fff'}">${escapeHtml(cat.label)}</span>
         <div class="pop-title">${escapeHtml(zone.name)}</div>
         <div class="pop-rule">${escapeHtml(zone.rule)}</div>`,
        { autoPanPadding: [24, 24] },
      )
      // Nombre de la zona al pasar el mouse
      layer.bindTooltip(escapeHtml(zone.name), { sticky: zone.geometry !== 'POINT', direction: 'top', className: 'zone-tip' })
      layer.on('mouseover', () => entry.highlight(true))
      layer.on('mouseout', () => {
        if (selectedRef.current?.code !== zone.code) entry.highlight(false)
      })
      layer.on('click', () => setSelected(zone))
      // Con el popup abierto, el nombre flotante sobra y queda tapado
      layer.on('popupopen', () => layer.closeTooltip())
      layer.addTo(groups[cat.group])
      layers.set(zone.code, entry)
    })

    // Encuadra las zonas ZEPAT (o todas, si no hay), sea cual sea el tamaño del mapa
    const framed = zones.some((zone) => zone.type === 'ZEPAT') ? zones.filter((zone) => zone.type === 'ZEPAT') : zones
    const points = framed.flatMap(toLatLngs)
    if (points.length) {
      boundsRef.current = L.latLngBounds(points)
      map.fitBounds(boundsRef.current, { padding: [20, 20], animate: false })
    }

    return () => {
      Object.values(groups).forEach((group) => group.clearLayers())
      layers.clear()
    }
  }, [zones])

  // Resalta la zona elegida y quita el resalte de la anterior
  useEffect(() => {
    const previous = selectedRef.current
    selectedRef.current = selected
    const layers = layersRef.current
    if (previous) layers.get(previous.code)?.highlight(false)
    if (selected) layers.get(selected.code)?.highlight(true)
  }, [selected])

  // Filtros de capas
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    Object.entries(groupsRef.current).forEach(([group, layerGroup]) => {
      if (visible[group]) layerGroup.addTo(map)
      else map.removeLayer(layerGroup)
    })
  }, [visible])

  // Leaflet debe recalcular su tamaño al volver a ser visible
  useEffect(() => {
    if (!active) return undefined
    const id = setTimeout(() => mapRef.current?.invalidateSize(), 50)
    return () => clearTimeout(id)
  }, [active])

  const selectedCat = selected ? zoneType(selected.type) : null
  // Color representativo de cada filtro: el de su primera convención
  const groupColor = (group) =>
    group === STORY_GROUP ? STORY_COLOR : Object.values(ZONE_TYPES).find((cat) => cat.group === group).color

  return (
    <div
      className={active ? 'module' : 'module hidden'}
      id="mod-mapa"
      role="tabpanel"
      aria-labelledby="nav-mapa"
    >
      {/* Patrón de achurado de las zonas ZEPAT, usado por el mapa y la leyenda */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <defs>
          <pattern id={HATCH_ID} patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
            <rect width="7" height="7" fill="rgba(31,95,168,0.14)" />
            <line x1="0" y1="0" x2="0" y2="7" stroke="#1F5FA8" strokeWidth="1.6" />
          </pattern>
        </defs>
      </svg>

      <div className="welcome">
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2>¡Bienvenido, {firstName}!</h2>
          <p>Muestra tu código a la autoridad comunitaria si te lo solicitan.</p>
        </div>
        <div className="welcome-badge">
          <small>Código</small>
          <b>{visitor.visitorCode}</b>
        </div>
      </div>

      <article className="card" id="sec-mapa">
        <div className="card-head">
          <div className="ico ico-azul" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/></svg>
          </div>
          <div>
            <h2>Zona Especial de Pesca Ancestral (ZEPAT)</h2>
            <p>Toca una zona para ver sus normas o un marcador para leer su historia</p>
          </div>
        </div>

        <div className="map-filters" role="group" aria-label="Filtrar capas del mapa">
          {FILTER_GROUPS.map(([group, label]) => (
            <button
              key={group}
              className="chip"
              aria-pressed={visible[group]}
              onClick={() => setVisible((current) => ({ ...current, [group]: !current[group] }))}
            >
              <span className="dot" style={{ background: groupColor(group) }}></span>
              {label}
            </button>
          ))}
        </div>

        <div id="map" ref={containerRef} role="application" aria-label="Mapa interactivo de las zonas de pesca ancestral de Taganga"></div>

        <div className="legend" aria-hidden="true">
          {Object.entries(ZONE_TYPES).map(([type, cat]) => (
            <div key={type}><LegendSwatch cat={cat} />{cat.label}</div>
          ))}
          <div><span className="legend-pin" style={{ '--pin': STORY_COLOR }}></span>Historia (toca para leer)</div>
        </div>

        <ErrorMessage error={error} />

        <div
          className="site-info"
          aria-live="polite"
          style={selectedCat ? { borderLeftColor: selectedCat.color } : undefined}
        >
          {selected ? (
            <>
              <span className="tag" style={{ background: selectedCat.color, color: selectedCat.ink || '#fff' }}>{selectedCat.label}</span>
              <b>{selected.name}</b>
              {selected.description}<br />
              <strong>Norma:</strong> {selected.rule}
            </>
          ) : (
            <>
              <span className="tag" style={{ background: 'var(--azul)' }}>Info</span>
              <b>Selecciona una zona del mapa</b>
              Las zonas ZEPAT son espacios donde tradicionalmente se pesca con chinchorro. Los colores muestran qué actividades afectan esa pesca.
            </>
          )}
        </div>
        <p className="map-note">⚠ Delimitación referencial digitalizada de la cartografía ZEPAT del Cabildo Indígena de Taganga (14/10/2026). Los límites definitivos los valida el Cabildo.</p>
      </article>
    </div>
  )
}
