import React from 'react'
import { Home, Dumbbell, CalendarDays } from 'lucide-react'

const TABS = [
  { id: 'home', label: 'Today',     Icon: Home },
  { id: 'log',  label: 'Exercises', Icon: Dumbbell },
  { id: 'plan', label: 'Plan',      Icon: CalendarDays },
]

/**
 * Fixed bottom navigation bar.
 * Props:
 *   view     — active tab id
 *   onChange — (tabId) => void
 */
export function BottomNav({ view, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gym-elevated border-t border-white/10">
      <div className="flex pb-safe">
        {TABS.map(({ id, label, Icon }) => {
          const active = view === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex-1 flex flex-col items-center gap-1 pt-3 pb-2 transition-colors ${
                active ? 'text-brand' : 'text-white/30'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] font-body font-semibold tracking-wide">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
