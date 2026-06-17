import { useState } from 'react'
import { Bell, Download, Clock, Activity, CheckCircle2, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../../components/SearchBar'
import IconButton from '../../components/IconButton'
import PrimaryButton from '../../components/PrimaryButton'
import KpiCard from '../../components/KpiCard'
import GlassCard from '../../components/GlassCard'
import { fablabOrders, fablabPrinters, fablabKpis, type OrderStatus } from '../../mock'

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
function OrderRow({ order, onNavigate }: { order: typeof fablabOrders[0]; onNavigate: (id: string) => void }) {
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
        {order.status === 'new' && (
          <>
            <button
              onClick={e => e.stopPropagation()}
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
              onClick={e => { e.stopPropagation(); onNavigate(order.id) }}
              style={{
                background: '#fff',
                border: 'none',
                color: '#08233f',
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
        {order.status === 'printing' && (
          <div
            style={{
              width: 90,
              height: 5,
              borderRadius: 100,
              background: 'rgba(174,227,249,.14)',
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
              Avvisa
            </button>
          </>
        )}
        {order.status === 'error' && (
          <>
            <span className="status-pill sp-err">Errore</span>
            <button
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
              Risolvi
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ── Tab type ──────────────────────────────────────────────────
type TabKey = 'new' | 'printing' | 'ready' | 'all'

const tabs: { key: TabKey; label: string; status?: OrderStatus }[] = [
  { key: 'new',      label: 'Nuovi',     status: 'new' },
  { key: 'printing', label: 'In stampa', status: 'printing' },
  { key: 'ready',    label: 'Pronti',    status: 'ready' },
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
            2 NUOVI ORDINI DA VALUTARE · 1 ERRORE DA RISOLVERE
          </p>
        </div>
        <div style={{ flex: 1 }} />
        <SearchBar placeholder="Cerca un ordine o un cliente…" />
        <IconButton title="Notifiche" badge={3}>
          <Bell size={19} />
        </IconButton>
        <PrimaryButton>
          <Download size={18} />
          Esporta report
        </PrimaryButton>
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
            <span
              onClick={() => navigate('/fablab/coda')}
              style={{
                color: 'var(--cyan)',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--mono)',
                letterSpacing: '0.04em',
              }}
            >
              VISTA CODA ›
            </span>
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
              const count = tabCount(tab.status)
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
                    background: isActive ? 'rgba(174,227,249,.10)' : 'transparent',
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
                        color: isActive ? '#08233f' : 'var(--muted)',
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
            {filteredOrders.map(order => (
              <OrderRow key={order.id} order={order} onNavigate={id => navigate('/fablab/ordini/' + id)} />
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
            <span
              onClick={() => navigate('/fablab/stampanti')}
              style={{
                color: 'var(--cyan)',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--mono)',
                letterSpacing: '0.04em',
              }}
            >
              GESTISCI ›
            </span>
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
                8/12
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
                66% di utilizzo
              </div>
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 10.5,
                  color: 'var(--muted)',
                  marginTop: 3,
                }}
              >
                8 attive · 1 idle · 1 errore · 2 manut.
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
            {fablabPrinters.map(printer => (
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
                      : printer.status === 'idle'
                      ? 'pdot-idle'
                      : 'pdot-err'
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
                      ? 'Inattiva · pronta'
                      : 'Bobina esaurita'}
                  </div>
                </div>

                {/* Progress / state indicator */}
                <span
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 12,
                    fontWeight: 700,
                    color:
                      printer.status === 'active'
                        ? 'var(--cyan)'
                        : printer.status === 'idle'
                        ? 'var(--muted)'
                        : 'var(--cyan)',
                  }}
                >
                  {printer.status === 'active'
                    ? `${printer.progress}%`
                    : printer.status === 'idle'
                    ? 'IDLE'
                    : 'ERR'}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </>
  )
}
