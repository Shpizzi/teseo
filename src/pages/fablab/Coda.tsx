import { Link } from 'react-router-dom'
import { Zap, ArrowUp, ArrowDown } from 'lucide-react'
import GlassCard from '../../components/GlassCard'
import { printQueue, printersFull } from '../../mock/fablab-pages'

// ── Coda ──────────────────────────────────────────────────────
export default function Coda() {
  const activePrinters = printersFull.filter(p => p.status === 'active')
  const queuedItems = printQueue.filter(q => q.status === 'queued')

  return (
    <>
      {/* ── Topbar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: '0 0 auto' }}>
        <div>
          <h1 style={{ fontWeight: 600, fontSize: 25, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
            Coda di stampa
          </h1>
          <p style={{
            color: 'var(--muted)', fontSize: 12, marginTop: 3,
            fontWeight: 500, fontFamily: 'var(--mono)', letterSpacing: '0.02em',
          }}>
            5 ELEMENTI · 2 IN STAMPA
          </p>
        </div>
        <div style={{ flex: 1 }} />
        <button style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'transparent', border: '1px solid var(--cyan)',
          color: 'var(--cyan)', fontFamily: 'inherit', fontWeight: 600, fontSize: 14,
          padding: '0 20px', height: 44, borderRadius: 100, cursor: 'pointer',
          transition: '0.18s', whiteSpace: 'nowrap',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(174,227,249,.10)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
        >
          <Zap size={16} /> Ottimizza coda
        </button>
      </div>

      {/* ── 2-column layout ── */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, minHeight: 0, overflow: 'hidden' }}>

        {/* ── Colonna sinistra: Coda attiva ── */}
        <GlassCard hero style={{ padding: 20, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flex: '0 0 auto' }}>
            <h3 style={{
              fontWeight: 600, fontSize: 13, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: 'var(--ink)',
            }}>
              Coda attiva
            </h3>
            <Link
              to="/fablab/stampanti"
              style={{
                fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--cyan)',
                fontWeight: 600, letterSpacing: '0.04em', textDecoration: 'none',
              }}
            >
              GESTISCI STAMPANTI ›
            </Link>
          </div>

          {/* Queue list */}
          <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {printQueue.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: 14, borderRadius: 'var(--radius-sm)',
                  background: 'var(--glass)', border: '1px solid var(--line)',
                  transition: '0.18s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--line-2)'
                  ;(e.currentTarget as HTMLDivElement).style.background = 'var(--glass-2)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--line)'
                  ;(e.currentTarget as HTMLDivElement).style.background = 'var(--glass)'
                }}
              >
                {/* Position badge */}
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: item.status === 'printing' ? 'var(--cyan)' : 'var(--glass-2)',
                  border: item.status === 'printing' ? 'none' : '1px solid var(--line-2)',
                  display: 'grid', placeItems: 'center',
                  fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
                  color: item.status === 'printing' ? '#08233f' : 'var(--muted)',
                  flex: '0 0 24px',
                }}>
                  {String(item.position + 1).padStart(2, '0')}
                </div>

                {/* Thumb mini */}
                <div className="thumb-mini" style={{ width: 40, height: 40 }} />

                {/* Meta */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--cyan)', letterSpacing: '0.05em', marginBottom: 2 }}>
                    ORD · {item.ordNum}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                    {item.material}
                    {item.status === 'printing' && item.printerId ? ` · ${item.printerId}` : ''}
                    {item.status === 'queued' ? ' · in coda' : ''}
                  </div>
                </div>

                {/* Progress (printing) or ETA + reorder (queued) */}
                {item.status === 'printing' && item.progress !== undefined && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto' }}>
                    <div style={{ width: 60, height: 4, borderRadius: 4, background: 'rgba(174,227,249,.14)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${item.progress}%`, background: 'var(--cyan)' }} />
                    </div>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: 'var(--cyan)', flex: '0 0 auto' }}>
                      {item.progress}%
                    </span>
                  </div>
                )}
                {item.status === 'queued' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: '0 0 auto' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>
                      {item.estimatedTime}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <ArrowUp size={12} color="var(--muted)" style={{ cursor: 'pointer' }} />
                      <ArrowDown size={12} color="var(--muted)" style={{ cursor: 'pointer' }} />
                    </div>
                  </div>
                )}

                {/* Status pill */}
                {item.status === 'printing' && <span className="status-pill sp-print" style={{ flex: '0 0 auto' }}>In stampa</span>}
                {item.status === 'queued'   && <span className="status-pill sp-new"   style={{ flex: '0 0 auto' }}>In coda</span>}
                {item.status === 'paused'   && <span className="status-pill sp-err"   style={{ flex: '0 0 auto' }}>In pausa</span>}
              </div>
            ))}
          </div>

          {/* Footer stats */}
          <div style={{
            borderTop: '1px solid var(--line)', paddingTop: 14, marginTop: 14,
            display: 'flex', alignItems: 'center', gap: 20, flex: '0 0 auto',
          }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Totale elementi</div>
              <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>{printQueue.length}</div>
            </div>
            <div style={{ width: 1, height: 30, background: 'var(--line)' }} />
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>ETA completamento</div>
              <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 16, color: 'var(--cyan)' }}>~14h 30m</div>
            </div>
          </div>
        </GlassCard>

        {/* ── Colonna destra ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0, overflow: 'hidden' }}>

          {/* Top: Stampanti attive */}
          <GlassCard style={{ padding: 18, display: 'flex', flexDirection: 'column', flex: '0 0 auto' }}>
            <h3 style={{
              fontWeight: 600, fontSize: 12, letterSpacing: '0.07em',
              textTransform: 'uppercase', color: 'var(--ink)', marginBottom: 14,
            }}>
              Stampanti attive
            </h3>

            {/* Utilization ring + info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div className="conic-ring">
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', background: 'var(--bg-2)',
                  display: 'grid', placeItems: 'center',
                  fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 12, color: 'var(--ink)',
                }}>
                  {activePrinters.length}/{printersFull.length}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>
                  {Math.round(activePrinters.length / printersFull.length * 100)}% utilizzo
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--muted)', marginTop: 3 }}>
                  {activePrinters.length} attive · {printersFull.filter(p => p.status === 'idle').length} idle
                </div>
              </div>
            </div>

            {/* Active printer list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {activePrinters.map(p => (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 11,
                  background: 'var(--glass)', border: '1px solid var(--line)',
                }}>
                  <span className="pdot-active" style={{ width: 10, height: 10, borderRadius: '50%', flex: '0 0 auto', display: 'block' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{p.name}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--muted)', marginTop: 1 }}>
                      {p.orderId} · {p.material}
                    </div>
                  </div>
                  <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 12, color: 'var(--cyan)' }}>
                    {p.progress}%
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Bottom: Prossime in coda */}
          <GlassCard style={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <h3 style={{
              fontWeight: 600, fontSize: 12, letterSpacing: '0.07em',
              textTransform: 'uppercase', color: 'var(--ink)', marginBottom: 14,
              flex: '0 0 auto',
            }}>
              Prossime in coda
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto', flex: 1 }}>
              {queuedItems.map(item => (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 11,
                  background: 'var(--glass)', border: '1px solid var(--line)',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--cyan)', marginBottom: 2 }}>
                      ORD · {item.ordNum}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </div>
                  </div>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', flex: '0 0 auto' }}>
                    {item.estimatedTime}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  )
}
