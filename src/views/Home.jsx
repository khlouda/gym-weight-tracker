import React from 'react'
import { Plus, Trophy, Dumbbell, ChevronRight } from 'lucide-react'
import { useTodayLogs } from '../hooks/useLogs'
import { useWeeklyPlan, getTodayKey, DAYS_ORDERED } from '../hooks/useWeeklyPlan'
import { CATEGORY_COLOR } from '../data/exercises'

/**
 * Home / Today view.
 * Shows:
 *   - Today's date + workout label from the weekly plan
 *   - Each scheduled exercise with its PR and a quick-Log button
 *   - All sets logged today (live-updating)
 *
 * Props:
 *   exercises       — full exercise list from useExercises
 *   onLogExercise   — (exercise) => void  — opens LogModal
 *   onSelectExercise— (exercise) => void  — opens ExerciseDetail
 */
export function Home({ exercises, onLogExercise, onSelectExercise }) {
  const todayLogs = useTodayLogs()
  const { plan }  = useWeeklyPlan()

  const todayKey  = getTodayKey()
  const todayPlan = plan[todayKey]

  // Resolve exercise objects for today's scheduled IDs
  const exMap = Object.fromEntries(exercises.map(e => [e.id, e]))
  const todayExercises = (todayPlan?.exerciseIds ?? [])
    .map(id => exMap[id])
    .filter(Boolean)

  // Friendly date string
  const dateStr = new Date().toLocaleDateString('en', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="min-h-screen bg-gym-bg pb-28">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="px-4 pt-10 pb-6">
        <p className="text-white/30 text-xs font-body font-semibold uppercase tracking-widest mb-1">
          Today
        </p>
        <h1 className="font-display font-bold text-4xl text-gym-text leading-none">
          {new Date().toLocaleDateString('en', { weekday: 'long' })}
        </h1>
        <p className="text-white/35 text-sm mt-1 font-body">
          {new Date().toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        {/* Workout label badge */}
        {todayPlan?.label && (
          <div className="mt-3 inline-flex items-center gap-2 bg-brand/15 border border-brand/25 rounded-full px-3 py-1">
            <Dumbbell className="w-3.5 h-3.5 text-brand-light" />
            <span className="font-display font-bold text-brand-light text-sm">
              {todayPlan.label}
            </span>
          </div>
        )}
      </div>

      {/* ── Today's exercises ─────────────────────────────────── */}
      <section className="px-4 mb-8">
        <SectionHeader title="Today's Workout" />

        {todayExercises.length > 0 ? (
          <div className="space-y-2">
            {todayExercises.map(ex => (
              <ExerciseRow
                key={ex.id}
                exercise={ex}
                onLog={() => onLogExercise(ex)}
                onDetail={() => onSelectExercise(ex)}
              />
            ))}
          </div>
        ) : (
          <EmptyDay />
        )}
      </section>

      {/* ── Logged today ──────────────────────────────────────── */}
      {todayLogs.length > 0 && (
        <section className="px-4">
          <SectionHeader title={`Logged Today · ${todayLogs.length} set${todayLogs.length !== 1 ? 's' : ''}`} />
          <div className="space-y-2">
            {todayLogs.map(log => (
              <LogRow key={log.id} log={log} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ title }) {
  return (
    <h2 className="font-display font-bold text-xs text-white/30 uppercase tracking-widest mb-3">
      {title}
    </h2>
  )
}

function ExerciseRow({ exercise, onLog, onDetail }) {
  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/[0.08] rounded-2xl px-4 py-3.5">
      {/* Tapping name → detail view */}
      <button className="flex-1 text-left min-w-0" onClick={onDetail}>
        <p className="font-display font-bold text-gym-text text-lg leading-tight truncate">
          {exercise.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
            CATEGORY_COLOR[exercise.category] ?? 'bg-white/10 text-white/40 border-white/10'
          }`}>
            {exercise.category}
          </span>
          {exercise.pr && (
            <span className="flex items-center gap-1 text-xs text-white/35">
              <Trophy className="w-3 h-3 text-yellow-400/70" />
              {exercise.pr.weight} kg
            </span>
          )}
        </div>
      </button>

      {/* Log button */}
      <button
        onClick={onLog}
        className="flex-shrink-0 w-10 h-10 bg-brand rounded-xl flex items-center justify-center
                   active:scale-90 transition-transform"
      >
        <Plus className="w-5 h-5 text-white" />
      </button>
    </div>
  )
}

function LogRow({ log }) {
  return (
    <div className="flex items-center justify-between bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-3">
      <span className="font-display font-semibold text-gym-text text-base truncate mr-4">
        {log.exerciseName}
      </span>
      <span className="text-white/45 text-sm font-body flex-shrink-0">
        {log.sets}×{log.reps} <span className="text-brand-light font-bold">@ {log.weight} kg</span>
      </span>
    </div>
  )
}

function EmptyDay() {
  return (
    <div className="bg-white/[0.04] border border-white/[0.07] border-dashed rounded-2xl p-8 text-center">
      <Dumbbell className="w-8 h-8 text-white/15 mx-auto mb-3" />
      <p className="text-white/30 text-sm font-body">No workout scheduled for today</p>
      <p className="text-white/20 text-xs mt-1 font-body">
        Set up your weekly plan in the Plan tab
      </p>
    </div>
  )
}
