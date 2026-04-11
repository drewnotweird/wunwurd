import { useEffect, useRef } from 'react'

export default function Timer({ duration, onTimeout }) {
  const barRef = useRef()
  const startRef = useRef(performance.now())
  const rafRef = useRef()
  const firedRef = useRef(false)

  useEffect(() => {
    function tick() {
      const elapsed = (performance.now() - startRef.current) / 1000
      const fraction = Math.max(0, 1 - elapsed / duration)

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${fraction})`
        // Green → yellow → red
        if (fraction > 0.5) {
          const t = (fraction - 0.5) * 2
          const r = Math.round((1 - t) * 255)
          barRef.current.style.backgroundColor = `rgb(${r}, 220, 0)`
        } else {
          const t = fraction * 2
          const g = Math.round(t * 180)
          barRef.current.style.backgroundColor = `rgb(255, ${g}, 0)`
        }
      }

      if (fraction <= 0) {
        if (!firedRef.current) {
          firedRef.current = true
          onTimeout()
        }
      } else {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [duration, onTimeout])

  return (
    <div className="timer-track">
      <div ref={barRef} className="timer-bar" />
    </div>
  )
}
