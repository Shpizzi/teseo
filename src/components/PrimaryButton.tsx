import type { ReactNode, CSSProperties } from 'react'

type PrimaryButtonProps = {
  children: ReactNode
  onClick?: () => void
  className?: string
  style?: CSSProperties
}

export default function PrimaryButton({ children, onClick, className = '', style }: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: '#fff',
        color: '#08233f',
        border: 'none',
        fontFamily: 'inherit',
        fontWeight: 700,
        fontSize: 14,
        padding: '0 20px',
        height: 44,
        borderRadius: '100px',
        cursor: 'pointer',
        flex: '0 0 auto',
        transition: '0.2s',
        whiteSpace: 'nowrap',
        ...style,
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--cyan)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLButtonElement).style.background = '#fff'
      }}
    >
      {children}
    </button>
  )
}
