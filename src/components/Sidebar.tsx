import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import { TeseoLogo } from './LandingChrome'

export type NavItem = {
  label: string
  icon: ReactNode
  href: string
  badge?: number
}

type SidebarProps = {
  items: NavItem[]
  brand: {
    subtitle: string
  }
  // Variante scura (forest): usata dal ramo FabLab per distinguerlo
  // a colpo d'occhio dallo spazio utente.
  dark?: boolean
  // When onClose is provided, the sidebar renders as a mobile off-canvas drawer
  // controlled by `open`. Omit both for the static desktop column.
  open?: boolean
  onClose?: () => void
}

export default function Sidebar({ items, brand, dark, open, onClose }: SidebarProps) {
  const location = useLocation()
  const isDrawer = onClose !== undefined

  const c = dark
    ? {
        ink: '#f4faed',
        muted: 'rgba(244,250,237,.6)',
        line: 'rgba(178,235,118,.2)',
        hoverBg: 'rgba(178,235,118,.1)',
        activeBg: 'var(--lemongrass)',
        activeInk: 'var(--forest)',
        accent: 'var(--lemongrass)',
        accentBg: 'rgba(178,235,118,.14)',
        aside: 'var(--forest)',
      }
    : {
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        hoverBg: 'var(--glass-2)',
        activeBg: 'var(--cyan)',
        activeInk: '#f4faed',
        accent: 'var(--cyan)',
        accentBg: 'rgba(63,115,8,.12)',
        aside: 'var(--glass)',
      }

  const inner = (
    <>
      {/* Brand block — solo nel drawer mobile: sul desktop il logo vive
          nella topbar stile Shopify */}
      {isDrawer && (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          padding: '4px 8px 18px',
          borderBottom: `1px dashed ${c.line}`,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            width: 38,
            height: 38,
            borderRadius: 11,
            background: c.accentBg,
            border: `1px solid ${c.line}`,
            display: 'grid',
            placeItems: 'center',
            color: c.accent,
            flex: '0 0 auto',
          }}
        >
          <TeseoLogo size={19} color="currentColor" />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 800,
              fontSize: 16,
              letterSpacing: '0.12em',
              color: c.ink,
            }}
          >
            TESEO
          </div>
          <div
            style={{
              display: 'block',
              color: c.muted,
              fontWeight: 500,
              fontSize: 10,
              letterSpacing: '0.02em',
              fontFamily: 'var(--mono)',
              marginTop: 1,
            }}
          >
            {brand.subtitle}
          </div>
        </span>
        {isDrawer && (
          <button
            onClick={onClose}
            aria-label="Chiudi menu"
            style={{
              width: 32, height: 32, flex: '0 0 auto', borderRadius: 9,
              background: 'transparent', border: `1px solid ${c.line}`,
              color: c.muted, display: 'grid', placeItems: 'center', cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>
      )}

      {/* Nav items */}
      {items.map(item => {
        const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 13,
              padding: '11px 13px',
              borderRadius: 11,
              color: isActive ? c.activeInk : c.muted,
              background: isActive ? c.activeBg : 'transparent',
              cursor: 'pointer',
              transition: '0.18s',
              fontWeight: 600,
              fontSize: 14,
              textDecoration: 'none',
            }}
            onMouseEnter={e => {
              if (!isActive) {
                ;(e.currentTarget as HTMLAnchorElement).style.color = c.ink
                ;(e.currentTarget as HTMLAnchorElement).style.background = c.hoverBg
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                ;(e.currentTarget as HTMLAnchorElement).style.color = c.muted
                ;(e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
              }
            }}
          >
            <span style={{ width: 20, height: 20, flex: '0 0 auto', display: 'flex', alignItems: 'center' }}>
              {item.icon}
            </span>
            {item.label}
            {item.badge !== undefined && item.badge > 0 && (
              <span
                style={{
                  marginLeft: 'auto',
                  background: isActive ? (dark ? 'rgba(24,40,14,.3)' : 'rgba(255,255,255,0.25)') : c.accent,
                  color: dark && !isActive ? 'var(--forest)' : '#f4faed',
                  fontSize: 10.5,
                  fontWeight: 700,
                  padding: '1px 7px',
                  borderRadius: 100,
                  fontFamily: 'var(--mono)',
                }}
              >
                {item.badge}
              </span>
            )}
          </Link>
        )
      })}

    </>
  )

  const asideBase: React.CSSProperties = {
    background: c.aside,
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    border: `1px solid ${dark ? 'rgba(178,235,118,.25)' : 'var(--line)'}`,
    borderRadius: 'var(--radius)',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 14px',
    gap: 3,
  }

  // Desktop: static column, unchanged.
  if (!isDrawer) {
    return (
      <aside style={{ ...asideBase, width: 212, flex: '0 0 212px', position: 'relative', zIndex: 2 }}>
        {inner}
      </aside>
    )
  }

  // Mobile: off-canvas drawer + backdrop (always rendered so it can animate).
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          background: 'rgba(9,15,5,0.55)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.22s ease',
        }}
      />
      <aside
        style={{
          ...asideBase,
          position: 'fixed',
          top: 12,
          bottom: 12,
          left: 12,
          width: 'min(272px, 82vw)',
          zIndex: 41,
          background: dark ? 'var(--forest)' : 'var(--bg-2)',
          overflow: 'auto',
          transform: open ? 'translateX(0)' : 'translateX(calc(-100% - 16px))',
          transition: 'transform 0.26s cubic-bezier(.4,0,.2,1)',
        }}
      >
        {inner}
      </aside>
    </>
  )
}
