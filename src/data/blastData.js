// Acoustic blast detections (microphone network)
// Narrative: strikes land along and ahead of Drone Swarm Alpha's axis of advance.
// As the swarm closes in over 24h, blast frequency increases near the target area.

import { NUM_SNAPSHOTS } from './mockData.js'

function createRng(seed) {
  let s = ((seed % 2147483647) + 2147483647) % 2147483647 || 1
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

// Each blast: { id, snapshotIndex, lat, lng, label }
// Visible from snapshotIndex to snapshotIndex + LINGER_SNAPSHOTS (inclusive)
export const LINGER_SNAPSHOTS = 2

const BLASTS_RAW = [
  // Early phase — sporadic, ahead of the swarm's future path (softening)
  { idx: 4,  lat: 48.14, lng: 37.60, label: 'BLAST-01' },
  { idx: 7,  lat: 48.16, lng: 37.65, label: 'BLAST-02' },
  { idx: 11, lat: 48.13, lng: 37.58, label: 'BLAST-03' },

  // Mid phase — swarm halfway, strikes follow its axis
  { idx: 15, lat: 48.18, lng: 37.62, label: 'BLAST-04' },
  { idx: 18, lat: 48.12, lng: 37.68, label: 'BLAST-05' },
  { idx: 21, lat: 48.15, lng: 37.70, label: 'BLAST-06' },
  { idx: 24, lat: 48.10, lng: 37.66, label: 'BLAST-07' },

  // CMD-Charlie targeted as it fades (t≈0.35–0.45)
  { idx: 17, lat: 48.19, lng: 37.56, label: 'BLAST-08' },
  { idx: 20, lat: 48.17, lng: 37.54, label: 'BLAST-09' },

  // Late phase — swarm nearing objective, strike density increases
  { idx: 30, lat: 48.09, lng: 37.73, label: 'BLAST-10' },
  { idx: 33, lat: 48.08, lng: 37.71, label: 'BLAST-11' },
  { idx: 36, lat: 48.07, lng: 37.76, label: 'BLAST-12' },
  { idx: 38, lat: 48.06, lng: 37.74, label: 'BLAST-13' },

  // Final approach — objective area, heavy barrage
  { idx: 41, lat: 48.05, lng: 37.78, label: 'BLAST-14' },
  { idx: 43, lat: 48.07, lng: 37.80, label: 'BLAST-15' },
  { idx: 45, lat: 48.04, lng: 37.75, label: 'BLAST-16' },
  { idx: 46, lat: 48.06, lng: 37.77, label: 'BLAST-17' },
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
