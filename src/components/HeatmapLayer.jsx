import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.heat'

const OPTIONS = {
  radius: 38,
  blur: 28,
  maxZoom: 12,
  max: 1.0,
  gradient: {
    0.0: '#64B5F6',
    0.25: '#26C6DA',
    0.55: '#FFCA28',
    0.80: '#FF7043',
    1.0:  '#E53935',
  },
}

export default function HeatmapLayer({ points }) {
  const map = useMap()
  const layerRef = useRef(null)

  // Create layer once on mount, remove on unmount
  useEffect(() => {
    layerRef.current = L.heatLayer(points, OPTIONS).addTo(map)
    return () => {
      layerRef.current?.remove()
      layerRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  // Update points in-place when snapshot changes (no flicker)
  useEffect(() => {
    layerRef.current?.setLatLngs(points)
  }, [points])

  return null
}
