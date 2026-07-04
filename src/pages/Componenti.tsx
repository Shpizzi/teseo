import { Home, FolderKanban, Users, Bell, Printer, Package, TrendingUp } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import IconButton from '../components/IconButton'
import KpiCard from '../components/KpiCard'
import PrimaryButton from '../components/PrimaryButton'
import ProgressBar from '../components/ProgressBar'
import SearchBar from '../components/SearchBar'
import Sidebar from '../components/Sidebar'
import StatusPill from '../components/StatusPill'

// ponytail: pagina vetrina statica per export Figma — solo componenti 2D, i viewer
// three.js (HeroViewer3D, PrintViewer3D, PrintBuildScroll) non si esportano su Figma.

const COLORS = [
  { name: '--bg / sage-1', hex: '#f4faed', use: 'sfondo primario' },
  { name: '--bg-2 / sage-2', hex: '#f0fae6', use: 'sfondo secondario' },
  { name: '--ink', hex: '#090f05', use: 'testo primario' },
  { name: '--cyan / moss', hex: '#3f7308', use: 'accento brand' },
  { name: '--forest', hex: '#18280e', use: 'superfici scure, bottoni' },
  { name: '--lemongrass', hex: '#b2eb76', use: 'hover su superfici scure' },
  { name: '--line / sage-3', hex: '#d8e5ca', use: 'bordi deboli' },
  { name: '--line-2 / sage-4', hex: '#b3c5a0', use: 'bordi interattivi' },
  { name: '--glass', hex: '#ffffff', use: 'sfondo card' },
  { name: '--glass-2', hex: '#eaf6dc', use: 'card hover/attiva' },
  { name: '--muted', hex: 'rgba(9,15,5,.60)', use: 'testo secondario' },
  { name: 'error', hex: '#e40014', use: 'solo errori' },
]

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 44 }}>
      <div className="section-label" style={{ fontFamily: 'var(--mono)', textTransform: 'uppercase', fontSize: 12, letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: 14 }}>
        {label}
      </div>
      {children}
    </section>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>{children}</div>
}

export default function Componenti() {
  return (
    <div style={{ height: '100vh', overflow: 'auto', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 28px 96px' }}>
        <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '0.06em', marginBottom: 6 }}>TESEO — DESIGN SYSTEM</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 40, fontSize: 14 }}>
          Tutti i token e i componenti condivisi della piattaforma, in un'unica pagina pronta per l'import in Figma.
        </p>

        <Section label="01 · Palette">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {COLORS.map(c => (
              <div key={c.name} style={{ background: 'var(--glass)', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ height: 64, background: c.hex, borderBottom: '1px solid var(--line)' }} />
                <div style={{ padding: '9px 11px' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--muted)' }}>{c.hex}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--muted-2)', marginTop: 2 }}>{c.use}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section label="02 · Tipografia">
          <GlassCard className="p-6" style={{ padding: 24 }}>
            <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.01em' }}>Urbanist 800 — Titoli</div>
            <div style={{ fontSize: 22, fontWeight: 600, marginTop: 8 }}>Urbanist 600 — Sottotitoli e card</div>
            <div style={{ fontSize: 14, marginTop: 8 }}>Urbanist 400/500 — Corpo del testo, descrizioni e paragrafi lunghi.</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 8 }}>Urbanist muted — testo secondario</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 24, fontWeight: 600, marginTop: 20 }}>IBM Plex Mono — 12h 40m · 87% · #ORD-2214</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 8 }}>
              Label di sezione · mono · uppercase · 0.08em
            </div>
          </GlassCard>
        </Section>

        <Section label="03 · Bottoni">
          <Row>
            <PrimaryButton>Nuova stampa</PrimaryButton>
            <button className="btn-spade btn-spade--light">Variante ghost</button>
            <IconButton title="Notifiche" badge={3}><Bell size={19} /></IconButton>
            <IconButton title="Icona"><Printer size={19} /></IconButton>
          </Row>
        </Section>

        <Section label="04 · Status pill">
          <Row>
            <StatusPill status="printing" />
            <StatusPill status="ready" />
            <StatusPill status="draft" />
            <StatusPill status="error" />
          </Row>
        </Section>

        <Section label="05 · Deadline chip">
          <Row>
            {[['dl-urgent', 'Urgente'], ['dl-today', 'Oggi'], ['dl-week', 'Settimana']].map(([cls, label]) => (
              <span key={cls} className={cls} style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '5px 10px', borderRadius: 6 }}>
                {label}
              </span>
            ))}
          </Row>
        </Section>

        <Section label="06 · Progress">
          <GlassCard style={{ padding: 24, display: 'grid', gap: 30 }}>
            <ProgressBar value={64} label="64%" />
            <div className="progress-track" style={{ position: 'relative' }}>
              <span className="progress-track-label">striped · 38%</span>
              <i className="progress-track-fill progress-track-fill-striped" style={{ width: '38%' }} />
            </div>
            <Row>
              <div className="conic-ring">
                <span style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--glass)', display: 'grid', placeItems: 'center', fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700 }}>66%</span>
              </div>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>.conic-ring</span>
            </Row>
          </GlassCard>
        </Section>

        <Section label="07 · Ricerca & input">
          <SearchBar placeholder="Cerca progetti, modelli, produttori…" />
        </Section>

        <Section label="08 · Card">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <GlassCard style={{ padding: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>GlassCard</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>.glass-panel — card bianca, bordo sage-3, radius 12.</div>
            </GlassCard>
            <div className="glass-panel-2" style={{ padding: 20, borderRadius: 'var(--radius)' }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Panel 2</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>.glass-panel-2 — variante attiva/hover.</div>
            </div>
            <GlassCard hero className="reg-marks" style={{ padding: 20 }}>
              <i className="reg-tl" /><i className="reg-tr" /><i className="reg-bl" /><i className="reg-br" />
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Hero card + reg marks</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>.hero-card con tick angolari .reg-tl/tr/bl/br.</div>
            </GlassCard>
          </div>
        </Section>

        <Section label="09 · KPI">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            <KpiCard value="12" label="Stampe attive" trend="+3" trendUp icon={<Printer size={17} />} />
            <KpiCard value="4h 20m" label="Tempo medio coda" trend="−12%" icon={<TrendingUp size={17} />} />
            <KpiCard value="98%" label="Ordini completati" icon={<Package size={17} />} />
          </div>
        </Section>

        <Section label="10 · Thumbnail & stati stampante">
          <Row>
            <div className="thumb-mini" />
            <span style={{ fontSize: 12, color: 'var(--muted)', marginRight: 20 }}>.thumb-mini</span>
            {[['pdot-active', 'attiva'], ['pdot-idle', 'inattiva'], ['pdot-err', 'errore']].map(([cls, label]) => (
              <span key={cls} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className={cls} style={{ width: 10, height: 10, borderRadius: '50%', display: 'inline-block' }} />
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>{label}</span>
              </span>
            ))}
          </Row>
        </Section>

        <Section label="11 · Mappa (superficie scura + pin)">
          <div style={{ position: 'relative', height: 200, borderRadius: 'var(--radius)', background: '#18280e', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(178,235,118,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(178,235,118,.07) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
            <div className="mpin" style={{ left: '30%', top: '55%' }}>
              <span className="pd" />
              <span className="t">FabLab Brescia</span>
            </div>
            <div className="mpin you" style={{ left: '62%', top: '70%' }}>
              <span className="pd" />
              <span className="t">Tu</span>
            </div>
          </div>
        </Section>

        <Section label="12 · Sidebar">
          <div style={{ height: 480, display: 'flex' }}>
            <Sidebar
              items={[
                { label: 'Dashboard', icon: <Home size={18} />, href: '/componenti' },
                { label: 'Progetti', icon: <FolderKanban size={18} />, href: '#progetti' },
                { label: 'Community', icon: <Users size={18} />, href: '#community', badge: 2 },
              ]}
              brand={{ subtitle: 'design system' }}
              user={{ initials: 'LC', name: 'Luca Calvinoni', role: 'maker' }}
            />
          </div>
        </Section>
      </div>
    </div>
  )
}
