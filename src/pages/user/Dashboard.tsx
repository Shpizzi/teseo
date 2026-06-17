import { Plus, Sun, Clock, CheckCircle2, Bookmark, ScanLine, Bell, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../../components/SearchBar'
import IconButton from '../../components/IconButton'
import PrimaryButton from '../../components/PrimaryButton'
import KpiCard from '../../components/KpiCard'
import GlassCard from '../../components/GlassCard'
import StatusPill from '../../components/StatusPill'
import ProgressBar from '../../components/ProgressBar'
import { userProjects, userKpis, nearbyProducers } from '../../mock'

const kpiIcons = [
  <Sun size={17} />,
  <Clock size={17} />,
  <CheckCircle2 size={17} />,
  <Bookmark size={17} />,
]

export default function Dashboard() {
  const navigate = useNavigate()
  return (
    <>
      {/* ── Topbar ── */}
      <div
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
            3 PROGETTI IN LAVORAZIONE · 1 PRONTO AL RITIRO
          </p>
        </div>
        <div style={{ flex: 1 }} />
        <SearchBar placeholder="Cerca un modello o un produttore…" />
        <IconButton title="Scansiona">
          <ScanLine size={19} />
        </IconButton>
        <IconButton title="Notifiche" badge={2}>
          <Bell size={19} />
        </IconButton>
        <PrimaryButton onClick={() => navigate('/app/new')}>
          <Plus size={18} />
          Nuova stampa
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
        {userKpis.map((kpi, i) => (
          <KpiCard
            key={kpi.label}
            value={kpi.value}
            label={kpi.label}
            trend={kpi.trend}
            trendUp={kpi.trendUp}
            icon={kpiIcons[i]}
          />
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
                fontSize: 15,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--ink)',
              }}
            >
              Progetti in corso
            </h3>
            <span
              onClick={() => navigate('/app/progetti')}
              style={{
                color: 'var(--cyan)',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--mono)',
                letterSpacing: '0.04em',
              }}
            >
              STORICO ›
            </span>
          </div>

          {/* Project list */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 11,
              overflow: 'auto',
              position: 'relative',
            }}
          >
            {userProjects.map(project => (
              <div
                key={project.id}
                onClick={() => navigate('/app/progetti/' + project.id)}
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

                {/* Meta */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14.5,
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
                      fontSize: 11.5,
                      marginTop: 2,
                      fontFamily: 'var(--mono)',
                    }}
                  >
                    {project.status === 'draft'
                      ? `Bozza · nessun produttore`
                      : `${project.fablab} · ${project.material}`}
                  </div>
                  <ProgressBar
                    value={project.progress}
                    label={project.status !== 'draft' ? `${project.progress}%` : '—'}
                  />
                </div>

                {/* Right: status + eta */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 7,
                    flex: '0 0 auto',
                  }}
                >
                  <StatusPill status={project.status} />
                  {project.eta && (
                    <span
                      style={{
                        fontSize: 11,
                        color: 'var(--muted)',
                        fontWeight: 500,
                        fontFamily: 'var(--mono)',
                      }}
                    >
                      {project.eta}
                    </span>
                  )}
                </div>
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
          {/* Alert card: pickup ready */}
          <div
            style={{
              background: 'rgba(174,227,249,.10)',
              border: '1px solid var(--line-2)',
              borderRadius: 'var(--radius)',
              padding: 20,
              flex: '0 0 auto',
              position: 'relative',
            }}
          >
            {/* Dashed inset */}
            <div
              style={{
                position: 'absolute',
                inset: 7,
                border: '1px dashed var(--line)',
                borderRadius: 13,
                pointerEvents: 'none',
                opacity: 0.45,
              }}
            />

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
                  background: 'rgba(174,227,249,.18)',
                  border: '1px solid var(--line-2)',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--cyan)',
                }}
              >
                <CheckCircle2 size={17} />
              </span>
              <h4
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'var(--ink)',
                }}
              >
                Pronto al ritiro
              </h4>
              <span
                style={{
                  color: 'var(--cyan)',
                  fontSize: 10.5,
                  fontWeight: 700,
                  marginLeft: 'auto',
                  fontFamily: 'var(--mono)',
                  letterSpacing: '0.1em',
                }}
              >
                ORA
              </span>
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
              <b style={{ color: '#fff', fontWeight: 600 }}>Ricambio cardine finestra</b>{' '}
              completato da{' '}
              <b style={{ color: '#fff', fontWeight: 600 }}>MakerSpace Navigli</b>.
              Ritiro disponibile fino a venerdì 18:00.
            </p>

            <button
              style={{
                background: 'var(--cyan)',
                color: '#08233f',
                border: 'none',
                fontFamily: 'inherit',
                fontWeight: 700,
                fontSize: 13,
                padding: '11px 18px',
                borderRadius: '100px',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              Prenota ritiro
            </button>
          </div>

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

            {/* Map preview */}
            <div
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                flex: 1,
                minHeight: 140,
                border: '1px solid var(--line-2)',
                background: '#0c2a52',
                marginBottom: 14,
              }}
            >
              {/* Map grid */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage:
                    'linear-gradient(rgba(174,227,249,.10) 1px,transparent 1px),linear-gradient(90deg,rgba(174,227,249,.10) 1px,transparent 1px)',
                  backgroundSize: '28px 28px',
                }}
              />

              {/* Roads */}
              <div
                style={{
                  position: 'absolute',
                  top: '42%',
                  left: 0,
                  right: 0,
                  height: 6,
                  background: 'rgba(174,227,249,.12)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '38%',
                  top: 0,
                  bottom: 0,
                  width: 6,
                  background: 'rgba(174,227,249,.12)',
                }}
              />

              {/* Map pins */}
              {/* TU (you) */}
              <div className="mpin you" style={{ left: '46%', top: '54%' }}>
                <span className="t">TU</span>
                <span className="pd" />
              </div>

              {/* LAMBRATE */}
              <div className="mpin" style={{ left: '26%', top: '34%', cursor: 'pointer' }} onClick={() => navigate('/app/produttori/fab1')}>
                <span className="t">LAMBRATE</span>
                <span className="pd" />
              </div>

              {/* NAVIGLI */}
              <div className="mpin" style={{ left: '68%', top: '48%', cursor: 'pointer' }} onClick={() => navigate('/app/produttori/fab3')}>
                <span className="t">NAVIGLI</span>
                <span className="pd" />
              </div>

              {/* BOVISA */}
              <div className="mpin" style={{ left: '58%', top: '74%', cursor: 'pointer' }} onClick={() => navigate('/app/produttori/fab2')}>
                <span className="t">BOVISA</span>
                <span className="pd" />
              </div>
            </div>

            {/* Producer list */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 9,
                overflow: 'auto',
              }}
            >
              {nearbyProducers.map(producer => (
                <div
                  key={producer.id}
                  onClick={() => navigate('/app/produttori/' + producer.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 11,
                    cursor: 'pointer',
                  }}
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
                        : 'inset 0 0 0 1.5px var(--cyan)',
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
                      color: 'var(--cyan)',
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
    </>
  )
}
