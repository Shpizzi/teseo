import type { Order } from './index'

// OrderDetail: Omit customer (string in base) and override with object
export type OrderDetail = Omit<Order, 'customer'> & {
  fileSize: string
  dimensions: string // "120 × 85 × 60 mm"
  infill: number // %
  layerHeight: string // "0.2 mm"
  supports: boolean
  estimatedTime: string // "4h 30m"
  estimatedCost: string
  notes: string
  customer: { name: string; email: string; phone: string; initials: string }
  timeline: { label: string; date: string; done: boolean }[]
}

// Timeline con vocabolario unico: Ordine ricevuto → Accettato → In stampa → Pronto → Ritirato
export const orderDetails: OrderDetail[] = [
  {
    id: 'o1', ordNum: '52943884', name: 'Ingranaggio di ricambio',
    customer: { name: 'Studio Vimar', email: 'info@studiovimar.it', phone: '+39 02 8734 1290', initials: 'SV' },
    material: 'Nylon', status: 'new', deadline: 'urgent', deadlineLabel: '⚡ ENTRO 3H',
    fileSize: '2.4 MB', dimensions: '45 × 45 × 20 mm', infill: 60, layerHeight: '0.15 mm',
    supports: true, estimatedTime: '1h 45m', estimatedCost: '€ 9.50',
    notes: 'Urgente per fermo macchina in produzione. Tolleranza ±0.1mm richiesta.',
    timeline: [
      { label: 'Ordine ricevuto', date: '28 mag 12:14', done: true },
      { label: 'Accettato', date: '—', done: false },
      { label: 'In stampa', date: '—', done: false },
      { label: 'Pronto', date: '—', done: false },
      { label: 'Ritirato', date: '—', done: false },
    ]
  },
  {
    id: 'o2', ordNum: '52943880', name: 'Custodia sensore IoT (×4)',
    customer: { name: 'Marco T.', email: 'marco.t@outlook.it', phone: '+39 348 5567 210', initials: 'MT' },
    material: 'PETG', status: 'new', deadline: 'week', deadlineLabel: 'entro 3 giorni',
    fileSize: '5.1 MB', dimensions: '80 × 55 × 30 mm', infill: 35, layerHeight: '0.2 mm',
    supports: false, estimatedTime: '3h 15m', estimatedCost: '€ 16.00',
    notes: 'Quattro copie identiche. Colore indifferente, purché opaco.',
    timeline: [
      { label: 'Ordine ricevuto', date: '28 mag 09:30', done: true },
      { label: 'Accettato', date: '—', done: false },
      { label: 'In stampa', date: '—', done: false },
      { label: 'Pronto', date: '—', done: false },
      { label: 'Ritirato', date: '—', done: false },
    ]
  },
  {
    id: 'o3', ordNum: '52943876', name: 'Demogor — statuetta articolata',
    customer: { name: 'Francesca R.', email: 'francesca.r@gmail.com', phone: '+39 340 1234567', initials: 'FR' },
    material: 'ABS rosso', status: 'printing', deadline: 'today', deadlineLabel: 'oggi',
    fileSize: '18.7 MB', dimensions: '120 × 85 × 160 mm', infill: 20, layerHeight: '0.2 mm',
    supports: false, estimatedTime: '12h 10m', estimatedCost: '€ 24.00',
    notes: '',
    timeline: [
      { label: 'Ordine ricevuto', date: '15 mag 09:00', done: true },
      { label: 'Accettato', date: '15 mag 09:45', done: true },
      { label: 'In stampa', date: '15 mag 22:00', done: true },
      { label: 'Pronto', date: '—', done: false },
      { label: 'Ritirato', date: '—', done: false },
    ]
  },
  {
    id: 'o4', ordNum: '52943879', name: 'Coperchio stagno IP67',
    customer: { name: 'Idroservice', email: 'ordini@idroservice.it', phone: '+39 02 4471 8890', initials: 'ID' },
    material: 'PETG', status: 'printing', deadline: 'week', deadlineLabel: 'domani',
    fileSize: '7.9 MB', dimensions: '140 × 140 × 25 mm', infill: 45, layerHeight: '0.16 mm',
    supports: true, estimatedTime: '9h 05m', estimatedCost: '€ 21.00',
    notes: 'Guarnizione non inclusa: serve solo il coperchio.',
    timeline: [
      { label: 'Ordine ricevuto', date: '26 mag 15:20', done: true },
      { label: 'Accettato', date: '26 mag 16:00', done: true },
      { label: 'In stampa', date: '27 mag 08:15', done: true },
      { label: 'Pronto', date: '—', done: false },
      { label: 'Ritirato', date: '—', done: false },
    ]
  },
  {
    id: 'o5', ordNum: '52943871', name: 'Set targhette segnaletiche',
    customer: { name: 'Comune di Milano', email: 'acquisti@comune.milano.it', phone: '+39 02 0202', initials: 'CM' },
    material: 'PLA', status: 'ready', deadline: 'week', deadlineLabel: 'ritiro oggi',
    fileSize: '3.2 MB', dimensions: '200 × 60 × 4 mm', infill: 100, layerHeight: '0.2 mm',
    supports: false, estimatedTime: '45m', estimatedCost: '€ 12.00',
    notes: '',
    timeline: [
      { label: 'Ordine ricevuto', date: '24 mag 10:00', done: true },
      { label: 'Accettato', date: '24 mag 11:30', done: true },
      { label: 'In stampa', date: '25 mag 09:00', done: true },
      { label: 'Pronto', date: '27 mag 17:40', done: true },
      { label: 'Ritirato', date: '—', done: false },
    ]
  },
  {
    id: 'o6', ordNum: '52943865', name: 'Prototipo impugnatura',
    customer: { name: 'Lab Polimi', email: 'lab.proto@polimi.it', phone: '+39 02 2399 1234', initials: 'LP' },
    material: 'Resina', status: 'error', deadline: 'week', deadlineLabel: 'entro 3 giorni',
    fileSize: '11.4 MB', dimensions: '110 × 40 × 35 mm', infill: 100, layerHeight: '0.05 mm',
    supports: true, estimatedTime: '6h 30m', estimatedCost: '€ 28.00',
    notes: 'Resina esaurita a metà stampa: serve ricarica e riavvio del job.',
    timeline: [
      { label: 'Ordine ricevuto', date: '22 mag 14:10', done: true },
      { label: 'Accettato', date: '22 mag 15:00', done: true },
      { label: 'In stampa', date: '23 mag 07:30', done: true },
      { label: 'Pronto', date: '—', done: false },
      { label: 'Ritirato', date: '—', done: false },
    ]
  },
]

// Coda di stampa
export type QueueItem = {
  id: string; ordNum: string; name: string; material: string
  estimatedTime: string; position: number; printerId?: string
  progress?: number; status: 'printing' | 'queued' | 'paused'
}

export const printQueue: QueueItem[] = [
  { id: 'q1', ordNum: '52943876', name: 'Demogor — statuetta articolata', material: 'ABS rosso', estimatedTime: '2h 10m rimanenti', position: 0, printerId: 'Bambu X1 · 01', progress: 84, status: 'printing' },
  { id: 'q2', ordNum: '52943879', name: 'Coperchio stagno IP67', material: 'PETG', estimatedTime: '6h 20m rimanenti', position: 1, printerId: 'Prusa MK4 · 02', progress: 31, status: 'printing' },
  { id: 'q3', ordNum: '52943884', name: 'Ingranaggio di ricambio', material: 'Nylon', estimatedTime: '1h 45m', position: 2, status: 'queued' },
  { id: 'q4', ordNum: '52943880', name: 'Custodia sensore IoT (×4)', material: 'PETG', estimatedTime: '3h 15m', position: 3, status: 'queued' },
  { id: 'q5', ordNum: '52943871', name: 'Set targhette segnaletiche', material: 'PLA', estimatedTime: '45m', position: 4, status: 'queued' },
]

// Stampanti estese
export type PrinterFull = {
  id: string; name: string; model: string; type: 'FDM' | 'SLA' | 'SLS'
  status: 'active' | 'idle' | 'error' | 'maintenance'
  material?: string; orderId?: string; progress?: number
  totalJobs: number; uptimePercent: number; lastMaintenance: string
  errorMessage?: string
}

export const printersFull: PrinterFull[] = [
  { id: 'pr1', name: 'Bambu X1 · 01', model: 'Bambu Lab X1 Carbon', type: 'FDM', status: 'active', material: 'Red ABS', orderId: '52943876', progress: 84, totalJobs: 234, uptimePercent: 97, lastMaintenance: '10 mag 2025' },
  { id: 'pr2', name: 'Prusa MK4 · 02', model: 'Prusa MK4', type: 'FDM', status: 'active', material: 'PETG', orderId: '52943879', progress: 31, totalJobs: 189, uptimePercent: 94, lastMaintenance: '20 apr 2025' },
  { id: 'pr3', name: 'Formlabs 3 · 03', model: 'Formlabs Form 3', type: 'SLA', status: 'idle', totalJobs: 98, uptimePercent: 91, lastMaintenance: '01 mag 2025' },
  { id: 'pr4', name: 'Ender CNC · 04', model: 'Creality Ender 3 V3', type: 'FDM', status: 'error', errorMessage: 'Bobina esaurita — sostituire filamento', totalJobs: 312, uptimePercent: 88, lastMaintenance: '05 mag 2025' },
  { id: 'pr5', name: 'Bambu X1 · 05', model: 'Bambu Lab X1 Carbon', type: 'FDM', status: 'maintenance', totalJobs: 156, uptimePercent: 95, lastMaintenance: 'oggi' },
  { id: 'pr6', name: 'Anycubic · 06', model: 'Anycubic Photon M5', type: 'SLA', status: 'idle', totalJobs: 67, uptimePercent: 89, lastMaintenance: '15 apr 2025' },
]
