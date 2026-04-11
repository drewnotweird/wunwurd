import { useState, useRef } from 'react'
import Generator from './Generator'
import CardTable from './CardTable'
import HandSlap from './HandSlap'
import Timer from './Timer'
import CompareOverlay from './CompareOverlay'

export default function GameScreen({ level, totalLevels, onComplete, onGameOver, initialMonster }) {
  const [phase, setPhase] = useState('generating')
  // generating → countdown → playing → slapping (any tap) → done
  const [monster, setMonster] = useState(null)
  const [generatorRevealed, setGeneratorRevealed] = useState(false)
  const [slapTarget, setSlapTarget] = useState(null)
  const [slapCorrect, setSlapCorrect] = useState(false)
  const [wrongMonster, setWrongMonster] = useState(null)
  const [levelTime, setLevelTime] = useState(0)
  const startTimeRef = useRef(0)

  const timeLimit = 11 - level // 10s for L1, 1s for L10

  function handleMonsterLocked(m) {
    setMonster(m)
    setPhase('countdown')
  }

  function handleCountdownDone() {
    setGeneratorRevealed(true)
    startTimeRef.current = performance.now()
    // Short delay so generator starts moving before cards become interactive
    setTimeout(() => setPhase('playing'), 250)
  }

  function handleCardTap(isCorrect, rect, tappedMonster) {
    if (phase !== 'playing') return
    setSlapTarget(rect)
    setSlapCorrect(isCorrect)
    if (!isCorrect) setWrongMonster(tappedMonster)
    setPhase('slapping')
  }

  function handleTimeout() {
    if (phase !== 'playing') return
    setPhase('fail')
    // Let the shake settle, then lower curtain over the card table before exiting
    setTimeout(() => setGeneratorRevealed(false), 550)
    setTimeout(onGameOver, 1650)
  }

  function handleSlapDone() {
    const elapsed = (performance.now() - startTimeRef.current) / 1000
    if (slapCorrect) {
      setLevelTime(elapsed)
      setPhase('celebrating')
      // Lower curtain over celebration screen, then advance to next level
      setTimeout(() => setGeneratorRevealed(false), 1700)
      setTimeout(() => onComplete(elapsed, monster), 2800)
    } else {
      setPhase('comparing')
      // Lower curtain over compare screen, then exit to home
      setTimeout(() => setGeneratorRevealed(false), 2200)
      setTimeout(onGameOver, 3350)
    }
  }

  const tableActive = phase === 'playing'
  const tableFail = phase === 'fail' || phase === 'comparing' || phase === 'celebrating'

  return (
    <div className="game-screen">
      {/* Card table lives behind the generator curtain */}
      {monster && (
        <CardTable
          monster={monster}
          level={level}
          active={tableActive}
          onCardTap={handleCardTap}
          fail={tableFail || phase === 'slapping'}
        />
      )}

      {/* Timer bar — unmounts when player taps a card */}
      {phase === 'playing' && (
        <Timer duration={timeLimit} onTimeout={handleTimeout} />
      )}

      {/* Generator panel — slides up on reveal */}
      <Generator
        revealed={generatorRevealed}
        onLocked={handleMonsterLocked}
        initialMonster={initialMonster}
        autoStart={level === 1}
        showCountdown={phase === 'countdown'}
        onCountdownDone={handleCountdownDone}
        showHint={phase === 'generating' && level > 1}
      />

      {/* Hand slap overlay */}
      {phase === 'slapping' && slapTarget && (
        <HandSlap target={slapTarget} isCorrect={slapCorrect} onComplete={handleSlapDone} />
      )}

      {/* Level clear celebration */}
      {phase === 'celebrating' && (
        <div className="level-clear">
          <div className="level-clear-level">LEVEL {level}</div>
          <div className="level-clear-cleared">MASHED!</div>
          <div className="level-clear-time">{levelTime.toFixed(2)}s</div>
        </div>
      )}

      {/* Compare overlay — wrong vs correct after a bad tap */}
      {phase === 'comparing' && wrongMonster && monster && (
        <CompareOverlay wrongMonster={wrongMonster} correctMonster={monster} />
      )}
    </div>
  )
}
