import { useState } from 'react'
import { Plus } from 'lucide-react'
import SearchBar from '../../components/SearchBar'
import PrimaryButton from '../../components/PrimaryButton'
import GlassCard from '../../components/GlassCard'
import { savedModels } from '../../mock/user-pages'

export default function Salvati() {
  const [_query, setQuery] = useState('')

  return (
    <>
      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: '0 0 auto' }}>
        <div>
          <h1 style={{ fontWeight: 600, fontSize: 25, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
            Modelli salvati
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 3, fontFamily: 'var(--mono)', letterSpacing: '0.02em' }}>
            128 MODELLI
          </p>
        </div>
        <div style={{ flex: 1 }} />
        <SearchBar placeholder="Cerca modelli…" />
        <PrimaryButton onClick={() => setQuery('')}>
          <Plus size={18} />
          Aggiungi
        </PrimaryButton>
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
        {savedModels.map(model => (
          <GlassCard
            key={model.id}
            style={{
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              cursor: 'pointer',
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

            {/* Date */}
            <div style={{ fontFamily: 'var(--mono)', color: 'var(--muted)', fontSize: 11 }}>
              {model.savedDate}
            </div>
          </GlassCard>
        ))}
      </div>
    </>
  )
}
