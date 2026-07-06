import GlassCard from '../../components/GlassCard'
import { fablabImpactMonths } from '../../mock'

const totCo2 = fablabImpactMonths.reduce((s, m) => s + m.co2Kg, 0)
const totPieces = fablabImpactMonths.reduce((s, m) => s + m.pieces, 0)
const current = fablabImpactMonths[fablabImpactMonths.length - 1]
const maxPieces = Math.max(...fablabImpactMonths.map(m => m.pieces))

const heroStats = [
  { value: `${current.pieces}`, label: 'pezzi questo mese · +12%' },
  { value: String(totPieces), label: 'pezzi da febbraio' },
  { value: '68%', label: 'stampe su riciclato' },
]

export default function Impatto() {
  return (
    <>
      {/* Topbar */}
      <div style={{ flex: '0 0 auto' }}>
        <h1 style={{ fontWeight: 600, fontSize: 25, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
          Impatto della produzione
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 3, fontFamily: 'var(--mono)', letterSpacing: '0.02em' }}>
          COSA EVITA LA RETE GRAZIE AI PEZZI STAMPATI QUI
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
              CO₂ evitata da febbraio
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 'clamp(52px, 8vw, 84px)', fontWeight: 700, lineHeight: 1, color: 'var(--lemongrass)', letterSpacing: '-0.03em', marginTop: 10 }}>
              −{(totCo2 / 1000).toFixed(1)}<span style={{ fontSize: '0.42em', fontWeight: 600, marginLeft: 10 }}>t</span>
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'rgba(255,255,255,.55)', marginTop: 10 }}>
              pezzo riparato vs ricambio nuovo (−95%)
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

        {/* Monthly trend */}
        <GlassCard style={{ padding: 18 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 12 }}>
            Andamento mensile
          </div>
          {fablabImpactMonths.map(m => (
            <div key={m.month} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderTop: '1px solid var(--line)' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--muted)', width: 38 }}>
                {m.month}
              </span>
              <div style={{ flex: 1, height: 14, borderRadius: 7, background: 'var(--glass-2)', overflow: 'hidden' }}>
                <div style={{ width: `${(m.pieces / maxPieces) * 100}%`, height: '100%', background: 'var(--cyan)', borderRadius: 7 }} />
              </div>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 17, fontWeight: 700, color: 'var(--ink)', width: 84, textAlign: 'right' }}>
                {m.pieces} pz
              </span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 17, fontWeight: 700, color: 'var(--cyan)', width: 130, textAlign: 'right' }}>
                −{(m.co2Kg / 1000).toFixed(2)} t CO₂
              </span>
            </div>
          ))}
        </GlassCard>

        {/* Methodology footnote */}
        <p style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.04em', color: 'var(--muted-2)', lineHeight: 1.7 }}>
          STIMA ILLUSTRATIVA CON DATI SECONDARI · CO₂ evitata = pezzo riparato vs ricambio nuovo (−95%, caso sedia) · PETG riciclato 2,55 kg CO₂/kg (Prusa LCA)
        </p>
      </div>
    </>
  )
}
