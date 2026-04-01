import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'

// ── Background colour ──────────────────────────────────────────────────────
function Background({ color }) {
  const { scene } = useThree()
  useEffect(() => { scene.background = new THREE.Color(color) }, [color, scene])
  return null
}

// ── Space dust — 10k near-black points ────────────────────────────────────
function SpaceDust() {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pts = new Float32Array(10000 * 3)
    for (let i = 0; i < 10000; i++) {
      pts[i * 3]     = (Math.random() - 0.5) * 200
      pts[i * 3 + 1] = (Math.random() - 0.5) * 200
      pts[i * 3 + 2] = (Math.random() - 0.5) * 200
    }
    g.setAttribute('position', new THREE.BufferAttribute(pts, 3))
    return g
  }, [])

  return (
    <points geometry={geo}>
      <pointsMaterial color="#888888" size={0.08} transparent opacity={0.25} sizeAttenuation />
    </points>
  )
}

// ── Planet ─────────────────────────────────────────────────────────────────
function Planet({ getAudioDataRef, config }) {
  const meshRef = useRef()
  const matRef = useRef()
  const atmoRef = useRef()

  useFrame((state) => {
    const data = getAudioDataRef.current?.()
    let bass = 0, amp = 0
    if (data) {
      let b = 0; for (let i = 0; i < 8; i++) b += data[i]
      bass = Math.min(1, b / 8 / 180)
      let a = 0; for (let i = 0; i < 32; i++) a += data[i]
      amp = Math.min(1, a / 32 / 160)
    }
    if (matRef.current) {
      matRef.current.distort = THREE.MathUtils.lerp(matRef.current.distort, config.distortBase + bass * config.distortAmp, 0.06)
      matRef.current.emissiveIntensity = THREE.MathUtils.lerp(matRef.current.emissiveIntensity, 0.5 + amp * 1.8, 0.08)
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0015 + bass * 0.012
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.08
    }
    if (atmoRef.current) {
      atmoRef.current.material.opacity = THREE.MathUtils.lerp(atmoRef.current.material.opacity, 0.08 + amp * 0.22, 0.06)
    }
  })

  return (
    <group scale={[10, 10, 10]}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 60]} />
        <MeshDistortMaterial
          ref={matRef}
          color={config.planet}
          emissive={config.glow}
          emissiveIntensity={0.5}
          distort={config.distortBase}
          speed={config.distortSpeed}
          roughness={0.15}
          metalness={0.1}
        />
      </mesh>
      <mesh ref={atmoRef}>
        <sphereGeometry args={[1.18, 32, 32]} />
        <meshBasicMaterial color={config.glow} transparent opacity={0.08} side={THREE.BackSide} depthWrite={false} />
      </mesh>
    </group>
  )
}

// ── Spark tubes — 20 tubes, animated dash offset ───────────────────────────
function Sparks({ getAudioDataRef, config }) {
  const groupRef = useRef()

  // Build curves exactly like solarstorm: 30 points in circular pattern, radius ~10
  const { geometries, speeds, colors } = useMemo(() => {
    const n = 20
    const radius = 10
    const geometries = []
    const speeds = []
    const cols = []

    for (let idx = 0; idx < n; idx++) {
      const pts = []
      const radiusVariance = 0.2 + Math.random() * 0.8
      for (let j = 0; j < 30; j++) {
        const angle = (j / 30) * Math.PI * 2
        pts.push(new THREE.Vector3(
          Math.cos(angle) * radius * radiusVariance + (Math.random() - 0.5) * 2,
          Math.sin(angle) * radius * radiusVariance + (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * radius * 0.5
        ))
      }
      const curve = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5)
      const points = curve.getPoints(200)
      const geo = new THREE.BufferGeometry().setFromPoints(points)
      geometries.push(geo)
      speeds.push(0.001 + Math.random() * 0.003)
      cols.push(config.sparks[Math.floor(Math.random() * config.sparks.length)])
    }
    return { geometries, speeds, colors: cols }
  }, [config.sparks])

  // Animate: rotate group slowly, scale with amplitude
  useFrame(() => {
    const data = getAudioDataRef.current?.()
    let amp = 0
    if (data) { let s = 0; for (let i = 0; i < 32; i++) s += data[i]; amp = Math.min(1, s / 32 / 160) }
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001 + amp * 0.004
      groupRef.current.rotation.x += 0.0003 + amp * 0.001
      const s = 1 + amp * 0.04
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, s, 0.05))
    }
  })

  return (
    <group ref={groupRef} position={[-20, -10, -10]} scale={[1, 1.3, 1]}>
      {geometries.map((geo, i) => (
        <line key={i} geometry={geo}>
          <lineBasicMaterial
            color={colors[i]}
            transparent
            opacity={0.6 + Math.random() * 0.35}
            linewidth={1}
          />
        </line>
      ))}
    </group>
  )
}

// ── Main export ────────────────────────────────────────────────────────────
export default function SolarScene({ config, getAudioData }) {
  const getAudioDataRef = useRef(getAudioData)
  useEffect(() => { getAudioDataRef.current = getAudioData }, [getAudioData])

  return (
    <Canvas
      camera={{ fov: 100, position: [0, 0, 30] }}
      style={{ position: 'absolute', inset: 0 }}
      gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
    >
      <Background color={config.bg} />
      <pointLight color="#ffffff" intensity={4} distance={100} />
      <SpaceDust />
      <Planet getAudioDataRef={getAudioDataRef} config={config} />
      <Sparks getAudioDataRef={getAudioDataRef} config={config} />
    </Canvas>
  )
}
