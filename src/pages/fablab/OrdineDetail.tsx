import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MessageSquare, ArrowLeft } from 'lucide-react'
import GlassCard from '../../components/GlassCard'
import PrintViewer3D from '../../components/PrintViewer3D'
import { orderDetails } from '../../mock/fablab-pages'
import type { DeadlineType } from '../../mock'

// ── DeadlineChip ──────────────────────────────────────────────
function DeadlineChip({ type, label }: { type: DeadlineType; label: string }) {
  const cls = type === 'urgent' ? 'dl-urgent' : type === 'today' ? 'dl-today' : 'dl-week'
  return (
    <span
      className={cls}
      style={{
        fontFamily: 'var(--mono)', fontSize: 10,
        padding: '3px 8px', borderRadius: 5, display: 'inline-block',
      }}
    >
      {label}
    </span>
  )
}

// ── Field row ─────────────────────────────────────────────────
function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span style={{
        fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--muted)',
        textTransform: 'uppercase', letterSpacing: '0.08em',
      }}>
        {label}
      </span>
      {children}
    </div>
  )
}

// ── OrdineDetail ──────────────────────────────────────────────
export default function OrdineDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [progress, setProgress] = useState(62)

  const order = orderDetails.find(o => o.id === id)

  if (!order) {
    return (
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 12,
      }}>
        <p style={{ fontFamily: 'var(--mono)', color: 'var(--muted)', fontSize: 14 }}>
          Ordine non trovato
        </p>
        <button
          onClick={() => navigate('/fablab/ordini')}
          style={{
            background: 'transparent', border: '1px solid var(--line-2)', color: 'var(--cyan)',
            fontFamily: 'inherit', fontWeight: 600, fontSize: 13,
            padding: '8px 18px', borderRadius: 100, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <ArrowLeft size={15} /> Torna agli ordini
        </button>
      </div>
    )
  }

  // First pending step index
  const currentStepIdx = order.timeline.findIndex(s => !s.done)

  return (
    <>
      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: '0 0 auto' }}>
        <button
          onClick={() => navigate('/fablab/ordini')}
          style={{
            background: 'transparent', border: '1px solid var(--line)',
            color: 'var(--muted)', fontFamily: 'inherit', fontWeight: 600, fontSize: 13,
            padding: '8px 14px', borderRadius: 100, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <ArrowLeft size={14} /> Ordini
        </button>
        <div>
          <h1 style={{ fontWeight: 600, fontSize: 22, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
            {order.name}
          </h1>
          <p style={{
            color: 'var(--muted)', fontSize: 12, marginTop: 2,
            fontFamily: 'var(--mono)', letterSpacing: '0.02em',
          }}>
            ORD · {order.ordNum}
          </p>
        </div>
      </div>

      {/* 3-column layout */}
      <div style={{
        flex: 1, display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr',
        gap: 16, minHeight: 0, overflow: 'hidden',
      }}>

        {/* ── Colonna sinistra: Dettagli stampa ── */}
        <GlassCard style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 0, overflow: 'auto' }}>
          <h3 style={{
            fontWeight: 600, fontSize: 12, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--ink)', marginBottom: 14,
          }}>
            Dettagli stampa
          </h3>

          {/* Header: ordNum + nome + chip */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--cyan)', letterSpacing: '0.04em' }}>
                {order.ordNum}
              </span>
              <DeadlineChip type={order.deadline} label={order.deadlineLabel} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--ink)', lineHeight: 1.25 }}>
              {order.name}
            </div>
          </div>

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
            <FieldRow label="Materiale">
              <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{order.material}</span>
            </FieldRow>

            <FieldRow label="Dimensioni">
              <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink)' }}>{order.dimensions}</span>
            </FieldRow>

            <FieldRow label="Infill">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink)' }}>{order.infill}%</span>
                <div style={{ width: 40, height: 4, borderRadius: 4, background: 'rgba(174,227,249,.14)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${order.infill}%`, background: 'var(--cyan)' }} />
                </div>
              </div>
            </FieldRow>

            <FieldRow label="Layer Height">
              <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink)' }}>{order.layerHeight}</span>
            </FieldRow>

            <FieldRow label="Supporti">
              <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{order.supports ? 'Sì' : 'No'}</span>
            </FieldRow>

            <FieldRow label="Tempo stimato">
              <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--cyan)', fontWeight: 600 }}>{order.estimatedTime}</span>
            </FieldRow>

            <FieldRow label="Costo stimato">
              <span style={{ fontFamily: 'var(--mono)', fontSize: 16, color: 'var(--ink)', fontWeight: 700 }}>{order.estimatedCost}</span>
            </FieldRow>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--line)', margin: '16px 0' }} />

          {/* Note */}
          {order.notes && (
            <div style={{
              background: 'var(--glass-2)', border: '1px solid var(--line)',
              borderRadius: 11, padding: '10px 14px', marginBottom: 14,
              fontSize: 13, color: 'var(--muted)', lineHeight: 1.5,
            }}>
              {order.notes}
            </div>
          )}

          {/* Action buttons */}
          <button style={{
            background: '#fff', border: 'none', color: '#08233f',
            fontFamily: 'inherit', fontWeight: 700, fontSize: 14,
            padding: '11px 0', borderRadius: 100, cursor: 'pointer',
            width: '100%', marginBottom: 8, transition: '0.18s',
          }}
            onClick={() => navigate('/fablab/slicing')}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--cyan)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff' }}
          >
            Avvia stampa
          </button>
          <button style={{
            background: 'transparent', border: '1px solid var(--line-2)', color: 'var(--muted)',
            fontFamily: 'inherit', fontWeight: 600, fontSize: 13,
            padding: '10px 0', borderRadius: 100, cursor: 'pointer', width: '100%',
          }}>
            Rifiuta ordine
          </button>
        </GlassCard>

        {/* ── Colonna centrale: Anteprima oggetto ── */}
        <GlassCard hero style={{ padding: 0, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          {/* Reg marks */}
          <div className="reg-marks">
            <div className="reg-tl" />
            <div className="reg-tr" />
            <div className="reg-bl" />
            <div className="reg-br" />
          </div>

          {/* Caption */}
          <div style={{
            position: 'absolute', top: 20, left: 0, right: 0, zIndex: 5,
            display: 'flex', justifyContent: 'center', pointerEvents: 'none',
          }}>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)',
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              FIG. 01 — PREVIEW ORDINE
            </span>
          </div>

          {/* 3D viewer */}
          <div style={{ flex: 1, position: 'relative' }}>
            <PrintViewer3D onProgressChange={setProgress} />
          </div>

          {/* Progress badge bottom */}
          <div style={{
            position: 'absolute', bottom: 20, left: 20, right: 20, zIndex: 5,
          }}>
            <div style={{
              background: 'rgba(10,35,66,0.82)', backdropFilter: 'blur(10px)',
              border: '1px solid var(--line)', borderRadius: 10,
              padding: '10px 14px',
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6,
              }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Avanzamento
                </span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: 'var(--cyan)' }}>
                  {progress}%
                </span>
              </div>
              <div className="progress-track">
                <span
                  className="progress-track-fill progress-track-fill-striped"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </GlassCard>

        {/* ── Colonna destra: Cliente + Timeline + Chat ── */}
        <GlassCard style={{ padding: 20, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          {/* Section: Cliente */}
          <h3 style={{
            fontWeight: 600, fontSize: 12, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--ink)', marginBottom: 14,
          }}>
            Cliente
          </h3>

          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'var(--glass-2)', border: '1px solid var(--line-2)',
              display: 'grid', placeItems: 'center',
              fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 14, color: 'var(--cyan)',
              flex: '0 0 48px',
            }}>
              {order.customer.initials}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)', lineHeight: 1.2 }}>
                {order.customer.name}
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
                {order.customer.email}
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                {order.customer.phone}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--line)', margin: '4px 0 16px' }} />

          {/* Timeline */}
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Timeline ordine
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>
            {order.timeline.map((step, idx) => {
              const isCurrent = idx === currentStepIdx
              const isLast = idx === order.timeline.length - 1
              return (
                <div key={idx} style={{ display: 'flex', gap: 12, position: 'relative' }}>
                  {/* Dot + vertical line */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto', width: 16 }}>
                    <div style={{
                      width: isCurrent ? 12 : 8,
                      height: isCurrent ? 12 : 8,
                      borderRadius: '50%',
                      background: step.done ? 'var(--cyan)' : 'transparent',
                      border: step.done ? 'none' : `1.5px solid ${isCurrent ? 'var(--cyan)' : 'var(--line-2)'}`,
                      flex: '0 0 auto',
                      marginTop: 4,
                      transition: '0.2s',
                    }} />
                    {!isLast && (
                      <div style={{
                        flex: 1, width: 1, background: 'var(--line)',
                        minHeight: 20, marginTop: 3,
                      }} />
                    )}
                  </div>

                  {/* Label + date */}
                  <div style={{ paddingBottom: isLast ? 0 : 14 }}>
                    <div style={{
                      fontWeight: isCurrent ? 700 : 500,
                      fontSize: 13,
                      color: isCurrent ? 'var(--ink)' : step.done ? 'var(--ink)' : 'var(--muted)',
                      lineHeight: 1.2,
                    }}>
                      {step.label}
                    </div>
                    <div style={{
                      fontFamily: 'var(--mono)', fontSize: 10.5,
                      color: 'var(--muted)', marginTop: 2,
                    }}>
                      {step.date}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--line)', margin: '16px 0' }} />

          {/* Chat */}
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            Chat
          </div>
          <button style={{
            background: 'transparent', border: '1px solid var(--line-2)', color: 'var(--cyan)',
            fontFamily: 'inherit', fontWeight: 600, fontSize: 13,
            padding: '10px 0', borderRadius: 100, cursor: 'pointer', width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          }}>
            <MessageSquare size={15} /> Apri conversazione
          </button>
        </GlassCard>
      </div>
    </>
  )
}
