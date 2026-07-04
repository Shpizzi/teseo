import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// The displaced icosahedron mesh — byte-identical to prototype
function buildDisplacedGeo(): THREE.BufferGeometry {
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

// Center a scanned geometry, stand its longest axis vertical, and scale it to
// span ~2.4 units in Y so it fills the same frame + clip range as the procedural
// mesh. Textures/materials are dropped — the blueprint look is wireframe only.
function normalizeGeo(src: THREE.BufferGeometry): THREE.BufferGeometry {
  const g = src.clone()
  g.computeBoundingBox()
  let size = g.boundingBox!.getSize(new THREE.Vector3())
  if (size.x >= size.y && size.x >= size.z) g.rotateZ(Math.PI / 2)       // longest = X → up
  else if (size.z >= size.x && size.z >= size.y) g.rotateX(-Math.PI / 2) // longest = Z → up
  g.computeBoundingBox()
  const center = g.boundingBox!.getCenter(new THREE.Vector3())
  g.translate(-center.x, -center.y, -center.z)
  g.computeBoundingBox()
  size = g.boundingBox!.getSize(new THREE.Vector3())
  const scale = 2.4 / Math.max(size.x, size.y, size.z)
  g.scale(scale, scale, scale)
  g.computeVertexNormals()
  return g
}

type BodyProps = {
  geo: THREE.BufferGeometry
  onProgressChange: (p: number) => void
}

// Shared render: printed/to-print clipping split + auto-rotation + build plate.
function PrintBody({ geo, onProgressChange }: BodyProps) {
  const groupRef = useRef<THREE.Group>(null)
  const progressRef = useRef(0.62)
  const dirRef = useRef(1)

  const clipSolid = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), [])
  const clipWire  = useMemo(() => new THREE.Plane(new THREE.Vector3(0,  1, 0), 0), [])

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += 0.0045
    progressRef.current += 0.0006 * dirRef.current
    if (progressRef.current > 0.96) { progressRef.current = 0.96; dirRef.current = -1 }
    if (progressRef.current < 0.35) { progressRef.current = 0.35; dirRef.current =  1 }
    const printH = -1.25 + progressRef.current * 2.55
    clipSolid.constant = printH
    clipWire.constant  = -printH
    onProgressChange(Math.round(progressRef.current * 100))
  })

  const plateGeo = useMemo(() => new THREE.CylinderGeometry(1.3, 1.3, 0.16, 64), [])

  return (
    <group ref={groupRef}>
      {/* printed part — cyan fill */}
      <mesh geometry={geo}>
        <meshBasicMaterial color={0xafe3f9} transparent opacity={0.10} clippingPlanes={[clipSolid]} side={THREE.DoubleSide} />
      </mesh>
      {/* printed part — white wireframe */}
      <mesh geometry={geo}>
        <meshBasicMaterial color={0xeaf4fb} wireframe transparent opacity={0.50} clippingPlanes={[clipSolid]} />
      </mesh>
      {/* to-print — faint cyan wireframe */}
      <mesh geometry={geo}>
        <meshBasicMaterial color={0xafe3f9} wireframe transparent opacity={0.16} clippingPlanes={[clipWire]} />
      </mesh>
      {/* build plate */}
      <mesh geometry={plateGeo} position={[0, -1.32, 0]}>
        <meshBasicMaterial color={0xafe3f9} wireframe transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

function ProceduralMesh({ onProgressChange }: { onProgressChange: (p: number) => void }) {
  const geo = useMemo(() => buildDisplacedGeo(), [])
  return <PrintBody geo={geo} onProgressChange={onProgressChange} />
}

function LoadedMesh({ url, onProgressChange }: { url: string; onProgressChange: (p: number) => void }) {
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
  return <PrintBody geo={geo} onProgressChange={onProgressChange} />
}

type PrintViewer3DProps = {
  onProgressChange?: (p: number) => void
  modelUrl?: string // load a scanned .glb; omit for the procedural mesh
}

export default function PrintViewer3D({ onProgressChange, modelUrl }: PrintViewer3DProps) {
  const cb = onProgressChange ?? (() => {})
  return (
    <Canvas
      gl={{ localClippingEnabled: true, antialias: true, alpha: true }}
      camera={{ fov: 42, position: [0.2, 0.7, 4.4], near: 0.1, far: 100 }}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      onCreated={({ camera }) => { camera.lookAt(0, 0.1, 0) }}
    >
      <Suspense fallback={null}>
        {modelUrl ? <LoadedMesh url={modelUrl} onProgressChange={cb} /> : <ProceduralMesh onProgressChange={cb} />}
      </Suspense>
    </Canvas>
  )
}
