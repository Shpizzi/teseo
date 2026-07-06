import { useNavigate, useSearchParams } from 'react-router-dom'
import { Sparkles, ArrowLeft, Layers, Cpu, BadgeCheck } from 'lucide-react'

/* Lo studio di slicing vero è stato tolto: la funzione è "coming soon".
   La pagina resta raggiungibile da ordini/dashboard (anche con ?ordine=). */
export default function Slicing() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const ordine = params.get('ordine')

  const features = [
    { icon: <Layers size={16} />, t: 'Orientamento e supporti automatici' },
    { icon: <Cpu size={16} />, t: 'Parametri ottimizzati per materiale e stampante' },
    { icon: <BadgeCheck size={16} />, t: 'G-code certificato, pronto in coda' },
  ]

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        position: 'relative',
        background: 'var(--forest)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--line-2)',
        overflow: 'hidden',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      {/* Griglia blueprint su scuro */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(rgba(178,235,118,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(178,235,118,.06) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
        }}
      />
      <div className="reg-tl" style={{ borderColor: 'var(--lemongrass)' }} />
      <div className="reg-tr" style={{ borderColor: 'var(--lemongrass)' }} />
      <div className="reg-bl" style={{ borderColor: 'var(--lemongrass)' }} />
      <div className="reg-br" style={{ borderColor: 'var(--lemongrass)' }} />

      <div style={{ position: 'relative', textAlign: 'center', maxWidth: 460, padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
        <span
          style={{
            width: 54,
            height: 54,
            borderRadius: 16,
            background: 'rgba(178,235,118,.12)',
            border: '1px solid rgba(178,235,118,.4)',
            display: 'grid',
            placeItems: 'center',
            color: 'var(--lemongrass)',
          }}
        >
          <Sparkles size={24} />
        </span>

        <span
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 11,
            letterSpacing: '0.18em',
            color: 'var(--lemongrass)',
            border: '1px solid rgba(178,235,118,.4)',
            borderRadius: 100,
            padding: '6px 16px',
          }}
        >
          COMING SOON
        </span>

        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#f4faed', letterSpacing: '-.01em', lineHeight: 1.15 }}>
          Slicing AI
        </h1>
        <p style={{ fontSize: 14.5, color: 'rgba(244,250,237,.65)', lineHeight: 1.65 }}>
          L&apos;AI preparerà i file al posto tuo{ordine ? <>, anche per l&apos;ordine <span style={{ fontFamily: 'var(--mono)', color: 'var(--lemongrass)' }}>#{ordine}</span></> : ''}:
          orientamento, supporti e parametri, senza aprire lo slicer.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
          {features.map(f => (
            <div key={f.t} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(244,250,237,.85)', fontSize: 13.5 }}>
              <span style={{ color: 'var(--lemongrass)', display: 'flex' }}>{f.icon}</span>
              {f.t}
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/fablab/ordini')}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(178,235,118,.12)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          style={{
            marginTop: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            height: 44,
            padding: '0 24px',
            borderRadius: 100,
            border: '1px solid rgba(178,235,118,.5)',
            background: 'transparent',
            color: 'var(--lemongrass)',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
            transition: 'background .2s',
          }}
        >
          <ArrowLeft size={15} />
          Torna agli ordini
        </button>
      </div>
    </div>
  )
}
