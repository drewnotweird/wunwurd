import { useState, useEffect, useRef } from 'react'

const BASE = 'https://api.arasaac.org/v1'
const IMG = 'https://static.arasaac.org/pictograms'

export function symbolImageUrl(id) {
  return `${IMG}/${id}/${id}_300.png`
}

// Cache search results in memory for the session
const cache = {}

async function searchSymbols(query) {
  const key = query.trim().toLowerCase()
  if (cache[key]) return cache[key]
  const res = await fetch(`${BASE}/pictograms/en/search/${encodeURIComponent(key)}`)
  if (!res.ok) return []
  const data = await res.json()
  const results = data.slice(0, 40).map(p => ({
    id: p._id,
    label: p.keywords?.[0]?.keyword ?? key,
    imageUrl: symbolImageUrl(p._id),
  }))
  cache[key] = results
  return results
}

export function useSymbolSearch(query) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const debounce = useRef(null)

  useEffect(() => {
    const q = query.trim()
    if (!q) { setResults([]); setLoading(false); return }
    setLoading(true)
    clearTimeout(debounce.current)
    debounce.current = setTimeout(async () => {
      const r = await searchSymbols(q)
      setResults(r)
      setLoading(false)
    }, 280)
    return () => clearTimeout(debounce.current)
  }, [query])

  return { results, loading }
}
