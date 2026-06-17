import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Package } from 'lucide-react'

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
}

export default function Sidebar({ items, brand, user }: SidebarProps) {
  const location = useLocation()

  return (
    <aside
      style={{
        width: 212,
        flex: '0 0 212px',
        background: 'var(--glass)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 14px',
        gap: 3,
        position: 'relative',
        zIndex: 2,
      }}
    >
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
            background: 'rgba(174,227,249,.12)',
            border: '1px solid var(--line-2)',
            display: 'grid',
            placeItems: 'center',
            color: 'var(--cyan)',
            flex: '0 0 auto',
          }}
        >
          <Package size={19} />
        </span>
        <span>
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
      </div>

      {/* Nav items */}
      {items.map(item => {
        const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
        return (
          <Link
            key={item.href}
            to={item.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 13,
              padding: '11px 13px',
              borderRadius: 11,
              color: isActive ? '#08233f' : 'var(--muted)',
              background: isActive ? 'var(--cyan)' : 'transparent',
              cursor: 'pointer',
              transition: '0.18s',
              fontWeight: 600,
              fontSize: 14,
              textDecoration: 'none',
            }}
            onMouseEnter={e => {
              if (!isActive) {
                ;(e.currentTarget as HTMLAnchorElement).style.color = '#fff'
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
                  background: isActive ? 'rgba(8,35,63,0.25)' : 'var(--cyan)',
                  color: '#08233f',
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
            background: 'rgba(174,227,249,.12)',
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
    </aside>
  )
}
