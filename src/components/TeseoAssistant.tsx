import { useEffect, useRef, useState } from 'react'
import { Sparkles, X, Send } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { userProjects, userImpactRows } from '../mock'
import { communityModels, savedModels, producers } from '../mock/user-pages'

// ponytail: orchestratore Wizard-of-Oz — router a keyword sui mock, nessun LLM reale.
// Upgrade path: sostituire orchestrate() con una chiamata API in streaming.

type Chip = { label: string; to: string }
type Msg = { role: 'user' | 'assistant'; text: string; chips?: Chip[] }

// Ricerca oggetti: token della query vs nome/tag/categoria dei modelli.
// Condivisa con lo step 1 di /app/new ("Nuova stampa").
export type ModelHit = { name: string; meta: string; to: string }

export function searchModels(query: string): ModelHit[] {
  const tokens = query.toLowerCase().replace(/[^\wàèéìòù ]/g, '').split(/\s+/).filter(t => t.length >= 4)
  if (!tokens.length) return []
  const match = (hay: string) => tokens.some(t => hay.toLowerCase().includes(t))
  return [
    ...communityModels
      .filter(m => match(m.name + ' ' + m.category + ' ' + m.tags.join(' ')))
      .map(m => ({ name: m.name, meta: `Community · ★ ${m.rating} · ${m.downloads.toLocaleString('it-IT')} download`, to: '/app/community/' + m.id })),
    ...savedModels
      .filter(m => match(m.name + ' ' + m.category + ' ' + m.tags.join(' ')))
      .map(m => ({ name: m.name, meta: `Salvati · ${m.category}`, to: '/app/salvati' })),
  ]
}

const SUGGESTIONS = [
  'A che punto è la mia stampa?',
  'Cerca un ricambio nell’archivio',
  'Produttori disponibili vicino a me',
  'Quanto ho risparmiato finora?',
]

function orchestrate(input: string): Msg {
  const q = input.toLowerCase()
  const has = (re: RegExp) => re.test(q)

  if (has(/stato|punto|avanzament|quanto manca|eta|in corso|mia stampa|miei? (ordini|progetti)/)) {
    const printing = userProjects.filter(p => p.status === 'printing')
    return {
      role: 'assistant',
      text: printing.length
        ? `Hai ${printing.length} stampe in corso: ${printing.map(p => `«${p.name}» al ${p.progress}% (${p.eta}, ${p.fablab})`).join(' e ')}. Ti avviso io quando sono pronte al ritiro.`
        : 'Non hai stampe in corso al momento.',
      chips: printing.map(p => ({ label: p.name.split(' — ')[0], to: '/app/progetti/' + p.id })),
    }
  }

  if (has(/ritir|pront[oi]/)) {
    const ready = userProjects.find(p => p.status === 'ready')
    return ready
      ? {
          role: 'assistant',
          text: `«${ready.name}» è pronto da ${ready.fablab}. ${ready.eta}. Ti apro i dettagli per il ritiro?`,
          chips: [{ label: 'Dettagli ritiro', to: '/app/progetti/' + ready.id }],
        }
      : { role: 'assistant', text: 'Nessun pezzo pronto al ritiro al momento.' }
  }

  if (has(/produttor|fablab|laborator|vicin|dove stamp/)) {
    const avail = producers.filter(p => p.available)
    return {
      role: 'assistant',
      text: `Ci sono ${avail.length} laboratori disponibili ora vicino a te: ${avail.map(p => `${p.name} (${p.distance}, ★${p.rating})`).join(', ')}. Vuoi vederli sulla mappa?`,
      chips: [{ label: 'Apri mappa', to: '/app/produttori' }, ...avail.slice(0, 2).map(p => ({ label: p.name, to: '/app/produttori/' + p.id }))],
    }
  }

  if (has(/impatto|co2|risparmi|ambiente/)) {
    const co2 = userImpactRows.reduce((s, r) => s + r.co2Kg, 0)
    const euro = userImpactRows.reduce((s, r) => s + r.euro, 0)
    return {
      role: 'assistant',
      text: `Con le tue riparazioni hai evitato ${co2.toFixed(1)} kg di CO₂ e risparmiato € ${euro.toFixed(2)} rispetto all'acquisto di pezzi nuovi.`,
      chips: [{ label: 'Dashboard impatto', to: '/app/impatto' }],
    }
  }

  const hits = searchModels(q)
  if (hits.length) {
    return {
      role: 'assistant',
      text: `Ho trovato ${hits.length} modell${hits.length === 1 ? 'o' : 'i'} compatibil${hits.length === 1 ? 'e' : 'i'} nell'archivio: ${hits.map(h => `«${h.name}»`).join(', ')}. Posso preparare subito un preventivo con un produttore vicino.`,
      chips: [...hits.slice(0, 3).map(h => ({ label: h.name, to: h.to })), { label: 'Nuova stampa', to: '/app/new' }],
    }
  }

  if (has(/rott|ripar|ricambi|pezz|stampa|nuov|carica|scansion|preventiv/)) {
    return {
      role: 'assistant',
      text: 'Posso aiutarti a rifarlo: scansiona il pezzo con la fotocamera o carica un modello, e cerco il match nell\'archivio e il produttore più vicino.',
      chips: [{ label: 'Scansiona / carica', to: '/app/new' }, { label: 'Sfoglia community', to: '/app/community' }],
    }
  }

  return {
    role: 'assistant',
    text: 'Posso cercare modelli e ricambi nell\'archivio, controllare le tue stampe, trovarti un produttore disponibile o dirti quanto hai risparmiato. Cosa ti serve?',
    chips: [{ label: 'Nuova stampa', to: '/app/new' }, { label: 'Community', to: '/app/community' }],
  }
}

const mono: React.CSSProperties = { fontFamily: 'var(--mono)' }

export default function TeseoAssistant() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', text: 'Ciao Francesca! Sono l\'assistente di Teseo: orchestro ricerca, produttori e ordini per te. Chiedimi qualsiasi cosa.' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing, open])

  const send = (text: string) => {
    const t = text.trim()
    if (!t || typing) return
    setInput('')
    setMsgs(m => [...m, { role: 'user', text: t }])
    setTyping(true)
    setTimeout(() => {
      setMsgs(m => [...m, orchestrate(t)])
      setTyping(false)
    }, 900 + Math.random() * 600)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="btn-spade"
        style={{
          position: 'fixed', right: 26, bottom: 26, zIndex: 60,
          height: 46, padding: '0 20px', fontSize: 13.5,
          display: 'flex', alignItems: 'center', gap: 9,
          boxShadow: '0 8px 24px rgba(9,15,5,.18)',
        }}
      >
        <Sparkles size={16} />
        Chiedi a Teseo
      </button>
    )
  }

  return (
    <div
      style={{
        position: 'fixed', right: 26, bottom: 26, zIndex: 60,
        width: 392, height: 'min(560px, calc(100vh - 52px))',
        background: 'var(--glass)', border: '1px solid var(--line-2)',
        borderRadius: 'var(--radius)', boxShadow: '0 18px 48px rgba(9,15,5,.22)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}
    >
      {/* Header forest */}
      <div style={{ background: 'var(--forest)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 auto' }}>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(178,235,118,.14)', display: 'grid', placeItems: 'center', color: 'var(--lemongrass)' }}>
          <Sparkles size={15} />
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#fff', fontSize: 13.5, fontWeight: 600 }}>Teseo AI</div>
          <div style={{ ...mono, color: 'var(--lemongrass)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Orchestratore · online
          </div>
        </div>
        <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.7)', cursor: 'pointer', padding: 4 }}>
          <X size={17} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 7, alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div
              style={{
                maxWidth: '85%', padding: '10px 13px', fontSize: 13.5, lineHeight: 1.55,
                borderRadius: m.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                background: m.role === 'user' ? 'var(--forest)' : 'var(--glass-2)',
                color: m.role === 'user' ? '#fff' : 'var(--ink)',
                border: m.role === 'user' ? 'none' : '1px solid var(--line)',
              }}
            >
              {m.text}
            </div>
            {m.chips && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {m.chips.map(c => (
                  <button
                    key={c.to + c.label}
                    onClick={() => navigate(c.to)}
                    style={{
                      ...mono, fontSize: 11, fontWeight: 600, letterSpacing: '0.03em',
                      padding: '6px 11px', borderRadius: 7, cursor: 'pointer',
                      background: 'transparent', border: '1px solid var(--line-2)', color: 'var(--cyan)',
                    }}
                  >
                    {c.label} ›
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div style={{ display: 'flex', gap: 4, padding: '11px 13px', borderRadius: '12px 12px 12px 4px', background: 'var(--glass-2)', border: '1px solid var(--line)', width: 'fit-content' }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--muted)', animation: 'blink 1s infinite', animationDelay: `${i * 0.18}s` }} />
            ))}
          </div>
        )}
        {msgs.length === 1 && !typing && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                style={{
                  textAlign: 'left', fontSize: 12.5, color: 'var(--ink)', cursor: 'pointer',
                  padding: '9px 12px', borderRadius: 9,
                  background: 'transparent', border: '1px dashed var(--line-2)',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={e => { e.preventDefault(); send(input) }}
        style={{ display: 'flex', gap: 8, padding: 12, borderTop: '1px solid var(--line)', flex: '0 0 auto' }}
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Scrivi a Teseo…"
          style={{
            flex: 1, height: 40, padding: '0 13px', fontSize: 13.5,
            background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 9,
            color: 'var(--ink)', outline: 'none',
          }}
        />
        <button
          type="submit"
          className="btn-spade"
          disabled={!input.trim() || typing}
          style={{ width: 40, height: 40, padding: 0, display: 'grid', placeItems: 'center' }}
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  )
}
