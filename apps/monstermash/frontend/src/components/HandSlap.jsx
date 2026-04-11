import { useEffect, useRef, useState } from 'react'

export default function HandSlap({ target, isCorrect, onComplete }) {
  const handRef = useRef()
  const [impact, setImpact] = useState(null) // { x, y, correct }

  useEffect(() => {
    if (!target || !handRef.current) return
    const el = handRef.current

    // Hand SVG is 120×160: stick at top, palm+fingers at bottom
    const handW = 120
    const handH = 160

    // Center hand horizontally on card, fingers aimed at upper-third of card
    const targetX = target.left + target.width / 2 - handW / 2
    const impactY = target.top + target.height * 0.22
    // Position element so bottom of SVG (fingers) hits impactY
    const elementY = impactY - handH + 20

    // Start entirely above screen
    el.style.transition = 'none'
    el.style.opacity = '1'
    el.style.left = `${targetX}px`
    el.style.top = `-${handH + 10}px`

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Fast slam with slight overshoot
        el.style.transition = 'top 0.17s cubic-bezier(0.4, 0, 0.2, 1.4)'
        el.style.top = `${elementY}px`
      })
    })

    // Impact moment — show burst/text
    const t1 = setTimeout(() => {
      setImpact({
        x: target.left + target.width / 2,
        y: target.top + target.height * 0.2,
        correct: isCorrect,
      })
    }, 200)

    // Retract hand — held at impact for a beat, then pulls back
    const t2 = setTimeout(() => {
      el.style.transition = 'top 0.32s cubic-bezier(0.4, 0, 0.8, 1)'
      el.style.top = `-${handH + 10}px`
    }, 550)

    const t3 = setTimeout(onComplete, 1400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [target])

  const accentColor = isCorrect ? '#69f0ae' : '#ff5252'

  return (
    <>
      {/* The hand */}
      <div
        ref={handRef}
        style={{ position: 'fixed', zIndex: 30, pointerEvents: 'none', opacity: 0 }}
      >
        <svg viewBox="0 0 120 160" width="120" height="160">
          {/* Stick / handle */}
          <rect x="54" y="0" width="16" height="88" rx="7" fill="#5d4037" />
          <rect x="57" y="0" width="5" height="88" rx="3" fill="#8d6e63" opacity="0.5" />
          {/* Wrist connector */}
          <ellipse cx="62" cy="92" rx="22" ry="13" fill="#795548" />
          {/* Palm — facing downward */}
          <ellipse cx="62" cy="112" rx="38" ry="26" fill="#ffcc80" />
          <ellipse cx="62" cy="106" rx="32" ry="18" fill="#ffb74d" opacity="0.45" />
          {/* Fingers pointing down */}
          <ellipse cx="26" cy="136" rx="11" ry="22" fill="#ffcc80" transform="rotate(-14 26 136)" />
          <ellipse cx="42" cy="143" rx="11" ry="24" fill="#ffcc80" transform="rotate(-4 42 143)" />
          <ellipse cx="58" cy="146" rx="11" ry="24" fill="#ffcc80" />
          <ellipse cx="74" cy="143" rx="11" ry="24" fill="#ffcc80" transform="rotate(4 74 143)" />
          <ellipse cx="90" cy="136" rx="10" ry="22" fill="#ffcc80" transform="rotate(14 90 136)" />
          {/* Thumb (left side) */}
          <ellipse cx="16" cy="108" rx="10" ry="18" fill="#ffcc80" transform="rotate(28 16 108)" />
          {/* Knuckle bumps */}
          <circle cx="28" cy="120" r="4.5" fill="#ffb74d" opacity="0.7" />
          <circle cx="43" cy="117" r="4.5" fill="#ffb74d" opacity="0.7" />
          <circle cx="58" cy="116" r="4.5" fill="#ffb74d" opacity="0.7" />
          <circle cx="73" cy="117" r="4.5" fill="#ffb74d" opacity="0.7" />
          <circle cx="88" cy="120" r="4.5" fill="#ffb74d" opacity="0.7" />
          {/* Nail tips */}
          <ellipse cx="25" cy="154" rx="5" ry="4" fill="#ffe0b2" opacity="0.8" transform="rotate(-14 25 154)" />
          <ellipse cx="41" cy="163" rx="5" ry="4" fill="#ffe0b2" opacity="0.8" transform="rotate(-4 41 163)" />
          <ellipse cx="57" cy="166" rx="5" ry="4" fill="#ffe0b2" opacity="0.8" />
          <ellipse cx="73" cy="163" rx="5" ry="4" fill="#ffe0b2" opacity="0.8" transform="rotate(4 73 163)" />
          <ellipse cx="89" cy="154" rx="5" ry="4" fill="#ffe0b2" opacity="0.8" transform="rotate(14 89 154)" />
        </svg>
      </div>

      {/* Screen flash */}
      {impact && (
        <div
          className="impact-flash"
          style={{ '--flash-color': isCorrect ? 'rgba(105,240,174,0.3)' : 'rgba(255,82,82,0.4)' }}
        />
      )}

      {/* Impact burst lines */}
      {impact && (
        <svg
          className="impact-burst"
          viewBox="0 0 140 140"
          width="140"
          height="140"
          style={{ left: impact.x - 70, top: impact.y - 70, position: 'fixed', zIndex: 32, pointerEvents: 'none' }}
        >
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
            const rad = (angle * Math.PI) / 180
            return (
              <line
                key={angle}
                x1="70" y1="70"
                x2={70 + Math.cos(rad) * 62}
                y2={70 + Math.sin(rad) * 62}
                stroke={accentColor}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            )
          })}
          <circle cx="70" cy="70" r="12" fill={accentColor} opacity="0.8" />
        </svg>
      )}

      {/* MASH! / WRONG! text */}
      {impact && (
        <div
          className={`slap-impact${isCorrect ? '' : ' slap-impact--wrong'}`}
          style={{ left: impact.x - 55, top: impact.y - 40, position: 'fixed' }}
        >
          {isCorrect ? 'MASH!' : 'WRONG!'}
        </div>
      )}
    </>
  )
}
