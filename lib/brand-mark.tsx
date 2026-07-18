export function BrandMark({ size }: { size: number }) {
  const radius = size * 0.2
  const fontSize = size * 0.6

  return (
    <div
      data-testid="brand-mark"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: '#1C1E2A',
        position: 'relative',
        display: 'flex',
      }}
    >
      <span
        style={{
          position: 'absolute',
          left: size * 0.22,
          top: size * 0.08,
          fontFamily: 'serif',
          fontStyle: 'italic',
          fontWeight: 700,
          fontSize,
          color: '#6FA8D8',
        }}
      >
        T
      </span>
      <span
        style={{
          position: 'absolute',
          left: size * 0.4,
          top: size * 0.16,
          fontFamily: 'serif',
          fontStyle: 'italic',
          fontWeight: 700,
          fontSize,
          color: '#EFEBE3',
          opacity: 0.9,
        }}
      >
        L
      </span>
    </div>
  )
}
