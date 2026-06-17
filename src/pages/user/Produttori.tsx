import { useState } from 'react'
import { Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../../components/SearchBar'
import GlassCard from '../../components/GlassCard'
import { producers } from '../../mock/user-pages'

const techFilters = ['Tutti', 'FDM', 'Resina', 'SLA', 'Laser']
const distFilters = ['< 2 km', '< 5 km', 'Tutti']

export default function Produttori() {
  const [activeTech, setActiveTech] = useState('Tutti')
  const [activeDist, setActiveDist] = useState('Tutti')
  const [selected, setSelected] = useState(producers[0].id)
  const navigate = useNavigate()

  const filtered = producers.filter(p => {
    const techOk = activeTech === 'Tutti' || p.technologies.includes(activeTech)
    const distNum = parseFloat(p.distance)
    const distOk =
      activeDist === 'Tutti'
        ? true
        : activeDist === '< 2 km'
        ? distNum < 2
        : distNum < 5
    return techOk && distOk
  })

  const chipStyle = (active: boolean) => ({
    padding: '6px 14px',
    borderRadius: 100,
    fontSize: 11,
    fontFamily: 'var(--mono)' as const,
    fontWeight: 600,
    cursor: 'pointer',
    border: `1px solid ${active ? 'var(--cyan)' : 'var(--line)'}`,
    background: active ? 'var(--cyan)' : 'var(--glass)',
    color: active ? '#08233f' : 'var(--muted)',
    transition: '0.18s',
    whiteSpace: 'nowrap' as const,
  })

  return (
    <>
      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: '0 0 auto' }}>
        <div>
          <h1 style={{ fontWeight: 600, fontSize: 25, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
            Produttori vicini
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 3, fontFamily: 'var(--mono)', letterSpacing: '0.02em' }}>
            4 FABLAB NEL TUO RAGGIO
          </p>
        </div>
        <div style={{ flex: 1 }} />
        <SearchBar placeholder="Cerca produttori…" />
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, flex: '0 0 auto', flexWrap: 'wrap', alignItems: 'center' }}>
        {techFilters.map(f => (
          <button key={f} style={chipStyle(activeTech === f)} onClick={() => setActiveTech(f)}>
            {f}
          </button>
        ))}
        <div style={{ width: 1, height: 20, background: 'var(--line)', margin: '0 4px' }} />
        {distFilters.map(f => (
          <button key={f} style={chipStyle(activeDist === f)} onClick={() => setActiveDist(f)}>
            {f}
          </button>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, minHeight: 0 }}>
        {/* Left: list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11, overflow: 'auto' }}>
          {filtered.map(producer => (
            <div
              key={producer.id}
              onClick={() => { setSelected(producer.id); navigate('/app/produttori/' + producer.id) }}
              style={{
                padding: 18,
                borderRadius: 'var(--radius-sm)',
                background: selected === producer.id ? 'var(--glass-2)' : 'var(--glass)',
                border: `1px solid ${selected === producer.id ? 'var(--line-2)' : 'var(--line)'}`,
                cursor: 'pointer',
                transition: '0.18s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'var(--line-2)'
                el.style.background = 'var(--glass-2)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                if (selected !== producer.id) {
                  el.style.borderColor = 'var(--line)'
                  el.style.background = 'var(--glass)'
                }
              }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    flex: '0 0 auto',
                    background: producer.available ? 'var(--cyan)' : 'transparent',
                    boxShadow: producer.available ? 'none' : 'inset 0 0 0 1.5px var(--cyan)',
                  }}
                />
                <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', flex: 1 }}>
                  {producer.name}
                </span>
                <span style={{ fontFamily: 'var(--mono)', color: 'var(--cyan)', fontSize: 12, fontWeight: 600 }}>
                  {producer.distance}
                </span>
              </div>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
                <Star size={12} fill="currentColor" style={{ color: 'var(--cyan)' }} />
                <span style={{ fontFamily: 'var(--mono)', color: 'var(--cyan)', fontSize: 12, fontWeight: 600 }}>
                  {producer.rating}
                </span>
                <span style={{ fontFamily: 'var(--mono)', color: 'var(--muted)', fontSize: 11 }}>
                  ({producer.reviews} recensioni)
                </span>
              </div>

              {/* Technologies */}
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                {producer.technologies.map(tech => (
                  <span
                    key={tech}
                    style={{
                      fontSize: 10,
                      fontFamily: 'var(--mono)',
                      border: '1px solid var(--line)',
                      borderRadius: 5,
                      padding: '3px 8px',
                      color: 'var(--muted)',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', gap: 16 }}>
                <span style={{ fontFamily: 'var(--mono)', color: 'var(--muted)', fontSize: 11 }}>
                  {producer.completedJobs} lavori
                </span>
                <span style={{ fontFamily: 'var(--mono)', color: 'var(--muted)', fontSize: 11 }}>
                  {producer.avgTime}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: map preview */}
        <GlassCard
          style={{
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Map grid */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#0c2a52',
            }}
          />
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
          <div style={{ position: 'absolute', top: '44%', left: 0, right: 0, height: 8, background: 'rgba(174,227,249,.12)' }} />
          <div style={{ position: 'absolute', top: '20%', left: 0, right: 0, height: 5, background: 'rgba(174,227,249,.08)' }} />
          <div style={{ position: 'absolute', left: '38%', top: 0, bottom: 0, width: 8, background: 'rgba(174,227,249,.12)' }} />
          <div style={{ position: 'absolute', left: '68%', top: 0, bottom: 0, width: 5, background: 'rgba(174,227,249,.08)' }} />

          {/* You */}
          <div className="mpin you" style={{ left: '50%', top: '52%' }}>
            <span className="t">TU</span>
            <span className="pd" />
          </div>

          {/* Producer pins */}
          <div className="mpin" style={{ left: '24%', top: '32%', cursor: 'pointer' }} onClick={() => navigate('/app/produttori/fab1')}>
            <span className="t">LAMBRATE</span>
            <span className="pd" />
          </div>
          <div className="mpin" style={{ left: '70%', top: '46%', cursor: 'pointer' }} onClick={() => navigate('/app/produttori/fab3')}>
            <span className="t">NAVIGLI</span>
            <span className="pd" />
          </div>
          <div className="mpin" style={{ left: '60%', top: '72%', cursor: 'pointer' }} onClick={() => navigate('/app/produttori/fab2')}>
            <span className="t">BOVISA</span>
            <span className="pd" />
          </div>
          <div className="mpin" style={{ left: '40%', top: '18%', cursor: 'pointer' }} onClick={() => navigate('/app/produttori/fab4')}>
            <span className="t">POLIMI</span>
            <span className="pd" />
          </div>
        </GlassCard>
      </div>
    </>
  )
}
