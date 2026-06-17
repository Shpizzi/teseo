import { Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingBag,
  Activity,
  Printer,
  Users,
  Box,
} from 'lucide-react'
import Sidebar, { type NavItem } from '../components/Sidebar'

const fablabNavItems: NavItem[] = [
  { label: 'Dashboard',  icon: <LayoutDashboard size={20} />, href: '/fablab/dashboard' },
  { label: 'Ordini',     icon: <ShoppingBag size={20} />,     href: '/fablab/ordini', badge: 2 },
  { label: 'Slicing',    icon: <Box size={20} />,             href: '/fablab/slicing' },
  { label: 'Coda',       icon: <Activity size={20} />,        href: '/fablab/coda' },
  { label: 'Stampanti',  icon: <Printer size={20} />,         href: '/fablab/stampanti' },
  { label: 'Community',  icon: <Users size={20} />,           href: '/fablab/community' },
]

export default function FablabLayout() {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        gap: 16,
        padding: 22,
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      <Sidebar
        items={fablabNavItems}
        brand={{ subtitle: 'FabLab Lambrate' }}
        user={{ initials: 'L', name: 'Lambrate', role: 'account fablab' }}
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
        <Outlet />
      </div>
    </div>
  )
}
