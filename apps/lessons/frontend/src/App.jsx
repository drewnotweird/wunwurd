import { useState, useEffect, useRef, useCallback } from 'react'
import { lessons } from './data/lessons.js'
import './App.css'

const TOTAL = lessons.length

function formatNum(n) {
  return `#${String(n + 1).padStart(3, '0')}`
}

export default function App() {
  const [idx, setIdx] = useState(0)
  const [displayNum, setDisplayNum] = useState(0)
  const [animClass, setAnimClass] = useState('')
  const [smallVisible, setSmallVisible] = useState(true)
  const transitioning = useRef(false)
  const touchStartX = useRef(null)
  const counterRef = useRef(null)

  // Pass fromIdx explicitly so go() has no stale closure on idx
  const go = useCallback((fromIdx, toIdx, dir) => {
    if (transitioning.current) return
    transitioning.current = true

    setAnimClass(`exit-${dir}`)
    setSmallVisible(false)

    // Step counter one at a time toward target
    clearInterval(counterRef.current)
    const step = toIdx > fromIdx ? 1 : -1
    let current = fromIdx
    counterRef.current = setInterval(() => {
      current += step
      setDisplayNum(current)
      if (current === toIdx) clearInterval(counterRef.current)
    }, 60)

    setTimeout(() => {
      setIdx(toIdx)
      setAnimClass(`enter-${dir}`)
      setSmallVisible(true)
      setTimeout(() => {
        setAnimClass('')
        transitioning.current = false
      }, 450)
    }, 300)
  }, [])

  const prev = useCallback(() => go(idx, (idx - 1 + TOTAL) % TOTAL, 'prev'), [idx, go])
  const next = useCallback(() => go(idx, (idx + 1) % TOTAL, 'next'), [idx, go])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  useEffect(() => () => clearInterval(counterRef.current), [])

  const onTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const onTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) < 40) return
    dx < 0 ? next() : prev()
  }, [prev, next])

  const lesson = lessons[idx]

  return (
    <div className="stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="bg" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}noise.gif)` }} />

      <p className="ui-label">Read / heard / thought / learned</p>
      <p className="ui-number">{formatNum(displayNum)}</p>

      {lesson.small && (
        <p className={`ui-small ${smallVisible ? 'small--in' : 'small--out'}`}>
          {lesson.small}
        </p>
      )}

      {lesson.shareUrl && (
        <p className="ui-share">
          <a href={lesson.shareUrl} target="_blank" rel="noopener noreferrer">Share ↗</a>
        </p>
      )}

      <div className={`content lesson-${idx + 1} ${animClass}`}>
        <p>{lesson.headline}</p>
      </div>

      <button className="nav nav--prev" onClick={prev} aria-label="Previous">&#8592;</button>
      <button className="nav nav--next" onClick={next} aria-label="Next">&#8594;</button>
    </div>
  )
}
