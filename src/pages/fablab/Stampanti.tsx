import PrimaryButton from '../../components/PrimaryButton'
import GlassCard from '../../components/GlassCard'
import { printersFull, type PrinterFull } from '../../mock/fablab-pages'

// ── Printer status pill inline ────────────────────────────────
function PrinterStatusPill({ status }: { status: PrinterFull['status'] }) {
  if (status === 'active') return <span className="status-pill sp-print">In stampa</span>
  if (status === 'idle')   return <span className="status-pill sp-new">Inattiva</span>
  if (status === 'error')  return <span className="status-pill sp-err">Errore</span>
  // maintenance: sp-new variant with dashed border
  return (
    <span className="status-pill" style={{
      background: 'transparent', border: '1px dashed var(--line-2)', color: '#fff',
    }}>
      Manutenzione
    </span>
  )
}

// ── Printer dot ───────────────────────────────────────────────
function PrinterDot({ status }: { status: PrinterFull['status'] }) {
  if (status === 'active') return <span className="pdot-active" style={{ width: 10, height: 10, borderRadius: '50%', flex: '0 0 auto', display: 'block' }} />
  if (status === 'idle')   return <span className="pdot-idle"   style={{ width: 10, height: 10, borderRadius: '50%', flex: '0 0 auto', display: 'block' }} />
  return <span className="pdot-err" style={{ width: 10, height: 10, borderRadius: '50%', flex: '0 0 auto', display: 'block' }} />
}

// ── Stampanti ─────────────────────────────────────────────────
export default function Stampanti() {
  const active = printersFull.filter(p => p.status === 'active').length
  const idle = printersFull.filter(p => p.status === 'idle').length
  const error = printersFull.filter(p => p.status === 'error').length
  const maintenance = printersFull.filter(p => p.status === 'maintenance').length

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
            6 STAMPANTI · 2 ATTIVE
          </p>
        </div>
        <div style={{ flex: 1 }} />
        <PrimaryButton>
          + Aggiungi stampante
        </PrimaryButton>
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
              {active}/{printersFull.length}
            </div>
          </div>

          {/* Text info */}
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>
              {Math.round(active / printersFull.length * 100)}% utilizzo
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--muted)', marginTop: 3 }}>
              {active} attive · {idle} idle · {error} errore · {maintenance} manutenzione
            </div>
          </div>

          <div style={{ flex: 1 }} />

          {/* 4 counters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {[
              { label: 'ATTIVE',  value: String(active).padStart(2, '0') },
              { label: 'IDLE',    value: String(idle).padStart(2, '0') },
              { label: 'ERRORE',  value: String(error).padStart(2, '0') },
              { label: 'MANUT.',  value: String(maintenance).padStart(2, '0') },
            ].map((c, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                  {c.label}
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 18, color: 'var(--ink)' }}>
                  {c.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* ── Printer grid ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14,
        flex: 1, overflow: 'auto', alignContent: 'start',
      }}>
        {printersFull.map(printer => (
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
                <div style={{ height: 4, borderRadius: 4, background: 'rgba(174,227,249,.14)', overflow: 'hidden', marginBottom: 5 }}>
                  <div style={{ height: '100%', width: `${printer.progress}%`, background: 'var(--cyan)', transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--cyan)', letterSpacing: '0.04em' }}>
                  ORD #{printer.orderId}
                </span>
              </div>
            )}

            {/* Error: error message */}
            {printer.status === 'error' && printer.errorMessage && (
              <div style={{
                fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)',
                borderLeft: '2px solid var(--cyan)', paddingLeft: 8, margin: '4px 0 8px',
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

            {/* Gestisci button */}
            <button style={{
              background: 'transparent', border: '1px solid var(--cyan)', color: 'var(--cyan)',
              fontFamily: 'inherit', fontWeight: 600, fontSize: 13,
              padding: '8px 0', borderRadius: 100, cursor: 'pointer', width: '100%',
              transition: '0.18s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(174,227,249,.10)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
            >
              Gestisci
            </button>
          </GlassCard>
        ))}
      </div>
    </>
  )
}
