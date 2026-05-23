// Acoustic blast detections (microphone network)
// Narrative: strikes land along and ahead of Drone Swarm Alpha's axis of advance toward Pokrovsk.
// As the swarm closes in over 24h, blast frequency increases near the target area.

import { NUM_SNAPSHOTS } from './mockData.js'

function createRng(seed) {
  let s = ((seed % 2147483647) + 2147483647) % 2147483647 || 1
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

// Each blast: { id, snapshotIndex, lat, lng, label }
// Visible from snapshotIndex to snapshotIndex + LINGER_SNAPSHOTS (inclusive)
export const LINGER_SNAPSHOTS = 2

const BLASTS_RAW = [
  // Early phase: sporadic, ahead of the swarm on its NW approach path
  { idx: 4,  lat: 48.42, lng: 36.92, label: 'BLAST-01' },
  { idx: 7,  lat: 48.40, lng: 36.96, label: 'BLAST-02' },
  { idx: 11, lat: 48.38, lng: 36.98, label: 'BLAST-03' },

  // Mid phase: swarm halfway, strikes follow its axis toward Pokrovsk
  { idx: 15, lat: 48.36, lng: 37.02, label: 'BLAST-04' },
  { idx: 18, lat: 48.35, lng: 37.05, label: 'BLAST-05' },
  { idx: 21, lat: 48.34, lng: 37.08, label: 'BLAST-06' },
  { idx: 24, lat: 48.33, lng: 37.10, label: 'BLAST-07' },

  // CMD-Charlie targeted as it fades (t approx 0.35-0.45)
  { idx: 17, lat: 48.39, lng: 37.01, label: 'BLAST-08' },
  { idx: 20, lat: 48.37, lng: 36.99, label: 'BLAST-09' },

  // Late phase: swarm nearing Pokrovsk, strike density increases
  { idx: 30, lat: 48.32, lng: 37.12, label: 'BLAST-10' },
  { idx: 33, lat: 48.31, lng: 37.14, label: 'BLAST-11' },
  { idx: 36, lat: 48.30, lng: 37.15, label: 'BLAST-12' },
  { idx: 38, lat: 48.29, lng: 37.16, label: 'BLAST-13' },

  // Final approach: Pokrovsk area, heavy barrage
  { idx: 41, lat: 48.28, lng: 37.17, label: 'BLAST-14' },
  { idx: 43, lat: 48.30, lng: 37.19, label: 'BLAST-15' },
  { idx: 45, lat: 48.27, lng: 37.16, label: 'BLAST-16' },
  { idx: 46, lat: 48.29, lng: 37.18, label: 'BLAST-17' },
]

// Add small position jitter per blast so they don't stack perfectly
export const blasts = BLASTS_RAW.map((b, i) => {
  const r = createRng(i * 97 + 777)
  return {
    ...b,
    lat: b.lat + (r() - 0.5) * 0.012,
    lng: b.lng + (r() - 0.5) * 0.016,
  }
})

// Returns blasts visible at a given snapshot index
export function blastsAtSnapshot(snapshotIndex) {
  return blasts.filter(
    (b) => snapshotIndex >= b.idx && snapshotIndex <= b.idx + LINGER_SNAPSHOTS
  )
}
