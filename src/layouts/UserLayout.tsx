import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Grid2X2,
  Bookmark,
  Users,
  MapPin,
  MessageSquare,
  Leaf,
  Menu,
} from 'lucide-react'
import Sidebar, { type NavItem } from '../components/Sidebar'
import AppTopbar from '../components/AppTopbar'
import TeseoAssistant from '../components/TeseoAssistant'
import { useIsMobile } from '../hooks/useIsMobile'
import { Toaster } from '../components/Toast'
import { conversations } from '../mock/user-pages'

const unreadCount = conversations.reduce((n, c) => n + c.unread, 0)

const userNavItems: NavItem[] = [
  { label: 'Dashboard',  icon: <LayoutDashboard size={20} />, href: '/app/dashboard' },
  { label: 'Progetti',   icon: <Grid2X2 size={20} />,         href: '/app/progetti' },
  { label: 'Salvati',    icon: <Bookmark size={20} />,         href: '/app/salvati' },
  { label: 'Archivio pezzi', icon: <Users size={20} />,        href: '/app/community' },
  { label: 'Produttori', icon: <MapPin size={20} />,           href: '/app/produttori' },
  { label: 'Messaggi',   icon: <MessageSquare size={20} />,    href: '/app/messages', badge: unreadCount },
  { label: 'Impatto',    icon: <Leaf size={20} />,             href: '/app/impatto' },
]

export default function UserLayout() {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)

  // La barra "Chiedi all'AI" della dashboard apre il drawer con la domanda
  useEffect(() => {
    const h = () => setAiOpen(true)
    window.addEventListener('teseo:ask', h)
    return () => window.removeEventListener('teseo:ask', h)
  }, [])

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? 12 : 16,
        padding: isMobile ? 14 : 22,
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      {/* Topbar stile Shopify: ricerca globale + notifiche + AI + profilo */}
      <AppTopbar
        branch="user"
        onOpenAi={() => setAiOpen(true)}
        user={{ initials: 'F', profileHref: '/app/profile' }}
      />

      <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: isMobile ? 0 : 16, overflow: 'hidden' }}>
        <Sidebar
          items={userNavItems}
          brand={{ subtitle: 'spazio personale' }}
          user={{ initials: 'F', name: 'Francesca R.', role: 'account base', href: '/app/profile' }}
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

        {/* Pannello AI inline stile Sidekick: affianca il contenuto col gap del layout */}
        <TeseoAssistant open={aiOpen} onClose={() => setAiOpen(false)} />
      </div>

      <Toaster />
    </div>
  )
}
