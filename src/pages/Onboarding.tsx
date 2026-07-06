import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Sparkles, Send, ArrowRight } from 'lucide-react'
import StreamText from '../components/StreamText'
import { searchModels } from '../components/TeseoAssistant'

// ponytail: onboarding Wizard-of-Oz, flusso guidato scriptato, nessun LLM reale.
// Se searchModels trova un match usa quello, altrimenti il fallback "gancio".

const mono: React.CSSProperties = { fontFamily: 'var(--mono)' }

type Item = { role: 'user' | 'assistant'; text: string; after?: () => void }
type Stage = 'welcome' | 'ask' | 'searching' | 'confirm' | 'ordering' | 'done'

const EXAMPLES = [
  'Si è rotto il gancio dell’appendiabiti',
  'Ho perso la manopola della moka',
  'La rotella della sedia è spezzata',
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [items, setItems] = useState<Item[]>([])
  const [thinking, setThinking] = useState<string | null>(null)
  const [stage, setStage] = useState<Stage>('welcome')
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  const push = (item: Item) => setItems(m => [...m, item])

  useEffect(() => {
    if (started.current) return
    started.current = true
    push({
      role: 'assistant',
      text: 'Ciao! Sono Teseo, il tuo assistente di riparazione. Per iniziare mi serve solo una cosa: raccontami cosa si è rotto, con parole tue.',
      after: () => setStage('ask'),
    })
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [items, thinking, stage])

  const send = (text: string) => {
    const t = text.trim()
    if (!t || stage !== 'ask') return
    setInput('')
    push({ role: 'user', text: t })
    setStage('searching')
    setThinking('Cerco nell’archivio della community…')
    setTimeout(() => {
      const hit = searchModels(t)[0]
      // Niente match nell'archivio? Nessun modello finto: si ricostruisce da scansione.
      const found = hit
        ? `Trovato: «${hit.name}» nell’archivio community (${hit.meta}). È compatibile con quello che mi hai descritto.`
        : 'Non ho ancora un modello pronto per questo nell’archivio. Nessun problema: lo ricostruiamo da una scansione (o una foto) e l’AI genera la mesh, poi la fa validare da una persona.'
      const producerLine = hit
        ? 'FabLab Milano è disponibile a 4,1 km: in PLA costa ~€ 4, pronto domani entro le 12. Preparo l’ordine?'
        : 'FabLab Milano è disponibile a 4,1 km e può ricostruirlo e stamparlo in PLA: prima una scansione veloce del pezzo, poi la stampa. Procediamo?'
      setThinking(null)
      push({
        role: 'assistant',
        text: found,
        after: () => {
          setThinking('Confronto i produttori disponibili vicino a te…')
          setTimeout(() => {
            setThinking(null)
            push({
              role: 'assistant',
              text: producerLine,
              after: () => setStage('confirm'),
            })
          }, 1600)
        },
      })
    }, 1600)
  }

  const confirm = () => {
    push({ role: 'user', text: 'Sì, procedi' })
    setStage('ordering')
    setThinking('Preparo ordine e preventivo…')
    setTimeout(() => {
      setThinking(null)
      push({
        role: 'assistant',
        text: 'Fatto! Ho preparato la bozza dell’ordine con FabLab Milano: la trovi nella tua dashboard, insieme al tracking della stampa. Da qui in poi ci penso io.',
        after: () => setStage('done'),
      })
    }, 1600)
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', padding: '0 6%' }}>
      {/* Header minimale */}
      <div style={{ width: '100%', maxWidth: 640, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 0', flex: '0 0 auto' }}>
        <Link to="/" style={{ ...mono, fontSize: 15, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--ink)', textDecoration: 'none' }}>
          TESEO
        </Link>
        <button
          onClick={() => navigate('/app/dashboard')}
          style={{ ...mono, fontSize: 12, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.04em' }}
        >
          Salta l’onboarding ›
        </button>
      </div>

      <div style={{ ...mono, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: 14, flex: '0 0 auto' }}>
        Onboarding · Ripara il tuo primo oggetto
      </div>

      {/* Chat card */}
      <div
        className="anim-fadeUp"
        style={{
          width: '100%', maxWidth: 640, flex: '1 1 auto', minHeight: 0, marginBottom: 26,
          background: 'var(--glass)', border: '1px solid var(--line-2)',
          borderRadius: 'var(--radius)', boxShadow: '0 24px 60px rgba(9,15,5,.14)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative',
        }}
      >
        <div style={{ background: 'var(--forest)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 auto' }}>
          <span style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(178,235,118,.14)', display: 'grid', placeItems: 'center', color: 'var(--lemongrass)' }}>
            <Sparkles size={15} />
          </span>
          <div>
            <div style={{ color: '#fff', fontSize: 13.5, fontWeight: 600 }}>Teseo AI</div>
            <div style={{ ...mono, color: 'var(--lemongrass)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Orchestratore · online
            </div>
          </div>
        </div>

        {/* Messaggi */}
        <div ref={scrollRef} style={{ flex: 1, overflow: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 11 }}>
          {items.map((m, i) => (
            <div
              key={i}
              style={{
                maxWidth: '86%', padding: '11px 14px', fontSize: 14, lineHeight: 1.55,
                borderRadius: m.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                background: m.role === 'user' ? 'var(--forest)' : 'var(--glass-2)',
                color: m.role === 'user' ? '#fff' : 'var(--ink)',
                border: m.role === 'user' ? 'none' : '1px solid var(--line)',
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              {m.role === 'assistant' ? <StreamText text={m.text} onDone={m.after} /> : m.text}
            </div>
          ))}

          {thinking && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 2px' }}>
              <Sparkles size={13} color="var(--cyan)" style={{ animation: 'blink 1.5s infinite' }} />
              <span className="ai-shimmer" style={{ fontSize: 12.5, fontWeight: 500 }}>{thinking}</span>
            </div>
          )}

          {stage === 'ask' && items.length === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
              {EXAMPLES.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  style={{
                    textAlign: 'left', fontSize: 13, color: 'var(--ink)', cursor: 'pointer',
                    padding: '9px 12px', borderRadius: 9,
                    background: 'transparent', border: '1px dashed var(--line-2)',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {stage === 'confirm' && (
            <div style={{ display: 'flex', gap: 7 }}>
              <button
                onClick={confirm}
                style={{ ...mono, fontSize: 11, fontWeight: 600, letterSpacing: '0.03em', padding: '7px 12px', borderRadius: 7, border: '1px solid var(--cyan)', color: 'var(--cyan)', background: 'transparent', cursor: 'pointer' }}
              >
                Sì, procedi ›
              </button>
              <button
                onClick={() => navigate('/app/produttori')}
                style={{ ...mono, fontSize: 11, fontWeight: 600, letterSpacing: '0.03em', padding: '7px 12px', borderRadius: 7, border: '1px solid var(--line-2)', color: 'var(--muted)', background: 'transparent', cursor: 'pointer' }}
              >
                Vedi alternative ›
              </button>
            </div>
          )}

          {stage === 'done' && (
            <button
              onClick={() => navigate('/app/dashboard')}
              className="btn-spade"
              style={{ height: 44, padding: '0 22px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'flex-start', marginTop: 4 }}
            >
              Entra nella tua dashboard
              <ArrowRight size={16} />
            </button>
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
            placeholder="Es. si è rotta la clip dello zaino…"
            disabled={stage !== 'ask'}
            style={{
              flex: 1, height: 40, padding: '0 13px', fontSize: 13.5,
              background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 9,
              color: 'var(--ink)', outline: 'none', opacity: stage === 'ask' ? 1 : 0.55,
            }}
          />
          <button
            type="submit"
            className="btn-spade"
            disabled={!input.trim() || stage !== 'ask'}
            style={{ width: 40, height: 40, padding: 0, display: 'grid', placeItems: 'center' }}
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  )
}
