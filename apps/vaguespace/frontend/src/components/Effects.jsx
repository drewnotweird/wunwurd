import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js'
import * as THREE from 'three'

export function Effects({ getAudioDataRef }) {
  const { gl, scene, camera, size } = useThree()
  const composerRef = useRef()
  const bloomRef = useRef()

  useEffect(() => {
    const composer = new EffectComposer(gl)
    composer.addPass(new RenderPass(scene, camera))

    const bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 2, 1, 0)
    composer.addPass(bloom)
    bloomRef.current = bloom

    const film = new FilmPass(0.35)
    film.renderToScreen = true
    composer.addPass(film)

    composerRef.current = composer
    composer.setSize(size.width, size.height)

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
      // map bass 0-0.25 -> bloom 1.75-2.5 (original mapping)
      bloomRef.current.strength = 1.75 + Math.min(bass / 0.25, 1) * 0.75
    }
    composerRef.current.render()
  }, 1)

  return null
}
