import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import GlassCard from '../../components/GlassCard'
import StatusPill from '../../components/StatusPill'
import PrintViewer3D from '../../components/PrintViewer3D'
import ProgressBar from '../../components/ProgressBar'
import PrimaryButton from '../../components/PrimaryButton'
import { userProjects, projectTimeline } from '../../mock'
import { toast } from '../../components/Toast'

export default function ProgettoDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [confirmCancel, setConfirmCancel] = useState(false)

  const project = userProjects.find(p => p.id === id)

  if (!project) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 16 }}>
        <span style={{ fontSize: 16, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
          Progetto non trovato
        </span>
        <button
          onClick={() => navigate('/app/progetti')}
          style={{
            background: 'transparent', color: 'var(--cyan)', border: '1px solid var(--line-2)',
            fontFamily: 'inherit', fontWeight: 600, fontSize: 13.5, padding: '10px 22px',
            borderRadius: 100, cursor: 'pointer',
          }}
        >
          ← Torna ai progetti
        </button>
      </div>
    )
  }

  const isDraft = project.status === 'draft'
  const timelineSteps = projectTimeline(project)
  const currentStep = timelineSteps.reduce((acc, s, i) => (s.done ? i : acc), -1)

  return (
    <>
      <style>{`
        @keyframes pulseRing {
          0%, 100% { box-shadow: 0 0 0 0 rgba(63,115,8,0.5); }
          50% { box-shadow: 0 0 0 6px rgba(63,115,8,0); }
        }
      `}</style>

      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: '0 0 auto' }}>
        <button
          onClick={() => navigate('/app/progetti')}
          aria-label="Torna ai progetti"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--glass)',
            border: '1px solid var(--line-2)',
            borderRadius: 10,
            color: 'var(--ink)',
            fontFamily: 'inherit',
            fontWeight: 600,
            fontSize: 13,
            padding: '9px 14px',
            cursor: 'pointer',
            transition: 'background .15s, border-color .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--glass-2)'; e.currentTarget.style.borderColor = 'var(--cyan)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--glass)'; e.currentTarget.style.borderColor = 'var(--line-2)' }}
        >
          <ArrowLeft size={15} />
          Progetti
        </button>
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--muted-2)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Progetti / {project.name}
          </div>
          <h1 style={{ fontWeight: 600, fontSize: 22, letterSpacing: '-0.01em', color: 'var(--ink)', marginTop: 2 }}>
            {project.name}
          </h1>
        </div>
        <div style={{ flex: 1 }} />
        {!isDraft && (
          <PrimaryButton onClick={() => navigate('/app/messages', { state: { conversationId: project.conversationId } })}>
            <MessageSquare size={16} />
            Scrivi al produttore
          </PrimaryButton>
        )}
      </div>

      {/* Main 3-col layout, timeline e gestione in evidenza a destra */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1.3fr 1.1fr', gap: 16, minHeight: 0 }}>

        {/* Left: project details */}
        <GlassCard style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink)' }}>
            Dettagli progetto
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Status */}
            <div>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>STATO</div>
              <StatusPill status={project.status} />
            </div>

            {/* Material */}
            <div>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>MATERIALE</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{project.material || '-'}</div>
            </div>

            {/* FabLab */}
            <div>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>FABLAB</div>
              {project.producerId ? (
                <div
                  onClick={() => navigate(`/app/produttori/${project.producerId}`)}
                  title="Apri il profilo del produttore"
                  style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--cyan)', cursor: 'pointer' }}
                >
                  {project.fablab} →
                </div>
              ) : (
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{project.fablab || '-'}</div>
              )}
            </div>

            {/* Progress */}
            <div>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>AVANZAMENTO</div>
              <ProgressBar value={project.progress} label={`${project.progress}%`} />
            </div>

            {/* ETA */}
            <div>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>ETA</div>
              <div style={{ fontSize: 13.5, fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--ink)' }}>{project.eta || '-'}</div>
            </div>

            {/* Order date */}
            <div>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>DATA ORDINE</div>
              <div style={{ fontSize: 13.5, fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--ink)' }}>{project.orderDate ?? '-'}</div>
            </div>

            {/* Estimated cost */}
            <div>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>COSTO STIMATO</div>
              <div style={{ fontSize: 13.5, fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--ink)' }}>{project.cost ?? '-'}</div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {isDraft ? (
              <button
                onClick={() => navigate('/app/new', { state: { modelName: project.name } })}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: 'var(--forest)', color: '#fff', border: 'none',
                  fontFamily: 'inherit', fontWeight: 700, fontSize: 14,
                  padding: '0 20px', height: 44, borderRadius: 100, cursor: 'pointer',
                  width: '100%', transition: '0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--cyan)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--forest)' }}
              >
                Scegli produttore →
              </button>
            ) : (
              <>
                {project.status === 'printing' && (
                  confirmCancel ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, border: '1px dashed var(--line-2)', borderRadius: 11, padding: 12 }}>
                      <span style={{ fontSize: 12.5, color: 'var(--ink)', fontWeight: 600, textAlign: 'center' }}>
                        Annullare l'ordine? La stampa in corso verrà interrotta.
                      </span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => {
                            toast('Ordine annullato')
                            navigate('/app/progetti')
                          }}
                          style={{
                            flex: 1, background: 'transparent', color: '#e40014', border: '1px dashed #e40014',
                            fontFamily: 'inherit', fontWeight: 600, fontSize: 12.5, padding: '8px 0',
                            borderRadius: 100, cursor: 'pointer',
                          }}
                        >
                          Sì, annulla
                        </button>
                        <button
                          onClick={() => setConfirmCancel(false)}
                          style={{
                            flex: 1, background: 'transparent', color: 'var(--muted)', border: '1px solid var(--line)',
                            fontFamily: 'inherit', fontWeight: 600, fontSize: 12.5, padding: '8px 0',
                            borderRadius: 100, cursor: 'pointer',
                          }}
                        >
                          No, continua
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmCancel(true)}
                      style={{
                        background: 'transparent', color: 'var(--muted)', border: '1px solid var(--line)',
                        fontFamily: 'inherit', fontWeight: 600, fontSize: 13, padding: '10px 0',
                        borderRadius: 100, cursor: 'pointer', width: '100%',
                      }}
                    >
                      Annulla ordine
                    </button>
                  )
                )}
              </>
            )}
          </div>
        </GlassCard>

        {/* Center: 3D viewer hero */}
        <GlassCard
          hero
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Reg marks */}
          <div className="reg-marks">
            <div className="reg-tl" />
            <div className="reg-tr" />
            <div className="reg-bl" />
            <div className="reg-br" />
          </div>

          {/* Caption */}
          <div
            style={{
              position: 'absolute',
              top: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 10,
              fontFamily: 'var(--mono)',
              color: 'var(--muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              zIndex: 10,
            }}
          >
            FIG. 01, MODEL PREVIEW
          </div>

          {/* 3D Viewer, modello reale scansionato, clipping sull'avanzamento del progetto */}
          <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
            <PrintViewer3D modelUrl="/meshes/remote.glb" progress={isDraft ? 100 : project.progress} tone="light" />
          </div>

          {/* Progress badge (solo se la stampa esiste davvero) */}
          {!isDraft && (
            <div
              style={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10,
                background: 'rgba(255,255,255,0.85)',
                border: '1px solid var(--line-2)',
                borderRadius: 100,
                padding: '6px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                AVANZAMENTO STAMPA
              </span>
              <div
                style={{
                  width: 80,
                  height: 5,
                  borderRadius: 0,
                  background: 'rgba(63,115,8,.14)',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <span
                  className="progress-track-fill progress-track-fill-striped"
                  style={{ width: `${project.progress}%`, display: 'block', height: '100%' }}
                />
              </div>
              <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--cyan)', fontWeight: 700 }}>
                {project.progress}%
              </span>
            </div>
          )}
        </GlassCard>

        {/* Right: timeline + gestione, la parte in evidenza della pagina */}
        <GlassCard hero style={{ padding: 22, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink)' }}>
              Timeline del progetto
            </h3>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: 'var(--cyan)' }}>
              {Math.max(currentStep + 1, 0)}/{timelineSteps.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {timelineSteps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 14 }}>
                {/* Left: dot + connector */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto' }}>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: step.done ? 'var(--cyan)' : 'transparent',
                      border: step.done ? 'none' : '1.5px solid var(--line-2)',
                      flex: '0 0 auto',
                      marginTop: i === currentStep ? 15 : 3,
                      animation: i === currentStep && project.status === 'printing' ? 'pulseRing 2s infinite' : 'none',
                    }}
                  />
                  {i < timelineSteps.length - 1 && (
                    <div
                      style={{
                        width: 2,
                        flex: 1,
                        minHeight: 30,
                        background: step.done && timelineSteps[i + 1].done ? 'var(--cyan)' : 'var(--line)',
                      }}
                    />
                  )}
                </div>

                {/* Right: content, lo step corrente è un blocco evidenziato */}
                <div
                  style={{
                    flex: 1,
                    marginBottom: i < timelineSteps.length - 1 ? 14 : 0,
                    ...(i === currentStep
                      ? {
                          background: 'rgba(63,115,8,.07)',
                          border: '1px solid var(--line-2)',
                          borderRadius: 10,
                          padding: '11px 14px',
                        }
                      : { padding: '0 0 6px' }),
                  }}
                >
                  <div
                    style={{
                      fontSize: i === currentStep ? 15 : 13.5,
                      fontWeight: i === currentStep ? 700 : 500,
                      color: step.done ? 'var(--ink)' : 'var(--muted)',
                      marginBottom: 3,
                    }}
                  >
                    {step.label}
                  </div>
                  <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: i === currentStep ? 'var(--cyan)' : 'var(--muted)' }}>
                    {step.date}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA messaggi in coda alla timeline */}
          {!isDraft && (
            <div style={{ marginTop: 'auto', paddingTop: 18, borderTop: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted-2)' }}>
                Domande sulla stampa?
              </span>
              <button
                onClick={() => navigate('/app/messages', { state: { conversationId: project.conversationId } })}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: 'transparent', color: 'var(--cyan)', border: '1px solid var(--cyan)',
                  fontFamily: 'inherit', fontWeight: 600, fontSize: 13.5,
                  height: 42, borderRadius: 100, cursor: 'pointer', transition: 'background .15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(63,115,8,.07)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <MessageSquare size={15} />
                Apri la chat con {project.fablab}
              </button>
            </div>
          )}
        </GlassCard>
      </div>
    </>
  )
}
