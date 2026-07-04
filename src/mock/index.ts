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

export type NearbyProducer = {
  id: string
  name: string
  distance: string
  technologies: string
  rating: number
  available: boolean
}

// ===== MOCK DATA =====

export const userProjects: Project[] = [
  {
    id: 'p1',
    name: 'Demogor — statuetta articolata',
    fablab: 'FabLab Lambrate',
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
    fablab: 'FabLab Bovisa',
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
    fablab: 'MakerSpace Navigli',
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
    { label: 'Ordine inviato', date: p.orderDate ?? '—', done: p.status !== 'draft' },
    { label: `Accettato da ${p.fablab || 'produttore'}`, date: p.orderDate ?? '—', done: printing },
    { label: 'In stampa', date: printing ? (ready ? 'completata' : `${p.progress}%`) : '—', done: printing },
    { label: 'Pronto al ritiro', date: ready ? (p.eta ?? '—') : '—', done: ready },
    { label: 'Ritirato', date: '—', done: false },
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
    name: 'FabLab Lambrate',
    distance: '1.2 km',
    technologies: 'FDM, Resina',
    rating: 4.8,
    available: false,
  },
  {
    id: 'fab2',
    name: 'FabLab Bovisa',
    distance: '4.1 km',
    technologies: 'FDM, Laser',
    rating: 4.9,
    available: true,
  },
  {
    id: 'fab3',
    name: 'MakerSpace Navigli',
    distance: '2.7 km',
    technologies: 'FDM, SLA, SLS',
    rating: 4.6,
    available: true,
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

export type Printer = {
  id: string
  name: string
  status: 'active' | 'idle' | 'error'
  material?: string
  orderId?: string
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
  { id: 'o3', ordNum: '52943876', name: 'Demogor — statuetta articolata', customer: 'Francesca R.', material: 'ABS rosso', status: 'printing', deadline: 'today', deadlineLabel: 'oggi', progress: 84 },
  { id: 'o4', ordNum: '52943879', name: 'Coperchio stagno IP67', customer: 'Idroservice', material: 'PETG', status: 'printing', deadline: 'week', deadlineLabel: 'domani', progress: 31 },
  { id: 'o5', ordNum: '52943871', name: 'Set targhette segnaletiche', customer: 'Comune di Milano', material: 'PLA', status: 'ready', deadline: 'week', deadlineLabel: 'ritiro oggi' },
  { id: 'o6', ordNum: '52943865', name: 'Prototipo impugnatura', customer: 'Lab Polimi', material: 'Resina', status: 'error', deadline: 'week', deadlineLabel: 'entro 3 giorni' },
]

// Lookup ordNum → ordine (la coda referenzia gli ordini via ordNum)
export const orderByOrdNum = (ordNum: string) => fablabOrders.find(o => o.ordNum === ordNum)

export const fablabPrinters: Printer[] = [
  { id: 'pr1', name: 'Bambu X1 · 01', status: 'active', material: 'Red ABS', orderId: '52943876', progress: 84 },
  { id: 'pr2', name: 'Prusa MK4 · 02', status: 'active', material: 'PETG', orderId: '52943879', progress: 31 },
  { id: 'pr3', name: 'Formlabs · 03', status: 'idle' },
  { id: 'pr4', name: 'Ender CNC · 04', status: 'error' },
]

export const fablabKpis: FablabKpi[] = [
  { value: pad2(fablabOrders.filter(o => o.status === 'printing').length), sublabel: 'attive', label: 'Stampe in corso' },
  { value: pad2(printQueue.filter(q => q.status === 'queued').length), sublabel: 'in coda', label: 'In attesa di stampa' },
  { value: pad2(fablabOrders.filter(o => o.status === 'ready').length), sublabel: 'pronti', label: 'Da consegnare' },
  { value: '345', sublabel: 'pezzi', label: 'Prodotti questo mese', trend: '+12%', trendUp: true },
]
