import { useState } from 'react'
import SymbolPicker from '../components/SymbolPicker.jsx'
import SymbolCard from '../components/SymbolCard.jsx'

export default function Home() {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [activeSlot, setActiveSlot] = useState(null)
  const [slots, setSlots] = useState({ now: null, next: null })

  const openPicker = (slot) => {
    setActiveSlot(slot)
    setPickerOpen(true)
  }

  const handleSelect = (symbol) => {
    setSlots(s => ({ ...s, [activeSlot]: symbol }))
    setPickerOpen(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      gap: 32,
    }}>
      <h1 style={{
        fontFamily: 'var(--font-primary)',
        fontWeight: 800,
        fontSize: 'clamp(1.6rem, 5vw, 2.4rem)',
        color: 'var(--color-text)',
        margin: 0,
      }}>
        Now &amp; Next
      </h1>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['now', 'next'].map(slot => (
          <div key={slot} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <span style={{
              fontFamily: 'var(--font-primary)',
              fontWeight: 800,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--color-text-soft)',
            }}>
              {slot}
            </span>

            {slots[slot] ? (
              <div onClick={() => openPicker(slot)} style={{ cursor: 'pointer' }}>
                <SymbolCard symbol={slots[slot]} size={120} />
              </div>
            ) : (
              <button
                onClick={() => openPicker(slot)}
                style={{
                  width: 148,
                  height: 180,
                  borderRadius: 'var(--radius-card)',
                  border: '3px dashed #c8d8e8',
                  background: 'var(--color-card)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  color: 'var(--color-text-soft)',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                <span style={{ fontSize: 32 }}>+</span>
                Add symbol
              </button>
            )}
          </div>
        ))}
      </div>

      {pickerOpen && (
        <SymbolPicker
          onSelect={handleSelect}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  )
}
