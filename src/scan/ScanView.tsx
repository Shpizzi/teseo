import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Upload, Check, Sparkles, Radar, RotateCcw, X, Users, MessageSquare } from 'lucide-react'
import { openSupportChat, SUPPORT_ID } from '../mock/messagesStore'
import GlassCard from '../components/GlassCard'
import PrimaryButton from '../components/PrimaryButton'
import PrintViewer3D from '../components/PrintViewer3D'
import ScanOverlay from './ScanOverlay'
import { recognize, getRecognizer } from './useRecognizer'
import { LIBRARY, ALL_LABELS, type LibraryEntry } from './library'
import { producers } from '../mock/user-pages'

// ponytail: score threshold is a calibration knob, softmax over a tiny label
// set is noisy, so tune against real objects. Distractor labels in the library
// keep out-of-set objects below this.
const THRESHOLD = 0.2
const DEMO_LABEL = 'remote control'

type Phase = 'capture' | 'scanning' | 'confirm-object' | 'confirm-part' | 'result' | 'ai-generate' | 'ai-review' | 'match'

// Synthetic entry for the AI-generated path: no pre-scanned glb → the viewer
// falls back to the procedural mesh, which reads as "raw AI reconstruction".
const AI_ENTRY: LibraryEntry = {
  name: 'Oggetto scansionato',
  glb: '',
  part: 'Pezzo ricostruito con AI',
  material: 'PLA (suggerito)',
  note: 'Mesh generata dall\'AI da 3 scansioni: geometria approssimata, da verificare prima della stampa.',
}

// Soglia dura: sopra si può inviare al FabLab, sotto l'unica opzione è chiedere aiuto.
const CONF_THRESHOLD = 0.7
// "Come la stimiamo": confronto mesh↔originale su incastri/tenuta (Wizard of Oz,
// coerente col resto della demo, spiegazione funzionale, non un numero magico).
const CONF_WHY_HIGH = 'Confrontiamo la mesh con l\'originale sui punti di incastro: la parte combacia e si chiude. Il piccolo difetto residuo sul bordo non compromette la funzione, l\'operatore lo rifinisce prima di stampare.'
const CONF_WHY_LOW = 'Su alcuni incastri la ricostruzione è incerta e la parte potrebbe non chiudersi bene. Meglio farla correggere da una persona prima di stampare.'

// Evidenzia l'azione consigliata tra le due card della review AI.
const recCard: React.CSSProperties = { position: 'relative', border: '1.5px solid var(--cyan)', background: 'var(--glass-2)', boxShadow: '0 0 0 3px rgba(63,115,8,.10)' }
const recTag: React.CSSProperties = { position: 'absolute', top: 10, right: 10, fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.08em', color: 'var(--cyan)', border: '1px solid var(--cyan)', borderRadius: 5, padding: '2px 6px', background: 'var(--glass)' }

type ScanRequest = { fileName: string; producerId: string; material: string }

export default function ScanView({ onClose, onRequest }: { onClose?: () => void; onRequest?: (req: ScanRequest) => void }) {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>('capture')
  const [progress, setProgress] = useState(0)
  const [cameraOn, setCameraOn] = useState(false)
  const [demo, setDemo] = useState(true) // Wizard-of-Oz: riconoscimento sempre forzato su DEMO_LABEL (uso in aula)
  const [modelReady, setModelReady] = useState(false)
  const [clipError, setClipError] = useState(false)
  const [uploadUrl, setUploadUrl] = useState<string>() // captured / uploaded frame
  const [match, setMatch] = useState<{ label: string; score: number; entry: LibraryEntry }>()
  const [aiScans, setAiScans] = useState(0) // 0–3 scansioni extra della generazione AI
  const [aiRunning, setAiRunning] = useState(false)
  const [expertRequested, setExpertRequested] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream>()
  const fileRef = useRef<HTMLInputElement>(null)
  const aiRunRef = useRef(0) // alterna la confidenza a ogni generazione (vedi runAiGeneration)

  // Preload CLIP on mount; if it can't load, fall back to demo mode silently.
  useEffect(() => {
    getRecognizer().then(() => setModelReady(true)).catch(() => { setClipError(true); setDemo(true) })
  }, [])

  // Request the back camera; on denial we stay on the upload dropzone.
  useEffect(() => {
    let cancelled = false
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return }
        streamRef.current = stream
        setCameraOn(true) // mounts <video>; the stream is attached by the effect below
      })
      .catch(() => setCameraOn(false))
    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  // Attach the stream only once the <video> element actually exists in the DOM.
  // (videoRef is null inside the getUserMedia callback, the video mounts later.)
  useEffect(() => {
    const v = videoRef.current
    if (cameraOn && v && streamRef.current) {
      v.srcObject = streamRef.current
      v.play().catch(() => {}) // iOS needs an explicit play(); muted+playsInline are set
    }
  }, [cameraOn, phase])

  function grabFrame(): string | undefined {
    const v = videoRef.current
    if (!cameraOn || !v || !v.videoWidth) return uploadUrl
    const c = document.createElement('canvas')
    c.width = v.videoWidth; c.height = v.videoHeight
    c.getContext('2d')?.drawImage(v, 0, 0)
    return c.toDataURL('image/jpeg', 0.85)
  }

  async function runScan() {
    const frame = grabFrame()
    if (!frame && !demo) { return } // nothing to scan and not forcing demo
    setPhase('scanning'); setProgress(0)

    // animate the readout 0→100 over ~2.4s (pure UX; CLIP runs concurrently)
    const start = performance.now()
    const tick = () => {
      const p = Math.min(100, ((performance.now() - start) / 2400) * 100)
      setProgress(p)
      if (p < 100 && phaseRef.current === 'scanning') requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)

    let top: { label: string; score: number }
    try {
      const [r] = await Promise.all([
        demo ? Promise.resolve({ label: DEMO_LABEL, score: 1 }) : recognize(frame!, ALL_LABELS),
        new Promise(res => setTimeout(res, 2400)),
      ])
      top = r as { label: string; score: number }
    } catch {
      setClipError(true)
      top = { label: DEMO_LABEL, score: 1 } // never a dead end (demo fallback)
    }

    const entry = LIBRARY[top.label]
    if (entry && top.score >= THRESHOLD) {
      setMatch({ ...top, entry })
      setPhase('confirm-object') // → confirm-part → result
    } else {
      setPhase('ai-generate')
    }
  }

  // keep a ref so the rAF loop sees the latest phase
  const phaseRef = useRef(phase)
  phaseRef.current = phase

  function reset() {
    setMatch(undefined); setUploadUrl(undefined); setProgress(0); setPhase('capture')
    setAiScans(0); setAiRunning(false); setExpertRequested(false)
  }

  // ponytail: mock timed sequence, 3 "scansioni" poi ricostruzione mesh.
  // La generazione vera (image-to-3D) è server-side e fuori scope demo.
  function runAiGeneration() {
    setAiRunning(true); setAiScans(0)
    let n = 0
    const step = () => {
      if (phaseRef.current !== 'ai-generate') return // reset/uscita durante i timer
      n += 1
      setAiScans(n)
      if (n < 3) setTimeout(step, 1100)
      else setTimeout(() => {
        if (phaseRef.current !== 'ai-generate') return
        // ponytail: la confidenza AI alterna alta/bassa a ogni generazione così in aula
        // si mostrano entrambi i rami (≥70% → FabLab, <70% → solo aiuto). Rigenera per invertire.
        aiRunRef.current += 1
        const score = aiRunRef.current % 2 === 1 ? 0.82 : 0.55
        setMatch({ label: 'ai-mesh', score, entry: AI_ENTRY })
        setPhase('ai-review')
      }, 1500)
    }
    setTimeout(step, 900)
  }

  function onFile(f?: File) {
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => { setUploadUrl(reader.result as string); setCameraOn(false) }
    reader.readAsDataURL(f)
  }

  const framePanel: React.CSSProperties = {
    position: 'relative', width: '100%', maxWidth: 640, aspectRatio: '4 / 3',
    borderRadius: 18, overflow: 'hidden', border: '1px solid var(--line-2)',
    background: 'var(--bg-2)',
  }

  const conf = match ? Math.round(match.score * 100) : 0
  const lowConf = !!match && match.score < CONF_THRESHOLD

  return (
    <div
      style={{
        // full-screen overlay, lifts the scan out of the 212px sidebar layout so
        // it fills the whole viewport (essential on mobile), above the sidebar (z:2).
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'linear-gradient(160deg, #122006, #0d1804 60%, #132408)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        padding:
          'max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left))',
        overflow: 'auto',
      }}
    >
      {/* container centrato: su desktop il contenuto non si spalma a tutta larghezza */}
      <div style={{ width: '100%', maxWidth: 1140, margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>

      {/* header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, rowGap: 8, flexWrap: 'wrap', flex: '0 0 auto' }}>
        <Radar size={18} style={{ color: 'var(--lemongrass)' }} />
        <span style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.06em', color: '#fff' }}>
          SCAN & RICONOSCIMENTO CV
        </span>
        {!modelReady && !clipError && (
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'rgba(255,255,255,.55)' }}>· inizializzazione CV…</span>
        )}
        {clipError && (
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'rgba(255,255,255,.55)' }}>· CV offline · modalità demo</span>
        )}
        <div style={{ flex: 1 }} />
        {onClose && (
          <button onClick={onClose} className="btn-outline-dark" style={{ height: 34, width: 34, padding: 0, justifyContent: 'center' }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* CAPTURE / SCANNING, camera or upload frame */}
      {(phase === 'capture' || phase === 'scanning') && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, minHeight: 0 }}>
          <div style={framePanel}>
            {cameraOn ? (
              <video ref={videoRef} autoPlay muted playsInline
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : uploadUrl ? (
              <img src={uploadUrl} alt="frame" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              // upload dropzone (camera denied / not available)
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); onFile(e.dataTransfer.files?.[0]) }}
                style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: 'pointer' }}
              >
                <div className="blueprint-grid" />
                <Upload size={40} style={{ color: 'var(--cyan)', position: 'relative', zIndex: 1 }} />
                <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', position: 'relative', zIndex: 1, textAlign: 'center' }}>
                  Fotocamera non disponibile.<br />Trascina o carica una foto dell'oggetto.
                </p>
              </div>
            )}
            {phase === 'scanning' && <ScanOverlay progress={progress} />}
          </div>

          <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }}
            onChange={e => onFile(e.target.files?.[0] ?? undefined)} />

          {phase === 'capture' && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button className="btn-outline-dark" onClick={() => fileRef.current?.click()}>
                <Camera size={16} /> Carica foto
              </button>
              <PrimaryButton onClick={runScan}>
                <Radar size={16} /> Avvia scansione
              </PrimaryButton>
            </div>
          )}
        </div>
      )}

      {/* CONFIRM (obj → part) → RESULT, shared viewer, phase-specific right panel */}
      {(phase === 'confirm-object' || phase === 'confirm-part' || phase === 'result' || phase === 'ai-review') && match && (
        <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, minHeight: 0 }}>
          {/* viewer, stays mounted across the confirmation steps.
              Superficie scura: le wireframe lemongrass/white del viewer sono pensate per fondo forest. */}
          <div style={{ flex: '1 1 340px', position: 'relative', borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(255,255,255,.14)', background: 'linear-gradient(160deg, #18280e, #122006)', height: 'min(68vh, 600px)', minHeight: 300 }}>
            <PrintViewer3D modelUrl={match.entry.glb} />
          </div>

          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
            {/* STEP 1, confirm the recognized object */}
            {phase === 'confirm-object' && (
              <>
                <GlassCard hero style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.06em', color: 'var(--muted)' }}>
                    OGGETTO RILEVATO · <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>{Math.round(match.score * 100)}% match</span>
                  </span>
                  <h2 style={{ fontSize: 21, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2 }}>{match.entry.name}</h2>
                  <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.55 }}>
                    Riconosciuto come <span style={{ color: 'var(--cyan)', textTransform: 'capitalize' }}>{match.label}</span>. Con questa forma corrisponde a un prodotto presente in archivio.
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginTop: 2 }}>È corretto?</p>
                </GlassCard>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <PrimaryButton onClick={() => setPhase('confirm-part')}><Check size={16} /> Sì, è questo</PrimaryButton>
                  <button className="btn-outline-dark" onClick={() => setPhase('ai-generate')}>No, è un altro</button>
                </div>
                <button className="btn-outline-dark btn-outline-dark--muted" onClick={reset}>
                  <RotateCcw size={15} /> Nuova scansione
                </button>
              </>
            )}

            {/* STEP 2, confirm the available part */}
            {phase === 'confirm-part' && (
              <>
                <GlassCard hero style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.06em', color: 'var(--muted)' }}>
                    RICAMBI IN ARCHIVIO · 1
                  </span>
                  <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.55 }}>
                    Per <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{match.entry.name}</span> a database abbiamo un solo ricambio:
                  </p>
                  <div style={{ padding: 14, borderRadius: 'var(--radius-sm)', border: '1px solid var(--line)', background: 'var(--glass)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--cyan)' }}>{match.entry.part}</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>MATERIALE · {match.entry.material}</span>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginTop: 2 }}>È il pezzo che ti serve?</p>
                </GlassCard>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <PrimaryButton onClick={() => setPhase('result')}><Check size={16} /> Sì, è questo</PrimaryButton>
                  <button className="btn-outline-dark" onClick={() => setPhase('ai-generate')}><Sparkles size={16} /> No, altro pezzo</button>
                </div>
                <button className="btn-outline-dark btn-outline-dark--muted" onClick={() => setPhase('confirm-object')}>
                  ← Indietro
                </button>
              </>
            )}

            {/* STEP 3, result */}
            {phase === 'result' && (
              <>
                <GlassCard hero style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Check size={16} style={{ color: 'var(--cyan)' }} />
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.06em', color: 'var(--muted)' }}>
                      RICAMBIO PRONTO
                    </span>
                  </div>
                  <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)' }}>{match.entry.part}</h2>
                  {[
                    { k: 'OGGETTO', v: match.entry.name },
                    { k: 'MATERIALE', v: match.entry.material },
                  ].map(r => (
                    <div key={r.k} style={{ display: 'flex', gap: 14 }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.06em', width: 84, flex: '0 0 auto', paddingTop: 2 }}>{r.k}</span>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{r.v}</span>
                    </div>
                  ))}
                  <p style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.55, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
                    {match.entry.note}
                  </p>
                </GlassCard>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <PrimaryButton onClick={() => setPhase('match')}><Radar size={16} /> Cerca nella rete</PrimaryButton>
                </div>
                <button className="btn-outline-dark btn-outline-dark--muted" onClick={reset}>
                  <RotateCcw size={15} /> Nuova scansione
                </button>
              </>
            )}

            {/* AI-REVIEW, mesh generata: confidenza in evidenza + azione consigliata in base alla soglia */}
            {phase === 'ai-review' && (
              <>
                {/* banner: numero di confidenza grande + spiegazione di come la stimiamo */}
                <div style={{ padding: 20, borderRadius: 'var(--radius)', border: `1.5px dashed ${lowConf ? 'rgba(228,0,20,.5)' : 'rgba(178,235,118,.5)'}`, background: lowConf ? 'rgba(228,0,20,.06)' : 'rgba(178,235,118,.07)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 46, fontWeight: 700, lineHeight: 0.9, color: lowConf ? '#ff6b74' : 'var(--lemongrass)' }}>{conf}%</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.08em', color: 'rgba(255,255,255,.55)' }}>CONFIDENZA AI</span>
                      <span style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{lowConf ? 'Bassa, meglio una persona' : 'Buona, con verifica finale'}</span>
                    </div>
                  </div>
                  <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{match.entry.part}</h2>
                  <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,.72)', lineHeight: 1.55, borderTop: '1px solid rgba(255,255,255,.12)', paddingTop: 12 }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.06em', color: 'var(--lemongrass)' }}>COME LA STIMIAMO · </span>
                    {lowConf ? CONF_WHY_LOW : CONF_WHY_HIGH}
                  </p>
                  {lowConf && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Users size={15} style={{ color: '#ff6b74', flex: '0 0 auto' }} />
                      <span style={{ fontSize: 12.5, color: '#fff', fontWeight: 600 }}>Sotto il 70% l'invio al FabLab è bloccato: l'unica opzione è chiedere aiuto a una persona.</span>
                    </div>
                  )}
                  {expertRequested && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 10, borderTop: '1px dashed rgba(178,235,118,.35)' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <Check size={15} style={{ color: 'var(--lemongrass)', flex: '0 0 auto', marginTop: 2 }} />
                        <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,.85)', lineHeight: 1.45 }}>
                          Richiesta inviata. Un esperto del supporto controllerà e sistemerà il tuo pezzo, poi ti scrive in chat. Puoi comunque inviarlo già al FabLab.
                        </span>
                      </div>
                      <button className="btn-outline-dark" style={{ alignSelf: 'flex-start', color: 'var(--lemongrass)' }}
                        onClick={() => navigate('/app/messages', { state: { conversationId: SUPPORT_ID } })}>
                        <MessageSquare size={15} /> Apri la chat di supporto
                      </button>
                    </div>
                  )}
                </div>
                {/* due azioni differenziate: la consigliata (in base alla confidenza) è primaria e marcata */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button className="opt-card" onClick={() => { openSupportChat(match.entry.part); setExpertRequested(true) }} disabled={expertRequested}
                    style={{ order: lowConf ? 0 : 1, ...(lowConf ? recCard : {}) }}>
                    {lowConf && <span style={recTag}>CONSIGLIATO</span>}
                    <Users size={18} style={{ color: 'var(--cyan)' }} />
                    <span style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink)' }}>Chiedi aiuto a una persona</span>
                    <span style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5 }}>
                      Un esperto della community, anche di persona, corregge la mesh insieme a te prima dell'invio.
                    </span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.08em', color: 'var(--cyan)', marginTop: 4 }}>
                      {expertRequested ? 'RICHIESTA INVIATA ✓' : 'RICHIEDI →'}
                    </span>
                  </button>
                  {/* Sopra soglia: si può inviare al FabLab. Sotto: la card non compare, resta solo l'aiuto. */}
                  {!lowConf && (
                    <button className="opt-card" onClick={() => setPhase('match')}
                      style={{ order: 0, ...recCard }}>
                      <span style={recTag}>CONSIGLIATO</span>
                      <Radar size={18} style={{ color: 'var(--cyan)' }} />
                      <span style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink)' }}>Invia subito al FabLab</span>
                      <span style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5 }}>
                        Procedi ora: sarà l'operatore del FabLab a verificare e sistemare la mesh prima della stampa.
                      </span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.08em', color: 'var(--cyan)', marginTop: 4 }}>
                        PROCEDI →
                      </span>
                    </button>
                  )}
                </div>
                <button className="btn-outline-dark btn-outline-dark--muted" onClick={reset}>
                  <RotateCcw size={15} /> Nuova scansione
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* AI-GENERATE, part not in archive → AI reconstruction + extra scans (mock) */}
      {phase === 'ai-generate' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
          <div style={{ maxWidth: 520, textAlign: 'center', padding: 28, borderRadius: 18, border: '1.5px dashed var(--line-2)', background: 'var(--glass)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <Sparkles size={34} style={{ color: 'var(--cyan)' }} />
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}>Generazione AI del pezzo</h3>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.55 }}>
              Il pezzo che ti serve non è ancora in archivio. TESEO può ricostruirlo con AI: servono alcune
              <span style={{ color: 'var(--cyan)' }}> scansioni aggiuntive del componente</span> da più angolazioni.
            </p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>
              {[1, 2, 3].map(n => (
                <span key={n} style={{ width: 30, height: 30, borderRadius: 8, display: 'grid', placeItems: 'center', transition: '0.3s',
                  border: n <= aiScans ? '1px solid var(--cyan)' : '1px dashed var(--line-2)',
                  color: n <= aiScans ? 'var(--cyan)' : 'inherit' }}>
                  {n <= aiScans ? <Check size={14} /> : n}
                </span>
              ))}
              <span>{aiScans === 3 ? 'ricostruzione mesh…' : `scansione ${aiScans} / 3`}</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.5 }}>
              La mesh generata è una prima ricostruzione: prima della stampa viene sempre <span style={{ color: 'var(--cyan)' }}>verificata da una persona</span>, un esperto della community o l'operatore del FabLab.
            </p>
            {!aiRunning && (
              // dentro la card bianca: torna ai token da fondo chiaro
              <button className="btn-outline-dark" style={{ color: 'var(--cyan)', borderColor: 'var(--line-2)' }} onClick={runAiGeneration}>
                <Camera size={16} /> Avvia scansione componente
              </button>
            )}
          </div>
          <button className="btn-outline-dark btn-outline-dark--muted" onClick={reset}>
            <RotateCcw size={15} /> Nuova scansione
          </button>
        </div>
      )}

      {/* MATCH, compatible nodes / FabLabs */}
      {phase === 'match' && match && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.06em', color: 'rgba(255,255,255,.6)' }}>
            FABLAB COMPATIBILI · {match.entry.part} · {match.entry.material}
          </span>
          {match.label === 'ai-mesh' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--line-2)', background: 'var(--glass)', flex: '0 0 auto' }}>
              <Sparkles size={14} style={{ color: 'var(--cyan)', flex: '0 0 auto' }} />
              <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>
                Mesh generata con AI: l'operatore del FabLab la verificherà e correggerà prima della stampa.
              </span>
            </div>
          )}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 11, overflow: 'auto' }}>
            {producers.map((p, i) => {
              const certified = i < 2
              return (
                <div key={p.id} style={{ padding: 16, borderRadius: 'var(--radius-sm)', background: 'var(--glass)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', flex: '0 0 auto', background: p.available ? 'var(--cyan)' : 'transparent', boxShadow: p.available ? 'none' : 'inset 0 0 0 1.5px var(--cyan)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{p.name}</span>
                      <span style={{ fontFamily: 'var(--mono)', color: 'var(--cyan)', fontSize: 12 }}>{p.distance}</span>
                      {certified && (
                        <span className="status-pill sp-ready" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Check size={11} /> Certificato
                        </span>
                      )}
                    </div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>
                      {p.technologies.join(' · ')} · ★ {p.rating}
                    </div>
                  </div>
                  <PrimaryButton
                    style={{ height: 38 }}
                    onClick={() => onRequest?.({ fileName: match.entry.part, producerId: p.id, material: match.entry.material })}
                  >
                    Richiedi preventivo
                  </PrimaryButton>
                </div>
              )
            })}
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', fontStyle: 'italic', flex: '0 0 auto' }}>
            Nessun FabLab copre il pezzo? Prova la <span style={{ color: 'var(--lemongrass)' }}>generazione AI</span> o chiedi a un esperto della community.
          </p>
          <button className="btn-outline-dark btn-outline-dark--muted" style={{ alignSelf: 'flex-start' }} onClick={reset}>
            <RotateCcw size={15} /> Nuova scansione
          </button>
        </div>
      )}

      </div>
    </div>
  )
}
