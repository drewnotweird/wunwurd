import { useEffect, useState } from 'react'

const STEPS = ['3', '2', '1', 'MASH!']
const DURATIONS = [500, 500, 500, 500]

export default function Countdown({ onDone }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (step >= STEPS.length) {
      onDone()
      return
    }
    const t = setTimeout(() => setStep(s => s + 1), DURATIONS[step])
    return () => clearTimeout(t)
  }, [step])

  if (step >= STEPS.length) return null

  const isMash = step === 3

  return (
    <div className="countdown-overlay">
      <div className={`countdown-number${isMash ? ' mash' : ''}`} key={step}>
        {STEPS[step]}
      </div>
    </div>
  )
}
