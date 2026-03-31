export default function SymbolCard({ symbol, size = 80, onClick, selected }) {
  return (
    <button
      onClick={() => onClick?.(symbol)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        padding: '10px 6px 8px',
        background: selected ? 'var(--color-primary)' : 'var(--color-card)',
        border: selected ? '2px solid var(--color-primary)' : '2px solid transparent',
        borderRadius: 16,
        cursor: 'pointer',
        width: size + 28,
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        transition: 'transform 0.1s, box-shadow 0.1s',
      }}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
      onMouseUp={e => e.currentTarget.style.transform = ''}
      onMouseLeave={e => e.currentTarget.style.transform = ''}
    >
      <img
        src={symbol.imageUrl}
        alt={symbol.label}
        width={size}
        height={size}
        style={{ objectFit: 'contain', display: 'block' }}
      />
      <span style={{
        fontSize: 12,
        fontWeight: 700,
        fontFamily: 'var(--font-primary)',
        color: selected ? '#fff' : 'var(--color-text)',
        textAlign: 'center',
        lineHeight: 1.2,
        maxWidth: size + 16,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
      }}>
        {symbol.label}
      </span>
    </button>
  )
}
