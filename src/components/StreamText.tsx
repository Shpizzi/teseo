import { useEffect, useRef, useState } from 'react'

// Testo che "streama" carattere per carattere come un LLM, con cursore.
export default function StreamText({ text, onDone, speed = 18 }: { text: string; onDone?: () => void; speed?: number }) {
  const [n, setN] = useState(0)
  const doneRef = useRef(false)

  useEffect(() => {
    const id = setInterval(() => setN(v => Math.min(v + 2, text.length)), speed)
    return () => clearInterval(id)
  }, [text, speed])

  useEffect(() => {
    if (n >= text.length && !doneRef.current) {
      doneRef.current = true
      onDone?.()
    }
  }, [n, text, onDone])

  return (
    <>
      {text.slice(0, n)}
      {n < text.length && <span className="ai-cursor" />}
    </>
  )
}
