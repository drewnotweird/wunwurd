import { useRef, useState, useEffect } from 'react'
import Segment from './Segment'
import { heads, bodies, legs } from '../data/monsters'

const COUNT_STEPS = ['3', '2', '1', 'MASH!']
const COUNT_DURATIONS = [900, 900, 900, 700]

export default function Generator({ revealed, onLocked, initialMonster, autoStart, showCountdown, onCountdownDone, slideIn = true }) {
  const headRef = useRef()
  const bodyRef = useRef()
  const legsRef = useRef()
  const targetRef = useRef(null)
  const doneCountRef = useRef(0)
  const [locked, setLocked] = useState(false)
  const [spinning, setSpinning] = useState(!!autoStart)
  const [buttonPressed, setButtonPressed] = useState(!!autoStart)
  const [entering, setEntering] = useState(!!slideIn)

  // Slide panel down from above on mount (only when slideIn is requested)
  useEffect(() => {
    if (!slideIn) return
    const t = setTimeout(() => setEntering(false), 30)
    return () => clearTimeout(t)
  }, [])

  // Countdown state — driven by showCountdown prop
  const [countStep, setCountStep] = useState(-1)

  useEffect(() => {
    if (showCountdown) setCountStep(0)
    else setCountStep(-1)
  }, [showCountdown])

  useEffect(() => {
    if (countStep < 0) return
    if (countStep >= COUNT_STEPS.length) {
      onCountdownDone?.()
      return
    }
    const t = setTimeout(() => setCountStep(s => s + 1), COUNT_DURATIONS[countStep])
    return () => clearTimeout(t)
  }, [countStep])

  useEffect(() => {
    if (!autoStart) return
    const h = Math.floor(Math.random() * 3)
    const b = Math.floor(Math.random() * 3)
    const l = Math.floor(Math.random() * 3)
    targetRef.current = { head: h, body: b, legs: l }
    doneCountRef.current = 0
    const t = setTimeout(() => {
      setSpinning(true)
      headRef.current?.spin(h)
      bodyRef.current?.spin(b)
      legsRef.current?.spin(l)
    }, 400)
    return () => clearTimeout(t)
  }, [autoStart])

  function handleButton() {
    if (spinning) return
    setButtonPressed(true)
    const h = Math.floor(Math.random() * 3)
    const b = Math.floor(Math.random() * 3)
    const l = Math.floor(Math.random() * 3)
    targetRef.current = { head: h, body: b, legs: l }
    doneCountRef.current = 0
    setSpinning(true)
    headRef.current?.spin(h)
    bodyRef.current?.spin(b)
    legsRef.current?.spin(l)
  }

  function handleSegmentDone() {
    doneCountRef.current += 1
    if (doneCountRef.current >= 3) {
      setLocked(true)
      setTimeout(() => onLocked(targetRef.current), 600)
    }
  }

  const countVisible = countStep >= 0 && countStep < COUNT_STEPS.length
  const isMash = countStep === 3

  return (
    <div className={`generator-panel${entering ? ' entering' : ''}${revealed ? ' revealed' : ''}${buttonPressed ? ' active' : ''}`}>
      <div className="generator-machine">
        <img
          className="generator-machine-img"
          src={`${import.meta.env.BASE_URL}images/machine.png`}
          alt=""
          draggable="false"
        />
        <div className="generator-tiles-overlay">
          <Segment ref={headRef} images={heads} onDone={handleSegmentDone} initialFace={initialMonster?.head ?? 0} />
          <Segment ref={bodyRef} images={bodies} onDone={handleSegmentDone} initialFace={initialMonster?.body ?? 0} />
          <Segment ref={legsRef} images={legs} onDone={handleSegmentDone} initialFace={initialMonster?.legs ?? 0} />
        </div>
        {locked && <div className="generator-locked-badge">LOCKED IN!</div>}
        <button
          className={`generator-button${spinning ? ' pressed' : ''}`}
          onPointerDown={handleButton}
          aria-label="Generate monster"
        />
        {countVisible && (
          <div
            className={`generator-countdown${isMash ? ' generator-countdown--mash' : ''}`}
            key={countStep}
          >
            {COUNT_STEPS[countStep]}
          </div>
        )}
      </div>

      {/* Wavy curtain bottom — hidden below fold when panel is fully down,
          sweeps through the viewport during slide transitions */}
      <svg
        className="generator-curtain-bottom"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,0 L1440,0 L1440,38 Q1260,82 1080,38 Q900,82 720,38 Q540,82 360,38 Q180,82 0,38 Z" />
      </svg>
    </div>
  )
}
