import { useState, useRef } from 'react'
import { Upload, Camera, Check, Star, Sparkles, X, ChevronDown } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import GlassCard from '../../components/GlassCard'
import PrimaryButton from '../../components/PrimaryButton'
import SearchBar from '../../components/SearchBar'
import PrintViewer3D from '../../components/PrintViewer3D'
import ScanView from '../../scan/ScanView'
import { producers } from '../../mock/user-pages'
import { toast } from '../../components/Toast'
import { searchModels } from '../../components/TeseoAssistant'
import type { ModelHit } from '../../components/TeseoAssistant'
import { useIsMobile } from '../../hooks/useIsMobile'

type Step = 1 | 2 | 3

// Materiale/colore/qualità: la stima di prezzo reagisce alle scelte dello step 3.
const COLORS = [
  { name: 'Bianco', hex: '#f4faed' },
  { name: 'Nero', hex: '#18280e' },
  { name: 'Grigio', hex: '#9aa38f' },
  { name: 'Rosso', hex: '#b23b2e' },
]

// Contesto in ingresso (da Community, Salvati, Produttori, Scan): il wizard
// non deve far ripartire l'utente da zero se modello/produttore sono già noti.
type IncomingState = { modelName?: string; producerId?: string } | null

export default function NuovaStampa() {
  const navigate = useNavigate()
  const incoming = (useLocation().state as IncomingState) ?? {}
  const [step, setStep] = useState<Step>(1)
  // Anteprima del componente scelto: prima del fablab devi VEDERE il pezzo
  // e confermare che è quello giusto (annulla/conferma).
  const [previewing, setPreviewing] = useState(Boolean(incoming.modelName))
  const [selectedProducer, setSelectedProducer] = useState(incoming.producerId ?? '')
  const [notes, setNotes] = useState('')
  const [fileName, setFileName] = useState(incoming.modelName ?? '')
  const [producerQuery, setProducerQuery] = useState('')
  const [scanMode, setScanMode] = useState(false)
  const [aiQuery, setAiQuery] = useState('')
  const [aiSearching, setAiSearching] = useState(false)
  const [aiHits, setAiHits] = useState<ModelHit[] | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isMobile = useIsMobile()
  const [showMore, setShowMore] = useState(false) // accordion "Altre opzioni" su mobile
  const [material, setMaterial] = useState('PLA')
  const [color, setColor] = useState('Bianco')
  const [quality, setQuality] = useState('0.2 mm')

  // Prezzo che reagisce a materiale/qualità (base PLA 0.2 mm = € 12.80–18.50)
  const matF = material === 'ABS' ? 1.4 : material === 'PETG' ? 1.25 : 1
  const quaF = quality === '0.1 mm' ? 1.35 : quality === '0.3 mm' ? 0.85 : 1
  const priceLo = 12.8 * matF * quaF
  const priceHi = 18.5 * matF * quaF

  const runAiSearch = () => {
    const q = aiQuery.trim()
    if (!q || aiSearching) return
    setAiHits(null)
    setAiSearching(true)
    // ponytail: delay finto per il "sapore AI", la ricerca è sincrona sui mock
    setTimeout(() => {
      setAiHits(searchModels(q))
      setAiSearching(false)
    }, 900 + Math.random() * 500)
  }

  const openPicker = () => fileInputRef.current?.click()
  const pickFile = (f?: File) => { if (f) setFileName(f.name) }

  const currentProducer = producers.find(p => p.id === selectedProducer)
  const visibleProducers = producerQuery
    ? producers.filter(p =>
        [p.name, p.city, ...p.materials, ...p.technologies].join(' ').toLowerCase().includes(producerQuery.toLowerCase()))
    : producers

  const labelStyle: React.CSSProperties = { fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', width: 110, flex: '0 0 auto' }
  const pill = (on: boolean): React.CSSProperties => ({ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 100, cursor: 'pointer', border: on ? '1px solid var(--cyan)' : '1px solid var(--line-2)', background: on ? 'var(--cyan)' : 'transparent', color: on ? '#f4faed' : 'var(--muted)', transition: '0.15s' })

  const StepIndicator = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 auto' }}>
      {([1, 2, 3] as Step[]).map((s, i) => {
        const isDone = step > s
        const isActive = step === s
        return (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                fontSize: 12,
                fontFamily: 'var(--mono)',
                fontWeight: 700,
                background: isActive ? 'var(--cyan)' : isDone ? 'var(--glass-2)' : 'var(--glass)',
                border: isActive ? '1px solid var(--cyan)' : isDone ? '1px solid var(--cyan)' : '1px solid var(--line)',
                color: isActive ? '#f4faed' : isDone ? 'var(--cyan)' : 'var(--muted)',
                transition: '0.2s',
              }}
            >
              {isDone ? <Check size={14} /> : s}
            </div>
            {!isMobile && (
              <span
                style={{
                  fontSize: 12,
                  fontFamily: 'var(--mono)',
                  color: isActive ? 'var(--ink)' : 'var(--muted)',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {s === 1 ? 'Modello' : s === 2 ? 'Produttore' : 'Preventivo'}
              </span>
            )}
            {i < 2 && (
              <div style={{ width: isMobile ? 18 : 32, height: 1, background: 'var(--line)', margin: '0 4px' }} />
            )}
          </div>
        )
      })}
    </div>
  )

  if (scanMode) {
    return (
      <ScanView
        onClose={() => setScanMode(false)}
        onRequest={({ fileName: piece, producerId }) => {
          setFileName(piece)
          setSelectedProducer(producerId)
          setScanMode(false)
          setStep(3)
        }}
      />
    )
  }

  // ── Anteprima componente: vedi il pezzo PRIMA di scegliere il fablab ──
  if (previewing) {
    return (
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: '0 0 auto' }}>
          <div>
            <h1 style={{ fontWeight: 600, fontSize: 25, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
              È il pezzo che ti serve?
            </h1>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.04em', marginTop: 3 }}>
              CONTROLLA IL COMPONENTE PRIMA DI SCEGLIERE IL FABLAB
            </p>
          </div>
        </div>

        <GlassCard hero style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
          <div className="reg-marks">
            <div className="reg-tl" />
            <div className="reg-tr" />
            <div className="reg-bl" />
            <div className="reg-br" />
          </div>

          <div
            style={{
              position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
              fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)',
              letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap', zIndex: 10,
            }}
          >
            ANTEPRIMA COMPONENTE, {fileName || 'MODELLO'}
          </div>

          <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
            <PrintViewer3D modelUrl="/meshes/remote.glb" progress={100} tone="light" />
          </div>

          {/* Meta + annulla/conferma */}
          <div
            style={{
              flex: '0 0 auto', padding: '18px 24px', borderTop: '1px solid var(--line)',
              display: 'flex', alignItems: 'center', gap: 16, background: 'var(--glass)', zIndex: 10,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{fileName}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                Ruota l&apos;anteprima per controllare forma e incastri · validato dalla community
              </div>
            </div>
            <button
              onClick={() => { setPreviewing(false); setFileName(incoming.modelName ? '' : fileName); setStep(1) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'transparent', color: 'var(--muted)', border: '1px solid var(--line-2)',
                fontFamily: 'inherit', fontWeight: 600, fontSize: 13.5,
                height: 44, padding: '0 22px', borderRadius: 100, cursor: 'pointer', transition: '0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--glass-2)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              <X size={15} />
              Annulla, non è questo
            </button>
            <PrimaryButton onClick={() => { setPreviewing(false); setStep(2) }}>
              <Check size={16} />
              Conferma, scegli il FabLab →
            </PrimaryButton>
          </div>
        </GlassCard>
      </>
    )
  }

  // ── Metodi di input dello step 1, definiti una volta e composti per device ──
  const orDivider = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%', maxWidth: 600 }}>
      <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
      <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', letterSpacing: '0.1em' }}>
        OPPURE
      </span>
      <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
    </div>
  )

  const uploadZone = (
    <div
      style={{
        width: '100%',
        maxWidth: 600,
        height: 300,
        border: '2px dashed var(--line-2)',
        borderRadius: 18,
        background: 'var(--glass)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        cursor: 'pointer',
        transition: '0.2s',
      }}
      onClick={openPicker}
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); pickFile(e.dataTransfer.files?.[0]) }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--cyan)'
        el.style.background = 'var(--glass-2)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--line-2)'
        el.style.background = 'var(--glass)'
      }}
    >
      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".stl,.obj,.3mf,.step,.stp"
        style={{ display: 'none' }}
        onChange={e => pickFile(e.target.files?.[0] ?? undefined)}
      />

      {/* Blueprint grid */}
      <div className="blueprint-grid" />

      <Upload size={48} style={{ color: 'var(--cyan)', position: 'relative', zIndex: 1 }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>
          Trascina il tuo file 3D qui
        </h3>
        <p style={{ fontSize: 12, fontFamily: 'var(--mono)', color: fileName ? 'var(--cyan)' : 'var(--muted)' }}>
          {fileName || 'STL · OBJ · 3MF · STEP, max 50 MB'}
        </p>
      </div>

      <span onClick={e => e.stopPropagation()} style={{ position: 'relative', zIndex: 1 }}>
        <PrimaryButton onClick={openPicker}>
          Sfoglia file
        </PrimaryButton>
      </span>
    </div>
  )

  const aiForm = (
    <form
      onSubmit={e => { e.preventDefault(); runAiSearch() }}
      style={{ width: '100%', maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 10, flex: '0 0 auto' }}
    >
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Sparkles size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--cyan)' }} />
          <input
            value={aiQuery}
            onChange={e => setAiQuery(e.target.value)}
            placeholder="Descrivi il pezzo: «gancio appendiabiti», «supporto monitor»…"
            style={{
              width: '100%', height: 44, padding: '0 14px 0 38px', fontSize: 13.5,
              background: 'var(--glass)', border: '1px solid var(--line-2)', borderRadius: 100,
              color: 'var(--ink)', fontFamily: 'inherit', outline: 'none',
            }}
          />
        </div>
        <button
          type="submit"
          className="btn-spade"
          disabled={!aiQuery.trim() || aiSearching}
          style={{ height: 44, padding: '0 20px', fontSize: 13.5, flex: '0 0 auto' }}
        >
          Cerca con AI
        </button>
      </div>

      {aiSearching && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 6px' }}>
          <span style={{ display: 'flex', gap: 4 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--cyan)', animation: 'blink 1s infinite', animationDelay: `${i * 0.18}s` }} />
            ))}
          </span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase' }}>
            Teseo cerca nell'archivio…
          </span>
        </div>
      )}

      {aiHits && aiHits.length === 0 && (
        <p style={{ fontSize: 12.5, color: 'var(--muted)', padding: '2px 6px' }}>
          Nessun modello compatibile con «{aiQuery}», prova la scansione con fotocamera o carica un file.
        </p>
      )}

      {aiHits && aiHits.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {aiHits.slice(0, 3).map(hit => (
            <div
              key={hit.to + hit.name}
              onClick={() => {
                setFileName(hit.name)
                setPreviewing(true)
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
                background: 'var(--glass)', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)',
                cursor: 'pointer', transition: '0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; e.currentTarget.style.background = 'var(--glass-2)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.background = 'var(--glass)' }}
            >
              <Sparkles size={14} style={{ color: 'var(--cyan)', flex: '0 0 auto' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{hit.name}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--muted)', marginTop: 1 }}>{hit.meta}</div>
              </div>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600, color: 'var(--cyan)', letterSpacing: '0.03em', flex: '0 0 auto' }}>
                USA QUESTO ›
              </span>
            </div>
          ))}
        </div>
      )}
    </form>
  )

  // Scan primaria su mobile: card grande e tappabile
  const scanPrimary = (
    <button
      onClick={() => setScanMode(true)}
      style={{
        width: '100%', maxWidth: 600, minHeight: 220, border: '2px solid var(--cyan)', borderRadius: 18,
        background: 'var(--glass)', display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 12, cursor: 'pointer', fontFamily: 'inherit', position: 'relative',
        padding: 24, overflow: 'hidden',
      }}
    >
      <div className="blueprint-grid" />
      <Camera size={44} style={{ color: 'var(--cyan)', position: 'relative', zIndex: 1 }} />
      <h3 style={{ fontSize: 19, fontWeight: 600, color: 'var(--ink)', position: 'relative', zIndex: 1 }}>
        Scansiona l'oggetto
      </h3>
      <p style={{ fontSize: 12.5, fontFamily: 'var(--mono)', color: 'var(--muted)', position: 'relative', zIndex: 1, textAlign: 'center', lineHeight: 1.5 }}>
        Inquadra il pezzo con la fotocamera: l'AI lo riconosce e trova il ricambio.
      </p>
    </button>
  )

  // Scan terziaria su desktop: link discreto
  const scanTertiary = (
    <button
      onClick={() => setScanMode(true)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none',
        color: 'var(--muted)', fontFamily: 'inherit', fontSize: 12.5, cursor: 'pointer', padding: 6, transition: '0.2s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--cyan)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)' }}
    >
      <Camera size={15} /> Oppure scansiona con fotocamera
    </button>
  )

  return (
    <>
      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: '0 0 auto', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontWeight: 600, fontSize: 25, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
            Nuova stampa
          </h1>
          {/* Contesto sempre visibile tra gli step (riconoscere, non ricordare) */}
          {(fileName || currentProducer) && (
            <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.04em', marginTop: 3 }}>
              {fileName && <>MODELLO · <span style={{ color: 'var(--cyan)' }}>{fileName}</span></>}
              {fileName && currentProducer && ', '}
              {currentProducer && <>PRODUTTORE · <span style={{ color: 'var(--cyan)' }}>{currentProducer.name}</span></>}
            </p>
          )}
        </div>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'transparent', color: 'var(--muted)', border: '1px solid var(--line)',
            fontFamily: 'inherit', fontWeight: 600, fontSize: 13, padding: '0 16px',
            height: 36, borderRadius: 100, cursor: 'pointer', transition: '0.2s',
          }}
        >
          Annulla
        </button>
      </div>

      {/* Step indicator su riga propria: non compete con titolo e Annulla */}
      <div style={{ display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
        <StepIndicator />
      </div>

      {/* Step 1: scelta modello (gerarchia invertita mobile/desktop) */}
      {step === 1 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'safe center', gap: 20, minHeight: 0, overflow: 'auto' }}>
          {isMobile ? (
            <>
              {/* Mobile: scansione primaria, il resto sotto "Altre opzioni" */}
              {scanPrimary}
              <div style={{ width: '100%', maxWidth: 600 }}>
                <button
                  onClick={() => setShowMore(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%',
                    background: 'none', border: 'none', color: 'var(--muted)', fontFamily: 'var(--mono)',
                    fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', padding: 8,
                  }}
                >
                  Altre opzioni
                  <ChevronDown size={15} style={{ transform: showMore ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                </button>
                {showMore && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 6 }}>
                    {aiForm}
                    {orDivider}
                    {uploadZone}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Desktop: AI primaria, caricamento secondario, scansione terziaria */}
              <div style={{ width: '100%', maxWidth: 600, textAlign: 'center' }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>Che pezzo ti serve?</h3>
                <p style={{ fontSize: 12.5, color: 'var(--muted)' }}>Descrivilo e l'AI lo cerca nell'archivio della community.</p>
              </div>
              {aiForm}
              {orDivider}
              {uploadZone}
              {scanTertiary}
            </>
          )}

          {fileName && (
            <PrimaryButton onClick={() => setPreviewing(true)}>
              Avanti →
            </PrimaryButton>
          )}
        </div>
      )}

      {/* Step 2: choose producer */}
      {step === 2 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
          <SearchBar placeholder="Filtra per nome, materiale o tecnologia" value={producerQuery} onChange={setProducerQuery} />

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 11, overflow: 'auto' }}>
            {visibleProducers.length === 0 && (
              <div style={{ padding: 28, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                Nessun produttore corrisponde a «{producerQuery}».{' '}
                <button
                  onClick={() => setProducerQuery('')}
                  style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, padding: 0 }}
                >
                  Azzera il filtro
                </button>
              </div>
            )}
            {visibleProducers.map(producer => {
              const isSelected = selectedProducer === producer.id
              return (
                <div
                  key={producer.id}
                  onClick={producer.available ? () => setSelectedProducer(producer.id) : undefined}
                  style={{
                    padding: 18,
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'rgba(63,115,8,0.07)' : 'var(--glass)',
                    border: `1px solid ${isSelected ? 'var(--cyan)' : 'var(--line)'}`,
                    cursor: producer.available ? 'pointer' : 'default',
                    opacity: producer.available ? 1 : 0.55,
                    transition: '0.18s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                  }}
                >
                  {/* Radio */}
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? 'var(--cyan)' : 'var(--line-2)'}`,
                      display: 'grid',
                      placeItems: 'center',
                      flex: '0 0 auto',
                      transition: '0.18s',
                    }}
                  >
                    {isSelected && (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cyan)' }} />
                    )}
                  </div>

                  {/* Availability dot */}
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      flex: '0 0 auto',
                      background: producer.available ? 'var(--cyan)' : 'transparent',
                      boxShadow: producer.available ? 'none' : 'inset 0 0 0 1.5px var(--cyan)',
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{producer.name}</span>
                      <span style={{ fontFamily: 'var(--mono)', color: 'var(--cyan)', fontSize: 12 }}>{producer.distance}</span>
                      {!producer.available && (
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.06em', color: 'var(--muted)', border: '1px dashed var(--line-2)', borderRadius: 5, padding: '2px 7px' }}>
                          AL COMPLETO ORA
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {producer.technologies.map(tech => (
                        <span
                          key={tech}
                          style={{
                            fontSize: 10,
                            fontFamily: 'var(--mono)',
                            border: '1px solid var(--line)',
                            borderRadius: 5,
                            padding: '2px 7px',
                            color: 'var(--muted)',
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Star size={12} fill="currentColor" style={{ color: 'var(--cyan)' }} />
                    <span style={{ fontFamily: 'var(--mono)', color: 'var(--cyan)', fontSize: 12, fontWeight: 600 }}>
                      {producer.rating}
                    </span>
                    <span style={{ fontFamily: 'var(--mono)', color: 'var(--muted)', fontSize: 11 }}>
                      ({producer.reviews})
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', gap: 10, flex: '0 0 auto' }}>
            <button
              onClick={() => setStep(1)}
              style={{
                background: 'transparent',
                color: 'var(--muted)',
                border: '1px solid var(--line)',
                fontFamily: 'inherit',
                fontWeight: 600,
                fontSize: 13.5,
                padding: '0 20px',
                height: 44,
                borderRadius: 100,
                cursor: 'pointer',
                transition: '0.2s',
              }}
            >
              ← Indietro
            </button>
            <PrimaryButton
              onClick={() => setStep(3)}
              disabled={!currentProducer}
              title={currentProducer ? undefined : 'Scegli un produttore per continuare'}
            >
              Continua →
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* Step 3: quote & confirm */}
      {step === 3 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0, overflow: 'auto' }}>
          {/* Order summary */}
          <GlassCard
            hero
            style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink)' }}>
              Riepilogo ordine
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'FILE', value: fileName },
                { label: 'PRODUTTORE', value: currentProducer?.name ?? '-' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', gap: 16 }}>
                  <span style={{ ...labelStyle, paddingTop: 2 }}>{row.label}</span>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Config selezionabile: materiale / colore / qualità */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, borderTop: '1px solid var(--line)', paddingTop: 16 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={labelStyle}>MATERIALE</span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['PLA', 'PETG', 'ABS'].map(m => (
                    <button key={m} onClick={() => setMaterial(m)} style={pill(material === m)}>{m}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={labelStyle}>COLORE</span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  {COLORS.map(c => (
                    <button
                      key={c.name}
                      onClick={() => setColor(c.name)}
                      title={c.name}
                      style={{
                        width: 26, height: 26, borderRadius: '50%', background: c.hex, cursor: 'pointer', padding: 0,
                        border: color === c.name ? '2px solid var(--cyan)' : '1px solid var(--line-2)',
                        boxShadow: color === c.name ? '0 0 0 2px var(--glass)' : 'none',
                        transition: '0.15s',
                      }}
                    />
                  ))}
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>{color}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={labelStyle}>QUALITÀ</span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {([['0.1 mm', 'fine'], ['0.2 mm', 'standard'], ['0.3 mm', 'veloce']] as const).map(([q, tag]) => (
                    <button key={q} onClick={() => setQuality(q)} style={pill(quality === q)}>{q} · {tag}</button>
                  ))}
                </div>
              </div>
              <p style={{ fontSize: 11.5, fontFamily: 'var(--mono)', color: 'var(--muted)', letterSpacing: '0.02em' }}>
                Consigliati da TESEO per questo modello, il produttore può proporti alternative in chat.
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 16, display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                COSTO STIMATO
              </span>
              <span style={{ fontSize: 26, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--cyan)' }}>
                € {priceLo.toFixed(2)} – {priceHi.toFixed(2)}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                CONSEGNA STIMATA
              </span>
              <span style={{ fontSize: 13.5, fontFamily: 'var(--mono)', color: 'var(--ink)', fontWeight: 600 }}>
                {currentProducer?.avgTime ?? '2-3 giorni'}
              </span>
            </div>
          </GlassCard>

          {/* Notes */}
          <GlassCard style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink)' }}>
              Note aggiuntive
            </h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Inserisci istruzioni speciali, requisiti di colore, o altri dettagli…"
              rows={4}
              style={{
                background: 'var(--glass)',
                border: '1px solid var(--line)',
                borderRadius: 13,
                padding: '12px 16px',
                color: 'var(--ink)',
                fontFamily: 'inherit',
                fontSize: 13.5,
                outline: 'none',
                resize: 'vertical',
                lineHeight: 1.5,
              }}
            />
          </GlassCard>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, flex: '0 0 auto' }}>
            <button
              onClick={() => setStep(2)}
              style={{
                background: 'transparent',
                color: 'var(--muted)',
                border: '1px solid var(--line)',
                fontFamily: 'inherit',
                fontWeight: 600,
                fontSize: 13.5,
                padding: '0 20px',
                height: 44,
                borderRadius: 100,
                cursor: 'pointer',
                transition: '0.2s',
              }}
            >
              ← Indietro
            </button>
            <PrimaryButton
              onClick={() => {
                toast('Ordine confermato, in attesa del produttore')
                navigate('/app/progetti', {
                  state: { newOrder: { name: fileName, fablab: currentProducer?.name ?? '', notes, material, color, quality } },
                })
              }}
            >
              Conferma ordine
            </PrimaryButton>
          </div>
        </div>
      )}
    </>
  )
}
