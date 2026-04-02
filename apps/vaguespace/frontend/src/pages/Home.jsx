import { TRACKS } from '../data/tracks.js'
import Visualizer from '../components/Visualizer.jsx'
import { useAudioPlayer } from '../hooks/useAudioPlayer.js'

export default function Home() {
  const { activeIndex, toggle, getTimeDomainData } = useAudioPlayer()
  const activeTrack = activeIndex !== null ? TRACKS[activeIndex] : TRACKS[0]

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100dvh', background: '#000', overflow: 'hidden' }}>
      <Visualizer
        getTimeDomainData={activeIndex !== null ? getTimeDomainData : null}
        track={activeTrack}
      />

      <div className="track-bar">
        {TRACKS.map((track, i) => (
          <button
            key={i}
            className={`track-btn ${activeIndex === i ? 'track-btn--active' : ''}`}
            style={{ '--accent': track.accentColor }}
            onClick={() => toggle(i)}
          >
            <span className="track-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="track-name">{track.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
