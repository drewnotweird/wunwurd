const BASE = import.meta.env.VITE_API_URL || ''

export const apiFetch = (path, opts = {}) => {
  const token = localStorage.getItem('token')
  const headers = { ...(opts.headers || {}) }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return fetch(BASE + path, { ...opts, headers })
}
