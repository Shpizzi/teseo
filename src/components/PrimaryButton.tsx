import type { ReactNode, CSSProperties } from 'react'

type PrimaryButtonProps = {
  children: ReactNode
  onClick?: () => void
  className?: string
  style?: CSSProperties
}

export default function PrimaryButton({ children, onClick, className = '', style }: PrimaryButtonProps) {
  return (
    <button onClick={onClick} className={`btn-spade ${className}`} style={style}>
      {children}
    </button>
  )
}
