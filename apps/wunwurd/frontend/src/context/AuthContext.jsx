import React, { createContext, useContext, useState, useEffect } from 'react'
import { apiFetch } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [serverReady, setServerReady] = useState(true)

  useEffect(() => {
    apiFetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => {
        setUser(u)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const r = await apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await r.json()
    if (!r.ok) throw new Error(data.error)
    setUser(data)
    return data
  }

  async function register(username, email, password) {
    const r = await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })
    const data = await r.json()
    if (!r.ok) throw new Error(data.error)
    setUser(data)
    return data
  }

  async function logout() {
    await apiFetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, serverReady, setServerReady }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
