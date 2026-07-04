import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GlassCard from '../../components/GlassCard'
import { printersFull, type PrinterFull } from '../../mock/fablab-pages'
import { orderByOrdNum } from '../../mock'
import { toast } from '../../components/Toast'

type PrinterStatus = PrinterFull['status']

// Vocabolario unico stati stampante (allineato alla dashboard)
const STATUS_LABEL: Record<PrinterStatus, string> = {
  active: 'In stampa',
  idle: 'Libera',
  error: 'Errore',
  maintenance: 'Manutenzione',
}

// ── Printer status pill inline ────────────────────────────────
function PrinterStatusPill({ status }: { status: PrinterStatus }) {
  if (status === 'active') return <span className="status-pill sp-print">{STATUS_LABEL.active}</span>
  if (status === 'idle')   return <span className="status-pill sp-new">{STATUS_LABEL.idle}</span>
  if (status === 'error')  return <span className="status-pill sp-err">{STATUS_LABEL.error}</span>
  // maintenance: sp-new variant with dashed border
  return (
    <span className="status-pill" style={{
      background: 'transparent', border: '1px dashed var(--line-2)', color: 'var(--muted)',
    }}>
      {STATUS_LABEL.maintenance}
    </span>
  )
}

// ── Printer dot ───────────────────────────────────────────────
function PrinterDot({ status }: { status: PrinterStatus }) {
  const cls = status === 'active' ? 'pdot-active' : status === 'error' ? 'pdot-err' : 'pdot-idle'
  return <span className={cls} style={{ width: 10, height: 10, borderRadius: '50%', flex: '0 0 auto', display: 'block' }} />
}

// ── Stampanti ─────────────────────────────────────────────────
export default function Stampanti() {
  const navigate = useNavigate()
  const [printers, setPrinters] = useState(printersFull)
  const [filter, setFilter] = useState<PrinterStatus | 'all'>('all')

  const count = (s: PrinterStatus) => printers.filter(p => p.status === s).length
  const active = count('active')
  const visible = filter === 'all' ? printers : printers.filter(p => p.status === filter)

  const setStatus = (id: string, status: PrinterStatus, msg: string) => {
    setPrinters(prev => prev.map(p => p.id === id ? { ...p, status, errorMessage: undefined } : p))
    toast(msg)
  }

  const counters: { label: string; status: PrinterStatus }[] = [
    { label: 'IN STAMPA', status: 'active' },
    { label: 'LIBERE', status: 'idle' },
    { label: 'IN ERRORE', status: 'error' },
    { label: 'MANUT.', status: 'maintenance' },
  ]

  return (
    <>
      {/* ── Topbar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: '0 0 auto' }}>
        <div>
          <h1 style={{ fontWeight: 600, fontSize: 25, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
            Stampanti
          </h1>
          <p style={{
            color: 'var(--muted)', fontSize: 12, marginTop: 3,
            fontWeight: 500, fontFamily: 'var(--mono)', letterSpacing: '0.02em',
          }}>
            {printers.length} STAMPANTI · {active} IN STAMPA
          </p>
        </div>
        <div style={{ flex: 1 }} />
      </div>

      {/* ── Utilization summary bar ── */}
      <GlassCard style={{ padding: '16px 22px', flex: '0 0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* Ring */}
          <div className="conic-ring">
            <div style={{
              width: 48, height: 48, borderRadius: '50%', background: 'var(--bg-2)',
              display: 'grid', placeItems: 'center',
              fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 13, color: 'var(--ink)',
            }}>
              {active}/{printers.length}
            </div>
          </div>

          {/* Text info */}
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>
              {Math.round(active / printers.length * 100)}% utilizzo
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--muted)', marginTop: 3 }}>
              {count('active')} in stampa · {count('idle')} libere · {count('error')} in errore · {count('maintenance')} in manutenzione
            </div>
          </div>

          <div style={{ flex: 1 }} />

          {/* 4 counters — cliccabili come filtri */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {counters.map(c => {
              const isActive = filter === c.status
              return (
                <button
                  key={c.status}
                  onClick={() => setFilter(isActive ? 'all' : c.status)}
                  title={isActive ? 'Rimuovi filtro' : `Mostra solo: ${STATUS_LABEL[c.status]}`}
                  style={{
                    textAlign: 'center', cursor: 'pointer', padding: '6px 12px',
                    background: isActive ? 'rgba(63,115,8,.10)' : 'transparent',
                    border: isActive ? '1px solid var(--cyan)' : '1px solid transparent',
                    borderRadius: 10, transition: '0.18s', fontFamily: 'inherit',
                  }}
                >
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                    {c.label}
                  </div>
                  <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 18, color: isActive ? 'var(--cyan)' : 'var(--ink)' }}>
                    {String(count(c.status)).padStart(2, '0')}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </GlassCard>

      {/* ── Printer grid ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14,
        flex: 1, overflow: 'auto', alignContent: 'start',
      }}>
        {visible.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: 32, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
            Nessuna stampante in questo stato.{' '}
            <button
              onClick={() => setFilter('all')}
              style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, padding: 0 }}
            >
              Mostra tutte
            </button>
          </div>
        )}
        {visible.map(printer => (
          <GlassCard key={printer.id} style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
            {/* Top row: dot + name + model + status pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <PrinterDot status={printer.status} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {printer.name}
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>
                  {printer.model}
                </div>
              </div>
              <PrinterStatusPill status={printer.status} />
            </div>

            {/* Active: progress bar */}
            {printer.status === 'active' && printer.progress !== undefined && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ height: 4, borderRadius: 4, background: 'rgba(63,115,8,.14)', overflow: 'hidden', marginBottom: 5 }}>
                  <div style={{ height: '100%', width: `${printer.progress}%`, background: 'var(--cyan)', transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--cyan)', letterSpacing: '0.04em' }}>
                  ORD #{printer.orderId}
                </span>
              </div>
            )}

            {/* Error: error message (dice già cosa fare) */}
            {printer.status === 'error' && printer.errorMessage && (
              <div style={{
                fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)',
                borderLeft: '2px solid #e40014', paddingLeft: 8, margin: '4px 0 8px',
              }}>
                {printer.errorMessage}
              </div>
            )}

            {/* Divider */}
            <div style={{ height: 1, background: 'var(--line)', margin: '10px 0' }} />

            {/* Stats grid 2x2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                  Lavori totali
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
                  {printer.totalJobs}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                  Uptime
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
                  {printer.uptimePercent}%
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                  Ultima manut.
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
                  {printer.lastMaintenance}
                </div>
              </div>
            </div>

            {/* CTA coerente con lo stato */}
            {printer.status === 'error' ? (
              <button
                onClick={() => setStatus(printer.id, 'idle', `${printer.name}: errore risolto, di nuovo operativa`)}
                style={{
                  background: 'transparent', border: '1px solid var(--cyan)', color: 'var(--cyan)',
                  fontFamily: 'inherit', fontWeight: 600, fontSize: 13,
                  padding: '8px 0', borderRadius: 100, cursor: 'pointer', width: '100%', transition: '0.18s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(63,115,8,.10)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
              >
                Segna risolto
              </button>
            ) : printer.status === 'maintenance' ? (
              <button
                onClick={() => setStatus(printer.id, 'idle', `${printer.name}: manutenzione completata`)}
                style={{
                  background: 'transparent', border: '1px solid var(--line-2)', color: 'var(--muted)',
                  fontFamily: 'inherit', fontWeight: 600, fontSize: 13,
                  padding: '8px 0', borderRadius: 100, cursor: 'pointer', width: '100%', transition: '0.18s',
                }}
              >
                Fine manutenzione
              </button>
            ) : printer.status === 'active' && printer.orderId && orderByOrdNum(printer.orderId) ? (
              <button
                onClick={() => navigate(`/fablab/ordini/${orderByOrdNum(printer.orderId!)!.id}`)}
                style={{
                  background: 'transparent', border: '1px solid var(--cyan)', color: 'var(--cyan)',
                  fontFamily: 'inherit', fontWeight: 600, fontSize: 13,
                  padding: '8px 0', borderRadius: 100, cursor: 'pointer', width: '100%', transition: '0.18s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(63,115,8,.10)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
              >
                Vedi ordine in stampa →
              </button>
            ) : (
              <button
                onClick={() => navigate('/fablab/coda')}
                style={{
                  background: 'transparent', border: '1px solid var(--line-2)', color: 'var(--muted)',
                  fontFamily: 'inherit', fontWeight: 600, fontSize: 13,
                  padding: '8px 0', borderRadius: 100, cursor: 'pointer', width: '100%', transition: '0.18s',
                }}
              >
                Assegna dalla coda →
              </button>
            )}
          </GlassCard>
        ))}
      </div>
    </>
  )
}
