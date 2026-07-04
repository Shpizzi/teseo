import { useState, useRef } from 'react'
import { Upload, Camera, Check, Star } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import GlassCard from '../../components/GlassCard'
import PrimaryButton from '../../components/PrimaryButton'
import SearchBar from '../../components/SearchBar'
import ScanView from '../../scan/ScanView'
import { producers } from '../../mock/user-pages'
import { toast } from '../../components/Toast'

type Step = 1 | 2 | 3

// Contesto in ingresso (da Community, Salvati, Produttori, Scan): il wizard
// non deve far ripartire l'utente da zero se modello/produttore sono già noti.
type IncomingState = { modelName?: string; producerId?: string } | null

export default function NuovaStampa() {
  const navigate = useNavigate()
  const incoming = (useLocation().state as IncomingState) ?? {}
  const [step, setStep] = useState<Step>(incoming.modelName ? 2 : 1)
  const [selectedProducer, setSelectedProducer] = useState(incoming.producerId ?? '')
  const [notes, setNotes] = useState('')
  const [fileName, setFileName] = useState(incoming.modelName ?? '')
  const [producerQuery, setProducerQuery] = useState('')
  const [scanMode, setScanMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const openPicker = () => fileInputRef.current?.click()
  const pickFile = (f?: File) => { if (f) setFileName(f.name) }

  const currentProducer = producers.find(p => p.id === selectedProducer)
  const visibleProducers = producerQuery
    ? producers.filter(p =>
        [p.name, p.city, ...p.materials, ...p.technologies].join(' ').toLowerCase().includes(producerQuery.toLowerCase()))
    : producers

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
            <span
              style={{
                fontSize: 12,
                fontFamily: 'var(--mono)',
                color: isActive ? 'var(--ink)' : 'var(--muted)',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {s === 1 ? 'Carica modello' : s === 2 ? 'Scegli produttore' : 'Preventivo'}
            </span>
            {i < 2 && (
              <div style={{ width: 32, height: 1, background: 'var(--line)', margin: '0 4px' }} />
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
              {fileName && currentProducer && ' — '}
              {currentProducer && <>PRODUTTORE · <span style={{ color: 'var(--cyan)' }}>{currentProducer.name}</span></>}
            </p>
          )}
        </div>
        <div style={{ flex: 1 }} />
        <StepIndicator />
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

      {/* Step 1: upload */}
      {step === 1 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, minHeight: 0 }}>
          {/* Drag-drop area */}
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
                {fileName || 'STL · OBJ · 3MF · STEP — max 50 MB'}
              </p>
            </div>

            <span onClick={e => e.stopPropagation()} style={{ position: 'relative', zIndex: 1 }}>
              <PrimaryButton onClick={openPicker}>
                Sfoglia file
              </PrimaryButton>
            </span>
          </div>

          {/* OR divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%', maxWidth: 600 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
            <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', letterSpacing: '0.1em' }}>
              OPPURE
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          </div>

          {/* Camera button */}
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'transparent',
              color: 'var(--cyan)',
              border: '1px solid var(--line-2)',
              fontFamily: 'inherit',
              fontWeight: 600,
              fontSize: 13.5,
              padding: '12px 24px',
              borderRadius: 100,
              cursor: 'pointer',
              transition: '0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--glass-2)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
            onClick={() => setScanMode(true)}
          >
            <Camera size={18} />
            Scansiona con fotocamera
          </button>

          <PrimaryButton
            onClick={() => setStep(2)}
            disabled={!fileName}
            title={fileName ? undefined : 'Carica un file 3D o scansiona un oggetto per continuare'}
          >
            Avanti →
          </PrimaryButton>
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
                { label: 'PRODUTTORE', value: currentProducer?.name ?? '—' },
                { label: 'MATERIALE', value: 'PLA bianco' },
                { label: 'RISOLUZIONE', value: '0.2 mm' },
                { label: 'INFILL', value: '20%' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', gap: 16 }}>
                  <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', width: 110, flex: '0 0 auto', paddingTop: 2 }}>
                    {row.label}
                  </span>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{row.value}</span>
                </div>
              ))}
              <p style={{ fontSize: 11.5, fontFamily: 'var(--mono)', color: 'var(--muted)', letterSpacing: '0.02em' }}>
                Materiale e parametri sono consigliati da TESEO per questo modello — il produttore può proporti alternative in chat.
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 16, display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                COSTO STIMATO
              </span>
              <span style={{ fontSize: 26, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--cyan)' }}>
                € 12.80 – 18.50
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
                toast('Ordine confermato — in attesa del produttore')
                navigate('/app/progetti', {
                  state: { newOrder: { name: fileName, fablab: currentProducer?.name ?? '', notes } },
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
