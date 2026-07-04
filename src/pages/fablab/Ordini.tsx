import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download } from 'lucide-react'
import SearchBar from '../../components/SearchBar'
import PrimaryButton from '../../components/PrimaryButton'
import GlassCard from '../../components/GlassCard'
import { fablabOrders, type OrderStatus, type DeadlineType } from '../../mock'

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

const TABS: { key: TabKey; label: string; status?: OrderStatus }[] = [
  { key: 'new',      label: 'Nuovi',     status: 'new' },
  { key: 'printing', label: 'In stampa', status: 'printing' },
  { key: 'ready',    label: 'Pronti',    status: 'ready' },
  { key: 'error',    label: 'Errori',    status: 'error' },
  { key: 'all',      label: 'Tutti' },
]

// ── Inline status pill for order statuses ─────────────────────
function OrderStatusPill({ status }: { status: OrderStatus }) {
  if (status === 'new')      return <span className="status-pill sp-new">Nuovo</span>
  if (status === 'printing') return <span className="status-pill sp-print">In stampa</span>
  if (status === 'ready')    return <span className="status-pill sp-ready">Pronto</span>
  return <span className="status-pill sp-err">Errore</span>
}

// ── Ordini ────────────────────────────────────────────────────
export default function Ordini() {
  const [activeTab, setActiveTab] = useState<TabKey>('new')
  const navigate = useNavigate()

  const filteredOrders = activeTab === 'all'
    ? fablabOrders
    : fablabOrders.filter(o => o.status === activeTab)

  const tabCount = (status?: OrderStatus) =>
    status ? fablabOrders.filter(o => o.status === status).length : fablabOrders.length

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
            6 TOTALI · 2 NUOVI
          </p>
        </div>
        <div style={{ flex: 1 }} />
        <SearchBar placeholder="Cerca ordine o cliente…" />
        <PrimaryButton>
          <Download size={18} />
          Esporta lista
        </PrimaryButton>
      </div>

      {/* ── Main card ── */}
      <GlassCard hero style={{ padding: 22, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flex: '0 0 auto' }}>
          {TABS.map(tab => {
            const count = tabCount(tab.status)
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
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', flex: '0 0 140px', textAlign: 'right' }}>Azioni</span>
        </div>

        {/* Order rows */}
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
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
              {/* Ordine */}
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 11,
                color: 'var(--cyan)', flex: '0 0 100px',
                letterSpacing: '0.04em',
              }}>
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
                style={{ flex: '0 0 140px', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}
                onClick={e => e.stopPropagation()}
              >
                {order.status === 'new' && (
                  <>
                    <button style={{
                      background: 'transparent', border: '1px solid var(--line-2)',
                      color: 'var(--muted)', fontFamily: 'inherit', fontWeight: 600,
                      fontSize: 12, padding: '5px 11px', borderRadius: '100px', cursor: 'pointer',
                    }}>
                      Rifiuta
                    </button>
                    <button style={{
                      background: 'var(--forest)', border: 'none', color: '#fff',
                      fontFamily: 'inherit', fontWeight: 700, fontSize: 12,
                      padding: '5px 13px', borderRadius: '100px', cursor: 'pointer',
                    }}>
                      Accetta
                    </button>
                  </>
                )}
                {order.status === 'printing' && (
                  <div style={{ width: 70, height: 5, borderRadius: 100, background: 'rgba(63,115,8,.14)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${order.progress ?? 0}%`, background: 'var(--cyan)', transition: 'width 0.3s ease' }} />
                  </div>
                )}
                {order.status === 'ready' && (
                  <button style={{
                    background: 'transparent', border: 'none', color: 'var(--cyan)',
                    fontFamily: 'inherit', fontWeight: 600, fontSize: 12,
                    padding: '5px 10px', borderRadius: 8, cursor: 'pointer',
                  }}>
                    Avvisa
                  </button>
                )}
                {order.status === 'error' && (
                  <button style={{
                    background: 'transparent', border: 'none', color: 'var(--cyan)',
                    fontFamily: 'inherit', fontWeight: 600, fontSize: 12,
                    padding: '5px 10px', borderRadius: 8, cursor: 'pointer',
                  }}>
                    Risolvi
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
