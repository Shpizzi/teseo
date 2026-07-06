import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, Check, LayoutGrid, List } from 'lucide-react'
import SearchBar from '../../components/SearchBar'
import GlassCard from '../../components/GlassCard'
import { type DeadlineType } from '../../mock'
import { useLiveOrders, setOrderStatus, type LiveStatus, type LiveOrder } from '../../mock/orderStore'
import { toast } from '../../components/Toast'

// ── DeadlineChip ──────────────────────────────────────────────
function DeadlineChip({ type, label }: { type: DeadlineType; label: string }) {
  const cls = type === 'urgent' ? 'dl-urgent' : type === 'today' ? 'dl-today' : 'dl-week'
  return (
    <span
      className={cls}
      style={{
        fontFamily: 'var(--mono)',
        fontSize: 10,
        padding: '3px 8px',
        borderRadius: 5,
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}

// ── Tab definitions ───────────────────────────────────────────
type TabKey = 'new' | 'printing' | 'ready' | 'error' | 'all'

const TABS: { key: TabKey; label: string; statuses?: LiveStatus[] }[] = [
  { key: 'new',      label: 'Nuovi',          statuses: ['new'] },
  { key: 'printing', label: 'In lavorazione', statuses: ['accepted', 'printing'] },
  { key: 'ready',    label: 'Pronti',         statuses: ['ready'] },
  { key: 'error',    label: 'Errori',         statuses: ['error'] },
  { key: 'all',      label: 'Tutti' },
]

// ── Inline status pill for order statuses ─────────────────────
export function OrderStatusPill({ status }: { status: LiveStatus }) {
  if (status === 'new')      return <span className="status-pill sp-new">Nuovo</span>
  if (status === 'accepted') return <span className="status-pill sp-print">Accettato</span>
  if (status === 'printing') return <span className="status-pill sp-print">In stampa</span>
  if (status === 'ready')    return <span className="status-pill sp-ready">Pronto</span>
  return <span className="status-pill sp-err">Errore</span>
}

// ── Ordini, stesso linguaggio della pagina progetti del cliente:
//    tab a pillola, toggle quadri/lista, righe/card invece della tabella ──
export default function Ordini() {
  const [activeTab, setActiveTab] = useState<TabKey>('new')
  const [view, setView] = useState<'grid' | 'list'>('list')
  const [query, setQuery] = useState('')
  const [rejectingId, setRejectingId] = useState<string>()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const navigate = useNavigate()
  const orders = useLiveOrders()

  const filteredOrders = orders
    .filter(o => activeTab === 'all' || TABS.find(t => t.key === activeTab)?.statuses?.includes(o.status))
    .filter(o => !query || [o.ordNum, o.name, o.customer, o.material].join(' ').toLowerCase().includes(query.toLowerCase()))

  const tabCount = (statuses?: LiveStatus[]) =>
    statuses ? orders.filter(o => statuses.includes(o.status)).length : orders.length

  const accept = (id: string) => {
    setOrderStatus(id, 'accepted')
    toast('Ordine accettato, pronto per lo slicing')
  }
  const reject = (id: string) => {
    setOrderStatus(id, 'rejected')
    setRejectingId(undefined)
    toast('Ordine rifiutato, il cliente riceve una notifica')
  }
  const acceptSelected = () => {
    selected.forEach(id => setOrderStatus(id, 'accepted'))
    toast(`${selected.size} ordini accettati`)
    setSelected(new Set())
  }
  const toggleSelected = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const tabStyle = (tab: TabKey) => ({
    padding: '8px 16px',
    borderRadius: 100,
    cursor: 'pointer',
    fontFamily: 'var(--mono)' as const,
    fontSize: 12,
    fontWeight: 600,
    transition: '0.18s',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    background: activeTab === tab ? 'var(--cyan)' : 'transparent',
    color: activeTab === tab ? '#f4faed' : 'var(--muted)',
  })

  const viewBtnStyle = (v: 'grid' | 'list') => ({
    width: 34,
    height: 34,
    borderRadius: 9,
    border: 'none',
    cursor: 'pointer',
    display: 'grid' as const,
    placeItems: 'center' as const,
    background: view === v ? 'var(--cyan)' : 'transparent',
    color: view === v ? '#f4faed' : 'var(--muted)',
    transition: '0.18s',
  })

  /* Azioni contestuali per stato (condivise tra riga e card) */
  const actions = (order: LiveOrder) => (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}
      onClick={e => e.stopPropagation()}
    >
      {order.status === 'new' && rejectingId !== order.id && (
        <>
          <button
            onClick={() => setRejectingId(order.id)}
            style={{
              background: 'transparent', border: '1px solid var(--line-2)',
              color: 'var(--muted)', fontFamily: 'inherit', fontWeight: 600,
              fontSize: 12, padding: '5px 11px', borderRadius: '100px', cursor: 'pointer',
            }}>
            Rifiuta
          </button>
          <button
            onClick={() => accept(order.id)}
            style={{
              background: 'var(--forest)', border: 'none', color: '#fff',
              fontFamily: 'inherit', fontWeight: 700, fontSize: 12,
              padding: '5px 13px', borderRadius: '100px', cursor: 'pointer',
            }}>
            Accetta
          </button>
        </>
      )}
      {order.status === 'new' && rejectingId === order.id && (
        <>
          <span style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 600 }}>Rifiutare?</span>
          <button
            onClick={() => reject(order.id)}
            style={{
              background: 'transparent', border: '1px dashed #e40014', color: '#e40014',
              fontFamily: 'inherit', fontWeight: 600, fontSize: 12,
              padding: '5px 11px', borderRadius: '100px', cursor: 'pointer',
            }}>
            Sì
          </button>
          <button
            onClick={() => setRejectingId(undefined)}
            style={{
              background: 'transparent', border: '1px solid var(--line)', color: 'var(--muted)',
              fontFamily: 'inherit', fontWeight: 600, fontSize: 12,
              padding: '5px 11px', borderRadius: '100px', cursor: 'pointer',
            }}>
            No
          </button>
        </>
      )}
      {order.status === 'accepted' && (
        <button
          onClick={() => navigate(`/fablab/slicing?ordine=${order.id}`)}
          style={{
            background: 'transparent', border: '1px solid var(--cyan)', color: 'var(--cyan)',
            fontFamily: 'inherit', fontWeight: 600, fontSize: 12,
            padding: '5px 13px', borderRadius: '100px', cursor: 'pointer',
          }}>
          Avvia slicing →
        </button>
      )}
      {order.status === 'ready' && (
        <button
          onClick={() => toast(`${order.customer} avvisato: ordine pronto al ritiro`)}
          style={{
            background: 'transparent', border: 'none', color: 'var(--cyan)',
            fontFamily: 'inherit', fontWeight: 600, fontSize: 12,
            padding: '5px 10px', borderRadius: 8, cursor: 'pointer',
          }}>
          Avvisa cliente
        </button>
      )}
      {order.status === 'error' && (
        <button
          onClick={() => navigate(`/fablab/ordini/${order.id}`)}
          style={{
            background: 'transparent', border: 'none', color: 'var(--cyan)',
            fontFamily: 'inherit', fontWeight: 600, fontSize: 12,
            padding: '5px 10px', borderRadius: 8, cursor: 'pointer',
          }}>
          Risolvi →
        </button>
      )}
    </div>
  )

  /* ── Riga (vista lista), come la riga progetti del cliente ── */
  const orderRow = (order: LiveOrder) => (
    <div
      key={order.id}
      onClick={() => navigate(`/fablab/ordini/${order.id}`)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: 16,
        borderRadius: 'var(--radius-sm)',
        background: 'var(--glass)',
        border: '1px solid var(--line)',
        cursor: 'pointer',
        transition: '0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--glass-2)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'var(--glass)' }}
    >
      {order.status === 'new' && (
        <input
          type="checkbox"
          checked={selected.has(order.id)}
          onChange={() => toggleSelected(order.id)}
          onClick={e => e.stopPropagation()}
          title="Seleziona per azioni multiple"
          style={{ accentColor: 'var(--cyan)', cursor: 'pointer', margin: 0, flex: '0 0 auto' }}
        />
      )}
      <div className="thumb-mini" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--cyan)', letterSpacing: '0.05em', marginBottom: 2 }}>
          ORD · {order.ordNum}
        </div>
        <div style={{ fontWeight: 600, fontSize: 14.5, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {order.name}
        </div>
        <div style={{ fontSize: 11.5, fontFamily: 'var(--mono)', color: 'var(--muted)', marginTop: 3 }}>
          {order.customer} · {order.material}
        </div>
      </div>
      {order.status === 'printing' && (
        <div style={{ width: 120, flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 5, borderRadius: 100, background: 'rgba(63,115,8,.14)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${order.progress ?? 0}%`, background: 'var(--cyan)', transition: 'width 0.3s ease' }} />
          </div>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: 'var(--cyan)' }}>{order.progress ?? 0}%</span>
        </div>
      )}
      <DeadlineChip type={order.deadline} label={order.deadlineLabel} />
      <OrderStatusPill status={order.status} />
      <div style={{ flex: '0 0 150px' }}>{actions(order)}</div>
    </div>
  )

  /* ── Card (vista quadri), come la card progetti del cliente ── */
  const orderCard = (order: LiveOrder) => (
    <div
      key={order.id}
      onClick={() => navigate(`/fablab/ordini/${order.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <GlassCard style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12, cursor: 'inherit', transition: '0.2s' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div className="thumb-mini" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--cyan)', letterSpacing: '0.05em', marginBottom: 2 }}>
              ORD · {order.ordNum}
            </div>
            <div style={{ fontWeight: 600, fontSize: 14.5, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {order.name}
            </div>
            <div style={{ fontSize: 11.5, fontFamily: 'var(--mono)', color: 'var(--muted)', marginTop: 3 }}>
              {order.customer} · {order.material}
            </div>
          </div>
          {order.status === 'new' && (
            <input
              type="checkbox"
              checked={selected.has(order.id)}
              onChange={() => toggleSelected(order.id)}
              onClick={e => e.stopPropagation()}
              title="Seleziona per azioni multiple"
              style={{ accentColor: 'var(--cyan)', cursor: 'pointer', margin: 0, flex: '0 0 auto' }}
            />
          )}
        </div>

        {order.status === 'printing' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 5, borderRadius: 100, background: 'rgba(63,115,8,.14)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${order.progress ?? 0}%`, background: 'var(--cyan)', transition: 'width 0.3s ease' }} />
            </div>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: 'var(--cyan)' }}>{order.progress ?? 0}%</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <OrderStatusPill status={order.status} />
          <DeadlineChip type={order.deadline} label={order.deadlineLabel} />
          <span style={{ flex: 1 }} />
          {actions(order)}
        </div>
      </GlassCard>
    </div>
  )

  return (
    <>
      {/* ── Topbar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: '0 0 auto' }}>
        <div>
          <h1 style={{ fontWeight: 600, fontSize: 25, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
            Ordini
          </h1>
          <p style={{
            color: 'var(--muted)', fontSize: 12, marginTop: 3,
            fontWeight: 500, fontFamily: 'var(--mono)', letterSpacing: '0.02em',
          }}>
            {orders.length} TOTALI · {tabCount(['new'])} NUOVI
          </p>
        </div>
        <div style={{ flex: 1 }} />
        <SearchBar placeholder="Cerca ordine o cliente…" value={query} onChange={setQuery} />
        {selected.size > 0 && (
          <button
            onClick={acceptSelected}
            className="btn-spade"
            style={{ fontSize: 13, height: 40 }}
          >
            <Check size={15} />
            Accetta selezionati ({selected.size})
          </button>
        )}
        <button
          onClick={() => toast('Lista ordini esportata (CSV)')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'transparent', color: 'var(--muted)', border: '1px solid var(--line)',
            fontFamily: 'inherit', fontWeight: 600, fontSize: 13, padding: '0 16px',
            height: 40, borderRadius: 100, cursor: 'pointer', transition: '0.2s',
          }}
        >
          <Download size={15} />
          Esporta lista
        </button>
      </div>

      {/* Tabs + toggle vista, come la pagina progetti del cliente */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '0 0 auto' }}>
        <div
          style={{
            display: 'flex',
            gap: 4,
            background: 'var(--glass)',
            border: '1px solid var(--line)',
            borderRadius: 100,
            padding: 4,
            width: 'fit-content',
          }}
        >
          {TABS.map(tab => (
            <button key={tab.key} style={tabStyle(tab.key)} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
              {tab.key !== 'all' && <span style={{ opacity: 0.75 }}>{tabCount(tab.statuses)}</span>}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            display: 'flex',
            gap: 3,
            background: 'var(--glass)',
            border: '1px solid var(--line)',
            borderRadius: 11,
            padding: 3,
          }}
        >
          <button style={viewBtnStyle('grid')} onClick={() => setView('grid')} aria-label="Vista a quadri" title="Vista a quadri">
            <LayoutGrid size={16} />
          </button>
          <button style={viewBtnStyle('list')} onClick={() => setView('list')} aria-label="Vista a lista" title="Vista a lista">
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Contenuto */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        {filteredOrders.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
            {query
              ? <>Nessun ordine per «{query}».</>
              : activeTab === 'new'
              ? <>Nessun nuovo ordine da valutare, tutto smaltito.</>
              : <>Nessun ordine in questo stato.</>}{' '}
            <button
              onClick={() => { setQuery(''); setActiveTab('all') }}
              style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, padding: 0 }}
            >
              Vedi tutti gli ordini
            </button>
          </div>
        )}
        {view === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, alignContent: 'start' }}>
            {filteredOrders.map(orderCard)}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {filteredOrders.map(orderRow)}
          </div>
        )}
      </div>
    </>
  )
}
