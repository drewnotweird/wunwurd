import React, { createContext, useContext, useState, useEffect } from 'react'
import { apiFetch } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setLoading(false)
      return
    }
    apiFetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => {
        if (!u) localStorage.removeItem('token')
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
    localStorage.setItem('token', data.token)
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
    localStorage.setItem('token', data.token)
    setUser(data)
    return data
  }

  async function logout() {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
