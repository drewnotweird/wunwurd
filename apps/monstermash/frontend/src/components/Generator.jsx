import { useRef, useState, useEffect } from 'react'
import Segment from './Segment'
import { heads, bodies, legs } from '../data/monsters'

const COUNT_STEPS = ['3', '2', '1', 'MASH!']
const COUNT_DURATIONS = [900, 900, 900, 700]

export default function Generator({ revealed, onLocked, initialMonster, autoStart, showCountdown, onCountdownDone, showHint = false }) {
  const headRef = useRef()
  const bodyRef = useRef()
  const legsRef = useRef()
  const targetRef = useRef(null)
  const doneCountRef = useRef(0)
  const [locked, setLocked] = useState(false)
  const [spinning, setSpinning] = useState(!!autoStart)
  const [buttonPressed, setButtonPressed] = useState(!!autoStart)
  const [shaking, setShaking] = useState(false)
  const [thumped, setThumped] = useState(false)

  // Reset button colour after curtain rises off-screen (~1100ms transition)
  useEffect(() => {
    if (!revealed) return
    const t = setTimeout(() => setButtonPressed(false), 1100)
    return () => clearTimeout(t)
  }, [revealed])

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
    setShaking(true)
    setThumped(true)
    setTimeout(() => setShaking(false), 600)
    setTimeout(() => setThumped(false), 1100)
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
      setButtonPressed(false) // start fading background back to purple immediately
      setTimeout(() => onLocked(targetRef.current), 600)
    }
  }

  const countVisible = countStep >= 0 && countStep < COUNT_STEPS.length
  const isMash = countStep === 3

  return (
    <div className={`generator-panel${revealed ? ' revealed' : ''}${buttonPressed ? ' active' : ''}`}>

      {/* Starburst — rendered before machine so it's behind it in DOM stacking order */}
      {locked && <div className="generator-starburst" aria-hidden="true" />}

      <div className={`generator-machine${shaking ? ' shaking' : ''}`}>
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
          className={`generator-button${spinning ? ' pressed' : ''}`}
          onPointerDown={handleButton}
          aria-label="Generate monster"
        />
      </div>

      {/* Countdown — outside machine, positioned to the right in landscape */}
      {countVisible && (
        <div
          className={`generator-countdown${isMash ? ' generator-countdown--mash' : ''}`}
          key={countStep}
        >
          {COUNT_STEPS[countStep]}
        </div>
      )}

      {/* "Find this monster and mash it!" hint — when locked, during countdown */}
      {locked && (
        <div className="panel-hint" key="find-hint" aria-hidden="true">
          <svg viewBox="0 0 48 80" className="hint-arrow--up" aria-hidden="true">
            <path d="M24,72 C20,52 28,32 24,8" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M24,8 L12,26 M24,8 L36,26" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
          <p className="panel-hint-text">Find this<br />monster<br />and mash it!</p>
          <svg viewBox="0 0 110 56" className="hint-arrow--right" aria-hidden="true">
            <path d="M 6,28 C 24,12 70,44 104,28" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 104,28 L 88,16 M 104,28 L 88,40" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* "Ready to mash again?" hint — between levels, before player presses */}
      {showHint && !spinning && !locked && (
        <div className="panel-hint" key="ready-hint" aria-hidden="true">
          <p className="panel-hint-text">Ready to<br />mash again?</p>
          <svg viewBox="0 0 48 80" className="hint-arrow--up" aria-hidden="true">
            <path d="M24,8 C20,28 28,52 24,72" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M24,72 L12,54 M24,72 L36,54" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
          <svg viewBox="0 0 110 56" className="hint-arrow--right" aria-hidden="true">
            <path d="M 6,28 C 24,12 70,44 104,28" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 104,28 L 88,16 M 104,28 L 88,40" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* Wavy curtain bottom */}
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
