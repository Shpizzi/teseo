import { useEffect, useMemo, useRef } from 'react'
import type { MutableRefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { buildDisplacedGeo } from './PrintViewer3D'
import { SectionTag } from './LandingChrome'

gsap.registerPlugin(ScrollTrigger)

const TOTAL_LAYERS = 180

const PHASES: Array<[number, string, string]> = [
  [0.02, 'IN ATTESA', 'Scrolla per avviare la stampa.'],
  [0.30, 'SLICING', 'L’AI divide il modello in strati e ottimizza orientamento e supporti.'],
  [0.85, 'STAMPA IN CORSO', 'Il FabLab deposita il materiale strato dopo strato. PETG riciclato.'],
  [1.01, 'STAMPA COMPLETATA', 'Il ricambio è pronto al ritiro. L’oggetto torna a vivere.'],
]

/* Mesh che si "stampa": clipping plane pilotato dallo scroll */
function BuildMesh({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const geo = useMemo(() => buildDisplacedGeo(), [])
  const plateGeo = useMemo(() => new THREE.CylinderGeometry(1.5, 1.5, 0.14, 64), [])
  const ringGeo = useMemo(() => new THREE.TorusGeometry(1.55, 0.006, 8, 96), [])
  const clipSolid = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), [])
  const clipWire = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.0032
    const p = progressRef.current
    const printH = -1.25 + p * 2.55
    clipSolid.constant = printH
    clipWire.constant = -printH
    if (ringRef.current) {
      ringRef.current.position.y = printH
      // la "testina" sparisce a stampa completata
      ;(ringRef.current.material as THREE.MeshBasicMaterial).opacity = p > 0.03 && p < 0.99 ? 0.9 : 0
    }
  })

  return (
    <>
      <group ref={groupRef}>
        {/* parte stampata — riempimento */}
        <mesh geometry={geo}>
          <meshBasicMaterial color={0xb2eb76} transparent opacity={0.12} clippingPlanes={[clipSolid]} side={THREE.DoubleSide} />
        </mesh>
        {/* parte stampata — wireframe chiaro */}
        <mesh geometry={geo}>
          <meshBasicMaterial color={0xf4faed} wireframe transparent opacity={0.55} clippingPlanes={[clipSolid]} />
        </mesh>
        {/* da stampare — wireframe fantasma */}
        <mesh geometry={geo}>
          <meshBasicMaterial color={0xb2eb76} wireframe transparent opacity={0.10} clippingPlanes={[clipWire]} />
        </mesh>
        {/* piatto di stampa */}
        <mesh geometry={plateGeo} position={[0, -1.34, 0]}>
          <meshBasicMaterial color={0xb2eb76} wireframe transparent opacity={0.28} />
        </mesh>
      </group>
      {/* testina: anello all'altezza dello strato corrente */}
      <mesh ref={ringRef} geometry={ringGeo} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color={0xb2eb76} transparent opacity={0} />
      </mesh>
    </>
  )
}

export default function PrintBuildScroll() {
  const sectionRef = useRef<HTMLElement>(null)
  const progressRef = useRef(0)
  const layerRef = useRef<HTMLSpanElement>(null)
  const pctRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const phaseTitleRef = useRef<HTMLDivElement>(null)
  const phaseDescRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const scroller = section.closest('.landing-scroll') as HTMLElement | null

    const st = ScrollTrigger.create({
      trigger: section,
      scroller: scroller ?? undefined,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.4,
      onUpdate: self => {
        const p = self.progress
        progressRef.current = p
        const layer = Math.round(p * TOTAL_LAYERS)
        if (layerRef.current) layerRef.current.textContent = `LAYER ${String(layer).padStart(3, '0')} / ${TOTAL_LAYERS}`
        if (pctRef.current) pctRef.current.textContent = `${Math.round(p * 100)}%`
        if (barRef.current) barRef.current.style.width = `${p * 100}%`
        const phase = PHASES.find(ph => p < ph[0]) ?? PHASES[PHASES.length - 1]
        if (phaseTitleRef.current && phaseTitleRef.current.textContent !== phase[1]) {
          phaseTitleRef.current.textContent = phase[1]
          if (phaseDescRef.current) phaseDescRef.current.textContent = phase[2]
        }
      },
    })
    return () => st.kill()
  }, [])

  return (
    /* 320vh di scroll: la scena resta pinnata (sticky) mentre l'oggetto si costruisce */
    <section ref={sectionRef} style={{ height: '320vh', position: 'relative' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          background: '#122006',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Griglia blueprint su scuro */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage:
              'linear-gradient(rgba(178,235,118,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(178,235,118,.06) 1px, transparent 1px)',
            backgroundSize: '34px 34px',
          }}
        />

        {/* Reg marks */}
        <div className="reg-tl" style={{ borderColor: 'var(--lemongrass)' }} />
        <div className="reg-tr" style={{ borderColor: 'var(--lemongrass)' }} />
        <div className="reg-bl" style={{ borderColor: 'var(--lemongrass)' }} />
        <div className="reg-br" style={{ borderColor: 'var(--lemongrass)' }} />

        {/* Caption alto */}
        <span
          style={{
            position: 'absolute',
            top: 22,
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--mono)',
            fontSize: 10,
            letterSpacing: '0.2em',
            color: 'var(--lemongrass)',
            opacity: 0.7,
            whiteSpace: 'nowrap',
          }}
        >
          FIG. 02 &mdash; SIMULAZIONE STAMPA FDM &middot; SCRUB = SCROLL
        </span>

        {/* Colonna testo */}
        <div style={{ flex: '0 0 40%', padding: '0 5% 0 8%', position: 'relative', zIndex: 2 }}>
          <SectionTag>STRATO DOPO STRATO</SectionTag>
          <h2
            style={{
              fontSize: 'clamp(28px, 3.4vw, 44px)',
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: '-.02em',
              color: '#f4faed',
              marginTop: 18,
            }}
          >
            Così nasce il tuo ricambio.
          </h2>

          <div ref={phaseTitleRef} style={{ fontFamily: 'var(--mono)', fontSize: 13, letterSpacing: '0.1em', color: 'var(--lemongrass)', marginTop: 28 }}>
            IN ATTESA
          </div>
          <p ref={phaseDescRef} style={{ fontSize: 15, color: 'rgba(244,250,237,.65)', lineHeight: 1.6, marginTop: 8, minHeight: 48, maxWidth: 380 }}>
            Scrolla per avviare la stampa.
          </p>

          {/* Counter + barra */}
          <div style={{ marginTop: 26, maxWidth: 380 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span ref={layerRef} style={{ fontFamily: 'var(--mono)', fontSize: 13, color: '#f4faed', letterSpacing: '0.06em' }}>
                LAYER 000 / {TOTAL_LAYERS}
              </span>
              <span ref={pctRef} style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 700, color: 'var(--lemongrass)' }}>
                0%
              </span>
            </div>
            <div style={{ height: 3, background: 'rgba(244,250,237,.15)', marginTop: 10, overflow: 'hidden' }}>
              <div ref={barRef} style={{ height: '100%', width: '0%', background: 'var(--lemongrass)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'rgba(244,250,237,.4)', letterSpacing: '0.06em' }}>PETG RICICLATO · 0,2mm</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'rgba(244,250,237,.4)', letterSpacing: '0.06em' }}>NOZZLE 0.4 · 230°C</span>
            </div>
          </div>
        </div>

        {/* Canvas 3D */}
        <div style={{ flex: 1, height: '100%', position: 'relative' }}>
          <Canvas
            gl={{ localClippingEnabled: true, antialias: true, alpha: true }}
            camera={{ fov: 42, position: [0.2, 0.7, 4.6], near: 0.1, far: 100 }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            onCreated={({ camera }) => { camera.lookAt(0, 0.1, 0) }}
          >
            <BuildMesh progressRef={progressRef} />
          </Canvas>
        </div>
      </div>
    </section>
  )
}
