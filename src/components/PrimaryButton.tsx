import type { ReactNode, CSSProperties } from 'react'

type PrimaryButtonProps = {
  children: ReactNode
  onClick?: () => void
  className?: string
  style?: CSSProperties
  disabled?: boolean
  title?: string
}

export default function PrimaryButton({ children, onClick, className = '', style, disabled, title }: PrimaryButtonProps) {
  return (
    <button onClick={onClick} className={`btn-spade ${className}`} style={style} disabled={disabled} title={title}>
      {children}
    </button>
  )
}
