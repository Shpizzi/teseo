import type { ReactNode } from 'react'

type KpiCardProps = {
  value: string
  label: string
  trend?: string
  trendUp?: boolean
  icon: ReactNode
}

export default function KpiCard({ value, label, trend, trendUp, icon }: KpiCardProps) {
  return (
    <div
      style={{
        background: 'var(--glass)',
        border: '1px solid var(--line)',
        borderRadius: 14,
        padding: '15px 17px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <span
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: 'rgba(174,227,249,.14)',
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
