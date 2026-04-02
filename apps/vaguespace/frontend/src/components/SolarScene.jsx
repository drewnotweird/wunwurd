import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshDistortMaterial, CameraShake } from '@react-three/drei'
import { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js'

// ── Planet ─────────────────────────────────────────────────────────────────
function Planet({ getAudioDataRef, config }) {
  const matRef = useRef()
  const meshRef = useRef()

  useFrame((state) => {
    const data = getAudioDataRef.current?.()
    let melody = 0, bass = 0
    if (data) {
      let b = 0; for (let i = 0; i < 8; i++) b += data[i]
      bass = Math.min(1, b / 8 / 200)
      let m = 0; for (let i = 8; i < 48; i++) m += data[i]
      melody = Math.min(1, m / 40 / 180)
    }
    if (matRef.current) {
      matRef.current.distort = THREE.MathUtils.lerp(matRef.current.distort, 0.4 + melody * 0.5, 0.05)
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002 + bass * 0.015
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.08) * 0.05
    }
  })

  return (
    <group scale={[10, 10, 10]}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          ref={matRef}
          color={config.planetBg}
          emissive={config.planetFg}
          emissiveIntensity={0.3}
          distort={0.4}
          speed={2}
          roughness={0.1}
        />
      </mesh>
    </group>
  )
}

// ── Space dust ─────────────────────────────────────────────────────────────
function SpaceDust() {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const particles = useMemo(() => Array.from({ length: 10000 }, () => ({
    t: Math.random() * 100,
    factor: 20 + Math.random() * 100,
    speed: 0.01 + Math.random() / 200,
    xFactor: -50 + Math.random() * 100,
    yFactor: -50 + Math.random() * 100,
    zFactor: -50 + Math.random() * 100,
  })), [])

  useFrame(() => {
    particles.forEach((p, i) => {
      p.t += p.speed / 2
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
    <instancedMesh ref={meshRef} args={[null, null, 10000]}>
      <dodecahedronGeometry args={[0.2, 0]} />
      <meshPhongMaterial color="#050505" />
    </instancedMesh>
  )
}

// ── Sparks — simple lines matching solarstorm layout ──────────────────────
function Sparks({ getAudioDataRef, config }) {
  const groupRef = useRef()
  const matsRef = useRef([])

  const lines = useMemo(() => {
    const radius = 10
    const rv = () => 0.2 + Math.random() * 0.8
    return Array.from({ length: 20 }, (_, index) => {
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
      const curve = new THREE.CatmullRomCurve3(points)
      const pts = curve.getPoints(200)
      const geo = new THREE.BufferGeometry().setFromPoints(pts)
      return {
        geo,
        color: config.sparkColors[Math.floor(Math.random() * config.sparkColors.length)],
        opacity: 0.4 + Math.random() * 0.5,
      }
    })
  }, [config.sparkColors])

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.0002
      groupRef.current.rotation.y += 0.0004
    }
  })

  return (
    <group ref={groupRef}>
      <group position={[-20, -10, -10]} scale={[1, 1.3, 1]}>
        {lines.map((l, i) => (
          <line key={i} geometry={l.geo}>
            <lineBasicMaterial
              color={l.color}
              transparent
              opacity={l.opacity}
              depthTest={false}
            />
          </line>
        ))}
      </group>
    </group>
  )
}

// ── Post-processing ────────────────────────────────────────────────────────
function Effects({ getAudioDataRef }) {
  const { gl, scene, camera, size } = useThree()
  const composerRef = useRef()
  const bloomRef = useRef()

  useEffect(() => {
    const composer = new EffectComposer(gl)
    composer.addPass(new RenderPass(scene, camera))
    const bloom = new UnrealBloomPass(new THREE.Vector2(size.width, size.height), 2, 1, 0)
    composer.addPass(bloom)
    bloomRef.current = bloom
    const film = new FilmPass(0.35)
    film.renderToScreen = true
    composer.addPass(film)
    composerRef.current = composer
    return () => composer.dispose()
  }, [gl, scene, camera])

  useEffect(() => {
    composerRef.current?.setSize(size.width, size.height)
  }, [size])

  useFrame(() => {
    if (!composerRef.current) return
    const data = getAudioDataRef.current?.()
    if (data && bloomRef.current) {
      let b = 0; for (let i = 0; i < 8; i++) b += data[i]
      const bass = Math.min(1, b / 8 / 200)
      bloomRef.current.strength = 1.75 + bass * 3
    }
    composerRef.current.render()
  }, 1)

  return null
}

// ── Scene ──────────────────────────────────────────────────────────────────
function Scene({ getAudioDataRef, config }) {
  return (
    <>
      <CameraShake yawFrequency={0.05} rollFrequency={0.2} pitchFrequency={0.1} />
      <pointLight distance={100} intensity={4} color="white" />
      <Planet getAudioDataRef={getAudioDataRef} config={config} />
      <SpaceDust />
      <Sparks getAudioDataRef={getAudioDataRef} config={config} />
      <Effects getAudioDataRef={getAudioDataRef} />
    </>
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
      onCreated={({ gl }) => gl.setClearColor(new THREE.Color('#020207'))}
    >
      <Scene getAudioDataRef={getAudioDataRef} config={config} />
    </Canvas>
  )
}
