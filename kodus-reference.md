# Kodus Training — Reference Doc
> Read-only reference for the Tracking Weights project. Do NOT modify the Kodus project files.

---

## Firebase Config

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBfwNldlCUCsQa7F3mt-MoNq9qMEiAlbtg",
  authDomain: "workout-tracker-47b2d.firebaseapp.com",
  projectId: "workout-tracker-47b2d",
  storageBucket: "workout-tracker-47b2d.firebasestorage.app",
  messagingSenderId: "346319871188",
  appId: "1:346319871188:web:4f8915abd6ee1fbc3fef41"
};
```

- SDK: Firebase 9.23.0 Compat (`firebase-app-compat.js` + `firebase-firestore-compat.js`)

---

## Design Tokens

```css
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,500;0,600;0,700;0,800;1,600&family=Barlow:wght@300;400;500;600;700&display=swap');

:root {
  --brand:        #634DB3;
  --brand-light:  #7761d0;
  --brand-dim:    rgba(99,77,179,0.25);
  --surface:      rgba(255,255,255,0.045);
  --surface-hover:rgba(255,255,255,0.07);
  --border:       rgba(255,255,255,0.09);
  --border-strong:rgba(255,255,255,0.15);
  --text:         #e8e6f0;
  --text-dim:     rgba(255,255,255,0.45);
  --text-faint:   rgba(255,255,255,0.25);
  --bg:           #0f0e17;
  --bg-elevated:  #17162a;
  --font-display: 'Barlow Condensed', system-ui, sans-serif;
  --font-body:    'Barlow', system-ui, sans-serif;
}
```

---

## Firestore Data Structure

### Collection: `workouts`
Document ID = `YYYY-MM-DD`

```javascript
{
  type: 'shoulders' | 'back_triceps' | 'chest_biceps' | 'legs' | 'rest',
  date: 'YYYY-MM-DD',
  warmupNote: string,
  warmupItems: [{ name: string, setsReps: string }],
  sections: [
    {
      letter: 'A' | 'B' | ...,
      sectionType: 'single' | 'superset' | 'triset',
      rest: '60s' | '90s' | '2min' | '3min' | '—',
      coachNote: string,
      exercises: [
        { name: string, setsReps: string, youtubeUrl: string, coachNote: string }
      ]
    }
  ],
  finisherEnabled: boolean,
  finisherRounds: string,       // e.g. "4 rounds"
  finisherExercises: string,    // e.g. "12 cals ski / 10 burpees / 200m run"
  coachNote: string
}
```

### Collection: `weights`
Document ID = `YYYY-MM-DD`

```javascript
{
  "Barbell bent over row": "295",
  "Dumbbell skull crusher": "35",
  // exerciseName → weight string
}
```

### Collection: `settings` → Document: `preferences`

```javascript
{
  libraries: {
    shoulders:    string[],
    back_triceps: string[],
    chest_biceps: string[],
    legs:         string[],
    warmup:       string[],
    finisher:     string[]
  },
  prs: {
    [exerciseName]: { weight: number, date: 'YYYY-MM-DD' }
  },
  done: {
    [dateKey]: boolean
  },
  completions: {
    [dateKey]: { [sectionIndex]: boolean }
  }
}
```

### Collection: `settings` → Document: `videos`

```javascript
{
  [exerciseName]: string  // YouTube URL
}
```

---

## Weekly Schedule

```javascript
const WEEKLY_SCHEDULE = {
  0: 'rest',          // Sunday
  1: 'chest_biceps',  // Monday
  2: 'rest',          // Tuesday
  3: 'back_triceps',  // Wednesday
  4: 'shoulders',     // Thursday
  5: 'legs',          // Friday
  6: 'rest'           // Saturday
};
```

---

## Exercise Libraries

### Shoulders (18)
Dumbbell shoulder press neutral grip, Dumbbell shoulder press, Ez bar supinated shoulder press, Barbell front raises supinated, Front raises barbell wide grip, Front raises DBs alternating, Barbell upright row, Seated dumbbell lateral raises, Cable lateral raises, Dumbbell rear delt fly, Face pulls cable, Dumbbell shrugs, Arnold press, Behind the neck press, Scapula push ups, Shoulder taps, Band pull aparts, Plank walk outs

### Back & Triceps (16)
Pull ups, Barbell bent over row, Chest supported dumbbell row incline bench, Seated row cable, Single arm dumbbell row, High row cable, Straight arm cable pulldown, Lat pulldown, Back extension, Dumbbell skull crusher, Dumbbell skull crusher neutral grip, Tricep pushdown rope, Tricep pushdown cable, Overhead tricep extension cable, Diamond push ups, Close grip bench press

### Chest & Biceps (21)
Incline smith bench press, Incline dumbbell press, Dumbbell chest press flat, Decline chest press machine, Incline chest fly, Butterfly machine fly, Standing cable crossover, Cable cross high to low, Cable cross low to high, Dumbbell chest pullover, Push ups, Dips, Dumbbell bicep curls, Barbell curl, Hammer curls alternating, Rope hammer curls, Single arm incline dumbbell preacher curl, Incline dumbbell curl, Band pull aparts, Shoulder taps, Plank walk outs, World's greatest stretch

### Legs (17)
Hack squat, Back squat, Heels elevated goblet squat, Bulgarian split squat, Walking lunges, RDL single leg dumbbell, Romanian deadlift, Prone leg curl, Seated leg extension, Hip thrust machine, Leg press, Standing calf raise, Seated calf raise, Box jumps, Single leg swings forward/back, Single leg swings cross body, World's greatest stretch, Bird dog

### Warmup (11)
Row, Air Bike, Run, World's greatest stretch, Scapula push ups, Shoulder taps, Band pull aparts, Plank walk outs, Bird dog, Single leg swings forward/back, Single leg swings cross body

### Finisher (9)
Ski erg (cals), Burpees, Run 200m, Row (cals), Air Bike (cals), Box jumps, Dips, Pull ups, Push ups

---

## Default Workout Templates

### Shoulders
**Warmup** (3 sets — increase effort each set):
Row 1:00 / Air Bike 1:00 / Run 1:00 / Scapula push ups 3×10 / Shoulder taps 3×10 / Band pull aparts 3×10 / Plank walk outs 3×5

| Section | Type | Rest | Exercises |
|---------|------|------|-----------|
| A | Triset | 90s | DB shoulder press neutral grip 3×8, Ez bar supinated shoulder press 3×8, Barbell front raises supinated 3×8 |
| B | Triset | 2min | Barbell upright row 3×8/8/8, Front raises barbell wide grip 3×8, Front raises DBs alternating 3×8 |
| C | Superset | 60s | DB shoulder press 3×8/8/8 *(build up weight)*, Seated DB lateral raises 3×10 |
| D | Superset | 60s | DB rear delt fly 3×8, Face pulls cable 3×10 |
| E | Single | 60s | DB shrugs 4×8/8/8/6 *(hold 2s at top each rep)* |

**Finisher:** 4 rounds — 12 cals ski / 10 burpees / 200m run

---

### Back & Triceps
**Warmup** (3 sets — increase effort each set):
Row 1:00 / Air Bike 1:00 / Run 1:00 / World's greatest stretch 1×10 / Band pull aparts 1×10 / Scapula push ups 1×10 / Plank walk outs 1×5

| Section | Type | Rest | Exercises |
|---------|------|------|-----------|
| A | Single | 60s | Barbell bent over row 4×8/6/6/6 *(build up weight each set)* |
| B | Triset | 100s | Chest supported DB row incline bench 3×8/6/6, DB skull crusher 3×8, DB skull crusher neutral grip 3×8 |
| C | Superset | 60s | Seated row cable 3×8/6/6, Tricep pushdown rope 3×8 |
| D | Superset | 60s | High row cable 3×8/6/6, Straight arm cable pulldown 3×8 *(hold isometric 15s at bottom after all reps)* |
| E | Single | 60s | Single arm DB row 4×6 each side *(high quality reps — PR last week's weight)* |
| F | Single | 60s | Back extension 3×15 *(can hold weight)* |

**Finisher:** None

---

### Chest & Biceps
**Warmup** (3 sets — increase effort each set):
Row 1:00 / Air Bike 1:00 / Run 1:00 / Band pull aparts 1×10 / Shoulder taps 1×10 / Plank walk outs 1×5 / World's greatest stretch 1×10

| Section | Type | Rest | Exercises |
|---------|------|------|-----------|
| A | Triset | 2min | Incline DB press 4×10/10/8/8, Incline chest fly 4×10 *(lighter weight)*, Single arm incline DB preacher curl 4×10 each side |
| B | Triset | 90s | DB chest press flat 3×10/10/10, DB chest pullover 3×12/10/10 *(elbow close for chest)*, Hammer curls alternating 3×10 each arm |
| C | Triset | 90s | Cable cross low to high 3×10, Butterfly machine fly 3×10, Rope hammer curls 3×10 |

**Finisher:** 5 rounds — 150m run / 15 push ups / 10 cals row

---

### Legs
**Warmup** (3 sets — increase effort each set):
Row 1:00 / Air Bike 1:00 / Run 1:00 / Single leg swings forward/back 3×10 / Single leg swings cross body 3×10 / World's greatest stretch 3×10 / Bird dog 3×10

| Section | Type | Rest | Exercises |
|---------|------|------|-----------|
| A | Single | 2min | Hack squat 4×10/10/8/8 |
| B | Superset | 90s | Heels elevated goblet squat 3×8, RDL single leg DB 3×10 each leg |
| C | Superset | 90s | Prone leg curl 3×8, Bulgarian split squat 3×10 each leg |
| D | Single | 60s | Hip thrust machine 3×10/8/8 |
| E | Superset | 90s | Leg press 3×8, Seated leg extension 3×8 |
| F | Superset | 90s | Standing calf raise 3×10, Seated calf raise 3×10 |

**Finisher:** None
