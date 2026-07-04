import { Search } from 'lucide-react'

type SearchBarProps = {
  placeholder?: string
  className?: string
  value?: string
  onChange?: (value: string) => void
}

export default function SearchBar({ placeholder = 'Cerca…', className = '', value, onChange }: SearchBarProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        background: 'var(--glass)',
        border: '1px solid var(--line)',
        borderRadius: 10,
        padding: '11px 11px 11px 18px',
        transition: 'border-color 0.2s ease',
        width: 330,
      }}
    >
      <Search size={18} style={{ color: 'var(--muted)', flex: '0 0 auto' }} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange ? e => onChange(e.target.value) : undefined}
        style={{
          flex: 1,
          background: 'none',
          border: 'none',
          outline: 'none',
          color: 'var(--ink)',
          fontFamily: 'inherit',
          fontSize: 13.5,
          minWidth: 0,
        }}
      />
    </div>
  )
}
