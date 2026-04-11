import { useMemo, useRef, useState } from 'react'
import Card from './Card'

function generateMonsters(correct, count) {
  const monsters = [{ ...correct, isCorrect: true }]
  const used = new Set([`${correct.head}-${correct.body}-${correct.legs}`])

  let attempts = 0
  while (monsters.length < count && attempts < 1000) {
    attempts++
    const m = {
      head: Math.floor(Math.random() * 3),
      body: Math.floor(Math.random() * 3),
      legs: Math.floor(Math.random() * 3),
    }
    const key = `${m.head}-${m.body}-${m.legs}`
    if (!used.has(key)) {
      used.add(key)
      monsters.push({ ...m, isCorrect: false })
    }
  }

  // Fisher-Yates shuffle
  for (let i = monsters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [monsters[i], monsters[j]] = [monsters[j], monsters[i]]
  }
  return monsters
}

function getLayout() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const EDGE = 50

  const availW = vw - EDGE * 2
  const availH = vh - EDGE * 2

  // Card width responsive to viewport
  const cardW = Math.max(90, Math.min(155, Math.floor(vw / 3.8)))
  const cardH = Math.round(cardW * 1.524) // 2088/1370 — exact part ratio

  // Step between card centres (slight gap so cards don't overlap by default)
  const stepX = Math.round(cardW * 1.08)
  const stepY = Math.round(cardH * 1.04)

  const cols = Math.max(2, Math.floor(availW / stepX))
  const rows = Math.max(2, Math.floor(availH / stepY))
  const count = Math.max(4, Math.min(9, cols * rows))

  return { cardW, cardH, count, cols, rows, EDGE, availW, availH, vw, vh }
}

function generatePositions({ cardW, cardH, count, vw, vh }) {
  const EDGE = 30
  // Two cards overlap if they're close in BOTH axes simultaneously.
  // Require 75% of card dimensions as minimum separation to keep cards readable.
  const sepX = cardW * 0.75
  const sepY = cardH * 0.75
  const positions = []

  for (let i = 0; i < count; i++) {
    let best = null
    let bestOverlapCount = Infinity

    for (let attempt = 0; attempt < 80; attempt++) {
      const x = EDGE + Math.random() * (vw - EDGE * 2 - cardW)
      const y = EDGE + Math.random() * (vh - EDGE * 2 - cardH)
      const overlaps = positions.filter(p =>
        Math.abs(x - p.x) < sepX && Math.abs(y - p.y) < sepY
      ).length

      if (overlaps === 0) { best = { x, y }; break }
      if (overlaps < bestOverlapCount) { bestOverlapCount = overlaps; best = { x, y } }
    }

    positions.push({
      x: best.x,
      y: best.y,
      rotation: (Math.random() - 0.5) * 50,
      delay: i * 0.055,
    })
  }
  return positions
}

export default function CardTable({ monster, level, active, onCardTap, fail }) {
  const { layout, monsters, positions } = useMemo(() => {
    const layout = getLayout()
    const monsters = generateMonsters(monster, layout.count)
    const positions = generatePositions(layout)
    return { layout, monsters, positions }
  }, []) // Calculate once on mount

  const cardRefs = useRef([])
  const [slappedIdx, setSlappedIdx] = useState(-1)
  const [wrongIdx, setWrongIdx] = useState(-1)

  function handleTap(index, isCorrect) {
    if (!active) return
    const rect = cardRefs.current[index]?.getBoundingClientRect()
    if (isCorrect) {
      setSlappedIdx(index)
    } else {
      setWrongIdx(index)
    }
    onCardTap(isCorrect, rect, monsters[index])
  }

  return (
    <div className={`card-table${fail ? ' fail' : ''}`}>
      {monsters.map((m, i) => (
        <Card
          key={i}
          ref={el => { cardRefs.current[i] = el }}
          monster={m}
          position={positions[i]}
          cardW={layout.cardW}
          cardH={layout.cardH}
          active={active}
          fail={fail || slappedIdx !== -1}
          onTap={() => handleTap(i, m.isCorrect)}
          index={i}
          isSlapped={i === slappedIdx}
          isWrong={i === wrongIdx}
        />
      ))}
    </div>
  )
}
