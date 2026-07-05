import type { ReactNode } from 'react'

type GlassCardProps = {
  hero?: boolean
  className?: string
  children: ReactNode
  style?: React.CSSProperties
  onClick?: () => void
}

export default function GlassCard({ hero = false, className = '', style, children, onClick }: GlassCardProps) {
  return (
    <div
      className={`${hero ? 'hero-card' : 'glass-panel'} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
