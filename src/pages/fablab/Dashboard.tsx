import { useState } from 'react'
import { Download, Clock, Activity, CheckCircle2, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PrimaryButton from '../../components/PrimaryButton'
import KpiCard from '../../components/KpiCard'
import GlassCard from '../../components/GlassCard'
import { fablabKpis } from '../../mock'
import { printersFull } from '../../mock/fablab-pages'
import { useLiveOrders, setOrderStatus, type LiveStatus, type LiveOrder } from '../../mock/orderStore'
import { toast } from '../../components/Toast'

// ── DeadlineChip ──────────────────────────────────────────────
type DeadlineType = 'urgent' | 'today' | 'week'
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
      }}
    >
      {label}
    </span>
  )
}

// ── OrderRow ──────────────────────────────────────────────────
type OrderRowProps = {
  order: LiveOrder
  onNavigate: (id: string) => void
  rejecting: boolean
  onRejectStart: () => void
  onRejectCancel: () => void
}

function OrderRow({ order, onNavigate, rejecting, onRejectStart, onRejectCancel }: OrderRowProps) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => onNavigate(order.id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: 14,
        borderRadius: 'var(--radius-sm)',
        background: 'var(--glass)',
        border: '1px solid var(--line)',
        cursor: 'pointer',
        transition: '0.2s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--line-2)'
        el.style.background = 'var(--glass-2)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--line)'
        el.style.background = 'var(--glass)'
      }}
    >
      {/* Thumbnail */}
      <div className="thumb-mini" />

      {/* Meta block */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 10,
            color: 'var(--cyan)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: 2,
          }}
        >
          ORD · {order.ordNum}
        </div>
        <div
          style={{
            fontWeight: 600,
            fontSize: 14.5,
            color: 'var(--ink)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {order.name}
        </div>
        <div
          style={{
            fontFamily: 'var(--mono)',
            color: 'var(--muted)',
            fontSize: 11.5,
            marginTop: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flexWrap: 'wrap',
          }}
        >
          {order.customer} · {order.material} ·{' '}
          <DeadlineChip type={order.deadline} label={order.deadlineLabel} />
        </div>
      </div>

      {/* Right block */}
      <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        {order.status === 'new' && !rejecting && (
          <>
            <button
              onClick={e => { e.stopPropagation(); onRejectStart() }}
              style={{
                background: 'transparent',
                border: '1px solid var(--line-2)',
                color: 'var(--muted)',
                fontFamily: 'inherit',
                fontWeight: 600,
                fontSize: 12,
                padding: '6px 12px',
                borderRadius: '100px',
                cursor: 'pointer',
              }}
            >
              Rifiuta
            </button>
            <button
              onClick={e => {
                e.stopPropagation()
                setOrderStatus(order.id, 'accepted')
                toast('Ordine accettato — pronto per lo slicing')
              }}
              style={{
                background: 'var(--forest)',
                border: 'none',
                color: '#fff',
                fontFamily: 'inherit',
                fontWeight: 700,
                fontSize: 12,
                padding: '6px 14px',
                borderRadius: '100px',
                cursor: 'pointer',
              }}
            >
              Accetta
            </button>
          </>
        )}
        {order.status === 'new' && rejecting && (
          <span onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 600 }}>Rifiutare?</span>
            <button
              onClick={() => {
                setOrderStatus(order.id, 'rejected')
                onRejectCancel()
                toast('Ordine rifiutato — il cliente riceve una notifica')
              }}
              style={{
                background: 'transparent', border: '1px dashed #e40014', color: '#e40014',
                fontFamily: 'inherit', fontWeight: 600, fontSize: 12,
                padding: '5px 11px', borderRadius: 100, cursor: 'pointer',
              }}
            >
              Sì
            </button>
            <button
              onClick={onRejectCancel}
              style={{
                background: 'transparent', border: '1px solid var(--line)', color: 'var(--muted)',
                fontFamily: 'inherit', fontWeight: 600, fontSize: 12,
                padding: '5px 11px', borderRadius: 100, cursor: 'pointer',
              }}
            >
              No
            </button>
          </span>
        )}
        {order.status === 'accepted' && (
          <button
            onClick={e => { e.stopPropagation(); navigate(`/fablab/slicing?ordine=${order.id}`) }}
            style={{
              background: 'transparent', border: '1px solid var(--cyan)', color: 'var(--cyan)',
              fontFamily: 'inherit', fontWeight: 600, fontSize: 12,
              padding: '6px 13px', borderRadius: 100, cursor: 'pointer',
            }}
          >
            Avvia slicing →
          </button>
        )}
        {order.status === 'printing' && (
          <div
            style={{
              width: 90,
              height: 5,
              borderRadius: 100,
              background: 'rgba(63,115,8,.14)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${order.progress ?? 0}%`,
                background: 'var(--cyan)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        )}
        {order.status === 'ready' && (
          <>
            <span className="status-pill sp-ready">Pronto</span>
            <button
              onClick={e => { e.stopPropagation(); toast(`${order.customer} avvisato: ordine pronto al ritiro`) }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--cyan)',
                fontFamily: 'inherit',
                fontWeight: 600,
                fontSize: 12,
                padding: '6px 10px',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              Avvisa cliente
            </button>
          </>
        )}
        {order.status === 'error' && (
          <>
            <span className="status-pill sp-err">Errore</span>
            <button
              onClick={e => { e.stopPropagation(); onNavigate(order.id) }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--cyan)',
                fontFamily: 'inherit',
                fontWeight: 600,
                fontSize: 12,
                padding: '6px 10px',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              Risolvi →
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ── Tab type ──────────────────────────────────────────────────
type TabKey = 'new' | 'printing' | 'ready' | 'all'

const tabs: { key: TabKey; label: string; statuses?: LiveStatus[] }[] = [
  { key: 'new',      label: 'Nuovi',          statuses: ['new'] },
  { key: 'printing', label: 'In lavorazione', statuses: ['accepted', 'printing'] },
  { key: 'ready',    label: 'Pronti',         statuses: ['ready'] },
  { key: 'all',      label: 'Tutti' },
]

const kpiIcons = [
  <Clock size={17} />,
  <Activity size={17} />,
  <CheckCircle2 size={17} />,
  <TrendingUp size={17} />,
]

// ── Dashboard ─────────────────────────────────────────────────
export default function FablabDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>('new')
  const [rejectingId, setRejectingId] = useState<string>()
  const navigate = useNavigate()
  const orders = useLiveOrders()

  const filteredOrders = orders.filter(o =>
    activeTab === 'all' || tabs.find(t => t.key === activeTab)?.statuses?.includes(o.status))

  const tabCount = (statuses?: LiveStatus[]) =>
    statuses ? orders.filter(o => statuses.includes(o.status)).length : orders.length

  const newCount = tabCount(['new'])
  const errorCount = tabCount(['error'])
  const activePrinters = printersFull.filter(p => p.status === 'active').length
  const utilization = Math.round((activePrinters / printersFull.length) * 100)
  const countByStatus = (s: string) => printersFull.filter(p => p.status === s).length

  return (
    <>
      {/* ── Topbar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: '0 0 auto' }}>
        <div>
          <h1
            style={{
              fontWeight: 600,
              fontSize: 25,
              letterSpacing: '-0.01em',
              color: 'var(--ink)',
            }}
          >
            Buongiorno, Lambrate
          </h1>
          <p
            style={{
              color: 'var(--muted)',
              fontSize: 12,
              marginTop: 3,
              fontWeight: 500,
              fontFamily: 'var(--mono)',
              letterSpacing: '0.02em',
            }}
          >
            {[
              newCount > 0 ? `${newCount} NUOV${newCount === 1 ? 'O ORDINE' : 'I ORDINI'} DA VALUTARE` : null,
              errorCount > 0 ? `${errorCount} ERROR${errorCount === 1 ? 'E' : 'I'} DA RISOLVERE` : null,
            ].filter(Boolean).join(' · ') || 'NESSUNA AZIONE URGENTE'}
          </p>
        </div>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => toast('Report di produzione esportato (PDF)')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'transparent', color: 'var(--muted)', border: '1px solid var(--line)',
            fontFamily: 'inherit', fontWeight: 600, fontSize: 13, padding: '0 16px',
            height: 40, borderRadius: 100, cursor: 'pointer', transition: '0.2s',
          }}
        >
          <Download size={15} />
          Esporta report
        </button>
        {newCount > 0 && (
          <PrimaryButton onClick={() => navigate('/fablab/ordini')}>
            Valuta nuovi ordini ({newCount})
          </PrimaryButton>
        )}
      </div>

      {/* ── KPI strip ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 14,
          flex: '0 0 auto',
        }}
      >
        {fablabKpis.map((kpi, i) => (
          <div key={kpi.label} style={{ position: 'relative' }}>
            <KpiCard
              value={kpi.sublabel ? `${kpi.value}` : kpi.value}
              label={kpi.label}
              trend={kpi.trend}
              trendUp={kpi.trendUp}
              icon={kpiIcons[i]}
            />
            {kpi.sublabel && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 28,
                  left: 17,
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  color: 'var(--muted)',
                  pointerEvents: 'none',
                }}
              >
                {kpi.sublabel}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Main grid ── */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1.55fr 1fr',
          gap: 16,
          minHeight: 0,
        }}
      >
        {/* Left: Orders hero card */}
        <GlassCard
          hero
          style={{
            padding: 22,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          {/* Card header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
              flex: '0 0 auto',
              position: 'relative',
            }}
          >
            <h3
              style={{
                fontWeight: 600,
                fontSize: 15,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--ink)',
              }}
            >
              Ordini
            </h3>
            <button
              onClick={() => navigate('/fablab/coda')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: 'var(--cyan)',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--mono)',
                letterSpacing: '0.04em',
              }}
            >
              VISTA CODA ›
            </button>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              gap: 6,
              marginBottom: 14,
              flex: '0 0 auto',
            }}
          >
            {tabs.map(tab => {
              const count = tabCount(tab.statuses)
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 13px',
                    borderRadius: 100,
                    border: isActive ? '1px solid var(--cyan)' : '1px solid var(--line)',
                    background: isActive ? 'rgba(63,115,8,.10)' : 'transparent',
                    color: isActive ? 'var(--cyan)' : 'var(--muted)',
                    fontFamily: 'inherit',
                    fontWeight: 600,
                    fontSize: 12.5,
                    cursor: 'pointer',
                    transition: '0.18s',
                  }}
                >
                  {tab.label}
                  {tab.key !== 'all' && (
                    <span
                      style={{
                        background: isActive ? 'var(--cyan)' : 'var(--glass-2)',
                        color: isActive ? '#f4faed' : 'var(--muted)',
                        fontFamily: 'var(--mono)',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: 100,
                      }}
                    >
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Orders list */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 9,
              overflow: 'auto',
              flex: 1,
            }}
          >
            {filteredOrders.length === 0 && (
              <div style={{ padding: 28, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                {activeTab === 'new' ? 'Nessun nuovo ordine da valutare — tutto smaltito.' : 'Nessun ordine in questo stato.'}
              </div>
            )}
            {filteredOrders.map(order => (
              <OrderRow
                key={order.id}
                order={order}
                onNavigate={id => navigate('/fablab/ordini/' + id)}
                rejecting={rejectingId === order.id}
                onRejectStart={() => setRejectingId(order.id)}
                onRejectCancel={() => setRejectingId(undefined)}
              />
            ))}
          </div>
        </GlassCard>

        {/* Right: Printers card */}
        <GlassCard
          style={{
            padding: 22,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          {/* Card header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
              flex: '0 0 auto',
            }}
          >
            <h3
              style={{
                fontWeight: 600,
                fontSize: 15,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--ink)',
              }}
            >
              Stampanti
            </h3>
            <button
              onClick={() => navigate('/fablab/coda')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: 'var(--cyan)',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--mono)',
                letterSpacing: '0.04em',
              }}
            >
              GESTISCI ›
            </button>
          </div>

          {/* Utilization bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '14px 16px',
              background: 'var(--glass-2)',
              border: '1px solid var(--line)',
              borderRadius: 13,
              marginBottom: 16,
              flex: '0 0 auto',
            }}
          >
            {/* Conic ring */}
            <div className="conic-ring">
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'var(--bg-2)',
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: 'var(--mono)',
                  fontWeight: 700,
                  fontSize: 13,
                  color: 'var(--ink)',
                }}
              >
                {activePrinters}/{printersFull.length}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: 'var(--ink)',
                }}
              >
                {utilization}% di utilizzo
              </div>
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 10.5,
                  color: 'var(--muted)',
                  marginTop: 3,
                }}
              >
                {countByStatus('active')} attive · {countByStatus('idle')} libere · {countByStatus('error')} in errore · {countByStatus('maintenance')} in manutenzione
              </div>
            </div>
          </div>

          {/* Printer list */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 9,
              overflow: 'auto',
              flex: 1,
            }}
          >
            {printersFull.map(printer => (
              <div
                key={printer.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 11,
                  background: 'var(--glass)',
                  border: '1px solid var(--line)',
                }}
              >
                {/* Status dot */}
                <span
                  className={
                    printer.status === 'active'
                      ? 'pdot-active'
                      : printer.status === 'error'
                      ? 'pdot-err'
                      : 'pdot-idle'
                  }
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    flex: '0 0 auto',
                    display: 'block',
                  }}
                />

                {/* Name & sub */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--ink)' }}>
                    {printer.name}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 10.5,
                      color: 'var(--muted)',
                      marginTop: 2,
                    }}
                  >
                    {printer.status === 'active'
                      ? `${printer.orderId} · ${printer.material}`
                      : printer.status === 'idle'
                      ? 'Libera · pronta'
                      : printer.status === 'maintenance'
                      ? 'In manutenzione'
                      : printer.errorMessage ?? 'In errore'}
                  </div>
                </div>

                {/* Progress / state indicator */}
                <span
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 12,
                    fontWeight: 700,
                    color: printer.status === 'active' ? 'var(--cyan)' : 'var(--muted)',
                  }}
                >
                  {printer.status === 'active'
                    ? `${printer.progress}%`
                    : printer.status === 'idle'
                    ? 'LIBERA'
                    : printer.status === 'maintenance'
                    ? 'MANUT.'
                    : 'ERRORE'}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </>
  )
}
