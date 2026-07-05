import { useEffect, useRef, useState } from 'react'
import { Package, ScanLine, Cpu, Users, MapPin, Recycle, CheckCircle2, Activity, TrendingDown, XCircle, Sparkles } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroFloatingMeshes from '../components/HeroFloatingMeshes'
import PrimaryButton from '../components/PrimaryButton'
import GlassCard from '../components/GlassCard'
import { LandingNav, LandingFooter, SectionTag, GhostButton } from '../components/LandingChrome'
import PrintBuildScroll from '../components/PrintBuildScroll'

gsap.registerPlugin(ScrollTrigger)

/* ────────────────── SLOT WORD ────────────────── */
const SLOT_WORDS = ['rinnova', 'riusa', 'sistema', 'ripara', 'rigenera', 'recupera']

// Slot-machine roll: verbs scroll vertically. A clone of the first word is
// appended so the last→first wrap rolls forward, then snaps back with no transition.
function SlotWord() {
  const [i, setI] = useState(0)
  const [anim, setAnim] = useState(true)
  const words = [...SLOT_WORDS, SLOT_WORDS[0]]

  useEffect(() => {
    const t = setInterval(() => setI(v => v + 1), 1800)
    return () => clearInterval(t)
  }, [])

  // after the wrap-to-clone transition, jump back to 0 without animating
  useEffect(() => {
    if (i > SLOT_WORDS.length - 1) {
      const t = setTimeout(() => { setAnim(false); setI(0) }, 600)
      return () => clearTimeout(t)
    }
    if (!anim) requestAnimationFrame(() => requestAnimationFrame(() => setAnim(true)))
  }, [i, anim])

  return (
    <span
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        height: '1.1em',
        overflow: 'hidden',
        verticalAlign: 'bottom',
        color: 'var(--cyan)',
      }}
    >
      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          transform: `translateY(${-i * 1.1}em)`,
          transition: anim ? 'transform .55s cubic-bezier(.16,1,.3,1)' : 'none',
        }}
      >
        {words.map((w, k) => (
          <span key={k} style={{ height: '1.1em', lineHeight: '1.1em' }}>{w}</span>
        ))}
      </span>
    </span>
  )
}

/* ────────────────── HERO ────────────────── */
function HeroSection() {
  const navigate = useNavigate()
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        padding: '0 6%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100svh - 90px)',
      }}
    >
      {/* Mesh di oggetti riconoscibili che fluttuano attorno al titolo */}
      <HeroFloatingMeshes />

      {/* Colonna centrale */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 680,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 28,
        }}
      >
        {/* Headline — il payoff del progetto */}
        <h1
          className="anim-fadeUp-d1"
          style={{
            fontSize: 'clamp(34px, 4.6vw, 58px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-.02em',
            color: 'var(--ink)',
          }}
        >
          Unisciti alla rete che <SlotWord />
        </h1>

        {/* Subtitle */}
        <p
          className="anim-fadeUp-d2"
          style={{
            fontSize: 17,
            color: 'var(--muted)',
            lineHeight: 1.6,
            maxWidth: 500,
          }}
        >
          Un oggetto non deve finire in discarica per un pezzo da 30 grammi.
          Inquadralo con il telefono: l&apos;AI ricostruisce il ricambio, un FabLab
          vicino a te lo stampa, tu lo ritiri sotto casa.
        </p>

        {/* CTA row */}
        <div className="anim-fadeUp-d3" style={{ display: 'flex', flexDirection: 'row', gap: 12, justifyContent: 'center' }}>
          <PrimaryButton style={{ height: 48, fontSize: 15, padding: '0 28px' }} onClick={() => navigate('/app/dashboard')}>
            <ScanLine size={18} />
            Ripara il tuo primo oggetto
          </PrimaryButton>
          <GhostButton style={{ height: 48, padding: '0 22px' }} onClick={() => navigate('/fablab/dashboard')}>
            Per i FabLab &rarr;
          </GhostButton>
        </div>
      </div>

    </section>
  )
}

/* ────────────────── PROBLEMA (dati survey) ────────────────── */
function ProblemBar() {
  const stats = [
    { value: '80%', label: 'ha cercato un ricambio e non l’ha trovato' },
    { value: '43%', label: 'ha buttato un oggetto intero per un singolo pezzo' },
    { value: '56%', label: 'non sa nemmeno cosa sia un FabLab' },
    { value: '48%', label: 'proverebbe Teseo da subito' },
  ]

  return (
    <div
      style={{
        padding: '40px 6% 12px',
        borderTop: '1px solid var(--line)',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {stats.map((s, i) => (
          <div
            key={i}
            style={{
              textAlign: 'center',
              padding: '16px 20px',
              borderRight: i < stats.length - 1 ? '1px solid var(--line)' : 'none',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 30,
                fontWeight: 700,
                color: 'var(--ink)',
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: 12.5,
                color: 'var(--muted)',
                marginTop: 6,
                lineHeight: 1.45,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
      <p
        style={{
          textAlign: 'center',
          fontFamily: 'var(--mono)',
          fontSize: 10.5,
          color: 'var(--muted-2)',
          letterSpacing: '0.04em',
          padding: '18px 0 12px',
        }}
      >
        INDAGINE TESEO 2026 &middot; 100 RISPOSTE &middot; MILANO, HINTERLAND E LOMBARDIA
      </p>
    </div>
  )
}

/* ────────────────── TRUSTED BY ────────────────── */
function TrustedBySection() {
  // ponytail: nessun asset logo — wordmark testuali con stili diversi per simulare i marchi; sostituire con SVG quando esistono
  const logos: { name: string; style: React.CSSProperties }[] = [
    { name: 'NABA', style: { fontWeight: 800, letterSpacing: '0.22em' } },
    { name: 'Polifactory', style: { fontWeight: 600, fontStyle: 'italic' } },
    { name: 'WeMake', style: { fontWeight: 700, letterSpacing: '-0.02em' } },
    { name: 'OpenDot', style: { fontFamily: 'var(--mono)', fontWeight: 600 } },
    { name: 'FabLab Milano', style: { fontWeight: 500, letterSpacing: '0.10em', textTransform: 'uppercase', fontSize: 15 } },
    { name: 'IDEAS BIT FACTORY', style: { fontFamily: 'var(--mono)', fontWeight: 500, fontSize: 14, letterSpacing: '0.06em' } },
    { name: 'Vectorealism', style: { fontWeight: 300, fontSize: 21 } },
    { name: 'Stecca 3.0', style: { fontWeight: 800, fontStyle: 'italic' } },
    { name: 'MUSE FabLab', style: { fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: 14 } },
    { name: 'Talent Garden', style: { fontWeight: 700 } },
  ]

  return (
    <section style={{ padding: '72px 6%' }}>
      <p
        style={{
          textAlign: 'center',
          fontFamily: 'var(--mono)',
          fontSize: 12,
          letterSpacing: '0.08em',
          color: 'var(--muted)',
          marginBottom: 44,
        }}
      >
        La rete di FabLab, scuole e maker space che stampa con Teseo
      </p>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          columnGap: 72,
          rowGap: 40,
          maxWidth: 1100,
          margin: '0 auto',
        }}
      >
        {logos.map((l) => (
          <span key={l.name} style={{ fontSize: 19, color: 'var(--ink)', opacity: 0.82, whiteSpace: 'nowrap', ...l.style }}>
            {l.name}
          </span>
        ))}
      </div>
    </section>
  )
}

/* ────────────────── DUE DESTINI ────────────────── */
function TwoPathsSection() {
  const withoutSteps = ['Si rompe un pezzo', 'Il ricambio non esiste più', 'Ricompri tutto', 'L’oggetto va in discarica']
  const withSteps = ['Si rompe un pezzo', 'Lo scansioni col telefono', 'Un FabLab lo stampa vicino a te', 'L’oggetto torna a vivere']

  const flow = (steps: string[], accent: boolean) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              width: 22,
              height: 22,
              borderRadius: '50%',
              flexShrink: 0,
              display: 'grid',
              placeItems: 'center',
              background: accent ? 'var(--cyan)' : 'transparent',
              color: accent ? '#fff' : 'var(--muted)',
              border: accent ? 'none' : '1px solid var(--line-2)',
            }}
          >
            {i + 1}
          </span>
          <span style={{ fontSize: 14.5, color: i === steps.length - 1 ? 'var(--ink)' : 'var(--muted)', fontWeight: i === steps.length - 1 ? 600 : 400 }}>
            {s}
          </span>
        </div>
      ))}
    </div>
  )

  return (
    <section style={{ padding: '100px 6%' }}>
      <div style={{ textAlign: 'center' }}>
        <SectionTag>DUE DESTINI</SectionTag>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginTop: 16, color: 'var(--ink)' }}>
          Stesso oggetto, due finali diversi
        </h2>
        <p style={{ fontSize: 16, color: 'var(--muted)', marginTop: 8, maxWidth: 560, margin: '8px auto 0' }}>
          Una sedia da ufficio con un componente rotto da 30 grammi. Ecco cosa succede oggi — e cosa succede con Teseo.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 52, maxWidth: 960, margin: '52px auto 0' }}>
        {/* Senza Teseo */}
        <div
          style={{
            border: '1px dashed var(--line-2)',
            borderRadius: 'var(--radius)',
            padding: 28,
            background: 'transparent',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <XCircle size={18} color="var(--muted)" />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.08em', color: 'var(--muted)' }}>
              SENZA TESEO
            </span>
          </div>
          {flow(withoutSteps, false)}
          <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--line)' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>~20 kg CO₂</span>
          </div>
        </div>

        {/* Con Teseo */}
        <div
          className="glass-panel"
          style={{
            padding: 28,
            border: '1px solid var(--line-2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Recycle size={18} color="var(--cyan)" />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.08em', color: 'var(--cyan)' }}>
              CON TESEO
            </span>
          </div>
          {flow(withSteps, true)}
          <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--line)' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 700, color: 'var(--cyan)' }}>~0,5 kg CO₂</span>
          </div>
        </div>
      </div>

      <p style={{ textAlign: 'center', marginTop: 28 }}>
        <Link
          to="/impatto"
          style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--cyan)', textDecoration: 'none', letterSpacing: '0.04em' }}
        >
          VEDI TUTTI I NUMERI DELL&apos;IMPATTO &rsaquo;
        </Link>
      </p>
    </section>
  )
}

/* ────────────────── HOW IT WORKS (scroll orizzontale pinnato) ────────────────── */
function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      icon: <ScanLine size={64} color="var(--lemongrass)" strokeWidth={1.2} />,
      title: 'Scansiona il pezzo',
      desc: 'Inquadra l’oggetto rotto con la fotocamera. L’AI lo riconosce: non serve saper modellare.',
      stats: [
        { v: '30s', l: 'Per la scansione' },
        { v: '98%', l: 'Precisione' },
        { v: '0', l: 'Competenze richieste' },
      ],
      intel: ['Computer vision zero-shot sull’oggetto', 'Funziona anche coi ricambi fuori produzione'],
    },
    {
      num: '02',
      icon: <Cpu size={64} color="var(--lemongrass)" strokeWidth={1.2} />,
      title: 'L’AI ricostruisce',
      desc: 'Il modello 3D del ricambio viene generato e corretto nelle tolleranze. Se serve, la community dà una mano.',
      stats: [
        { v: '±0,1mm', l: 'Tolleranza' },
        { v: '2Wh', l: 'Da archivio' },
        { v: 'v3', l: 'Versioning community' },
      ],
      intel: ['Ogni modello ha uno storico verificabile', 'I maker validano e certificano i file'],
    },
    {
      num: '03',
      icon: <MapPin size={64} color="var(--lemongrass)" strokeWidth={1.2} />,
      title: 'Un FabLab lo stampa',
      desc: 'La rete trova il produttore più adatto per materiale, tecnologia e distanza. Bio-materiali dove possibile.',
      stats: [
        { v: '<2km', l: 'Distanza media' },
        { v: 'PETG', l: 'Riciclato' },
        { v: '<48h', l: 'Alla consegna' },
      ],
      intel: ['Matchmaking su materiale, tecnologia e coda', 'Se un nodo è pieno, il carico si ridistribuisce'],
    },
    {
      num: '04',
      icon: <Recycle size={64} color="var(--lemongrass)" strokeWidth={1.2} />,
      title: 'Ritiri e chiudi il cerchio',
      desc: 'Ritiro a mano o hub di quartiere. A fine vita il pezzo si tritura e torna filamento per la prossima stampa.',
      stats: [
        { v: '−95%', l: 'CO₂ vs ricomprare' },
        { v: '~10€', l: 'Costo medio' },
        { v: 'R7', l: 'Riciclo → filamento' },
      ],
      intel: ['Ritiro sotto casa o negli hub di quartiere', 'Il materiale rientra nel ciclo produttivo'],
    },
  ]

  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return
    const scroller = section.closest('.landing-scroll') as HTMLElement | null

    const tween = gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        scroller: scroller ?? undefined,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        invalidateOnRefresh: true,
      },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    /* 300vh di scroll verticale: la viewport resta pinnata (sticky) e il track scorre in orizzontale */
    <section ref={sectionRef} id="come-funziona" style={{ height: '300vh', position: 'relative' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 40,
        }}
      >
        {/* Griglia contenuta nella sezione (fondo sito bianco) */}
        <div className="land-grid" />
        {/* Header */}
        <div style={{ padding: '0 6%' }}>
          <SectionTag>COME FUNZIONA</SectionTag>
          <h2 style={{ fontSize: 36, fontWeight: 700, marginTop: 16, color: 'var(--ink)' }}>
            Dal guasto al ritiro in 4 passi
          </h2>
          <p style={{ fontSize: 16, color: 'var(--muted)', marginTop: 8 }}>
            Nessuna stampante, nessuna competenza tecnica. Solo il telefono.
          </p>
        </div>

        {/* Track orizzontale */}
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: 24,
            padding: '0 6%',
            alignItems: 'stretch',
            width: 'max-content',
            willChange: 'transform',
          }}
        >
          {steps.map((step, i) => (
            <div
              key={i}
              className="glass-panel"
              style={{
                width: 'min(72vw, 960px)',
                flexShrink: 0,
                display: 'flex',
                overflow: 'hidden',
                padding: 0,
              }}
            >
              {/* Pannello visual scuro */}
              <div
                style={{
                  flex: '0 0 36%',
                  background: 'var(--forest)',
                  position: 'relative',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    backgroundImage:
                      'linear-gradient(rgba(178,235,118,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(178,235,118,.07) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                  }}
                />
                {step.icon}
                <span
                  style={{
                    position: 'absolute',
                    top: 18,
                    left: 20,
                    fontFamily: 'var(--mono)',
                    fontSize: 11,
                    letterSpacing: '0.15em',
                    color: 'var(--lemongrass)',
                    opacity: 0.7,
                  }}
                >
                  PASSO {step.num} / 04
                </span>
                <span
                  style={{
                    position: 'absolute',
                    bottom: 14,
                    right: 20,
                    fontFamily: 'var(--mono)',
                    fontSize: 44,
                    fontWeight: 700,
                    color: 'rgba(178,235,118,.18)',
                  }}
                >
                  {step.num}
                </span>
              </div>

              {/* Contenuto */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '28px 32px' }}>
                  <h3 style={{ fontSize: 24, fontWeight: 700, color: 'var(--ink)' }}>{step.title}</h3>
                  <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.6, marginTop: 10, maxWidth: 480 }}>
                    {step.desc}
                  </p>
                </div>

                {/* Celle stat, stile registro */}
                <div style={{ display: 'flex', borderTop: '1px solid var(--line)' }}>
                  {step.stats.map((s, j) => (
                    <div
                      key={j}
                      style={{
                        flex: 1,
                        padding: '18px 12px',
                        textAlign: 'center',
                        borderRight: j < step.stats.length - 1 ? '1px solid var(--line)' : 'none',
                      }}
                    >
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 26, fontWeight: 700, color: 'var(--ink)' }}>
                        {s.v}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--mono)',
                          fontSize: 10.5,
                          color: 'var(--muted)',
                          marginTop: 6,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {s.l}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dettagli */}
                <div style={{ borderTop: '1px solid var(--line)', padding: '18px 32px 24px', marginTop: 'auto' }}>
                  <span
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 10.5,
                      letterSpacing: '0.08em',
                      color: 'var(--muted-2)',
                      textTransform: 'uppercase',
                    }}
                  >
                    In dettaglio
                  </span>
                  {step.intel.map((line, j) => (
                    <p key={j} style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.6, marginTop: j === 0 ? 8 : 2 }}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p style={{ padding: '0 6%' }}>
          <Link
            to="/come-funziona"
            style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--cyan)', textDecoration: 'none', letterSpacing: '0.04em' }}
          >
            IL PERCORSO COMPLETO, PASSO PER PASSO &rsaquo;
          </Link>
        </p>
      </div>
    </section>
  )
}

/* ────────────────── FEATURES ────────────────── */
function FeaturesSection() {
  const features = [
    {
      icon: <ScanLine size={20} color="var(--cyan)" />,
      title: 'Riconoscimento istantaneo',
      desc: 'La computer vision identifica l’oggetto dalla fotocamera e recupera o genera il modello 3D del pezzo. Anche per i ricambi che i produttori non fabbricano più.',
    },
    {
      icon: <Users size={20} color="var(--cyan)" />,
      title: 'L’AI genera, le persone validano',
      desc: 'Ogni modello ha uno storico: la community di maker verifica, corregge e certifica i file. Il catalogo cresce come bene comune.',
    },
    {
      icon: <TrendingDown size={20} color="var(--cyan)" />,
      title: 'Dashboard d’impatto',
      desc: 'Per ogni riparazione vedi kg di CO₂ evitati, euro risparmiati e oggetti salvati dalla discarica. Numeri veri, non greenwashing.',
    },
    {
      icon: <Activity size={20} color="var(--cyan)" />,
      title: 'Rete resiliente',
      desc: 'Se un FabLab è pieno o chiude, il carico si distribuisce sugli altri nodi. Nessuna dipendenza dal produttore originale del pezzo.',
    },
  ]

  return (
    <section
      style={{
        padding: '80px 6%',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <SectionTag>PERCHÉ TESEO</SectionTag>
        <h2 style={{ fontSize: 34, fontWeight: 700, marginTop: 12, color: 'var(--ink)' }}>
          Riparare, senza doverci capire qualcosa.
        </h2>
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 16,
          marginTop: 48,
        }}
      >
        {features.map((f, i) => (
          <GlassCard
            key={i}
            className="feature-card"
            style={{
              padding: 28,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              cursor: 'default',
              transition: 'border-color .2s',
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                background: 'var(--glass-2)',
                border: '1px solid var(--line)',
                borderRadius: 12,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              {f.icon}
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>{f.title}</h3>
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>{f.desc}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  )
}

/* ────────────────── ASSISTENTE AI (anteprima orchestratore) ────────────────── */
// Conversazione scriptata: anteprima del TeseoAssistant vero che vive in /app/dashboard.
const AIP_MONO: React.CSSProperties = { fontFamily: 'var(--mono)' }

function AssistantPreviewSection() {
  const navigate = useNavigate()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const scroller = section.closest('.landing-scroll') as HTMLElement | null

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, scroller: scroller ?? undefined, start: 'top 65%', once: true },
      })
      tl.from('.aip-reveal', { y: 26, opacity: 0, duration: 0.7, stagger: 0.09, ease: 'power3.out' })
        .from('.aip-panel', { y: 44, opacity: 0, duration: 0.85, ease: 'power3.out' }, 0.15)
        .from('.aip-m1', { y: 10, opacity: 0, duration: 0.4, ease: 'power2.out' }, 1.0)
        .fromTo('.aip-typing', { opacity: 0 }, { opacity: 1, duration: 0.25 }, 1.5)
        .to('.aip-typing', { opacity: 0, duration: 0.2 }, 2.5)
        .from('.aip-m2', { y: 10, opacity: 0, duration: 0.4, ease: 'power2.out' }, 2.6)
        .fromTo('.aip-typing', { opacity: 0 }, { opacity: 1, duration: 0.25 }, 3.3)
        .to('.aip-typing', { opacity: 0, duration: 0.2 }, 4.2)
        .from('.aip-m3', { y: 10, opacity: 0, duration: 0.4, ease: 'power2.out' }, 4.3)
        .from('.aip-chips', { y: 8, opacity: 0, duration: 0.35, ease: 'power2.out' }, 4.75)
    }, section)

    return () => ctx.revert()
  }, [])

  const bubble = (user: boolean): React.CSSProperties => ({
    maxWidth: '86%', padding: '11px 14px', fontSize: 14, lineHeight: 1.55,
    borderRadius: user ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
    background: user ? 'var(--forest)' : 'var(--glass-2)',
    color: user ? '#fff' : 'var(--ink)',
    border: user ? 'none' : '1px solid var(--line)',
    alignSelf: user ? 'flex-end' : 'flex-start',
  })

  return (
    <section ref={sectionRef} style={{ padding: '100px 6%' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.1fr',
          gap: 64,
          alignItems: 'center',
          maxWidth: 1180,
          margin: '0 auto',
        }}
      >
        {/* Copy */}
        <div>
          <div className="aip-reveal"><SectionTag>ASSISTENTE AI</SectionTag></div>
          <h2 className="aip-reveal" style={{ fontSize: 34, fontWeight: 700, marginTop: 12, color: 'var(--ink)', lineHeight: 1.15 }}>
            Un orchestratore che fa tutto il giro per te.
          </h2>
          <p className="aip-reveal" style={{ fontSize: 15.5, color: 'var(--muted)', lineHeight: 1.65, marginTop: 18 }}>
            Descrivi il pezzo rotto in linguaggio naturale: l’AI lo cerca nell’archivio della
            community, sceglie il produttore disponibile più vicino e prepara ordine e
            preventivo. Tu confermi, la rete stampa.
          </p>
          <div className="aip-reveal" style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 22 }}>
            {['Ricerca nell’archivio', 'Matchmaking produttori', 'Ordine e tracking'].map(s => (
              <div key={s} style={{ ...AIP_MONO, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--cyan)' }} />
                {s}
              </div>
            ))}
          </div>
          <div className="aip-reveal" style={{ marginTop: 30 }}>
            <PrimaryButton onClick={() => navigate('/app/dashboard')}>Provalo nella demo</PrimaryButton>
          </div>
        </div>

        {/* Chat mockup — stessa UI del TeseoAssistant in /app */}
        <div
          className="aip-panel"
          style={{
            background: 'var(--glass)', border: '1px solid var(--line-2)',
            borderRadius: 'var(--radius)', overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(9,15,5,.14)',
          }}
        >
          <div style={{ background: 'var(--forest)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(178,235,118,.14)', display: 'grid', placeItems: 'center', color: 'var(--lemongrass)' }}>
              <Sparkles size={15} />
            </span>
            <div>
              <div style={{ color: '#fff', fontSize: 13.5, fontWeight: 600 }}>Teseo AI</div>
              <div style={{ ...AIP_MONO, color: 'var(--lemongrass)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Orchestratore · online
              </div>
            </div>
          </div>

          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 11, minHeight: 340 }}>
            <div className="aip-m1" style={bubble(true)}>
              Si è rotto il gancio dell’appendiabiti in ingresso. Si può rifare?
            </div>
            <div className="aip-m2" style={bubble(false)}>
              Trovato: <b>«Gancio modulare da parete» v2.3</b> nell’archivio community —
              validato dai maker, 1.842 download, ★ 4.9.
            </div>
            <div className="aip-m3" style={bubble(false)}>
              FabLab Bovisa è disponibile a 4,1 km: in PLA costa <b style={AIP_MONO}>~€ 4</b>,
              pronto domani entro le 12. Preparo l’ordine?
            </div>
            <div className="aip-chips" style={{ display: 'flex', gap: 7 }}>
              {['Sì, procedi', 'Vedi alternative'].map(c => (
                <span key={c} style={{ ...AIP_MONO, fontSize: 11, fontWeight: 600, letterSpacing: '0.03em', padding: '6px 11px', borderRadius: 7, border: '1px solid var(--line-2)', color: 'var(--cyan)' }}>
                  {c} ›
                </span>
              ))}
            </div>
            <div className="aip-typing" style={{ display: 'flex', gap: 4, padding: '11px 13px', borderRadius: '12px 12px 12px 4px', background: 'var(--glass-2)', border: '1px solid var(--line)', width: 'fit-content', opacity: 0 }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--muted)', animation: 'blink 1s infinite', animationDelay: `${i * 0.18}s` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ────────────────── FOR FABLAB / MAKER ────────────────── */
// Feed "live" della rete: la sequenza racconta ordine → matchmaking → assegnazione
// → slicing AI → coda, cioè esattamente le tre feature elencate a sinistra.
const FABLAB_FEED = [
  { label: 'Nuovo ordine', msg: 'Un vicino cerca un cardine finestra' },
  { label: 'Matchmaking', msg: '3 laboratori attivi entro 2 km' },
  { label: 'È tuo', msg: 'Assegnato a te · 820 m · €14', match: true },
  { label: 'Slicing AI', msg: 'File pronto al posto tuo · 1h 20m' },
  { label: 'In coda', msg: 'Parte da sola sulla tua stampante' },
]

function ForFablabSection() {
  const navigate = useNavigate()
  const sectionRef = useRef<HTMLElement>(null)
  const featureList = [
    'Ordini in automatico dal matchmaking di rete',
    'Compenso e reputazione per ogni stampa validata',
    'Slicing AI integrato e certificazione qualità',
  ]

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const scroller = section.closest('.landing-scroll') as HTMLElement | null

    const ctx = gsap.context(() => {
      // Loop del feed: le righe compaiono una alla volta, la riga MATCH pulsa,
      // poi tutto sfuma e riparte (paused: parte a fine entrance).
      const lines = gsap.utils.toArray<HTMLElement>('.ffl-line')
      const offsets = [0, 0.9, 1.8, 3.2, 4.0]
      const loop = gsap.timeline({ repeat: -1, repeatDelay: 2, paused: true })
      lines.forEach((line, i) => {
        loop.fromTo(line, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, offsets[i])
      })
      loop.fromTo(
        '.ffl-match',
        { boxShadow: '0 0 0 0 rgba(178,235,118,.4)' },
        { boxShadow: '0 0 0 14px rgba(178,235,118,0)', duration: 1.2, ease: 'power2.out' },
        offsets[2] + 0.15,
      )
      loop.to(lines, { opacity: 0, y: -6, duration: 0.4, stagger: 0.06, ease: 'power1.in' }, '+=2.6')

      // Entrance on scroll
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, scroller: scroller ?? undefined, start: 'top 65%', once: true },
      })
      tl.from('.ffl-reveal', { y: 26, opacity: 0, duration: 0.7, stagger: 0.09, ease: 'power3.out' })
        .from('.ffl-panel', { y: 48, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.2)
        .call(() => loop.play(), [], 1.0)

      gsap.to('.ffl-dot', { opacity: 0.25, repeat: -1, yoyo: true, duration: 0.8, ease: 'power1.inOut' })
      gsap.to('.ffl-cursor', { opacity: 0, repeat: -1, yoyo: true, duration: 0.5, ease: 'steps(1)' })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="fablab"
      ref={sectionRef}
      className="land-block land-block--forest"
      style={{ padding: '110px 6%' }}
    >
      {/* Griglia blueprint su scuro */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(rgba(178,235,118,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(178,235,118,.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div style={{ position: 'relative', display: 'flex', gap: 60, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Left */}
        <div style={{ flex: '1 1 380px', display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 480 }}>
          <span
            className="ffl-reveal"
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 12,
              letterSpacing: '0.08em',
              color: '#b2eb76',
              textTransform: 'uppercase',
            }}
          >
            Per FabLab e Maker
          </span>
          <h2
            className="ffl-reveal"
            style={{ fontSize: 'clamp(28px, 3.2vw, 40px)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-.01em', color: '#fff' }}
          >
            Hai una stampante?<br />
            <span style={{ color: '#b2eb76' }}>Sei già un nodo della rete.</span>
          </h2>
          <p className="ffl-reveal" style={{ fontSize: 15, color: 'rgba(255,255,255,.6)', lineHeight: 1.7 }}>
            Unisciti alla rete di FabLab e maker che stampano i ricambi per chi non può più trovarli. Ogni stampa ti dà reputazione, compenso e la soddisfazione di salvare un oggetto dalla discarica.
          </p>

          <div className="ffl-reveal" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {featureList.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 size={16} color="#b2eb76" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,.85)' }}>{item}</span>
              </div>
            ))}
          </div>

          <button
            className="ffl-reveal"
            onClick={() => navigate('/fablab/dashboard')}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(178,235,118,.12)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            style={{
              alignSelf: 'flex-start',
              marginTop: 6,
              height: 46,
              padding: '0 26px',
              borderRadius: 12,
              border: '1px solid rgba(178,235,118,.5)',
              background: 'transparent',
              color: '#b2eb76',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'background .2s',
            }}
          >
            Registra il tuo laboratorio &rarr;
          </button>
        </div>

        {/* Right — feed live della rete */}
        <div className="ffl-panel" style={{ flex: '1 1 420px', position: 'relative' }}>
          <div
            style={{
              position: 'relative',
              border: '1px solid rgba(178,235,118,.25)',
              borderRadius: 16,
              padding: 20,
              background: 'rgba(178,235,118,.04)',
            }}
          >
            {/* Tick angolari lemongrass */}
            {(['tl', 'tr', 'bl', 'br'] as const).map(c => (
              <div
                key={c}
                style={{
                  position: 'absolute',
                  width: 14,
                  height: 14,
                  opacity: 0.6,
                  top: c[0] === 't' ? -1 : undefined,
                  bottom: c[0] === 'b' ? -1 : undefined,
                  left: c[1] === 'l' ? -1 : undefined,
                  right: c[1] === 'r' ? -1 : undefined,
                  borderTop: c[0] === 't' ? '1px solid #b2eb76' : undefined,
                  borderBottom: c[0] === 'b' ? '1px solid #b2eb76' : undefined,
                  borderLeft: c[1] === 'l' ? '1px solid #b2eb76' : undefined,
                  borderRight: c[1] === 'r' ? '1px solid #b2eb76' : undefined,
                }}
              />
            ))}

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  color: 'rgba(255,255,255,.55)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Rete Teseo · Live
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="ffl-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#b2eb76' }} />
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.08em', color: '#b2eb76' }}>
                  ONLINE
                </span>
              </span>
            </div>

            {/* Feed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {FABLAB_FEED.map((line, i) => (
                <div
                  key={i}
                  className={`ffl-line${line.match ? ' ffl-match' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '13px 14px',
                    borderRadius: 10,
                    opacity: 0,
                    ...(line.match
                      ? { background: 'rgba(178,235,118,.1)', border: '1px solid rgba(178,235,118,.4)' }
                      : { background: 'rgba(178,235,118,.04)', border: '1px solid rgba(178,235,118,.12)' }),
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 11,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      flexShrink: 0,
                      minWidth: 108,
                      color: line.match ? '#18280e' : '#b2eb76',
                      background: line.match ? '#b2eb76' : 'rgba(178,235,118,.1)',
                      border: '1px solid rgba(178,235,118,.35)',
                      borderRadius: 6,
                      padding: '4px 8px',
                      textAlign: 'center',
                    }}
                  >
                    {line.label}
                  </span>
                  <span style={{ fontSize: 15, color: line.match ? '#b2eb76' : 'rgba(255,255,255,.8)' }}>{line.msg}</span>
                </div>
              ))}
              <span className="ffl-cursor" style={{ fontFamily: 'var(--mono)', color: '#b2eb76', paddingLeft: 14 }}>▮</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ────────────────── FINAL CTA ────────────────── */
function FinalCtaSection() {
  const navigate = useNavigate()
  return (
    <section
      className="land-block land-block--sage"
      style={{
        padding: '100px 6%',
        textAlign: 'center',
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 400,
          background: 'radial-gradient(circle, rgba(63,115,8,.08), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <h2
        style={{
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: '-.02em',
          color: 'var(--ink)',
          position: 'relative',
        }}
      >
        L&apos;80% dei ricambi non si trova.<br />Il tuo si stampa.
      </h2>
      <p style={{ fontSize: 16, color: 'var(--muted)', marginTop: 12, position: 'relative' }}>
        Gratis per i primi 3 mesi. Nessuna carta di credito, nessuna stampante richiesta.
      </p>

      <div
        style={{
          marginTop: 32,
          display: 'flex',
          flexDirection: 'row',
          gap: 12,
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <PrimaryButton style={{ height: 52, fontSize: 16, padding: '0 32px' }} onClick={() => navigate('/app/dashboard')}>
          <Package size={20} />
          Ripara il primo oggetto
        </PrimaryButton>
        <GhostButton style={{ height: 52, padding: '0 28px' }} onClick={() => navigate('/fablab/dashboard')}>
          Sono un FabLab &rarr;
        </GhostButton>
      </div>
    </section>
  )
}

/* ────────────────── PAGE ────────────────── */
export default function Landing() {
  return (
    <div className="landing-scroll">
      <LandingNav />
      {/* Blocco sage: hero + dati survey */}
      <div className="land-block land-block--sage">
        <HeroSection />
        <ProblemBar />
      </div>
      <TrustedBySection />
      <HowItWorksSection />
      <PrintBuildScroll />
      <TwoPathsSection />
      <FeaturesSection />
      <AssistantPreviewSection />
      <ForFablabSection />
      <FinalCtaSection />
      <LandingFooter />
    </div>
  )
}
