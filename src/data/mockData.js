// Deterministic seeded RNG (Park-Miller LCG)
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

const NOW = Date.now()
const HALF_HOUR = 30 * 60 * 1000
export const NUM_SNAPSHOTS = 48

function generateSnapshot(idx) {
  const t = idx / (NUM_SNAPSHOTS - 1) // 0 = 24h ago, 1 = now
  const timestamp = NOW - (NUM_SNAPSHOTS - 1 - idx) * HALF_HOUR

  const heatPoints = []
  const markers = []

  // DRONE SWARM ALPHA
  // 12 drones approaching Pokrovsk from the NW. Last 25%: formation disperses, 5 are lost.
  const alphaLat = lerp(48.45, 48.28, t)
  const alphaLng = lerp(36.85, 37.17, t)
  const alphaSpread = t < 0.75 ? 0.04 : lerp(0.04, 0.11, (t - 0.75) / 0.25)
  const alphaDrones = t < 0.75 ? 12 : Math.round(lerp(12, 7, (t - 0.75) / 0.25))

  for (let i = 0; i < alphaDrones; i++) {
    const r = createRng(idx * 113 + i * 7 + 1)
    const angle = (i / alphaDrones) * Math.PI * 2 + (r() - 0.5) * 0.6
    const dist = alphaSpread * (0.25 + r() * 0.75)
    const lat = alphaLat + Math.cos(angle) * dist + (r() - 0.5) * 0.006
    const lng = alphaLng + Math.sin(angle) * dist * 1.3 + (r() - 0.5) * 0.006
    heatPoints.push([lat, lng, 0.65 + r() * 0.35])
    if (i % 3 === 0) {
      markers.push({ id: `alpha-${i}`, lat, lng, type: 'drone', label: `UAV-A${i + 1}` })
    }
  }

  // DRONE SWARM BETA
  // 4 scout drones approaching from the east, present first 50% then destroyed/RTB
  if (t <= 0.5) {
    const bt = t / 0.5
    const bLat = lerp(48.30, 48.32, bt)
    const bLng = lerp(37.55, 37.28, bt)
    for (let i = 0; i < 4; i++) {
      const r = createRng(idx * 71 + i * 11 + 999)
      const lat = bLat + (r() - 0.5) * 0.04
      const lng = bLng + (r() - 0.5) * 0.05
      heatPoints.push([lat, lng, 0.5 + r() * 0.35])
      markers.push({ id: `beta-${i}`, lat, lng, type: 'drone', label: `UAV-B${i + 1}` })
    }
  }

  // DRONE SWARM GAMMA
  // 8 drones pushing north from the south, present all 24h
  const gammaLat = lerp(48.10, 48.25, t)
  const gammaLng = lerp(37.20, 37.17, t)
  for (let i = 0; i < 8; i++) {
    const r = createRng(idx * 89 + i * 13 + 7000)
    const angle = (i / 8) * Math.PI * 2 + (r() - 0.5) * 0.5
    const dist = 0.035 * (0.3 + r() * 0.7)
    const lat = gammaLat + Math.cos(angle) * dist + (r() - 0.5) * 0.005
    const lng = gammaLng + Math.sin(angle) * dist * 1.3 + (r() - 0.5) * 0.005
    heatPoints.push([lat, lng, 0.6 + r() * 0.4])
    if (i % 4 === 0) {
      markers.push({ id: `gamma-${i}`, lat, lng, type: 'drone', label: `UAV-C${i + 1}` })
    }
  }

  // DRONE SWARM DELTA
  // 10 drones converging from the east/northeast toward Pokrovsk
  const deltaLat = lerp(48.35, 48.27, t)
  const deltaLng = lerp(37.55, 37.22, t)
  for (let i = 0; i < 10; i++) {
    const r = createRng(idx * 97 + i * 17 + 8000)
    const angle = (i / 10) * Math.PI * 2 + (r() - 0.5) * 0.4
    const dist = 0.04 * (0.2 + r() * 0.8)
    const lat = deltaLat + Math.cos(angle) * dist + (r() - 0.5) * 0.006
    const lng = deltaLng + Math.sin(angle) * dist * 1.3 + (r() - 0.5) * 0.006
    heatPoints.push([lat, lng, 0.6 + r() * 0.4])
    if (i % 3 === 0) {
      markers.push({ id: `delta-${i}`, lat, lng, type: 'drone', label: `UAV-D${i + 1}` })
    }
  }

  // DRONE SWARM EPSILON
  // 6 loitering FPV drones circling NE of Pokrovsk from t=0.4 onward
  if (t >= 0.40) {
    const et = (t - 0.40) / 0.60
    const eLat = 48.34
    const eLng = 37.30
    const orbitRadius = 0.03 + et * 0.02
    for (let i = 0; i < 6; i++) {
      const r = createRng(idx * 67 + i * 23 + 9000)
      const angle = (i / 6) * Math.PI * 2 + t * Math.PI * 1.5
      const lat = eLat + Math.cos(angle) * orbitRadius + (r() - 0.5) * 0.008
      const lng = eLng + Math.sin(angle) * orbitRadius * 1.4 + (r() - 0.5) * 0.008
      heatPoints.push([lat, lng, 0.55 + r() * 0.45])
      if (i === 0) {
        markers.push({ id: `eps-${i}`, lat, lng, type: 'drone', label: `FPV-E${i + 1}` })
      }
    }
  }

  // DRONE SWARM ZETA
  // 5 drones from the SE, active t=0.2 to 0.85
  if (t >= 0.20 && t <= 0.85) {
    const zt = (t - 0.20) / 0.65
    const zLat = lerp(48.18, 48.26, zt)
    const zLng = lerp(37.45, 37.22, zt)
    for (let i = 0; i < 5; i++) {
      const r = createRng(idx * 59 + i * 31 + 10000)
      const lat = zLat + (r() - 0.5) * 0.04
      const lng = zLng + (r() - 0.5) * 0.05
      heatPoints.push([lat, lng, 0.5 + r() * 0.4])
      if (i === 2) {
        markers.push({ id: `zeta-${i}`, lat, lng, type: 'drone', label: `UAV-Z${i + 1}` })
      }
    }
  }

  // AREA SATURATION AROUND POKROVSK
  // Dense individual detections within ~12km radius from t=0.5 onward,
  // representing maximum drone activity as the attack develops
  if (t >= 0.50) {
    const satT = (t - 0.50) / 0.50
    const satCount = Math.round(lerp(8, 22, satT))
    for (let i = 0; i < satCount; i++) {
      const r = createRng(idx * 131 + i * 41 + 11000)
      const angle = r() * Math.PI * 2
      const dist = r() * 0.12
      const lat = 48.283 + Math.cos(angle) * dist
      const lng = 37.167 + Math.sin(angle) * dist * 1.4
      heatPoints.push([lat, lng, 0.45 + r() * 0.55])
      if (i % 5 === 0) {
        markers.push({ id: `sat-${idx}-${i}`, lat, lng, type: 'drone', label: `UAV-S${i + 1}` })
      }
    }
  }

  // RADIO COMMAND POST CHARLIE
  // Strong 0-25%, fades 25-50%, gone after 50%
  if (t <= 0.5) {
    const intensity = t <= 0.25 ? 0.9 : lerp(0.9, 0.05, (t - 0.25) / 0.25)
    const cLat = 48.38
    const cLng = 37.00
    for (let i = 0; i < 6; i++) {
      const r = createRng(idx * 53 + i * 13 + 2000)
      heatPoints.push([
        cLat + (r() - 0.5) * 0.025,
        cLng + (r() - 0.5) * 0.035,
        intensity * (0.7 + r() * 0.3),
      ])
    }
    if (intensity > 0.2) {
      markers.push({ id: 'charlie', lat: cLat, lng: cLng, type: 'radio', label: 'CMD-Charlie' })
    }
  }

  // RADIO COMMAND POST ECHO
  // Appears at 75% and grows to full intensity by 100%
  if (t >= 0.75) {
    const et = (t - 0.75) / 0.25
    const intensity = lerp(0.2, 0.9, et)
    const eLat = 48.42
    const eLng = 36.92
    for (let i = 0; i < 5; i++) {
      const r = createRng(idx * 61 + i * 17 + 3000)
      const spread = 0.4 + et * 0.6
      heatPoints.push([
        eLat + (r() - 0.5) * 0.022 * spread,
        eLng + (r() - 0.5) * 0.032 * spread,
        intensity * (0.7 + r() * 0.3),
      ])
    }
    markers.push({ id: 'echo', lat: eLat, lng: eLng, type: 'radio', label: 'CMD-Echo' })
  }

  // RADIO RELAY STATION
  // Persistent relay near Pokrovsk center throughout the battle
  const relayLat = 48.22
  const relayLng = 37.20
  for (let i = 0; i < 4; i++) {
    const r = createRng(idx * 47 + i * 23 + 12000)
    heatPoints.push([
      relayLat + (r() - 0.5) * 0.015,
      relayLng + (r() - 0.5) * 0.020,
      0.5 + r() * 0.3,
    ])
  }
  if (idx % 6 === 0) {
    markers.push({ id: 'relay', lat: relayLat, lng: relayLng, type: 'radio', label: 'RELAY-1' })
  }

  // RADIO SOUTHERN COMMAND (follows Gamma from the south)
  const scLat = lerp(48.12, 48.22, t)
  const scLng = lerp(37.18, 37.17, t)
  for (let i = 0; i < 3; i++) {
    const r = createRng(idx * 73 + i * 29 + 13000)
    heatPoints.push([
      scLat + (r() - 0.5) * 0.02,
      scLng + (r() - 0.5) * 0.025,
      0.4 + r() * 0.4,
    ])
  }
  if (t >= 0.3 && idx % 8 === 0) {
    markers.push({ id: 'sc', lat: scLat, lng: scLng, type: 'radio', label: 'CMD-South' })
  }

  // RADIO FORWARD UNITS (trailing Alpha)
  const fLat = lerp(48.43, 48.26, t) - 0.04
  const fLng = lerp(36.83, 37.15, t) - 0.025
  for (let i = 0; i < 3; i++) {
    const r = createRng(idx * 43 + i * 19 + 4000)
    const lat = fLat + (r() - 0.5) * 0.04
    const lng = fLng + (r() - 0.5) * 0.06
    heatPoints.push([lat, lng, 0.45 + r() * 0.35])
    if (i === 1) {
      markers.push({ id: `fwd-${i}`, lat, lng, type: 'radio', label: `FWD-${i + 1}` })
    }
  }

  // WIFI CLUSTER 1 - near Pokrovsk center
  for (let i = 0; i < 8; i++) {
    const rBase = createRng(i * 29 + 5000)
    const rJit = createRng(idx * 37 + i + 5000)
    const lat = 48.25 + (rBase() - 0.5) * 0.03 + (rJit() - 0.5) * 0.004
    const lng = 37.18 + (rBase() - 0.5) * 0.04 + (rJit() - 0.5) * 0.004
    heatPoints.push([lat, lng, 0.25 + rBase() * 0.25])
    if (i === 3) {
      markers.push({ id: `w1-${i}`, lat, lng, type: 'wifi', label: `DEV-W${i + 1}` })
    }
  }

  // WIFI CLUSTER 2 - northwest of Pokrovsk
  for (let i = 0; i < 6; i++) {
    const rBase = createRng(i * 31 + 6000)
    const rJit = createRng(idx * 41 + i + 6000)
    const lat = 48.32 + (rBase() - 0.5) * 0.025 + (rJit() - 0.5) * 0.003
    const lng = 37.08 + (rBase() - 0.5) * 0.035 + (rJit() - 0.5) * 0.003
    heatPoints.push([lat, lng, 0.2 + rBase() * 0.2])
    if (i === 2) {
      markers.push({ id: `w2-${i}`, lat, lng, type: 'wifi', label: `DEV-M${i + 1}` })
    }
  }

  // WIFI CLUSTER 3 - south of Pokrovsk (village)
  for (let i = 0; i < 5; i++) {
    const rBase = createRng(i * 37 + 14000)
    const rJit = createRng(idx * 53 + i + 14000)
    const lat = 48.18 + (rBase() - 0.5) * 0.022 + (rJit() - 0.5) * 0.003
    const lng = 37.14 + (rBase() - 0.5) * 0.030 + (rJit() - 0.5) * 0.003
    heatPoints.push([lat, lng, 0.2 + rBase() * 0.2])
    if (i === 1) {
      markers.push({ id: `w3-${i}`, lat, lng, type: 'wifi', label: `DEV-S${i + 1}` })
    }
  }

  // WIFI CLUSTER 4 - east of Pokrovsk (industrial zone)
  for (let i = 0; i < 7; i++) {
    const rBase = createRng(i * 43 + 15000)
    const rJit = createRng(idx * 61 + i + 15000)
    const lat = 48.27 + (rBase() - 0.5) * 0.025 + (rJit() - 0.5) * 0.003
    const lng = 37.35 + (rBase() - 0.5) * 0.035 + (rJit() - 0.5) * 0.003
    heatPoints.push([lat, lng, 0.2 + rBase() * 0.2])
    if (i === 3) {
      markers.push({ id: `w4-${i}`, lat, lng, type: 'wifi', label: `DEV-E${i + 1}` })
    }
  }

  // LONE SIGNALS
  const lone = [
    { id: 'uavx', lat: 48.32, lng: 37.38, type: 'drone', label: 'UAV-X',  from: 0.45, to: 0.75 },
    { id: 'sig7', lat: 48.20, lng: 37.38, type: 'radio', label: 'SIG-7',  from: 0.00, to: 0.40 },
    { id: 'dev3', lat: 48.28, lng: 37.08, type: 'wifi',  label: 'DEV-3',  from: 0.60, to: 1.00 },
    { id: 'unk1', lat: 48.40, lng: 37.38, type: 'drone', label: 'UNK-1',  from: 0.30, to: 0.60 },
    { id: 'unk2', lat: 48.16, lng: 37.10, type: 'drone', label: 'UNK-2',  from: 0.50, to: 1.00 },
    { id: 'unk3', lat: 48.24, lng: 36.98, type: 'drone', label: 'UNK-3',  from: 0.10, to: 0.55 },
    { id: 'sig8', lat: 48.38, lng: 37.22, type: 'radio', label: 'SIG-8',  from: 0.35, to: 0.80 },
    { id: 'sig9', lat: 48.21, lng: 37.42, type: 'radio', label: 'SIG-9',  from: 0.55, to: 1.00 },
  ]
  for (const sig of lone) {
    if (t >= sig.from && t <= sig.to) {
      markers.push(sig)
      heatPoints.push([sig.lat, sig.lng, 0.75])
    }
  }

  return { timestamp, index: idx, heatPoints, markers, signalCount: heatPoints.length }
}

export const snapshots = Array.from({ length: NUM_SNAPSHOTS }, (_, i) => generateSnapshot(i))

export const signalTypeConfig = {
  drone: { color: '#E53935', label: 'UAV / Drone' },
  radio: { color: '#1E88E5', label: 'Radio Comm' },
  wifi:  { color: '#8E24AA', label: 'WiFi / BT'   },
}
