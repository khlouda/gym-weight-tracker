import { useEffect, useRef, useState } from 'react'
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  writeBatch,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { db, USER_ID } from '../firebase'
import { DEFAULT_EXERCISES } from '../data/exercises'

/**
 * Manages the exercises collection in Firestore.
 * - Automatically seeds DEFAULT_EXERCISES on first launch (empty collection).
 * - Provides a real-time list of all exercises.
 * - Exposes addExercise() for custom exercises.
 *
 * Firestore path: users/{userId}/exercises/{exerciseId}
 * Document shape:
 *   { name, category, isCustom, pr: { weight, reps, date } | null, createdAt }
 */
export function useExercises() {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading]     = useState(true)
  const seedingRef = useRef(false) // prevent double-seed in StrictMode

  useEffect(() => {
    const ref = collection(db, 'users', USER_ID, 'exercises')
    const q   = query(ref, orderBy('name', 'asc'))

    const unsub = onSnapshot(q, (snap) => {
      if (snap.empty && !seedingRef.current) {
        // First launch: seed the default exercise list
        seedingRef.current = true
        seedDefaults(ref).catch(console.error)
        // Loading stays true until the snapshot fires again after seeding
      } else if (!snap.empty) {
        setExercises(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        setLoading(false)
      }
    })

    return unsub
  }, [])

  /** Batch-write all default exercises in one Firestore operation */
  async function seedDefaults(ref) {
    const batch = writeBatch(db)
    DEFAULT_EXERCISES.forEach(ex => {
      const docRef = doc(ref)
      batch.set(docRef, {
        ...ex,
        pr: null,
        isCustom: false,
        createdAt: serverTimestamp(),
      })
    })
    await batch.commit()
  }

  /** Add a user-created custom exercise */
  async function addExercise(name, category) {
    const ref = collection(db, 'users', USER_ID, 'exercises')
    await addDoc(ref, {
      name: name.trim(),
      category,
      pr: null,
      isCustom: true,
      createdAt: serverTimestamp(),
    })
  }

  return { exercises, loading, addExercise }
}
