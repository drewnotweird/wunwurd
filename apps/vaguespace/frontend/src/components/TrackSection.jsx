import Equalizer from './Equalizer.jsx'

export default function TrackSection({ track, isActive, onTap }) {
  return (
    <div
      className={`track-section ${isActive ? 'track-section--active' : ''}`}
      style={{
        '--base': track.baseColor,
        '--accent': track.accentColor,
        '--noise-freq': track.noiseFreq,
      }}
      onClick={onTap}
    >
      <div className="track-noise" />
      <div className="track-content">
        <h2 className="track-title">{track.title}</h2>
        <Equalizer eqStyle={track.eqStyle} isActive={isActive} accentColor={track.accentColor} />
      </div>
    </div>
  )
}
