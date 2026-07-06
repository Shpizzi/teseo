import { useState } from 'react'
import { Plus, Clock, CheckCircle2, Box, HelpCircle, Leaf, Sparkles, ArrowRight, CalendarDays, Bell, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PrimaryButton from '../../components/PrimaryButton'
import GlassCard from '../../components/GlassCard'
import StatusPill from '../../components/StatusPill'
import ProgressBar from '../../components/ProgressBar'
import { userProjects, userImpactRows } from '../../mock'
import { conversations } from '../../mock/user-pages'
import type { ReactNode } from 'react'
import type { ProjectStatus } from '../../mock'

const statusIcon: Record<ProjectStatus, ReactNode> = {
  printing: <Box size={26} />,
  ready: <CheckCircle2 size={26} />,
  draft: <Clock size={26} />,
  error: <HelpCircle size={26} />,
}

// Eventi della community: la rete è fatta di posti veri, non solo di ordini
const COMMUNITY_EVENTS = [
  { photo: '/landing/fablab-a.jpg', date: 'SAB 12 LUG', title: 'Repair Café di quartiere', place: 'DamA Space · Navigli' },
  { photo: '/landing/fablab-b.jpg', date: 'GIO 18 LUG', title: 'Workshop: il tuo primo ricambio', place: 'FabLab Milano · Bovisa' },
  { photo: '/landing/fablab-c.jpg', date: 'SAB 25 LUG', title: 'Print Party: giocattoli rinati', place: 'Tillverka · Lambrate' },
]

/* Dashboard "easy": hero centrata con la barra Chiedi all'AI, progetti in
   corso + pronto al ritiro, impatto short e gli eventi della community. */
export default function Dashboard() {
  const navigate = useNavigate()
  const [aiQuery, setAiQuery] = useState('')
  const active = userProjects.filter(p => p.status === 'printing' || p.status === 'ready')
  const inStampa = userProjects.filter(p => p.status === 'printing').length
  const readyProject = userProjects.find(p => p.status === 'ready')
  const co2 = userImpactRows.reduce((s, r) => s + r.co2Kg, 0)
  const euro = userImpactRows.reduce((s, r) => s + r.euro, 0)

  // Colonna destra come feed di notifiche derivate dai dati reali, non 2 card statiche.
  const notifications = [
    ...(readyProject
      ? [{ icon: <CheckCircle2 size={16} />, title: `${readyProject.name} pronto al ritiro`, meta: `${readyProject.fablab} · ritiro entro ven 18:00`, onClick: () => navigate('/app/progetti/' + readyProject.id) }]
      : []),
    ...conversations.filter(c => c.unread > 0).map(c => ({
      icon: <MessageSquare size={16} />, title: `Nuovo messaggio da ${c.fablab}`, meta: c.lastMessage,
      onClick: () => navigate('/app/messages', { state: { conversationId: c.id } }),
    })),
    ...userProjects.filter(p => p.status === 'printing').map(p => ({
      icon: <Box size={16} />, title: `${p.name} in stampa · ${p.progress}%`, meta: `${p.fablab} · ${p.eta}`,
      onClick: () => navigate('/app/progetti/' + p.id),
    })),
    { icon: <Leaf size={16} />, title: `Hai già evitato ${co2.toFixed(1)} kg di CO₂`, meta: `€ ${euro.toFixed(0)} risparmiati · ${userImpactRows.length} oggetti salvati`, onClick: () => navigate('/app/impatto') },
  ]

  // La barra AI della dashboard apre il drawer TeseoAssistant con la domanda
  const ask = (q: string) => {
    const t = q.trim()
    if (!t) return
    window.dispatchEvent(new CustomEvent('teseo:ask', { detail: t }))
    setAiQuery('')
  }

  const mono: React.CSSProperties = { fontFamily: 'var(--mono)' }

  return (
    <div style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* ── Hero centrata ── */}
      <div className="anim-fadeUp" style={{ position: 'relative', padding: '26px 0 6px', flex: '0 0 auto' }}>
        <div style={{ position: 'absolute', right: 0, top: 10 }}>
          <PrimaryButton onClick={() => navigate('/app/new')}>
            <Plus size={18} />
            Nuova stampa
          </PrimaryButton>
        </div>

        <div style={{ maxWidth: 620, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <h1 style={{ fontWeight: 700, fontSize: 30, letterSpacing: '-0.01em', color: 'var(--ink)', textAlign: 'center' }}>
            Ciao, Francesca
          </h1>

          {/* Chiedi all'AI */}
          <form
            onSubmit={e => { e.preventDefault(); ask(aiQuery) }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: 'min(560px, 100%)',
              height: 52,
              padding: '0 8px 0 18px',
              background: 'var(--glass)',
              border: '1px solid var(--line-2)',
              borderRadius: 100,
              boxShadow: '0 8px 30px rgba(9,15,5,.07)',
            }}
          >
            <Sparkles size={17} color="var(--cyan)" style={{ flexShrink: 0 }} />
            <input
              value={aiQuery}
              onChange={e => setAiQuery(e.target.value)}
              placeholder='Chiedi all’AI: «a che punto è la mia stampa?»'
              style={{
                flex: 1,
                minWidth: 0,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontFamily: 'inherit',
                fontSize: 14.5,
                color: 'var(--ink)',
              }}
            />
            <button
              type="submit"
              aria-label="Chiedi all'AI"
              disabled={!aiQuery.trim()}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                border: 'none',
                background: 'var(--forest)',
                color: 'var(--lemongrass)',
                display: 'grid',
                placeItems: 'center',
                cursor: aiQuery.trim() ? 'pointer' : 'default',
                opacity: aiQuery.trim() ? 1 : 0.45,
                flexShrink: 0,
                transition: 'opacity .15s',
              }}
            >
              <ArrowRight size={17} />
            </button>
          </form>

          <p style={{ ...mono, color: 'var(--muted)', fontSize: 12, fontWeight: 500, letterSpacing: '0.04em' }}>
            {inStampa} {inStampa === 1 ? 'STAMPA' : 'STAMPE'} IN CORSO{readyProject ? ' · 1 PRONTO AL RITIRO' : ''}
          </p>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div
        className="anim-fadeUp"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.55fr 1fr',
          gap: 16,
          flex: '0 0 auto',
          alignItems: 'start',
        }}
      >
        {/* Left: progetti in corso / pronti */}
        <GlassCard hero style={{ padding: 22, display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
              position: 'relative',
            }}
          >
            <h3
              style={{
                ...mono,
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
              }}
            >
              Progetti in corso
            </h3>
            <span
              onClick={() => navigate('/app/progetti')}
              style={{ ...mono, color: 'var(--cyan)', fontSize: 12, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.04em' }}
            >
              TUTTI I PROGETTI ›
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {active.map((project, i) => (
              <div
                key={project.id}
                onClick={() => navigate('/app/progetti/' + project.id)}
                style={{
                  padding: '20px 6px',
                  borderTop: i === 0 ? 'none' : '1px solid var(--line)',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--glass-2)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 16,
                      flex: '0 0 auto',
                      background: 'var(--glass-2)',
                      border: '1px solid var(--line)',
                      display: 'grid',
                      placeItems: 'center',
                      color: 'var(--muted)',
                    }}
                  >
                    {statusIcon[project.status]}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 20,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: 'var(--ink)',
                      }}
                    >
                      {project.name}
                    </div>
                    <div style={{ ...mono, color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>
                      {project.fablab} · {project.material}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flex: '0 0 auto' }}>
                    <StatusPill status={project.status} />
                    {project.eta && (
                      <span style={{ ...mono, fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>
                        {project.eta}
                      </span>
                    )}
                  </div>
                </div>

                {project.status === 'printing' && (
                  <div style={{ paddingLeft: 80, marginTop: 14 }}>
                    <ProgressBar value={project.progress} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Right column: feed notifiche */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <GlassCard style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span
                style={{
                  width: 32, height: 32, borderRadius: 9, background: 'var(--bg-2)',
                  border: '1px solid var(--line)', display: 'grid', placeItems: 'center', color: 'var(--cyan)',
                }}
              >
                <Bell size={16} />
              </span>
              <h4 style={{ ...mono, fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink)', flex: 1 }}>
                Notifiche
              </h4>
              <span style={{ ...mono, fontSize: 11, color: 'var(--muted)' }}>{notifications.length}</span>
            </div>
            {notifications.map((n, i) => (
              <button
                key={i}
                onClick={n.onClick}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10, textAlign: 'left', width: '100%',
                  background: 'transparent', border: 'none', borderTop: i > 0 ? '1px solid var(--line)' : 'none',
                  padding: '11px 4px', cursor: 'pointer', fontFamily: 'inherit', transition: '0.15s', borderRadius: 8,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--glass-2)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
              >
                <span style={{ color: 'var(--cyan)', flex: '0 0 auto', marginTop: 1 }}>{n.icon}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{n.title}</span>
                  <span style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.meta}</span>
                </span>
                <ArrowRight size={14} style={{ color: 'var(--muted-2)', flex: '0 0 auto', marginTop: 2 }} />
              </button>
            ))}
          </GlassCard>
        </div>
      </div>

      {/* ── Eventi community ── */}
      <div className="anim-fadeUp" style={{ flex: '0 0 auto', paddingBottom: 8 }}>
        <div
          style={{
            ...mono,
            textAlign: 'center',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            margin: '6px 0 16px',
          }}
        >
          Eventi community
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {COMMUNITY_EVENTS.map(ev => (
            <GlassCard
              key={ev.title}
              style={{ overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
              onClick={() => navigate('/app/community')}
            >
              <div style={{ position: 'relative', aspectRatio: '16 / 7', overflow: 'hidden' }}>
                <img
                  src={ev.photo}
                  alt={ev.title}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  style={{
                    ...mono,
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    background: 'rgba(255,255,255,.94)',
                    border: '1px solid var(--line)',
                    borderRadius: 6,
                    padding: '4px 9px',
                    color: 'var(--cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <CalendarDays size={11} />
                  {ev.date}
                </span>
              </div>
              <div style={{ padding: '14px 16px 16px' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{ev.title}</div>
                <div style={{ ...mono, fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{ev.place}</div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  )
}
