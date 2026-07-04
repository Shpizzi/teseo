import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Download, Star, Bookmark, Check } from 'lucide-react'
import GlassCard from '../../components/GlassCard'
import PrimaryButton from '../../components/PrimaryButton'
import PrintViewer3D from '../../components/PrintViewer3D'
import { communityModels } from '../../mock/user-pages'
import { toast } from '../../components/Toast'

export default function CommunityDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)

  const model = communityModels.find(m => m.id === id)

  if (!model) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 16 }}>
        <span style={{ fontSize: 16, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>Modello non trovato</span>
        <button
          onClick={() => navigate('/app/community')}
          style={{
            background: 'transparent', color: 'var(--cyan)', border: '1px solid var(--line-2)',
            fontFamily: 'inherit', fontWeight: 600, fontSize: 13.5, padding: '10px 22px',
            borderRadius: 100, cursor: 'pointer',
          }}
        >
          ← Torna alla community
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: '0 0 auto' }}>
        <button
          onClick={() => navigate('/app/community')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--muted)',
            fontFamily: 'var(--mono)',
            fontSize: 12,
            padding: 0,
          }}
        >
          ← Community
        </button>
        <div>
          <h1 style={{ fontWeight: 600, fontSize: 22, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
            {model.name}
          </h1>
        </div>
      </div>

      {/* 3-col layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: 16, minHeight: 0 }}>

        {/* Left: model info */}
        <GlassCard style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto' }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginBottom: 10 }}>
              {model.name}
            </h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: 'var(--mono)',
                  border: '1px solid var(--line)',
                  borderRadius: 5,
                  padding: '3px 10px',
                  color: 'var(--muted)',
                }}
              >
                {model.category}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: 'var(--mono)',
                  fontWeight: 700,
                  background: 'var(--glass-2)',
                  border: '1px solid var(--line)',
                  color: 'var(--cyan)',
                  padding: '3px 10px',
                  borderRadius: 5,
                }}
              >
                v{model.version}
              </span>
            </div>
          </div>

          {/* Author */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--glass-2)',
                border: '1px solid var(--line)',
                display: 'grid',
                placeItems: 'center',
                fontSize: 12,
                fontWeight: 700,
                fontFamily: 'var(--mono)',
                color: 'var(--cyan)',
                flex: '0 0 auto',
              }}
            >
              {model.authorInitials}
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{model.author}</div>
              <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', marginTop: 1 }}>
                {model.versions[model.versions.length - 1].date}
              </div>
            </div>
          </div>

          {/* Description */}
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
            {model.description}
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Download size={14} style={{ color: 'var(--muted)' }} />
              <span style={{ fontFamily: 'var(--mono)', color: 'var(--muted)', fontSize: 12 }}>
                {model.downloads.toLocaleString('it-IT')}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Star size={14} fill="currentColor" style={{ color: 'var(--cyan)' }} />
              <span style={{ fontFamily: 'var(--mono)', color: 'var(--cyan)', fontSize: 12, fontWeight: 600 }}>
                {model.rating}
              </span>
            </div>
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

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <PrimaryButton onClick={() => navigate('/app/new', { state: { modelName: model.name } })}>
              Stampa questo modello
            </PrimaryButton>
            <button
              onClick={() => {
                setSaved(s => !s)
                toast(saved ? 'Modello rimosso dai salvati' : 'Modello salvato — lo trovi in Salvati')
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                background: 'transparent',
                color: 'var(--cyan)',
                border: '1px solid var(--line-2)',
                fontFamily: 'inherit',
                fontWeight: 600,
                fontSize: 13.5,
                padding: '10px 20px',
                borderRadius: 100,
                cursor: 'pointer',
                transition: '0.2s',
              }}
              onMouseEnter={e => {
                const btn = e.currentTarget as HTMLButtonElement
                btn.style.background = 'var(--glass-2)'
              }}
              onMouseLeave={e => {
                const btn = e.currentTarget as HTMLButtonElement
                btn.style.background = 'transparent'
              }}
            >
              {saved ? <Check size={15} /> : <Bookmark size={15} />}
              {saved ? 'Salvato' : 'Salva modello'}
            </button>
          </div>
        </GlassCard>

        {/* Center: 3D viewer */}
        <GlassCard
          hero
          style={{
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div className="reg-marks">
            <div className="reg-tl" />
            <div className="reg-tr" />
            <div className="reg-bl" />
            <div className="reg-br" />
          </div>
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
          <PrintViewer3D />
        </GlassCard>

        {/* Right: versions */}
        <GlassCard style={{ padding: 22, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink)', marginBottom: 16 }}>
            Versioni
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {model.versions.map((ver, i) => {
              const isCurrent = ver.v === model.version
              return (
                <div key={ver.v}>
                  <div style={{ paddingBottom: 14, paddingTop: i === 0 ? 0 : 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontFamily: 'var(--mono)', color: 'var(--cyan)', fontWeight: 700 }}>
                        v{ver.v}
                      </span>
                      {isCurrent && (
                        <span className="status-pill sp-ready">CORRENTE</span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', marginBottom: 5 }}>
                      {ver.date}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.4 }}>
                      {ver.note}
                    </div>
                  </div>
                  {i < model.versions.length - 1 && (
                    <div style={{ height: 1, background: 'var(--line)' }} />
                  )}
                </div>
              )
            })}
          </div>
        </GlassCard>
      </div>
    </>
  )
}
