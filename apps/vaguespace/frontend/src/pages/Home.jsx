import { TRACKS } from '../data/tracks.js'
import TrackSection from '../components/TrackSection.jsx'
import { useAudioPlayer } from '../hooks/useAudioPlayer.js'

const CURSOR = `url('${import.meta.env.BASE_URL}brackets.png') 60 60, auto`

export default function Home() {
  const { activeIndex, toggle, getAudioData } = useAudioPlayer()

  return (
    <div className="grid" style={{ cursor: CURSOR }}>
      {TRACKS.map((track, i) => (
        <TrackSection
          key={track.id}
          track={track}
          isActive={activeIndex === i}
          onTap={() => toggle(i)}
          getAudioData={activeIndex === i ? getAudioData : null}
        />
      ))}
    </div>
  )
}
