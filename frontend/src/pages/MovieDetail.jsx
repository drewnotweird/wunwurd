import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import WordCloud from '../components/WordCloud'
import WunwurdModal from '../components/WunwurdModal'
import { apiFetch } from '../api'

export default function MovieDetail() {
  const { tmdbId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [movie, setMovie] = useState(null)
  const [wunwurds, setWunwurds] = useState({ words: [], topWord: null, userWord: null })
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      apiFetch(`/api/movies/${tmdbId}`, { credentials: 'include' }).then((r) => r.json()),
      apiFetch(`/api/movies/${tmdbId}/wunwurds`, { credentials: 'include' }).then((r) => r.json()),
    ])
      .then(([movieData, wData]) => {
        setMovie(movieData)
        setWunwurds(wData)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [tmdbId])

  function handleWunwurdClick() {
    if (!user) {
      navigate(`/login?from=/movie/${tmdbId}`)
    } else {
      setShowModal(true)
    }
  }

  function handleSuccess(submittedWord) {
    setShowModal(false)
    // Optimistic update
    setWunwurds((prev) => {
      let updated = [...prev.words]

      // Remove count from old user word
      if (prev.userWord && prev.userWord !== submittedWord) {
        updated = updated
          .map((w) =>
            w.word === prev.userWord ? { ...w, count: w.count - 1 } : w
          )
          .filter((w) => w.count > 0)
      }

      // Add or increment new word
      const existing = updated.find((w) => w.word === submittedWord)
      if (existing) {
        updated = updated.map((w) =>
          w.word === submittedWord ? { ...w, count: w.count + 1 } : w
        )
      } else {
        updated = [...updated, { word: submittedWord, count: 1 }]
      }

      updated.sort((a, b) => b.count - a.count)
      return {
        words: updated,
        topWord: updated[0]?.word || null,
        userWord: submittedWord,
      }
    })
  }

  async function handleDelete() {
    await apiFetch(`/api/movies/${tmdbId}/wunwurds`, {
      method: 'DELETE',
      credentials: 'include',
    })
    setWunwurds((prev) => {
      const updated = prev.words
        .map((w) =>
          w.word === prev.userWord ? { ...w, count: w.count - 1 } : w
        )
        .filter((w) => w.count > 0)
      return {
        words: updated,
        topWord: updated[0]?.word || null,
        userWord: null,
      }
    })
  }

  if (loading) {
    return (
      <div>
        <div className="h-64 bg-gray-900 animate-pulse" />
        <div className="px-4 py-6 space-y-4">
          <div className="h-14 bg-gray-900 animate-pulse" />
          <div className="h-12 bg-gray-900 animate-pulse w-3/4" />
          <div className="h-10 bg-gray-900 animate-pulse" />
        </div>
      </div>
    )
  }

  if (!movie || movie.error) {
    return (
      <p className="text-center py-16 text-gray-400 uppercase">
        Movie not found.
      </p>
    )
  }

  const backdropUrl = movie.backdropPath
    ? `https://image.tmdb.org/t/p/original${movie.backdropPath}`
    : null
  const totalVotes = wunwurds.words.reduce((s, w) => s + w.count, 0)

  return (
    <div>
      {/* Backdrop hero */}
      <div className="relative overflow-hidden bg-gray-900" style={{ minHeight: '320px', maxHeight: '600px', height: '70vw' }}>
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            style={{ position: 'absolute', inset: 0 }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

        {/* Content over backdrop */}
        <div className="absolute inset-0 flex flex-col items-end justify-end px-6 pb-6 text-center">
          <div className="w-full">
            <h1
              className="text-white font-bold uppercase leading-none drop-shadow-lg"
              style={{ fontSize: 'clamp(1.25rem, 5vw, 3rem)' }}
            >
              {movie.title}
            </h1>
            {movie.year && (
              <p className="text-gray-400 font-bold uppercase mb-2 drop-shadow-lg" style={{ fontSize: 'clamp(0.75rem, 2vw, 1rem)' }}>
                {movie.year}
              </p>
            )}

            {wunwurds.topWord && (
              <Link
                to={`/word/${wunwurds.topWord}`}
                className="text-[#FF1493] font-bold uppercase leading-none drop-shadow-lg hover:text-white transition-colors"
                style={{ fontSize: 'clamp(3rem, 15vw, 8rem)' }}
              >
                {wunwurds.topWord.toUpperCase()}
              </Link>
            )}

            {!wunwurds.topWord && (
              <p className="text-gray-400 uppercase text-base">
                NO WUNWURDS YET
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pt-0 pb-6 max-w-2xl mx-auto">
        {/* CTA button — hidden once user has submitted */}
        {!(user && wunwurds.userWord) && (
          <button
            onClick={handleWunwurdClick}
            className="w-full bg-[#FF1493] text-black font-bold text-2xl uppercase py-4 hover:bg-white transition-colors"
          >
            + WUNWURD!
          </button>
        )}

        {/* User's existing submission */}
        {user && wunwurds.userWord && (
          <div className="mt-4 flex items-center justify-between border-2 border-[#FF1493] px-4 py-3">
            <div>
              <span className="text-gray-500 text-xs uppercase block">
                YOUR WUNWURD
              </span>
              <span className="text-[#FF1493] font-bold text-3xl uppercase">
                {wunwurds.userWord.toUpperCase()}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(true)}
                className="text-white text-xs uppercase border border-white px-3 py-2 hover:border-[#FF1493] hover:text-[#FF1493] transition-colors"
              >
                EDIT
              </button>
              <button
                onClick={handleDelete}
                className="text-gray-400 text-xs uppercase border border-gray-500 px-3 py-2 hover:border-red-500 hover:text-red-500 transition-colors"
              >
                REMOVE
              </button>
            </div>
          </div>
        )}

        {/* Word cloud */}
        <div className="mt-10">
          <WordCloud words={wunwurds.words.slice(1)} userWord={wunwurds.userWord} />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <WunwurdModal
          tmdbId={tmdbId}
          existingWord={wunwurds.userWord}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  )
}
