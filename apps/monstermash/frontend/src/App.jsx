import { useState, useRef } from 'react'
import StartScreen from './components/StartScreen'
import GameScreen from './components/GameScreen'
import GameOver from './components/GameOver'
import WinScreen from './components/WinScreen'
import './App.css'

const TOTAL_LEVELS = 10

export default function App() {
  const [screen, setScreen] = useState('start')
  const [level, setLevel] = useState(1)
  const [totalTime, setTotalTime] = useState(0)
  const accTimeRef = useRef(0)
  const levelRef = useRef(1)
  const prevMonsterRef = useRef(null) // arrangement to start each generator from
  const startSlideInRef = useRef(false) // true when returning from game

  function startGame(initialMonster) {
    prevMonsterRef.current = initialMonster ?? null
    levelRef.current = 1
    accTimeRef.current = 0
    setLevel(1)
    setTotalTime(0)
    setScreen('game')
  }

  function onLevelComplete(timeUsed, lockedMonster) {
    prevMonsterRef.current = lockedMonster ?? null
    accTimeRef.current += timeUsed
    if (levelRef.current >= TOTAL_LEVELS) {
      setTotalTime(accTimeRef.current)
      setScreen('win')
    } else {
      levelRef.current += 1
      setLevel(levelRef.current)
    }
  }

  function onGameOver() {
    // Generator curtain is already fully down when this fires — start screen
    // appears seamlessly beneath it, no additional slide-in needed.
    startSlideInRef.current = false
    setScreen('start')
  }

  return (
    <div className="app-root">
      {screen === 'start' && <StartScreen onPlay={startGame} slideIn={startSlideInRef.current} />}
      {screen === 'game' && (
        <GameScreen
          key={level}
          level={level}
          totalLevels={TOTAL_LEVELS}
          onComplete={onLevelComplete}
          onGameOver={onGameOver}
          initialMonster={prevMonsterRef.current}
        />
      )}
      {screen === 'gameover' && (
        <GameOver level={level} totalTime={totalTime} onPlay={startGame} />
      )}
      {screen === 'win' && (
        <WinScreen totalTime={totalTime} onPlay={startGame} />
      )}
    </div>
  )
}
