export default function GameOver({ level, totalTime, onPlay }) {
  const timeStr = totalTime > 0 ? `${totalTime.toFixed(1)}s` : null

  return (
    <div className="gameover-screen">
      <div className="gameover-title">GAME<br />OVER!</div>

      <div className="gameover-level">
        Made it to level {level}
      </div>

      {timeStr && (
        <div className="gameover-time">
          Time so far: {timeStr}
        </div>
      )}

      <button className="replay-button" onPointerDown={onPlay}>
        TRY AGAIN
      </button>
    </div>
  )
}
