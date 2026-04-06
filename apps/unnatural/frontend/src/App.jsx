import { useRef, useCallback, useEffect } from 'react'
import Segment from './components/Segment.jsx'
import { head, body, legs } from './data/images.js'
import './App.css'

const COLOURS = ['#898cff', '#ff89b5', '#ffdc89', '#90d4f7', '#71e096', '#eca676', '#6893e2', '#ed6d79']

function uniqueIndices() {
  const targets = []
  while (targets.length < 3) {
    const idx = Math.floor(Math.random() * 8)
    if (!targets.includes(idx)) targets.push(idx)
  }
  return targets
}

// Pick the starting configuration once, before any render
const initialTargets = uniqueIndices()
const initialColour = Math.floor(Math.random() * COLOURS.length)

const SEGMENTS = [
  { key: 'head', images: head, label: 'Head' },
  { key: 'body', images: body, label: 'Body' },
  { key: 'legs', images: legs, label: 'Legs' },
]

export default function App() {
  const segRefs = useRef([])
  const stageRef = useRef(null)
  const colourIdx = useRef(initialColour)

  const advanceColour = useCallback(() => {
    colourIdx.current = (colourIdx.current + 1) % COLOURS.length
    stageRef.current.style.backgroundColor = COLOURS[colourIdx.current]
  }, [])

  const spin = useCallback(() => {
    const targets = uniqueIndices()
    segRefs.current.forEach((seg, i) => seg?.spin(targets[i]))
    advanceColour()
  }, [advanceColour])

  // Set initial colour and auto-spin on load
  useEffect(() => {
    stageRef.current.style.backgroundColor = COLOURS[colourIdx.current]
    const id = setTimeout(spin, 50)
    return () => clearTimeout(id)
  }, [])

  const handleTap = useCallback((e) => {
    e.preventDefault()
    spin()
  }, [spin])

  return (
    <div className="stage" ref={stageRef}>
      <div
        className="paper"
        onClick={handleTap}
        onTouchStart={handleTap}
      >
        {SEGMENTS.map(({ key, images, label }, i) => (
          <Segment
            key={key}
            ref={el => { segRefs.current[i] = el }}
            images={images}
            label={label}
            initialIdx={initialTargets[i]}
          />
        ))}
      </div>
    </div>
  )
}
