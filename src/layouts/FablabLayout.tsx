import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingBag,
  Activity,
  Printer,
  Users,
  Box,
  Menu,
} from 'lucide-react'
import Sidebar, { type NavItem } from '../components/Sidebar'
import { useIsMobile } from '../hooks/useIsMobile'

const fablabNavItems: NavItem[] = [
  { label: 'Dashboard',  icon: <LayoutDashboard size={20} />, href: '/fablab/dashboard' },
  { label: 'Ordini',     icon: <ShoppingBag size={20} />,     href: '/fablab/ordini', badge: 2 },
  { label: 'Slicing',    icon: <Box size={20} />,             href: '/fablab/slicing' },
  { label: 'Coda',       icon: <Activity size={20} />,        href: '/fablab/coda' },
  { label: 'Stampanti',  icon: <Printer size={20} />,         href: '/fablab/stampanti' },
  { label: 'Community',  icon: <Users size={20} />,           href: '/fablab/community' },
]

export default function FablabLayout() {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        gap: isMobile ? 0 : 16,
        padding: isMobile ? 14 : 22,
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      <Sidebar
        items={fablabNavItems}
        brand={{ subtitle: 'FabLab Lambrate' }}
        user={{ initials: 'L', name: 'Lambrate', role: 'account fablab' }}
        {...(isMobile ? { open, onClose: () => setOpen(false) } : {})}
      />
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          overflow: 'hidden',
        }}
      >
        {isMobile && (
          <button
            onClick={() => setOpen(true)}
            aria-label="Apri menu"
            style={{
              display: 'flex', alignItems: 'center', gap: 9, alignSelf: 'flex-start',
              background: 'var(--glass)', border: '1px solid var(--line)', borderRadius: 11,
              color: 'var(--ink)', padding: '8px 14px', cursor: 'pointer', flex: '0 0 auto',
              fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.08em',
            }}
          >
            <Menu size={18} style={{ color: 'var(--cyan)' }} /> MENU
          </button>
        )}
        <Outlet />
      </div>
    </div>
  )
}
