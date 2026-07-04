import type { ReactNode, CSSProperties } from 'react'
import { Package } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import PrimaryButton from './PrimaryButton'

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
        background: 'rgba(244,250,237,.85)',
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
        <PrimaryButton style={{ height: 38, padding: '0 18px', fontSize: 13 }} onClick={() => navigate('/app/dashboard')}>
          Inizia gratis
        </PrimaryButton>
      </div>
    </nav>
  )
}

export function LandingFooter() {
  return (
    <footer
      style={{
        padding: '32px 6%',
        borderTop: '1px solid var(--line)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Package size={16} color="var(--cyan)" />
        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>TESEO</span>
      </div>

      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted-2)' }}>
        Non è rotto: è stato progettato per rompersi.
      </span>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', gap: 20 }}>
        {NAV_LINKS.map(link => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 12,
              color: 'var(--muted)',
              textDecoration: 'none',
              transition: 'color .2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--ink)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted)' }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)' }}>
        &copy; 2026 Teseo
      </span>
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
