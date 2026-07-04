import { ScanLine, GitBranch, BadgeCheck, Printer, Users, Sparkles, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import GlassCard from '../components/GlassCard'
import PrimaryButton from '../components/PrimaryButton'
import { LandingNav, LandingFooter, SectionTag, PageHero, GhostButton } from '../components/LandingChrome'

/* ── I numeri della voglia di partecipare ── */
function WillingnessBar() {
  const stats = [
    { value: '56%', label: 'farebbe più del semplice utente' },
    { value: '44%', label: 'stamperebbe pezzi per gli altri' },
    { value: '20%', label: 'contribuirebbe file e correzioni' },
    { value: '11%', label: 'ha già una stampante a casa' },
  ]
  return (
    <div
      style={{
        padding: '40px 6% 12px',
        background: 'rgba(63,115,8,.04)',
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
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
            <div style={{ fontFamily: 'var(--mono)', fontSize: 30, fontWeight: 700, color: 'var(--ink)' }}>{s.value}</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 6, lineHeight: 1.45 }}>{s.label}</div>
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
        LA RETE NON DIPENDE SOLO DAI FABLAB: CHI SA FARE, FA.
      </p>
    </div>
  )
}

/* ── Come funziona il versioning ── */
function VersioningSection() {
  const steps = [
    { icon: <Sparkles size={20} color="var(--cyan)" />, t: 'L’AI genera la v1', d: 'Dal riconoscimento del pezzo nasce la prima versione del modello: veloce, ma non perfetta.' },
    { icon: <GitBranch size={20} color="var(--cyan)" />, t: 'La community corregge', d: 'Maker e contributor sistemano tolleranze, spessori e orientamento. Ogni modifica resta nello storico.' },
    { icon: <BadgeCheck size={20} color="var(--cyan)" />, t: 'La versione si certifica', d: 'Il file validato riceve il bollino: chi stampa dopo di te sa che quel pezzo regge davvero.' },
    { icon: <Printer size={20} color="var(--cyan)" />, t: 'Il catalogo cresce', d: 'Il modello resta un bene comune: la prossima riparazione dello stesso pezzo è istantanea e consuma 14× meno.' },
  ]

  return (
    <section style={{ padding: '80px 6%' }}>
      <div style={{ textAlign: 'center' }}>
        <SectionTag>VERSIONING COLLABORATIVO</SectionTag>
        <h2 style={{ fontSize: 34, fontWeight: 700, marginTop: 14, color: 'var(--ink)' }}>
          L&apos;AI genera. Le persone garantiscono.
        </h2>
        <p style={{ fontSize: 15, color: 'var(--muted)', marginTop: 8, maxWidth: 580, margin: '8px auto 0', lineHeight: 1.6 }}>
          Un file generato da un algoritmo non basta a fidarsi. Per questo ogni modello passa dalle mani della community prima di finire su una stampante.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 48, maxWidth: 1020, margin: '48px auto 0', position: 'relative' }}>
        {steps.map((s, i) => (
          <GlassCard key={i} style={{ padding: 24, position: 'relative' }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'var(--glass-2)',
                border: '1px solid var(--line)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              {s.icon}
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted-2)', letterSpacing: '0.08em', marginTop: 14 }}>
              STEP {i + 1}
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>{s.t}</h3>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginTop: 6 }}>{s.d}</p>
            {i < steps.length - 1 && (
              <ArrowRight
                size={16}
                color="var(--line-2)"
                style={{ position: 'absolute', right: -16, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}
              />
            )}
          </GlassCard>
        ))}
      </div>
    </section>
  )
}

/* ── Ruoli nella rete ── */
function RolesSection() {
  const roles = [
    {
      icon: <ScanLine size={20} color="var(--cyan)" />,
      name: 'Utente',
      tagline: 'Ripari i tuoi oggetti',
      points: ['Scansiona e ordina il ricambio', 'Segui la stampa in tempo reale', 'Vedi il tuo impatto nella dashboard'],
    },
    {
      icon: <GitBranch size={20} color="var(--cyan)" />,
      name: 'Contributor',
      tagline: 'Migliori i modelli',
      points: ['Correggi e valida i file generati', 'Costruisci reputazione pubblica', 'Aiuti chi resta bloccato'],
    },
    {
      icon: <Printer size={20} color="var(--cyan)" />,
      name: 'Maker',
      tagline: 'Stampi per il quartiere',
      points: ['Ricevi ordini dal matchmaking', 'Compenso per ogni stampa validata', 'La tua stampante lavora, non dorme'],
    },
    {
      icon: <Users size={20} color="var(--cyan)" />,
      name: 'FabLab',
      tagline: 'Sei un nodo di produzione',
      points: ['Dashboard ordini e coda di stampa', 'Slicing AI e certificazione qualità', 'Hub di ritiro per la tua zona'],
    },
  ]

  return (
    <section style={{ padding: '70px 6% 90px', background: 'rgba(63,115,8,.02)' }}>
      <div style={{ textAlign: 'center' }}>
        <SectionTag>I RUOLI DELLA RETE</SectionTag>
        <h2 style={{ fontSize: 34, fontWeight: 700, marginTop: 14, color: 'var(--ink)' }}>
          C&apos;è posto anche senza stampante
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 44 }}>
        {roles.map((r, i) => (
          <GlassCard key={i} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: 'var(--glass-2)',
                border: '1px solid var(--line)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              {r.icon}
            </div>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>{r.name}</h3>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--cyan)', marginTop: 2 }}>{r.tagline}</div>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7, marginTop: 2 }}>
              {r.points.map((p, j) => (
                <li key={j} style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5, display: 'flex', gap: 8 }}>
                  <span style={{ color: 'var(--cyan)', flexShrink: 0 }}>·</span>
                  {p}
                </li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </div>
    </section>
  )
}

function CtaSection() {
  const navigate = useNavigate()
  return (
    <section style={{ padding: '40px 6% 100px', textAlign: 'center' }}>
      <h2 style={{ fontSize: 34, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.02em' }}>
        Nessuno ripara da solo.
      </h2>
      <p style={{ fontSize: 15, color: 'var(--muted)', marginTop: 10 }}>
        Entra come utente, cresci come contributor, diventa un nodo della rete.
      </p>
      <div style={{ marginTop: 26, display: 'flex', gap: 12, justifyContent: 'center' }}>
        <PrimaryButton style={{ height: 50, fontSize: 15, padding: '0 30px' }} onClick={() => navigate('/app/community')}>
          <Users size={18} />
          Entra nella community
        </PrimaryButton>
        <GhostButton style={{ height: 50 }} onClick={() => navigate('/fablab/dashboard')}>
          Registra il tuo laboratorio &rarr;
        </GhostButton>
      </div>
    </section>
  )
}

export default function CommunityPublic() {
  return (
    <div className="landing-scroll">
      <LandingNav />
      <PageHero
        tag="COMMUNITY"
        title={<>Chi sa stampare non è un utente:<br />è un nodo della rete.</>}
        subtitle="Solo l'11% ha una stampante, ma più della metà vuole fare la propria parte. Teseo trasforma capacità isolate in una capacità produttiva di quartiere — con compenso, reputazione e riconoscimento."
      />
      <WillingnessBar />
      <VersioningSection />
      <RolesSection />
      <CtaSection />
      <LandingFooter />
    </div>
  )
}
