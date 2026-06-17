import type { ReactNode } from 'react'

type GlassCardProps = {
  hero?: boolean
  className?: string
  children: ReactNode
  style?: React.CSSProperties
}

export default function GlassCard({ hero = false, className = '', style, children }: GlassCardProps) {
  return (
    <div
      className={`${hero ? 'hero-card' : 'glass-panel'} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
