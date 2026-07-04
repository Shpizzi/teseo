import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, ArrowUp, ArrowDown } from 'lucide-react'
import GlassCard from '../../components/GlassCard'
import { printQueue, printersFull } from '../../mock/fablab-pages'
import { orderByOrdNum, type DeadlineType } from '../../mock'
import { toast } from '../../components/Toast'

// Somma le stringhe tipo "2h 10m" / "45m" per l'ETA complessiva
function sumEta(times: string[]): string {
  let mins = 0
  for (const t of times) {
    mins += 60 * (Number(/(\d+)h/.exec(t)?.[1]) || 0) + (Number(/(\d+)m/.exec(t)?.[1]) || 0)
  }
  return `~${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m`
}

const DEADLINE_RANK: Record<DeadlineType, number> = { urgent: 0, today: 1, week: 2 }

// ── Coda ──────────────────────────────────────────────────────
export default function Coda() {
  const navigate = useNavigate()
  const [queue, setQueue] = useState(printQueue)
  const activePrinters = printersFull.filter(p => p.status === 'active')
  const queuedItems = queue.filter(q => q.status === 'queued')
  const printingCount = queue.filter(q => q.status === 'printing').length

  // Sposta un elemento in coda di una posizione (solo tra i queued)
  const move = (id: string, dir: -1 | 1) => {
    setQueue(prev => {
      const queued = prev.filter(q => q.status === 'queued').sort((a, b) => a.position - b.position)
      const idx = queued.findIndex(q => q.id === id)
      const swapWith = queued[idx + dir]
      if (idx === -1 || !swapWith) return prev
      return prev.map(q =>
        q.id === id ? { ...q, position: swapWith.position }
        : q.id === swapWith.id ? { ...q, position: queued[idx].position }
        : q)
    })
  }

  // Riordina i queued per scadenza dell'ordine collegato
  const optimize = () => {
    setQueue(prev => {
      const queued = prev.filter(q => q.status === 'queued')
      const positions = queued.map(q => q.position).sort((a, b) => a - b)
      const sorted = [...queued].sort((a, b) =>
        (DEADLINE_RANK[orderByOrdNum(a.ordNum)?.deadline ?? 'week']) -
        (DEADLINE_RANK[orderByOrdNum(b.ordNum)?.deadline ?? 'week']))
      const posById = new Map(sorted.map((q, i) => [q.id, positions[i]]))
      return prev.map(q => posById.has(q.id) ? { ...q, position: posById.get(q.id)! } : q)
    })
    toast('Coda riordinata per scadenza')
  }

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
            {queue.length} ELEMENTI · {printingCount} IN STAMPA
          </p>
        </div>
        <div style={{ flex: 1 }} />
        <button
          title="Riordina gli elementi in coda mettendo prima le scadenze più vicine"
          onClick={optimize}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: 'transparent', border: '1px solid var(--cyan)',
            color: 'var(--cyan)', fontFamily: 'inherit', fontWeight: 600, fontSize: 14,
            padding: '0 20px', height: 44, borderRadius: 100, cursor: 'pointer',
            transition: '0.18s', whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(63,115,8,.10)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
        >
          <Zap size={16} /> Ordina per scadenza
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
            {queue.length === 0 && (
              <div style={{ padding: 28, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                Coda vuota —{' '}
                <Link to="/fablab/ordini" style={{ color: 'var(--cyan)', fontWeight: 600, textDecoration: 'none' }}>
                  accetta un ordine
                </Link>{' '}
                per riempirla.
              </div>
            )}
            {[...queue].sort((a, b) => a.position - b.position).map(item => {
              const linkedOrder = orderByOrdNum(item.ordNum)
              return (
              <div
                key={item.id}
                onClick={linkedOrder ? () => navigate(`/fablab/ordini/${linkedOrder.id}`) : undefined}
                title={linkedOrder ? 'Apri il dettaglio ordine' : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: 14, borderRadius: 'var(--radius-sm)',
                  background: 'var(--glass)', border: '1px solid var(--line)',
                  transition: '0.18s',
                  cursor: linkedOrder ? 'pointer' : 'default',
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
                  color: item.status === 'printing' ? '#f4faed' : 'var(--muted)',
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
                    <div style={{ width: 60, height: 4, borderRadius: 4, background: 'rgba(63,115,8,.14)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${item.progress}%`, background: 'var(--cyan)' }} />
                    </div>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: 'var(--cyan)', flex: '0 0 auto' }}>
                      {item.progress}%
                    </span>
                  </div>
                )}
                {item.status === 'queued' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: '0 0 auto' }} onClick={e => e.stopPropagation()}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>
                      {item.estimatedTime}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <button
                        onClick={() => move(item.id, -1)}
                        aria-label="Sposta su nella coda"
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'grid', color: 'var(--muted)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--cyan)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)' }}
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        onClick={() => move(item.id, 1)}
                        aria-label="Sposta giù nella coda"
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'grid', color: 'var(--muted)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--cyan)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)' }}
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Status pill — pausa non è un errore: pill neutra tratteggiata */}
                {item.status === 'printing' && <span className="status-pill sp-print" style={{ flex: '0 0 auto' }}>In stampa</span>}
                {item.status === 'queued'   && <span className="status-pill sp-new"   style={{ flex: '0 0 auto' }}>In coda</span>}
                {item.status === 'paused'   && <span className="status-pill sp-new"   style={{ flex: '0 0 auto', borderStyle: 'dashed' }}>In pausa</span>}
              </div>
            )})}
          </div>

          {/* Footer stats */}
          <div style={{
            borderTop: '1px solid var(--line)', paddingTop: 14, marginTop: 14,
            display: 'flex', alignItems: 'center', gap: 20, flex: '0 0 auto',
          }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Totale elementi</div>
              <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>{queue.length}</div>
            </div>
            <div style={{ width: 1, height: 30, background: 'var(--line)' }} />
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>ETA completamento</div>
              <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 16, color: 'var(--cyan)' }}>{sumEta(queue.map(q => q.estimatedTime))}</div>
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
              {[...queuedItems].sort((a, b) => a.position - b.position).map(item => (
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
