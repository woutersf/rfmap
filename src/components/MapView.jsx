import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet'
import HeatmapLayer from './HeatmapLayer'
import BlastLayer from './BlastLayer'
import { signalTypeConfig } from '../data/mockData'

const POKROVSK = [48.2833, 37.1667]

export default function MapView({ snapshot, heatmapVisible, visibleBlasts, blastVisible }) {
  return (
    <MapContainer
      center={POKROVSK}
      zoom={11}
      className="map-container"
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={20}
      />

      <ZoomControl position="bottomright" />

      {heatmapVisible && <HeatmapLayer points={snapshot.heatPoints} />}

      {blastVisible && (
        <BlastLayer visibleBlasts={visibleBlasts} currentSnapshotIndex={snapshot.index} />
      )}

      {snapshot.markers.map((m) => {
        const cfg = signalTypeConfig[m.type] ?? { color: '#888' }
        return (
          <CircleMarker
            key={m.id}
            center={[m.lat, m.lng]}
            radius={6}
            pathOptions={{
              color: cfg.color,
              fillColor: cfg.color,
              fillOpacity: 0.85,
              weight: 2,
            }}
          >
            <Popup>
              <strong>{m.label}</strong><br />
              {cfg.label}
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
