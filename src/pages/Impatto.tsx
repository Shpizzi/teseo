import { ScanLine, Database, Ruler, Smartphone, Leaf, UserCheck, Recycle, Share2, Wrench, RefreshCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import GlassCard from '../components/GlassCard'
import PrimaryButton from '../components/PrimaryButton'
import { LandingNav, LandingFooter, SectionTag, PageHero, GhostButton } from '../components/LandingChrome'

/* ── Caso studio: sedia da ufficio, pezzo 30g in PETG riciclato ── */
function CaseStudySection() {
  const rows = [
    { label: 'CO₂ emessa', without: '~20 kg', withT: '~0,5 kg', saving: '−95%' },
    { label: 'Materia consumata', without: '~10 kg', withT: '0,03 kg', saving: '−99%' },
    { label: 'Costo per te', without: '~80 €', withT: '~10 €', saving: '−70 €' },
    { label: 'Rifiuto prodotto', without: '~10 kg', withT: '≈ 0', saving: '10 kg evitati' },
  ]

  return (
    <section style={{ padding: '10px 6% 70px', maxWidth: 900, margin: '0 auto' }}>
      <GlassCard hero style={{ padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, position: 'relative' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.08em', color: 'var(--muted)' }}>
            CASO REALE — SEDIA DA UFFICIO, COMPONENTE ROTTO DA 30g
          </span>
          <span className="status-pill sp-print">PETG RICICLATO</span>
        </div>

        <div style={{ marginTop: 24, position: 'relative' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr 1fr', gap: 8, padding: '0 4px 10px', borderBottom: '1px solid var(--line)' }}>
            <span />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em' }}>RICOMPRARE</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--cyan)', letterSpacing: '0.06em' }}>CON TESEO</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em', textAlign: 'right' }}>RISPARMIO</span>
          </div>
          {rows.map((r, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.3fr 1fr 1fr 1fr',
                gap: 8,
                padding: '14px 4px',
                borderBottom: i < rows.length - 1 ? '1px solid var(--line)' : 'none',
                alignItems: 'baseline',
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{r.label}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 15, color: 'var(--muted)' }}>{r.without}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 15, fontWeight: 700, color: 'var(--cyan)' }}>{r.withT}</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 600, color: 'var(--ink)', textAlign: 'right' }}>{r.saving}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      <p style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--muted-2)', marginTop: 14, lineHeight: 1.7, letterSpacing: '0.02em' }}>
        STIMA ILLUSTRATIVA CON DATI SECONDARI · Sedia ufficio 23,4 kg CO₂ (range 10–36, Arbor) · PETG riciclato 2,55 kg CO₂/kg (Prusa LCA) ·
        Energia stampa 70–80 kWh/kg (Wiley, Mosomi 2024) · Fattore rete elettrica IT 0,3–0,4 kg/kWh (ISPRA)
      </p>
    </section>
  )
}

/* ── Anche l'AI ha un'impronta ── */
function DigitalFootprintSection() {
  return (
    <section style={{ padding: '70px 6%', background: 'rgba(63,115,8,.02)' }}>
      <div style={{ textAlign: 'center' }}>
        <SectionTag>TRASPARENZA</SectionTag>
        <h2 style={{ fontSize: 34, fontWeight: 700, marginTop: 14, color: 'var(--ink)' }}>
          Anche l&apos;AI ha un&apos;impronta. La misuriamo.
        </h2>
        <p style={{ fontSize: 15, color: 'var(--muted)', marginTop: 8, maxWidth: 620, margin: '8px auto 0', lineHeight: 1.6 }}>
          Generare un modello 3D consuma energia. Non lo nascondiamo: lo contiamo pezzo per pezzo,
          e progettiamo il sistema per consumare il meno possibile.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: 16, marginTop: 44, maxWidth: 1000, margin: '44px auto 0' }}>
        <GlassCard style={{ padding: 26, textAlign: 'center' }}>
          <ScanLine size={20} color="var(--cyan)" style={{ margin: '0 auto' }} />
          <div style={{ fontFamily: 'var(--mono)', fontSize: 30, fontWeight: 700, color: 'var(--ink)', marginTop: 12 }}>~28 Wh</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6, lineHeight: 1.5 }}>
            per un pezzo <b style={{ color: 'var(--ink)' }}>mai visto prima</b><br />(~12 g CO₂, come 100 m in auto)
          </div>
        </GlassCard>
        <GlassCard style={{ padding: 26, textAlign: 'center' }}>
          <Database size={20} color="var(--cyan)" style={{ margin: '0 auto' }} />
          <div style={{ fontFamily: 'var(--mono)', fontSize: 30, fontWeight: 700, color: 'var(--cyan)', marginTop: 12 }}>~2 Wh</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6, lineHeight: 1.5 }}>
            per un pezzo <b style={{ color: 'var(--ink)' }}>già in archivio</b><br />(~1 g CO₂ — 14× meno)
          </div>
        </GlassCard>
        <GlassCard style={{ padding: 26 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.06em', color: 'var(--muted)' }}>
            SCENARIO · 10.000 RIPARAZIONI/ANNO A MILANO
          </div>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 13.5, color: 'var(--muted)' }}>Infrastruttura AI di Teseo</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 700, color: 'var(--cyan)' }}>~35 kg CO₂</span>
            </div>
            <div style={{ height: 3, background: 'rgba(9,15,5,.10)' }}>
              <div style={{ width: '2%', height: '100%', background: 'var(--cyan)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 13.5, color: 'var(--muted)' }}>Smaltire quegli stessi oggetti</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>~200 t CO₂</span>
            </div>
            <div style={{ height: 3, background: 'rgba(9,15,5,.10)' }}>
              <div style={{ width: '100%', height: '100%', background: 'var(--muted)' }} />
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted-2)', marginTop: 12, lineHeight: 1.5 }}>
            L&apos;impronta digitale dell&apos;intera piattaforma vale lo 0,02% della CO₂ che evita.
          </p>
        </GlassCard>
      </div>

      {/* Come teniamo bassi i consumi */}
      <div style={{ maxWidth: 1000, margin: '40px auto 0' }}>
        <h3 style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 16 }}>
          Come teniamo bassi i consumi
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {[
            { icon: <Database size={16} color="var(--cyan)" />, t: 'Caching dei modelli', d: 'Un pezzo generato una volta serve tutti quelli dopo.' },
            { icon: <Ruler size={16} color="var(--cyan)" />, t: 'Modello giusto', d: 'AI piccola per i casi facili, grande solo quando serve.' },
            { icon: <Smartphone size={16} color="var(--cyan)" />, t: 'Scan sul telefono', d: 'Riconoscimento on-device invece che in cloud.' },
            { icon: <Leaf size={16} color="var(--cyan)" />, t: 'Green hosting', d: 'Data center a energia rinnovabile.' },
            { icon: <UserCheck size={16} color="var(--cyan)" />, t: 'Fallback umano', d: 'Tentativi limitati: se l’AI non ce la fa, passa a una persona.' },
          ].map((x, i) => (
            <div key={i} style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', padding: 16, background: 'var(--glass)' }}>
              {x.icon}
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginTop: 8 }}>{x.t}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, lineHeight: 1.5 }}>{x.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Circolarità: le 4 strade ── */
function CircularSection() {
  const paths = [
    {
      icon: <Wrench size={20} color="var(--cyan)" />,
      n: 'R4',
      t: 'Ripara',
      d: 'La strada maestra: un intervento minimo prolunga la vita dell’oggetto intero. È qui che Teseo lavora.',
    },
    {
      icon: <Share2 size={20} color="var(--cyan)" />,
      n: 'R3',
      t: 'Riusa e condividi',
      d: 'Seconda mano, donazione, tool library: l’oggetto riparato può continuare a vivere anche altrove.',
    },
    {
      icon: <RefreshCcw size={20} color="var(--cyan)" />,
      n: 'R7',
      t: 'Riusa in altro modo',
      d: 'Parti di oggetti dismessi diventano componenti di oggetti nuovi, con una funzione diversa.',
    },
    {
      icon: <Recycle size={20} color="var(--cyan)" />,
      n: 'R8',
      t: 'Ricicla in filamento',
      d: 'A fine vita il pezzo si tritura e torna materia prima per la stampa successiva. Il loop si chiude.',
    },
  ]

  return (
    <section style={{ padding: '80px 6%' }}>
      <div style={{ textAlign: 'center' }}>
        <SectionTag>ECONOMIA CIRCOLARE</SectionTag>
        <h2 style={{ fontSize: 34, fontWeight: 700, marginTop: 14, color: 'var(--ink)' }}>
          Riparare è solo l&apos;inizio del cerchio
        </h2>
        <p style={{ fontSize: 15, color: 'var(--muted)', marginTop: 8, maxWidth: 600, margin: '8px auto 0', lineHeight: 1.6 }}>
          Nella scala della circolarità, più un oggetto resta com&apos;è, meglio è.
          Teseo parte dalla riparazione e accompagna il materiale fino all&apos;ultimo giro.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 44, maxWidth: 1000, margin: '44px auto 0' }}>
        {paths.map((p, i) => (
          <GlassCard key={i} style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {p.icon}
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted-2)' }}>{p.n}</span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginTop: 14 }}>{p.t}</h3>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginTop: 6 }}>{p.d}</p>
          </GlassCard>
        ))}
      </div>

      {/* Honesty box */}
      <div
        style={{
          maxWidth: 1000,
          margin: '20px auto 0',
          border: '1px dashed var(--line-2)',
          borderRadius: 'var(--radius)',
          padding: '18px 24px',
          display: 'flex',
          gap: 14,
          alignItems: 'flex-start',
        }}
      >
        <Leaf size={18} color="var(--cyan)" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.65 }}>
          <b style={{ color: 'var(--ink)' }}>Onestà prima di tutto:</b> il PLA è compostabile solo in impianti industriali,
          non nel giardino di casa. E la stampa FDM non è a impatto zero: microplastiche ed emissioni VOC esistono e le tracciamo.
          Non promettiamo miracoli — misuriamo, pubblichiamo e miglioriamo.
        </p>
      </div>
    </section>
  )
}

function CtaSection() {
  const navigate = useNavigate()
  return (
    <section style={{ padding: '30px 6% 100px', textAlign: 'center' }}>
      <h2 style={{ fontSize: 34, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.02em' }}>
        Il tuo impatto, misurato a ogni riparazione.
      </h2>
      <p style={{ fontSize: 15, color: 'var(--muted)', marginTop: 10 }}>
        Nella dashboard vedi kg di CO₂ evitati, euro risparmiati e oggetti salvati. I tuoi, non quelli di uno spot.
      </p>
      <div style={{ marginTop: 26, display: 'flex', gap: 12, justifyContent: 'center' }}>
        <PrimaryButton style={{ height: 50, fontSize: 15, padding: '0 30px' }} onClick={() => navigate('/app/dashboard')}>
          Inizia a misurare
        </PrimaryButton>
        <GhostButton style={{ height: 50 }} onClick={() => navigate('/community')}>
          Scopri la community &rarr;
        </GhostButton>
      </div>
    </section>
  )
}

export default function Impatto() {
  return (
    <div className="landing-scroll">
      <LandingNav />
      <PageHero
        tag="IMPATTO"
        title={<>Riparare è la scelta migliore.<br />Anche nei numeri.</>}
        subtitle="Economica, affettiva e ambientale insieme. Ecco cosa cambia davvero quando un pezzo da 30 grammi non trascina più in discarica un oggetto da 10 chili."
      />
      <CaseStudySection />
      <DigitalFootprintSection />
      <CircularSection />
      <CtaSection />
      <LandingFooter />
    </div>
  )
}
