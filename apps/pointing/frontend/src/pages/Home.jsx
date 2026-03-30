import { useEffect, useRef, useState, useCallback } from 'react'
import { images as imageData } from '../data/images.js'

const MIN_DISTANCE = 150
const BASE_SIZE = 400

export default function Home() {
  const [ready, setReady] = useState(false)
  const [settled, setSettled] = useState([])
  const [cursor, setCursor] = useState(null)

  const loadedPhotos = useRef([])
  const nextIdx = useRef(0)

  // Active photo tracked purely by ref + direct DOM manipulation
  const activeImgRef = useRef(null)
  const activePhoto = useRef(null)   // { src, hotspot, w, h }
  const activeStart = useRef(null)   // { x, y } where current photo first appeared

  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
  const BASE = import.meta.env.BASE_URL

  // Preload all images
  useEffect(() => {
    if (!imageData.length) return
    let count = 0
    const threshold = Math.min(3, imageData.length)
    imageData.forEach(data => {
      const img = new Image()
      img.src = `${BASE}${data.src}`
      img.onload = () => {
        const longest = Math.max(img.naturalWidth, img.naturalHeight)
        const scale = BASE_SIZE / longest
        loadedPhotos.current.push({
          src: img.src,
          hotspot: data.hotspot,
          w: Math.round(img.naturalWidth * scale),
          h: Math.round(img.naturalHeight * scale),
        })
        if (++count >= threshold) setReady(true)
      }
      img.onerror = () => { if (++count >= threshold) setReady(true) }
    })
  }, [BASE])

  const getNextPhoto = useCallback(() => {
    const pool = loadedPhotos.current
    if (!pool.length) return null
    const photo = pool[nextIdx.current % pool.length]
    nextIdx.current++
    return photo
  }, [])

  // Position the active img element directly (no React re-render)
  const positionActive = useCallback((x, y) => {
    const p = activePhoto.current
    if (!p || !activeImgRef.current) return
    activeImgRef.current.style.left = `${x - p.hotspot.x * p.w}px`
    activeImgRef.current.style.top  = `${y - p.hotspot.y * p.h}px`
  }, [])

  const startNewPhoto = useCallback((x, y) => {
    const photo = getNextPhoto()
    if (!photo) return
    activePhoto.current = photo
    activeStart.current = { x, y }
    // Swap src on the shared img element — no new DOM node
    if (activeImgRef.current) {
      activeImgRef.current.src = photo.src
      activeImgRef.current.style.width  = `${photo.w}px`
      activeImgRef.current.style.height = `${photo.h}px`
      activeImgRef.current.style.display = 'block'
    }
    positionActive(x, y)
  }, [getNextPhoto, positionActive])

  const handleCursor = useCallback((x, y) => {
    if (!ready) return
    setCursor({ x, y })

    if (!activePhoto.current) {
      startNewPhoto(x, y)
      return
    }

    const dx = x - activeStart.current.x
    const dy = y - activeStart.current.y

    if (Math.sqrt(dx * dx + dy * dy) >= MIN_DISTANCE) {
      // Settle the current photo at its current position
      const p = activePhoto.current
      setSettled(s => [...s, {
        id: Date.now() + Math.random(),
        src: p.src,
        w: p.w,
        h: p.h,
        hotspot: p.hotspot,
        x,
        y,
      }])
      startNewPhoto(x, y)
    } else {
      positionActive(x, y)
    }
  }, [ready, startNewPhoto, positionActive])

  useEffect(() => {
    const onMouseMove = e => handleCursor(e.clientX, e.clientY)
    const onTouch = e => {
      e.preventDefault()
      handleCursor(e.touches[0].clientX, e.touches[0].clientY)
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchstart', onTouch, { passive: false })
    window.addEventListener('touchmove', onTouch, { passive: false })
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchstart', onTouch)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [handleCursor])

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: '#fafafa',
      position: 'fixed',
      inset: 0,
      cursor: 'none',
    }}>

      {/* Intro text */}
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: ready ? 0 : 1,
        transition: 'opacity 1.2s ease',
        pointerEvents: 'none',
        zIndex: 1000,
      }}>
        <p style={{
          fontFamily: '"Inter", sans-serif',
          fontWeight: 300,
          fontSize: 'clamp(1.1rem, 3vw, 2rem)',
          color: '#0a0a0a',
          margin: 0,
          padding: '0 2rem',
          textAlign: 'center',
        }}>
          {isMobile ? "I'll point to your finger" : "I'll point to your mouse"}
        </p>
      </div>

      {/* Settled photos */}
      {settled.map(p => (
        <img
          key={p.id}
          src={p.src}
          alt=""
          draggable={false}
          style={{
            position: 'fixed',
            left: p.x - p.hotspot.x * p.w,
            top:  p.y - p.hotspot.y * p.h,
            width: p.w,
            height: p.h,
            pointerEvents: 'none',
            userSelect: 'none',
            display: 'block',
          }}
        />
      ))}

      {/* Single active photo — mutated directly, never re-keyed */}
      <img
        ref={activeImgRef}
        alt=""
        draggable={false}
        style={{
          position: 'fixed',
          display: 'none',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />

      {/* Pulsing cursor dot */}
      {cursor && !isMobile && (
        <div style={{
          position: 'fixed',
          left: cursor.x,
          top: cursor.y,
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: '#0a0a0a',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9999,
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.8); opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
