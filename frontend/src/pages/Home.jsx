import React, { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard'
import SkeletonCard from '../components/SkeletonCard'
import { apiFetch } from '../api'

const SCROLL_THRESHOLD = 140

export default function Home() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const h = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => {
    apiFetch('/api/movies/trending', { credentials: 'include' })
      .then(r => { if (!r.ok) throw new Error('Failed to load'); return r.json() })
      .then(data => { setMovies(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  // Banner content fades out as user scrolls — matches navbar logo fade-in
  const bannerProgress = Math.min(1, scrollY / SCROLL_THRESHOLD)
  const bannerOpacity = 1 - bannerProgress
  const bannerScale = 1 - bannerProgress * 0.08

  return (
    <div>
      {/* Hero — pink block, seamless with navbar */}
      <div className="bg-[#FF1493] px-6 pb-10 pt-4 text-center">
        <div
          style={{
            opacity: bannerOpacity,
            transform: `scale(${bannerScale})`,
            transition: 'opacity 0.1s linear, transform 0.1s linear',
            transformOrigin: 'top center',
          }}
        >
          <h1
            className="text-black font-bold leading-none uppercase"
            style={{ fontSize: 'clamp(4rem, 18vw, 10rem)' }}
          >
            WUNWURD
          </h1>
          <p className="text-black font-bold uppercase mt-2 text-base sm:text-xl">
            SINGLE-WORD REVIEWS
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="px-2 py-2">
        {error && <p className="text-center text-[#FF1493] uppercase py-8">{error}</p>}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {loading
            ? Array.from({ length: 20 }).map((_, i) => <SkeletonCard key={i} />)
            : movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      </div>
    </div>
  )
}
