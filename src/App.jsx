import { useState, useEffect, useRef, useCallback } from 'react'
import MapView from './components/MapView'
import Timeline from './components/Timeline'
import { snapshots, signalTypeConfig } from './data/mockData'
import { blastsAtSnapshot } from './data/blastData'
import './App.css'

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(snapshots.length - 1)
  const [heatmapVisible, setHeatmapVisible] = useState(true)
  const [blastVisible, setBlastVisible] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    clearInterval(intervalRef.current)
    if (!isPlaying) return

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= snapshots.length - 1) {
          clearInterval(intervalRef.current)
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 400)

    return () => clearInterval(intervalRef.current)
  }, [isPlaying])

  const handlePlayToggle = useCallback(() => {
    if (!isPlaying && currentIndex >= snapshots.length - 1) {
      setCurrentIndex(0)
    }
    setIsPlaying((p) => !p)
  }, [isPlaying, currentIndex])

  const current = snapshots[currentIndex]
  const visibleBlasts = blastsAtSnapshot(currentIndex)

  return (
    <div className="app">
      <MapView
        snapshot={current}
        heatmapVisible={heatmapVisible}
        visibleBlasts={visibleBlasts}
        blastVisible={blastVisible}
      />

      {/* ── Top-left: branding ── */}
      <div className="ui-header">
        <div className="brand">
          <div className="brand-icon">
            <RadarIcon />
          </div>
          <div className="brand-text">
            <span className="brand-name">RFMAP</span>
            <span className="brand-sub">Battlefield of Things</span>
          </div>
        </div>
        <div className="live-badge">
          <span className="live-dot" />
          LIVE
        </div>
      </div>

      {/* ── Top-right: controls + legend ── */}
      <div className="ui-controls">
        <button
          className={`heatmap-btn${heatmapVisible ? ' on' : ' off'}`}
          onClick={() => setHeatmapVisible((v) => !v)}
        >
          <HeatIcon />
          RF Heatmap <strong>{heatmapVisible ? 'ON' : 'OFF'}</strong>
        </button>

        <button
          className={`heatmap-btn blast-btn${blastVisible ? ' on blast-on' : ' off'}`}
          onClick={() => setBlastVisible((v) => !v)}
        >
          <BlastIcon />
          Blasts <strong>{blastVisible ? 'ON' : 'OFF'}</strong>
        </button>

        <div className="legend">
          {Object.entries(signalTypeConfig).map(([key, cfg]) => (
            <div key={key} className="legend-row">
              <span className="legend-dot" style={{ background: cfg.color }} />
              {cfg.label}
            </div>
          ))}
          <div className="legend-row">
            <span className="legend-dot legend-blast" />
            Acoustic Impact
          </div>
        </div>
      </div>

      <Timeline
        snapshots={snapshots}
        currentIndex={currentIndex}
        onSelect={setCurrentIndex}
        isPlaying={isPlaying}
        onPlayToggle={handlePlayToggle}
      />
    </div>
  )
}

function RadarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="9" stroke="white" strokeWidth="1.5" />
      <circle cx="11" cy="11" r="5" stroke="white" strokeWidth="1.5" />
      <circle cx="11" cy="11" r="1.5" fill="white" />
      <line x1="11" y1="2" x2="11" y2="0" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11" y1="22" x2="11" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="0" y1="11" x2="2" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="11" x2="22" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11" y1="11" x2="18" y2="5" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function HeatIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor">
      <path d="M7.5 0C5 3 3 5 3 8a4.5 4.5 0 009 0c0-3-2-5-4.5-8zm0 13a2.5 2.5 0 01-2.5-2.5c0-1.5 1-2.5 2.5-4.5 1.5 2 2.5 3 2.5 4.5A2.5 2.5 0 017.5 13z" />
    </svg>
  )
}

function BlastIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="7.5" cy="7.5" r="5.5" />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
      <line x1="7.5" y1="1" x2="7.5" y2="3.5" />
      <line x1="7.5" y1="11.5" x2="7.5" y2="14" />
      <line x1="1" y1="7.5" x2="3.5" y2="7.5" />
      <line x1="11.5" y1="7.5" x2="14" y2="7.5" />
    </svg>
  )
}
