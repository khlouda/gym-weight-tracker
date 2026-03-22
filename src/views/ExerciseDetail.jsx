import React, { useEffect, useState } from 'react'
import { ChevronLeft, Plus, Trophy, Dumbbell } from 'lucide-react'
import { getExerciseLogs } from '../hooks/useLogs'
import { ProgressChart } from '../components/ProgressChart'
import { CATEGORY_COLOR } from '../data/exercises'

/**
 * Full-screen overlay showing an exercise's PR, progress chart, and log history.
 *
 * Props:
 *   exercise  — { id, name, category, pr }
 *   onClose   — () => void
 *   onLog     — () => void — opens LogModal for this exercise
 */
export function ExerciseDetail({ exercise, onClose, onLog }) {
  const [logs,    setLogs]    = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getExerciseLogs(exercise.id).then(data => {
      setLogs(data)
      setLoading(false)
    })
  }, [exercise.id])

  return (
    <div className="fixed inset-0 z-40 bg-gym-bg flex flex-col animate-fade-in">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 pt-10 pb-4 border-b border-white/[0.06]">
        <button
          onClick={onClose}
          className="p-2.5 rounded-xl bg-white/[0.08] text-white flex-shrink-0"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="font-display font-bold text-2xl text-gym-text leading-tight truncate">
            {exercise.name}
          </h1>
          <span className={`inline-block mt-0.5 text-[10px] px-2 py-0.5 rounded-full border ${
            CATEGORY_COLOR[exercise.category] ?? 'bg-white/10 text-white/40 border-white/10'
          }`}>
            {exercise.category}
          </span>
        </div>

        <button
          onClick={onLog}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-brand rounded-xl
                     text-white font-display font-bold text-sm"
        >
          <Plus className="w-4 h-4" />
          Log
        </button>
      </div>

      {/* ── Scrollable body ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pb-10">

        {/* ── All-time PR ──────────────────────────────────────── */}
        <div className="mt-6 mb-6">
          {exercise.pr ? (
            <div className="bg-brand/10 border border-brand/20 rounded-3xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-white/35 text-xs font-body font-semibold uppercase tracking-widest">
                  All-Time PR
                </span>
              </div>
              <p className="font-display font-bold leading-none">
                <span className="text-6xl text-gym-text">{exercise.pr.weight}</span>
                <span className="text-2xl text-white/30 ml-1">kg</span>
              </p>
              <p className="text-white/30 text-sm mt-2 font-body">
                {exercise.pr.reps} reps &middot; {exercise.pr.date}
              </p>
            </div>
          ) : (
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-8 text-center">
              <Dumbbell className="w-8 h-8 text-white/15 mx-auto mb-3" />
              <p className="text-white/25 text-sm font-body">No PR yet — log your first set!</p>
            </div>
          )}
        </div>

        {/* ── Progress chart ───────────────────────────────────── */}
        <SectionHeader title="Progress" />
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4 mb-6">
          {loading ? (
            <div className="h-40 flex items-center justify-center text-white/20 text-sm font-body">
              Loading…
            </div>
          ) : (
            <ProgressChart logs={logs} />
          )}
        </div>

        {/* ── Log history ──────────────────────────────────────── */}
        {logs.length > 0 && (
          <>
            <SectionHeader title={`History · ${logs.length} session${logs.length !== 1 ? 's' : ''}`} />
            <div className="space-y-2">
              {[...logs].reverse().slice(0, 30).map(log => (
                <div
                  key={log.id}
                  className="flex items-center justify-between bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3"
                >
                  <span className="text-white/40 text-sm font-body">{log.date}</span>
                  <span className="font-display font-bold text-gym-text">
                    {log.sets}×{log.reps}{' '}
                    <span className="text-brand-light">@ {log.weight} kg</span>
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function SectionHeader({ title }) {
  return (
    <h2 className="font-display font-bold text-xs text-white/30 uppercase tracking-widest mb-3">
      {title}
    </h2>
  )
}
