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
  { id: 'h1', name: 'Ricambio cardine finestra', fablab: 'MakerSpace Navigli', material: 'PLA', completedDate: '12 mag 2025', status: 'completed', cost: '€ 14.50' },
  { id: 'h2', name: 'Supporto smartphone bici', fablab: 'FabLab Bovisa', material: 'PETG', completedDate: '03 apr 2025', status: 'completed', cost: '€ 8.00' },
  { id: 'h3', name: 'Coperchio router v1', fablab: 'FabLab Lambrate', material: 'ABS', completedDate: '18 mar 2025', status: 'cancelled', cost: '—' },
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
}

export const producers: ProducerFull[] = [
  { id: 'fab1', name: 'FabLab Lambrate', distance: '1.2 km', technologies: ['FDM', 'Resina'], rating: 4.8, reviews: 142, available: false, city: 'Milano', completedJobs: 847, avgTime: '2-3 giorni', materials: ['PLA', 'ABS', 'PETG', 'Nylon', 'Resina'], description: 'FabLab universitario con 12 stampanti FDM e 3 SLA. Specializzato in prototipi industriali e modelli dettagliati.' },
  { id: 'fab2', name: 'FabLab Bovisa', distance: '4.1 km', technologies: ['FDM', 'Laser'], rating: 4.9, reviews: 89, available: true, city: 'Milano', completedJobs: 512, avgTime: '1-2 giorni', materials: ['PLA', 'PETG', 'TPU'], description: 'Lab creativo aperto alla comunità. Stampa FDM ad alta velocità con Bambu X1.' },
  { id: 'fab3', name: 'MakerSpace Navigli', distance: '2.7 km', technologies: ['FDM', 'SLA', 'SLS'], rating: 4.6, reviews: 203, available: true, city: 'Milano', completedJobs: 1230, avgTime: '3-5 giorni', materials: ['PLA', 'ABS', 'Resina', 'Nylon'], description: 'Il più grande makerspace di Milano. Offre tutte le tecnologie principali e consulenza di progettazione.' },
  { id: 'fab4', name: 'Politecnico FabLab', distance: '5.8 km', technologies: ['FDM', 'SLA'], rating: 4.7, reviews: 67, available: false, city: 'Milano', completedJobs: 389, avgTime: '2-4 giorni', materials: ['PLA', 'PETG', 'Resina'], description: 'Lab del Politecnico di Milano, aperto al pubblico nelle ore serali.' },
]

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
  { id: 'conv1', fablab: 'FabLab Lambrate', fablabInitials: 'FL', lastMessage: 'La stampa è in corso, ETA circa 2h.', lastTime: '10:42', unread: 1, projectName: 'Demogor — statuetta' },
  { id: 'conv2', fablab: 'MakerSpace Navigli', fablabInitials: 'MN', lastMessage: 'Pronto al ritiro dalle 15:00!', lastTime: 'ieri', unread: 0, projectName: 'Ricambio cardine' },
  { id: 'conv3', fablab: 'FabLab Bovisa', fablabInitials: 'FB', lastMessage: 'Certo, possiamo usare PETG grigio.', lastTime: 'lun', unread: 0, projectName: 'Vaso parametrico' },
]

export const chatMessages: ChatMessage[] = [
  { id: 'm1', conversationId: 'conv1', sender: 'user', text: 'Salve, volevo sapere come procede la stampa del Demogor.', time: '09:15' },
  { id: 'm2', conversationId: 'conv1', sender: 'fablab', text: "Ciao! La stampa è partita ieri sera alle 22:00. Siamo all'84% circa, dovrebbe essere pronta per le 12:30.", time: '09:18' },
  { id: 'm3', conversationId: 'conv1', sender: 'user', text: 'Ottimo, grazie! Posso venire a ritirarla nel pomeriggio?', time: '10:30' },
  { id: 'm4', conversationId: 'conv1', sender: 'fablab', text: 'La stampa è in corso, ETA circa 2h. Puoi passare dalle 13:00 in poi.', time: '10:42' },
]
