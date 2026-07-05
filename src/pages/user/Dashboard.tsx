import { Plus, Layers, Clock, CheckCircle2, Bookmark, Star, Box, HelpCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PrimaryButton from '../../components/PrimaryButton'
import KpiCard from '../../components/KpiCard'
import GlassCard from '../../components/GlassCard'
import StatusPill from '../../components/StatusPill'
import ProgressBar from '../../components/ProgressBar'
import TeseoAssistant from '../../components/TeseoAssistant'
import { userProjects, userKpis, nearbyProducers } from '../../mock'
import type { ReactNode } from 'react'
import type { ProjectStatus } from '../../mock'

const kpiIcons = [
  <Layers size={17} />,
  <Clock size={17} />,
  <CheckCircle2 size={17} />,
  <Bookmark size={17} />,
]

const statusIcon: Record<ProjectStatus, ReactNode> = {
  printing: <Box size={26} />,
  ready: <CheckCircle2 size={26} />,
  draft: <Clock size={26} />,
  error: <HelpCircle size={26} />,
}

const kpiTargets = ['/app/progetti', '/app/progetti', '/app/progetti', '/app/salvati']

export default function Dashboard() {
  const navigate = useNavigate()
  const inStampa = userProjects.filter(p => p.status === 'printing').length
  const readyProject = userProjects.find(p => p.status === 'ready')
  return (
    <>
      {/* ── Topbar ── */}
      <div
        className="anim-fadeUp"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          flex: '0 0 auto',
        }}
      >
        <div>
          <h1
            style={{
              fontWeight: 600,
              fontSize: 25,
              letterSpacing: '-0.01em',
              color: 'var(--ink)',
            }}
          >
            Ciao, Francesca
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
            {inStampa} {inStampa === 1 ? 'STAMPA' : 'STAMPE'} IN CORSO{readyProject ? ' · 1 PRONTO AL RITIRO' : ''}
          </p>
        </div>
        <div style={{ flex: 1 }} />
        <PrimaryButton onClick={() => navigate('/app/new')}>
          <Plus size={18} />
          Nuova stampa
        </PrimaryButton>
      </div>

      {/* ── KPI strip ── */}
      <div
        className="anim-fadeUp"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 14,
          flex: '0 0 auto',
        }}
      >
        {userKpis.map((kpi, i) => (
          <KpiCard
            key={kpi.label}
            value={kpi.value}
            label={kpi.label}
            trend={kpi.trend}
            trendUp={kpi.trendUp}
            icon={kpiIcons[i]}
            onClick={() => navigate(kpiTargets[i])}
          />
        ))}
      </div>

      {/* ── Main grid ── */}
      <div
        className="anim-fadeUp"
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1.55fr 1fr',
          gap: 16,
          minHeight: 0,
        }}
      >
        {/* Left: projects hero card */}
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
              marginBottom: 16,
              flex: '0 0 auto',
              position: 'relative',
            }}
          >
            <h3
              style={{
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                fontFamily: 'var(--mono)',
              }}
            >
              Progetti in corso
            </h3>
            <span
              onClick={() => navigate('/app/progetti')}
              style={{
                color: 'var(--cyan)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--mono)',
                letterSpacing: '0.04em',
              }}
            >
              TUTTI I PROGETTI ›
            </span>
          </div>

          {/* Project list — lista pulita a righe, divisori invece di box */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
              position: 'relative',
            }}
          >
            {userProjects.map((project, i) => (
              <div
                key={project.id}
                onClick={() => navigate('/app/progetti/' + project.id)}
                style={{
                  padding: '20px 6px',
                  borderTop: i === 0 ? 'none' : '1px solid var(--line)',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--glass-2)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {/* Icona di stato */}
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 16,
                      flex: '0 0 auto',
                      background: 'var(--glass-2)',
                      border: '1px solid var(--line)',
                      display: 'grid',
                      placeItems: 'center',
                      color: 'var(--muted)',
                    }}
                  >
                    {statusIcon[project.status]}
                  </div>

                  {/* Meta */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 20,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: 'var(--ink)',
                      }}
                    >
                      {project.name}
                    </div>
                    <div
                      style={{
                        color: 'var(--muted)',
                        fontSize: 14,
                        marginTop: 4,
                        fontFamily: 'var(--mono)',
                      }}
                    >
                      {project.status === 'draft'
                        ? 'Bozza · nessun produttore'
                        : `${project.fablab} · ${project.material}`}
                    </div>
                  </div>

                  {/* Right: status + eta */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: 8,
                      flex: '0 0 auto',
                    }}
                  >
                    <StatusPill status={project.status} />
                    {project.eta && (
                      <span
                        style={{
                          fontSize: 12,
                          color: project.status === 'draft' ? 'var(--cyan)' : 'var(--muted)',
                          fontWeight: project.status === 'draft' ? 600 : 500,
                          fontFamily: 'var(--mono)',
                        }}
                      >
                        {project.eta}
                        {project.status === 'draft' ? ' ›' : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar a tutta larghezza, allineata al titolo */}
                {project.status === 'printing' && (
                  <div style={{ paddingLeft: 80, marginTop: 14 }}>
                    <ProgressBar value={project.progress} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Right column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            minHeight: 0,
          }}
        >
          {/* Alert card: pickup ready — esiste solo se c'è davvero un progetto pronto */}
          {readyProject && (
          <div
            style={{
              background: 'var(--glass)',
              border: '1px solid var(--line-2)',
              borderRadius: 'var(--radius)',
              padding: 20,
              flex: '0 0 auto',
              position: 'relative',
            }}
          >
            {/* Top row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 13,
                position: 'relative',
              }}
            >
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: 'var(--bg-2)',
                  border: '1px solid var(--line)',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--cyan)',
                }}
              >
                <CheckCircle2 size={17} />
              </span>
              <h4
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--ink)',
                  fontFamily: 'var(--mono)',
                }}
              >
                Pronto al ritiro
              </h4>
            </div>

            <p
              style={{
                fontSize: 13,
                color: 'var(--muted)',
                lineHeight: 1.5,
                marginBottom: 15,
                position: 'relative',
              }}
            >
              <b style={{ color: 'var(--ink)', fontWeight: 600 }}>{readyProject.name}</b>{' '}
              completato da{' '}
              <b style={{ color: 'var(--ink)', fontWeight: 600 }}>{readyProject.fablab}</b>.
              Ritiro disponibile fino a venerdì 18:00.
            </p>

            <button
              className="btn-spade"
              style={{ fontSize: 13, height: 38, padding: '0 18px' }}
              onClick={() => navigate('/app/progetti/' + readyProject.id)}
            >
              Vedi dettagli ritiro
            </button>
          </div>
          )}

          {/* Nearby producers card */}
          <GlassCard
            style={{
              flex: 1,
              minHeight: 0,
              padding: 22,
              display: 'flex',
              flexDirection: 'column',
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
                Produttori vicini
              </h3>
              <span
                onClick={() => navigate('/app/produttori')}
                style={{
                  color: 'var(--cyan)',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--mono)',
                  letterSpacing: '0.04em',
                }}
              >
                MAPPA ›
              </span>
            </div>

            {/* Producer list */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
              }}
            >
              {nearbyProducers.map((producer, i) => (
                <div
                  key={producer.id}
                  onClick={() => navigate('/app/produttori/' + producer.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 11,
                    cursor: 'pointer',
                    padding: '14px 2px',
                    borderTop: i === 0 ? 'none' : '1px solid var(--line)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--glass-2)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  {/* Availability dot */}
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      flex: '0 0 auto',
                      background: producer.available ? 'var(--cyan)' : 'transparent',
                      boxShadow: producer.available
                        ? 'none'
                        : 'inset 0 0 0 1.5px var(--line-2)',
                    }}
                  />

                  {/* Name & sub */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>
                      {producer.name}
                    </div>
                    <div
                      style={{
                        display: 'block',
                        color: 'var(--muted)',
                        fontSize: 11,
                        fontWeight: 500,
                        marginTop: 1,
                        fontFamily: 'var(--mono)',
                      }}
                    >
                      {producer.distance} · {producer.technologies}
                    </div>
                  </div>

                  {/* Rating */}
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      color: 'var(--ink)',
                      fontFamily: 'var(--mono)',
                    }}
                  >
                    <Star size={12} fill="currentColor" />
                    {producer.rating}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      <TeseoAssistant />
    </>
  )
}
