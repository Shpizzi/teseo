import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

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

function HeroMesh() {
  const groupRef = useRef<THREE.Group>(null)
  const geo = useMemo(() => buildDisplacedGeo(), [])
  const clock = useRef(0)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    clock.current += delta
    groupRef.current.rotation.y += 0.003
    groupRef.current.rotation.x = Math.sin(clock.current * 0.2) * 0.06
    groupRef.current.position.y = Math.sin(clock.current * 0.4) * 0.08
  })

  return (
    <group ref={groupRef}>
      {/* Outer wireframe — faint cyan */}
      <mesh geometry={geo}>
        <meshBasicMaterial color={0xafe3f9} wireframe transparent opacity={0.18} />
      </mesh>
      {/* Inner solid — cyan fill very subtle */}
      <mesh geometry={geo}>
        <meshBasicMaterial color={0xafe3f9} transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>
      {/* Inner wireframe — white, denser */}
      <mesh geometry={geo} scale={0.97}>
        <meshBasicMaterial color={0xeaf4fb} wireframe transparent opacity={0.30} />
      </mesh>
    </group>
  )
}

export default function HeroViewer3D() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 38, position: [0, 0.2, 4.5], near: 0.1, far: 100 }}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      <HeroMesh />
    </Canvas>
  )
}
