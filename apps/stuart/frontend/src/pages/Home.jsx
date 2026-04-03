import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import './Home.css'

export default function Home() {
  const audioRef = useRef(null)
  const containerRef = useRef(null)
  const baseUrl = import.meta.env.BASE_URL

  useEffect(() => {
    // Autoplay on mount
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Browser blocked autoplay - will play on user interaction
      })
      triggerBigConfetti()
    }
  }, [])

  const triggerBigConfetti = () => {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      scalar: 1.5,
    })
  }

  // Drop "40" GIFs constantly
  useEffect(() => {
    const dropGif = () => {
      if (!containerRef.current) return

      const gif = document.createElement('div')
      gif.className = 'falling-40'
      gif.style.left = Math.random() * 100 + '%'
      const gifNum = Math.floor(Math.random() * 5) + 1
      gif.style.backgroundImage = `url(${baseUrl}40_${gifNum}.gif)`
      containerRef.current.appendChild(gif)

      setTimeout(() => gif.remove(), 4000)
    }

    const interval = setInterval(dropGif, 800)
    return () => clearInterval(interval)
  }, [baseUrl])

  return (
    <div className="home" ref={containerRef}>
      {/* Background image */}
      <div className="background" style={{ backgroundImage: `url(${baseUrl}stuart.jpg)` }} />

      {/* Audio element - served from public folder */}
      <audio
        ref={audioRef}
        src={`${baseUrl}happy-birthday.mp3`}
        loop
        autoPlay
      />
    </div>
  )
}
