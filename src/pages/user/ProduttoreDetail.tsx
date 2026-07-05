import { useParams, useNavigate } from 'react-router-dom'
import { Star, ArrowLeft, MapPin, Clock } from 'lucide-react'
import GlassCard from '../../components/GlassCard'
import PrimaryButton from '../../components/PrimaryButton'
import { producers, conversations } from '../../mock/user-pages'

export default function ProduttoreDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const producer = producers.find(p => p.id === id)

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
        <img
          src={producer.photo}
          alt={producer.name}
          style={{ width: 260, height: 148, objectFit: 'cover', flex: '0 0 auto', borderRight: '1px solid var(--line)' }}
        />
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

      {/* 3-col grid: info generali · galleria · recensioni */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 16, minHeight: 0 }}>

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

        {/* Col 2: galleria — foto del lab + foto mandate dagli utenti */}
        <GlassCard style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto' }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink)' }}>
            Galleria
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {producer.gallery.map((g, i) => (
              <figure key={i} style={{ margin: 0, ...(i === 0 ? { gridColumn: '1 / -1' } : {}) }}>
                <img
                  src={g.src}
                  alt={g.by}
                  style={{
                    width: '100%',
                    aspectRatio: i === 0 ? '16 / 8' : '4 / 3',
                    objectFit: 'cover',
                    borderRadius: 10,
                    border: '1px solid var(--line)',
                    display: 'block',
                  }}
                />
                <figcaption style={{ fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--muted-2)', marginTop: 4, letterSpacing: '0.03em' }}>
                  {g.by}
                </figcaption>
              </figure>
            ))}
          </div>
        </GlassCard>

        {/* Col 3: recensioni */}
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
            </div>
          ))}
        </GlassCard>
      </div>
    </>
  )
}
