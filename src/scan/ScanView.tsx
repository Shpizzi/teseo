import { useEffect, useRef, useState } from 'react'
import { Camera, Upload, Check, Sparkles, Radar, RotateCcw, X } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import PrimaryButton from '../components/PrimaryButton'
import PrintViewer3D from '../components/PrintViewer3D'
import ScanOverlay from './ScanOverlay'
import { recognize, getRecognizer } from './useRecognizer'
import { LIBRARY, ALL_LABELS, type LibraryEntry } from './library'
import { producers } from '../mock/user-pages'

// ponytail: score threshold is a calibration knob — softmax over a tiny label
// set is noisy, so tune against real objects. Distractor labels in the library
// keep out-of-set objects below this.
const THRESHOLD = 0.2
const DEMO_LABEL = 'remote control'

type Phase = 'capture' | 'scanning' | 'result' | 'nomatch' | 'match'

const outlineBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8, background: 'transparent',
  color: 'var(--cyan)', border: '1px solid var(--line-2)', fontFamily: 'inherit',
  fontWeight: 600, fontSize: 13.5, padding: '0 20px', height: 44,
  borderRadius: 100, cursor: 'pointer', transition: '0.2s', flex: '0 0 auto',
}

export default function ScanView({ onClose }: { onClose?: () => void }) {
  const [phase, setPhase] = useState<Phase>('capture')
  const [progress, setProgress] = useState(0)
  const [cameraOn, setCameraOn] = useState(false)
  const [demo, setDemo] = useState(false)
  const [modelReady, setModelReady] = useState(false)
  const [clipError, setClipError] = useState(false)
  const [uploadUrl, setUploadUrl] = useState<string>() // captured / uploaded frame
  const [match, setMatch] = useState<{ label: string; score: number; entry: LibraryEntry }>()

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream>()
  const fileRef = useRef<HTMLInputElement>(null)

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
  // (videoRef is null inside the getUserMedia callback — the video mounts later.)
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
      setPhase('result')
    } else {
      setPhase('nomatch')
    }
  }

  // keep a ref so the rAF loop sees the latest phase
  const phaseRef = useRef(phase)
  phaseRef.current = phase

  function reset() {
    setMatch(undefined); setUploadUrl(undefined); setProgress(0); setPhase('capture')
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

  return (
    <div
      style={{
        // full-screen overlay — lifts the scan out of the 212px sidebar layout so
        // it fills the whole viewport (essential on mobile), above the sidebar (z:2).
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'linear-gradient(160deg, #0a2342, #081d3a 60%, #0a2645)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        padding:
          'max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left))',
        overflow: 'auto',
      }}
    >
      {/* header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, rowGap: 8, flexWrap: 'wrap', flex: '0 0 auto' }}>
        <Radar size={18} style={{ color: 'var(--cyan)' }} />
        <span style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.06em', color: 'var(--ink)' }}>
          SCAN & RICONOSCIMENTO CV
        </span>
        {!modelReady && !clipError && (
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>· inizializzazione CV…</span>
        )}
        {clipError && (
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>· CV offline · modalità demo</span>
        )}
        <div style={{ flex: 1 }} />
        {/* demo toggle */}
        <button
          onClick={() => setDemo(d => !d)}
          style={{ ...outlineBtn, height: 34, fontSize: 12,
            borderColor: demo ? 'var(--cyan)' : 'var(--line)', color: demo ? 'var(--cyan)' : 'var(--muted)' }}
        >
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: demo ? 'var(--cyan)' : 'transparent', boxShadow: demo ? 'none' : 'inset 0 0 0 1.5px var(--line-2)' }} />
          Demo
        </button>
        {onClose && (
          <button onClick={onClose} style={{ ...outlineBtn, height: 34, width: 34, padding: 0, justifyContent: 'center' }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* CAPTURE / SCANNING — camera or upload frame */}
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
              <button style={outlineBtn} onClick={() => fileRef.current?.click()}>
                <Camera size={16} /> Carica foto
              </button>
              <PrimaryButton onClick={runScan}>
                <Radar size={16} /> Avvia scansione
              </PrimaryButton>
            </div>
          )}
        </div>
      )}

      {/* RESULT — recognized object + 3D viewer */}
      {phase === 'result' && match && (
        <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 16, minHeight: 0 }}>
          {/* viewer — loads the recognized object's scanned .glb */}
          <div style={{ flex: '1 1 340px', position: 'relative', borderRadius: 18, overflow: 'hidden', border: '1px solid var(--line-2)', background: 'var(--bg-2)', minHeight: 300 }}>
            <PrintViewer3D modelUrl={match.entry.glb} />
          </div>

          {/* metadata */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
            <GlassCard hero style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Check size={16} style={{ color: 'var(--cyan)' }} />
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.06em', color: 'var(--muted)' }}>
                  OGGETTO RICONOSCIUTO · {Math.round(match.score * 100)}%
                </span>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', textTransform: 'capitalize' }}>{match.label}</h2>
              {[
                { k: 'PEZZO', v: match.entry.part },
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

            <div style={{ display: 'flex', gap: 10 }}>
              <PrimaryButton onClick={() => setPhase('match')}>
                <Radar size={16} /> Cerca nella rete
              </PrimaryButton>
              <button style={outlineBtn}><Sparkles size={16} /> Genera con AI</button>
            </div>
            <button style={{ ...outlineBtn, color: 'var(--muted)', borderColor: 'var(--line)' }} onClick={reset}>
              <RotateCcw size={15} /> Nuova scansione
            </button>
          </div>
        </div>
      )}

      {/* NOMATCH — in-palette dashed-cyan alert */}
      {phase === 'nomatch' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
          <div style={{ maxWidth: 460, textAlign: 'center', padding: 28, borderRadius: 18, border: '1.5px dashed var(--line-2)', background: 'var(--glass)' }}>
            <Sparkles size={34} style={{ color: 'var(--cyan)', marginBottom: 12 }} />
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>Nessun ricambio in libreria</h3>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.55 }}>
              L'oggetto non corrisponde a un modello certificato. Possiamo generarlo con AI e attivare una
              <span style={{ color: 'var(--cyan)' }}> bounty all'esperto</span> della rete per ricostruirlo.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <PrimaryButton onClick={reset}><RotateCcw size={16} /> Riprova</PrimaryButton>
            <button style={outlineBtn}><Sparkles size={16} /> Genera + bounty</button>
          </div>
        </div>
      )}

      {/* MATCH — compatible nodes / FabLabs */}
      {phase === 'match' && match && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.06em', color: 'var(--muted)' }}>
            NODI COMPATIBILI · {match.entry.material} · {match.label}
          </span>
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
                  <PrimaryButton style={{ height: 38 }}>Richiedi</PrimaryButton>
                </div>
              )
            })}
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', flex: '0 0 auto' }}>
            Nessun nodo copre il pezzo? Attiva <span style={{ color: 'var(--cyan)' }}>generazione AI + bounty all'esperto</span>.
          </p>
          <button style={{ ...outlineBtn, alignSelf: 'flex-start', color: 'var(--muted)', borderColor: 'var(--line)' }} onClick={reset}>
            <RotateCcw size={15} /> Nuova scansione
          </button>
        </div>
      )}
    </div>
  )
}
