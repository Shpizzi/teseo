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

export default function FablabSlicingLayout() {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
        padding: '22px 0 22px 22px',
      }}
    >
      <Sidebar
        items={fablabNavItems}
        brand={{ subtitle: 'FabLab Lambrate' }}
        user={{ initials: 'L', name: 'Lambrate', role: 'account fablab' }}
      />
      <Outlet />
    </div>
  )
}
