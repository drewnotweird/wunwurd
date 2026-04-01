import { Canvas, useFrame } from '@react-three/fiber'
import { Icosahedron, Points } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import './Visualizer.css'

// Audio-reactive mesh
function ReactiveGeometry({ audioData, baseColor, accentColor }) {
  const meshRef = useRef()
  const materialsRef = useRef([])
  
  useFrame(() => {
    if (!meshRef.current || !audioData) return
    
    // Rotate based on average audio frequency
    const avgFreq = audioData.reduce((a, b) => a + b) / audioData.length / 255
    meshRef.current.rotation.x += avgFreq * 0.01
    meshRef.current.rotation.y += avgFreq * 0.015
    
    // Scale based on bass frequencies
    const bass = audioData.slice(0, 10).reduce((a, b) => a + b) / 10 / 255
    meshRef.current.scale.set(1 + bass * 0.3, 1 + bass * 0.3, 1 + bass * 0.3)
  })

  return (
    <Icosahedron ref={meshRef} args={[2, 4]} scale={1}>
      <meshPhongMaterial
        color={accentColor}
        emissive={baseColor}
        emissiveIntensity={0.5}
        wireframe={false}
      />
    </Icosahedron>
  )
}

// Particle system
function AudioParticles({ audioData }) {
  const pointsRef = useRef()
  const particleCount = 100

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20
      positions[i + 1] = (Math.random() - 0.5) * 20
      positions[i + 2] = (Math.random() - 0.5) * 20
    }
    
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geom
  }, [])

  useFrame(() => {
    if (!pointsRef.current || !audioData) return

    const positions = pointsRef.current.geometry.attributes.position.array
    for (let i = 0; i < positions.length; i += 3) {
      const freq = audioData[(i / 3) % audioData.length] / 255
      positions[i + 2] += freq * 0.1
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <Points ref={pointsRef} geometry={geometry}>
      <pointsMaterial color="#ffffff" size={0.1} sizeAttenuation transparent />
    </Points>
  )
}

// Main Visualizer
export default function Visualizer({ audioData, baseColor = '#0d0d1a', accentColor = '#4a6fa5' }) {
  return (
    <div className="visualizer">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <color attach="background" args={[baseColor]} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <ReactiveGeometry 
          audioData={audioData} 
          baseColor={baseColor} 
          accentColor={accentColor} 
        />
        <AudioParticles audioData={audioData} />
      </Canvas>
    </div>
  )
}
