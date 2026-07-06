import { milanoFablabs } from './fablab-milano'

// ===== HISTORY PROJECTS =====

export type HistoryProject = {
  id: string
  name: string
  fablab: string
  material: string
  completedDate: string
  status: 'completed' | 'cancelled'
  cost: string
}

export const historyProjects: HistoryProject[] = [
  { id: 'h1', name: 'Maniglia armadio cucina', fablab: 'DamA Space', material: 'PLA', completedDate: '12 mag 2025', status: 'completed', cost: '€ 14.50' },
  { id: 'h2', name: 'Supporto smartphone bici', fablab: 'FabLab Milano', material: 'PETG', completedDate: '03 apr 2025', status: 'completed', cost: '€ 8.00' },
  { id: 'h3', name: 'Coperchio router v1', fablab: 'Tillverka', material: 'ABS', completedDate: '18 mar 2025', status: 'cancelled', cost: '-' },
]

// ===== PRODUCERS FULL =====

export type ProducerFull = {
  id: string
  name: string
  distance: string
  technologies: string[]
  rating: number
  reviews: number
  available: boolean
  city: string
  completedJobs: number
  avgTime: string
  materials: string[]
  description: string
  lng: number
  lat: number
  photo: string
  gallery: { src: string; by: string }[] // foto del lab + foto mandate dagli utenti
  materialRatings: { material: string; rating: number }[]
  reviewsList: { author: string; date: string; rating: number; text: string; photos?: string[] }[]
  address: string
  hours: string
}

export const producers: ProducerFull[] = [
  {
    id: 'fab1', name: 'Tillverka', distance: '1.2 km', technologies: ['FDM', 'Resina'], rating: 4.8, reviews: 142, available: false, city: 'Milano', completedJobs: 847, avgTime: '2-3 giorni', materials: ['PLA', 'ABS', 'PETG', 'Nylon', 'Resina'], description: 'FabLab universitario con 12 stampanti FDM e 3 SLA. Specializzato in prototipi industriali e modelli dettagliati.',
    lng: 9.2264829, lat: 45.4880178, photo: '/landing/fablab-a.jpg',
    gallery: [
      { src: '/landing/fablab-a.jpg', by: 'Tillverka' },
      { src: '/landing/fablab-b.jpg', by: 'Tillverka' },
      { src: '/landing/fablab-d.jpg', by: 'foto di Marco T.' },
      { src: '/landing/fablab-c.jpg', by: 'foto di Giulia P.' },
    ],
    materialRatings: [
      { material: 'PLA', rating: 4.9 },
      { material: 'PETG', rating: 4.8 },
      { material: 'Resina', rating: 4.6 },
      { material: 'Nylon', rating: 4.5 },
    ],
    reviewsList: [
      { author: 'Marco T.', date: 'giu 2026', rating: 5, text: 'Manico della moka stampato in un giorno, incastro perfetto al primo colpo.', photos: ['/landing/fablab-d.jpg', '/landing/fablab-c.jpg'] },
      { author: 'Giulia P.', date: 'mag 2026', rating: 5, text: 'Super disponibili: mi hanno aiutato a scegliere il materiale giusto.' },
      { author: 'Roberto L.', date: 'apr 2026', rating: 4, text: 'Ottima qualità, tempi un filo più lunghi del previsto.' },
    ],
    address: 'Via Andrea Maria Ampere 122, Milano', hours: 'Lun–Ven 9:00–19:00 · Sab 10:00–13:00',
  },
  {
    id: 'fab2', name: 'FabLab Milano', distance: '4.1 km', technologies: ['FDM', 'Laser'], rating: 4.9, reviews: 89, available: true, city: 'Milano', completedJobs: 512, avgTime: '1-2 giorni', materials: ['PLA', 'PETG', 'TPU'], description: 'Lab creativo aperto alla comunità. Stampa FDM ad alta velocità con Bambu X1.',
    lng: 9.1736348, lat: 45.4884318, photo: '/landing/fablab-b.jpg',
    gallery: [
      { src: '/landing/fablab-b.jpg', by: 'FabLab Milano' },
      { src: '/landing/fablab-c.jpg', by: 'FabLab Milano' },
      { src: '/landing/fablab-e.jpg', by: 'foto di Andrea S.' },
    ],
    materialRatings: [
      { material: 'PLA', rating: 5.0 },
      { material: 'PETG', rating: 4.8 },
      { material: 'TPU', rating: 4.7 },
    ],
    reviewsList: [
      { author: 'Francesca R.', date: 'giu 2026', rating: 5, text: 'La statuetta è venuta identica al modello. Comunicazione perfetta in chat.' },
      { author: 'Andrea S.', date: 'giu 2026', rating: 5, text: 'Cardine della finestra: 6 euro e mezza giornata. Incredibile.', photos: ['/landing/fablab-e.jpg'] },
      { author: 'Paola N.', date: 'mag 2026', rating: 5, text: 'Velocissimi, il pezzo era pronto prima dell’ETA.' },
    ],
    address: 'Via Galileo Ferraris 1, Milano', hours: 'Lun–Sab 9:00–20:00',
  },
  {
    id: 'fab3', name: 'DamA Space', distance: '2.7 km', technologies: ['FDM', 'SLA', 'SLS'], rating: 4.6, reviews: 203, available: true, city: 'Milano', completedJobs: 1230, avgTime: '3-5 giorni', materials: ['PLA', 'ABS', 'Resina', 'Nylon'], description: 'Il più grande makerspace di Milano. Offre tutte le tecnologie principali e consulenza di progettazione.',
    lng: 9.1801072, lat: 45.4500249, photo: '/landing/fablab-c.jpg',
    gallery: [
      { src: '/landing/fablab-c.jpg', by: 'DamA Space' },
      { src: '/landing/fablab-d.jpg', by: 'foto di Elena V.' },
      { src: '/landing/fablab-a.jpg', by: 'foto di Davide M.' },
    ],
    materialRatings: [
      { material: 'Resina', rating: 4.9 },
      { material: 'PLA', rating: 4.5 },
      { material: 'ABS', rating: 4.4 },
      { material: 'Nylon', rating: 4.3 },
    ],
    reviewsList: [
      { author: 'Elena V.', date: 'mag 2026', rating: 5, text: 'Ricambio in resina per un giocattolo: dettaglio pazzesco.', photos: ['/landing/fablab-a.jpg'] },
      { author: 'Davide M.', date: 'apr 2026', rating: 4, text: 'Buon lavoro, il ritiro serale è comodissimo.' },
      { author: 'Simone C.', date: 'mar 2026', rating: 4, text: 'Consulenza sul materiale molto utile, prezzi onesti.' },
    ],
    address: 'Corso S. Gottardo 19, Milano', hours: 'Mar–Dom 10:00–22:00',
  },
  {
    id: 'fab4', name: 'Polifactory', distance: '5.8 km', technologies: ['FDM', 'SLA'], rating: 4.7, reviews: 67, available: false, city: 'Milano', completedJobs: 389, avgTime: '2-4 giorni', materials: ['PLA', 'PETG', 'Resina'], description: 'Lab del Politecnico di Milano, aperto al pubblico nelle ore serali.',
    lng: 9.1663064, lat: 45.5062765, photo: '/landing/fablab-d.jpg',
    gallery: [
      { src: '/landing/fablab-d.jpg', by: 'Polifactory' },
      { src: '/landing/fablab-b.jpg', by: 'foto di Luca P.' },
    ],
    materialRatings: [
      { material: 'PLA', rating: 4.8 },
      { material: 'PETG', rating: 4.7 },
      { material: 'Resina', rating: 4.5 },
    ],
    reviewsList: [
      { author: 'Luca P.', date: 'giu 2026', rating: 5, text: 'Ruota del trolley perfetta, e ho pure imparato a usare lo slicer.' },
      { author: 'Marta B.', date: 'apr 2026', rating: 4, text: 'Solo orari serali, ma qualità da laboratorio universitario.' },
    ],
    address: 'Via Privata Simone Schiaffino 22-30, Milano', hours: 'Lun–Ven 18:00–23:00',
  },
]

// ===== NETWORK PRODUCERS (derivati dal KMZ, dati mock deterministici) =====

const YOU = { lng: 9.19, lat: 45.4685 } // posizione "Tu" sulla mappa
const kmFromYou = (lng: number, lat: number) => {
  const dx = (lng - YOU.lng) * 78.4 // km per grado di longitudine a ~45.5°N
  const dy = (lat - YOU.lat) * 111.2
  return Math.sqrt(dx * dx + dy * dy)
}

const hashOf = (s: string) => [...s].reduce((h, c) => h + c.charCodeAt(0), 0)

const TECH_POOL = [['FDM'], ['FDM', 'Resina'], ['FDM', 'SLA'], ['FDM', 'Laser'], ['Resina', 'SLA']]
const MATERIALS_BY_TECH: Record<string, string[]> = {
  FDM: ['PLA', 'PETG', 'ABS'],
  Resina: ['Resina'],
  SLA: ['Resina'],
  Laser: [],
}
const TIME_POOL = ['1-2 giorni', '2-3 giorni', '2-4 giorni', '3-5 giorni']
const HOURS_POOL = ['Lun–Ven 9:00–18:00', 'Lun–Sab 10:00–19:00', 'Lun–Ven 9:30–18:30 · Sab 10:00–13:00', 'Mar–Sab 10:00–19:00']
const PHOTO_POOL = ['/landing/fablab-a.jpg', '/landing/fablab-b.jpg', '/landing/fablab-c.jpg', '/landing/fablab-d.jpg', '/landing/fablab-e.jpg']
const REVIEW_POOL = [
  { author: 'Andrea S.', text: 'Stampa precisa e consegna nei tempi, tornerò.' },
  { author: 'Chiara R.', text: 'Molto disponibili nel consigliare il materiale giusto.' },
  { author: 'Paolo G.', text: 'Ricambio perfetto al primo tentativo, ottimo rapporto qualità/prezzo.' },
  { author: 'Sara N.', text: 'Comunicazione chiara sullo stato della stampa.' },
  { author: 'Matteo F.', text: 'Buona qualità, ritiro comodo vicino a casa.' },
]
const REVIEW_DATES = ['giu 2026', 'mag 2026', 'apr 2026', 'mar 2026']

// ponytail: profili generati deterministicamente dal nome, sostituire con dati reali quando i fablab si registrano
export const networkProducers: ProducerFull[] = milanoFablabs
  .filter(f => !producers.some(p => f.name.toLowerCase().includes(p.name.toLowerCase())))
  .map((f, i) => {
    const h = hashOf(f.name)
    const technologies = TECH_POOL[h % TECH_POOL.length]
    const materials = [...new Set(technologies.flatMap(t => MATERIALS_BY_TECH[t]))]
    const rating = Math.round((4.2 + (h % 8) / 10) * 10) / 10
    const km = kmFromYou(f.lng, f.lat)
    return {
      id: `net${i + 1}`,
      name: f.name,
      distance: `${km.toFixed(1)} km`,
      technologies,
      rating,
      reviews: 12 + (h % 130),
      available: h % 3 !== 0,
      city: f.address.split(', ').pop() ?? 'Milano',
      completedJobs: 40 + ((h * 7) % 800),
      avgTime: TIME_POOL[h % TIME_POOL.length],
      materials,
      description: `Fablab della rete TESEO in zona ${f.zone}. Stampa on-demand con ritiro in sede.`,
      lng: f.lng,
      lat: f.lat,
      photo: PHOTO_POOL[i % PHOTO_POOL.length],
      gallery: [
        { src: PHOTO_POOL[i % PHOTO_POOL.length], by: f.name },
        { src: PHOTO_POOL[(i + 2) % PHOTO_POOL.length], by: f.name },
      ],
      materialRatings: materials.map((m, j) => ({ material: m, rating: Math.round((rating - j * 0.1) * 10) / 10 })),
      reviewsList: [0, 1].map(j => {
        const r = REVIEW_POOL[(h + j * 2) % REVIEW_POOL.length]
        return {
          ...r,
          date: REVIEW_DATES[(h + j) % REVIEW_DATES.length],
          rating: 4 + ((h + j) % 2),
          photos: j === 0 && h % 2 === 0 ? [PHOTO_POOL[(i + 3) % PHOTO_POOL.length]] : undefined,
        }
      }),
      address: f.address,
      hours: HOURS_POOL[h % HOURS_POOL.length],
    }
  })
  .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))

export const allProducers: ProducerFull[] = [...producers, ...networkProducers]

// ===== SAVED MODELS =====

export type SavedModel = {
  id: string
  name: string
  category: string
  savedDate: string
  tags: string[]
}

export const savedModels: SavedModel[] = [
  { id: 'sm1', name: 'Vaso parametrico v3', category: 'Casa', savedDate: '20 mag 2025', tags: ['vaso', 'generativo', 'PLA'] },
  { id: 'sm2', name: 'Supporto monitor ergonomico', category: 'Ufficio', savedDate: '15 mag 2025', tags: ['supporto', 'ufficio', 'PETG'] },
  { id: 'sm3', name: 'Ingranaggio meccanico 32T', category: 'Meccanica', savedDate: '10 mag 2025', tags: ['ingranaggio', 'meccanica', 'Nylon'] },
  { id: 'sm4', name: 'Porta piante da parete', category: 'Casa', savedDate: '02 mag 2025', tags: ['piante', 'parete', 'PLA'] },
  { id: 'sm5', name: 'Custodia Arduino Mega', category: 'Elettronica', savedDate: '28 apr 2025', tags: ['arduino', 'custodia', 'ABS'] },
  { id: 'sm6', name: 'Bracciolo sedia gaming', category: 'Gaming', savedDate: '20 apr 2025', tags: ['sedia', 'gaming', 'TPU'] },
]

// ===== COMMUNITY MODELS =====

export type CommunityModel = {
  id: string
  name: string
  author: string
  authorInitials: string
  downloads: number
  rating: number
  version: string
  category: string
  description: string
  tags: string[]
  versions: { v: string; date: string; note: string }[]
}

export const communityModels: CommunityModel[] = [
  { id: 'cm1', name: 'Gancio modulare da parete', author: 'Marco Trentini', authorInitials: 'MT', downloads: 1842, rating: 4.9, version: '2.3', category: 'Casa', description: 'Sistema modulare di ganci componibili per qualsiasi tipo di parete. Parametrico e personalizzabile in dimensione.', tags: ['gancio', 'modulare', 'casa', 'remix'], versions: [{ v: '2.3', date: '15 mag 2025', note: 'Migliorata resistenza snodo.' }, { v: '2.1', date: '02 apr 2025', note: 'Aggiunta versione XL.' }, { v: '1.0', date: '12 gen 2025', note: 'Rilascio iniziale.' }] },
  { id: 'cm2', name: 'Portafoglio minimalista', author: 'Sara Bianchi', authorInitials: 'SB', downloads: 3210, rating: 4.7, version: '1.5', category: 'Accessori', description: 'Portafoglio sottilissimo stampabile in TPU flessibile. Massimo 8 carte.', tags: ['portafoglio', 'TPU', 'accessori'], versions: [{ v: '1.5', date: '01 giu 2025', note: 'Fix chiusura.' }, { v: '1.0', date: '10 mar 2025', note: 'Prima versione.' }] },
  { id: 'cm3', name: 'Rack bobine filamento', author: 'Giovanni Russo', authorInitials: 'GR', downloads: 924, rating: 4.8, version: '3.0', category: 'FabLab', description: 'Rack murale per 6 bobine da 1kg. Include separatori e guida filamento integrata.', tags: ['rack', 'filamento', 'fablab', 'murale'], versions: [{ v: '3.0', date: '20 mag 2025', note: 'Versione per 6 bobine.' }, { v: '2.0', date: '15 feb 2025', note: 'Versione per 4 bobine.' }, { v: '1.0', date: '10 dic 2024', note: 'Prima versione.' }] },
  { id: 'cm4', name: 'Calibratore di flusso', author: 'Alessia Moretti', authorInitials: 'AM', downloads: 562, rating: 4.6, version: '1.2', category: 'FabLab', description: 'Strumento per calibrare il flusso del filamento su stampanti FDM. Con scala graduata.', tags: ['calibrazione', 'fdm', 'strumento'], versions: [{ v: '1.2', date: '05 giu 2025', note: 'Aggiunta scala in pollici.' }, { v: '1.0', date: '01 mar 2025', note: 'Rilascio.' }] },
]

// ===== CHAT / MESSAGES =====

export type ChatConversation = {
  id: string
  fablab: string
  fablabInitials: string
  lastMessage: string
  lastTime: string
  unread: number
  projectName: string
}

export type ChatMessage = {
  id: string
  conversationId: string
  sender: 'user' | 'fablab'
  text: string
  time: string
}

export const conversations: ChatConversation[] = [
  { id: 'conv1', fablab: 'Tillverka', fablabInitials: 'FL', lastMessage: 'La stampa è in corso, ETA circa 2h.', lastTime: '10:42', unread: 1, projectName: 'Demogor, statuetta' },
  { id: 'conv2', fablab: 'DamA Space', fablabInitials: 'MN', lastMessage: 'Pronto al ritiro dalle 15:00!', lastTime: 'ieri', unread: 0, projectName: 'Ricambio cardine' },
  { id: 'conv3', fablab: 'FabLab Milano', fablabInitials: 'FB', lastMessage: 'Certo, possiamo usare PETG grigio.', lastTime: 'lun', unread: 0, projectName: 'Vaso parametrico' },
]

export const chatMessages: ChatMessage[] = [
  { id: 'm1', conversationId: 'conv1', sender: 'user', text: 'Salve, volevo sapere come procede la stampa del Demogor.', time: '09:15' },
  { id: 'm2', conversationId: 'conv1', sender: 'fablab', text: "Ciao! La stampa è partita ieri sera alle 22:00. Siamo all'84% circa, dovrebbe essere pronta per le 12:30.", time: '09:18' },
  { id: 'm3', conversationId: 'conv1', sender: 'user', text: 'Ottimo, grazie! Posso venire a ritirarla nel pomeriggio?', time: '10:30' },
  { id: 'm4', conversationId: 'conv1', sender: 'fablab', text: 'La stampa è in corso, ETA circa 2h. Puoi passare dalle 13:00 in poi.', time: '10:42' },
]
