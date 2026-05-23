import { useRef, useEffect, useCallback } from 'react'

export default function Timeline({ snapshots, currentIndex, onSelect, isPlaying, onPlayToggle }) {
  const trackRef = useRef(null)
  const maxSignals = Math.max(...snapshots.map((s) => s.signalCount))

  const handleTrackClick = useCallback(
    (e) => {
      if (!trackRef.current) return
      const rect = trackRef.current.getBoundingClientRect()
      const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      onSelect(Math.round(fraction * (snapshots.length - 1)))
    },
    [snapshots.length, onSelect]
  )

  // Arrow key + spacebar navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  onSelect(Math.max(0, currentIndex - 1))
      if (e.key === 'ArrowRight') onSelect(Math.min(snapshots.length - 1, currentIndex + 1))
      if (e.key === ' ') { e.preventDefault(); onPlayToggle() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [currentIndex, snapshots.length, onSelect, onPlayToggle])

  const current = snapshots[currentIndex]
  const timeStr = new Date(current.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const dateStr = new Date(current.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })
  const cursorPct = (currentIndex / (snapshots.length - 1)) * 100

  return (
    <div className="timeline">
      <button className="play-btn" onClick={onPlayToggle} title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}>
        {isPlaying
          ? <PauseIcon />
          : <PlayIcon />}
      </button>

      <div className="timeline-main" ref={trackRef} onClick={handleTrackClick}>
        <div className="timeline-labels">
          <span>24h ago</span>
          <span>−18h</span>
          <span>−12h</span>
          <span>−6h</span>
          <span>Now</span>
        </div>

        <div className="timeline-track">
          <div className="timeline-rail" />

          {snapshots.map((snap, i) => {
            const pct = (i / (snapshots.length - 1)) * 100
            const size = 4 + (snap.signalCount / maxSignals) * 10
            return (
              <button
                key={i}
                className={`tl-dot${i === currentIndex ? ' active' : ''}`}
                style={{ left: `${pct}%`, width: `${size}px`, height: `${size}px` }}
                onClick={(e) => { e.stopPropagation(); onSelect(i) }}
                aria-label={new Date(snap.timestamp).toLocaleTimeString()}
              />
            )
          })}

          <div className="tl-cursor" style={{ left: `${cursorPct}%` }} />
        </div>
      </div>

      <div className="timeline-display">
        <div className="tl-time">{timeStr}</div>
        <div className="tl-date">{dateStr}</div>
        <div className="tl-count">{current.signalCount} signals</div>
      </div>
    </div>
  )
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <polygon points="3,1 13,7 3,13" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <rect x="2" y="1" width="4" height="12" rx="1" />
      <rect x="8" y="1" width="4" height="12" rx="1" />
    </svg>
  )
}
