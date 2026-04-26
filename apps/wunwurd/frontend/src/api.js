const BASE = import.meta.env.VITE_API_URL || ''

export const apiFetch = (path, opts = {}) => {
  return fetch(BASE + path, { ...opts, credentials: 'include' })
}
