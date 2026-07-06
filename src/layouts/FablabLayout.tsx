import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingBag,
  Activity,
  Leaf,
  Menu,
} from 'lucide-react'
import Sidebar, { type NavItem } from '../components/Sidebar'
import AppTopbar from '../components/AppTopbar'
import TeseoAssistant from '../components/TeseoAssistant'
import { useIsMobile } from '../hooks/useIsMobile'
import { Toaster } from '../components/Toast'
import { fablabOrders } from '../mock'

const newOrders = fablabOrders.filter(o => o.status === 'new').length

// Stampanti e Slicing fuori dalla sidebar: le stampanti vivono in "Coda e
// stampanti", lo slicing è coming soon (raggiungibile dal dettaglio ordine).
export const fablabNavItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/fablab/dashboard' },
  { label: 'Ordini', icon: <ShoppingBag size={20} />, href: '/fablab/ordini', badge: newOrders },
  { label: 'Coda e stampanti', icon: <Activity size={20} />, href: '/fablab/coda' },
  { label: 'Impatto', icon: <Leaf size={20} />, href: '/fablab/impatto' },
]

export default function FablabLayout() {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
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
      {/* Funzioni comuni alla dashboard clienti: ricerca globale, notifiche, AI.
          Versione scura per marcare che qui sei nel lato produttore. */}
      <AppTopbar
        branch="fablab"
        onOpenAi={() => setAiOpen(true)}
        user={{ initials: 'T', profileHref: '/fablab/dashboard' }}
      />

      <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: isMobile ? 0 : 16, overflow: 'hidden' }}>
        <Sidebar
          dark
          items={fablabNavItems}
          brand={{ subtitle: 'spazio produttore' }}
          {...(isMobile ? { open, onClose: () => setOpen(false) } : { collapsed, onToggleCollapse: () => setCollapsed(v => !v) })}
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
