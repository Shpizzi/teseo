import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import GlassCard from '../../components/GlassCard'
import StatusPill from '../../components/StatusPill'
import PrintViewer3D from '../../components/PrintViewer3D'
import ProgressBar from '../../components/ProgressBar'
import { userProjects } from '../../mock'

const timelineSteps = [
  { label: 'Richiesta inviata', date: '15 mag 2025', done: true, current: false },
  { label: 'Accettato da FabLab Lambrate', date: '15 mag 2025', done: true, current: false },
  { label: 'In stampa', date: '16 mag 2025', done: true, current: true },
  { label: 'Pronto al ritiro', date: '—', done: false, current: false },
]

export default function ProgettoDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [viewerProgress, setViewerProgress] = useState(0)

  const project = userProjects.find(p => p.id === id)

  if (!project) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, fontSize: 16, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
        Progetto non trovato
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes pulseRing {
          0%, 100% { box-shadow: 0 0 0 0 rgba(63,115,8,0.5); }
          50% { box-shadow: 0 0 0 6px rgba(63,115,8,0); }
        }
      `}</style>

      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: '0 0 auto' }}>
        <button
          onClick={() => navigate('/app/progetti')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--muted)',
            fontFamily: 'var(--mono)',
            fontSize: 12,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          ← Progetti
        </button>
        <div>
          <h1 style={{ fontWeight: 600, fontSize: 22, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
            {project.name}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 3, fontFamily: 'var(--mono)', letterSpacing: '0.02em' }}>
            {project.fablab || 'Nessun produttore'} · {project.material || '—'}
          </p>
        </div>
      </div>

      {/* Main 3-col layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr', gap: 16, minHeight: 0 }}>

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
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{project.material || '—'}</div>
            </div>

            {/* FabLab */}
            <div>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>FABLAB</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--cyan)', cursor: 'pointer' }}>{project.fablab || '—'}</div>
            </div>

            {/* Progress */}
            <div>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>AVANZAMENTO</div>
              <ProgressBar value={project.progress} label={`${project.progress}%`} />
            </div>

            {/* ETA */}
            <div>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>ETA</div>
              <div style={{ fontSize: 13.5, fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--ink)' }}>{project.eta || '—'}</div>
            </div>

            {/* Order date */}
            <div>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>DATA ORDINE</div>
              <div style={{ fontSize: 13.5, fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--ink)' }}>15 mag 2025</div>
            </div>

            {/* Estimated cost */}
            <div>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>COSTO STIMATO</div>
              <div style={{ fontSize: 13.5, fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--ink)' }}>€ 12.80</div>
            </div>
          </div>

          <div style={{ marginTop: 'auto' }}>
            <button
              onClick={() => navigate('/app/messages')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                background: 'var(--forest)',
                color: '#fff',
                border: 'none',
                fontFamily: 'inherit',
                fontWeight: 700,
                fontSize: 14,
                padding: '0 20px',
                height: 44,
                borderRadius: 100,
                cursor: 'pointer',
                width: '100%',
                transition: '0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--cyan)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--forest)' }}
            >
              Contatta produttore
            </button>
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
            FIG. 01 — MODEL PREVIEW
          </div>

          {/* 3D Viewer */}
          <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
            <PrintViewer3D onProgressChange={setViewerProgress} />
          </div>

          {/* Progress badge */}
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
                style={{ width: `${viewerProgress}%`, display: 'block', height: '100%' }}
              />
            </div>
            <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--cyan)', fontWeight: 700 }}>
              {viewerProgress}%
            </span>
          </div>
        </GlassCard>

        {/* Right: timeline */}
        <GlassCard style={{ padding: 22, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink)', marginBottom: 20 }}>
            Timeline
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {timelineSteps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 14 }}>
                {/* Left: dot + connector */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto' }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: step.done ? 'var(--cyan)' : 'transparent',
                      border: step.done ? 'none' : '1.5px solid var(--line-2)',
                      flex: '0 0 auto',
                      marginTop: 3,
                      animation: step.current ? 'pulseRing 2s infinite' : 'none',
                    }}
                  />
                  {i < timelineSteps.length - 1 && (
                    <div
                      style={{
                        width: 1,
                        flex: 1,
                        minHeight: 32,
                        background: 'var(--line)',
                      }}
                    />
                  )}
                </div>

                {/* Right: content */}
                <div style={{ paddingBottom: i < timelineSteps.length - 1 ? 24 : 0 }}>
                  <div
                    style={{
                      fontSize: step.current ? 15 : 13.5,
                      fontWeight: step.current ? 700 : 500,
                      color: step.done ? 'var(--ink)' : 'var(--muted)',
                      marginBottom: 3,
                    }}
                  >
                    {step.label}
                  </div>
                  <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>
                    {step.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </>
  )
}
