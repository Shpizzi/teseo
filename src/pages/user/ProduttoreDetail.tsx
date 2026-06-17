import { useParams, useNavigate } from 'react-router-dom'
import { Star } from 'lucide-react'
import GlassCard from '../../components/GlassCard'
import PrimaryButton from '../../components/PrimaryButton'
import { producers } from '../../mock/user-pages'

const fakePrinters = [
  { name: 'Bambu X1 · 01', status: 'active' as const },
  { name: 'Prusa MK4 · 02', status: 'active' as const },
  { name: 'Formlabs SLA · 03', status: 'idle' as const },
  { name: 'Ender CNC · 04', status: 'err' as const },
]

export default function ProduttoreDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const producer = producers.find(p => p.id === id)

  if (!producer) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, fontSize: 16, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
        Produttore non trovato
      </div>
    )
  }

  const utilizationPct = Math.round((fakePrinters.filter(p => p.status === 'active').length / fakePrinters.length) * 100)

  return (
    <>
      {/* Back button */}
      <div style={{ flex: '0 0 auto' }}>
        <button
          onClick={() => navigate('/app/produttori')}
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
          ← Produttori
        </button>
      </div>

      {/* Header card */}
      <GlassCard
        hero
        style={{
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flex: '0 0 auto',
        }}
      >
        {/* Availability dot */}
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            flex: '0 0 auto',
            background: producer.available ? 'var(--cyan)' : 'transparent',
            boxShadow: producer.available ? 'none' : 'inset 0 0 0 1.5px var(--cyan)',
          }}
        />

        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--ink)', marginBottom: 3 }}>
            {producer.name}
          </h1>
          <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>
            {producer.city}
          </div>
        </div>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 16 }}>
          <Star size={14} fill="currentColor" style={{ color: 'var(--cyan)' }} />
          <span style={{ fontFamily: 'var(--mono)', color: 'var(--cyan)', fontSize: 14, fontWeight: 700 }}>
            {producer.rating}
          </span>
        </div>

        {/* Certified badge */}
        <span
          style={{
            fontSize: 10,
            fontFamily: 'var(--mono)',
            border: '1px solid var(--line-2)',
            borderRadius: 100,
            padding: '4px 12px',
            color: 'var(--muted)',
          }}
        >
          FabLab certificato
        </span>

        {/* Technologies */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
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

        <div style={{ marginLeft: 'auto' }}>
          <PrimaryButton onClick={() => navigate('/app/new')}>
            Invia richiesta di stampa
          </PrimaryButton>
        </div>
      </GlassCard>

      {/* 3-col grid */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16, minHeight: 0 }}>

        {/* Col 1: description */}
        <GlassCard style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink)' }}>
            Descrizione
          </h3>

          <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.6 }}>
            {producer.description}
          </p>

          <div>
            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              MATERIALI
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {producer.materials.map(mat => (
                <span key={mat} className="status-pill sp-new">{mat}</span>
              ))}
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 4 }}>
            {[
              { label: 'LAVORI COMPLETATI', value: producer.completedJobs.toString() },
              { label: 'TEMPO MEDIO', value: producer.avgTime },
              { label: 'VALUTAZIONE', value: `${producer.rating} / 5.0` },
              { label: 'RECENSIONI', value: producer.reviews.toString() },
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
        </GlassCard>

        {/* Col 2: printers */}
        <GlassCard style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink)' }}>
            Stampanti
          </h3>

          {/* Conic ring */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              className="conic-ring"
              style={{
                background: `conic-gradient(var(--cyan) 0 ${utilizationPct}%, rgba(174,227,249,.14) ${utilizationPct}% 100%)`,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'var(--bg)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 11,
                  fontFamily: 'var(--mono)',
                  fontWeight: 700,
                  color: 'var(--cyan)',
                }}
              >
                {utilizationPct}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>Utilizzo</div>
              <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', marginTop: 2 }}>
                {fakePrinters.filter(p => p.status === 'active').length}/{fakePrinters.length} attive
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {fakePrinters.map(printer => (
              <div key={printer.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  className={`pdot-${printer.status}`}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    flex: '0 0 auto',
                  }}
                />
                <span style={{ fontSize: 12.5, color: 'var(--ink)', fontWeight: 500, flex: 1 }}>
                  {printer.name}
                </span>
                <span style={{ fontSize: 10.5, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>
                  {printer.status === 'active' ? 'attiva' : printer.status === 'idle' ? 'inattiva' : 'errore'}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Col 3: contact */}
        <GlassCard style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink)' }}>
            Contatta
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>ORARI</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>Lun–Ven</div>
              <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--muted)', marginTop: 2 }}>09:00–19:00</div>
            </div>
            <div style={{ height: 1, background: 'var(--line)' }} />
            <div>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>INDIRIZZO</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>Via Ventura 12</div>
              <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--muted)', marginTop: 2 }}>{producer.city}</div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <PrimaryButton onClick={() => navigate('/app/messages')}>
              Avvia chat
            </PrimaryButton>
            <button
              onClick={() => navigate('/app/produttori')}
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
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--glass-2)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
            >
              Vedi mappa
            </button>
          </div>
        </GlassCard>
      </div>
    </>
  )
}
