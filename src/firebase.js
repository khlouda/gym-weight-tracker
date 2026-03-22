import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// ============================================================
// 🔥 FIREBASE CONFIG — Paste your config object here
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyBfwNldlCUCsQa7F3mt-MoNq9qMEiAlbtg",
  authDomain: "workout-tracker-47b2d.firebaseapp.com",
  projectId: "workout-tracker-47b2d",
  storageBucket: "workout-tracker-47b2d.firebasestorage.app",
  messagingSenderId: "346319871188",
  appId: "1:346319871188:web:4f8915abd6ee1fbc3fef41"
}
// ============================================================

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// Hardcoded single user — no auth needed
export const USER_ID = 'khaled'
