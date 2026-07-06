import { useState } from 'react'
import { Search, ScanLine, BadgeCheck, UserPlus, Download, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PrimaryButton from '../components/PrimaryButton'
import { LandingNav, LandingFooter, PageHero } from '../components/LandingChrome'

/* Versione light della community pubblica: il flusso è uno solo -
   cerchi il pezzo → lo trovi in archivio → ti iscrivi e lo stampi. */

type PublicPart = {
  name: string
  object: string
  author: string
  downloads: number
  rating: number
  version: string
}

const PARTS: PublicPart[] = [
  { name: 'Manico moka 3 tazze', object: 'Moka Bialetti', author: 'Marco T.', downloads: 2130, rating: 4.9, version: '2.1' },
  { name: 'Gamba sedia Ø22', object: 'Sedia da ufficio', author: 'Sara B.', downloads: 1610, rating: 4.8, version: '3.0' },
  { name: 'Cardine finestra sx', object: 'Finestra PVC', author: 'Giovanni R.', downloads: 1244, rating: 4.7, version: '1.4' },
  { name: 'Manopola fornello', object: 'Piano cottura Smeg', author: 'Alessia M.', downloads: 986, rating: 4.9, version: '2.0' },
  { name: 'Ruota trolley 40mm', object: 'Valigia cabina', author: 'Luca P.', downloads: 875, rating: 4.6, version: '1.8' },
  { name: 'Gancio modulare da parete', object: 'Appendiabiti', author: 'Marco T.', downloads: 1842, rating: 4.9, version: '2.3' },
  { name: 'Clip zaino 25mm', object: 'Zaino trekking', author: 'Elena V.', downloads: 640, rating: 4.5, version: '1.2' },
  { name: 'Ventola frullatore', object: 'Frullatore De’Longhi', author: 'Davide M.', downloads: 512, rating: 4.8, version: '1.1' },
  { name: 'Padiglione cuffie', object: 'Cuffie over-ear', author: 'Francesca R.', downloads: 498, rating: 4.4, version: '1.6' },
]

function PartCard({ part }: { part: PublicPart }) {
  const navigate = useNavigate()
  return (
    <div
      className="glass-panel"
      style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12, cursor: 'pointer', transition: 'border-color .2s' }}
      onClick={() => navigate('/onboarding')}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--cyan)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)' }}
    >
      {/* Thumb blueprint */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '16 / 9',
          borderRadius: 8,
          overflow: 'hidden',
          background: 'var(--bg-2)',
          border: '1px solid var(--line)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(63,115,8,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(63,115,8,.12) 1px, transparent 1px)',
            backgroundSize: '14px 14px',
          }}
        />
        <span
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            fontFamily: 'var(--mono)',
            fontSize: 11,
            letterSpacing: '0.1em',
            color: 'var(--cyan)',
          }}
        >
          {part.object.toUpperCase()}
        </span>
        <span
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            fontFamily: 'var(--mono)',
            fontSize: 9.5,
            background: 'rgba(255,255,255,.92)',
            border: '1px solid var(--line)',
            borderRadius: 5,
            padding: '3px 7px',
            color: 'var(--muted)',
          }}
        >
          v{part.version}
        </span>
      </div>

      <div>
        <h3 style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--ink)' }}>{part.name}</h3>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>di {part.author}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Download size={12} /> {part.downloads.toLocaleString('it-IT')}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Star size={12} color="var(--cyan)" /> {part.rating}
        </span>
        <span style={{ flex: 1 }} />
        <BadgeCheck size={14} color="var(--cyan)" />
      </div>
    </div>
  )
}

function SearchArchive() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const results = q
    ? PARTS.filter(p => `${p.name} ${p.object} ${p.author}`.toLowerCase().includes(q))
    : PARTS

  return (
    <section style={{ padding: '0 6% 80px', maxWidth: 1180, margin: '0 auto' }}>
      {/* Barra di ricerca */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          height: 56,
          padding: '0 20px',
          background: 'var(--glass)',
          border: '1px solid var(--line-2)',
          borderRadius: 100,
          boxShadow: '0 8px 30px rgba(9,15,5,.06)',
          maxWidth: 560,
          margin: '0 auto',
        }}
      >
        <Search size={18} color="var(--muted-2)" style={{ flexShrink: 0 }} />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder='Cerca un pezzo: “manico moka”, “gamba sedia”…'
          style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: 15, color: 'var(--ink)' }}
        />
        {query && (
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', flexShrink: 0 }}>
            {results.length} risultati
          </span>
        )}
      </div>

      {/* Griglia pezzi */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 16,
          marginTop: 40,
        }}
      >
        {results.map(p => <PartCard key={p.name} part={p} />)}
      </div>

      {/* Nessun risultato → scansione */}
      {results.length === 0 && (
        <div
          className="glass-panel"
          style={{ marginTop: 40, padding: 40, textAlign: 'center', border: '1px dashed var(--line-2)', background: 'transparent' }}
        >
          <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>
            «{query}» non è ancora in archivio.
          </p>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 6 }}>
            Scansiona l&apos;oggetto con il telefono: l&apos;AI genera il modello e la community lo valida.
          </p>
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
            <PrimaryButton onClick={() => navigate('/onboarding')}>
              <ScanLine size={16} />
              Scansiona il pezzo
            </PrimaryButton>
          </div>
        </div>
      )}
    </section>
  )
}

/* I 3 passi del flusso light */
function FlowStrip() {
  const navigate = useNavigate()
  const steps = [
    { icon: <Search size={18} color="var(--cyan)" />, t: '1 · Cerca il pezzo', d: 'Scrivi cosa si è rotto: l’archivio ha già i ricambi più comuni, validati dalla community.' },
    { icon: <BadgeCheck size={18} color="var(--cyan)" />, t: '2 · Trova il modello', d: 'Ogni file ha versioni, rating e il bollino di chi l’ha già stampato con successo.' },
    { icon: <UserPlus size={18} color="var(--cyan)" />, t: '3 · Iscriviti e stampa', d: 'Con un account scegli il FabLab vicino a te e ritiri il pezzo pronto.' },
  ]
  return (
    <section style={{ padding: '60px 6% 80px', background: 'rgba(63,115,8,.03)', borderTop: '1px solid var(--line)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, maxWidth: 1020, margin: '0 auto' }}>
        {steps.map(s => (
          <div key={s.t} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--glass)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center' }}>
              {s.icon}
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{s.t}</h3>
            <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.6 }}>{s.d}</p>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 48 }}>
        <PrimaryButton style={{ height: 50, fontSize: 15, padding: '0 30px' }} onClick={() => navigate('/onboarding')}>
          <UserPlus size={18} />
          Iscriviti gratis
        </PrimaryButton>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted-2)', marginTop: 12, letterSpacing: '0.04em' }}>
          318 MODELLI IN ARCHIVIO · OGNI SETTIMANA SE NE AGGIUNGONO
        </p>
      </div>
    </section>
  )
}

export default function CommunityPublic() {
  return (
    <div className="landing-scroll">
      <LandingNav />
      <PageHero
        tag="COMMUNITY"
        title={<>Il pezzo che cerchi<br />probabilmente esiste già.</>}
        subtitle="L’archivio della community raccoglie i ricambi già scansionati, corretti e validati dai maker. Cercalo: se c’è, lo stampi vicino a casa. Se non c’è, lo scansioni tu."
      />
      <SearchArchive />
      <FlowStrip />
      <LandingFooter />
    </div>
  )
}
