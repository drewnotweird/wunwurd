import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import '../lib/MeshLine.js'

function FatLine({ curve, width, color, speed, getAudioDataRef }) {
  const matRef = useRef()

  useFrame(() => {
    if (!matRef.current) return
    matRef.current.uniforms.dashOffset.value -= speed

    const data = getAudioDataRef.current?.()
    if (data) {
      let d = 0; for (let i = 8; i < 24; i++) d += data[i]
      const drums = Math.min(1, d / 16 / 180)
      if (drums > 0.1) {
        // map drums 0.2-0.4 -> lineWidth 0.1x-2x (original behaviour)
        const t = Math.min(1, Math.max(0, (drums - 0.1) / 0.3))
        matRef.current.uniforms.lineWidth.value = width * (0.1 + t * 1.9)
      }
    }
  })

  return (
    <mesh>
      <meshLine attach="geometry" points={curve} />
      <meshLineMaterial
        attach="material"
        ref={matRef}
        transparent
        depthTest={false}
        lineWidth={width}
        color={color}
        dashArray={0.1}
        dashRatio={0.95}
        resolution={[window.innerWidth, window.innerHeight]}
      />
    </mesh>
  )
}

export function Sparks({ count = 20, colors, radius = 10, getAudioDataRef }) {
  const groupRef = useRef()
  const { size, viewport } = useThree()

  const lines = useMemo(() => {
    return Array.from({ length: count }, (_, index) => {
      const rv = () => 0.2 + Math.random() * 0.8
      const pos = new THREE.Vector3(
        Math.sin(0) * radius * rv(),
        Math.cos(0) * radius * rv(),
        0
      )
      const points = Array.from({ length: 30 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2
        return pos.add(new THREE.Vector3(
          Math.sin(angle) * radius * rv(),
          Math.cos(angle) * radius * rv(),
          0
        )).clone()
      })
      const curve = new THREE.CatmullRomCurve3(points).getPoints(1000)
      return {
        color: colors[Math.floor(Math.random() * colors.length)],
        width: Math.max(0.1, (0.2 * index) / 10),
        speed: Math.max(0.001, 0.004 * Math.random()),
        curve,
      }
    })
  }, [count, colors, radius])

  useFrame(() => {
    if (!groupRef.current) return
    const aspect = size.width / viewport.width
    // Subtle rotation only — no mouse in our version
    groupRef.current.rotation.x += 0.0003
    groupRef.current.rotation.y += 0.0005
  })

  return (
    <group ref={groupRef}>
      <group position={[-radius * 2, -radius, -10]} scale={[1, 1.3, 1]}>
        {lines.map((props, i) => (
          <FatLine key={i} {...props} getAudioDataRef={getAudioDataRef} />
        ))}
      </group>
    </group>
  )
}
