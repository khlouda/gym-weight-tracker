import React, { useState } from 'react'
import { X, Plus, Minus, Trophy } from 'lucide-react'
import { useSaveLog } from '../hooks/useLogs'
import { CATEGORY_COLOR } from '../data/exercises'

/**
 * Bottom-sheet modal for logging a set.
 * Shows the exercise's current PR prominently before the inputs.
 *
 * Props:
 *   exercise  — { id, name, category, pr }
 *   onClose   — () => void
 *   onSaved   — (isNewPR: boolean) => void
 */
export function LogModal({ exercise, onClose, onSaved }) {
  // Pre-fill weight from last PR so the user just has to confirm or change
  const [weight, setWeight] = useState(exercise.pr?.weight ?? '')
  const [reps,   setReps]   = useState(exercise.pr?.reps ?? 8)
  const [sets,   setSets]   = useState(3)

  const { saveLog, saving } = useSaveLog()

  const canSave = String(weight).trim() !== '' && Number(weight) > 0

  async function handleSave() {
    if (!canSave) return
    const { isNewPR } = await saveLog({
      exerciseId:   exercise.id,
      exerciseName: exercise.name,
      weight:       Number(weight),
      reps:         Number(reps),
      sets:         Number(sets),
    })
    onSaved(isNewPR)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative bg-gym-elevated rounded-t-3xl animate-slide-up">
        {/* Drag handle */}
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-3 mb-0" />

        <div className="px-5 pt-4 pb-6 pb-safe">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-2xl text-gym-text leading-tight">
                {exercise.name}
              </h2>
              <span className={`inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full border ${
                CATEGORY_COLOR[exercise.category] ?? 'bg-white/10 text-white/50 border-white/10'
              }`}>
                {exercise.category}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 text-white/50 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current PR */}
          {exercise.pr ? (
            <div className="flex items-center gap-3 bg-brand/10 border border-brand/25 rounded-2xl px-4 py-3 mb-6">
              <Trophy className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <div>
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Current PR</p>
                <p className="font-display font-bold text-brand-light text-xl leading-tight">
                  {exercise.pr.weight} kg × {exercise.pr.reps} reps
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 mb-6">
              <Trophy className="w-5 h-5 text-white/20 flex-shrink-0" />
              <p className="text-white/30 text-sm">No PR yet — this could be your first!</p>
            </div>
          )}

          {/* Inputs: Weight / Reps / Sets */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <NumberInput
              label="Weight (kg)"
              value={weight}
              onChange={setWeight}
              step={2.5}
              min={0}
              decimals
            />
            <NumberInput
              label="Reps"
              value={reps}
              onChange={setReps}
              step={1}
              min={1}
            />
            <NumberInput
              label="Sets"
              value={sets}
              onChange={setSets}
              step={1}
              min={1}
            />
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving || !canSave}
            className="w-full py-4 bg-brand text-white font-display font-bold text-xl rounded-2xl
                       disabled:opacity-40 active:scale-[0.98] transition-transform"
          >
            {saving ? 'Saving…' : 'Log Set'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── NumberInput ──────────────────────────────────────────────────────────────

/**
 * A compact +/− stepper input designed for phone tapping.
 * The center is a plain number input for keyboard entry.
 */
function NumberInput({ label, value, onChange, step, min, decimals = false }) {
  function decrement() {
    onChange(v => {
      const next = Math.max(min, (Number(v) || 0) - step)
      return decimals ? parseFloat(next.toFixed(1)) : next
    })
  }

  function increment() {
    onChange(v => {
      const next = (Number(v) || 0) + step
      return decimals ? parseFloat(next.toFixed(1)) : next
    })
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center gap-2">
      <span className="text-white/35 text-[10px] text-center leading-tight">{label}</span>

      {/* + button */}
      <button
        onClick={increment}
        className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white active:bg-white/20"
      >
        <Plus className="w-4 h-4" />
      </button>

      {/* Value */}
      <input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full text-center bg-transparent text-gym-text font-display font-bold text-2xl
                   focus:outline-none"
      />

      {/* − button */}
      <button
        onClick={decrement}
        className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white active:bg-white/20"
      >
        <Minus className="w-4 h-4" />
      </button>
    </div>
  )
}
