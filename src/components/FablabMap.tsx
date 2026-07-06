import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export type MapPin = {
  id?: string
  name: string
  lng: number
  lat: number
  you?: boolean
  compact?: boolean // solo puntina, nome nel tooltip, per reti fitte di pin
}

type FablabMapProps = {
  pins: MapPin[]
  center?: [number, number]
  zoom?: number
  onPinClick?: (id: string) => void
  style?: CSSProperties
}

/* Mappa reale open-source: MapLibre GL + tile vettoriali OpenFreeMap (nessuna
   API key). mapcdn.dev citato nel brief non esiste, OpenFreeMap è l'equivalente. */
export default function FablabMap({ pins, center = [9.19, 45.468], zoom = 11.4, onPinClick, style }: FablabMapProps) {
  const ref = useRef<HTMLDivElement>(null)
  const pinsRef = useRef(pins)
  pinsRef.current = pins

  useEffect(() => {
    if (!ref.current) return
    const map = new maplibregl.Map({
      container: ref.current,
      style: 'https://tiles.openfreemap.org/styles/positron',
      center,
      zoom,
      attributionControl: { compact: true },
    })
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')

    pinsRef.current.forEach(p => {
      const el = document.createElement('div')
      el.className = 'fmap-pin' + (p.you ? ' fmap-pin--you' : '')
      el.innerHTML = p.compact
        ? `<span class="fmap-dot"></span>`
        : `<span class="fmap-label">${p.name}</span><span class="fmap-dot"></span>`
      el.title = p.name
      if (onPinClick && p.id) {
        el.style.cursor = 'pointer'
        el.addEventListener('click', () => onPinClick(p.id!))
      }
      new maplibregl.Marker({ element: el, anchor: 'bottom' }).setLngLat([p.lng, p.lat]).addTo(map)
    })

    return () => { map.remove() }
    // ponytail: pins statici da mock, niente sync marker su re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={ref} style={{ position: 'absolute', inset: 0, ...style }} />
}
