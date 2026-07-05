import { Home, FolderKanban, Users, Bell, Printer, Package, TrendingUp, Check, Send, UploadCloud } from 'lucide-react'
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

        {/* ============================================================== */}
        {/* CANDIDATI — pattern ripetuti inline nelle pagine, non ancora   */}
        {/* estratti come componenti. Esempi statici fedeli agli originali.*/}
        {/* ============================================================== */}
        <div style={{ borderTop: '1px dashed var(--line-2)', margin: '8px 0 40px', paddingTop: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Candidati — non ancora componenti</h2>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 36 }}>
            Pattern ripetuti inline in 2+ pagine, pronti per l'estrazione. Accanto a ciascuno i file dove compaiono.
          </p>
        </div>

        <Section label="C1 · PageHeader — titolo + sottotitolo mono + azioni · ~15 pagine">
          <GlassCard style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div>
                <h1 style={{ fontWeight: 600, fontSize: 25, letterSpacing: '-0.01em', color: 'var(--ink)' }}>Ordini</h1>
                <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 3, fontFamily: 'var(--mono)', letterSpacing: '0.02em' }}>6 TOTALI · 2 NUOVI</p>
              </div>
              <div style={{ flex: 1 }} />
              <SearchBar placeholder="Cerca…" className="hidden md:flex" />
              <PrimaryButton>Nuova stampa</PrimaryButton>
            </div>
          </GlassCard>
        </Section>

        <Section label="C2 · SectionLabel — field label + card title · 10+ pagine">
          <GlassCard style={{ padding: 20, display: 'grid', gap: 14 }}>
            <div>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Stato — variante A (field label)</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>In stampa</div>
            </div>
            <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink)' }}>Dettagli progetto — variante B (card title)</h3>
          </GlassCard>
        </Section>

        <Section label="C3 · Avatar iniziali · 7 pagine">
          <Row>
            {[[36, 'FB'], [42, 'LC'], [48, 'MR']].map(([size, initials]) => (
              <div key={initials as string} style={{ width: size as number, height: size as number, borderRadius: '50%', background: 'var(--glass-2)', border: '1px solid var(--line-2)', display: 'grid', placeItems: 'center', fontSize: (size as number) / 3, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--cyan)' }}>
                {initials}
              </div>
            ))}
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>36 / 42 / 48px</span>
          </Row>
        </Section>

        <Section label="C4 · DeadlineChip — duplicato in 3 file fablab">
          <Row>
            {[['dl-urgent', 'OGGI 18:00'], ['dl-today', 'DOMANI'], ['dl-week', 'VEN 12/07']].map(([cls, label]) => (
              <span key={cls} className={cls} style={{ fontFamily: 'var(--mono)', fontSize: 10, padding: '3px 8px', borderRadius: 5, display: 'inline-block', whiteSpace: 'nowrap' }}>{label}</span>
            ))}
          </Row>
        </Section>

        <Section label="C5 · FilterChip toggle · 4 pagine">
          <Row>
            {[['Tutti', true], ['FDM', false], ['Resina', false], ['Multicolor', false]].map(([label, active]) => (
              <button key={label as string} style={{ padding: '6px 14px', borderRadius: 100, fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 600, cursor: 'pointer', border: `1px solid ${active ? 'var(--cyan)' : 'var(--line)'}`, background: active ? 'var(--cyan)' : 'var(--glass)', color: active ? '#f4faed' : 'var(--muted)', transition: '0.18s', whiteSpace: 'nowrap' }}>
                {label}
              </button>
            ))}
          </Row>
        </Section>

        <Section label="C6 · Tabs con badge conteggio · Ordini + Dashboard fablab">
          <Row>
            {[['Tutti', 0, true], ['Nuovi', 2, false], ['In stampa', 3, false], ['Completati', 8, false]].map(([label, count, active]) => (
              <button key={label as string} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 13px', borderRadius: 100, border: active ? '1px solid var(--cyan)' : '1px solid var(--line)', background: active ? 'rgba(63,115,8,.10)' : 'transparent', color: active ? 'var(--cyan)' : 'var(--muted)', fontFamily: 'inherit', fontWeight: 600, fontSize: 12.5, cursor: 'pointer', transition: '0.18s' }}>
                {label}
                {(count as number) > 0 && (
                  <span style={{ background: active ? 'var(--cyan)' : 'var(--glass-2)', color: active ? '#f4faed' : 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 100 }}>{count}</span>
                )}
              </button>
            ))}
            <span style={{ background: 'var(--cyan)', color: '#f4faed', fontSize: 10, fontWeight: 700, fontFamily: 'var(--mono)', padding: '1px 7px', borderRadius: 100 }}>3</span>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>← CountBadge (unread)</span>
          </Row>
        </Section>

        <Section label="C7 · CtaButton forest + BackButton · 7 pagine">
          <Row>
            <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--forest)', color: '#fff', border: 'none', fontFamily: 'inherit', fontWeight: 700, fontSize: 14, padding: '0 20px', height: 44, borderRadius: 100, cursor: 'pointer', transition: '0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--cyan)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--forest)' }}>
              <Send size={16} /> Invia
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 12, padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              ← Progetti
            </button>
          </Row>
        </Section>

        <Section label="C8 · TagChip statico · Produttori + CommunityDetail">
          <Row>
            {['FDM', 'SLA', 'PETG', 'multicolor'].map(tech => (
              <span key={tech} style={{ fontSize: 10, fontFamily: 'var(--mono)', border: '1px solid var(--line)', borderRadius: 5, padding: '3px 8px', color: 'var(--muted)' }}>{tech}</span>
            ))}
          </Row>
        </Section>

        <Section label="C9 · Timeline verticale · ProgettoDetail + ComeFunziona">
          <GlassCard style={{ padding: 20, maxWidth: 420 }}>
            {[
              { label: 'Ordine confermato', date: '28 GIU · 14:02', done: true, current: false },
              { label: 'In stampa', date: '30 GIU · 09:15', done: true, current: true },
              { label: 'Ritiro', date: 'STIMATO 05 LUG', done: false, current: false },
            ].map((step, i, steps) => (
              <div key={step.label} style={{ display: 'flex', gap: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: step.done ? 'var(--cyan)' : 'transparent', border: step.done ? 'none' : '1.5px solid var(--line-2)', marginTop: 3 }} />
                  {i < steps.length - 1 && <div style={{ width: 1, flex: 1, minHeight: 32, background: 'var(--line)' }} />}
                </div>
                <div style={{ paddingBottom: i < steps.length - 1 ? 24 : 0 }}>
                  <div style={{ fontSize: step.current ? 15 : 13.5, fontWeight: step.current ? 700 : 500, color: step.done ? 'var(--ink)' : 'var(--muted)', marginBottom: 3 }}>{step.label}</div>
                  <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>{step.date}</div>
                </div>
              </div>
            ))}
          </GlassCard>
        </Section>

        <Section label="C10 · StepIndicator wizard · NuovaStampa">
          <Row>
            {[['Modello', 'done'], ['Produttore', 'current'], ['Conferma', 'todo']].map(([label, state], i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {i > 0 && <div style={{ width: 36, height: 1, background: state === 'todo' ? 'var(--line)' : 'var(--cyan)' }} />}
                <span style={{ width: 32, height: 32, borderRadius: '50%', display: 'grid', placeItems: 'center', fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, background: state === 'done' ? 'var(--cyan)' : state === 'current' ? 'rgba(63,115,8,.12)' : 'transparent', border: state === 'todo' ? '1px solid var(--line-2)' : '1px solid var(--cyan)', color: state === 'done' ? '#f4faed' : state === 'current' ? 'var(--cyan)' : 'var(--muted)' }}>
                  {state === 'done' ? <Check size={15} /> : i + 1}
                </span>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: state === 'todo' ? 'var(--muted)' : 'var(--ink)' }}>{label}</span>
              </div>
            ))}
          </Row>
        </Section>

        <Section label="C11 · ChatBubble · Messaggi">
          <GlassCard style={{ padding: 20, display: 'grid', gap: 10, maxWidth: 520 }}>
            <div style={{ justifySelf: 'start', maxWidth: '75%', background: 'var(--glass-2)', border: '1px solid var(--line)', borderRadius: '12px 12px 12px 4px', padding: '10px 14px' }}>
              <div style={{ fontSize: 13.5 }}>Ciao! Il pezzo è in coda, partiamo domattina.</div>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', marginTop: 4 }}>09:41</div>
            </div>
            <div style={{ justifySelf: 'end', maxWidth: '75%', background: 'var(--forest)', color: '#fff', borderRadius: '12px 12px 4px 12px', padding: '10px 14px' }}>
              <div style={{ fontSize: 13.5 }}>Perfetto, grazie mille!</div>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'rgba(255,255,255,.55)', marginTop: 4 }}>09:44</div>
            </div>
          </GlassCard>
        </Section>

        <Section label="C12 · Dropzone upload · NuovaStampa">
          <div style={{ border: '2px dashed var(--line-2)', borderRadius: 'var(--radius)', height: 180, display: 'grid', placeItems: 'center', color: 'var(--muted)', background: 'var(--glass)' }}>
            <div style={{ textAlign: 'center' }}>
              <UploadCloud size={28} style={{ color: 'var(--cyan)', margin: '0 auto 8px' }} />
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>Trascina qui il tuo file STL</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, marginTop: 4 }}>.STL · .OBJ · .3MF — MAX 100MB</div>
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
            />
          </div>
        </Section>
      </div>
    </div>
  )
}
