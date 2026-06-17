type ProgressBarProps = {
  value: number // 0-100
  label?: string
}

export default function ProgressBar({ value, label }: ProgressBarProps) {
  return (
    <div className="progress-track" style={{ position: 'relative' }}>
      {label && <span className="progress-track-label">{label}</span>}
      <i
        className="progress-track-fill"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
