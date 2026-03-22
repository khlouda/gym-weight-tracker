import { useEffect, useState, useCallback } from 'react'
import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { db, USER_ID } from '../firebase'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const logsRef    = () => collection(db, 'users', USER_ID, 'logs')
const exerciseRef = (id) => doc(db, 'users', USER_ID, 'exercises', id)

/** Returns today's date string in YYYY-MM-DD format */
function todayKey() {
  return new Date().toISOString().split('T')[0]
}

// ─── Hook: real-time logs for today ───────────────────────────────────────────

/**
 * Returns a live-updating list of all logs saved today.
 * Sorted by timestamp descending (newest first) — done client-side
 * to avoid requiring a Firestore composite index.
 *
 * Firestore path: users/{userId}/logs/{logId}
 * Document shape:
 *   { exerciseId, exerciseName, weight, reps, sets, date, timestamp }
 */
export function useTodayLogs() {
  const [logs, setLogs] = useState([])
  const today = todayKey()

  useEffect(() => {
    const q = query(logsRef(), where('date', '==', today))

    const unsub = onSnapshot(q, (snap) => {
      const raw = snap.docs.map(d => ({ id: d.id, ...d.data() }))

      // Sort newest-first using the Firestore Timestamp's milliseconds value.
      // Timestamp can briefly be null (optimistic write) — handle gracefully.
      raw.sort((a, b) => {
        const aMs = a.timestamp?.toMillis?.() ?? 0
        const bMs = b.timestamp?.toMillis?.() ?? 0
        return bMs - aMs
      })

      setLogs(raw)
    })

    return unsub
  }, [today])

  return logs
}

// ─── Hook: save a log entry + auto-update PR ──────────────────────────────────

/**
 * Returns { saveLog, saving }.
 * saveLog({ exerciseId, exerciseName, weight, reps, sets }) →
 *   saves a log document and updates the exercise's PR if this weight beats it.
 *   Resolves with { isNewPR: boolean }.
 */
export function useSaveLog() {
  const [saving, setSaving] = useState(false)

  const saveLog = useCallback(async ({ exerciseId, exerciseName, weight, reps, sets }) => {
    setSaving(true)
    try {
      const w = Number(weight)
      const r = Number(reps)
      const s = Number(sets)

      // 1. Write the log document
      await addDoc(logsRef(), {
        exerciseId,
        exerciseName,
        weight: w,
        reps:   r,
        sets:   s,
        date:   todayKey(),
        timestamp: serverTimestamp(),
      })

      // 2. Check if this weight is a new PR for this exercise
      const exSnap     = await getDoc(exerciseRef(exerciseId))
      const currentPR  = exSnap.data()?.pr

      if (!currentPR || w > currentPR.weight) {
        await updateDoc(exerciseRef(exerciseId), {
          pr: { weight: w, reps: r, date: todayKey() },
        })
        return { isNewPR: true }
      }

      return { isNewPR: false }
    } finally {
      setSaving(false)
    }
  }, [])

  return { saveLog, saving }
}

// ─── Async function: get all logs for one exercise (for chart + history) ──────

/**
 * Fetches every log for a given exerciseId, sorted by date ascending.
 * Used in ExerciseDetail to build the progress chart.
 * Returns an array of log objects.
 */
export async function getExerciseLogs(exerciseId) {
  // Single-field where clause only — no composite index needed.
  // Sorted client-side since adding orderBy('timestamp') alongside
  // where('exerciseId') would require a manual Firestore composite index.
  const q    = query(logsRef(), where('exerciseId', '==', exerciseId))
  const snap = await getDocs(q)
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))

  // YYYY-MM-DD strings sort correctly lexicographically
  docs.sort((a, b) => a.date.localeCompare(b.date))
  return docs
}
