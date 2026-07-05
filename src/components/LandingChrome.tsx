import type { ReactNode, CSSProperties } from 'react'
import { Package, ArrowRight, ScanLine } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import PrimaryButton from './PrimaryButton'
import { FloatItem, Tazza, Moka, Cuffie, Occhiali, Telecomando, Ingranaggio, Sedia } from './HeroFloatingMeshes'

/* Chrome condiviso dalle pagine pubbliche: nav, footer, helper di sezione */

const NAV_LINKS = [
  { label: 'Come funziona', to: '/come-funziona' },
  { label: 'Impatto', to: '/impatto' },
  { label: 'Community', to: '/community' },
]

export function LandingNav() {
  const navigate = useNavigate()
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255,255,255,.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--line)',
        padding: '0 6%',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        gap: 40,
      }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, textDecoration: 'none' }}>
        <Package size={20} color="var(--cyan)" />
        <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '0.12em', color: 'var(--ink)' }}>
          TESEO
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 28, flex: 1 }}>
        {NAV_LINKS.map(link => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              color: 'var(--muted)',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
              transition: 'color .2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--ink)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted)' }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <a
          href="#"
          onClick={e => { e.preventDefault(); navigate('/app/dashboard') }}
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 13,
            color: 'var(--muted)',
            textDecoration: 'none',
            transition: 'color .2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--ink)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted)' }}
        >
          Accedi
        </a>
        <PrimaryButton style={{ height: 38, padding: '0 18px', fontSize: 13 }} onClick={() => navigate('/onboarding')}>
          Inizia gratis
        </PrimaryButton>
      </div>
    </nav>
  )
}

/* Modelli 3D wireframe lemongrass che fiancheggiano il titolo (come le monete
   della reference): due gruppi ai lati, altezze sfalsate, un po' storti */
const FOOTER_MESHES: { el: ReactNode; left: string; top: string; size: number; tiltZ: number; duration: string; delay: string; speed?: number; axis?: 'z' }[] = [
  { el: <Tazza />, left: '4%', top: '6%', size: 125, tiltZ: -0.28, duration: '7s', delay: '0s' },
  { el: <Moka />, left: '15%', top: '36%', size: 115, tiltZ: 0.24, duration: '9s', delay: '0.6s', speed: 0.28 },
  { el: <Occhiali />, left: '5%', top: '62%', size: 125, tiltZ: 0.2, duration: '8.5s', delay: '1.4s', speed: 0.3 },
  { el: <Cuffie />, left: '82%', top: '5%', size: 125, tiltZ: 0.3, duration: '8s', delay: '1s' },
  { el: <Ingranaggio />, left: '74%', top: '34%', size: 110, tiltZ: -0.18, duration: '7.5s', delay: '2s', speed: 0.45, axis: 'z' },
  { el: <Sedia />, left: '83%', top: '60%', size: 125, tiltZ: 0.26, duration: '8s', delay: '1.7s' },
  { el: <Telecomando />, left: '66%', top: '68%', size: 110, tiltZ: -0.22, duration: '9s', delay: '0.3s' },
]

const FOOTER_COLS: { title: string; links: { label: string; to: string }[] }[] = [
  { title: 'Piattaforma', links: NAV_LINKS },
  {
    title: 'App',
    links: [
      { label: 'Dashboard', to: '/app/dashboard' },
      { label: 'Nuova stampa', to: '/app/new' },
      { label: 'Produttori', to: '/app/produttori' },
    ],
  },
  {
    title: 'FabLab',
    links: [
      { label: 'Dashboard', to: '/fablab/dashboard' },
      { label: 'Coda di stampa', to: '/fablab/coda' },
      { label: 'Stampanti', to: '/fablab/stampanti' },
    ],
  },
]

export function LandingFooter() {
  const navigate = useNavigate()
  return (
    <footer className="land-block land-block--forest" style={{ padding: '0 6% 36px', color: '#fff' }}>
      {/* Griglia blueprint su scuro */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(rgba(178,235,118,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(178,235,118,.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Headline + CTA, con i modelli 3D fluttuanti ai lati del titolo */}
      <div style={{ position: 'relative', padding: '90px 0' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0 }}>
          {FOOTER_MESHES.map((m, i) => (
            <FloatItem
              key={i}
              color="#b2eb76"
              style={{ left: m.left, top: m.top }}
              size={m.size}
              tiltZ={m.tiltZ}
              duration={m.duration}
              delay={m.delay}
              speed={m.speed}
              axis={m.axis}
            >
              {m.el}
            </FloatItem>
          ))}
        </div>

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 760, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-.02em' }}>
          Non è rotto:<br />
          <span style={{ color: '#b2eb76' }}>si ripara.</span>
        </h2>
        <button
          onClick={() => navigate('/onboarding')}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(0.98)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
          style={{
            marginTop: 36,
            height: 48,
            padding: '0 28px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: '#b2eb76',
            color: 'var(--forest)',
            fontFamily: 'var(--mono)',
            fontSize: 14,
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            transition: 'transform .2s cubic-bezier(.4,0,.2,1)',
          }}
        >
          <ScanLine size={17} />
          Ripara il primo oggetto
        </button>
        </div>
      </div>

      {/* Colonne link + newsletter */}
      <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: '40px 64px', paddingTop: 36 }}>
        {FOOTER_COLS.map(col => (
          <div key={col.title} style={{ minWidth: 150 }}>
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,.45)',
                marginBottom: 18,
              }}
            >
              {col.title}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {col.links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{ fontSize: 14.5, color: 'rgba(255,255,255,.85)', textDecoration: 'none', transition: 'color .2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#b2eb76' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,.85)' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div style={{ flex: 1 }} />

        {/* Newsletter — solo UI, nessun backend */}
        <div style={{ minWidth: 300 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: '#fff', marginBottom: 14 }}>
            Iscriviti alla newsletter
          </div>
          <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', gap: 10 }}>
            <input
              type="email"
              required
              placeholder="Indirizzo email"
              className="footer-mail"
              style={{
                flex: 1,
                height: 46,
                padding: '0 14px',
                fontFamily: 'var(--mono)',
                fontSize: 13,
                color: '#fff',
                colorScheme: 'dark',
                background: 'transparent',
                border: '1px solid rgba(178,235,118,.35)',
                borderRadius: 'var(--radius-sm)',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              aria-label="Iscriviti"
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(178,235,118,.12)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              style={{
                width: 46,
                height: 46,
                display: 'grid',
                placeItems: 'center',
                background: 'transparent',
                border: '1px solid rgba(178,235,118,.35)',
                borderRadius: 'var(--radius-sm)',
                color: '#b2eb76',
                cursor: 'pointer',
                transition: 'background .2s',
              }}
            >
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Riga finale */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          marginTop: 72,
          paddingTop: 24,
          borderTop: '1px solid rgba(178,235,118,.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Package size={16} color="#b2eb76" />
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.1em' }}>TESEO</span>
        </div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'rgba(255,255,255,.4)' }}>
          Non è rotto: è stato progettato per rompersi.
        </span>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'rgba(255,255,255,.55)' }}>
          &copy; Teseo 2026
        </span>
      </div>
    </footer>
  )
}

/* Etichetta mono di sezione (pill) */
export function SectionTag({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: 'var(--mono)',
        fontSize: 11,
        border: '1px solid var(--line-2)',
        borderRadius: 100,
        padding: '6px 16px',
        color: 'var(--cyan)',
        letterSpacing: '0.08em',
      }}
    >
      {children}
    </span>
  )
}

/* Bottone outline moss */
export function GhostButton({ children, onClick, style }: { children: ReactNode; onClick?: () => void; style?: CSSProperties }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: '1px solid var(--cyan)',
        color: 'var(--cyan)',
        background: 'transparent',
        borderRadius: 100,
        padding: '0 24px',
        height: 46,
        fontFamily: 'inherit',
        fontWeight: 600,
        fontSize: 15,
        cursor: 'pointer',
        transition: 'background .2s',
        ...style,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(63,115,8,.08)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
    >
      {children}
    </button>
  )
}

/* Hero compatto per le pagine interne */
export function PageHero({ tag, title, subtitle }: { tag: string; title: ReactNode; subtitle?: ReactNode }) {
  return (
    <section style={{ padding: '90px 6% 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
      <div className="anim-fadeUp">
        <SectionTag>{tag}</SectionTag>
      </div>
      <h1
        className="anim-fadeUp-d1"
        style={{
          fontSize: 'clamp(32px, 4.5vw, 52px)',
          fontWeight: 800,
          lineHeight: 1.12,
          letterSpacing: '-.02em',
          color: 'var(--ink)',
          marginTop: 20,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className="anim-fadeUp-d2"
          style={{ fontSize: 17, color: 'var(--muted)', lineHeight: 1.65, marginTop: 18, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' }}
        >
          {subtitle}
        </p>
      )}
    </section>
  )
}
