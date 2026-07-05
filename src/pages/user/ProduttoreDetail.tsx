import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, ArrowLeft, MapPin, Clock, Images, X, ChevronLeft, ChevronRight } from 'lucide-react'
import GlassCard from '../../components/GlassCard'
import PrimaryButton from '../../components/PrimaryButton'
import { allProducers, conversations } from '../../mock/user-pages'

type LightboxState = { photos: { src: string; by: string }[]; index: number }

function Lightbox({ state, onChange, onClose }: { state: LightboxState; onChange: (i: number) => void; onClose: () => void }) {
  const { photos, index } = state
  const prev = () => onChange((index - 1 + photos.length) % photos.length)
  const next = () => onChange((index + 1) % photos.length)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const navBtn: React.CSSProperties = {
    background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.25)', borderRadius: '50%',
    width: 42, height: 42, display: 'grid', placeItems: 'center', cursor: 'pointer', color: '#fff', flex: '0 0 auto',
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(9,15,5,.88)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 32,
      }}
    >
      <button aria-label="Chiudi" onClick={onClose} style={{ ...navBtn, position: 'absolute', top: 20, right: 20 }}>
        <X size={18} />
      </button>
      {photos.length > 1 && (
        <button aria-label="Precedente" onClick={e => { e.stopPropagation(); prev() }} style={navBtn}>
          <ChevronLeft size={20} />
        </button>
      )}
      <figure onClick={e => e.stopPropagation()} style={{ margin: 0, maxWidth: 'min(920px, 80vw)', textAlign: 'center' }}>
        <img
          src={photos[index].src}
          alt={photos[index].by}
          style={{ maxWidth: '100%', maxHeight: '78vh', borderRadius: 12, display: 'block' }}
        />
        <figcaption style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'rgba(255,255,255,.7)', marginTop: 10, letterSpacing: '0.04em' }}>
          {photos[index].by} · {index + 1}/{photos.length}
        </figcaption>
      </figure>
      {photos.length > 1 && (
        <button aria-label="Successiva" onClick={e => { e.stopPropagation(); next() }} style={navBtn}>
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  )
}

export default function ProduttoreDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)

  const producer = allProducers.find(p => p.id === id)

  if (!producer) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 16 }}>
        <span style={{ fontSize: 16, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>Produttore non trovato</span>
        <button
          onClick={() => navigate('/app/produttori')}
          style={{
            background: 'transparent', color: 'var(--cyan)', border: '1px solid var(--line-2)',
            fontFamily: 'inherit', fontWeight: 600, fontSize: 13.5, padding: '10px 22px',
            borderRadius: 100, cursor: 'pointer',
          }}
        >
          ← Torna ai produttori
        </button>
      </div>
    )
  }

  const conversationId = conversations.find(c => c.fablab === producer.name)?.id
  const label: React.CSSProperties = {
    fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)',
    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5,
  }

  return (
    <>
      {/* Back */}
      <div style={{ flex: '0 0 auto' }}>
        <button
          onClick={() => navigate('/app/produttori')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--glass)', border: '1px solid var(--line-2)', borderRadius: 10,
            color: 'var(--ink)', fontFamily: 'inherit', fontWeight: 600, fontSize: 13,
            padding: '9px 14px', cursor: 'pointer',
          }}
        >
          <ArrowLeft size={15} />
          Produttori
        </button>
      </div>

      {/* Header card: foto + info, stile scheda Google Maps */}
      <GlassCard hero style={{ padding: 0, display: 'flex', overflow: 'hidden', flex: '0 0 auto' }}>
        <div
          onClick={() => setLightbox({ photos: producer.gallery, index: 0 })}
          style={{ position: 'relative', width: 260, height: 148, flex: '0 0 auto', borderRight: '1px solid var(--line)', cursor: 'pointer' }}
        >
          <img
            src={producer.photo}
            alt={producer.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <span
            style={{
              position: 'absolute', bottom: 10, left: 10,
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(9,15,5,.72)', color: '#fff', borderRadius: 100,
              padding: '6px 12px', fontFamily: 'var(--mono)', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.04em',
            }}
          >
            <Images size={12} />
            APRI GALLERY ({producer.gallery.length})
          </span>
        </div>
        <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 12, height: 12, borderRadius: '50%', flex: '0 0 auto',
                background: producer.available ? 'var(--cyan)' : 'transparent',
                boxShadow: producer.available ? 'none' : 'inset 0 0 0 1.5px var(--cyan)',
              }}
            />
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--ink)' }}>{producer.name}</h1>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Star size={14} fill="currentColor" style={{ color: 'var(--cyan)' }} />
              <span style={{ fontFamily: 'var(--mono)', color: 'var(--cyan)', fontSize: 14, fontWeight: 700 }}>
                {producer.rating}
              </span>
              <span style={{ fontFamily: 'var(--mono)', color: 'var(--muted)', fontSize: 11 }}>
                ({producer.reviews})
              </span>
            </span>
            <span
              style={{
                fontSize: 10, fontFamily: 'var(--mono)', border: '1px solid var(--line-2)',
                borderRadius: 100, padding: '4px 12px', color: 'var(--muted)',
              }}
            >
              FabLab certificato
            </span>
            <div style={{ marginLeft: 'auto' }}>
              <PrimaryButton onClick={() => navigate('/app/new', { state: { producerId: producer.id } })}>
                Stampa con questo FabLab
              </PrimaryButton>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={12} /> {producer.address}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={12} /> {producer.hours}</span>
            <span>{producer.distance}</span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {producer.technologies.map(tech => (
              <span
                key={tech}
                style={{
                  fontSize: 10, fontFamily: 'var(--mono)', border: '1px solid var(--line)',
                  borderRadius: 5, padding: '3px 8px', color: 'var(--muted)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* 2-col grid: info generali · recensioni (la galleria si apre dalla foto in alto) */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, minHeight: 0 }}>

        {/* Col 1: blocco info generale */}
        <GlassCard style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink)' }}>
            Informazioni
          </h3>

          <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.6 }}>
            {producer.description}
          </p>

          {/* Rating per materiale */}
          <div>
            <div style={label}>VALUTAZIONE PER MATERIALE</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              {producer.materialRatings.map(mr => (
                <div key={mr.material} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 600, color: 'var(--ink)', width: 58, flex: '0 0 auto' }}>
                    {mr.material}
                  </span>
                  <div style={{ flex: 1, height: 5, background: 'rgba(9,15,5,.08)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${(mr.rating / 5) * 100}%`, height: '100%', background: 'var(--cyan)' }} />
                  </div>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: 'var(--cyan)', width: 30, textAlign: 'right' }}>
                    {mr.rating.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 4 }}>
            {[
              { label: 'LAVORI COMPLETATI', value: producer.completedJobs.toString() },
              { label: 'TEMPO MEDIO', value: producer.avgTime },
            ].map(stat => (
              <div
                key={stat.label}
                style={{
                  padding: 14,
                  background: 'var(--glass)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: 20, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--ink)' }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'auto' }}>
            <PrimaryButton style={{ width: '100%' }} onClick={() => navigate('/app/messages', { state: { conversationId } })}>
              Avvia chat
            </PrimaryButton>
          </div>
        </GlassCard>

        {/* Col 2: recensioni */}
        <GlassCard style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink)' }}>
              Recensioni
            </h3>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>
              {producer.reviews} totali
            </span>
          </div>

          {producer.reviewsList.map((r, i) => (
            <div
              key={i}
              style={{
                padding: 14,
                background: 'var(--glass)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                <span
                  style={{
                    width: 26, height: 26, borderRadius: '50%', flex: '0 0 auto',
                    background: 'rgba(63,115,8,.12)', border: '1px solid var(--line-2)',
                    color: 'var(--cyan)', display: 'grid', placeItems: 'center',
                    fontFamily: 'var(--mono)', fontSize: 10.5, fontWeight: 700,
                  }}
                >
                  {r.author.split(' ').map(w => w[0]).join('')}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', flex: 1 }}>{r.author}</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--muted)' }}>{r.date}</span>
              </div>
              <div style={{ display: 'flex', gap: 2, marginBottom: 7 }}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    size={11}
                    fill={s < r.rating ? 'var(--cyan)' : 'transparent'}
                    style={{ color: s < r.rating ? 'var(--cyan)' : 'var(--line-2)' }}
                  />
                ))}
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.55 }}>{r.text}</p>
              {r.photos && (
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  {r.photos.map((src, pi) => (
                    <img
                      key={src}
                      src={src}
                      alt={`foto di ${r.author}`}
                      onClick={() =>
                        setLightbox({
                          photos: r.photos!.map(s => ({ src: s, by: `foto di ${r.author}` })),
                          index: pi,
                        })
                      }
                      style={{
                        width: 72, height: 56, objectFit: 'cover', borderRadius: 8,
                        border: '1px solid var(--line)', cursor: 'zoom-in', display: 'block',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </GlassCard>
      </div>

      {lightbox && (
        <Lightbox
          state={lightbox}
          onChange={i => setLightbox({ ...lightbox, index: i })}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  )
}
