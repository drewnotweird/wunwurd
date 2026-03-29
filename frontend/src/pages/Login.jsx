import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const from = searchParams.get('from') || '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-[#FF1493] font-bold text-6xl uppercase mb-10 text-center">
          LOGIN
        </h1>

        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label className="text-gray-500 text-xs uppercase block mb-2">
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border-b-2 border-gray-700 focus:border-[#FF1493] text-white text-xl py-2 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-gray-500 text-xs uppercase block mb-2">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border-b-2 border-gray-700 focus:border-[#FF1493] text-white text-xl py-2 outline-none transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm uppercase">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF1493] text-black font-bold text-xl uppercase py-4 mt-4 disabled:opacity-30 hover:bg-white transition-colors"
          >
            {loading ? '...' : 'LOG IN'}
          </button>
        </form>

        <p className="text-gray-700 text-sm text-center mt-8 uppercase">
          NO ACCOUNT?{' '}
          <Link to="/register" className="text-[#FF1493] hover:text-white transition-colors">
            REGISTER
          </Link>
        </p>
      </div>
    </div>
  )
}
