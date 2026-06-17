import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
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

type PrintMeshProps = {
  onProgressChange: (p: number) => void
}

function PrintMesh({ onProgressChange }: PrintMeshProps) {
  const groupRef = useRef<THREE.Group>(null)
  const progressRef = useRef(0.62)
  const dirRef = useRef(1)

  const geo = useMemo(() => buildDisplacedGeo(), [])

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

type PrintViewer3DProps = {
  onProgressChange?: (p: number) => void
}

export default function PrintViewer3D({ onProgressChange }: PrintViewer3DProps) {
  return (
    <Canvas
      gl={{ localClippingEnabled: true, antialias: true, alpha: true }}
      camera={{ fov: 42, position: [0.2, 0.7, 4.4], near: 0.1, far: 100 }}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      onCreated={({ camera }) => { camera.lookAt(0, 0.1, 0) }}
    >
      <PrintMesh onProgressChange={onProgressChange ?? (() => {})} />
    </Canvas>
  )
}
