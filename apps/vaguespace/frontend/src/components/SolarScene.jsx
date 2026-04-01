import { Canvas } from '@react-three/fiber'
import { CameraShake } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Planet } from './Planet.jsx'
import { Sparks } from './Sparks.jsx'
import { SpaceDust } from './SpaceDust.jsx'
import { Effects } from './Effects.jsx'

function Scene({ getAudioDataRef, config }) {
  return (
    <>
      <CameraShake yawFrequency={0.05} rollFrequency={0.2} pitchFrequency={0.1} />
      <pointLight distance={100} intensity={4} color="white" />
      <group>
        <Planet
          getAudioDataRef={getAudioDataRef}
          planetBg={config.planetBg}
          planetFg={config.planetFg}
        />
        <SpaceDust count={10000} />
        <Sparks count={20} colors={config.sparkColors} getAudioDataRef={getAudioDataRef} />
      </group>
      <Effects getAudioDataRef={getAudioDataRef} />
    </>
  )
}

export default function SolarScene({ config, getAudioData }) {
  const getAudioDataRef = useRef(getAudioData)
  useEffect(() => { getAudioDataRef.current = getAudioData }, [getAudioData])

  return (
    <Canvas
      camera={{ fov: 100, position: [0, 0, 30] }}
      style={{ position: 'absolute', inset: 0 }}
      gl={{ antialias: false }}
    >
      <Scene getAudioDataRef={getAudioDataRef} config={config} />
    </Canvas>
  )
}
