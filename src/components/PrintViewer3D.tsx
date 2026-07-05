import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'

// The displaced icosahedron mesh — byte-identical to prototype
export function buildDisplacedGeo(): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(1, 5)
  const pos = geo.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const n = v.clone().normalize()
    let d = 0
    d += 0.20 * Math.sin(2.8 * n.x + 1.2) * Math.cos(2.4 * n.y)
    d += 0.14 * Math.sin(4.0 * n.y + 0.4) * Math.cos(3.2 * n.z + 1.0)
    d += 0.09 * Math.sin(5.6 * n.z) * Math.cos(4.8 * n.x)
    d += 0.06 * Math.sin(9 * n.x * n.y + n.z)
    d += 0.10 * Math.max(0, n.y)
    v.addScaledVector(n, d)
    v.y *= 1.18
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  geo.computeVertexNormals()
  return geo
}

// Principal axis of the point cloud via power iteration on the covariance
// matrix — the true long axis of a tilted scan, which an axis-aligned bbox
// can't find.
function principalAxis(g: THREE.BufferGeometry): THREE.Vector3 {
  const pos = g.attributes.position
  const c = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) c.add(new THREE.Vector3().fromBufferAttribute(pos, i))
  c.divideScalar(pos.count)
  let xx = 0, xy = 0, xz = 0, yy = 0, yz = 0, zz = 0
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).sub(c)
    xx += v.x * v.x; xy += v.x * v.y; xz += v.x * v.z
    yy += v.y * v.y; yz += v.y * v.z; zz += v.z * v.z
  }
  const cov = new THREE.Matrix3().set(xx, xy, xz, xy, yy, yz, xz, yz, zz)
  const axis = new THREE.Vector3(1, 0.31, 0.19).normalize() // asymmetric seed
  for (let i = 0; i < 40; i++) {
    axis.applyMatrix3(cov)
    if (axis.lengthSq() < 1e-12) return new THREE.Vector3(0, 1, 0)
    axis.normalize()
  }
  return axis
}

// Center a scanned geometry, stand its true long axis vertical, and scale it to
// span ~2.4 units so it fills the same frame + clip range as the procedural
// mesh. Textures/materials are dropped — the blueprint look is wireframe only.
function normalizeGeo(src: THREE.BufferGeometry): THREE.BufferGeometry {
  const g = src.clone()
  const q = new THREE.Quaternion().setFromUnitVectors(principalAxis(g), new THREE.Vector3(0, 1, 0))
  g.applyQuaternion(q)
  g.computeBoundingBox()
  const center = g.boundingBox!.getCenter(new THREE.Vector3())
  g.translate(-center.x, -center.y, -center.z)
  g.computeBoundingBox()
  const size = g.boundingBox!.getSize(new THREE.Vector3())
  const scale = 2.4 / Math.max(size.x, size.y, size.z)
  g.scale(scale, scale, scale)
  g.computeVertexNormals()
  return g
}

type Tone = 'dark' | 'light'

// Su superfici scure il wireframe è lemongrass/carta; su card bianche
// servono moss/forest o non si vede niente.
const TONES = {
  dark:  { fill: 0xb2eb76, wire: 0xf4faed, ghost: 0xb2eb76, plate: 0xb2eb76, fillOp: 0.10, wireOp: 0.50 },
  light: { fill: 0x3f7308, wire: 0x18280e, ghost: 0x3f7308, plate: 0x3f7308, fillOp: 0.10, wireOp: 0.55 },
} as const

type BodyProps = {
  geo: THREE.BufferGeometry
  onProgressChange: (p: number) => void
  progress?: number // 0-100: blocca il clipping sull'avanzamento reale (niente animazione demo)
  tone: Tone
}

// Shared render: printed/to-print clipping split + auto-rotation + build plate.
function PrintBody({ geo, onProgressChange, progress, tone }: BodyProps) {
  const groupRef = useRef<THREE.Group>(null)
  const progressRef = useRef(progress !== undefined ? progress / 100 : 0.62)
  const dirRef = useRef(1)

  const clipSolid = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), [])
  const clipWire  = useMemo(() => new THREE.Plane(new THREE.Vector3(0,  1, 0), 0), [])

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += 0.0045
    if (progress !== undefined) {
      progressRef.current = progress / 100
    } else {
      progressRef.current += 0.0006 * dirRef.current
      if (progressRef.current > 0.96) { progressRef.current = 0.96; dirRef.current = -1 }
      if (progressRef.current < 0.35) { progressRef.current = 0.35; dirRef.current =  1 }
    }
    const printH = -1.25 + progressRef.current * 2.55
    clipSolid.constant = printH
    clipWire.constant  = -printH
    onProgressChange(Math.round(progressRef.current * 100))
  })

  const plateGeo = useMemo(() => new THREE.CylinderGeometry(1.3, 1.3, 0.16, 64), [])

  const c = TONES[tone]

  return (
    <group ref={groupRef}>
      {/* printed part — fill */}
      <mesh geometry={geo}>
        <meshBasicMaterial color={c.fill} transparent opacity={c.fillOp} clippingPlanes={[clipSolid]} side={THREE.DoubleSide} />
      </mesh>
      {/* printed part — wireframe */}
      <mesh geometry={geo}>
        <meshBasicMaterial color={c.wire} wireframe transparent opacity={c.wireOp} clippingPlanes={[clipSolid]} />
      </mesh>
      {/* to-print — faint wireframe */}
      <mesh geometry={geo}>
        <meshBasicMaterial color={c.ghost} wireframe transparent opacity={0.16} clippingPlanes={[clipWire]} />
      </mesh>
      {/* build plate */}
      <mesh geometry={plateGeo} position={[0, -1.32, 0]}>
        <meshBasicMaterial color={c.plate} wireframe transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

function ProceduralMesh({ onProgressChange, progress, tone }: { onProgressChange: (p: number) => void; progress?: number; tone: Tone }) {
  const geo = useMemo(() => buildDisplacedGeo(), [])
  return <PrintBody geo={geo} onProgressChange={onProgressChange} progress={progress} tone={tone} />
}

function LoadedMesh({ url, onProgressChange, progress, tone }: { url: string; onProgressChange: (p: number) => void; progress?: number; tone: Tone }) {
  const { scene } = useGLTF(url)
  const geo = useMemo(() => {
    scene.updateMatrixWorld(true)
    let picked: THREE.BufferGeometry | undefined
    scene.traverse(o => {
      const m = o as THREE.Mesh
      if (m.isMesh && m.geometry && !picked) {
        picked = m.geometry.clone()
        picked.applyMatrix4(m.matrixWorld)
      }
    })
    return normalizeGeo(picked ?? new THREE.IcosahedronGeometry(1, 2))
  }, [scene])
  return <PrintBody geo={geo} onProgressChange={onProgressChange} progress={progress} tone={tone} />
}

type PrintViewer3DProps = {
  onProgressChange?: (p: number) => void
  modelUrl?: string // load a scanned .glb; omit for the procedural mesh
  progress?: number // 0-100: pin del clipping sull'avanzamento reale
  tone?: Tone // 'light' per i viewer dentro card bianche
}

// Fetch the scanned mesh ahead of the result state so the viewer isn't blank.
useGLTF.preload('/meshes/remote.glb')

export default function PrintViewer3D({ onProgressChange, modelUrl, progress, tone = 'dark' }: PrintViewer3DProps) {
  const cb = onProgressChange ?? (() => {})
  return (
    <Canvas
      gl={{ localClippingEnabled: true, antialias: true, alpha: true }}
      camera={{ fov: 42, position: [0.2, 0.7, 4.4], near: 0.1, far: 100 }}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      onCreated={({ camera }) => { camera.lookAt(0, 0.1, 0) }}
    >
      <Suspense
        fallback={
          <Html center>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.08em', color: 'var(--cyan)', whiteSpace: 'nowrap' }}>
              CARICAMENTO MODELLO 3D…
            </span>
          </Html>
        }
      >
        {modelUrl ? <LoadedMesh url={modelUrl} onProgressChange={cb} progress={progress} tone={tone} /> : <ProceduralMesh onProgressChange={cb} progress={progress} tone={tone} />}
      </Suspense>
    </Canvas>
  )
}
