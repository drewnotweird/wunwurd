import { useRef, useEffect, useState } from 'react'
import Segment from './Segment'
import { titleHeads, titleBodies, titleLegs } from '../data/monsters'

export default function StartScreen({ onPlay, slideIn = false }) {
  const headRef = useRef()
  const bodyRef = useRef()
  const legsRef = useRef()
  const [pressed, setPressed] = useState(false)
  const [entering, setEntering] = useState(!!slideIn)

  // Slide down from above when returning from a game
  useEffect(() => {
    if (!slideIn) return
    const t = setTimeout(() => setEntering(false), 30)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // callbackActive gates handleSegmentDone so it only fires during the button-press spin
  const callbackActive = useRef(false)
  const doneCount = useRef(0)
  const pickedFaces = useRef({ head: 0, body: 0, legs: 0 })

  // Attract spin: machine starts on a monster face (index 0), quickly spins
  // through creatures and lands on the title (index 1).
  useEffect(() => {
    const t = setTimeout(() => {
      headRef.current?.spin(1, { laps: 1, duration: 850 })
      bodyRef.current?.spin(1, { laps: 1, duration: 980 })
      legsRef.current?.spin(1, { laps: 1, duration: 1100 })
    }, 300)
    return () => clearTimeout(t)
  }, [])

  function handleSegmentDone() {
    if (!callbackActive.current) return
    doneCount.current += 1
    if (doneCount.current >= 3) {
      callbackActive.current = false
      // titleHeads/Bodies/Legs: face 0 = heads[0], face 2 = heads[1]
      // Map to game indices: face 0 → 0, face 2 → 1
      const f = pickedFaces.current
      onPlay({ head: f.head / 2, body: f.body / 2, legs: f.legs / 2 })
    }
  }

  function handleButton() {
    if (pressed) return
    setPressed(true)
    doneCount.current = 0
    callbackActive.current = true
    // Spin each slot independently to face 0 or 2 (both are monster images)
    const pick = () => (Math.random() < 0.5 ? 0 : 2)
    const h = pick(), b = pick(), l = pick()
    pickedFaces.current = { head: h, body: b, legs: l }
    headRef.current?.spin(h, { laps: 1, duration: 1000 })
    bodyRef.current?.spin(b, { laps: 1, duration: 1150 })
    legsRef.current?.spin(l, { laps: 1, duration: 1300 })
  }

  return (
    <div className={`start-screen${pressed ? ' start-active' : ''}${entering ? ' entering' : ''}`}>
      <div className="generator-machine">
        <img
          className="generator-machine-img"
          src={`${import.meta.env.BASE_URL}images/machine.png`}
          alt=""
          draggable="false"
        />
        <div className="generator-tiles-overlay">
          <Segment ref={headRef} images={titleHeads} onDone={handleSegmentDone} />
          <Segment ref={bodyRef} images={titleBodies} onDone={handleSegmentDone} />
          <Segment ref={legsRef} images={titleLegs} onDone={handleSegmentDone} />
        </div>
        <button
          className={`generator-button${pressed ? ' pressed' : ''}`}
          onPointerDown={handleButton}
          aria-label="Play"
        />
      </div>

      {/* "Mash the button" hint — lives outside the machine so it can sit freely to the side */}
      <div className={`start-hint${pressed ? ' start-hint--out' : ''}`} aria-hidden="true">
        <p className="start-hint-text">Mash the<br />button<br />to start</p>
        <svg viewBox="0 0 110 48" className="start-hint-arrow">
          {/* Curved arrow pointing right toward the button */}
          <path d="M 6,24 C 24,8 70,40 104,24" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 104,24 L 88,12 M 104,24 L 88,36" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}
