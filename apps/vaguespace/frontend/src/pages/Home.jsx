import { useState, useRef, useEffect } from 'react'
import { TRACKS } from '../data/tracks.js'
import Visualizer from '../components/Visualizer.jsx'
import TrackControls from '../components/TrackControls.jsx'
import '../styles/Home.css'

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioData, setAudioData] = useState(null)
  const audioRef = useRef(null)
  const analyserRef = useRef(null)
  const animationRef = useRef(null)

  // Initialize audio context and analyser
  useEffect(() => {
    if (!audioRef.current) return

    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    analyserRef.current = analyser

    const source = audioContext.createMediaElementAudioSource(audioRef.current)
    source.connect(analyser)
    analyser.connect(audioContext.destination)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  // Update audio data for visualization
  const updateAudioData = () => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)
    setAudioData(Array.from(dataArray))

    animationRef.current = requestAnimationFrame(updateAudioData)
  }

  // Handle track change
  const handleTrackSelect = (index) => {
    setActiveIndex(index)
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.src = TRACKS[index].previewUrl
      audioRef.current.currentTime = 0
    }
  }

  // Handle play/pause
  const handleTogglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
      updateAudioData()
    }
  }

  // Auto-advance to next track when current ends
  const handleTrackEnd = () => {
    const nextIndex = (activeIndex + 1) % TRACKS.length
    handleTrackSelect(nextIndex)
    setIsPlaying(true)
  }

  const currentTrack = TRACKS[activeIndex]

  return (
    <div className="home" style={{ '--base-color': currentTrack.baseColor }}>
      <Visualizer 
        audioData={isPlaying ? audioData : null}
        baseColor={currentTrack.baseColor}
        accentColor={currentTrack.accentColor}
      />
      
      <TrackControls 
        tracks={TRACKS}
        activeIndex={activeIndex}
        onTrackSelect={handleTrackSelect}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
      />

      <audio
        ref={audioRef}
        onEnded={handleTrackEnd}
        crossOrigin="anonymous"
      />

      <div className="track-info">
        <h2>{currentTrack.title}</h2>
      </div>
    </div>
  )
}

