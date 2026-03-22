import React, { useState } from 'react'
import { Search, Plus, Trophy, X, Check } from 'lucide-react'
import { CATEGORIES, CATEGORY_COLOR } from '../data/exercises'

/**
 * Exercise browser — search, filter by category, log or view any exercise.
 * Also handles adding a custom exercise via a bottom-sheet modal.
 *
 * Props:
 *   exercises       — full list from useExercises
 *   addExercise     — (name, category) => Promise<void>
 *   onLogExercise   — (exercise) => void
 *   onSelectExercise— (exercise) => void
 */
export function LogWorkout({ exercises, addExercise, onLogExercise, onSelectExercise }) {
  const [search,        setSearch]        = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [showAddModal,  setShowAddModal]   = useState(false)

  const filtered = exercises.filter(ex => {
    const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase())
    const matchCat    = !activeCategory || ex.category === activeCategory
    return matchSearch && matchCat
  })

  return (
    <div className="min-h-screen bg-gym-bg pb-28">
      {/* ── Sticky header + search + filters ─────────────────── */}
      <div className="sticky top-0 z-10 bg-gym-bg/95 backdrop-blur-sm border-b border-white/[0.06] px-4 pt-10 pb-3">
        <h1 className="font-display font-bold text-3xl text-gym-text mb-4">Exercises</h1>

        {/* Search bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
          <input
            type="text"
            placeholder="Search exercises…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/[0.06] border border-white/[0.09] rounded-xl pl-10 pr-10 py-3
                       text-gym-text placeholder-white/20 text-sm font-body
                       focus:outline-none focus:border-brand/40"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          <FilterChip
            label="All"
            active={!activeCategory}
            onClick={() => setActiveCategory(null)}
          />
          {CATEGORIES.map(cat => (
            <FilterChip
              key={cat.id}
              label={cat.label}
              active={activeCategory === cat.id}
              onClick={() => setActiveCategory(p => p === cat.id ? null : cat.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Exercise list ──────────────────────────────────────── */}
      <div className="px-4 pt-3 space-y-2">
        {filtered.length === 0 && (
          <p className="text-white/20 text-sm text-center py-12 font-body">No exercises found</p>
        )}

        {filtered.map(ex => (
          <div
            key={ex.id}
            className="flex items-center gap-3 bg-white/[0.05] border border-white/[0.08] rounded-2xl px-4 py-3.5"
          >
            {/* Name → detail */}
            <button className="flex-1 text-left min-w-0" onClick={() => onSelectExercise(ex)}>
              <p className="font-display font-bold text-gym-text text-lg leading-tight truncate">
                {ex.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                  CATEGORY_COLOR[ex.category] ?? 'bg-white/10 text-white/40 border-white/10'
                }`}>
                  {ex.category}
                </span>
                {ex.pr && (
                  <span className="flex items-center gap-1 text-xs text-white/35">
                    <Trophy className="w-3 h-3 text-yellow-400/70" />
                    {ex.pr.weight} kg
                  </span>
                )}
                {ex.isCustom && (
                  <span className="text-[10px] text-white/25 font-body">custom</span>
                )}
              </div>
            </button>

            {/* Log button */}
            <button
              onClick={() => onLogExercise(ex)}
              className="flex-shrink-0 w-10 h-10 bg-brand rounded-xl flex items-center justify-center
                         active:scale-90 transition-transform"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>
        ))}

        {/* Add custom exercise */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full py-4 mt-2 border border-dashed border-white/15 rounded-2xl
                     flex items-center justify-center gap-2 text-white/25 text-sm font-body
                     active:border-white/25 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add custom exercise
        </button>
      </div>

      {/* ── Add exercise modal ─────────────────────────────────── */}
      {showAddModal && (
        <AddExerciseModal
          addExercise={addExercise}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}

// ─── AddExerciseModal ─────────────────────────────────────────────────────────

function AddExerciseModal({ addExercise, onClose }) {
  const [name,     setName]     = useState('')
  const [category, setCategory] = useState('chest')
  const [saving,   setSaving]   = useState(false)

  async function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    await addExercise(name.trim(), category)
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-gym-elevated rounded-t-3xl px-5 pt-4 pb-6 pb-safe animate-slide-up">
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />

        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-xl text-gym-text">New Exercise</h3>
          <button onClick={onClose} className="p-2 bg-white/10 rounded-full text-white/50">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Name input */}
        <input
          type="text"
          placeholder="Exercise name"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
          className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-3 mb-4
                     text-gym-text placeholder-white/25 font-body text-sm
                     focus:outline-none focus:border-brand/50"
        />

        {/* Category picker */}
        <p className="text-white/30 text-xs font-body font-semibold uppercase tracking-wider mb-2">
          Category
        </p>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`py-2.5 rounded-xl text-sm font-display font-bold transition-colors ${
                category === cat.id
                  ? 'bg-brand text-white'
                  : 'bg-white/[0.06] border border-white/[0.09] text-white/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !name.trim()}
          className="w-full py-4 bg-brand text-white font-display font-bold text-xl rounded-2xl
                     disabled:opacity-40"
        >
          {saving ? 'Adding…' : 'Add Exercise'}
        </button>
      </div>
    </div>
  )
}

// ─── FilterChip ───────────────────────────────────────────────────────────────

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-display font-bold transition-colors ${
        active
          ? 'bg-brand text-white'
          : 'bg-white/[0.06] text-white/40 border border-white/[0.08]'
      }`}
    >
      {label}
    </button>
  )
}
