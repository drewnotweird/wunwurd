import { useState, useEffect, useRef } from 'react'
import SymbolCard from './SymbolCard.jsx'
import { useSymbolSearch, symbolImageUrl } from '../hooks/useSymbolSearch.js'

// Suggestions shown before the user has typed anything
const SUGGESTIONS = [
  { id: 2510,  label: 'eat' },
  { id: 4042,  label: 'drink' },
  { id: 7122,  label: 'sleep' },
  { id: 7396,  label: 'play' },
  { id: 5967,  label: 'school' },
  { id: 14942, label: 'home' },
  { id: 3905,  label: 'bath' },
  { id: 4776,  label: 'get dressed' },
  { id: 4048,  label: 'brush teeth' },
  { id: 4060,  label: 'toilet' },
  { id: 4477,  label: 'walk' },
  { id: 6965,  label: 'read' },
  { id: 4015,  label: 'TV' },
  { id: 5553,  label: 'tablet' },
  { id: 14928, label: 'outside' },
  { id: 7291,  label: 'quiet time' },
].map(s => ({ ...s, imageUrl: symbolImageUrl(s.id) }))

const CATEGORIES = [
  { label: 'Activities', emoji: '🎮', query: 'activity' },
  { label: 'Self-care',  emoji: '🪥', query: 'hygiene' },
  { label: 'Food',       emoji: '🍎', query: 'food' },
  { label: 'Feelings',   emoji: '😊', query: 'emotion' },
  { label: 'Places',     emoji: '🏠', query: 'place' },
  { label: 'People',     emoji: '👨‍👩‍👧', query: 'family' },
  { label: 'School',     emoji: '📚', query: 'school' },
  { label: 'Time',       emoji: '⏰', query: 'time' },
]

export default function SymbolPicker({ onSelect, onClose }) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [customLabel, setCustomLabel] = useState('')
  const [view, setView] = useState('browse') // 'browse' | 'custom'
  const inputRef = useRef(null)

  const searchQuery = query.trim() || (activeCategory?.query ?? '')
  const { results, loading } = useSymbolSearch(searchQuery)

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const symbols = searchQuery ? results : SUGGESTIONS

  const handleSelect = (symbol) => {
    onSelect?.({ ...symbol, label: symbol.label })
    onClose?.()
  }

  const handleCustomSubmit = () => {
    if (!customLabel.trim()) return
    onSelect?.({ id: `custom-${Date.now()}`, label: customLabel.trim(), imageUrl: null })
    onClose?.()
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose?.() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'flex-end',
      }}
    >
      <div style={{
        width: '100%',
        maxHeight: '85vh',
        background: 'var(--color-card)',
        borderRadius: '24px 24px 0 0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Handle bar */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: '#ddd' }} />
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', padding: '0 16px 0', gap: 8 }}>
          {['browse', 'custom'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-primary)',
                fontWeight: 700,
                fontSize: 14,
                background: view === v ? 'var(--color-primary)' : 'var(--color-bg)',
                color: view === v ? '#fff' : 'var(--color-text-soft)',
              }}
            >
              {v === 'browse' ? '🔍 Find a symbol' : '✏️ Make your own'}
            </button>
          ))}
        </div>

        {view === 'browse' ? (
          <>
            {/* Search bar */}
            <div style={{ padding: '12px 16px 0' }}>
              <input
                ref={inputRef}
                value={query}
                onChange={e => { setQuery(e.target.value); setActiveCategory(null) }}
                placeholder="Search symbols…"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-btn)',
                  border: '2px solid #e8e8e8',
                  fontFamily: 'var(--font-primary)',
                  fontSize: 16,
                  fontWeight: 600,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={e => e.target.style.borderColor = '#e8e8e8'}
              />
            </div>

            {/* Category pills — only when not searching */}
            {!query && (
              <div style={{
                display: 'flex', gap: 8, padding: '10px 16px',
                overflowX: 'auto', scrollbarWidth: 'none',
              }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.label}
                    onClick={() => setActiveCategory(activeCategory?.label === cat.label ? null : cat)}
                    style={{
                      flexShrink: 0,
                      padding: '6px 14px',
                      borderRadius: 20,
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-primary)',
                      fontWeight: 700,
                      fontSize: 13,
                      whiteSpace: 'nowrap',
                      background: activeCategory?.label === cat.label ? 'var(--color-primary)' : 'var(--color-bg)',
                      color: activeCategory?.label === cat.label ? '#fff' : 'var(--color-text)',
                    }}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>
            )}

            {/* Section label */}
            <div style={{ padding: '4px 16px 8px', fontSize: 13, fontWeight: 700, color: 'var(--color-text-soft)' }}>
              {loading ? 'Finding symbols…' : query ? `Results for "${query}"` : activeCategory ? activeCategory.label : 'Suggestions'}
            </div>

            {/* Symbol grid */}
            <div style={{
              overflowY: 'auto',
              padding: '0 12px 24px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              alignContent: 'flex-start',
            }}>
              {loading ? (
                <div style={{ padding: '32px', color: 'var(--color-text-soft)', fontFamily: 'var(--font-primary)' }}>
                  Looking…
                </div>
              ) : symbols.length === 0 && searchQuery ? (
                <div style={{ padding: '32px 0', color: 'var(--color-text-soft)', fontFamily: 'var(--font-primary)', fontWeight: 600 }}>
                  Nothing found — try "make your own" instead
                </div>
              ) : symbols.map(s => (
                <SymbolCard key={s.id} symbol={s} onClick={handleSelect} />
              ))}
            </div>
          </>
        ) : (
          /* Custom symbol creator */
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ margin: 0, fontFamily: 'var(--font-primary)', fontWeight: 600, color: 'var(--color-text-soft)', fontSize: 14 }}>
              Type a word or phrase. You can add a photo later.
            </p>
            <input
              value={customLabel}
              onChange={e => setCustomLabel(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCustomSubmit()}
              placeholder="e.g. Granny's house"
              autoFocus
              style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-btn)',
                border: '2px solid #e8e8e8',
                fontFamily: 'var(--font-primary)',
                fontSize: 18,
                fontWeight: 700,
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={e => e.target.style.borderColor = '#e8e8e8'}
            />
            <button
              onClick={handleCustomSubmit}
              disabled={!customLabel.trim()}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-btn)',
                border: 'none',
                background: customLabel.trim() ? 'var(--color-primary)' : '#ddd',
                color: '#fff',
                fontFamily: 'var(--font-primary)',
                fontWeight: 800,
                fontSize: 16,
                cursor: customLabel.trim() ? 'pointer' : 'default',
              }}
            >
              Add this
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
