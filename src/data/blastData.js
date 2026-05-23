// Acoustic blast detections (microphone network)
// Multi-directional artillery saturation around Pokrovsk (48.2833, 37.1667)

import { NUM_SNAPSHOTS } from './mockData.js'

function createRng(seed) {
  let s = ((seed % 2147483647) + 2147483647) % 2147483647 || 1
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

export const LINGER_SNAPSHOTS = 2

const BLASTS_RAW = [
  // Early: sporadic prep fires along Alpha's NW approach
  { idx: 4,  lat: 48.42, lng: 36.92, label: 'BLAST-01' },
  { idx: 7,  lat: 48.40, lng: 36.96, label: 'BLAST-02' },
  { idx: 11, lat: 48.38, lng: 36.98, label: 'BLAST-03' },

  // Mid: Alpha's axis, CMD-Charlie targeted
  { idx: 15, lat: 48.36, lng: 37.02, label: 'BLAST-04' },
  { idx: 17, lat: 48.39, lng: 37.01, label: 'BLAST-05' },
  { idx: 18, lat: 48.35, lng: 37.05, label: 'BLAST-06' },
  { idx: 20, lat: 48.37, lng: 36.99, label: 'BLAST-07' },
  { idx: 21, lat: 48.34, lng: 37.08, label: 'BLAST-08' },
  { idx: 24, lat: 48.33, lng: 37.10, label: 'BLAST-09' },

  // Southern axis: following Gamma up from the south
  { idx: 10, lat: 48.13, lng: 37.20, label: 'BLAST-10' },
  { idx: 14, lat: 48.15, lng: 37.18, label: 'BLAST-11' },
  { idx: 19, lat: 48.17, lng: 37.17, label: 'BLAST-12' },
  { idx: 23, lat: 48.19, lng: 37.16, label: 'BLAST-13' },
  { idx: 27, lat: 48.21, lng: 37.16, label: 'BLAST-14' },

  // Eastern axis: following Delta from the east
  { idx: 12, lat: 48.34, lng: 37.50, label: 'BLAST-15' },
  { idx: 16, lat: 48.33, lng: 37.44, label: 'BLAST-16' },
  { idx: 22, lat: 48.32, lng: 37.38, label: 'BLAST-17' },
  { idx: 26, lat: 48.31, lng: 37.32, label: 'BLAST-18' },
  { idx: 29, lat: 48.30, lng: 37.28, label: 'BLAST-19' },

  // Zeta SE axis
  { idx: 13, lat: 48.19, lng: 37.43, label: 'BLAST-20' },
  { idx: 20, lat: 48.21, lng: 37.37, label: 'BLAST-21' },
  { idx: 28, lat: 48.23, lng: 37.30, label: 'BLAST-22' },

  // Late: closing in from all axes, Pokrovsk outskirts
  { idx: 30, lat: 48.32, lng: 37.12, label: 'BLAST-23' },
  { idx: 31, lat: 48.26, lng: 37.12, label: 'BLAST-24' },
  { idx: 32, lat: 48.24, lng: 37.24, label: 'BLAST-25' },
  { idx: 33, lat: 48.31, lng: 37.14, label: 'BLAST-26' },
  { idx: 34, lat: 48.22, lng: 37.20, label: 'BLAST-27' },
  { idx: 35, lat: 48.28, lng: 37.10, label: 'BLAST-28' },
  { idx: 36, lat: 48.30, lng: 37.15, label: 'BLAST-29' },
  { idx: 37, lat: 48.25, lng: 37.22, label: 'BLAST-30' },
  { idx: 38, lat: 48.29, lng: 37.16, label: 'BLAST-31' },
  { idx: 39, lat: 48.27, lng: 37.13, label: 'BLAST-32' },

  // Final: dense saturation barrage over Pokrovsk
  { idx: 40, lat: 48.29, lng: 37.19, label: 'BLAST-33' },
  { idx: 41, lat: 48.28, lng: 37.17, label: 'BLAST-34' },
  { idx: 41, lat: 48.26, lng: 37.14, label: 'BLAST-35' },
  { idx: 42, lat: 48.30, lng: 37.21, label: 'BLAST-36' },
  { idx: 43, lat: 48.28, lng: 37.16, label: 'BLAST-37' },
  { idx: 43, lat: 48.25, lng: 37.18, label: 'BLAST-38' },
  { idx: 44, lat: 48.31, lng: 37.14, label: 'BLAST-39' },
  { idx: 44, lat: 48.27, lng: 37.20, label: 'BLAST-40' },
  { idx: 45, lat: 48.29, lng: 37.15, label: 'BLAST-41' },
  { idx: 45, lat: 48.24, lng: 37.17, label: 'BLAST-42' },
  { idx: 46, lat: 48.28, lng: 37.19, label: 'BLAST-43' },
  { idx: 46, lat: 48.30, lng: 37.16, label: 'BLAST-44' },
  { idx: 47, lat: 48.26, lng: 37.21, label: 'BLAST-45' },
  { idx: 47, lat: 48.29, lng: 37.13, label: 'BLAST-46' },
  { idx: 47, lat: 48.32, lng: 37.18, label: 'BLAST-47' },
]

export const blasts = BLASTS_RAW.map((b, i) => {
  const r = createRng(i * 97 + 777)
  return {
    ...b,
    lat: b.lat + (r() - 0.5) * 0.012,
    lng: b.lng + (r() - 0.5) * 0.016,
  }
})

export function blastsAtSnapshot(snapshotIndex) {
  return blasts.filter(
    (b) => snapshotIndex >= b.idx && snapshotIndex <= b.idx + LINGER_SNAPSHOTS
  )
}
