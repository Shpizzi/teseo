import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, Check } from 'lucide-react'
import SearchBar from '../../components/SearchBar'
import GlassCard from '../../components/GlassCard'
import { type DeadlineType } from '../../mock'
import { useLiveOrders, setOrderStatus, type LiveStatus } from '../../mock/orderStore'
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

// ── Ordini ────────────────────────────────────────────────────
export default function Ordini() {
  const [activeTab, setActiveTab] = useState<TabKey>('new')
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
    toast('Ordine accettato — pronto per lo slicing')
  }
  const reject = (id: string) => {
    setOrderStatus(id, 'rejected')
    setRejectingId(undefined)
    toast('Ordine rifiutato — il cliente riceve una notifica')
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

      {/* ── Main card ── */}
      <GlassCard hero style={{ padding: 22, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flex: '0 0 auto' }}>
          {TABS.map(tab => {
            const count = tabCount(tab.statuses)
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 13px', borderRadius: 100,
                  border: isActive ? '1px solid var(--cyan)' : '1px solid var(--line)',
                  background: isActive ? 'rgba(63,115,8,.10)' : 'transparent',
                  color: isActive ? 'var(--cyan)' : 'var(--muted)',
                  fontFamily: 'inherit', fontWeight: 600, fontSize: 12.5,
                  cursor: 'pointer', transition: '0.18s',
                }}
              >
                {tab.label}
                {tab.key !== 'all' && (
                  <span style={{
                    background: isActive ? 'var(--cyan)' : 'var(--glass-2)',
                    color: isActive ? '#f4faed' : 'var(--muted)',
                    fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
                    padding: '1px 6px', borderRadius: 100,
                  }}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Table header row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '12px 16px',
          borderBottom: '1px solid var(--line)',
          flex: '0 0 auto',
        }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', flex: '0 0 100px' }}>Ordine</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', flex: '0 0 130px' }}>Cliente</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', flex: 1 }}>Prodotto</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', flex: '0 0 80px' }}>Materiale</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', flex: '0 0 90px' }}>Scadenza</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', flex: '0 0 80px' }}>Stato</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', flex: '0 0 160px', textAlign: 'right' }}>Azioni</span>
        </div>

        {/* Order rows */}
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {filteredOrders.length === 0 && (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
              {query
                ? <>Nessun ordine per «{query}».</>
                : activeTab === 'new'
                ? <>Nessun nuovo ordine da valutare — tutto smaltito.</>
                : <>Nessun ordine in questo stato.</>}{' '}
              <button
                onClick={() => { setQuery(''); setActiveTab('all') }}
                style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, padding: 0 }}
              >
                Vedi tutti gli ordini
              </button>
            </div>
          )}
          {filteredOrders.map(order => (
            <div
              key={order.id}
              onClick={() => navigate(`/fablab/ordini/${order.id}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px',
                borderBottom: '1px solid var(--line)',
                cursor: 'pointer', transition: '0.18s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.background = 'var(--glass-2)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = 'transparent'
              }}
            >
              {/* Ordine (+ checkbox bulk sui nuovi) */}
              <span style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--mono)', fontSize: 11,
                color: 'var(--cyan)', flex: '0 0 100px',
                letterSpacing: '0.04em',
              }}>
                {order.status === 'new' && (
                  <input
                    type="checkbox"
                    checked={selected.has(order.id)}
                    onChange={() => toggleSelected(order.id)}
                    onClick={e => e.stopPropagation()}
                    title="Seleziona per azioni multiple"
                    style={{ accentColor: 'var(--cyan)', cursor: 'pointer', margin: 0 }}
                  />
                )}
                {order.ordNum}
              </span>

              {/* Cliente */}
              <span style={{ fontWeight: 600, fontSize: 14, flex: '0 0 130px', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {order.customer}
              </span>

              {/* Prodotto */}
              <span style={{ fontWeight: 600, fontSize: 14, flex: 1, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {order.name}
              </span>

              {/* Materiale */}
              <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', flex: '0 0 80px' }}>
                {order.material}
              </span>

              {/* Scadenza */}
              <div style={{ flex: '0 0 90px' }}>
                <DeadlineChip type={order.deadline} label={order.deadlineLabel} />
              </div>

              {/* Stato */}
              <div style={{ flex: '0 0 80px' }}>
                <OrderStatusPill status={order.status} />
              </div>

              {/* Azioni */}
              <div
                style={{ flex: '0 0 160px', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}
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
                {order.status === 'printing' && (
                  <div style={{ width: 70, height: 5, borderRadius: 100, background: 'rgba(63,115,8,.14)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${order.progress ?? 0}%`, background: 'var(--cyan)', transition: 'width 0.3s ease' }} />
                  </div>
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
            </div>
          ))}
        </div>
      </GlassCard>
    </>
  )
}
