import { Search } from 'lucide-react'

type SearchBarProps = {
  placeholder?: string
  className?: string
}

export default function SearchBar({ placeholder = 'Cerca…', className = '' }: SearchBarProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        background: 'var(--glass)',
        border: '1px solid var(--line)',
        borderRadius: '100px',
        padding: '11px 11px 11px 18px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        width: 330,
      }}
    >
      <Search size={18} style={{ color: 'var(--muted)', flex: '0 0 auto' }} />
      <input
        type="text"
        placeholder={placeholder}
        style={{
          flex: 1,
          background: 'none',
          border: 'none',
          outline: 'none',
          color: '#fff',
          fontFamily: 'inherit',
          fontSize: 13.5,
          minWidth: 0,
        }}
      />
    </div>
  )
}
