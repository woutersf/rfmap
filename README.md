# RFMAP - Battlefield of Things

RF signal intelligence map built for the [**Battlefield of Things** hackathon](https://inno4def.be/both/), a Belgian defence innovation challenge bringing together military personnel, engineers, and students.

**Live demo:** https://woutersf.github.io/rfmap/

---

![RFMAP screenshot](./screenshot.png)

---

## What it does

Visualises adversary RF signals (UAV swarms, radio comms, WiFi/BT devices) on a live map with a 24-hour replay timeline.

- **Map**: OpenStreetMap via CartoDB Positron tiles, centered on a tactical area of interest
- **Heatmap**: toggle RF signal density overlay on/off
- **Signal markers**: individual detections coloured by type: 🔴 UAV/Drone · 🔵 Radio Comm · 🟣 WiFi/BT
- **Timeline**: 48 snapshots (30 min intervals) over 24 hours; click any dot to jump, or press **Play** to animate
- **Keyboard**: `←` / `→` step through time, `Space` play/pause

## Stack

React 18 · Vite · Leaflet · react-leaflet · leaflet.heat

## Run locally

```bash
npm install
npm run dev
```
