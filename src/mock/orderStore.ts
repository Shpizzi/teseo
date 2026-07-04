import { useSyncExternalStore } from 'react'
import { fablabOrders, type Order, type OrderStatus } from './index'

// ponytail: store in-memory a livello di modulo — niente context/redux, si azzera al reload.
// Serve solo a far sì che accetta/rifiuta abbiano effetto coerente su tutte le pagine fablab.

export type LiveStatus = OrderStatus | 'accepted'
export type LiveOrder = Omit<Order, 'status'> & { status: LiveStatus }

const overrides = new Map<string, LiveStatus | 'rejected'>()
const listeners = new Set<() => void>()

function compute(): LiveOrder[] {
  return fablabOrders
    .filter(o => overrides.get(o.id) !== 'rejected')
    .map(o => ({ ...o, status: (overrides.get(o.id) as LiveStatus | undefined) ?? o.status }))
}

let snapshot = compute()

export function setOrderStatus(id: string, status: LiveStatus | 'rejected') {
  overrides.set(id, status)
  snapshot = compute()
  listeners.forEach(l => l())
}

export function useLiveOrders(): LiveOrder[] {
  return useSyncExternalStore(
    cb => { listeners.add(cb); return () => listeners.delete(cb) },
    () => snapshot,
  )
}
