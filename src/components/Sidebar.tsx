import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Package, X } from 'lucide-react'

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
  user: {
    initials: string
    name: string
    role: string
  }
  // When onClose is provided, the sidebar renders as a mobile off-canvas drawer
  // controlled by `open`. Omit both for the static desktop column.
  open?: boolean
  onClose?: () => void
}

export default function Sidebar({ items, brand, user, open, onClose }: SidebarProps) {
  const location = useLocation()
  const isDrawer = onClose !== undefined

  const inner = (
    <>
      {/* Brand block */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          padding: '4px 8px 18px',
          borderBottom: '1px dashed var(--line)',
          marginBottom: 8,
        }}
      >
        <span
          style={{
            width: 38,
            height: 38,
            borderRadius: 11,
            background: 'rgba(63,115,8,.12)',
            border: '1px solid var(--line-2)',
            display: 'grid',
            placeItems: 'center',
            color: 'var(--cyan)',
            flex: '0 0 auto',
          }}
        >
          <Package size={19} />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 800,
              fontSize: 16,
              letterSpacing: '0.12em',
              color: 'var(--ink)',
            }}
          >
            TESEO
          </div>
          <div
            style={{
              display: 'block',
              color: 'var(--muted)',
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
              background: 'transparent', border: '1px solid var(--line)',
              color: 'var(--muted)', display: 'grid', placeItems: 'center', cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

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
              color: isActive ? '#f4faed' : 'var(--muted)',
              background: isActive ? 'var(--cyan)' : 'transparent',
              cursor: 'pointer',
              transition: '0.18s',
              fontWeight: 600,
              fontSize: 14,
              textDecoration: 'none',
            }}
            onMouseEnter={e => {
              if (!isActive) {
                ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--ink)'
                ;(e.currentTarget as HTMLAnchorElement).style.background = 'var(--glass-2)'
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted)'
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
                  background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--cyan)',
                  color: '#f4faed',
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

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* User block */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          padding: 9,
          borderRadius: 12,
          border: '1px solid var(--line)',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(63,115,8,.12)',
            border: '1px solid var(--line-2)',
            color: 'var(--cyan)',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 700,
            fontSize: 14,
            flex: '0 0 auto',
            fontFamily: 'var(--mono)',
          }}
        >
          {user.initials}
        </span>
        <span>
          <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.2, color: 'var(--ink)' }}>
            {user.name}
          </div>
          <div
            style={{
              display: 'block',
              color: 'var(--muted)',
              fontSize: 10.5,
              fontWeight: 500,
              fontFamily: 'var(--mono)',
              marginTop: 1,
            }}
          >
            {user.role}
          </div>
        </span>
      </div>
    </>
  )

  const asideBase: React.CSSProperties = {
    background: 'var(--glass)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    border: '1px solid var(--line)',
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
          background: 'var(--bg-2)',
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
