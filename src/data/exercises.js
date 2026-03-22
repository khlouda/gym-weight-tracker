// Default exercises seeded into Firestore on first launch.
// Pulled from the user's required list + Kodus Training exercise libraries.

export const DEFAULT_EXERCISES = [
  // ── Chest ──────────────────────────────────────────────
  { name: 'Bench Press',             category: 'chest' },
  { name: 'Incline Bench Press',     category: 'chest' },
  { name: 'Incline Dumbbell Press',  category: 'chest' },
  { name: 'Dumbbell Chest Press',    category: 'chest' },
  { name: 'Incline Chest Fly',       category: 'chest' },
  { name: 'Butterfly Machine Fly',   category: 'chest' },
  { name: 'Cable Cross Low to High', category: 'chest' },
  { name: 'Dumbbell Chest Pullover', category: 'chest' },
  { name: 'Push Ups',                category: 'chest' },
  { name: 'Dips',                    category: 'chest' },

  // ── Back ───────────────────────────────────────────────
  { name: 'Barbell Row',                      category: 'back' },
  { name: 'Pull-Ups',                         category: 'back' },
  { name: 'Lat Pulldown',                     category: 'back' },
  { name: 'Seated Cable Row',                 category: 'back' },
  { name: 'Single Arm Dumbbell Row',          category: 'back' },
  { name: 'Chest Supported Dumbbell Row',     category: 'back' },
  { name: 'High Row Cable',                   category: 'back' },
  { name: 'Straight Arm Cable Pulldown',      category: 'back' },
  { name: 'Back Extension',                   category: 'back' },

  // ── Legs ───────────────────────────────────────────────
  { name: 'Squat',                    category: 'legs' },
  { name: 'Deadlift',                 category: 'legs' },
  { name: 'Romanian Deadlift',        category: 'legs' },
  { name: 'Leg Press',                category: 'legs' },
  { name: 'Hack Squat',               category: 'legs' },
  { name: 'Bulgarian Split Squat',    category: 'legs' },
  { name: 'Heels Elevated Goblet Squat', category: 'legs' },
  { name: 'Walking Lunges',           category: 'legs' },
  { name: 'Prone Leg Curl',           category: 'legs' },
  { name: 'Leg Extension',            category: 'legs' },
  { name: 'Hip Thrust',               category: 'legs' },
  { name: 'Standing Calf Raise',      category: 'legs' },
  { name: 'Seated Calf Raise',        category: 'legs' },

  // ── Shoulders ──────────────────────────────────────────
  { name: 'Overhead Press',              category: 'shoulders' },
  { name: 'Dumbbell Shoulder Press',     category: 'shoulders' },
  { name: 'Arnold Press',                category: 'shoulders' },
  { name: 'Lateral Raises',             category: 'shoulders' },
  { name: 'Cable Lateral Raises',       category: 'shoulders' },
  { name: 'Barbell Front Raise',        category: 'shoulders' },
  { name: 'Dumbbell Rear Delt Fly',     category: 'shoulders' },
  { name: 'Face Pulls',                  category: 'shoulders' },
  { name: 'Barbell Upright Row',         category: 'shoulders' },
  { name: 'Dumbbell Shrugs',            category: 'shoulders' },

  // ── Arms ───────────────────────────────────────────────
  { name: 'Bicep Curls',                  category: 'arms' },
  { name: 'Barbell Curl',                 category: 'arms' },
  { name: 'Hammer Curls',                 category: 'arms' },
  { name: 'Incline Dumbbell Curl',        category: 'arms' },
  { name: 'Tricep Pushdown',              category: 'arms' },
  { name: 'Overhead Tricep Extension',    category: 'arms' },
  { name: 'Skull Crushers',               category: 'arms' },
  { name: 'Close Grip Bench Press',       category: 'arms' },

  // ── Core ───────────────────────────────────────────────
  { name: 'Plank',      category: 'core' },
  { name: 'Ab Wheel',   category: 'core' },
]

// Category metadata: display label + Tailwind color classes
export const CATEGORIES = [
  { id: 'chest',     label: 'Chest',     color: 'bg-red-500/20 text-red-300 border-red-500/20' },
  { id: 'back',      label: 'Back',      color: 'bg-blue-500/20 text-blue-300 border-blue-500/20' },
  { id: 'legs',      label: 'Legs',      color: 'bg-green-500/20 text-green-300 border-green-500/20' },
  { id: 'shoulders', label: 'Shoulders', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/20' },
  { id: 'arms',      label: 'Arms',      color: 'bg-orange-500/20 text-orange-300 border-orange-500/20' },
  { id: 'core',      label: 'Core',      color: 'bg-purple-500/20 text-purple-300 border-purple-500/20' },
]

// Quick lookup: category id → color string
export const CATEGORY_COLOR = Object.fromEntries(CATEGORIES.map(c => [c.id, c.color]))
