import { Link } from 'react-router-dom'
import { TreePine, Car, Smartphone, Target } from 'lucide-react'
import GlassCard from '../../components/GlassCard'
import { userImpactRows } from '../../mock'

const totCo2 = userImpactRows.reduce((s, r) => s + r.co2Kg, 0)
const totEuro = userImpactRows.reduce((s, r) => s + r.euro, 0)

const heroStats = [
  { value: `−${totEuro} €`, label: 'vs ricambio nuovo' },
  { value: String(userImpactRows.length).padStart(2, '0'), label: 'oggetti salvati dalla discarica' },
  { value: '~2 Wh', label: 'per pezzo da archivio (vs ~28)' },
]

// Equivalenze relatabili (stile report d'impatto Tesla):
// un albero assorbe ~20 kg CO₂/anno · auto ~0,12 kg/km · ricarica phone ~0,008 kg
const equivalences = [
  { icon: <TreePine size={18} />, value: (totCo2 / 20).toFixed(1).replace('.', ','), unit: 'alberi', label: 'CO₂ assorbita da alberi in un anno' },
  { icon: <Car size={18} />, value: String(Math.round(totCo2 / 0.12)), unit: 'km', label: 'di viaggio in auto evitati' },
  { icon: <Smartphone size={18} />, value: Math.round(totCo2 / 0.008).toLocaleString('it-IT'), unit: 'ricariche', label: 'di smartphone equivalenti' },
]

const MILESTONE_KG = 50

export default function Impatto() {
  return (
    <>
      {/* Topbar */}
      <div style={{ flex: '0 0 auto' }}>
        <h1 style={{ fontWeight: 600, fontSize: 25, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
          Il tuo impatto
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 3, fontFamily: 'var(--mono)', letterSpacing: '0.02em' }}>
          COSA HAI EVITATO RIPARANDO INVECE DI RICOMPRARE
        </p>
      </div>

      <div style={{ flex: 1, overflow: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Hero, superficie scura forest, numero gigante lemongrass */}
        <div
          style={{
            position: 'relative',
            background: '#18280e',
            border: '1px solid var(--line-2)',
            borderRadius: 14,
            padding: '30px 34px',
            overflow: 'hidden',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            gap: '22px 44px',
            flex: '0 0 auto',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(rgba(178,235,118,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(178,235,118,.09) 1px,transparent 1px)',
              backgroundSize: '22px 22px',
              pointerEvents: 'none',
            }}
          />
          <span className="reg-tl" style={{ borderColor: 'var(--lemongrass)' }} />
          <span className="reg-br" style={{ borderColor: 'var(--lemongrass)' }} />

          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.1em', color: 'rgba(255,255,255,.55)', textTransform: 'uppercase' }}>
              CO₂ evitata finora
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(52px, 8vw, 84px)', fontWeight: 700, lineHeight: 1, color: 'var(--lemongrass)', letterSpacing: '-0.03em', marginTop: 10 }}>
              −{Math.round(totCo2)}<span style={{ fontSize: '0.42em', fontWeight: 600, marginLeft: 10 }}>kg</span>
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'rgba(255,255,255,.55)', marginTop: 10 }}>
              −95% rispetto al comprare nuovo
            </div>
          </div>

          <div style={{ position: 'relative', display: 'flex', gap: 40, flexWrap: 'wrap' }}>
            {heroStats.map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 27, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.06em', color: 'rgba(255,255,255,.55)', textTransform: 'uppercase', marginTop: 7 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Equivalenze, numeri relatabili, uno per tile */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, flex: '0 0 auto' }}>
          {equivalences.map(eq => (
            <GlassCard key={eq.label} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span
                style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: 'var(--bg-2)', border: '1px solid var(--line)',
                  display: 'grid', placeItems: 'center', color: 'var(--cyan)',
                }}
              >
                {eq.icon}
              </span>
              <div>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 30, fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>
                  {eq.value}
                </span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 600, color: 'var(--cyan)', marginLeft: 7 }}>
                  {eq.unit}
                </span>
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.45 }}>{eq.label}</div>
            </GlassCard>
          ))}
        </div>

        {/* Traguardo, progressione verso il prossimo milestone */}
        <GlassCard style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 18, flex: '0 0 auto' }}>
          <span
            style={{
              width: 40, height: 40, borderRadius: 11, flex: '0 0 auto',
              background: 'var(--bg-2)', border: '1px solid var(--line)',
              display: 'grid', placeItems: 'center', color: 'var(--cyan)',
            }}
          >
            <Target size={19} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>Prossimo traguardo: {MILESTONE_KG} kg CO₂</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: 'var(--cyan)' }}>
                {Math.round((totCo2 / MILESTONE_KG) * 100)}%
              </span>
            </div>
            <div className="progress-track" style={{ marginTop: 10 }}>
              <span className="progress-track-fill" style={{ width: `${Math.min(100, (totCo2 / MILESTONE_KG) * 100)}%` }} />
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--muted)', marginTop: 7, letterSpacing: '0.04em' }}>
              ANCORA {(MILESTONE_KG - totCo2).toFixed(1).replace('.', ',')} KG, CIRCA 2 RIPARAZIONI
            </div>
          </div>
        </GlassCard>

        {/* Per-object breakdown */}
        <GlassCard style={{ padding: 18 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 12 }}>
            Per oggetto
          </div>
          {userImpactRows.map(r => (
            <div
              key={r.name}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0', borderTop: '1px solid var(--line)' }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{r.name}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{r.date}</div>
              </div>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 17, fontWeight: 700, color: 'var(--cyan)' }}>
                −{r.co2Kg} kg CO₂
              </span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 17, fontWeight: 700, color: 'var(--ink)', width: 76, textAlign: 'right' }}>
                −{r.euro} €
              </span>
            </div>
          ))}
        </GlassCard>

        {/* Methodology footnote */}
        <p style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.04em', color: 'var(--muted-2)', lineHeight: 1.7 }}>
          STIMA ILLUSTRATIVA CON DATI SECONDARI · PETG riciclato 2,55 kg CO₂/kg (Prusa LCA) · Fattore rete elettrica IT 0,3–0,4 kg/kWh (ISPRA)
          {' · '}
          <Link to="/impatto" style={{ color: 'var(--cyan)' }}>come calcoliamo questi numeri →</Link>
        </p>
      </div>
    </>
  )
}
