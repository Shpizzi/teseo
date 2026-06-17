import { Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Grid2X2,
  Bookmark,
  Users,
  MapPin,
} from 'lucide-react'
import Sidebar, { type NavItem } from '../components/Sidebar'

const userNavItems: NavItem[] = [
  { label: 'Dashboard',  icon: <LayoutDashboard size={20} />, href: '/app/dashboard' },
  { label: 'Progetti',   icon: <Grid2X2 size={20} />,         href: '/app/progetti' },
  { label: 'Salvati',    icon: <Bookmark size={20} />,         href: '/app/salvati' },
  { label: 'Community',  icon: <Users size={20} />,            href: '/app/community' },
  { label: 'Produttori', icon: <MapPin size={20} />,           href: '/app/produttori' },
]

export default function UserLayout() {
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
        items={userNavItems}
        brand={{ subtitle: 'spazio personale' }}
        user={{ initials: 'F', name: 'Francesca R.', role: 'account base' }}
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
