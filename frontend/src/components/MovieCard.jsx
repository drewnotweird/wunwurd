import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../api'

export default function MovieCard({ movie }) {
  const [topHovered, setTopHovered] = useState(false)
  const [bottomHovered, setBottomHovered] = useState(false)
  const [topWord, setTopWord] = useState(null)
  const [wordFetched, setWordFetched] = useState(false)

  const backdropPath = movie.backdrop_path || movie.backdropPath
  const imageUrl = backdropPath ? `https://image.tmdb.org/t/p/w780${backdropPath}` : null
  const tmdbId = movie.tmdbId || movie.id
  const title = movie.title || movie.name || ''

  const cardHovered = topHovered || bottomHovered

  // Fetch wunwurds on mount
  useEffect(() => {
    async function fetchWunwurd() {
      if (!wordFetched) {
        setWordFetched(true)
        try {
          const r = await apiFetch(`/api/movies/${tmdbId}/wunwurds`, { credentials: 'include' })
          const data = await r.json()
          setTopWord(data.topWord || null)
        } catch {}
      }
    }
    fetchWunwurd()
  }, [tmdbId, wordFetched])

  return (
    <div className="relative overflow-hidden bg-gray-900 aspect-[2/3]">
      {/* Image */}
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <div className="w-full h-full bg-gray-800" />
      )}

      {/* Overlay layers — pointer-events-none so clicks pass through to links */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Base: solid 40% black, visible by default for text readability */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
            opacity: 1 }}
        />
        {/* Top gradient: adds 60% more top→bottom, fades in on top hover */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
            opacity: topHovered ? 1 : 0,
          }}
        />
        {/* Bottom gradient: adds 60% more bottom→top, fades in on bottom hover */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
            opacity: bottomHovered ? 1 : 0,
          }}
        />
      </div>

      {/* Hit areas */}
      <div className="absolute inset-0 flex flex-col">
        <Link
          to={`/movie/${tmdbId}`}
          className="flex-1 flex items-center justify-center p-3 w-full cursor-pointer"
          onMouseEnter={() => setTopHovered(true)}
          onMouseLeave={() => setTopHovered(false)}
        >
          <span
            className="font-bold uppercase leading-none break-words w-full text-center"
            style={{ fontSize: 'clamp(1rem, 3.5vw, 2rem)', overflowWrap: 'break-word', wordBreak: 'break-word', opacity: topHovered ? 1 : 0, color: topHovered ? '#FF1493' : '#ffffff', transition: 'opacity 0.3s, color 0.4s' }}
          >
            {title}
          </span>
        </Link>

        <Link
          to={topWord ? `/word/${topWord}` : `/movie/${tmdbId}`}
          className="flex-1 flex items-center justify-center p-3 w-full cursor-pointer"
          onMouseEnter={() => setBottomHovered(true)}
          onMouseLeave={() => setBottomHovered(false)}
        >
          {topWord && (
            <span
              className="font-bold uppercase leading-none break-words w-full text-center"
              style={{ fontSize: 'clamp(1rem, 3.5vw, 2rem)', overflowWrap: 'break-word', wordBreak: 'break-word', opacity: 1, color: bottomHovered ? '#FF1493' : '#ffffff', transition: 'color 0.4s' }}
            >
              {topWord.toUpperCase()}
            </span>
          )}
        </Link>
      </div>
    </div>
  )
}
