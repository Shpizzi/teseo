import { useState } from 'react'
import { Upload, Camera, Check, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import GlassCard from '../../components/GlassCard'
import PrimaryButton from '../../components/PrimaryButton'
import SearchBar from '../../components/SearchBar'
import { producers } from '../../mock/user-pages'

type Step = 1 | 2 | 3

export default function NuovaStampa() {
  const [step, setStep] = useState<Step>(1)
  const [selectedProducer, setSelectedProducer] = useState(producers[0].id)
  const [notes, setNotes] = useState('')
  const navigate = useNavigate()

  const currentProducer = producers.find(p => p.id === selectedProducer) ?? producers[0]

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
                color: isActive ? '#08233f' : isDone ? 'var(--cyan)' : 'var(--muted)',
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

  return (
    <>
      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: '0 0 auto' }}>
        <div>
          <h1 style={{ fontWeight: 600, fontSize: 25, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
            Nuova stampa
          </h1>
        </div>
        <div style={{ flex: 1 }} />
        <StepIndicator />
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
            {/* Blueprint grid */}
            <div className="blueprint-grid" />

            <Upload size={48} style={{ color: 'var(--cyan)', position: 'relative', zIndex: 1 }} />

            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>
                Trascina il tuo file 3D qui
              </h3>
              <p style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>
                STL · OBJ · 3MF · STEP — max 50 MB
              </p>
            </div>

            <PrimaryButton>
              Sfoglia file
            </PrimaryButton>
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
          >
            <Camera size={18} />
            Scansiona con fotocamera
          </button>

          <PrimaryButton onClick={() => setStep(2)}>
            Avanti →
          </PrimaryButton>
        </div>
      )}

      {/* Step 2: choose producer */}
      {step === 2 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
          <SearchBar placeholder="Filtra per materiale o distanza" />

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 11, overflow: 'auto' }}>
            {producers.map(producer => {
              const isSelected = selectedProducer === producer.id
              return (
                <div
                  key={producer.id}
                  onClick={() => setSelectedProducer(producer.id)}
                  style={{
                    padding: 18,
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'rgba(174,227,249,0.07)' : 'var(--glass)',
                    border: `1px solid ${isSelected ? 'var(--cyan)' : 'var(--line)'}`,
                    cursor: 'pointer',
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
            <PrimaryButton onClick={() => setStep(3)}>
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
                { label: 'FILE', value: 'modello.stl' },
                { label: 'PRODUTTORE', value: currentProducer.name },
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
                2-3 giorni lavorativi
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
            <PrimaryButton onClick={() => navigate('/app/progetti')}>
              Conferma ordine
            </PrimaryButton>
          </div>
        </div>
      )}
    </>
  )
}
