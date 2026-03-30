import React, { useState } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Auth() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const from = searchParams.get('from') || '/'

  const [tab, setTab] = useState(location.pathname === '/register' ? 'register' : 'login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (tab === 'login') {
        await login(email, password)
      } else {
        await register(username, email, password)
      }
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function switchTab(t) {
    setTab(t)
    setError('')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Tabs */}
        <div className="flex border-b-2 border-gray-900 mb-10">
          <button
            onClick={() => switchTab('login')}
            className={`flex-1 py-3 font-bold text-xl uppercase transition-colors ${
              tab === 'login'
                ? 'text-[#FF1493] border-b-2 border-[#FF1493] -mb-[2px]'
                : 'text-gray-400'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => switchTab('register')}
            className={`flex-1 py-3 font-bold text-xl uppercase transition-colors ${
              tab === 'register'
                ? 'text-[#FF1493] border-b-2 border-[#FF1493] -mb-[2px]'
                : 'text-gray-400'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          {tab === 'register' && (
            <div>
              <label className="text-gray-500 text-xs uppercase block mb-2">USERNAME</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-transparent border-b-2 border-gray-700 focus:border-[#FF1493] text-white text-xl py-2 outline-none transition-colors"
              />
            </div>
          )}

          <div>
            <label className="text-gray-500 text-xs uppercase block mb-2">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border-b-2 border-gray-700 focus:border-[#FF1493] text-white text-xl py-2 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-gray-500 text-xs uppercase block mb-2">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={tab === 'register' ? 8 : undefined}
              className="w-full bg-transparent border-b-2 border-gray-700 focus:border-[#FF1493] text-white text-xl py-2 outline-none transition-colors"
            />
            {tab === 'register' && (
              <p className="text-gray-700 text-xs mt-1 uppercase">Minimum 8 characters</p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm uppercase">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF1493] text-black font-bold text-xl uppercase py-4 mt-4 disabled:opacity-30 hover:bg-white transition-colors"
          >
            {loading ? '...' : tab === 'login' ? 'LOG IN' : 'CREATE ACCOUNT'}
          </button>
        </form>
      </div>
    </div>
  )
}
