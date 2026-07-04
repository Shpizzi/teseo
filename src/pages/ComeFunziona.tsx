import { ScanLine, Cpu, Users, MapPin, Recycle, Leaf, Brain, Hand, MonitorSmartphone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import GlassCard from '../components/GlassCard'
import PrimaryButton from '../components/PrimaryButton'
import { LandingNav, LandingFooter, SectionTag, PageHero, GhostButton } from '../components/LandingChrome'

/* ── Step verticali del percorso ── */
const STEPS = [
  {
    icon: <ScanLine size={22} color="var(--cyan)" />,
    title: 'Scansiona il pezzo rotto',
    desc: 'Apri l’app e inquadra l’oggetto con la fotocamera. La computer vision lo riconosce e cerca il ricambio nell’archivio. Se qualcuno l’ha già riparato prima di te, il modello è pronto: salti la coda e consumi 14 volte meno energia.',
    note: 'RICONOSCIMENTO · SCAN 3D',
  },
  {
    icon: <Cpu size={22} color="var(--cyan)" />,
    title: 'L’AI ricostruisce il ricambio',
    desc: 'Se il pezzo non esiste ancora, l’AI genera il modello 3D, corregge le tolleranze e lo prepara per la stampa. Non devi saper modellare: descrivi il problema a parole tue e l’assistente fa le domande giuste.',
    note: 'GENERAZIONE MESH · FIX TOLLERANZE',
  },
  {
    icon: <Users size={22} color="var(--cyan)" />,
    title: 'La community valida',
    desc: 'L’AI genera, le persone verificano. Maker esperti controllano il file, lo migliorano e lo certificano. E se l’AI si blocca su un caso difficile, un contributor competente ti aiuta di persona — nessuno resta da solo.',
    note: 'VERSIONING · CERTIFICAZIONE',
  },
  {
    icon: <MapPin size={22} color="var(--cyan)" />,
    title: 'Un FabLab vicino lo stampa',
    desc: 'Il matchmaking sceglie il laboratorio più adatto per materiale, tecnologia e distanza. Dove possibile si usano bio-materiali e filamento da riciclo. Tu vedi l’avanzamento della stampa in tempo reale.',
    note: 'MATCHMAKING · BIO-MATERIALI',
  },
  {
    icon: <Recycle size={22} color="var(--cyan)" />,
    title: 'Ritiri e chiudi il cerchio',
    desc: 'Ritiro a mano o hub di quartiere: niente corrieri, niente magazzini. Quando il pezzo arriverà a fine vita, si tritura e torna filamento per la stampa successiva. Il ciclo resta aperto solo se lo apri tu.',
    note: 'LOGISTICA LOCALE · LOOP CHIUSO',
  },
]

function StepsSection() {
  return (
    <section style={{ padding: '20px 6% 80px', maxWidth: 860, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 24 }}>
            {/* Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: 'var(--glass)',
                  border: '1px solid var(--line-2)',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                {s.icon}
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width: 1, flex: 1, background: 'var(--line-2)', margin: '8px 0' }} />
              )}
            </div>

            {/* Content */}
            <div style={{ paddingBottom: i < STEPS.length - 1 ? 44 : 0, paddingTop: 4 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--cyan)', fontWeight: 600 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)' }}>{s.title}</h3>
              </div>
              <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.65, marginTop: 8, maxWidth: 620 }}>
                {s.desc}
              </p>
              <span
                style={{
                  display: 'inline-block',
                  marginTop: 10,
                  fontFamily: 'var(--mono)',
                  fontSize: 10,
                  letterSpacing: '0.08em',
                  color: 'var(--muted-2)',
                }}
              >
                {s.note}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── I 5 layer, in parole semplici ── */
function LayersSection() {
  const layers = [
    {
      icon: <MapPin size={18} color="var(--cyan)" />,
      name: 'Layer fisico',
      desc: 'FabLab, produttori conto-terzi, hub di ritiro e logistica leggera di quartiere.',
    },
    {
      icon: <Leaf size={18} color="var(--cyan)" />,
      name: 'Layer materia',
      desc: 'Bio-materiali, filamento da riciclo, stampa ottimizzata per consumare meno materiale ed energia.',
    },
    {
      icon: <Brain size={18} color="var(--cyan)" />,
      name: 'Layer AI',
      desc: 'Riconoscimento oggetti, scansione dimensionale, generazione e correzione dei modelli, matchmaking di rete.',
    },
    {
      icon: <Hand size={18} color="var(--cyan)" />,
      name: 'Layer umano',
      desc: 'Community, versioning collaborativo, certificazione. Quando l’AI fallisce, subentra una persona competente.',
    },
    {
      icon: <MonitorSmartphone size={18} color="var(--cyan)" />,
      name: 'Layer interfaccia',
      desc: 'App di scansione, dashboard cliente e produttore: tutto quello che vedi e tocchi.',
    },
  ]

  return (
    <section style={{ padding: '80px 6%', background: 'rgba(63,115,8,.02)' }}>
      <div style={{ textAlign: 'center' }}>
        <SectionTag>COSA C&apos;È SOTTO</SectionTag>
        <h2 style={{ fontSize: 34, fontWeight: 700, marginTop: 14, color: 'var(--ink)' }}>
          Cinque strati, come una stampa
        </h2>
        <p style={{ fontSize: 15, color: 'var(--muted)', marginTop: 8, maxWidth: 560, margin: '8px auto 0' }}>
          Teseo non è solo un’app: è una rete fisica, una filiera di materiali, un motore AI e una community. In quest’ordine.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginTop: 48 }}>
        {layers.map((l, i) => (
          <GlassCard key={i} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'var(--glass-2)',
                border: '1px solid var(--line)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              {l.icon}
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.06em', color: 'var(--cyan)', textTransform: 'uppercase' }}>
              {l.name}
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.55 }}>{l.desc}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  )
}

/* ── FAQ dalle barriere emerse in survey ── */
function FaqSection() {
  const faqs = [
    {
      q: 'Il pezzo stampato reggerà davvero come l’originale?',
      a: 'È il dubbio più diffuso (lo ha 1 persona su 3). Per questo ogni modello passa da validazione di tolleranze e certificazione della community, e per i pezzi sollecitati si usano materiali tecnici come PETG e nylon. Ogni stampa validata ha uno storico consultabile.',
    },
    {
      q: 'Quanto mi costa, rispetto a ricomprare?',
      a: 'Un ricambio tipico costa circa 10€, contro gli ~80€ di un oggetto nuovo di fascia media. Il preventivo è chiaro prima di confermare: materiale, stampa e ritiro inclusi.',
    },
    {
      q: 'Non so nemmeno cosa sia un FabLab.',
      a: 'Sei in buona compagnia: il 56% delle persone non lo sa. È un laboratorio di fabbricazione digitale — stampanti 3D, laser, persone che le sanno usare. Con Teseo non devi nemmeno entrarci se non vuoi: scegli sulla mappa, ritiri quando è pronto.',
    },
    {
      q: 'E se l’AI sbaglia il modello?',
      a: 'Succede, e lo diciamo chiaramente. Quando la generazione automatica non basta, la richiesta passa a un maker competente della community che sistema il file a mano. L’AI accelera, le persone garantiscono.',
    },
    {
      q: 'Di chi è il modello 3D del mio pezzo?',
      a: 'Il catalogo è un bene comune: ogni pezzo riparato resta disponibile per il prossimo che ne ha bisogno, con lo storico delle versioni e dei contributori. Più oggetti ripariamo, meno ne buttiamo tutti.',
    },
  ]

  return (
    <section style={{ padding: '80px 6% 90px', maxWidth: 780, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 44 }}>
        <SectionTag>DOMANDE ONESTE</SectionTag>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginTop: 14, color: 'var(--ink)' }}>
          Le obiezioni vere, con risposte vere
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {faqs.map((f, i) => (
          <GlassCard key={i} style={{ padding: '22px 26px' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', display: 'flex', gap: 10, alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--cyan)' }}>Q.</span>
              {f.q}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65, marginTop: 10, paddingLeft: 26 }}>
              {f.a}
            </p>
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
        Il primo oggetto si ripara in un pomeriggio.
      </h2>
      <div style={{ marginTop: 26, display: 'flex', gap: 12, justifyContent: 'center' }}>
        <PrimaryButton style={{ height: 50, fontSize: 15, padding: '0 30px' }} onClick={() => navigate('/app/dashboard')}>
          <ScanLine size={18} />
          Scansiona un pezzo
        </PrimaryButton>
        <GhostButton style={{ height: 50 }} onClick={() => navigate('/impatto')}>
          Guarda l&apos;impatto &rarr;
        </GhostButton>
      </div>
    </section>
  )
}

export default function ComeFunziona() {
  return (
    <div className="landing-scroll">
      <LandingNav />
      <PageHero
        tag="COME FUNZIONA"
        title={<>Dal guasto al ritiro,<br />senza competenze tecniche.</>}
        subtitle="Non devi saper modellare in 3D, né sapere cos'è un FabLab. Ti serve solo il telefono — al resto pensano l'AI, la community e la rete di laboratori di quartiere."
      />
      <StepsSection />
      <LayersSection />
      <FaqSection />
      <CtaSection />
      <LandingFooter />
    </div>
  )
}
