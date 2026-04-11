import { useMemo } from 'react'

const CONFETTI_COLOURS = [
  '#ffd54f', '#ff5722', '#4caf50', '#2196f3', '#e91e63',
  '#9c27b0', '#00bcd4', '#ff9800', '#8bc34a', '#f44336',
]

function getPlayerTitle(totalTime) {
  if (totalTime <= 10) return 'ULTIMATE MEGA MONSTER BASHER!!!'
  if (totalTime <= 20) return 'PROFESSIONAL MONSTER MASHER!!'
  if (totalTime <= 30) return 'SEASONED SLAPPER!'
  if (totalTime <= 45) return 'AMATEUR MASHER'
  if (totalTime <= 60) return 'NERVOUS NOVICE'
  return 'LUCKY WINNER'
}

function Confetti() {
  const pieces = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2.5 + Math.random() * 2,
      color: CONFETTI_COLOURS[i % CONFETTI_COLOURS.length],
      spin: `${(Math.random() - 0.5) * 1440}deg`,
    }))
  }, [])

  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            '--spin': p.spin,
          }}
        />
      ))}
    </div>
  )
}

export default function WinScreen({ totalTime, onPlay }) {
  const title = getPlayerTitle(totalTime)
  const timeStr = totalTime.toFixed(1)

  return (
    <div className="win-screen">
      <Confetti />

      <div className="win-title" style={{ position: 'relative', zIndex: 1 }}>
        YOU<br />WIN!
      </div>

      <div className="win-player-title" style={{ position: 'relative', zIndex: 1 }}>
        {title}
      </div>

      <div className="win-time" style={{ position: 'relative', zIndex: 1 }}>
        All 15 levels in {timeStr}s
      </div>

      <button
        className="replay-button"
        onPointerDown={onPlay}
        style={{ position: 'relative', zIndex: 1, background: 'linear-gradient(135deg, #ffd54f 0%, #ff9800 100%)', color: '#1a0a2e' }}
      >
        PLAY AGAIN
      </button>
    </div>
  )
}
