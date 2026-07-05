import { ReactNode, CSSProperties, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const MOSS = 0x3f7308
const FOREST = 0x18280e
const wire = { wireframe: true, transparent: true } as const

function Spin({ speed, axis = 'y', children }: { speed: number; axis?: 'y' | 'z'; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation[axis] = clock.elapsedTime * speed
  })
  return <group ref={ref}>{children}</group>
}

/* ── Oggetti procedurali low-poly: il wireframe deve leggersi da blueprint ── */

export function Tazza() {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.55, 0.48, 1.05, 14, 3, true]} />
        <meshBasicMaterial color={MOSS} {...wire} opacity={0.5} />
      </mesh>
      <mesh position={[0, -0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.48, 14]} />
        <meshBasicMaterial color={MOSS} {...wire} opacity={0.3} />
      </mesh>
      <mesh position={[0.72, 0.05, 0]}>
        <torusGeometry args={[0.3, 0.06, 6, 14]} />
        <meshBasicMaterial color={FOREST} {...wire} opacity={0.55} />
      </mesh>
    </group>
  )
}

export function Moka() {
  return (
    <group position={[0, -0.08, 0]}>
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.34, 0.54, 0.62, 8, 2]} />
        <meshBasicMaterial color={MOSS} {...wire} opacity={0.5} />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.5, 0.3, 0.66, 8, 2]} />
        <meshBasicMaterial color={MOSS} {...wire} opacity={0.5} />
      </mesh>
      <mesh position={[0, 0.73, 0]}>
        <coneGeometry args={[0.42, 0.18, 8]} />
        <meshBasicMaterial color={FOREST} {...wire} opacity={0.45} />
      </mesh>
      <mesh position={[0, 0.87, 0]}>
        <sphereGeometry args={[0.07, 6, 6]} />
        <meshBasicMaterial color={FOREST} {...wire} opacity={0.55} />
      </mesh>
      <mesh position={[0.6, 0.35, 0]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[0.1, 0.5, 0.14]} />
        <meshBasicMaterial color={FOREST} {...wire} opacity={0.45} />
      </mesh>
    </group>
  )
}

export function Cuffie() {
  return (
    <group position={[0, -0.05, 0]}>
      <mesh>
        <torusGeometry args={[0.58, 0.055, 6, 20, Math.PI]} />
        <meshBasicMaterial color={MOSS} {...wire} opacity={0.55} />
      </mesh>
      {[-0.58, 0.58].map((x) => (
        <mesh key={x} position={[x, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.24, 0.16, 12, 1]} />
          <meshBasicMaterial color={MOSS} {...wire} opacity={0.5} />
        </mesh>
      ))}
    </group>
  )
}

export function Occhiali() {
  return (
    <group scale={1.15}>
      {[-0.4, 0.4].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <torusGeometry args={[0.32, 0.045, 6, 18]} />
          <meshBasicMaterial color={MOSS} {...wire} opacity={0.55} />
        </mesh>
      ))}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.18, 6]} />
        <meshBasicMaterial color={FOREST} {...wire} opacity={0.5} />
      </mesh>
      {[-0.72, 0.72].map((x) => (
        <mesh key={x} position={[x, 0.06, -0.38]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.75, 5]} />
          <meshBasicMaterial color={FOREST} {...wire} opacity={0.4} />
        </mesh>
      ))}
    </group>
  )
}

export function Telecomando() {
  return (
    <group rotation={[0.5, 0, 0.15]}>
      <mesh>
        <boxGeometry args={[0.42, 1.15, 0.12, 2, 5, 1]} />
        <meshBasicMaterial color={MOSS} {...wire} opacity={0.5} />
      </mesh>
      {[0.32, 0.12, -0.08].map((y) => (
        <mesh key={y} position={[0, y, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.04, 8]} />
          <meshBasicMaterial color={FOREST} {...wire} opacity={0.55} />
        </mesh>
      ))}
    </group>
  )
}

export function Ingranaggio() {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.16, 24, 1]} />
        <meshBasicMaterial color={MOSS} {...wire} opacity={0.45} />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 0.56, Math.sin(a) * 0.56, 0]} rotation={[0, 0, a]}>
            <boxGeometry args={[0.16, 0.13, 0.15]} />
            <meshBasicMaterial color={MOSS} {...wire} opacity={0.45} />
          </mesh>
        )
      })}
      <mesh>
        <torusGeometry args={[0.16, 0.035, 6, 12]} />
        <meshBasicMaterial color={FOREST} {...wire} opacity={0.55} />
      </mesh>
    </group>
  )
}

export function Sedia() {
  return (
    <group position={[0, 0.1, 0]} scale={0.85}>
      <mesh>
        <boxGeometry args={[0.8, 0.08, 0.8, 2, 1, 2]} />
        <meshBasicMaterial color={MOSS} {...wire} opacity={0.5} />
      </mesh>
      <mesh position={[0, 0.55, -0.36]}>
        <boxGeometry args={[0.8, 1, 0.08, 2, 3, 1]} />
        <meshBasicMaterial color={MOSS} {...wire} opacity={0.5} />
      </mesh>
      {([[-0.34, -0.34], [0.34, -0.34], [-0.34, 0.34], [0.34, 0.34]] as const).map(([x, z], i) => (
        <mesh key={i} position={[x, -0.42, z]}>
          <cylinderGeometry args={[0.035, 0.03, 0.76, 5]} />
          {/* la gamba davanti-destra è "il ricambio": più marcata */}
          <meshBasicMaterial color={i === 3 ? MOSS : FOREST} {...wire} opacity={i === 3 ? 0.9 : 0.45} />
        </mesh>
      ))}
    </group>
  )
}

/* ── Item fluttuante: mini-canvas, come le card dello screenshot ── */

/* Ricolora tutti i wireframe (per usare le mesh su fondo scuro, es. footer) */
function Recolor({ color, children }: { color: string; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  useEffect(() => {
    ref.current?.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (mesh.isMesh) (mesh.material as THREE.MeshBasicMaterial).color.set(color)
    })
  }, [color])
  return <group ref={ref}>{children}</group>
}

export function FloatItem({
  size = 150,
  speed = 0.35,
  axis,
  tilt = 0.3,
  tiltZ = 0,
  duration = '8s',
  delay = '0s',
  color,
  style,
  children,
}: {
  size?: number
  speed?: number
  axis?: 'y' | 'z'
  tilt?: number
  tiltZ?: number
  duration?: string
  delay?: string
  color?: string
  style: CSSProperties
  children: ReactNode
}) {
  return (
    <div
      className="hero-float anim-float"
      style={{
        position: 'absolute',
        width: size,
        height: size,
        pointerEvents: 'none',
        animationDuration: duration,
        animationDelay: delay,
        ...style,
      }}
    >
      <Canvas gl={{ antialias: true, alpha: true }} camera={{ fov: 35, position: [0, 0, 3.4] }}>
        <group rotation={[tilt, 0, tiltZ]}>
          <Spin speed={speed} axis={axis}>
            {color ? <Recolor color={color}>{children}</Recolor> : children}
          </Spin>
        </group>
      </Canvas>
    </div>
  )
}

export default function HeroFloatingMeshes() {
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <FloatItem style={{ top: '12%', left: '12%' }} size={230} duration="7s" tiltZ={-0.25}>
        <Tazza />
      </FloatItem>
      <FloatItem style={{ top: '7%', left: '38%' }} size={170} duration="9s" delay="0.5s" speed={0.28} tiltZ={0.18}>
        <Moka />
      </FloatItem>
      <FloatItem style={{ top: '11%', right: '11%' }} size={245} duration="8s" delay="1s" tiltZ={0.3}>
        <Cuffie />
      </FloatItem>
      <FloatItem style={{ top: '45%', left: '7%' }} size={220} duration="8.5s" delay="1.5s" tilt={0.15} tiltZ={-0.15} speed={0.3}>
        <Occhiali />
      </FloatItem>
      <FloatItem style={{ top: '43%', right: '7%' }} size={205} duration="7.5s" delay="0.8s" tilt={0.35} tiltZ={0.2} speed={0.45} axis="z">
        <Ingranaggio />
      </FloatItem>
      <FloatItem style={{ bottom: '8%', left: '20%' }} size={200} duration="9s" delay="2s">
        <Telecomando />
      </FloatItem>
      <FloatItem style={{ bottom: '7%', right: '18%' }} size={235} duration="8s" delay="1.2s" tiltZ={-0.2}>
        <Sedia />
      </FloatItem>
    </div>
  )
}
