import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// SVG crosshair / targeting reticle for blast markers
function makeBlastIcon(age) {
  // age: 0 = fresh, 1 = one snapshot old, 2 = two snapshots old
  const opacity = age === 0 ? 1 : age === 1 ? 0.65 : 0.35
  const svg = `
    <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="11" fill="none" stroke="#FF6D00" stroke-width="2" opacity="${opacity}"/>
      <circle cx="14" cy="14" r="3" fill="#FF6D00" opacity="${opacity}"/>
      <line x1="14" y1="1"  x2="14" y2="8"  stroke="#FF6D00" stroke-width="2" stroke-linecap="round" opacity="${opacity}"/>
      <line x1="14" y1="20" x2="14" y2="27" stroke="#FF6D00" stroke-width="2" stroke-linecap="round" opacity="${opacity}"/>
      <line x1="1"  y1="14" x2="8"  y2="14" stroke="#FF6D00" stroke-width="2" stroke-linecap="round" opacity="${opacity}"/>
      <line x1="20" y1="14" x2="27" y2="14" stroke="#FF6D00" stroke-width="2" stroke-linecap="round" opacity="${opacity}"/>
    </svg>`

  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  })
}

export default function BlastLayer({ visibleBlasts, currentSnapshotIndex }) {
  return visibleBlasts.map((blast) => {
    const age = currentSnapshotIndex - blast.idx
    return (
      <Marker
        key={blast.id}
        position={[blast.lat, blast.lng]}
        icon={makeBlastIcon(age)}
      >
        <Popup>
          <strong>{blast.label}</strong><br />
          Acoustic impact detected
        </Popup>
      </Marker>
    )
  })
}
