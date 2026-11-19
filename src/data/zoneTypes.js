// Cómo se ve cada tipo de zona (ZoneType del backend) según las convenciones de la
// cartografía ZEPAT del Cabildo Indígena de Taganga. Las zonas, sus coordenadas
// y sus normas vienen de la API (/api/zones).
//
// `group` agrupa los filtros del mapa; `ink` es el color de texto sobre colores claros.

export const ZONE_TYPES = {
  ZEPAT: { label: 'ZEPAT', group: 'ZEPAT', color: '#1F5FA8', hatch: true },
  DIVING_IMPACT: { label: 'Buceo con afectación', group: 'BUCEO', color: '#F5A300' },
  DIVING_AGREED: { label: 'Buceo concertado', group: 'BUCEO', color: '#2FA51E' },
  NO_DIVING: { label: 'No buceo', group: 'BUCEO', color: '#A8710A' },
  SNORKEL: { label: 'Snorkel', group: 'SNORKEL', color: '#E01CF0' },
  SNORKEL_IMPACT: { label: 'Snorkel con afectación', group: 'SNORKEL', color: '#8E12B8' },
  SNORKEL_NO_IMPACT: { label: 'Snorkel sin afectación', group: 'SNORKEL', color: '#4A0C78' },
  BOAT_IMPACT: { label: 'Embarcaciones con afectación', group: 'USO', color: '#E3000F' },
  TOURISM_IMPACT: { label: 'Turismo con afectación', group: 'USO', color: '#FFD600', ink: '#3A3000' },
  BANANA_BOAT: { label: 'Gusano', group: 'RECORRIDOS', color: '#D84BE0', line: { weight: 4, casing: '#7A1F86' } },
  KAYAK: { label: 'Kayak', group: 'RECORRIDOS', color: '#3B78DB', line: { weight: 4, casing: '#173A73' } },
  JET_SKI: { label: 'Moto acuática', group: 'RECORRIDOS', color: '#D32F2F', line: { weight: 2.5, dashArray: '3 6' } },
  TOURIST_TRANSPORT: { label: 'Transporte turístico', group: 'RECORRIDOS', color: '#4FD8DE', ink: '#0B3A40', line: { weight: 4, dashArray: '10 8', casing: '#1D4E57' } },
}

// Estilo de respaldo si el backend devuelve un tipo que esta versión no conoce
export const UNKNOWN_TYPE = { label: 'Zona', group: 'ZEPAT', color: '#555555' }

export const GROUPS = [
  ['ZEPAT', 'Zonas ZEPAT'],
  ['BUCEO', 'Buceo'],
  ['SNORKEL', 'Snorkel'],
  ['USO', 'Embarcaciones y turismo'],
  ['RECORRIDOS', 'Recorridos'],
]

export function zoneType(type) {
  return ZONE_TYPES[type] ?? UNKNOWN_TYPE
}
