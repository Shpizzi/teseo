import { useState } from 'react'
import { Star, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../../components/SearchBar'
import GlassCard from '../../components/GlassCard'
import { communityModels } from '../../mock/user-pages'

const categories = ['Tutti', 'Casa', 'FabLab', 'Accessori', 'Meccanica', 'Gaming', 'Elettronica']

export default function Community() {
  const [activeCategory, setActiveCategory] = useState('Tutti')
  const navigate = useNavigate()

  const filtered = activeCategory === 'Tutti'
    ? communityModels
    : communityModels.filter(m => m.category === activeCategory)

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
    flex: '0 0 auto',
  })

  return (
    <>
      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: '0 0 auto' }}>
        <div>
          <h1 style={{ fontWeight: 600, fontSize: 25, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
            Community
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 3, fontFamily: 'var(--mono)', letterSpacing: '0.02em' }}>
            3.2K MODELLI CONDIVISI
          </p>
        </div>
        <div style={{ flex: 1 }} />
        <SearchBar placeholder="Cerca modelli community…" />
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, flex: '0 0 auto', overflowX: 'auto' }}>
        {categories.map(cat => (
          <button key={cat} style={chipStyle(activeCategory === cat)} onClick={() => setActiveCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
          overflow: 'auto',
          alignContent: 'start',
          minHeight: 0,
        }}
      >
        {filtered.map(model => (
          <div
            key={model.id}
            onClick={() => navigate(`/app/community/${model.id}`)}
            style={{ cursor: 'pointer' }}
          >
          <GlassCard
            style={{
              padding: 18,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              cursor: 'pointer',
              transition: '0.2s',
            }}
          >
            {/* Thumbnail */}
            <div
              style={{
                height: 180,
                borderRadius: 13,
                background: '#18280e',
                border: '1px solid var(--line-2)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
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

            {/* Name + version */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)', flex: 1, minWidth: 0 }}>
                {model.name}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: 'var(--mono)',
                  fontWeight: 600,
                  background: 'var(--glass-2)',
                  border: '1px solid var(--line)',
                  color: 'var(--cyan)',
                  padding: '2px 8px',
                  borderRadius: 5,
                  whiteSpace: 'nowrap',
                  flex: '0 0 auto',
                }}
              >
                v{model.version}
              </span>
            </div>

            {/* Author */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--glass-2)',
                  border: '1px solid var(--line)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: 'var(--mono)',
                  color: 'var(--cyan)',
                  flex: '0 0 auto',
                }}
              >
                {model.authorInitials}
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{model.author}</span>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 16 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--mono)', color: 'var(--muted)', fontSize: 12 }}>
                <Download size={12} />
                {model.downloads.toLocaleString('it-IT')}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--mono)', color: 'var(--muted)', fontSize: 12 }}>
                <Star size={12} fill="currentColor" style={{ color: 'var(--cyan)' }} />
                {model.rating}
              </span>
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

            {/* Print button */}
            <button
              onClick={e => { e.stopPropagation(); navigate('/app/new') }}
              style={{
                padding: '8px 18px',
                borderRadius: 100,
                fontSize: 12,
                fontFamily: 'inherit',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid var(--cyan)',
                background: 'transparent',
                color: 'var(--cyan)',
                transition: '0.18s',
                alignSelf: 'flex-start',
              }}
              onMouseEnter={e => {
                const btn = e.currentTarget as HTMLButtonElement
                btn.style.background = 'var(--cyan)'
                btn.style.color = '#f4faed'
              }}
              onMouseLeave={e => {
                const btn = e.currentTarget as HTMLButtonElement
                btn.style.background = 'transparent'
                btn.style.color = 'var(--cyan)'
              }}
            >
              Stampa questo
            </button>
          </GlassCard>
          </div>
        ))}
      </div>
    </>
  )
}
