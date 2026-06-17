import type { ReactNode } from 'react'

type IconButtonProps = {
  children: ReactNode
  title?: string
  badge?: number
  onClick?: () => void
}

export default function IconButton({ children, title, badge, onClick }: IconButtonProps) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        border: '1px solid var(--line)',
        background: 'var(--glass)',
        display: 'grid',
        placeItems: 'center',
        color: 'var(--muted)',
        cursor: 'pointer',
        flex: '0 0 auto',
        position: 'relative',
        transition: '0.2s',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLButtonElement).style.color = '#fff'
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--line-2)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)'
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--line)'
      }}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span
          style={{
            position: 'absolute',
            top: -4,
            right: -4,
            width: 17,
            height: 17,
            borderRadius: '50%',
            background: 'var(--cyan)',
            color: '#08233f',
            fontSize: 10,
            fontWeight: 700,
            display: 'grid',
            placeItems: 'center',
            border: '2px solid var(--bg)',
            fontFamily: 'var(--mono)',
          }}
        >
          {badge}
        </span>
      )}
    </button>
  )
}
