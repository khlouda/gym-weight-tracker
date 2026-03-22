import { useEffect, useState } from 'react'
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore'
import { db, USER_ID } from '../firebase'

/**
 * Day keys in display order (Monday → Sunday).
 * Used for iterating the weekly plan UI.
 */
export const DAYS_ORDERED = [
  'monday', 'tuesday', 'wednesday', 'thursday',
  'friday', 'saturday', 'sunday',
]

/**
 * Map JS Date.getDay() (0=Sun … 6=Sat) to our day key strings.
 */
const JS_DAY_TO_KEY = [
  'sunday', 'monday', 'tuesday', 'wednesday',
  'thursday', 'friday', 'saturday',
]

export function getTodayKey() {
  return JS_DAY_TO_KEY[new Date().getDay()]
}

/**
 * Manages the weekly workout plan in Firestore.
 *
 * Firestore path: users/{userId}/weeklyPlan/{dayKey}
 * Document shape: { exerciseIds: string[], label: string }
 *
 * Returns:
 *   plan        — { monday: { exerciseIds, label }, tuesday: …, … }
 *   loading     — boolean
 *   updateDay   — (dayKey, exerciseIds, label) → Promise<void>
 *   todayKey    — string (e.g. 'thursday')
 */
export function useWeeklyPlan() {
  const [plan, setPlan]     = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ref  = collection(db, 'users', USER_ID, 'weeklyPlan')
    const unsub = onSnapshot(ref, (snap) => {
      const data = {}
      snap.docs.forEach(d => { data[d.id] = d.data() })
      setPlan(data)
      setLoading(false)
    })
    return unsub
  }, [])

  async function updateDay(dayKey, exerciseIds, label) {
    const ref = doc(db, 'users', USER_ID, 'weeklyPlan', dayKey)
    await setDoc(ref, { exerciseIds, label })
  }

  return { plan, loading, updateDay, todayKey: getTodayKey() }
}
