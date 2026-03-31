import { useEffect, useRef, useState } from 'react'
import { TRACKS } from '../data/tracks.js'

export function useAudioPlayer() {
  const [activeIndex, setActiveIndex] = useState(null)
  const audioRef = useRef(null)
  const activeIndexRef = useRef(null)

  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.preload = 'none'

    const onEnded = () => {
      const current = activeIndexRef.current
      if (current === null) return
      const next = (current + 1) % TRACKS.length
      playTrack(next)
    }

    audioRef.current.addEventListener('ended', onEnded)
    return () => {
      audioRef.current.removeEventListener('ended', onEnded)
      audioRef.current.pause()
      audioRef.current.src = ''
    }
  }, [])

  const playTrack = (index) => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.src = TRACKS[index].previewUrl
    audio.currentTime = 0
    audio.play().catch(() => {})
    activeIndexRef.current = index
    setActiveIndex(index)
  }

  const stopTrack = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    activeIndexRef.current = null
    setActiveIndex(null)
  }

  const toggle = (index) => {
    if (activeIndexRef.current === index) {
      stopTrack()
    } else {
      playTrack(index)
    }
  }

  return { activeIndex, toggle }
}
