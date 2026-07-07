import type { ReactNode, CSSProperties } from 'react'
import { ArrowRight, ScanLine } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import PrimaryButton from './PrimaryButton'
import { FloatItem, Tazza, Moka, Cuffie, Occhiali, Telecomando, Ingranaggio, Sedia } from './HeroFloatingMeshes'

/* Chrome condiviso dalle pagine pubbliche: nav, footer, helper di sezione */

/* Wordmark Teseo (mockup): `size` = altezza in px, larghezza proporzionale
   all'aspect 373:101. `color` sovrascrive il fill così regge su fondi scuri. */
export function TeseoLogo({ size = 22, color = 'var(--cyan)' }: { size?: number; color?: string }) {
  return (
    <svg width={size * 373 / 101} height={size} viewBox="0 0 373 101" fill="none" aria-label="TESEO">
      <path d="M179.927 89.9659H181.491C186.933 89.9659 190.671 88.1056 193.314 84.2112L194.253 82.9594C195.817 80.7861 196.582 77.987 196.582 74.249V70.6675C196.582 62.1136 191.906 56.3415 182.413 56.3415H159.22L148.006 38.747V19.7615L163.723 2.16699H197.347L213.69 21.4654V29.2543H196.096V28.0025C196.096 24.5774 195.313 21.7783 192.984 18.8227L191.732 17.1189C189.246 13.8503 185.508 12.4421 180.361 12.4421H180.205C174.763 12.4421 171.025 14.3024 168.226 18.1968C165.896 21.6218 165.114 24.421 165.114 28.1589V30.4887C165.114 34.2266 165.896 36.8693 167.913 40.4508C170.086 44.3452 173.824 46.0491 179.422 46.0491H200.894L213.655 62.0789V80.5949L197.939 100.206H163.845L147.502 78.891V73.1363H165.097C165.409 76.5613 165.566 77.3437 166.661 79.9864L167.287 81.5511C169.46 86.9929 173.981 89.9485 179.892 89.9485L179.927 89.9659Z" fill={color} />
      <path d="M64.8311 10.2578H55.2529C48.8724 10.2578 45.2902 13.8393 45.29 20.2197V98.0498C45.29 99.458 44.508 100.223 43.1172 100.223H30.8252C29.417 100.223 28.6523 99.4407 28.6523 98.0498V20.2373C28.6523 13.8568 25.07 10.2754 18.6895 10.2754H2.17285C0.764993 10.2752 0.000166333 9.493 0 8.10254V2.17383C0 0.783084 0.782221 0.000145532 2.17285 0H70.6289L64.8311 10.2578Z" fill={color} />
      <path d="M83.8874 98.6762L69.5614 67.851C69.092 66.9122 68.9355 66.2863 68.9355 65.2083V30.9581C68.9355 30.0192 69.2485 29.2543 69.7179 28.3154L83.731 3.73172C84.3569 2.79288 85.2957 2.16699 86.3736 2.16699H119.998C121.093 2.16699 122.015 2.63641 122.641 3.57525L135.715 24.8904C136.184 25.6728 136.497 26.5942 136.497 27.533V54.1509C136.497 55.5592 135.715 56.3241 134.324 56.3241H96.6661C89.6596 56.3241 85.7651 60.5315 87.9557 67.3816L91.6937 81.5511C93.3975 86.9929 96.6661 89.9485 101.969 89.9485H105.707C111.618 89.9485 114.574 86.9929 116.764 81.5511L117.39 79.9864C118.172 77.9696 118.485 77.0308 118.798 75.3096C118.955 73.9013 119.737 73.1363 120.972 73.1363H134.359C135.767 73.1363 136.532 73.9187 136.532 75.3096V77.3263C136.532 78.4216 136.219 79.3431 135.593 80.1255L122.05 98.7979C121.424 99.7368 120.485 100.206 119.407 100.206H86.5649C85.3131 100.206 84.3916 99.7368 83.9222 98.6415L83.8874 98.6762ZM119.685 36.1043V31.7404C119.685 26.7681 118.433 23.343 115.947 19.1356C113.148 14.3024 108.941 12.4421 103.812 12.4421C97.2746 12.4421 92.4413 14.9283 90.4245 20.683L88.4078 26.2813C87.156 29.5498 86.704 33.7572 86.5475 36.8693C86.8604 42.937 90.2854 46.0491 96.3531 46.0491H109.897C116.277 46.0491 119.702 42.4676 119.702 36.0869L119.685 36.1043Z" fill={color} />
      <path d="M239.857 98.6762L225.531 67.851C225.062 66.9122 224.905 66.2863 224.905 65.2083V30.9581C224.905 30.0192 225.218 29.2543 225.688 28.3154L239.701 3.73172C240.327 2.79288 241.265 2.16699 242.343 2.16699H275.968C277.063 2.16699 277.984 2.63641 278.61 3.57525L291.685 24.8904C292.154 25.6728 292.467 26.5942 292.467 27.533V54.1509C292.467 55.5592 291.685 56.3241 290.294 56.3241H252.636C245.629 56.3241 241.735 60.5315 243.925 67.3816L247.663 81.5511C249.367 86.9929 252.636 89.9485 257.939 89.9485H261.676C267.588 89.9485 270.543 86.9929 272.734 81.5511L273.36 79.9864C274.142 77.9696 274.455 77.0308 274.768 75.3096C274.925 73.9013 275.707 73.1363 276.941 73.1363H290.328C291.737 73.1363 292.502 73.9187 292.502 75.3096V77.3263C292.502 78.4216 292.189 79.3431 291.563 80.1255L278.019 98.7979C277.393 99.7368 276.455 100.206 275.377 100.206H242.535C241.283 100.206 240.361 99.7368 239.892 98.6415L239.857 98.6762ZM275.655 36.1043V31.7404C275.655 26.7681 274.403 23.343 271.917 19.1356C269.118 14.3024 264.91 12.4421 259.781 12.4421C253.244 12.4421 248.411 14.9283 246.394 20.683L244.377 26.2813C243.126 29.5498 242.674 33.7572 242.517 36.8693C242.83 42.937 246.255 46.0491 252.323 46.0491H265.866C272.247 46.0491 275.672 42.4676 275.672 36.0869L275.655 36.1043Z" fill={color} />
      <path d="M352.69 2.16699C353.786 2.16712 354.707 2.63649 355.333 3.5752L356.47 5.08594L346.915 14.6406C344.75 13.1451 342.16 12.459 338.99 12.459C333.235 12.459 329.027 15.4149 326.385 20.7002L323.586 26.2988C321.569 30.3496 321.726 33.9309 321.726 38.4336V56.0283C321.726 60.5487 321.882 63.8176 323.43 68.1641L328.401 81.5508C330.418 86.9925 333.374 89.9482 338.677 89.9482C343.51 89.9482 346.466 86.9927 349.108 82.0029V82.0205L352.533 75.6396C354.55 71.7453 354.707 68.0076 354.707 63.5049V44.7646L372.277 27.1934C372.292 27.3547 372.302 27.5199 372.302 27.6895V71.2764C372.302 72.2151 371.988 73.1367 371.519 73.9189L355.959 98.8154C355.333 99.9107 354.393 100.224 353.315 100.224H323.116C322.021 100.224 321.099 99.7543 320.63 98.6592V98.6758L304.757 67.8506C304.288 66.9119 304.131 66.1467 304.131 65.208V30.958C304.131 30.0193 304.444 29.0977 304.913 28.3154L320.474 3.5752C321.099 2.47999 322.038 2.16705 323.116 2.16699H352.69Z" fill={color} />
    </svg>
  )
}

/* One-page: i pulsanti della navbar portano alle sezioni della landing */
const NAV_LINKS = [
  { label: 'Come funziona', hash: 'come-funziona' },
  { label: 'Impatto', hash: 'impatto' },
  { label: 'Community', hash: 'community' },
]

export function scrollToSection(hash: string) {
  const el = document.getElementById(hash)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function LandingNav() {
  const navigate = useNavigate()
  const goTo = (hash: string) => {
    if (window.location.pathname === '/') scrollToSection(hash)
    else navigate(`/#${hash}`)
  }
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255,255,255,.85)',
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
      <Link to="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, textDecoration: 'none' }}>
        <TeseoLogo size={22} color="var(--ink)" />
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 28, flex: 1 }}>
        {NAV_LINKS.map(link => (
          <button
            key={link.hash}
            onClick={() => goTo(link.hash)}
            style={{
              color: 'var(--muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: 600,
              transition: 'color .2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)' }}
          >
            {link.label}
          </button>
        ))}
      </div>

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
        <PrimaryButton style={{ height: 38, padding: '0 18px', fontSize: 13 }} onClick={() => navigate('/fablab/dashboard')}>
          Iscrivi il tuo FabLab
        </PrimaryButton>
      </div>
    </nav>
  )
}

/* Modelli 3D wireframe lemongrass che fiancheggiano il titolo (come le monete
   della reference): due gruppi ai lati, altezze sfalsate, un po' storti */
const FOOTER_MESHES: { el: ReactNode; left: string; top: string; size: number; tiltZ: number; duration: string; delay: string; speed?: number; axis?: 'z' }[] = [
  { el: <Tazza />, left: '4%', top: '6%', size: 125, tiltZ: -0.28, duration: '7s', delay: '0s' },
  { el: <Moka />, left: '15%', top: '36%', size: 115, tiltZ: 0.24, duration: '9s', delay: '0.6s', speed: 0.28 },
  { el: <Occhiali />, left: '5%', top: '62%', size: 125, tiltZ: 0.2, duration: '8.5s', delay: '1.4s', speed: 0.3 },
  { el: <Cuffie />, left: '82%', top: '5%', size: 125, tiltZ: 0.3, duration: '8s', delay: '1s' },
  { el: <Ingranaggio />, left: '74%', top: '34%', size: 110, tiltZ: -0.18, duration: '7.5s', delay: '2s', speed: 0.45, axis: 'z' },
  { el: <Sedia />, left: '83%', top: '60%', size: 125, tiltZ: 0.26, duration: '8s', delay: '1.7s' },
  { el: <Telecomando />, left: '66%', top: '68%', size: 110, tiltZ: -0.22, duration: '9s', delay: '0.3s' },
]

const FOOTER_COLS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: 'Piattaforma',
    links: [
      { label: 'Come funziona', to: '/come-funziona' },
      { label: 'Impatto', to: '/impatto' },
      { label: 'Community', to: '/community' },
    ],
  },
  {
    title: 'App',
    links: [
      { label: 'Dashboard', to: '/app/dashboard' },
      { label: 'Nuova stampa', to: '/app/new' },
      { label: 'Produttori', to: '/app/produttori' },
    ],
  },
  {
    title: 'FabLab',
    links: [
      { label: 'Dashboard', to: '/fablab/dashboard' },
      { label: 'Coda e stampanti', to: '/fablab/coda' },
      { label: 'Ordini', to: '/fablab/ordini' },
    ],
  },
]

export function LandingFooter() {
  const navigate = useNavigate()
  return (
    <footer className="land-block land-block--forest" style={{ padding: '0 6% 36px', color: '#fff' }}>
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

      {/* Headline + CTA, con i modelli 3D fluttuanti ai lati del titolo */}
      <div style={{ position: 'relative', padding: '90px 0' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0 }}>
          {FOOTER_MESHES.map((m, i) => (
            <FloatItem
              key={i}
              color="#b2eb76"
              style={{ left: m.left, top: m.top }}
              size={m.size}
              tiltZ={m.tiltZ}
              duration={m.duration}
              delay={m.delay}
              speed={m.speed}
              axis={m.axis}
            >
              {m.el}
            </FloatItem>
          ))}
        </div>

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 760, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-.02em' }}>
          Non è rotto:<br />
          <span style={{ color: '#b2eb76' }}>si ripara.</span>
        </h2>
        <button
          onClick={() => navigate('/onboarding')}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(0.98)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
          style={{
            marginTop: 36,
            height: 48,
            padding: '0 28px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: '#b2eb76',
            color: 'var(--forest)',
            fontFamily: 'var(--mono)',
            fontSize: 14,
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            transition: 'transform .2s cubic-bezier(.4,0,.2,1)',
          }}
        >
          <ScanLine size={17} />
          Ripara il primo oggetto
        </button>
        </div>
      </div>

      {/* Colonne link + newsletter */}
      <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: '40px 64px', paddingTop: 36 }}>
        {FOOTER_COLS.map(col => (
          <div key={col.title} style={{ minWidth: 150 }}>
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,.45)',
                marginBottom: 18,
              }}
            >
              {col.title}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {col.links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{ fontSize: 14.5, color: 'rgba(255,255,255,.85)', textDecoration: 'none', transition: 'color .2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#b2eb76' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,.85)' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div style={{ flex: 1 }} />

        {/* Newsletter, solo UI, nessun backend */}
        <div style={{ minWidth: 300 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: '#fff', marginBottom: 14 }}>
            Iscriviti alla newsletter
          </div>
          <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', gap: 10 }}>
            <input
              type="email"
              required
              placeholder="Indirizzo email"
              className="footer-mail"
              style={{
                flex: 1,
                height: 46,
                padding: '0 14px',
                fontFamily: 'var(--mono)',
                fontSize: 13,
                color: '#fff',
                colorScheme: 'dark',
                background: 'transparent',
                border: '1px solid rgba(178,235,118,.35)',
                borderRadius: 'var(--radius-sm)',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              aria-label="Iscriviti"
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(178,235,118,.12)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              style={{
                width: 46,
                height: 46,
                display: 'grid',
                placeItems: 'center',
                background: 'transparent',
                border: '1px solid rgba(178,235,118,.35)',
                borderRadius: 'var(--radius-sm)',
                color: '#b2eb76',
                cursor: 'pointer',
                transition: 'background .2s',
              }}
            >
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Riga finale */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          marginTop: 72,
          paddingTop: 24,
          borderTop: '1px solid rgba(178,235,118,.15)',
        }}
      >
        <TeseoLogo size={18} color="#b2eb76" />
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'rgba(255,255,255,.4)' }}>
          Non è rotto: è stato progettato per rompersi.
        </span>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'rgba(255,255,255,.55)' }}>
          &copy; Teseo 2026
        </span>
      </div>
    </footer>
  )
}

/* Etichetta mono di sezione (pill) */
export function SectionTag({ children }: { children: ReactNode }) {
  return (
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
      {children}
    </span>
  )
}

/* Bottone outline moss */
export function GhostButton({ children, onClick, style }: { children: ReactNode; onClick?: () => void; style?: CSSProperties }) {
  return (
    <button
      onClick={onClick}
      style={{
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
        ...style,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(63,115,8,.08)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
    >
      {children}
    </button>
  )
}

/* Hero compatto per le pagine interne */
export function PageHero({ tag, title, subtitle }: { tag: string; title: ReactNode; subtitle?: ReactNode }) {
  return (
    <section style={{ padding: '90px 6% 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
      <div className="anim-fadeUp">
        <SectionTag>{tag}</SectionTag>
      </div>
      <h1
        className="anim-fadeUp-d1"
        style={{
          fontSize: 'clamp(32px, 4.5vw, 52px)',
          fontWeight: 800,
          lineHeight: 1.12,
          letterSpacing: '-.02em',
          color: 'var(--ink)',
          marginTop: 20,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className="anim-fadeUp-d2"
          style={{ fontSize: 17, color: 'var(--muted)', lineHeight: 1.65, marginTop: 18, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' }}
        >
          {subtitle}
        </p>
      )}
    </section>
  )
}
