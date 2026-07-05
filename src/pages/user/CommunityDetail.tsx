import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Download, Star, Bookmark, Check, GitFork, GitBranch, Upload, Sparkles, X, RotateCcw } from 'lucide-react'
import GlassCard from '../../components/GlassCard'
import PrimaryButton from '../../components/PrimaryButton'
import PrintViewer3D from '../../components/PrintViewer3D'
import { communityModels } from '../../mock/user-pages'
import { toast } from '../../components/Toast'

const mono: React.CSSProperties = { fontFamily: 'var(--mono)' }

type DiffLine = { from: string; to: string; label: string }
type PendingVersion = { note: string; diff: DiffLine[]; source: 'upload' | 'ai' }

// ponytail: diff finto ma coerente — Wizard of Oz come lo scan. Upgrade path:
// confronto reale delle mesh quando esisteranno file veri.
const UPLOAD_DIFF: DiffLine[] = [
  { label: 'Spessore parete', from: '2.0 mm', to: '2.4 mm' },
  { label: 'Tolleranza snodo', from: '0.30 mm', to: '0.20 mm' },
  { label: 'Vertici mesh', from: '18.402', to: '18.734' },
]

function aiDiff(request: string): DiffLine[] {
  const q = request.toLowerCase()
  const lines: DiffLine[] = []
  if (/for[oi]|buco|diametro/.test(q)) lines.push({ label: 'Foro centrale', from: 'Ø 5.0 mm', to: 'Ø 5.2 mm' })
  if (/spessor|parete|robust|rinforz|resistent/.test(q)) lines.push({ label: 'Spessore parete', from: '2.0 mm', to: '2.6 mm' })
  if (/grand|scal|allarg|lung/.test(q)) lines.push({ label: 'Scala complessiva', from: '100%', to: '110%' })
  if (/gancio|aggancio|incastro|snodo/.test(q)) lines.push({ label: 'Gioco incastro', from: '0.30 mm', to: '0.15 mm' })
  if (lines.length === 0) lines.push({ label: 'Geometria', from: 'v corrente', to: 'rigenerata su richiesta' })
  lines.push({ label: 'Vertici mesh', from: '18.402', to: String(18402 + 180 * (lines.length + 1)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') })
  return lines
}

const MAX_AI_ATTEMPTS = 3

export default function CommunityDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)

  const model = communityModels.find(m => m.id === id)

  // Versioning stile GitHub: fork → carica o genera con AI → pubblica
  const [versions, setVersions] = useState(model?.versions ?? [])
  const [currentV, setCurrentV] = useState(model?.version ?? '')
  const [forkMode, setForkMode] = useState<null | 'choose' | 'upload' | 'ai'>(null)
  const [pending, setPending] = useState<PendingVersion | null>(null)
  const [aiRequest, setAiRequest] = useState('')
  const [aiThinking, setAiThinking] = useState(false)
  const [aiAttempts, setAiAttempts] = useState(0)

  useEffect(() => {
    setVersions(model?.versions ?? [])
    setCurrentV(model?.version ?? '')
  }, [model])

  if (!model) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 16 }}>
        <span style={{ fontSize: 16, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>Modello non trovato</span>
        <button
          onClick={() => navigate('/app/community')}
          style={{
            background: 'transparent', color: 'var(--cyan)', border: '1px solid var(--line-2)',
            fontFamily: 'inherit', fontWeight: 600, fontSize: 13.5, padding: '10px 22px',
            borderRadius: 100, cursor: 'pointer',
          }}
        >
          ← Torna all&apos;archivio
        </button>
      </div>
    )
  }

  const nextVersion = () => {
    const [maj, min] = currentV.split('.').map(Number)
    return `${maj}.${(min ?? 0) + 1}`
  }

  const runAi = () => {
    const q = aiRequest.trim()
    if (!q || aiThinking) return
    setPending(null)
    setAiThinking(true)
    setTimeout(() => {
      setPending({ note: q, diff: aiDiff(q), source: 'ai' })
      setAiAttempts(a => a + 1)
      setAiThinking(false)
    }, 1100 + Math.random() * 600)
  }

  const publish = () => {
    if (!pending) return
    const v = nextVersion()
    setVersions(vs => [{ v, date: 'oggi', note: pending.note }, ...vs])
    setCurrentV(v)
    setForkMode(null)
    setPending(null)
    setAiRequest('')
    setAiAttempts(0)
    toast(`v${v} pubblicata — in attesa di validazione della community`)
  }

  const resetFork = () => {
    setForkMode(null)
    setPending(null)
    setAiRequest('')
    setAiAttempts(0)
  }

  const ghostBtn: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    background: 'transparent', color: 'var(--cyan)', border: '1px solid var(--line-2)',
    fontFamily: 'inherit', fontWeight: 600, fontSize: 13, padding: '9px 16px',
    borderRadius: 100, cursor: 'pointer', transition: '0.2s',
  }

  /* Riga di diff stile git: - vecchio / + nuovo */
  const diffBlock = (diff: DiffLine[]) => (
    <div
      style={{
        border: '1px solid var(--line)',
        borderRadius: 10,
        overflow: 'hidden',
        ...mono,
        fontSize: 11.5,
      }}
    >
      <div style={{ padding: '7px 12px', background: 'var(--bg-2)', borderBottom: '1px solid var(--line)', color: 'var(--muted)', letterSpacing: '0.06em', fontSize: 10, textTransform: 'uppercase' }}>
        Cosa cambia rispetto a v{currentV}
      </div>
      {diff.map(d => (
        <div key={d.label} style={{ borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', gap: 8, padding: '5px 12px', background: 'rgba(228,0,20,.05)', color: '#a3000f' }}>
            <span>−</span>
            <span style={{ flex: 1 }}>{d.label}</span>
            <span style={{ textDecoration: 'line-through' }}>{d.from}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, padding: '5px 12px', background: 'rgba(63,115,8,.08)', color: 'var(--cyan)', fontWeight: 600 }}>
            <span>+</span>
            <span style={{ flex: 1 }}>{d.label}</span>
            <span>{d.to}</span>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <>
      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: '0 0 auto' }}>
        <button
          onClick={() => navigate('/app/community')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--glass)', border: '1px solid var(--line-2)', borderRadius: 10,
            color: 'var(--ink)', fontFamily: 'inherit', fontWeight: 600, fontSize: 13,
            padding: '9px 14px', cursor: 'pointer',
          }}
        >
          ← Archivio
        </button>
        <div>
          <h1 style={{ fontWeight: 600, fontSize: 22, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
            {model.name}
          </h1>
        </div>
        <div style={{ flex: 1 }} />
        <button style={ghostBtn} onClick={() => setForkMode('choose')}>
          <GitFork size={15} />
          Forka e proponi versione
        </button>
      </div>

      {/* 3-col layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.1fr', gap: 16, minHeight: 0 }}>

        {/* Left: model info */}
        <GlassCard style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14, overflow: 'auto' }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginBottom: 10 }}>
              {model.name}
            </h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
              <span
                style={{
                  fontSize: 11, ...mono, border: '1px solid var(--line)',
                  borderRadius: 5, padding: '3px 10px', color: 'var(--muted)',
                }}
              >
                {model.category}
              </span>
              <span
                style={{
                  fontSize: 10, ...mono, fontWeight: 700,
                  background: 'var(--glass-2)', border: '1px solid var(--line)',
                  color: 'var(--cyan)', padding: '3px 10px', borderRadius: 5,
                }}
              >
                v{currentV}
              </span>
            </div>
          </div>

          {/* Author */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'var(--glass-2)', border: '1px solid var(--line)',
                display: 'grid', placeItems: 'center',
                fontSize: 12, fontWeight: 700, ...mono, color: 'var(--cyan)', flex: '0 0 auto',
              }}
            >
              {model.authorInitials}
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{model.author}</div>
              <div style={{ fontSize: 11, ...mono, color: 'var(--muted)', marginTop: 1 }}>
                {model.versions[model.versions.length - 1].date}
              </div>
            </div>
          </div>

          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
            {model.description}
          </p>

          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Download size={14} style={{ color: 'var(--muted)' }} />
              <span style={{ ...mono, color: 'var(--muted)', fontSize: 12 }}>
                {model.downloads.toLocaleString('it-IT')}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Star size={14} fill="currentColor" style={{ color: 'var(--cyan)' }} />
              <span style={{ ...mono, color: 'var(--cyan)', fontSize: 12, fontWeight: 600 }}>
                {model.rating}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <GitFork size={14} style={{ color: 'var(--muted)' }} />
              <span style={{ ...mono, color: 'var(--muted)', fontSize: 12 }}>14 fork</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {model.tags.map(tag => (
              <span
                key={tag}
                style={{
                  fontSize: 10, ...mono, border: '1px solid var(--line)',
                  borderRadius: 5, padding: '2px 8px', color: 'var(--muted)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <PrimaryButton onClick={() => navigate('/app/new', { state: { modelName: model.name } })}>
              Stampa questo modello
            </PrimaryButton>
            <button
              onClick={() => {
                setSaved(s => !s)
                toast(saved ? 'Modello rimosso dai salvati' : 'Modello salvato — lo trovi in Salvati')
              }}
              style={ghostBtn}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--glass-2)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              {saved ? <Check size={15} /> : <Bookmark size={15} />}
              {saved ? 'Salvato' : 'Salva modello'}
            </button>
          </div>
        </GlassCard>

        {/* Center: 3D viewer */}
        <GlassCard hero style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="reg-marks">
            <div className="reg-tl" />
            <div className="reg-tr" />
            <div className="reg-bl" />
            <div className="reg-br" />
          </div>
          <div
            style={{
              position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
              fontSize: 10, ...mono, color: 'var(--muted)', letterSpacing: '0.1em',
              textTransform: 'uppercase', whiteSpace: 'nowrap', zIndex: 10,
            }}
          >
            {pending ? `FORK — ANTEPRIMA v${nextVersion()} (PROPOSTA)` : 'FIG. 01 — MODEL PREVIEW'}
          </div>
          <PrintViewer3D tone="light" />
        </GlassCard>

        {/* Right: versioning stile GitHub */}
        <GlassCard style={{ padding: 22, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <GitBranch size={14} style={{ color: 'var(--cyan)' }} />
              Versioni
            </h3>
            <span style={{ ...mono, fontSize: 10.5, color: 'var(--muted)' }}>{versions.length} release</span>
          </div>

          {/* ── Flusso fork ── */}
          {forkMode === 'choose' && (
            <div style={{ border: '1px solid var(--line-2)', borderRadius: 12, padding: 14, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 9 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ ...mono, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--cyan)' }}>
                  Fork di {model.name} · v{currentV}
                </span>
                <button onClick={resetFork} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 2 }}>
                  <X size={14} />
                </button>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5 }}>
                Proponi una versione migliorata: caricala tu, oppure chiedi all&apos;AI di modificare il modello.
              </p>
              <button style={ghostBtn} onClick={() => { setForkMode('upload'); setPending({ note: 'Pareti rinforzate e tolleranza snodo ridotta', diff: UPLOAD_DIFF, source: 'upload' }) }}>
                <Upload size={14} />
                Carica la tua versione
              </button>
              <button style={ghostBtn} onClick={() => setForkMode('ai')}>
                <Sparkles size={14} />
                Modifica con AI
              </button>
            </div>
          )}

          {forkMode === 'upload' && pending && (
            <div style={{ border: '1px solid var(--line-2)', borderRadius: 12, padding: 14, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ ...mono, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--cyan)' }}>
                  Upload · gancio-modulare_v{nextVersion()}.stl
                </span>
                <button onClick={resetFork} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 2 }}>
                  <X size={14} />
                </button>
              </div>
              {/* Evidenza di cosa è cambiato */}
              {diffBlock(pending.diff)}
              <input
                value={pending.note}
                onChange={e => setPending(p => p && { ...p, note: e.target.value })}
                placeholder="Note di versione…"
                style={{
                  height: 36, padding: '0 12px', fontSize: 12.5,
                  background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 9,
                  color: 'var(--ink)', fontFamily: 'inherit', outline: 'none',
                }}
              />
              <PrimaryButton onClick={publish} style={{ height: 40, fontSize: 13 }}>
                <GitFork size={14} />
                Pubblica v{nextVersion()}
              </PrimaryButton>
            </div>
          )}

          {forkMode === 'ai' && (
            <div style={{ border: '1px solid var(--line-2)', borderRadius: 12, padding: 14, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ ...mono, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--cyan)' }}>
                  Modifica con AI · v{currentV} → v{nextVersion()}
                </span>
                <button onClick={resetFork} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 2 }}>
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={e => { e.preventDefault(); runAi() }} style={{ display: 'flex', gap: 7 }}>
                <input
                  value={aiRequest}
                  onChange={e => setAiRequest(e.target.value)}
                  placeholder='«allarga il foro di 0.2 mm», «rinforza le pareti»…'
                  disabled={aiAttempts >= MAX_AI_ATTEMPTS}
                  style={{
                    flex: 1, minWidth: 0, height: 36, padding: '0 12px', fontSize: 12.5,
                    background: 'var(--bg-2)', border: '1px solid var(--line)', borderRadius: 9,
                    color: 'var(--ink)', fontFamily: 'inherit', outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  className="btn-spade"
                  disabled={!aiRequest.trim() || aiThinking || aiAttempts >= MAX_AI_ATTEMPTS}
                  style={{ height: 36, padding: '0 13px', fontSize: 12 }}
                >
                  <Sparkles size={13} />
                </button>
              </form>

              <span style={{ ...mono, fontSize: 10, color: aiAttempts >= MAX_AI_ATTEMPTS ? '#e40014' : 'var(--muted-2)', letterSpacing: '0.06em' }}>
                {aiAttempts >= MAX_AI_ATTEMPTS
                  ? 'TENTATIVI ESAURITI — CARICA LA TUA VERSIONE O RIPARTI DAL FORK'
                  : `TENTATIVI: ${aiAttempts}/${MAX_AI_ATTEMPTS}`}
              </span>

              {aiThinking && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={13} color="var(--cyan)" style={{ animation: 'blink 1.5s infinite' }} />
                  <span className="ai-shimmer" style={{ fontSize: 12, fontWeight: 500 }}>
                    L&apos;AI sta rigenerando la geometria…
                  </span>
                </div>
              )}

              {pending && pending.source === 'ai' && !aiThinking && (
                <>
                  {diffBlock(pending.diff)}
                  <div style={{ display: 'flex', gap: 7 }}>
                    <PrimaryButton onClick={publish} style={{ flex: 1, height: 38, fontSize: 12.5 }}>
                      <Check size={14} />
                      Accetta e pubblica
                    </PrimaryButton>
                    <button
                      style={{ ...ghostBtn, padding: '0 13px' }}
                      disabled={aiAttempts >= MAX_AI_ATTEMPTS}
                      onClick={() => { setPending(null) }}
                      title="Riformula la richiesta e riprova"
                    >
                      <RotateCcw size={13} />
                      Riprova
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Storico versioni (stile commit log) ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {versions.map((ver, i) => {
              const isCurrent = ver.v === currentV
              const isProposal = ver.date === 'oggi'
              return (
                <div key={ver.v} style={{ display: 'flex', gap: 12 }}>
                  {/* Linea commit */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto' }}>
                    <div
                      style={{
                        width: 11, height: 11, borderRadius: '50%', marginTop: 4,
                        background: isCurrent ? 'var(--cyan)' : 'transparent',
                        border: isCurrent ? 'none' : '1.5px solid var(--line-2)',
                      }}
                    />
                    {i < versions.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 26, background: 'var(--line)' }} />}
                  </div>
                  <div style={{ paddingBottom: i < versions.length - 1 ? 16 : 0, flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 13, ...mono, color: 'var(--cyan)', fontWeight: 700 }}>v{ver.v}</span>
                      {isCurrent && <span className="status-pill sp-ready">CORRENTE</span>}
                      {isProposal && <span className="status-pill sp-print">IN VALIDAZIONE</span>}
                      <span style={{ flex: 1 }} />
                      <span style={{ fontSize: 10.5, ...mono, color: 'var(--muted)' }}>{ver.date}</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--ink)', lineHeight: 1.4 }}>{ver.note}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>
      </div>
    </>
  )
}
