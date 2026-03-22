import React, { useState } from 'react'
import { useExercises } from './hooks/useExercises'
import { Home }          from './views/Home'
import { LogWorkout }    from './views/LogWorkout'
import { ExerciseDetail } from './views/ExerciseDetail'
import { WeeklyPlan }    from './views/WeeklyPlan'
import { BottomNav }     from './components/BottomNav'
import { LogModal }      from './components/LogModal'
import { RestTimer }     from './components/RestTimer'

/**
 * Root application component.
 *
 * View hierarchy:
 *   ┌─────────────────────────────────────────┐
 *   │  Main view (home | log | plan)           │
 *   │  ──────────────────────────────────────  │
 *   │  ExerciseDetail overlay  (z-40)          │
 *   │  LogModal sheet          (z-50)          │
 *   │  RestTimer overlay       (z-50)          │
 *   │  BottomNav               (z-40)          │
 *   └─────────────────────────────────────────┘
 *
 * State lifted here so ExerciseDetail and LogModal can be triggered
 * from any view without prop-drilling through sibling views.
 */
export default function App() {
  // ── Navigation ────────────────────────────────────────────
  const [view, setView] = useState('home') // 'home' | 'log' | 'plan'

  // ── Overlay state ─────────────────────────────────────────
  const [selectedExercise,  setSelectedExercise]  = useState(null) // ExerciseDetail
  const [logModalExercise,  setLogModalExercise]  = useState(null) // LogModal
  const [restTimer,         setRestTimer]         = useState(null) // { exerciseName, duration, isNewPR }

  // Default rest duration (seconds) — user adjusts live on the timer
  const [timerDuration] = useState(90)

  // ── Data ─────────────────────────────────────────────────
  const { exercises, loading, addExercise } = useExercises()

  // ── Handlers ─────────────────────────────────────────────

  /** Open LogModal for an exercise (called from any view) */
  function handleLogExercise(exercise) {
    setLogModalExercise(exercise)
  }

  /** After a set is saved: close LogModal, start rest timer */
  function handleLogSaved(isNewPR) {
    const name = logModalExercise?.name ?? ''
    setLogModalExercise(null)
    setRestTimer({ exerciseName: name, duration: timerDuration, isNewPR })
  }

  /** Dismiss rest timer (done or skipped) */
  function handleTimerDismiss() {
    setRestTimer(null)
  }

  // ── Loading screen ────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gym-bg flex flex-col items-center justify-center gap-4">
        {/* Animated brand ring */}
        <div className="w-14 h-14 rounded-full border-4 border-brand/30 border-t-brand animate-spin" />
        <p className="font-display font-bold text-xl text-white/30">Loading…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gym-bg">

      {/* ── Main views ──────────────────────────────────────── */}
      {view === 'home' && (
        <Home
          exercises={exercises}
          onLogExercise={handleLogExercise}
          onSelectExercise={setSelectedExercise}
        />
      )}

      {view === 'log' && (
        <LogWorkout
          exercises={exercises}
          addExercise={addExercise}
          onLogExercise={handleLogExercise}
          onSelectExercise={setSelectedExercise}
        />
      )}

      {view === 'plan' && (
        <WeeklyPlan
          exercises={exercises}
          onLogExercise={handleLogExercise}
        />
      )}

      {/* ── Exercise detail (full-screen overlay, z-40) ──────── */}
      {selectedExercise && (
        <ExerciseDetail
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onLog={() => {
            // Close detail and open log modal for the same exercise
            const ex = selectedExercise
            setSelectedExercise(null)
            setLogModalExercise(ex)
          }}
        />
      )}

      {/* ── Log modal (bottom sheet, z-50) ───────────────────── */}
      {logModalExercise && (
        <LogModal
          exercise={logModalExercise}
          onClose={() => setLogModalExercise(null)}
          onSaved={handleLogSaved}
        />
      )}

      {/* ── Rest timer (z-50, shown after every logged set) ─────── */}
      {restTimer && (
        <RestTimer
          exerciseName={restTimer.exerciseName}
          duration={restTimer.duration}
          isNewPR={restTimer.isNewPR}
          onDone={handleTimerDismiss}
          onSkip={handleTimerDismiss}
        />
      )}

      {/* ── Bottom navigation (hidden while ExerciseDetail is open) */}
      {!selectedExercise && (
        <BottomNav view={view} onChange={setView} />
      )}
    </div>
  )
}
