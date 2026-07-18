import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 8,
          background: '#1C1E2A',
          padding: 48,
          fontFamily: 'monospace',
        }}
      >
        <div style={{ display: 'flex', color: '#9C99AC', fontSize: 20 }}>$ whoami</div>
        <div style={{ display: 'flex', color: '#EFEBE3', fontSize: 40, fontWeight: 600 }}>
          tania_lapalelo
        </div>
        <div style={{ display: 'flex', color: '#4ED9B0', fontSize: 20, marginTop: 16 }}>
          $ role --current
        </div>
        <div style={{ display: 'flex', color: '#6FA8D8', fontSize: 26 }}>
          Frontend Engineer, Next.js / TypeScript / PostgreSQL
        </div>
        <div style={{ display: 'flex', color: '#EFEBE3', fontSize: 20, marginTop: 16 }}>$ _</div>
      </div>
    ),
    { ...size }
  )
}
