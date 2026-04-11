import { forwardRef, useState } from 'react'
import { heads, bodies, legs } from '../data/monsters'

export default forwardRef(function Card(
  { monster, position, cardW, cardH, active, fail, onTap, index, isSlapped, isWrong },
  ref
) {
  const { x, y, rotation, delay } = position

  const style = {
    '--rot': `${rotation}deg`,
    '--deal-delay': `${delay}s`,
    '--deal-dur': '0.55s',
    left: `${x}px`,
    top: `${y}px`,
    width: `${cardW}px`,
    height: `${cardH}px`,
    transform: `rotate(${rotation}deg)`,
    zIndex: index + 2,
  }

  let cls = 'card card--dealing'
  if (active) cls += ' card--active'
  if (isSlapped) cls += ' card--slapped'
  if (isWrong) cls += ' card--wrong'
  if (fail && !isSlapped && !isWrong) cls += ' card--fail-dim'

  return (
    <div
      ref={ref}
      className={cls}
      style={style}
      onPointerDown={active ? onTap : undefined}
    >
      <div className="card-part">
        <img src={heads[monster.head]} alt="" draggable="false" />
      </div>
      <div className="card-part">
        <img src={bodies[monster.body]} alt="" draggable="false" />
      </div>
      <div className="card-part">
        <img src={legs[monster.legs]} alt="" draggable="false" />
      </div>
    </div>
  )
})
