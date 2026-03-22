import React, { useEffect, useRef, useState } from 'react'
import { Minus, Plus, Trophy } from 'lucide-react'

const RADIUS      = 48
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/**
 * Full-screen rest timer overlay shown after logging a set.
 *
 * Props:
 *   exerciseName — string
 *   duration     — initial countdown seconds (default 90)
 *   isNewPR      — boolean — shows a PR celebration banner
 *   onDone       — () => void — called when timer reaches 0
 *   onSkip       — () => void — called when user taps Skip
 */
export function RestTimer({ exerciseName, duration, isNewPR, onDone, onSkip }) {
  const [remaining, setRemaining] = useState(duration)
  const [paused,    setPaused]    = useState(false)
  const intervalRef = useRef(null)

  // Tick the timer every second when not paused
  useEffect(() => {
    if (paused) {
      clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(intervalRef.current)
          onDone()
          return 0
        }
        return r - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [paused, onDone])

  // SVG progress ring — goes from full circle down to 0
  const pct    = remaining / duration
  const offset = CIRCUMFERENCE - pct * CIRCUMFERENCE

  // Format mm:ss
  const mins = Math.floor(remaining / 60)
  const secs = String(remaining % 60).padStart(2, '0')
  const display = mins > 0 ? `${mins}:${secs}` : String(remaining)

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-end animate-fade-in">
      {/* Backdrop — tap to skip */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onSkip} />

      {/* Panel */}
      <div className="relative w-full bg-gym-elevated border-t border-white/10 rounded-t-3xl px-6 pt-4 pb-safe animate-slide-up">
        {/* Drag handle */}
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />

        {/* New PR celebration */}
        {isNewPR && (
          <div className="flex items-center justify-center gap-2 bg-yellow-400/10 border border-yellow-400/25 rounded-2xl px-4 py-3 mb-5">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="font-display font-bold text-yellow-300 text-lg">New Personal Record!</span>
          </div>
        )}

        {/* Exercise context */}
        <p className="text-white/35 text-xs text-center uppercase tracking-widest mb-0.5">Rest after</p>
        <p className="font-display font-bold text-xl text-gym-text text-center mb-6 leading-tight">
          {exerciseName}
        </p>

        {/* SVG ring countdown */}
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg className="-rotate-90 w-full h-full" viewBox="0 0 120 120">
              {/* Track */}
              <circle
                cx="60" cy="60" r={RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="7"
              />
              {/* Progress */}
              <circle
                cx="60" cy="60" r={RADIUS}
                fill="none"
                stroke="#634DB3"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 0.9s linear' }}
              />
            </svg>
            {/* Time display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display font-bold text-4xl text-gym-text">{display}</span>
            </div>
          </div>
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-center gap-4 mb-5">
          {/* −30s */}
          <button
            onClick={() => setRemaining(r => Math.max(1, r - 30))}
            className="flex flex-col items-center gap-1 px-4 py-3 bg-white/8 rounded-2xl text-white/50"
          >
            <Minus className="w-4 h-4" />
            <span className="text-xs">30s</span>
          </button>

          {/* Pause / Resume */}
          <button
            onClick={() => setPaused(p => !p)}
            className="px-10 py-3 bg-brand rounded-2xl text-white font-display font-bold text-lg"
          >
            {paused ? 'Resume' : 'Pause'}
          </button>

          {/* +30s */}
          <button
            onClick={() => setRemaining(r => r + 30)}
            className="flex flex-col items-center gap-1 px-4 py-3 bg-white/8 rounded-2xl text-white/50"
          >
            <Plus className="w-4 h-4" />
            <span className="text-xs">30s</span>
          </button>
        </div>

        {/* Skip link */}
        <button
          onClick={onSkip}
          className="w-full py-2 text-white/30 text-sm font-body"
        >
          Skip rest
        </button>
      </div>
    </div>
  )
}
