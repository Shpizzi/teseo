import type { ReactNode } from 'react'

type KpiCardProps = {
  value: string
  label: string
  trend?: string
  trendUp?: boolean
  icon: ReactNode
  onClick?: () => void
}

export default function KpiCard({ value, label, trend, trendUp, icon, onClick }: KpiCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--glass)',
        border: '1px solid var(--line)',
        borderRadius: 14,
        padding: '15px 17px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.18s, background 0.18s',
      }}
      onMouseEnter={onClick ? e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--line-2)' } : undefined}
      onMouseLeave={onClick ? e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--line)' } : undefined}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <span
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: 'rgba(63,115,8,.14)',
            border: '1px solid var(--line-2)',
            display: 'grid',
            placeItems: 'center',
            color: 'var(--cyan)',
          }}
        >
          {icon}
        </span>
        {trend && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              fontFamily: 'var(--mono)',
              color: trendUp ? 'var(--cyan)' : 'var(--muted)',
            }}
          >
            {trend}
          </span>
        )}
      </div>
      <div
        style={{
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: '-0.01em',
          lineHeight: 1,
          fontFamily: 'var(--mono)',
        }}
      >
        {value}
      </div>
      <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 7, fontWeight: 500 }}>
        {label}
      </div>
    </div>
  )
}
