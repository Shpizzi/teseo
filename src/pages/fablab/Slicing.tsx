import { useState, useRef, useMemo, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ChevronDown,
  Grid3X3,
  Box,
  AlignLeft,
  Wrench,
  PenLine,
  Play,
  Hand,
  FlaskConical,
  Download,
} from 'lucide-react'
import PrintViewer3D from '../../components/PrintViewer3D'
import { useLiveOrders, setOrderStatus } from '../../mock/orderStore'
import { toast } from '../../components/Toast'

// ── Tick data generated once ──────────────────────────────────
type Tick = { h: number; white: boolean }

// ── Slicing page ──────────────────────────────────────────────
export default function Slicing() {
  const [progress, setProgress] = useState(62)
  const [infill, setInfill] = useState(20)
  const [activePreset, setActivePreset] = useState('balanced')
  // Un solo stato per i due toggle AI (pannello destro + dock): stesso concetto, stessa verità
  const [aiMode, setAiMode] = useState(true)
  const navigate = useNavigate()

  // Ordine in ingresso da OrdineDetail/Ordini (?ordine=id): il contesto segue Roberto
  const orderId = useSearchParams()[0].get('ordine')
  const order = useLiveOrders().find(o => o.id === orderId)

  const sliderRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const ticks = useMemo<Tick[]>(
    () => Array.from({ length: 60 }, () => ({ h: 4 + Math.random() * 14, white: Math.random() > 0.82 })),
    []
  )

  const handleSliderMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true

    const updateInfill = (clientX: number) => {
      if (!sliderRef.current) return
      const rect = sliderRef.current.getBoundingClientRect()
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      setInfill(Math.round(pct * 100))
    }

    updateInfill(e.clientX)

    const onMove = (me: MouseEvent) => {
      if (!isDragging.current) return
      updateInfill(me.clientX)
    }
    const onUp = () => {
      isDragging.current = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [])

  const presets = [
    { key: 'balanced', label: 'Bilanciato', Icon: Box },
    { key: 'visual',   label: 'Visuale',    Icon: AlignLeft },
    { key: 'engineering', label: 'Tecnico', Icon: Wrench },
    { key: 'draft',    label: 'Bozza',      Icon: PenLine },
  ]

  const floatPanelStyle: React.CSSProperties = {
    background: 'rgba(244,250,237,.6)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid var(--line-2)',
    borderRadius: 16,
    padding: 18,
    position: 'absolute',
    zIndex: 10,
  }

  return (
    <div
      style={{
        flex: 1,
        position: 'relative',
        borderRadius: 18,
        overflow: 'hidden',
        marginLeft: 16,
        border: '1px solid var(--line-2)',
        background: '#122006',
      }}
    >
      {/* Blueprint grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(rgba(178,235,118,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(178,235,118,.07) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
          transform: 'perspective(420px) rotateX(7deg)',
          transformOrigin: 'center 80%',
          zIndex: 0,
        }}
      />

      {/* 3D Viewer */}
      <PrintViewer3D onProgressChange={setProgress} />

      {/* Registration corner marks */}
      <div className="reg-marks">
        <div className="reg-tl" />
        <div className="reg-tr" />
        <div className="reg-bl" />
        <div className="reg-br" />
      </div>

      {/* Caption */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--mono)',
          fontSize: 10,
          letterSpacing: '0.2em',
          color: 'var(--cyan)',
          opacity: 0.75,
          zIndex: 6,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        FIG. 01 — {(order?.name ?? 'DEMOGOR').toUpperCase()} · SCALE 1:1
      </div>

      {/* ── Float panel LEFT ── */}
      <div style={{ ...floatPanelStyle, top: 44, left: 22, width: 248 }}>
        {/* Mini stats */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            marginBottom: 12,
          }}
        >
          {order ? (
            ([
              ['Ordine', order.ordNum, true],
              ['Cliente', order.customer, false],
              ['Materiale', order.material, false],
              ['Scadenza', order.deadlineLabel, true],
            ] as [string, string, boolean][]).map(([label, val, cyan]) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--mono)',
                  fontSize: 10.5,
                  color: 'var(--muted)',
                }}
              >
                <span>{label}</span>
                <span style={{ color: cyan ? 'var(--cyan)' : 'var(--ink)', fontWeight: 600 }}>
                  {val}
                </span>
              </div>
            ))
          ) : (
            <button
              onClick={() => navigate('/fablab/ordini')}
              style={{
                background: 'none', border: 'none', padding: 0, textAlign: 'left',
                fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--muted)',
                cursor: 'pointer', lineHeight: 1.5,
              }}
            >
              Nessun ordine selezionato —{' '}
              <span style={{ color: 'var(--cyan)' }}>scegli un ordine accettato ›</span>
            </button>
          )}
        </div>

        {/* Material pill */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            background: 'var(--cyan)',
            border: 'none',
            borderRadius: 100,
            padding: '8px 14px',
            color: '#f4faed',
            fontFamily: 'inherit',
            fontWeight: 700,
            fontSize: 12.5,
            cursor: 'pointer',
            marginBottom: 14,
          }}
        >
          Materiale: Red ABS
          <ChevronDown size={14} />
        </button>

        {/* Position card */}
        <div
          style={{
            background: 'rgba(63,115,8,.04)',
            border: '1px solid var(--line)',
            borderRadius: 14,
            padding: 16,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: 'var(--muted)',
                textTransform: 'uppercase',
              }}
            >
              POSIZIONE
            </span>
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 11,
                color: 'var(--muted)',
              }}
            >
              45°
            </span>
          </div>

          {/* Gizmo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                border: '1px solid var(--line-2)',
                background: 'radial-gradient(circle at 50% 50%, rgba(63,115,8,.08), transparent 70%)',
                position: 'relative',
              }}
            >
              {/* Dashed inner circle */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  border: '1px dashed var(--line)',
                }}
              />
              {/* Cyan ball dot */}
              <div
                style={{
                  position: 'absolute',
                  top: '38%',
                  left: '42%',
                  width: 15,
                  height: 15,
                  borderRadius: '50%',
                  background: 'var(--cyan)',
                  boxShadow: '0 0 8px var(--cyan)',
                }}
              />
            </div>
          </div>

          {/* XYZ coords */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {[
              ['X', '94.13'],
              ['Y', '-24.18'],
              ['Z', '16.73'],
            ].map(([axis, val]) => (
              <div
                key={axis}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                }}
              >
                <span style={{ color: 'var(--muted)' }}>{axis}</span>
                <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Float panel RIGHT ── */}
      <div style={{ ...floatPanelStyle, top: 44, right: 22, width: 268 }}>
        {/* Preset grid 2×2 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
            marginBottom: 14,
          }}
        >
          {presets.map(({ key, label, Icon }) => {
            const isActive = activePreset === key
            return (
              <button
                key={key}
                onClick={() => setActivePreset(key)}
                style={{
                  border: `1px solid ${isActive ? 'var(--cyan)' : 'var(--line)'}`,
                  background: isActive ? 'rgba(63,115,8,.08)' : 'transparent',
                  borderRadius: 13,
                  padding: '14px 10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  color: isActive ? 'var(--cyan)' : 'var(--muted)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  transition: '0.18s',
                }}
              >
                <Icon size={18} />
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600 }}>
                  {label}
                </span>
              </button>
            )
          })}
        </div>

        {/* AI/Manuale toggle */}
        <div
          style={{
            display: 'flex',
            background: 'var(--glass-2)',
            border: '1px solid var(--line)',
            borderRadius: 100,
            padding: 3,
            gap: 3,
            marginBottom: 14,
          }}
        >
          {[{ val: true, label: 'Consigliato' }, { val: false, label: 'Manuale' }].map(({ val, label }) => (
            <button
              key={label}
              onClick={() => setAiMode(val)}
              style={{
                flex: 1,
                padding: '6px 0',
                borderRadius: 100,
                border: 'none',
                background: aiMode === val ? 'var(--cyan)' : 'transparent',
                color: aiMode === val ? '#f4faed' : 'var(--muted)',
                fontFamily: 'inherit',
                fontWeight: 700,
                fontSize: 11.5,
                cursor: 'pointer',
                transition: '0.18s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Settings rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Risoluzione */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid var(--line)',
            }}
          >
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>Risoluzione</span>
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 12,
                color: 'var(--cyan)',
                cursor: 'pointer',
              }}
            >
              4K ›
            </span>
          </div>

          {/* Infill section */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 8,
              }}
            >
              <Grid3X3 size={13} style={{ color: 'var(--muted)' }} />
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>Infill</span>
            </div>

            {/* Slider */}
            <div
              ref={sliderRef}
              onMouseDown={handleSliderMouseDown}
              style={{
                height: 34,
                borderRadius: 100,
                background: 'rgba(63,115,8,.08)',
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
                userSelect: 'none',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${infill}%`,
                  background: 'var(--cyan)',
                  borderRadius: 100,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 16,
                  fontFamily: 'var(--mono)',
                  fontWeight: 700,
                  color: '#f4faed',
                  fontSize: 12,
                  transition: isDragging.current ? 'none' : 'width 0.1s ease',
                }}
              >
                {infill}%
                {/* Knob */}
                <div
                  style={{
                    position: 'absolute',
                    right: 6,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 4,
                    height: 16,
                    borderRadius: 3,
                    background: '#f4faed',
                    opacity: 0.7,
                  }}
                />
              </div>
            </div>

            {/* Pattern & Shell */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 8,
              }}
            >
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--muted)' }}>
                Triangoli ›
              </span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--muted)' }}>
                Shell 0.8 · 1.2 mm
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Progress bar (center) ── */}
      <div
        style={{
          position: 'absolute',
          top: '47%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          background: 'rgba(244,250,237,.5)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid var(--line-2)',
          borderRadius: 100,
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          minWidth: 360,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 12.5,
            color: 'var(--muted)',
            whiteSpace: 'nowrap',
            letterSpacing: '0.05em',
          }}
        >
          ANTEPRIMA LAYER
        </span>

        {/* Track */}
        <div
          style={{
            flex: 1,
            height: 13,
            borderRadius: 100,
            background: 'rgba(63,115,8,.08)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: `repeating-linear-gradient(90deg, var(--cyan) 0 3px, transparent 3px 6px), linear-gradient(90deg, var(--cyan), rgba(63,115,8,.35))`,
              transition: 'width 0.4s ease',
            }}
          />
        </div>

        {/* Badge */}
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: '50%',
            background: 'var(--forest)',
            color: '#fff',
            display: 'grid',
            placeItems: 'center',
            fontFamily: 'var(--mono)',
            fontSize: 13,
            fontWeight: 700,
            flex: '0 0 auto',
          }}
        >
          {progress}%
        </div>
      </div>

      {/* ── Dock bottom ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 22,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {/* Play — chiude lo slicing: l'ordine va in coda di stampa */}
        <button
          title="Aggiungi alla coda di stampa"
          onClick={() => {
            if (order) setOrderStatus(order.id, 'printing')
            toast(`${order?.name ?? 'Modello'} in coda su Bambu X1 · 01`)
            navigate('/fablab/coda')
          }}
          style={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            background: 'var(--cyan)',
            border: 'none',
            display: 'grid',
            placeItems: 'center',
            color: '#f4faed',
            cursor: 'pointer',
          }}
        >
          <Play size={20} fill="currentColor" />
        </button>

        {/* Hand */}
        <button
          style={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            background: 'transparent',
            border: '1px solid var(--line-2)',
            display: 'grid',
            placeItems: 'center',
            color: 'var(--cyan)',
            cursor: 'pointer',
          }}
        >
          <Hand size={20} />
        </button>

        {/* Tool buttons */}
        {[FlaskConical, Download].map((Icon, i) => (
          <button
            key={i}
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(244,250,237,.6)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid var(--line)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--muted)',
              cursor: 'pointer',
            }}
          >
            <Icon size={18} />
          </button>
        ))}

        {/* AI toggle */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(244,250,237,.6)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid var(--line)',
            borderRadius: 100,
            padding: 3,
            gap: 3,
          }}
        >
          {[{ val: true, label: 'AI slicing' }, { val: false, label: 'Manuale' }].map(({ val, label }) => (
            <button
              key={label}
              onClick={() => setAiMode(val)}
              style={{
                padding: '6px 14px',
                borderRadius: 100,
                border: 'none',
                background: aiMode === val ? 'var(--cyan)' : 'transparent',
                color: aiMode === val ? '#f4faed' : 'var(--muted)',
                fontFamily: 'inherit',
                fontWeight: 700,
                fontSize: 11.5,
                cursor: 'pointer',
                transition: '0.18s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Timeline bottom-left ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 22,
          left: 22,
          right: 22,
          zIndex: 10,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 12,
          pointerEvents: 'none',
          opacity: 0.9,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 10.5,
            color: 'var(--muted)',
            whiteSpace: 'nowrap',
            flex: '0 0 auto',
          }}
        >
          13:12:43 / 25:12:49
        </span>

        <div
          style={{
            flex: 1,
            height: 20,
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            gap: 2,
          }}
        >
          {ticks.map((tick, i) => (
            <div
              key={i}
              style={{
                width: 2,
                height: tick.h,
                background: tick.white ? 'rgba(234,244,251,.7)' : 'rgba(63,115,8,.3)',
                borderRadius: 1,
                flex: '0 0 auto',
              }}
            />
          ))}
        </div>

        <span
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 10.5,
            color: 'var(--muted)',
            flex: '0 0 auto',
          }}
        >
          1×
        </span>
      </div>
    </div>
  )
}
