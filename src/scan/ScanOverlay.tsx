// Blueprint AR scan overlay: corner brackets, sweeping line, popping dots,
// mono progress readout. Pure CSS animation so it stays smooth while CLIP
// inference runs on the main thread.

const DOTS = [
  { top: '28%', left: '34%', delay: '0s' },
  { top: '52%', left: '62%', delay: '0.3s' },
  { top: '41%', left: '48%', delay: '0.6s' },
  { top: '66%', left: '30%', delay: '0.9s' },
  { top: '35%', left: '70%', delay: '1.2s' },
]

// corners: [key, border sides, position]
const BRACKETS: Array<{ style: React.CSSProperties }> = [
  { style: { top: 14, left: 14, borderWidth: '2px 0 0 2px' } },
  { style: { top: 14, right: 14, borderWidth: '2px 2px 0 0' } },
  { style: { bottom: 14, left: 14, borderWidth: '0 0 2px 2px' } },
  { style: { bottom: 14, right: 14, borderWidth: '0 2px 2px 0' } },
]

export default function ScanOverlay({ progress }: { progress: number }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {BRACKETS.map((b, i) => (
        <span key={i} className="scan-bracket" style={b.style} />
      ))}

      <div className="scan-sweep" />

      {DOTS.map((d, i) => (
        <span key={i} className="scan-dot" style={{ top: d.top, left: d.left, animationDelay: d.delay }} />
      ))}

      {/* status readout */}
      <div
        style={{
          position: 'absolute',
          left: 20,
          bottom: 18,
          fontFamily: 'var(--mono)',
          fontSize: 11,
          letterSpacing: '0.06em',
          color: 'var(--lemongrass)',
          textShadow: '0 1px 4px rgba(9,15,5,0.8)',
        }}
      >
        SCANSIONE DIMENSIONALE · GAUSSIAN SPLAT
      </div>
      <div
        style={{
          position: 'absolute',
          right: 20,
          bottom: 16,
          fontFamily: 'var(--mono)',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--lemongrass)',
          textShadow: '0 1px 4px rgba(9,15,5,0.8)',
        }}
      >
        {String(Math.min(100, Math.round(progress))).padStart(3, '0')}%
      </div>
    </div>
  )
}
