const BARS = {
  bouncy:  5,
  pulse:   3,
  jitter:  6,
  step:    4,
  wave:    5,
  breathe: 2,
}

export default function Equalizer({ eqStyle, isActive, accentColor }) {
  const count = BARS[eqStyle] || 4
  return (
    <div className={`eq eq--${eqStyle} ${isActive ? 'eq--active' : ''}`}
      style={{ '--accent': accentColor }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="eq-bar" style={{ '--i': i }} />
      ))}
    </div>
  )
}
