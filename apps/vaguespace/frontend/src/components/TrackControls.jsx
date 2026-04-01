import './TrackControls.css'

export default function TrackControls({ tracks, activeIndex, onTrackSelect, isPlaying, onTogglePlay }) {
  return (
    <div className="track-controls">
      <button 
        className={`control-btn play-btn ${isPlaying ? 'playing' : ''}`}
        onClick={onTogglePlay}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>

      <div className="control-points">
        {tracks.map((track, i) => (
          <button
            key={track.id}
            className={`control-point ${activeIndex === i ? 'active' : ''}`}
            onClick={() => onTrackSelect(i)}
            title={track.title}
            style={{
              '--accent-color': track.accentColor,
              '--base-color': track.baseColor,
            }}
          >
            <span className="track-number">{i + 1}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
