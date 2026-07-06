import { useEffect, useMemo, useRef } from 'react'
import type { MutableRefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LEMON = 0xb2eb76
const PAPER = 0xf4faed

/* La moka intera è sempre visibile ("tutta verde"). Allo scroll NON si
   costruisce tutto l'oggetto: si filla solo il MANICO, il pezzo rotto da
   sostituire. Il resto della moka è il contesto. */

const SCALE = 1.3
const OFFSET_Y = -0.3
// ponytail: range y del manico in coordinate moka, calibrato a occhio sulla box del manico
const HANDLE_Y0 = -0.05
const HANDLE_Y1 = 0.62

function MokaBuild({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  const clipSolid = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), [])
  const clipWire = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])
  const ringGeo = useMemo(() => new THREE.TorusGeometry(0.34, 0.008, 8, 48), [])

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.0028
    const p = progressRef.current
    const localY = HANDLE_Y0 + p * (HANDLE_Y1 - HANDLE_Y0)
    const worldY = localY * SCALE + OFFSET_Y
    clipSolid.constant = worldY
    clipWire.constant = -worldY
    if (ringRef.current) {
      ringRef.current.position.y = localY
      ;(ringRef.current.material as THREE.MeshBasicMaterial).opacity = p > 0.03 && p < 0.97 ? 0.9 : 0
    }
  })

  const bodyFill = <meshBasicMaterial color={LEMON} transparent opacity={0.16} side={THREE.DoubleSide} />
  const bodyWire = <meshBasicMaterial color={PAPER} wireframe transparent opacity={0.5} />

  // Corpo moka (sempre completo): base, camera superiore, coperchio, pomello, beccuccio
  const bodyParts: { geo: JSX.Element; pos: [number, number, number]; rot?: [number, number, number] }[] = [
    { geo: <cylinderGeometry args={[0.34, 0.54, 0.62, 8, 2]} />, pos: [0, -0.35, 0] },
    { geo: <cylinderGeometry args={[0.5, 0.3, 0.66, 8, 2]} />, pos: [0, 0.32, 0] },
    { geo: <coneGeometry args={[0.42, 0.18, 8]} />, pos: [0, 0.73, 0] },
    { geo: <sphereGeometry args={[0.07, 6, 6]} />, pos: [0, 0.87, 0] },
  ]

  return (
    <group ref={groupRef} scale={SCALE} position={[0, OFFSET_Y, 0]}>
      {bodyParts.map((part, i) => (
        <group key={i}>
          <mesh position={part.pos} rotation={part.rot}>{part.geo}{bodyFill}</mesh>
          <mesh position={part.pos} rotation={part.rot}>{part.geo}{bodyWire}</mesh>
        </group>
      ))}

      {/* MANICO, da stampare: wireframe fantasma sopra il piano di stampa */}
      <mesh position={[0.6, 0.35, 0]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[0.12, 0.52, 0.16, 2, 6, 2]} />
        <meshBasicMaterial color={LEMON} wireframe transparent opacity={0.14} clippingPlanes={[clipWire]} />
      </mesh>
      {/* MANICO, parte stampata: fill pieno + wireframe chiaro sotto il piano */}
      <mesh position={[0.6, 0.35, 0]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[0.12, 0.52, 0.16, 2, 6, 2]} />
        <meshBasicMaterial color={LEMON} transparent opacity={0.85} clippingPlanes={[clipSolid]} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.6, 0.35, 0]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[0.12, 0.52, 0.16, 2, 6, 2]} />
        <meshBasicMaterial color={PAPER} wireframe transparent opacity={0.7} clippingPlanes={[clipSolid]} />
      </mesh>

      {/* testina: anello attorno al manico all'altezza dello strato corrente */}
      <mesh ref={ringRef} geometry={ringGeo} position={[0.6, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color={LEMON} transparent opacity={0} />
      </mesh>
    </group>
  )
}

export default function PrintBuildScroll() {
  const sectionRef = useRef<HTMLElement>(null)
  const progressRef = useRef(0)

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
      onUpdate: self => { progressRef.current = self.progress },
    })
    return () => st.kill()
  }, [])

  return (
    /* 260vh di scroll: la scena resta pinnata (sticky) mentre il manico si stampa */
    <section ref={sectionRef} style={{ height: '260vh', position: 'relative' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          background: '#122006',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          margin: '0 12px',
          borderRadius: 24,
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
          FIG. 02 &mdash; SI STAMPA SOLO IL PEZZO ROTTO &middot; SCRUB = SCROLL
        </span>

        {/* Colonna testo, statica: titolo + descrizione */}
        <div style={{ flex: '0 0 40%', padding: '0 5% 0 8%', position: 'relative', zIndex: 2 }}>
          <h2
            style={{
              fontSize: 'clamp(44px, 5.6vw, 76px)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-.02em',
              color: '#f4faed',
            }}
          >
            Strato dopo strato
          </h2>
          <p style={{ fontSize: 15.5, color: 'rgba(244,250,237,.7)', lineHeight: 1.65, marginTop: 24, maxWidth: 400 }}>
            Non buttiamo l'oggetto intero, stampiamo solo il pezzo che serve.
            Il manico della moka si è rotto? La rete produce quello, in materiale
            riciclato e la tua moka torna sul fuoco.
          </p>
        </div>

        {/* Canvas 3D */}
        <div style={{ flex: 1, height: '100%', position: 'relative' }}>
          <Canvas
            gl={{ localClippingEnabled: true, antialias: true, alpha: true }}
            camera={{ fov: 42, position: [0.2, 0.7, 4.6], near: 0.1, far: 100 }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            onCreated={({ camera }) => { camera.lookAt(0, 0.1, 0) }}
          >
            <MokaBuild progressRef={progressRef} />
          </Canvas>
        </div>
      </div>
    </section>
  )
}
