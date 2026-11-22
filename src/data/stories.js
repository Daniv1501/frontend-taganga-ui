// Historias emblemáticas de Taganga.
// Relatos basados en la memoria oral y en el Plan de Vida del Cabildo Indígena de
// Taganga (2022). Deben validarse con el Consejo de Mayores y Mayoras antes de publicarse.
//
// `position` es la ubicación aproximada del lugar en el mapa [latitud, longitud].
// `scene` elige la ilustración de StoryArt.

export const CATEGORIES = {
  SAGRADO: { label: 'Sitio Sagrado', color: '#1E7B34', soft: '#E4F2E7', ink: '#0F4A1D' },
  ANCON: { label: 'Ancón de Pesca', color: '#0A86BF', soft: '#E1F3FB', ink: '#064E70' },
  PATRIMONIO: { label: 'Patrimonio y Memoria', color: '#D17900', soft: '#FBEFDC', ink: '#7A4600' },
  ESPIRITUAL: { label: 'Autoridades espirituales', color: '#123E73', soft: '#E3EAF4', ink: '#0B2A52' },
}

export const STORIES = [
  {
    id: 'cascada-dumbira',
    title: 'La Cascada y el Mama Dumbira',
    place: 'Parque Distrital Dumbira',
    category: 'SAGRADO',
    scene: 'cascada',
    position: [11.2628, -74.1838],
    summary: 'El sitio de pagamento donde el agua de la cascada mostraba, como en una película, lo que vendría para la Sierra.',
    body: [
      'Arriba del pueblo, donde la quebrada baja entre el bosque seco, está Dumbira: custodio del agua dulce y ojo de agua sagrado. Los mayores cuentan que allí el Cacique Dumbira se sentaba frente a la cascada y miraba el agua caer.',
      'En ese reflejo, como en una película, veía lo que iba a ocurrir en la Sierra Nevada si los pagamentos no se hacían con sinceridad. Por eso los mamos subían a ofrendar: para purificar el territorio y evitar que la naturaleza se desarmonizara.',
      'A la entrada de Dumbira está Murundúa, el árbol sagrado que abre el entendimiento. Un poema kogui dice que Taganga es una mujer: sus piernas son los cerros que entran al mar, y en la unión de ella hay un ojo de agua que se llama Dumbira.',
    ],
    teaching: 'Cuando hay bosque, el agua corre todo el año. Cuidar el monte es cuidar el agua que nos da la vida.',
    respect: 'No represes, no ensucies ni desvíes la quebrada. Recorre el sector solo por los senderos y con guía local.',
  },
  {
    id: 'viejo-cachilla',
    title: 'El Viejo de la Cachilla',
    place: 'Ancón de la Cueva',
    category: 'ESPIRITUAL',
    scene: 'tabaco',
    position: [11.2985, -74.1718],
    summary: 'Un tabaco en el hoyo soplador de las lajas: si la marea aspira el humo y el viejo se lo fuma, viene buena pesca.',
    body: [
      'En las lajas rocosas del Ancón de la Cueva hay un hoyo por donde el mar respira. Ahí vive el Viejo. Los sabedores armaban el tabaco a mano —no se compraba— y para el Viejo hacían uno especialmente grande.',
      'Enviaban a un muchacho o a un niño a colocarlo en el hoyo soplador. Si la marea aspiraba el humo, era señal de que "el viejo se lo fumó": venía una pesca abundante.',
      'Pero al Viejo no se le hablaba con ruegos, sino de manera reclamante y sentenciosa, como a un compadre que debe cumplir su parte: "¡Si no mandas pescao, no fumas más!".',
    ],
    teaching: 'La relación con el mar es de ida y vuelta: se pide, se ofrece y se exige respeto mutuo.',
    respect: 'Las lajas y el hoyo soplador son lugar de ritual. No dejes objetos ni basura, y no interrumpas a quien esté haciendo su ofrenda.',
    quote: { text: 'Si no mandas pescao, ¡no fumas más!', author: 'Fernando Vásquez, Vigía del Mar del Cabildo' },
  },
  {
    id: 'pago-gallinazo',
    title: 'El Pago al Gallinazo',
    place: 'Ancón de la Cueva',
    category: 'ANCON',
    scene: 'ave',
    position: [11.2962, -74.1690],
    summary: 'El pescado más grande de la primera faena es para el gallinazo: reciprocidad con la naturaleza para que el mar siga dando.',
    body: [
      'Cuando la primera faena de la temporada llegaba a la orilla, los pescadores no se quedaban con lo mejor. El pescado más grande era para el gallinazo, el ave que vigila la playa desde las piedras.',
      'Los bogas arrancaban bocados a remo hacia la mar y luego le daban de comer al gallinazo. No era un gesto de lástima sino un pago: quien recibe del mar devuelve una parte para que la abundancia continúe.',
      'Esta costumbre convive con otras formas de reciprocidad de la pesca con chinchorro, como la "parte del Santo" que se reserva del producido de cada faena.',
    ],
    teaching: 'La abundancia se sostiene compartiendo. Lo que se toma sin devolver, se acaba.',
    respect: 'No alimentes ni espantes a las aves de los ancones. Si ves una faena en la orilla, observa desde lejos sin estorbar.',
  },
  {
    id: 'virgen-rosario',
    title: 'El Milagro de la Virgen del Rosario',
    place: 'Iglesia San Francisco de Asís',
    category: 'ESPIRITUAL',
    scene: 'virgen',
    position: [11.2669, -74.1887],
    summary: 'Un cuadro para Gaira y un busto para Taganga que aparecieron intercambiados dos veces, hasta quedarse donde cada uno eligió.',
    body: [
      'Cuentan que la Reina de España envió dos imágenes de la Virgen del Rosario a esta costa: un cuadro para Gaira y un busto para Taganga.',
      'Pero al amanecer las imágenes aparecieron cambiadas: el busto estaba en Gaira y el cuadro en Taganga. Las devolvieron a su lugar, y otra vez amanecieron intercambiadas.',
      'Después de la segunda vez, el pueblo entendió que no era un error de los mensajeros: cada imagen había escogido su casa. Desde entonces la Virgen del Rosario acompaña a Taganga y sus fiestas.',
    ],
    teaching: 'Los lugares también eligen a quién acompañar. La devoción del pueblo se construye con lo que la comunidad reconoce como suyo.',
    respect: 'Visita la iglesia en silencio y con ropa adecuada. No interrumpas misas, novenarios ni procesiones.',
  },
  {
    id: 'cofradia-terremoto',
    title: 'La Cofradía del Terremoto de 1834',
    place: 'Bonito Gordo',
    category: 'PATRIMONIO',
    scene: 'red',
    position: [11.2935, -74.1658],
    summary: 'Tras el sismo que derrumbó la iglesia, los jefes de cuadrilla crearon una cofradía de pesca que dio origen a los chinchorreros.',
    body: [
      'El 22 de mayo de 1834 un terremoto sacudió la costa y derrumbó la iglesia de Taganga. El pueblo, pobre en ese entonces, no tenía cómo levantarla.',
      'Los jefes de cuadrilla se organizaron en una cofradía en honor a Nuestra Señora del Rosario y establecieron pesquerías con chinchorro en la ensenada de Bonito Gordo. Lo que se pescaba ayudaba a sostener el culto y a reconstruir el templo.',
      'De esa cofradía nació la primera organización de pescadores artesanales —hoy la Corporación de Chinchorreros de Taganga— y la costumbre de turnos rotativos en los ancones, que todavía ordena quién tiende la red y cuándo.',
    ],
    teaching: 'La organización colectiva convierte una tragedia en un bien común que dura generaciones.',
    respect: 'Los ancones tienen turnos y dueños colectivos. No ancles, nades ni bucees donde hay un chinchorro tendido.',
  },
  {
    id: 'trueque-pebos',
    title: 'El Trueque de Carite y Hayo con los "Pebos"',
    place: 'Patios del centro histórico',
    category: 'PATRIMONIO',
    scene: 'trueque',
    position: [11.2652, -74.1866],
    summary: 'Los kogui bajaban de la Sierra con hayo y jengibre; los tagangueros colgaban sartas de carite en las cercas para intercambiar.',
    body: [
      'En Taganga y en Santa Marta a los kogui se les llamaba "pebos", palabra que en su lengua significa amigo. Así lo registró el antropólogo Reichel-Dolmatoff a mediados del siglo XX.',
      'Los hermanos de la Sierra bajaban por los caminos con hoja de coca (hayo) y jengibre. Los tagangueros, que conocían su llegada, colgaban sartas de carite seco en las cercas de sus patios.',
      'Sin necesidad de dinero, el trueque unía el mar con la montaña. Esa hermandad entre el litoral y la Sierra sigue viva: Taganga también es territorio ancestral para los cuatro pueblos de la Sierra Nevada.',
    ],
    teaching: 'La Sierra y el mar se necesitan. Lo que da uno lo completa el otro.',
    respect: 'Si encuentras a hermanos indígenas de la Sierra, salúdalos con respeto y no les tomes fotos sin su permiso.',
  },
  {
    id: 'isla-aguja',
    title: 'Isla de la Aguja y los Tres Ancones',
    place: 'Isla de la Aguja',
    category: 'ANCON',
    scene: 'isla',
    position: [11.3150, -74.1958],
    summary: 'El Joyito, Playa del Medio y La Última: sitio sagrado marino y escenario de la pesca colectiva con chinchorro.',
    body: [
      'Para los pueblos de la Sierra, la Isla de la Aguja es Ñiulalue: el lugar donde el Padre Sezhankua delimitó hasta dónde llegaría el mar y dejó un nacedero de agua dulce como frontera entre mar y tierra. Es parte de la Línea Negra y los mamos vienen a hacer pagamento.',
      'Para los pescadores tagangueros, sus tres ancones —El Joyito, Playa del Medio y La Última— fueron escenario de la pesca colectiva. Calaneros, jaladores, "caballos" que llegaban tarde y niños unían sus manos al grito del vigía: ¡Jalaa!',
      'El reparto era solidario: el 30 % del pescado era para la red, y el resto se repartía entre todos. El calanero recibía el doble que un jalador, el jalador el doble que un caballo, y los niños la mitad de un jalador. También se apartaban la parte del Santo y la Mortuoria.',
    ],
    teaching: 'Nadie se queda sin su parte: quien ayuda a jalar, come.',
    respect: 'Es una Zona Especial de Pesca Ancestral (ZEPAT). Consulta el mapa: hay áreas donde no se permite bucear.',
  },
  {
    id: 'cerro-biyuca',
    title: 'El Cerro Biyuca, Guardián de las Tempestades',
    place: 'Cerro Biyuca',
    category: 'SAGRADO',
    scene: 'cerro',
    position: [11.2735, -74.1860],
    summary: 'La montaña tutelar que, según los mayores, anuncia la llegada de las tormentas y protege el territorio.',
    body: [
      'Biyuca es una de las autoridades ancestrales de Taganga. Los mayores aprendieron a leer el cerro: cuando las nubes se juntan sobre él y el viento cambia, se acercan las lluvias y las tempestades.',
      'Esas tormentas limpian la atmósfera, llenan de oxígeno el aire y recargan las quebradas. Por eso Biyuca no es solo un aviso, sino un guardián que mantiene el equilibrio.',
      'Hoy su memoria también nos interpela: ¿qué deuda pagamos por tumbar el bosque, tapar las quebradas y vender la tierra por lotes? Los vientos que bajan del cerro traen esa pregunta.',
    ],
    teaching: 'El territorio habla. Quien sabe escucharlo, se anticipa y se protege.',
    respect: 'No abras caminos nuevos, no hagas fogatas ni extraigas plantas o piedras de los cerros.',
  },
  {
    id: 'titulos-1873',
    title: 'Los Títulos de San Antonio de Bonito Gordo y Arrecifes',
    place: 'Sector Bonito Gordo',
    category: 'PATRIMONIO',
    scene: 'pergamino',
    position: [11.2958, -74.1645],
    summary: 'La Real Cédula perdida y la Escritura N.° 27 de 1873 que protocolizó las tierras y aguas ancestrales de Taganga.',
    body: [
      'La memoria de los mayores habla de una Real Cédula, hoy perdida, que reconocía a los indios de Taganga sus tierras y aguas por haber abastecido a Santa Marta de pescado y de la cal con la que se construyó la ciudad —sacada a pulmón de los corales— y por su apoyo en la Independencia.',
      'En 1873, reunidos como Junta de Padres de Familia, los tagangueros dieron poder a Román Manigua para protocolizar sus títulos: el 26 de enero los ejidos de Arrecifes y Cañaveral (Escritura N.° 14) y el 12 de marzo los terrenos de San Antonio de Bonito Gordo (Escritura N.° 27).',
      'Esos papeles han sido el ancla de más de un siglo de defensa del territorio, y su lectura se renueva cada año en el día de San Antonio de Padua.',
    ],
    teaching: 'La memoria escrita y la memoria oral se cuidan juntas: una sostiene a la otra.',
    respect: 'Bonito Gordo es territorio comunal étnico. No compres ni arriendes lotes sin consultar al Cabildo.',
  },
  {
    id: 'minga-colegio',
    title: 'La Minga de Piedra y Ladrillo',
    place: 'Colegio de Taganga y Dumaruka',
    category: 'PATRIMONIO',
    scene: 'ladrillo',
    position: [11.2650, -74.1897],
    summary: 'Todo el pueblo recolectó piedra de cerro, hizo marchas de ladrillos y cocinó en comunidad para levantar su colegio.',
    body: [
      'Durante años los jóvenes tagangueros tenían que ir a estudiar a Santa Marta, primero a pie por la cuesta de los cerros y luego por la carretera. Tener colegio propio era un sueño de todos.',
      'Cuando llegó la hora de construirlo, el pueblo hizo minga: unos subían a recoger piedra de cerro, otros organizaban marchas de ladrillos de mano en mano, y las mujeres cocinaban en comunidad para quienes trabajaban.',
      'Esa misma fuerza defendió a Dumaruka, el guardián del mar, y los espacios que miran a la bahía. El colegio, creado en 1985, sigue en el centro del sueño de una educación propia para Taganga.',
    ],
    teaching: 'Lo que se construye entre todos, todos lo defienden.',
    respect: 'Respeta los espacios escolares y comunitarios: no son atracciones turísticas.',
  },
]

export function findStory(id) {
  return STORIES.find((story) => story.id === id) ?? null
}
