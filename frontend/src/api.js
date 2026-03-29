const BASE = import.meta.env.VITE_API_URL || ''
export const apiFetch = (path, opts) => fetch(BASE + path, opts)
