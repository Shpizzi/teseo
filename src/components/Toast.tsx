import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

// ponytail: singleton event-bus, niente context/provider — basta montare <Toaster/> nel layout
type ToastMsg = { id: number; text: string }
let listener: ((t: ToastMsg) => void) | null = null
let nextId = 1

export function toast(text: string) {
  listener?.({ id: nextId++, text })
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastMsg[]>([])

  useEffect(() => {
    listener = t => {
      setToasts(prev => [...prev, t])
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 3200)
    }
    return () => { listener = null }
  }, [])

  if (toasts.length === 0) return null
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 26,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        zIndex: 200,
        pointerEvents: 'none',
      }}
    >
      {toasts.map(t => (
        <div
          key={t.id}
          className="anim-fadeUp"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'var(--forest)',
            color: 'var(--lemongrass)',
            border: '1px solid var(--forest)',
            borderRadius: 10,
            padding: '11px 18px',
            fontFamily: 'var(--mono)',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            boxShadow: '0 8px 24px rgba(9,15,5,.18)',
          }}
        >
          <CheckCircle2 size={15} style={{ flex: '0 0 auto' }} />
          {t.text}
        </div>
      ))}
    </div>
  )
}
