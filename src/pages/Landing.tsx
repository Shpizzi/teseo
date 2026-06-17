import { Package, MapPin, Upload, Activity, CheckCircle2, Cpu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import HeroViewer3D from '../components/HeroViewer3D'
import PrimaryButton from '../components/PrimaryButton'
import GlassCard from '../components/GlassCard'

/* ────────────────── NAVBAR ────────────────── */
function LandingNav() {
  const navigate = useNavigate()
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(10,35,66,.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--line)',
        padding: '0 6%',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        gap: 40,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <Package size={20} color="var(--cyan)" />
        <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '0.12em', color: 'var(--ink)' }}>
          TESEO
        </span>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 28, flex: 1 }}>
        {['Come funziona', 'FabLab', 'Community', 'Prezzi'].map((label, i) => (
          <a
            key={i}
            href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
            style={{
              color: 'var(--muted)',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'color .2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--ink)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted)' }}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <a
          href="#"
          onClick={e => { e.preventDefault(); navigate('/app/dashboard') }}
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 13,
            color: 'var(--muted)',
            textDecoration: 'none',
            transition: 'color .2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--ink)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted)' }}
        >
          Accedi
        </a>
        <PrimaryButton className="" style={{ height: 38, padding: '0 18px', fontSize: 13 }} onClick={() => navigate('/app/dashboard')}>
          Inizia gratis
        </PrimaryButton>
      </div>
    </nav>
  )
}

/* ────────────────── HERO ────────────────── */
function HeroSection() {
  const navigate = useNavigate()
  return (
    <section
      id="hero"
      style={{
        padding: '0 6%',
        display: 'flex',
        alignItems: 'center',
        gap: 60,
        minHeight: '100svh',
      }}
    >
      {/* Left column */}
      <div
        style={{
          flex: 1,
          maxWidth: 580,
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        {/* Tag pill */}
        <div
          className="anim-fadeUp"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            border: '1px solid var(--line-2)',
            background: 'rgba(174,227,249,.06)',
            borderRadius: 100,
            padding: '7px 16px',
            alignSelf: 'flex-start',
          }}
        >
          <span
            className="anim-pulse"
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--cyan)',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 11,
              color: 'var(--ink)',
              letterSpacing: '0.05em',
            }}
          >
            INDUSTRIA 4.0 &middot; MANIFATTURA DISTRIBUITA
          </span>
        </div>

        {/* Headline */}
        <h1
          className="anim-fadeUp-d1"
          style={{
            fontSize: 'clamp(36px, 5vw, 62px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-.02em',
            color: 'var(--ink)',
          }}
        >
          La stampa <span style={{ color: 'var(--cyan)' }}>3D</span> di quartiere.
        </h1>

        {/* Subtitle */}
        <p
          className="anim-fadeUp-d2"
          style={{
            fontSize: 17,
            color: 'var(--muted)',
            lineHeight: 1.6,
            maxWidth: 480,
          }}
        >
          Carica il tuo modello, scegli un FabLab vicino e ritira l&apos;oggetto stampato. Slicing AI incluso.
        </p>

        {/* CTA row */}
        <div className="anim-fadeUp-d3" style={{ display: 'flex', flexDirection: 'row', gap: 12 }}>
          <PrimaryButton style={{ height: 48, fontSize: 15, padding: '0 28px' }} onClick={() => navigate('/app/dashboard')}>
            <Package size={18} />
            Inizia a stampare
          </PrimaryButton>
          <button
            onClick={() => navigate('/fablab/dashboard')}
            style={{
              border: '1px solid var(--line-2)',
              background: 'transparent',
              color: 'var(--cyan)',
              borderRadius: 100,
              padding: '0 22px',
              height: 48,
              fontFamily: 'inherit',
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
              transition: 'background .2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(174,227,249,.08)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
          >
            Per i FabLab &rarr;
          </button>
        </div>

        {/* Mini stats row */}
        <div
          className="anim-fadeUp-d4"
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 24,
            paddingTop: 8,
          }}
        >
          {[
            { num: '2.400+', label: 'stampe' },
            { num: '12', label: 'FabLab attivi' },
            { num: '4.8★', label: 'rating' },
          ].map((stat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              {i > 0 && (
                <div
                  style={{
                    width: 1,
                    height: 16,
                    background: 'var(--line)',
                    flexShrink: 0,
                    marginRight: -12,
                  }}
                />
              )}
              <span
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 12,
                  color: 'var(--muted)',
                }}
              >
                <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{stat.num}</span>{' '}
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right column — 3D scene */}
      <div
        className="anim-fadeIn"
        style={{
          flex: 1,
          position: 'relative',
          minHeight: 520,
        }}
      >
        <HeroViewer3D />

        {/* Reg marks */}
        <div className="reg-tl" />
        <div className="reg-tr" />
        <div className="reg-bl" />
        <div className="reg-br" />

        {/* Caption */}
        <span
          style={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--mono)',
            fontSize: 10,
            letterSpacing: '0.2em',
            color: 'var(--cyan)',
            opacity: 0.7,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          FIG. 01 &mdash; TESEO PLATFORM &middot; SCALE 1:1
        </span>

        {/* Float card 1 — bottom-left */}
        <div
          className="anim-float"
          style={{
            position: 'absolute',
            bottom: 48,
            left: -20,
            animationDuration: '7s',
          }}
        >
          <div
            style={{
              background: 'rgba(8,29,58,.75)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid var(--line-2)',
              borderRadius: 16,
              padding: '14px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              minWidth: 180,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={16} color="var(--cyan)" />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Pronto al ritiro</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>
                Ricambio cardine finestra
              </span>
              <span className="status-pill sp-ready" style={{ fontSize: 10 }}>Pronto</span>
            </div>
          </div>
        </div>

        {/* Float card 2 — top-right */}
        <div
          className="anim-float"
          style={{
            position: 'absolute',
            top: 80,
            right: -20,
            animationDuration: '8s',
            animationDelay: '1s',
          }}
        >
          <div
            style={{
              background: 'rgba(8,29,58,.75)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid var(--line-2)',
              borderRadius: 16,
              padding: '14px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              minWidth: 180,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={16} color="var(--cyan)" />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>In stampa</span>
            </div>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--cyan)' }}>
              84% &middot; ETA 2h 10m
            </span>
            <div
              style={{
                height: 4,
                background: 'rgba(174,227,249,.14)',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: '84%',
                  background: 'var(--cyan)',
                  borderRadius: 2,
                }}
              />
            </div>
          </div>
        </div>

        {/* Float card 3 — bottom-right */}
        <div
          className="anim-float"
          style={{
            position: 'absolute',
            bottom: 120,
            right: -30,
            animationDuration: '9s',
            animationDelay: '2s',
          }}
        >
          <div
            style={{
              background: 'rgba(8,29,58,.75)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid var(--line-2)',
              borderRadius: 16,
              padding: '14px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              minWidth: 160,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 10,
                color: 'var(--muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              AI Slicing
            </span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
              Bilanciato &middot; 20% infill
            </span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>
              Prusa MK4 &middot; 02
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ────────────────── STATS BAR ────────────────── */
function StatsBar() {
  const stats = [
    { value: '2.400+', label: 'Oggetti stampati' },
    { value: '12', label: 'FabLab attivi' },
    { value: '< 48h', label: 'Consegna media' },
    { value: '4.8★', label: 'Soddisfazione media' },
  ]

  return (
    <div
      style={{
        padding: '32px 6%',
        background: 'rgba(174,227,249,.04)',
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
      }}
    >
      {stats.map((s, i) => (
        <div
          key={i}
          style={{
            textAlign: 'center',
            padding: '16px',
            borderRight: i < stats.length - 1 ? '1px solid var(--line)' : 'none',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--ink)',
            }}
          >
            {s.value}
          </div>
          <div
            style={{
              fontSize: 11,
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginTop: 4,
            }}
          >
            {s.label}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ────────────────── HOW IT WORKS ────────────────── */
function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      icon: <Upload size={28} color="var(--cyan)" />,
      title: 'Carica il modello',
      desc: 'STL, OBJ, 3MF. Carica il file o scansiona l\'oggetto con la fotocamera del telefono.',
    },
    {
      num: '02',
      icon: <MapPin size={28} color="var(--cyan)" />,
      title: 'Scegli il FabLab',
      desc: 'Trova il produttore più vicino filtrato per materiale, tecnologia e disponibilità.',
    },
    {
      num: '03',
      icon: <Package size={28} color="var(--cyan)" />,
      title: 'Ritira l\'oggetto',
      desc: 'Ricevi la notifica quando è pronto e passa a ritirarlo. Oppure richiedi la spedizione.',
    },
  ]

  return (
    <section id="come-funziona" style={{ padding: '100px 6%' }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <span
          style={{
            display: 'inline-block',
            fontFamily: 'var(--mono)',
            fontSize: 11,
            border: '1px solid var(--line-2)',
            borderRadius: 100,
            padding: '6px 16px',
            color: 'var(--cyan)',
            letterSpacing: '0.08em',
          }}
        >
          COME FUNZIONA
        </span>
        <h2
          style={{
            fontSize: 36,
            fontWeight: 700,
            marginTop: 16,
            color: 'var(--ink)',
          }}
        >
          Dall&apos;idea all&apos;oggetto in 3 passi
        </h2>
        <p style={{ fontSize: 16, color: 'var(--muted)', marginTop: 8 }}>
          Nessuna stampante richiesta. Solo il tuo modello.
        </p>
      </div>

      {/* Steps */}
      <div style={{ position: 'relative', marginTop: 60 }}>
        {/* Connector line */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: 1,
            background:
              'linear-gradient(90deg, transparent 15%, var(--line-2) 35%, var(--line-2) 65%, transparent 85%)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
        <div style={{ display: 'flex', gap: 24, position: 'relative', zIndex: 1 }}>
          {steps.map((step, i) => (
            <GlassCard
              key={i}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '36px 28px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
                position: 'relative',
              }}
            >
              {/* Step number badge */}
              <div
                style={{
                  position: 'absolute',
                  top: -18,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'var(--cyan)',
                  color: '#08233f',
                  fontFamily: 'var(--mono)',
                  fontSize: 14,
                  fontWeight: 700,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                {step.num}
              </div>

              {/* Icon */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: 'var(--glass-2)',
                  border: '1px solid var(--line)',
                  borderRadius: 16,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                {step.icon}
              </div>

              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>
                {step.desc}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ────────────────── FEATURES ────────────────── */
function FeaturesSection() {
  const features = [
    {
      icon: <Upload size={20} color="var(--cyan)" />,
      title: 'Upload istantaneo',
      desc: 'Carica STL, OBJ o 3MF in secondi. Supporto drag-and-drop e scansione da mobile.',
    },
    {
      icon: <MapPin size={20} color="var(--cyan)" />,
      title: 'FabLab di quartiere',
      desc: 'Trova il produttore più vicino con filtri per materiale (PLA, ABS, Resina, Nylon) e tecnologia (FDM, SLA, SLS).',
    },
    {
      icon: <Cpu size={20} color="var(--cyan)" />,
      title: 'AI Slicing',
      desc: "L'intelligenza artificiale ottimizza orientazione, supporti e parametri di stampa per ogni oggetto.",
    },
    {
      icon: <Activity size={20} color="var(--cyan)" />,
      title: 'Tracciamento live',
      desc: 'Segui l\'avanzamento della stampa con il viewer 3D integrato e ricevi notifiche in tempo reale.',
    },
  ]

  return (
    <section
      style={{
        padding: '80px 6%',
        background: 'rgba(174,227,249,.02)',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <span
          style={{
            display: 'inline-block',
            fontFamily: 'var(--mono)',
            fontSize: 11,
            border: '1px solid var(--line-2)',
            borderRadius: 100,
            padding: '6px 16px',
            color: 'var(--cyan)',
            letterSpacing: '0.08em',
          }}
        >
          FUNZIONALITÀ
        </span>
        <h2 style={{ fontSize: 34, fontWeight: 700, marginTop: 12, color: 'var(--ink)' }}>
          Tutto quello che ti serve, integrato.
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

/* ────────────────── FOR FABLAB ────────────────── */
function ForFablabSection() {
  const navigate = useNavigate()
  const featureList = [
    'Dashboard ordini con priorità e scadenze',
    'Slicing AI integrato con preset configurabili',
    'Chat diretta con i clienti',
  ]

  const orders = [
    { dot: 'pdot-active', num: '#TES-0041', name: 'Staffa motore CNC', status: 'sp-print', statusLabel: 'In stampa' },
    { dot: 'pdot-idle', num: '#TES-0040', name: 'Cover Raspberry Pi 4', status: 'sp-new', statusLabel: 'In coda' },
    { dot: 'pdot-active', num: '#TES-0039', name: 'Tappo filettato M22', status: 'sp-ready', statusLabel: 'Pronto' },
  ]

  return (
    <section id="fablab" style={{ padding: '80px 6%', display: 'flex', gap: 60, alignItems: 'center' }}>
      {/* Left */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 480 }}>
        <span
          style={{
            display: 'inline-block',
            fontFamily: 'var(--mono)',
            fontSize: 11,
            border: '1px solid var(--line-2)',
            borderRadius: 100,
            padding: '6px 16px',
            color: 'var(--cyan)',
            letterSpacing: '0.08em',
            alignSelf: 'flex-start',
          }}
        >
          PER I FABLAB
        </span>
        <h2 style={{ fontSize: 34, fontWeight: 700, color: 'var(--ink)' }}>
          Hai un laboratorio? Entra nella rete.
        </h2>
        <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.6 }}>
          Gestisci ordini, stampanti e coda di stampa da un&apos;unica dashboard. Slicing assistito da AI.
          Notifiche automatiche ai clienti.
        </p>

        {/* Feature list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {featureList.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle2 size={16} color="var(--cyan)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 14, color: 'var(--ink)' }}>{item}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/fablab/dashboard')}
          style={{
            alignSelf: 'flex-start',
            border: '1px solid var(--cyan)',
            color: 'var(--cyan)',
            background: 'transparent',
            borderRadius: 100,
            padding: '0 24px',
            height: 46,
            fontFamily: 'inherit',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            transition: 'background .2s',
            marginTop: 4,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(174,227,249,.08)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
        >
          Registra il tuo FabLab &rarr;
        </button>
      </div>

      {/* Right — Dashboard mockup */}
      <div className="anim-float" style={{ flex: 1, minHeight: 380, animationDuration: '9s', position: 'relative' }}>
        <div
          style={{
            border: '1px solid var(--line-2)',
            borderRadius: 18,
            padding: 18,
            background: 'rgba(174,227,249,.04)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            position: 'relative',
          }}
        >
          {/* Reg marks */}
          <div className="reg-tl" />
          <div className="reg-tr" />
          <div className="reg-bl" />
          <div className="reg-br" />

          {/* Header row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 11,
                color: 'var(--muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Dashboard FabLab
            </span>
            <span className="status-pill sp-print">2 NUOVI ORDINI</span>
          </div>

          {/* KPI mini strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 8,
              marginBottom: 16,
            }}
          >
            {[
              { n: '05', label: 'In stampa' },
              { n: '08', label: 'In coda' },
              { n: '02', label: 'Pronti' },
            ].map((kpi, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(174,227,249,.06)',
                  borderRadius: 10,
                  padding: '10px 12px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontFamily: 'var(--mono)', fontSize: 20, fontWeight: 700, color: 'var(--ink)' }}>
                  {kpi.n}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{kpi.label}</div>
              </div>
            ))}
          </div>

          {/* Orders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {orders.map((o, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 10px',
                  background: 'rgba(174,227,249,.04)',
                  borderRadius: 10,
                  border: '1px solid var(--line)',
                }}
              >
                <span
                  className={o.dot}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 10,
                    color: 'var(--cyan)',
                    flexShrink: 0,
                  }}
                >
                  {o.num}
                </span>
                <span style={{ fontSize: 12, color: 'var(--ink)', flex: 1 }}>{o.name}</span>
                <span className={`status-pill ${o.status}`} style={{ fontSize: 9 }}>
                  {o.statusLabel}
                </span>
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
      style={{
        padding: '100px 6%',
        textAlign: 'center',
        position: 'relative',
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
          background: 'radial-gradient(circle, rgba(174,227,249,.08), transparent 70%)',
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
        Inizia a stampare oggi.
      </h2>
      <p style={{ fontSize: 16, color: 'var(--muted)', marginTop: 12, position: 'relative' }}>
        Gratis per i primi 3 mesi. Nessuna carta di credito.
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
          Crea account gratuito
        </PrimaryButton>
        <button
          onClick={() => navigate('/fablab/dashboard')}
          style={{
            border: '1px solid var(--cyan)',
            color: 'var(--cyan)',
            background: 'transparent',
            borderRadius: 100,
            padding: '0 28px',
            height: 52,
            fontFamily: 'inherit',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            transition: 'background .2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(174,227,249,.08)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
        >
          Sono un FabLab &rarr;
        </button>
      </div>
    </section>
  )
}

/* ────────────────── FOOTER ────────────────── */
function LandingFooter() {
  return (
    <footer
      style={{
        padding: '32px 6%',
        borderTop: '1px solid var(--line)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Package size={16} color="var(--cyan)" />
        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>TESEO</span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Links */}
      <div style={{ display: 'flex', gap: 20 }}>
        {['Privacy', 'Termini', 'GitHub', 'Contact'].map((link, i) => (
          <a
            key={i}
            href="#"
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 12,
              color: 'var(--muted)',
              textDecoration: 'none',
              transition: 'color .2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--ink)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted)' }}
          >
            {link}
          </a>
        ))}
      </div>

      {/* Copyright */}
      <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)' }}>
        &copy; 2025 Teseo
      </span>
    </footer>
  )
}

/* ────────────────── PAGE ────────────────── */
export default function Landing() {
  return (
    <div className="landing-scroll">
      <LandingNav />
      <HeroSection />
      <StatsBar />
      <HowItWorksSection />
      <FeaturesSection />
      <ForFablabSection />
      <FinalCtaSection />
      <LandingFooter />
    </div>
  )
}
