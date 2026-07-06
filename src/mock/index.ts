import { savedModels } from './user-pages'
import { printQueue } from './fablab-pages'

// ===== TYPES =====

export type ProjectStatus = 'printing' | 'ready' | 'draft' | 'error'

export type Project = {
  id: string
  name: string
  fablab: string
  material: string
  progress: number // 0-100
  status: ProjectStatus
  eta?: string
  producerId?: string // → /app/produttori/:id
  conversationId?: string // → /app/messages deep-link
  orderDate?: string
  cost?: string
}

export type KpiData = {
  value: string
  label: string
  trend?: string
  trendUp?: boolean
}

export type MaterialRating = { material: string; rating: number }

export type ProducerReview = { author: string; date: string; rating: number; text: string }

export type NearbyProducer = {
  id: string
  name: string
  distance: string
  technologies: string
  rating: number
  available: boolean
  lng: number
  lat: number
  photo: string
  gallery: string[]
  materialRatings: MaterialRating[]
  reviews: ProducerReview[]
  address: string
  hours: string
}

// ===== MOCK DATA =====

export const userProjects: Project[] = [
  {
    id: 'p1',
    name: 'Demogor, statuetta articolata',
    fablab: 'Tillverka',
    material: 'ABS rosso',
    progress: 84,
    status: 'printing',
    eta: 'ETA 2h 10m',
    producerId: 'fab1',
    conversationId: 'conv1',
    orderDate: '15 mag 2025',
    cost: '€ 24.00',
  },
  {
    id: 'p2',
    name: 'Supporto cuffie da scrivania',
    fablab: 'FabLab Milano',
    material: 'PLA',
    progress: 46,
    status: 'printing',
    eta: 'ETA 5h 40m',
    producerId: 'fab2',
    orderDate: '26 mag 2025',
    cost: '€ 11.50',
  },
  {
    id: 'p3',
    name: 'Vaso parametrico v3',
    fablab: '',
    material: '',
    progress: 8,
    status: 'draft',
    eta: 'trova produttore',
  },
  {
    id: 'p4',
    name: 'Ricambio cardine finestra',
    fablab: 'DamA Space',
    material: 'PLA',
    progress: 100,
    status: 'ready',
    eta: 'Ritiro entro ven 18:00',
    producerId: 'fab3',
    conversationId: 'conv2',
    orderDate: '22 mag 2025',
    cost: '€ 6.80',
  },
]

// Timeline di stato per il dettaglio progetto (vocabolario unico:
// Ordine inviato → Accettato → In stampa → Pronto al ritiro → Ritirato)
export function projectTimeline(p: Project): { label: string; date: string; done: boolean }[] {
  const printing = p.status === 'printing' || p.status === 'ready'
  const ready = p.status === 'ready'
  return [
    { label: 'Ordine inviato', date: p.orderDate ?? '-', done: p.status !== 'draft' },
    { label: `Accettato da ${p.fablab || 'produttore'}`, date: p.orderDate ?? '-', done: printing },
    { label: 'In stampa', date: printing ? (ready ? 'completata' : `${p.progress}%`) : '-', done: printing },
    { label: 'Pronto al ritiro', date: ready ? (p.eta ?? '-') : '-', done: ready },
    { label: 'Ritirato', date: '-', done: false },
  ]
}

const pad2 = (n: number) => String(n).padStart(2, '0')

export const userKpis: KpiData[] = [
  { value: pad2(userProjects.filter(p => p.status === 'printing' || p.status === 'ready').length), label: 'Progetti attivi' },
  { value: pad2(userProjects.filter(p => p.status === 'draft').length), label: 'In attesa di produttore' },
  { value: pad2(userProjects.filter(p => p.status === 'ready').length), label: 'Pronti al ritiro' },
  { value: pad2(savedModels.length), label: 'Modelli salvati' },
]

export const nearbyProducers: NearbyProducer[] = [
  {
    id: 'fab1',
    name: 'Tillverka',
    distance: '1.2 km',
    technologies: 'FDM, Resina',
    rating: 4.8,
    available: false,
    lng: 9.2264829,
    lat: 45.4880178,
    photo: '/landing/fablab-a.jpg',
    gallery: ['/landing/fablab-a.jpg', '/landing/fablab-b.jpg', '/landing/fablab-d.jpg'],
    materialRatings: [
      { material: 'PLA', rating: 4.9 },
      { material: 'PETG', rating: 4.8 },
      { material: 'Resina', rating: 4.6 },
    ],
    reviews: [
      { author: 'Marco T.', date: 'giu 2026', rating: 5, text: 'Manico della moka stampato in un giorno, incastro perfetto al primo colpo.' },
      { author: 'Giulia P.', date: 'mag 2026', rating: 5, text: 'Super disponibili: mi hanno aiutato a scegliere il materiale giusto.' },
      { author: 'Roberto L.', date: 'apr 2026', rating: 4, text: 'Ottima qualità, tempi un filo più lunghi del previsto.' },
    ],
    address: 'Via Andrea Maria Ampere 122, Milano',
    hours: 'Lun–Ven 9:00–19:00 · Sab 10:00–13:00',
  },
  {
    id: 'fab2',
    name: 'FabLab Milano',
    distance: '4.1 km',
    technologies: 'FDM, Laser',
    rating: 4.9,
    available: true,
    lng: 9.1736348,
    lat: 45.4884318,
    photo: '/landing/fablab-b.jpg',
    gallery: ['/landing/fablab-b.jpg', '/landing/fablab-c.jpg', '/landing/fablab-e.jpg'],
    materialRatings: [
      { material: 'PLA', rating: 5.0 },
      { material: 'ABS', rating: 4.8 },
      { material: 'Nylon', rating: 4.7 },
    ],
    reviews: [
      { author: 'Francesca R.', date: 'giu 2026', rating: 5, text: 'La statuetta è venuta identica al modello. Comunicazione perfetta in chat.' },
      { author: 'Andrea S.', date: 'giu 2026', rating: 5, text: 'Cardine della finestra: 6 euro e mezza giornata. Incredibile.' },
    ],
    address: 'Via Galileo Ferraris 1, Milano',
    hours: 'Lun–Sab 9:00–20:00',
  },
  {
    id: 'fab3',
    name: 'DamA Space',
    distance: '2.7 km',
    technologies: 'FDM, SLA, SLS',
    rating: 4.6,
    available: true,
    lng: 9.1801072,
    lat: 45.4500249,
    photo: '/landing/fablab-c.jpg',
    gallery: ['/landing/fablab-c.jpg', '/landing/fablab-d.jpg', '/landing/fablab-a.jpg'],
    materialRatings: [
      { material: 'Resina', rating: 4.9 },
      { material: 'PLA', rating: 4.5 },
      { material: 'PETG', rating: 4.4 },
    ],
    reviews: [
      { author: 'Elena V.', date: 'mag 2026', rating: 5, text: 'Ricambio in resina per un giocattolo: dettaglio pazzesco.' },
      { author: 'Davide M.', date: 'apr 2026', rating: 4, text: 'Buon lavoro, il ritiro serale è comodissimo.' },
    ],
    address: 'Corso S. Gottardo 19, Milano',
    hours: 'Mar–Dom 10:00–22:00',
  },
]

// ===== FABLAB TYPES & MOCK =====

// Order types
export type OrderStatus = 'new' | 'printing' | 'ready' | 'error'
export type DeadlineType = 'urgent' | 'today' | 'week'

export type Order = {
  id: string
  ordNum: string
  name: string
  customer: string
  material: string
  status: OrderStatus
  deadline: DeadlineType
  deadlineLabel: string
  progress?: number
}

export type FablabKpi = {
  value: string
  sublabel: string
  label: string
  trend?: string
  trendUp?: boolean
}

// Mock data
export const fablabOrders: Order[] = [
  { id: 'o1', ordNum: '52943884', name: 'Ingranaggio di ricambio', customer: 'Studio Vimar', material: 'Nylon', status: 'new', deadline: 'urgent', deadlineLabel: '⚡ ENTRO 3H' },
  { id: 'o2', ordNum: '52943880', name: 'Custodia sensore IoT (×4)', customer: 'Marco T.', material: 'PETG', status: 'new', deadline: 'week', deadlineLabel: 'entro 3 giorni' },
  { id: 'o3', ordNum: '52943876', name: 'Demogor, statuetta articolata', customer: 'Francesca R.', material: 'ABS rosso', status: 'printing', deadline: 'today', deadlineLabel: 'oggi', progress: 84 },
  { id: 'o4', ordNum: '52943879', name: 'Coperchio stagno IP67', customer: 'Idroservice', material: 'PETG', status: 'printing', deadline: 'week', deadlineLabel: 'domani', progress: 31 },
  { id: 'o5', ordNum: '52943871', name: 'Set targhette segnaletiche', customer: 'Comune di Milano', material: 'PLA', status: 'ready', deadline: 'week', deadlineLabel: 'ritiro oggi' },
  { id: 'o6', ordNum: '52943865', name: 'Prototipo impugnatura', customer: 'Lab Polimi', material: 'Resina', status: 'error', deadline: 'week', deadlineLabel: 'entro 3 giorni' },
]

// Lookup ordNum → ordine (la coda referenzia gli ordini via ordNum)
export const orderByOrdNum = (ordNum: string) => fablabOrders.find(o => o.ordNum === ordNum)

// ===== IMPATTO =====
// Stime per pezzo vs acquisto del ricambio nuovo (ricerca: −95% CO₂, −70 €)

export type ImpactRow = { name: string; date: string; co2Kg: number; euro: number }

export const userImpactRows: ImpactRow[] = [
  { name: 'Ricambio cardine finestra', date: '22 mag 2025', co2Kg: 19.5, euro: 73 },
  { name: 'Maniglia armadio cucina', date: '12 mag 2025', co2Kg: 6.2, euro: 22 },
  { name: 'Supporto smartphone bici', date: '03 apr 2025', co2Kg: 4.8, euro: 17 },
]

export type ImpactMonth = { month: string; pieces: number; co2Kg: number }

export const fablabImpactMonths: ImpactMonth[] = [
  { month: 'FEB', pieces: 198, co2Kg: 1450 },
  { month: 'MAR', pieces: 240, co2Kg: 1780 },
  { month: 'APR', pieces: 305, co2Kg: 2260 },
  { month: 'MAG', pieces: 345, co2Kg: 2610 },
]

export const fablabKpis: FablabKpi[] = [
  { value: pad2(fablabOrders.filter(o => o.status === 'printing').length), sublabel: 'attive', label: 'Stampe in corso' },
  { value: pad2(printQueue.filter(q => q.status === 'queued').length), sublabel: 'in coda', label: 'In attesa di stampa' },
  { value: pad2(fablabOrders.filter(o => o.status === 'ready').length), sublabel: 'pronti', label: 'Da consegnare' },
  { value: '345', sublabel: 'pezzi', label: 'Prodotti questo mese', trend: '+12%', trendUp: true },
]
