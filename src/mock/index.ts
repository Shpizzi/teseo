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
  },
  {
    id: 'p2',
    name: 'Supporto cuffie da scrivania',
    fablab: 'FabLab Bovisa',
    material: 'PLA',
    progress: 46,
    status: 'printing',
    eta: 'ETA 5h 40m',
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
]

export const userKpis: KpiData[] = [
  { value: '03', label: 'Progetti attivi', trend: '+2', trendUp: true },
  { value: '01', label: 'In attesa di produttore' },
  { value: '01', label: 'Pronti al ritiro', trend: 'NEW', trendUp: true },
  { value: '128', label: 'Modelli salvati' },
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
  { id: 'o5', ordNum: '52943871', name: 'Set targhette segnaletiche', customer: 'Comune di Milano', material: 'PLA', status: 'ready', deadline: 'week', deadlineLabel: 'pronto' },
  { id: 'o6', ordNum: '52943865', name: 'Prototipo impugnatura', customer: 'Lab Polimi', material: 'Resina', status: 'error', deadline: 'week', deadlineLabel: 'errore materiale' },
]

export const fablabPrinters: Printer[] = [
  { id: 'pr1', name: 'Bambu X1 · 01', status: 'active', material: 'Red ABS', orderId: '52943876', progress: 84 },
  { id: 'pr2', name: 'Prusa MK4 · 02', status: 'active', material: 'PETG', orderId: '52943879', progress: 31 },
  { id: 'pr3', name: 'Formlabs · 03', status: 'idle' },
  { id: 'pr4', name: 'Ender CNC · 04', status: 'error' },
]

export const fablabKpis: FablabKpi[] = [
  { value: '05', sublabel: 'attivi', label: 'Ordini in stampa', trend: '+3', trendUp: true },
  { value: '08', sublabel: 'in coda', label: 'In attesa di slicing' },
  { value: '02', sublabel: 'pronti', label: 'Da consegnare' },
  { value: '345', sublabel: '', label: 'Throughput mensile', trend: '+12%', trendUp: true },
]
