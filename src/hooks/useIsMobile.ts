import { useState, useEffect } from 'react'

// True when the viewport is at or below `bp` px. Drives the sidebar drawer.
export function useIsMobile(bp = 768): boolean {
  const query = `(max-width: ${bp}px)`
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia(query).matches,
  )
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMobile(mql.matches)
    mql.addEventListener('change', onChange)
    onChange()
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return mobile
}
