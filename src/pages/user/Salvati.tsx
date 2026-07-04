import { useState } from 'react'
import { Printer } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../../components/SearchBar'
import GlassCard from '../../components/GlassCard'
import { savedModels } from '../../mock/user-pages'

export default function Salvati() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const visible = query
    ? savedModels.filter(m => [m.name, m.category, ...m.tags].join(' ').toLowerCase().includes(query.toLowerCase()))
    : savedModels

  return (
    <>
      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: '0 0 auto' }}>
        <div>
          <h1 style={{ fontWeight: 600, fontSize: 25, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
            Modelli salvati
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 3, fontFamily: 'var(--mono)', letterSpacing: '0.02em' }}>
            {savedModels.length} MODELLI
          </p>
        </div>
        <div style={{ flex: 1 }} />
        <SearchBar placeholder="Cerca modelli…" value={query} onChange={setQuery} />
      </div>

      {/* Grid */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 14,
          overflow: 'auto',
          alignContent: 'start',
          minHeight: 0,
        }}
      >
        {visible.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: 32, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
            Nessun modello corrisponde a «{query}».{' '}
            <button
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, padding: 0 }}
            >
              Azzera la ricerca
            </button>
          </div>
        )}
        {visible.map(model => (
          <GlassCard
            key={model.id}
            style={{
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              transition: '0.2s',
            }}
          >
            {/* Thumbnail area */}
            <div
              style={{
                height: 150,
                borderRadius: 13,
                background: '#18280e',
                border: '1px solid var(--line-2)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget.parentElement as HTMLDivElement
                el.style.borderColor = 'var(--line-2)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget.parentElement as HTMLDivElement
                el.style.borderColor = 'var(--line)'
              }}
            >
              {/* Blueprint grid */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage:
                    'linear-gradient(rgba(63,115,8,.28) 1px,transparent 1px),linear-gradient(90deg,rgba(63,115,8,.28) 1px,transparent 1px)',
                  backgroundSize: '9px 9px',
                  pointerEvents: 'none',
                }}
              />
              {/* Center box */}
              <div
                style={{
                  position: 'absolute',
                  inset: '30px',
                  border: '1px solid var(--cyan)',
                  borderRadius: 3,
                  opacity: 0.55,
                }}
              />
            </div>

            {/* Model name */}
            <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>
              {model.name}
            </div>

            {/* Category */}
            <div style={{ fontFamily: 'var(--mono)', color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {model.category}
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {model.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    fontSize: 10,
                    fontFamily: 'var(--mono)',
                    border: '1px solid var(--line)',
                    borderRadius: 5,
                    padding: '2px 8px',
                    color: 'var(--muted)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Date + CTA */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
              <span style={{ fontFamily: 'var(--mono)', color: 'var(--muted)', fontSize: 11 }}>
                {model.savedDate}
              </span>
              <button
                onClick={() => navigate('/app/new', { state: { modelName: model.name } })}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'transparent', color: 'var(--cyan)', border: '1px solid var(--line-2)',
                  fontFamily: 'inherit', fontWeight: 600, fontSize: 12, padding: '6px 13px',
                  borderRadius: 100, cursor: 'pointer', transition: '0.18s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--glass-2)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
              >
                <Printer size={13} />
                Stampa questo modello
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </>
  )
}
