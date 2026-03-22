import React, { useState } from 'react'
import { X, Check } from 'lucide-react'
import { useWeeklyPlan, DAYS_ORDERED, getTodayKey } from '../hooks/useWeeklyPlan'
import { CATEGORIES, CATEGORY_COLOR } from '../data/exercises'

/** Short display labels for each day key */
const DAY_SHORT = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed',
  thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
}
const DAY_FULL = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
}

/**
 * Weekly split planner.
 * Each day card shows the label + exercise pills.
 * Tapping "Edit" opens a bottom sheet to pick exercises and set a label.
 *
 * Props:
 *   exercises — full exercise list from useExercises
 */
export function WeeklyPlan({ exercises }) {
  const { plan, updateDay } = useWeeklyPlan()
  const [editingDay, setEditingDay] = useState(null)
  const todayKey = getTodayKey()

  // Quick lookup
  const exMap = Object.fromEntries(exercises.map(e => [e.id, e]))

  return (
    <div className="min-h-screen bg-gym-bg pb-28 px-4 pt-10">
      <h1 className="font-display font-bold text-3xl text-gym-text mb-2">Weekly Plan</h1>
      <p className="text-white/25 text-sm font-body mb-6">
        Assign exercises to each day of the week
      </p>

      <div className="space-y-3">
        {DAYS_ORDERED.map(day => {
          const dayPlan      = plan[day]
          const isToday      = day === todayKey
          const dayExercises = (dayPlan?.exerciseIds ?? [])
            .map(id => exMap[id])
            .filter(Boolean)

          return (
            <div
              key={day}
              className={`rounded-2xl border overflow-hidden transition-colors ${
                isToday
                  ? 'border-brand/35 bg-brand/[0.06]'
                  : 'border-white/[0.08] bg-white/[0.04]'
              }`}
            >
              {/* Day header row */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className={`font-display font-bold text-sm w-8 flex-shrink-0 ${
                    isToday ? 'text-brand' : 'text-white/30'
                  }`}>
                    {DAY_SHORT[day]}
                  </span>

                  <span className={`font-body text-sm ${
                    dayPlan?.label ? 'text-gym-text font-semibold' : 'text-white/25 italic'
                  }`}>
                    {dayPlan?.label || 'Rest day'}
                  </span>

                  {isToday && (
                    <span className="text-[10px] font-display font-bold bg-brand/20 text-brand px-2 py-0.5 rounded-full">
                      Today
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setEditingDay(day)}
                  className="text-xs font-body text-white/30 px-2.5 py-1 bg-white/[0.06]
                             rounded-lg border border-white/[0.08] active:bg-white/10"
                >
                  Edit
                </button>
              </div>

              {/* Exercise pills */}
              {dayExercises.length > 0 && (
                <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                  {dayExercises.map(ex => (
                    <span
                      key={ex.id}
                      className={`text-[10px] px-2.5 py-1 rounded-full border font-display font-semibold ${
                        CATEGORY_COLOR[ex.category] ?? 'bg-white/[0.08] text-white/40 border-white/[0.08]'
                      }`}
                    >
                      {ex.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Edit day modal */}
      {editingDay && (
        <EditDayModal
          day={editingDay}
          exercises={exercises}
          currentPlan={plan[editingDay]}
          onSave={(ids, label) => {
            updateDay(editingDay, ids, label)
            setEditingDay(null)
          }}
          onClose={() => setEditingDay(null)}
        />
      )}
    </div>
  )
}

// ─── EditDayModal ─────────────────────────────────────────────────────────────

function EditDayModal({ day, exercises, currentPlan, onSave, onClose }) {
  const [selected, setSelected] = useState(currentPlan?.exerciseIds ?? [])
  const [label,    setLabel]    = useState(currentPlan?.label ?? '')
  const [search,   setSearch]   = useState('')

  const filtered = exercises.filter(ex =>
    ex.name.toLowerCase().includes(search.toLowerCase())
  )

  // Group filtered exercises by category for organised display
  const grouped = CATEGORIES.map(cat => ({
    ...cat,
    items: filtered.filter(ex => ex.category === cat.id),
  })).filter(g => g.items.length > 0)

  function toggle(id) {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-gym-elevated rounded-t-3xl flex flex-col max-h-[88vh]">
        {/* Handle + header */}
        <div className="px-5 pt-4 pb-3 border-b border-white/[0.08] flex-shrink-0">
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />

          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-2xl text-gym-text">
              {DAY_FULL[day]}
            </h3>
            <button onClick={onClose} className="p-2 bg-white/[0.08] rounded-full text-white/50">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Workout label */}
          <input
            type="text"
            placeholder='e.g. "Chest & Biceps" or "Push Day"'
            value={label}
            onChange={e => setLabel(e.target.value)}
            className="w-full bg-white/[0.06] border border-white/[0.09] rounded-xl px-4 py-2.5 mb-3
                       text-gym-text placeholder-white/20 font-body text-sm
                       focus:outline-none focus:border-brand/40"
          />

          {/* Search */}
          <input
            type="text"
            placeholder="Filter exercises…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/[0.06] border border-white/[0.09] rounded-xl px-4 py-2.5
                       text-gym-text placeholder-white/20 font-body text-sm
                       focus:outline-none focus:border-brand/40"
          />
        </div>

        {/* Exercise list grouped by category */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {grouped.map(group => (
            <div key={group.id}>
              <p className="text-[10px] font-display font-bold uppercase tracking-widest text-white/25 mb-2">
                {group.label}
              </p>
              <div className="space-y-1.5">
                {group.items.map(ex => {
                  const isSelected = selected.includes(ex.id)
                  return (
                    <button
                      key={ex.id}
                      onClick={() => toggle(ex.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl
                                  transition-colors border ${
                        isSelected
                          ? 'bg-brand/15 border-brand/30 text-brand-light'
                          : 'bg-white/[0.04] border-white/[0.07] text-gym-text'
                      }`}
                    >
                      <span className="font-display font-semibold text-sm">{ex.name}</span>
                      {isSelected && <Check className="w-4 h-4 flex-shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Save bar */}
        <div className="px-4 pb-safe pt-3 border-t border-white/[0.08] flex-shrink-0">
          <button
            onClick={() => onSave(selected, label)}
            className="w-full py-4 bg-brand text-white font-display font-bold text-xl rounded-2xl"
          >
            Save — {selected.length} exercise{selected.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  )
}
