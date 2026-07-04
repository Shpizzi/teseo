import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { Toaster } from '../components/Toast'
import { fablabNavItems } from './FablabLayout'

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
      <Toaster />
    </div>
  )
}
