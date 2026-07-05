import { useState } from 'react'
import { Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../../components/SearchBar'
import GlassCard from '../../components/GlassCard'
import FablabMap from '../../components/FablabMap'
import { producers } from '../../mock/user-pages'
import { milanoFablabs } from '../../mock/fablab-milano'

const techFilters = ['Tutti', 'FDM', 'Resina', 'SLA', 'Laser']
const distFilters = ['< 2 km', '< 5 km', 'Tutti']

export default function Produttori() {
  const [activeTech, setActiveTech] = useState('Tutti')
  const [activeDist, setActiveDist] = useState('Tutti')
  const [query, setQuery] = useState('')
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
    const queryOk = !query || [p.name, p.city, ...p.materials, ...p.technologies].join(' ').toLowerCase().includes(query.toLowerCase())
    return techOk && distOk && queryOk
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
    color: active ? '#f4faed' : 'var(--muted)',
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
            {producers.length} FABLAB NEL TUO RAGGIO
          </p>
        </div>
        <div style={{ flex: 1 }} />
        <SearchBar placeholder="Cerca produttori…" value={query} onChange={setQuery} />
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
          {filtered.length === 0 && (
            <div style={{ padding: 28, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
              Nessun produttore con questi filtri.{' '}
              <button
                onClick={() => { setActiveTech('Tutti'); setActiveDist('Tutti'); setQuery('') }}
                style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, padding: 0 }}
              >
                Azzera i filtri
              </button>
            </div>
          )}
          {filtered.map(producer => (
            <div
              key={producer.id}
              onClick={() => navigate('/app/produttori/' + producer.id)}
              style={{
                padding: 18,
                borderRadius: 'var(--radius-sm)',
                background: 'var(--glass)',
                border: '1px solid var(--line)',
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
                el.style.borderColor = 'var(--line)'
                el.style.background = 'var(--glass)'
              }}
            >
              {/* Foto + intestazione, stile scheda Google Maps */}
              <div style={{ display: 'flex', gap: 14 }}>
                <img
                  src={producer.photo}
                  alt={producer.name}
                  style={{
                    width: 108,
                    height: 96,
                    borderRadius: 10,
                    objectFit: 'cover',
                    flex: '0 0 auto',
                    border: '1px solid var(--line)',
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
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
                    <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {producer.name}
                    </span>
                    <span style={{ fontFamily: 'var(--mono)', color: 'var(--cyan)', fontSize: 12, fontWeight: 600 }}>
                      {producer.distance}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
                    <Star size={12} fill="currentColor" style={{ color: 'var(--cyan)' }} />
                    <span style={{ fontFamily: 'var(--mono)', color: 'var(--cyan)', fontSize: 12, fontWeight: 600 }}>
                      {producer.rating}
                    </span>
                    <span style={{ fontFamily: 'var(--mono)', color: 'var(--muted)', fontSize: 11 }}>
                      ({producer.reviews} recensioni)
                    </span>
                    <span style={{ flex: 1 }} />
                    <span style={{ fontFamily: 'var(--mono)', color: 'var(--muted)', fontSize: 11 }}>
                      {producer.avgTime}
                    </span>
                  </div>

                  {/* Rating per tipologia di materiale */}
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {producer.materialRatings.map(mr => (
                      <span
                        key={mr.material}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 10,
                          fontFamily: 'var(--mono)',
                          fontWeight: 600,
                          border: '1px solid var(--line)',
                          borderRadius: 5,
                          padding: '3px 8px',
                          color: 'var(--muted)',
                        }}
                      >
                        {mr.material}
                        <Star size={9} fill="var(--cyan)" style={{ color: 'var(--cyan)' }} />
                        <span style={{ color: 'var(--cyan)' }}>{mr.rating.toFixed(1)}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: mappa reale (MapLibre + OpenFreeMap) */}
        <GlassCard style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Mappa reale: i 4 profili in evidenza (cliccabili) + il resto della rete dal KMZ */}
          <FablabMap
            pins={[
              { name: 'Tu', lng: 9.19, lat: 45.4685, you: true },
              ...producers.map(p => ({ id: p.id, name: p.name, lng: p.lng, lat: p.lat })),
              ...milanoFablabs
                .filter(f => !producers.some(p => p.name === f.name))
                .map(f => ({ name: f.name, lng: f.lng, lat: f.lat, compact: true })),
            ]}
            zoom={11.2}
            onPinClick={pid => navigate('/app/produttori/' + pid)}
          />
        </GlassCard>
      </div>
    </>
  )
}
