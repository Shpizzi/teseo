import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, Bell, Sparkles, Zap, Box, MapPin, Layers, Package, ScanLine, Leaf } from 'lucide-react'
import { TeseoLogo } from './LandingChrome'
import { searchModels } from './TeseoAssistant'
import { userProjects, fablabOrders } from '../mock'
import { producers } from '../mock/user-pages'

/* Topbar stile Shopify: sempre scura, logo a sinistra, ricerca globale al
   centro (funzioni, pezzi, fablab, progetti, risultati raggruppati con
   micro-label), a destra notifiche, AI (apre il drawer laterale) e profilo. */

type Hit = { group: string; icon: ReactNode; label: string; meta?: string; to: string }

type QuickTag = { label: string; icon?: ReactNode; to: string }

const USER_ACTIONS: Hit[] = [
  { group: 'AZIONI', icon: <Zap size={14} />, label: 'Nuova stampa', to: '/app/new' },
  { group: 'AZIONI', icon: <ScanLine size={14} />, label: 'Scansiona un oggetto', to: '/app/new' },
  { group: 'AZIONI', icon: <Layers size={14} />, label: 'I miei progetti', to: '/app/progetti' },
  { group: 'AZIONI', icon: <Box size={14} />, label: 'Modelli salvati', to: '/app/salvati' },
  { group: 'AZIONI', icon: <Box size={14} />, label: 'Archivio community', to: '/app/community' },
  { group: 'AZIONI', icon: <MapPin size={14} />, label: 'Trova un produttore', to: '/app/produttori' },
  { group: 'AZIONI', icon: <Leaf size={14} />, label: 'Il mio impatto', to: '/app/impatto' },
]

const FABLAB_ACTIONS: Hit[] = [
  { group: 'AZIONI', icon: <Zap size={14} />, label: 'Dashboard', to: '/fablab/dashboard' },
  { group: 'AZIONI', icon: <Package size={14} />, label: 'Ordini', to: '/fablab/ordini' },
  { group: 'AZIONI', icon: <Layers size={14} />, label: 'Coda e stampanti', to: '/fablab/coda' },
  { group: 'AZIONI', icon: <Leaf size={14} />, label: 'Impatto', to: '/fablab/impatto' },
]

const USER_TAGS: QuickTag[] = [
  { label: 'Nuova stampa', icon: <Zap size={12} />, to: '/app/new' },
  { label: 'Scansiona', icon: <ScanLine size={12} />, to: '/app/new' },
  { label: 'Produttori', icon: <MapPin size={12} />, to: '/app/produttori' },
  { label: 'Impatto', icon: <Leaf size={12} />, to: '/app/impatto' },
]

const FABLAB_TAGS: QuickTag[] = [
  { label: 'Ordini', icon: <Package size={12} />, to: '/fablab/ordini' },
  { label: 'Coda e stampanti', icon: <Layers size={12} />, to: '/fablab/coda' },
  { label: 'Impatto', icon: <Leaf size={12} />, to: '/fablab/impatto' },
]

function search(branch: 'user' | 'fablab', q: string): Hit[] {
  const query = q.trim().toLowerCase()
  const actions = branch === 'user' ? USER_ACTIONS : FABLAB_ACTIONS
  if (!query) return []
  const hits: Hit[] = actions.filter(a => a.label.toLowerCase().includes(query))

  if (branch === 'user') {
    hits.push(
      ...userProjects
        .filter(p => p.name.toLowerCase().includes(query))
        .map(p => ({ group: 'PROGETTI', icon: <Layers size={14} />, label: p.name, meta: p.fablab || 'bozza', to: '/app/progetti/' + p.id })),
      ...searchModels(query).slice(0, 4).map(h => ({ group: 'PEZZI', icon: <Box size={14} />, label: h.name, meta: h.meta, to: h.to })),
      ...producers
        .filter(p => (p.name + ' ' + p.materials.join(' ')).toLowerCase().includes(query))
        .map(p => ({ group: 'FABLAB', icon: <MapPin size={14} />, label: p.name, meta: `${p.distance} · ★ ${p.rating}`, to: '/app/produttori/' + p.id })),
    )
  } else {
    hits.push(
      ...fablabOrders
        .filter(o => (o.name + ' ' + o.customer + ' ' + o.ordNum).toLowerCase().includes(query))
        .map(o => ({ group: 'ORDINI', icon: <Package size={14} />, label: o.name, meta: `#${o.ordNum} · ${o.customer}`, to: '/fablab/ordini/' + o.id })),
    )
  }
  return hits.slice(0, 9)
}

const NOTIFICATIONS = [
  { title: 'Ricambio cardine finestra pronto', meta: 'DamA Space · ritiro entro ven 18:00' },
  { title: 'Nuovo messaggio da Tillverka', meta: '«La stampa è in corso, ETA circa 2h.»' },
  { title: 'Demogor all’84%', meta: 'ETA 2h 10m · Tillverka' },
]

type AppTopbarProps = {
  branch: 'user' | 'fablab'
  onOpenAi: () => void
  user: { initials: string; profileHref: string }
}

export default function AppTopbar({ branch, onOpenAi, user }: AppTopbarProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const hits = search(branch, query)
  const tags = branch === 'user' ? USER_TAGS : FABLAB_TAGS

  // chiudi dropdown su click fuori / Esc
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) { setFocused(false); setNotifOpen(false) }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setFocused(false); setNotifOpen(false) }
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [])

  const go = (to: string) => {
    setFocused(false)
    setQuery('')
    navigate(to)
  }

  const ink = '#f4faed'
  const muted = 'rgba(244,250,237,.65)'
  const line = 'rgba(178,235,118,.22)'
  const iconBtn: React.CSSProperties = {
    width: 38,
    height: 38,
    borderRadius: 10,
    border: 'none',
    background: 'transparent',
    color: muted,
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background .15s, color .15s',
  }

  // raggruppa i risultati mantenendo l'ordine dei gruppi
  const groups = hits.reduce<{ name: string; items: Hit[] }[]>((acc, h) => {
    const g = acc.find(x => x.name === h.group)
    if (g) g.items.push(h)
    else acc.push({ name: h.group, items: [h] })
    return acc
  }, [])

  return (
    <div
      ref={rootRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        height: 56,
        padding: '0 14px',
        background: 'var(--forest)',
        border: `1px solid ${line}`,
        borderRadius: 'var(--radius)',
        flex: '0 0 auto',
        position: 'relative',
        zIndex: 30,
      }}
    >
      {/* Logo + wordmark, come Shopify */}
      <Link
        to={branch === 'user' ? '/app/dashboard' : '/fablab/dashboard'}
        style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', flexShrink: 0, paddingLeft: 4 }}
      >
        <TeseoLogo size={21} color="var(--lemongrass)" />
      </Link>

      {/* Ricerca centrale */}
      <div style={{ flex: 1, maxWidth: 560, margin: '0 auto', position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            height: 38,
            padding: '0 13px',
            borderRadius: 10,
            background: 'rgba(178,235,118,.08)',
            border: `1px solid ${focused ? 'var(--lemongrass)' : line}`,
            transition: 'border-color .15s',
          }}
        >
          <Search size={15} color={muted} style={{ flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder={branch === 'user' ? 'Cerca funzioni, pezzi, produttori…' : 'Cerca ordini, funzioni…'}
            style={{
              flex: 1,
              minWidth: 0,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: 'inherit',
              fontSize: 13.5,
              color: ink,
            }}
            onKeyDown={e => { if (e.key === 'Enter' && hits[0]) go(hits[0].to) }}
          />
          <span
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              color: muted,
              border: `1px solid ${line}`,
              borderRadius: 5,
              padding: '2px 7px',
              flexShrink: 0,
            }}
          >
            ⌘ K
          </span>
        </div>

        {/* Dropdown: tag fissi (vuoto) o risultati raggruppati */}
        {focused && (
          <div
            style={{
              position: 'absolute',
              top: 44,
              left: 0,
              right: 0,
              background: 'var(--glass)',
              border: '1px solid var(--line-2)',
              borderRadius: 12,
              boxShadow: '0 18px 44px rgba(9,15,5,.16)',
              padding: 10,
              zIndex: 50,
            }}
          >
            {query.trim() === '' ? (
              <>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.1em', color: 'var(--muted-2)', padding: '4px 6px 8px', textTransform: 'uppercase' }}>
                  Azioni rapide
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, padding: '0 4px 4px' }}>
                  {tags.map(t => (
                    <button
                      key={t.label}
                      onClick={() => go(t.to)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        fontFamily: 'var(--mono)', fontSize: 11.5, fontWeight: 600,
                        color: 'var(--cyan)', background: 'rgba(63,115,8,.07)',
                        border: '1px solid var(--line-2)', borderRadius: 100,
                        padding: '7px 13px', cursor: 'pointer',
                      }}
                    >
                      {t.icon}
                      {t.label}
                    </button>
                  ))}
                </div>
              </>
            ) : hits.length === 0 ? (
              <div style={{ padding: '14px 10px', fontSize: 13, color: 'var(--muted)' }}>
                Nessun risultato per «{query}».
              </div>
            ) : (
              groups.map(g => (
                <div key={g.name}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.1em', color: 'var(--muted-2)', padding: '7px 6px 3px', textTransform: 'uppercase' }}>
                    {g.name}
                  </div>
                  {g.items.map(h => (
                    <button
                      key={h.group + h.to + h.label}
                      onClick={() => go(h.to)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                        padding: '8px 8px', borderRadius: 8, border: 'none',
                        background: 'transparent', cursor: 'pointer', textAlign: 'left',
                        fontFamily: 'inherit',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--glass-2)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                    >
                      <span style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--bg-2)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', color: 'var(--cyan)', flexShrink: 0 }}>
                        {h.icon}
                      </span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {h.label}
                        </span>
                        {h.meta && (
                          <span style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--muted)', marginTop: 1 }}>
                            {h.meta}
                          </span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Destra: notifiche · AI · profilo (come Shopify) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, position: 'relative' }}>
        <button
          aria-label="Notifiche"
          style={iconBtn}
          onClick={() => setNotifOpen(o => !o)}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(178,235,118,.1)'; e.currentTarget.style.color = ink }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = muted }}
        >
          <Bell size={17} />
          <span style={{ position: 'absolute', top: 8, right: 9, width: 7, height: 7, borderRadius: '50%', background: 'var(--lemongrass)', border: '1.5px solid var(--forest)' }} />
        </button>

        <button
          aria-label="Assistente AI"
          onClick={onOpenAi}
          style={{ ...iconBtn, color: 'var(--lemongrass)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(178,235,118,.12)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          <Sparkles size={17} />
        </button>

        <button
          aria-label="Profilo"
          onClick={() => navigate(user.profileHref)}
          style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(178,235,118,.14)',
            border: '1px solid rgba(178,235,118,.4)',
            color: 'var(--lemongrass)',
            display: 'grid', placeItems: 'center',
            fontWeight: 700, fontSize: 13, fontFamily: 'var(--mono)', cursor: 'pointer',
            marginLeft: 4,
          }}
        >
          {user.initials}
        </button>

        {/* Dropdown notifiche */}
        {notifOpen && (
          <div
            style={{
              position: 'absolute',
              top: 46,
              right: 0,
              width: 330,
              background: 'var(--glass)',
              border: '1px solid var(--line-2)',
              borderRadius: 12,
              boxShadow: '0 18px 44px rgba(9,15,5,.16)',
              padding: 8,
              zIndex: 50,
            }}
          >
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.1em', color: 'var(--muted-2)', padding: '6px 8px', textTransform: 'uppercase' }}>
              Notifiche
            </div>
            {NOTIFICATIONS.map(n => (
              <div key={n.title} style={{ padding: '9px 8px', borderRadius: 8, cursor: 'default' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{n.title}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--muted)', marginTop: 2 }}>{n.meta}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
