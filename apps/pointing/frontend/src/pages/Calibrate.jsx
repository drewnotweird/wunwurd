import { useState, useRef } from 'react'

// Drop your photo filenames here to calibrate them
const PHOTOS_TO_CALIBRATE = [
  // 'photos/point01.jpg',
  // 'photos/point02.jpg',
]

export default function Calibrate() {
  const [idx, setIdx] = useState(0)
  const [hotspots, setHotspots] = useState([])
  const [marker, setMarker] = useState(null)
  const imgRef = useRef(null)
  const BASE = import.meta.env.BASE_URL

  const photo = PHOTOS_TO_CALIBRATE[idx]

  const handleClick = (e) => {
    const rect = imgRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setMarker({ x: e.clientX - rect.left, y: e.clientY - rect.top })

    const entry = { src: photo, hotspot: { x: +x.toFixed(4), y: +y.toFixed(4) } }
    setHotspots(prev => {
      const updated = [...prev]
      updated[idx] = entry
      return updated
    })
  }

  const next = () => {
    if (idx < PHOTOS_TO_CALIBRATE.length - 1) {
      setIdx(i => i + 1)
      setMarker(null)
    }
  }

  const output = hotspots
    .filter(Boolean)
    .map(h => `  { src: '${h.src}', hotspot: { x: ${h.hotspot.x}, y: ${h.hotspot.y} } },`)
    .join('\n')

  if (!PHOTOS_TO_CALIBRATE.length) {
    return (
      <div style={{ padding: '4rem', fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
        <p>Add your photo filenames to <code>PHOTOS_TO_CALIBRATE</code> in <code>src/pages/Calibrate.jsx</code></p>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300, padding: '2rem' }}>
      <h2 style={{ fontWeight: 400, marginBottom: '0.5rem' }}>
        Calibrate {idx + 1} / {PHOTOS_TO_CALIBRATE.length}: <code>{photo}</code>
      </h2>
      <p style={{ marginBottom: '1rem', opacity: 0.6 }}>Click on the tip of your pointing finger.</p>

      <div style={{ position: 'relative', display: 'inline-block', cursor: 'crosshair' }}>
        <img
          ref={imgRef}
          src={`${BASE}${photo}`}
          alt=""
          onClick={handleClick}
          style={{ maxHeight: '70vh', maxWidth: '100%', display: 'block' }}
          draggable={false}
        />
        {marker && (
          <div style={{
            position: 'absolute',
            left: marker.x - 8,
            top: marker.y - 8,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: 'red',
            pointerEvents: 'none',
          }} />
        )}
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {hotspots[idx] && (
          <span style={{ opacity: 0.6 }}>
            Hotspot: x={hotspots[idx].hotspot.x}, y={hotspots[idx].hotspot.y}
          </span>
        )}
        {idx < PHOTOS_TO_CALIBRATE.length - 1 && (
          <button onClick={next} style={{ padding: '0.5rem 1.5rem', cursor: 'pointer' }}>
            Next →
          </button>
        )}
      </div>

      {hotspots.some(Boolean) && (
        <div style={{ marginTop: '2rem' }}>
          <p style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Paste into <code>src/data/images.js</code>:</p>
          <textarea
            readOnly
            value={`export const images = [\n${output}\n]`}
            style={{
              width: '100%',
              height: '200px',
              fontFamily: 'monospace',
              fontSize: '13px',
              padding: '1rem',
              background: '#f0f0f0',
              border: '1px solid #ccc',
            }}
            onClick={e => e.target.select()}
          />
        </div>
      )}
    </div>
  )
}
