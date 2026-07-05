import { useEffect, useRef, useState } from 'react'
import { Search, ScanLine, Users, Recycle, CheckCircle2, TrendingDown, XCircle, Sparkles, Activity, ArrowRight } from 'lucide-react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroFloatingMeshes from '../components/HeroFloatingMeshes'
import PrimaryButton from '../components/PrimaryButton'
import { LandingNav, LandingFooter, SectionTag, scrollToSection } from '../components/LandingChrome'
import PrintBuildScroll from '../components/PrintBuildScroll'
import StreamText from '../components/StreamText'
import FablabMap from '../components/FablabMap'
import { milanoFablabs } from '../mock/fablab-milano'

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
  const [query, setQuery] = useState('')
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

        {/* CTA */}
        <div className="anim-fadeUp-d3" style={{ display: 'flex', justifyContent: 'center' }}>
          <PrimaryButton style={{ height: 48, fontSize: 15, padding: '0 28px' }} onClick={() => navigate('/onboarding')}>
            <ScanLine size={18} />
            Ripara il tuo primo oggetto
          </PrimaryButton>
        </div>

        {/* Ricerca pezzo: entrata alternativa alla scansione */}
        <form
          className="anim-fadeUp-d4"
          onSubmit={e => { e.preventDefault(); navigate('/onboarding') }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: 'min(480px, 100%)',
            height: 52,
            padding: '0 8px 0 18px',
            background: 'var(--glass)',
            border: '1px solid var(--line-2)',
            borderRadius: 100,
            boxShadow: '0 8px 30px rgba(9,15,5,.06)',
          }}
        >
          <Search size={17} color="var(--muted-2)" style={{ flexShrink: 0 }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder='Che pezzo ti serve? Prova “manico moka”…'
            style={{
              flex: 1,
              minWidth: 0,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: 'inherit',
              fontSize: 14.5,
              color: 'var(--ink)',
            }}
          />
          <button
            type="submit"
            aria-label="Cerca"
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              border: 'none',
              background: 'var(--forest)',
              color: 'var(--lemongrass)',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <ArrowRight size={17} />
          </button>
        </form>
      </div>

    </section>
  )
}

/* ────────────────── CLAIM (il dato più forte della survey) ────────────────── */
function ProblemClaim() {
  return (
    <div style={{ padding: '72px 6% 64px', borderTop: '1px solid var(--line)', textAlign: 'center' }}>
      <h2
        style={{
          fontSize: 'clamp(28px, 3.6vw, 46px)',
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: '-.02em',
          color: 'var(--ink)',
          maxWidth: 820,
          margin: '0 auto',
        }}
      >
        L&apos;<span style={{ fontFamily: 'var(--mono)', color: 'var(--cyan)' }}>82%</span> di chi cerca un
        ricambio non lo trova.
      </h2>
      <p style={{ fontSize: 17, color: 'var(--muted)', marginTop: 14, maxWidth: 560, margin: '14px auto 0', lineHeight: 1.6 }}>
        E l&apos;oggetto finisce in discarica per un pezzo da pochi grammi.
        Da oggi niente paura: il tuo ricambio si stampa a due passi da casa.
      </p>
    </div>
  )
}

/* ────────────────── PARTNER (marquee loghi) ────────────────── */
function PartnerMarquee() {
  // ponytail: nessun asset logo — wordmark testuali; sostituire con SVG quando esistono
  const logos: { name: string; style: React.CSSProperties }[] = [
    { name: 'Bialetti', style: { fontWeight: 800, fontStyle: 'italic' } },
    { name: "De'Longhi", style: { fontWeight: 700, letterSpacing: '0.02em' } },
    { name: 'SMEG', style: { fontWeight: 800, letterSpacing: '0.22em' } },
    { name: 'Alessi', style: { fontWeight: 300, fontSize: 22, letterSpacing: '0.06em' } },
    { name: 'Artemide', style: { fontWeight: 600, fontStyle: 'italic' } },
    { name: 'Kartell', style: { fontWeight: 800, letterSpacing: '-0.02em' } },
    { name: 'Imetec', style: { fontFamily: 'var(--mono)', fontWeight: 600 } },
    { name: 'BTicino', style: { fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: 15 } },
    { name: 'Chicco', style: { fontWeight: 700, fontStyle: 'italic' } },
    { name: 'Foppapedretti', style: { fontWeight: 500, letterSpacing: '0.08em', fontSize: 15 } },
  ]

  const row = (key: string) => (
    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 72, paddingRight: 72, flexShrink: 0 }}>
      {logos.map(l => (
        <span key={l.name} style={{ fontSize: 19, color: 'var(--ink)', opacity: 0.75, whiteSpace: 'nowrap', ...l.style }}>
          {l.name}
        </span>
      ))}
    </div>
  )

  return (
    <section style={{ padding: '64px 0' }}>
      <p
        style={{
          textAlign: 'center',
          fontFamily: 'var(--mono)',
          fontSize: 12,
          letterSpacing: '0.08em',
          color: 'var(--muted)',
          marginBottom: 40,
          padding: '0 6%',
          textTransform: 'uppercase',
        }}
      >
        Le aziende che hanno già caricato i loro ricambi ufficiali su Teseo
      </p>
      {/* Marquee auto-scroll, con fade laterale nello stesso colore del fondo */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="anim-marquee" style={{ display: 'flex', width: 'max-content' }}>
          {row('a')}
          {row('b')}
        </div>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 140, background: 'linear-gradient(90deg, var(--white), rgba(255,255,255,0))', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 140, background: 'linear-gradient(270deg, var(--white), rgba(255,255,255,0))', pointerEvents: 'none' }} />
      </div>
    </section>
  )
}

/* ────────────────── COME FUNZIONA (card con foto, scroll orizzontale pinnato) ────────────────── */
function HowItWorksSection() {
  const steps = [
    {
      photo: '/landing/step-scan.jpg',
      title: 'Scansiona l’oggetto',
      desc: 'Inquadra il pezzo rotto con la fotocamera del telefono. Non serve saper modellare.',
    },
    {
      photo: '/landing/step-recognize.jpg',
      title: 'Riconoscimento del pezzo',
      desc: 'L’AI riconosce l’oggetto e recupera il modello 3D del ricambio dall’archivio.',
    },
    {
      photo: '/landing/step-fablab.jpg',
      title: 'Scegli il FabLab più vicino',
      desc: 'La rete ti propone il laboratorio giusto per materiale, distanza e disponibilità.',
    },
    {
      photo: '/landing/step-ritira.jpg',
      title: 'Ritira e ripara',
      desc: 'Passi a prendere il pezzo sotto casa e l’oggetto torna a vivere.',
    },
  ]

  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  // Scroll verticale → track orizzontale (viewport pinnata sticky)
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
    /* 300vh di scroll verticale: la viewport resta pinnata e il track scorre in orizzontale */
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
        <div className="land-grid" />

        {/* Header */}
        <div style={{ padding: '0 6%', position: 'relative' }}>
          <SectionTag>COME FUNZIONA</SectionTag>
          <h2 style={{ fontSize: 36, fontWeight: 700, marginTop: 16, color: 'var(--ink)' }}>
            Dal guasto al ritiro in 4 passi
          </h2>
          <p style={{ fontSize: 16, color: 'var(--muted)', marginTop: 8 }}>
            Nessuna stampante, nessuna competenza tecnica. Solo il telefono.
          </p>
        </div>

        {/* Track orizzontale — card foto + titolo + sottotitolo */}
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
                width: 'min(58vw, 760px)',
                flexShrink: 0,
                display: 'flex',
                overflow: 'hidden',
                padding: 0,
              }}
            >
              {/* Pannello foto */}
              <div style={{ flex: '0 0 44%', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={step.photo}
                  alt={step.title}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: 14,
                    left: 16,
                    fontFamily: 'var(--mono)',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    background: 'rgba(255,255,255,.92)',
                    border: '1px solid var(--line)',
                    borderRadius: 6,
                    padding: '4px 10px',
                    color: 'var(--cyan)',
                  }}
                >
                  PASSO {String(i + 1).padStart(2, '0')} / 04
                </span>
              </div>

              {/* Contenuto: solo titolo + sottotitolo */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '38px 36px', minHeight: 300 }}>
                <span
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 40,
                    fontWeight: 700,
                    color: 'rgba(63,115,8,.18)',
                    lineHeight: 1,
                    marginBottom: 14,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink)' }}>{step.title}</h3>
                <p style={{ fontSize: 15.5, color: 'var(--muted)', lineHeight: 1.65, marginTop: 12, maxWidth: 380 }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p style={{ padding: '0 6%', position: 'relative' }}>
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

/* ────────────────── ASSISTENTE AI (cella bento) ────────────────── */
// Sequenza "powered by AI": il messaggio utente appare, l'AI mostra una riga di
// reasoning in shimmer, poi la risposta streama token per token come un LLM.
// step: 0 idle · 1 user · 2 think1 · 3 stream m2 · 4 think2 · 5 stream m3 · 6 chips
const AIP_MONO: React.CSSProperties = { fontFamily: 'var(--mono)' }

const AIP_SCRIPT = {
  user: 'Si è rotto il gancio dell’appendiabiti in ingresso. Si può rifare?',
  think1: 'Cerco nell’archivio della community…',
  m2: 'Trovato: «Gancio modulare da parete» v2.3 — validato dai maker, ★ 4.9.',
  think2: 'Confronto i produttori vicino a te…',
  m3: 'FabLab Milano, 4,1 km: in PLA costa ~€ 4, pronto domani. Preparo l’ordine?',
}

function AssistantCell({ started }: { started: boolean }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (started) setStep(s => Math.max(s, 1))
  }, [started])

  // Gli step "user" e "think" avanzano a tempo; quelli in streaming avanzano via onDone.
  useEffect(() => {
    const delays: Record<number, number> = { 1: 700, 2: 1600, 4: 1600 }
    if (!(step in delays)) return
    const t = setTimeout(() => setStep(s => s + 1), delays[step])
    return () => clearTimeout(t)
  }, [step])

  const bubble = (user: boolean): React.CSSProperties => ({
    maxWidth: '90%', padding: '10px 13px', fontSize: 13.5, lineHeight: 1.55,
    borderRadius: user ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
    background: user ? 'var(--forest)' : 'var(--glass-2)',
    color: user ? '#fff' : 'var(--ink)',
    border: user ? 'none' : '1px solid var(--line)',
    alignSelf: user ? 'flex-end' : 'flex-start',
  })

  return (
    <div className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ background: 'var(--forest)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(178,235,118,.14)', display: 'grid', placeItems: 'center', color: 'var(--lemongrass)' }}>
          <Sparkles size={14} />
        </span>
        <div>
          <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>Teseo AI</div>
          <div style={{ ...AIP_MONO, color: 'var(--lemongrass)', fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Orchestratore · online
          </div>
        </div>
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {step >= 1 && (
          <div style={{ ...bubble(true), animation: 'fadeUp .45s cubic-bezier(.4,0,.2,1) both' }}>
            {AIP_SCRIPT.user}
          </div>
        )}
        {step >= 3 && (
          <div style={bubble(false)}>
            <StreamText text={AIP_SCRIPT.m2} onDone={() => setStep(s => Math.max(s, 4))} />
          </div>
        )}
        {step >= 5 && (
          <div style={bubble(false)}>
            <StreamText text={AIP_SCRIPT.m3} onDone={() => setStep(s => Math.max(s, 6))} />
          </div>
        )}
        {(step === 2 || step === 4) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 2px' }}>
            <Sparkles size={13} color="var(--cyan)" style={{ animation: 'blink 1.5s infinite' }} />
            <span className="ai-shimmer" style={{ fontSize: 12, fontWeight: 500 }}>
              {step === 2 ? AIP_SCRIPT.think1 : AIP_SCRIPT.think2}
            </span>
          </div>
        )}
        {step >= 6 && (
          <div style={{ display: 'flex', gap: 7, animation: 'fadeUp .45s cubic-bezier(.4,0,.2,1) both' }}>
            {['Sì, procedi', 'Vedi alternative'].map(c => (
              <span key={c} style={{ ...AIP_MONO, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.03em', padding: '6px 10px', borderRadius: 7, border: '1px solid var(--line-2)', color: 'var(--cyan)' }}>
                {c} ›
              </span>
            ))}
          </div>
        )}
        <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--line)', display: 'flex', gap: 9, alignItems: 'center' }}>
          <span style={{ ...AIP_MONO, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted-2)' }}>
            Assistente AI incluso
          </span>
        </div>
      </div>
    </div>
  )
}

/* ────────────────── DUE DESTINI + PERCHÉ TESEO (bento) ────────────────── */
function ImpactBentoSection() {
  const navigate = useNavigate()
  const sectionRef = useRef<HTMLElement>(null)
  const [aiStarted, setAiStarted] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const scroller = section.closest('.landing-scroll') as HTMLElement | null
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, scroller: scroller ?? undefined, start: 'top 70%', once: true },
      })
      tl.from('.bento-cell', { y: 30, opacity: 0, duration: 0.65, stagger: 0.07, ease: 'power3.out' })
        .call(() => setAiStarted(true), [], 0.7)
    }, section)
    return () => ctx.revert()
  }, [])

  const mono: React.CSSProperties = { fontFamily: 'var(--mono)' }
  const label: React.CSSProperties = { ...mono, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }

  // Caso sedia (ricerca Miro): ricomprare 75 € / ~20 kg CO₂ vs ricambio stampato 5 € / ~0,5 kg
  const paths = [
    { icon: <XCircle size={15} color="var(--muted)" />, tag: 'RICOMPRARE', cost: '75 €', co2: '~20 kg CO₂', bar: 100, accent: false },
    { icon: <Recycle size={15} color="var(--cyan)" />, tag: 'RIPARARE CON TESEO', cost: '5 €', co2: '~0,5 kg CO₂', bar: 7, accent: true },
  ]

  // Dati dal CSV survey (n=100, Lombardia, giu 2026)
  const stats = [
    { v: '82%', l: 'ha cercato un ricambio e non l’ha trovato' },
    { v: '43%', l: 'ha buttato un oggetto intero per un singolo pezzo' },
    { v: '64%', l: 'pagherebbe 5–30 € per rimettere in funzione un oggetto' },
  ]

  const features = [
    { icon: <ScanLine size={16} color="var(--cyan)" />, t: 'Riconoscimento istantaneo', d: 'La computer vision identifica il pezzo dalla fotocamera.' },
    { icon: <Users size={16} color="var(--cyan)" />, t: 'La community valida', d: 'Ogni modello ha uno storico verificato dai maker.' },
    { icon: <TrendingDown size={16} color="var(--cyan)" />, t: 'Impatto misurabile', d: 'CO₂ evitata ed euro risparmiati, per ogni pezzo.' },
    { icon: <Activity size={16} color="var(--cyan)" />, t: 'Rete resiliente', d: 'Se un nodo è pieno, il carico si ridistribuisce.' },
  ]

  return (
    <section id="impatto" ref={sectionRef} style={{ padding: '100px 6%' }}>
      <div style={{ textAlign: 'center' }}>
        <SectionTag>DUE DESTINI</SectionTag>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginTop: 16, color: 'var(--ink)' }}>
          Stesso oggetto, due finali diversi
        </h2>
        <p style={{ fontSize: 16, color: 'var(--muted)', marginTop: 8, maxWidth: 560, margin: '8px auto 0' }}>
          Una sedia con un componente rotto da 30 grammi. I numeri di cosa succede oggi — e di cosa succede con Teseo.
        </p>
      </div>

      <div
        className="impact-bento"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateAreas: `
            "cost cost ai ai"
            "s0 s1 ai ai"
            "s2 test test why"
          `,
          gap: 14,
          marginTop: 52,
          maxWidth: 1180,
          margin: '52px auto 0',
        }}
      >
        {/* Differenza di costi */}
        <div className="glass-panel bento-cell" style={{ gridArea: 'cost', padding: 26, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <span style={label}>Differenza di costi · caso sedia</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, justifyContent: 'center' }}>
            {paths.map(p => (
              <div key={p.tag}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {p.icon}
                  <span style={{ ...mono, fontSize: 11, letterSpacing: '0.08em', color: p.accent ? 'var(--cyan)' : 'var(--muted)' }}>{p.tag}</span>
                  <span style={{ flex: 1 }} />
                  <span style={{ ...mono, fontSize: 22, fontWeight: 700, color: p.accent ? 'var(--cyan)' : 'var(--ink)' }}>{p.cost}</span>
                </div>
                <div style={{ height: 8, background: 'rgba(9,15,5,.07)', borderRadius: 4, marginTop: 8, overflow: 'hidden' }}>
                  <div style={{ width: `${p.bar}%`, height: '100%', borderRadius: 4, background: p.accent ? 'var(--cyan)' : 'var(--line-2)' }} />
                </div>
                <div style={{ ...mono, fontSize: 11, color: 'var(--muted)', marginTop: 5 }}>{p.co2}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 18, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
            <span style={{ ...mono, fontSize: 15, fontWeight: 700, color: 'var(--cyan)' }}>−70 €</span>
            <span style={{ ...mono, fontSize: 15, fontWeight: 700, color: 'var(--cyan)' }}>−95% CO₂</span>
            <span style={{ fontSize: 12.5, color: 'var(--muted)', alignSelf: 'center' }}>per ogni pezzo riparato invece che ricomprato</span>
          </div>
        </div>

        {/* Assistente AI (merge della vecchia sezione dedicata) */}
        <div className="bento-cell" style={{ gridArea: 'ai', display: 'flex', flexDirection: 'column' }}>
          <AssistantCell started={aiStarted} />
        </div>

        {/* Dati survey */}
        {stats.map((s, i) => (
          <div key={i} className="glass-panel bento-cell" style={{ gridArea: `s${i}`, padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ ...mono, fontSize: 34, fontWeight: 700, color: 'var(--ink)' }}>{s.v}</span>
            <div>
              <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.5 }}>{s.l}</p>
              <span style={{ ...mono, fontSize: 9.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted-2)' }}>Survey · 100 risposte · 2026</span>
            </div>
          </div>
        ))}

        {/* Testimonianza */}
        <div className="glass-panel bento-cell" style={{ gridArea: 'test', padding: 22, display: 'flex', gap: 18, alignItems: 'center' }}>
          <img
            src="/landing/testimonial.jpg"
            alt="Marco, Milano"
            style={{ width: 84, height: 84, borderRadius: 14, objectFit: 'cover', flexShrink: 0, border: '1px solid var(--line-2)' }}
          />
          <div>
            <p style={{ fontSize: 14.5, color: 'var(--ink)', lineHeight: 1.55, fontWeight: 500 }}>
              «Il frullatore era da buttare per una ventola da 2 grammi. Il FabLab me l&apos;ha stampata in un giorno: 4 euro.»
            </p>
            <span style={{ ...mono, fontSize: 11, color: 'var(--muted)', marginTop: 8, display: 'block' }}>Marco · Milano · utente Teseo</span>
          </div>
        </div>

        {/* Perché Teseo (merge della vecchia sezione features) */}
        <div className="glass-panel bento-cell" style={{ gridArea: 'why', padding: 22, display: 'flex', flexDirection: 'column', gap: 13 }}>
          <span style={label}>Perché Teseo</span>
          {features.map(f => (
            <div key={f.t} style={{ display: 'flex', gap: 10, alignItems: 'center' }} title={f.d}>
              <span style={{ flexShrink: 0 }}>{f.icon}</span>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink)' }}>{f.t}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA a impatto, dopo la bento */}
      <div style={{ maxWidth: 1180, margin: '14px auto 0' }}>
        <button
          className="bento-cell"
          onClick={() => navigate('/impatto')}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(0.995)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
          style={{
            width: '100%',
            border: 'none',
            cursor: 'pointer',
            background: 'var(--forest)',
            borderRadius: 'var(--radius)',
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            color: '#fff',
            fontFamily: 'inherit',
            transition: 'transform .25s cubic-bezier(.4,0,.2,1)',
          }}
        >
          <TrendingDown size={20} color="var(--lemongrass)" />
          <span style={{ fontSize: 17, fontWeight: 700 }}>Tutti i numeri dell&apos;impatto: CO₂, euro, circolarità</span>
          <span style={{ flex: 1 }} />
          <span style={{ ...mono, fontSize: 13, color: 'var(--lemongrass)', letterSpacing: '0.04em' }}>VAI A IMPATTO →</span>
        </button>
      </div>
    </section>
  )
}

/* ────────────────── FABLAB / PARTNER / COMMUNITY (mappa + numeri) ────────────────── */
const NETWORK_NUMBERS = [
  { v: String(milanoFablabs.length), l: 'FabLab partner nella rete' },
  { v: '2.410', l: 'Utenti che stampano' },
  { v: '318', l: 'Maker attivi in community' },
]

function CommunityNetworkSection() {
  const navigate = useNavigate()
  const featureList = [
    'Ordini in automatico dal matchmaking di rete',
    'Compenso e reputazione per ogni stampa validata',
    'Slicing AI integrato e certificazione qualità',
  ]

  return (
    <section
      id="community"
      className="land-block land-block--forest"
      style={{ padding: '100px 6%' }}
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
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 12,
              letterSpacing: '0.08em',
              color: '#b2eb76',
              textTransform: 'uppercase',
            }}
          >
            FabLab · Partner · Community
          </span>
          <h2
            style={{ fontSize: 'clamp(28px, 3.2vw, 40px)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-.01em', color: '#fff' }}
          >
            Hai una stampante?<br />
            <span style={{ color: '#b2eb76' }}>Sei già un nodo della rete.</span>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.6)', lineHeight: 1.7 }}>
            Unisciti alla rete di FabLab e maker che stampano i ricambi per chi non può più trovarli. Ogni stampa ti dà reputazione, compenso e la soddisfazione di salvare un oggetto dalla discarica.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {featureList.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 size={16} color="#b2eb76" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,.85)' }}>{item}</span>
              </div>
            ))}
          </div>

          <button
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

        {/* Right — mappa reale dei punti FabLab + numeri della rete */}
        <div style={{ flex: '1 1 420px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div
            style={{
              position: 'relative',
              height: 380,
              borderRadius: 16,
              overflow: 'hidden',
              border: '1px solid rgba(178,235,118,.3)',
            }}
          >
            {/* I 30 FabLab reali di Milano e provincia (da KMZ) */}
            <FablabMap
              pins={milanoFablabs.map(f => ({ name: f.name, lng: f.lng, lat: f.lat, compact: true }))}
              zoom={10.4}
            />
            <span
              style={{
                position: 'absolute',
                top: 12,
                left: 12,
                zIndex: 2,
                fontFamily: 'var(--mono)',
                fontSize: 10,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: 'var(--forest)',
                color: 'var(--lemongrass)',
                borderRadius: 6,
                padding: '5px 10px',
              }}
            >
              La rete a Milano · live
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {NETWORK_NUMBERS.map(n => (
              <div key={n.l} style={{ border: '1px solid rgba(178,235,118,.25)', borderRadius: 12, padding: '14px 16px', background: 'rgba(178,235,118,.05)' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 24, fontWeight: 700, color: '#b2eb76' }}>{n.v}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', marginTop: 4, lineHeight: 1.4 }}>{n.l}</div>
              </div>
            ))}
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
        L&apos;82% dei ricambi non si trova.<br />Il tuo si stampa.
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
        <PrimaryButton style={{ height: 52, fontSize: 16, padding: '0 32px' }} onClick={() => navigate('/onboarding')}>
          <ScanLine size={20} />
          Ripara il primo oggetto
        </PrimaryButton>
      </div>
    </section>
  )
}

/* ────────────────── PAGE ────────────────── */
export default function Landing() {
  const { hash } = useLocation()

  // One-page: /#sezione arriva anche da altre pagine → scroll al mount
  useEffect(() => {
    if (!hash) return
    const t = setTimeout(() => scrollToSection(hash.slice(1)), 120)
    return () => clearTimeout(t)
  }, [hash])

  return (
    <div className="landing-scroll">
      <LandingNav />
      {/* Blocco sage: hero + claim survey */}
      <div className="land-block land-block--sage">
        <HeroSection />
        <ProblemClaim />
      </div>
      <PartnerMarquee />
      <HowItWorksSection />
      <PrintBuildScroll />
      <ImpactBentoSection />
      <CommunityNetworkSection />
      <FinalCtaSection />
      <LandingFooter />
    </div>
  )
}
