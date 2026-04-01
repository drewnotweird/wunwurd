import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'

export function SpaceDust({ count = 10000 }) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      t: Math.random() * 100,
      factor: 20 + Math.random() * 100,
      speed: 0.01 + Math.random() / 200,
      xFactor: -50 + Math.random() * 100,
      yFactor: -50 + Math.random() * 100,
      zFactor: -50 + Math.random() * 100,
    }))
  }, [count])

  useFrame(() => {
    particles.forEach((p, i) => {
      p.t += p.speed / 2
      const a = Math.cos(p.t) + Math.sin(p.t) / 10
      const b = Math.sin(p.t) + Math.cos(p.t * 2) / 10
      const s = Math.cos(p.t)
      dummy.position.set(
        p.xFactor + Math.cos(p.t / 10 * p.factor) + Math.sin(p.t) * p.factor / 10,
        p.yFactor + Math.sin(p.t / 10 * p.factor) + Math.cos(p.t * 2) * p.factor / 10,
        p.zFactor + Math.cos(p.t / 10 * p.factor) + Math.sin(p.t * 3) * p.factor / 10,
      )
      dummy.scale.setScalar(s)
      dummy.rotation.set(s * 5, s * 5, s * 5)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <dodecahedronGeometry args={[0.2, 0]} />
      <meshPhongMaterial color="#050505" />
    </instancedMesh>
  )
}
