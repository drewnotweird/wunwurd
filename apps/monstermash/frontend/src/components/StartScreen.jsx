import { useRef, useEffect, useState } from 'react'
import Segment from './Segment'
import { titleHeads, titleBodies, titleLegs } from '../data/monsters'

export default function StartScreen({ onPlay, slideIn = false }) {
  const headRef = useRef()
  const bodyRef = useRef()
  const legsRef = useRef()
  const [pressed, setPressed] = useState(false)
  const [entering, setEntering] = useState(!!slideIn)
  const [titleSettled, setTitleSettled] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [thumped, setThumped] = useState(false)

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
  // titleSettled fires at 1500ms (300ms delay + 1100ms longest spin + 100ms buffer).
  useEffect(() => {
    const spinTimer = setTimeout(() => {
      headRef.current?.spin(1, { laps: 1, duration: 850 })
      bodyRef.current?.spin(1, { laps: 1, duration: 980 })
      legsRef.current?.spin(1, { laps: 1, duration: 1100 })
    }, 300)
    const settleTimer = setTimeout(() => setTitleSettled(true), 1500)
    return () => { clearTimeout(spinTimer); clearTimeout(settleTimer) }
  }, [])

  function handleSegmentDone() {
    if (!callbackActive.current) return
    doneCount.current += 1
    if (doneCount.current >= 3) {
      callbackActive.current = false
      const f = pickedFaces.current
      onPlay({ head: f.head / 2, body: f.body / 2, legs: f.legs / 2 })
    }
  }

  function handleButton() {
    if (pressed || !titleSettled) return
    setPressed(true)
    setShaking(true)
    setThumped(true)
    setTimeout(() => setShaking(false), 600)
    setTimeout(() => setThumped(false), 1100)
    doneCount.current = 0
    callbackActive.current = true
    const pick = () => (Math.random() < 0.5 ? 0 : 2)
    const h = pick(), b = pick(), l = pick()
    pickedFaces.current = { head: h, body: b, legs: l }
    headRef.current?.spin(h, { laps: 1, duration: 1000 })
    bodyRef.current?.spin(b, { laps: 1, duration: 1150 })
    legsRef.current?.spin(l, { laps: 1, duration: 1300 })
  }

  const buttonLocked = !titleSettled || pressed

  return (
    <div className={`start-screen${pressed ? ' start-active' : ''}${entering ? ' entering' : ''}`}>
      <div className={`generator-machine${shaking ? ' shaking' : ''}`}>
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
        {thumped && (
          <>
            <div className="button-thud-ring button-thud-ring--1" />
            <div className="button-thud-ring button-thud-ring--2" />
            <div className="button-thud-ring button-thud-ring--3" />
            <div className="button-thud-ring button-thud-ring--4" />
            <div className="button-thud-ring button-thud-ring--5" />
          </>
        )}
        <button
          className={`generator-button${buttonLocked ? ' pressed' : ''}`}
          onPointerDown={handleButton}
          style={{ pointerEvents: buttonLocked ? 'none' : 'auto' }}
          aria-label="Play"
        />
      </div>

      {/* "Mash that button" hint — portrait: bottom centre with up arrow; landscape: left side with right arrow */}
      <div className={`start-hint${pressed ? ' start-hint--out' : ''}`} aria-hidden="true">
        <svg viewBox="0 0 48 80" className="hint-arrow--up" aria-hidden="true">
          <path d="M24,72 C20,52 28,32 24,8" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M24,8 L12,26 M24,8 L36,26" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
        <p className="start-hint-text">Mash that<br />button</p>
        <svg viewBox="0 0 110 56" className="hint-arrow--right" aria-hidden="true">
          <path d="M 6,20 C 24,8 70,44 104,32" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 104,32 L 88,20 M 104,32 L 92,44" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}
