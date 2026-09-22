# TEAMCONTRIBUTION.md — 48-Hour Sprint Guide

Welcome to the **Mohakash Jr** sprint! This document provides all team members (**Shahi, Mahi, Humaira, Mahim, Jim**) and their AI coding agents with the exact step-by-step workflow to clone, work in parallel, test, and submit feature branches cleanly without conflicts or blocked dependencies.

---

## 1. Quick Start & Git Workflow (For Every Teammate & Agent)

### Step 1: Clone and Checkout `dev`
Always base your work on the `dev` branch. Never branch off or push to `main`.
```bash
# 1. Clone repository
git clone https://github.com/sheikhhossainn/mohakashjr.git
cd mohakashjr

# 2. Checkout dev branch
git checkout dev
git pull origin dev
```

### Step 2: Create Your Dedicated Feature Branch
Branch names must follow the convention `feature/<name>-<task>`:
- Shahi: `git checkout -b feature/shahi-app-shell`
- Mahi: `git checkout -b feature/mahi-sqlite-db`
- Humaira: `git checkout -b feature/humaira-content-pipeline`
- Mahim: `git checkout -b feature/mahim-mission-flow`
- Jim: `git checkout -b feature/jim-assets-tutor-ui`

### Step 3: Environment Setup
- Never touch, commit, or push `.env`.
- Copy `.env.example` to `.env` if local secrets are needed.
- Ensure your AI coding agent (Claude Code, Antigravity, Cursor, Codex, etc.) reads [`AGENT.md`](file:///d:/Coding/mohakashjr/AGENT.md) and [`CONTEXT.md`](file:///d:/Coding/mohakashjr/CONTEXT.md) before starting.

### Step 4: The 48-Hour Decoupling Rule
> **IMPORTANT**: On **Day 1**, every member works with **mock data / stubs**.
> Do not pause your work waiting for another teammate's database, backend, or design assets. Write screens and components against mock JSON objects, then swap in the real implementation on **Day 2**.

### Step 5: Pre-Push Bookkeeping Checklist (MANDATORY)
Before pushing any commits:
1. **Update `implemented_features.md`**: Add a new row detailing what you built.
2. **Log in `AGENT.md` (and `AGENTS.md`)**: In the `## Agent Activity Log` table at the bottom of the file, record:
   - Date (`YYYY-MM-DD`)
   - Contributor name / Agent name
   - Task worked on
   - Files touched and completion status
3. **Verify Git Identity & Confirmation Prompt**:
   - Check `git config user.name` and `git config user.email`.
   - Ensure the user confirms: *"Is this your GitHub account? Username: `<user>`, Email: `<email>`. Should I proceed to push?"*

### Step 6: Push & Open Pull Request to `dev`
```bash
# Push your feature branch
git push -u origin feature/<name>-<task>
```
- Open a Pull Request on GitHub targeting **`dev`** as the base branch (NEVER `main`).
- Request review from teammates before merging.

---

## 2. Team Task Allocation & Dependency Matrix

### @Shahi — App Shell, Navigation & Quiz Engine
* **Day 1 Goal**:
  - Scaffold `expo-router` with basic routes: `/lessons`, `/quiz`, `/mission`, `/profile`.
  - Build Lesson Reader & Quiz UI using hardcoded mock JSON (do not wait for the DB).
* **Day 2 Goal**:
  - Connect the Quiz UI to Mahi's `src/db/` query functions.
  - Implement XP gain and Level Up state (*Cadet → Astronaut*).
* **Who depends on Shahi?**:
  - **Mahim**: Needs Shahi’s quiz routes to attach victory/defeat mascot animations.
  - **Jim**: Needs Shahi’s screens to test fonts and layouts.
* **Who does Shahi depend on?**:
  - **Mahi** *(Soft blocker on Day 1, Hard blocker at Hour 28)*: Needs `src/db/` functions (`getLessons()`, `saveQuizAttempt()`).
  - **Humaira** *(Soft blocker on Day 1, Hard blocker at Hour 24)*: Needs real Bangla lesson/quiz JSON to replace mock data.

---

### @Mahi — Local SQLite, Data Layer & Serverless AI Proxy
* **Day 1 Goal**:
  - Run `expo prebuild` with `@op-engineering/op-sqlite` (libSQL build).
  - Create SQLite table migrations (`profiles`, `lessons`, `quiz_questions`, `quiz_attempts`, `missions`, `ai_tutor_cache`).
  - Provide a clean TypeScript interface in `src/db/` (`getLessons()`, `getQuestions()`, `saveAttempt()`).
* **Day 2 Goal**:
  - Write seed script loading Humaira's `seed.json` into local SQLite on first launch.
  - Deploy a Cloudflare Worker proxy (`POST /api/tutor`) that forwards queries to the LLM (Claude/Gemini) with secret API keys.
* **Who depends on Mahi?**:
  - **Shahi**: Needs `src/db/` functions to connect the live database.
  - **Jim**: Needs the Cloudflare Worker URL to connect live AI chat.
* **Who does Mahi depend on?**:
  - **Humaira** *(Hard blocker at Hour 24)*: Needs the finalized `seed.json` to populate the starter database.

---

### @Humaira — NASA Curriculum, Bangla Content & Offline Q&A
* **Day 1 Goal**:
  - Define the data schema with Mahi/Shahi in the first 2 hours.
  - Write 4 Cadet + 4 Astronaut lessons in simple, engaging Bangla referencing NASA facts (`science.nasa.gov`).
  - Write a placement quiz (5 questions) and per-lesson quizzes (3 questions each).
* **Day 2 Goal**:
  - Package all lessons and quizzes into `seed.json` by Hour 24.
  - Write 25–30 common space questions and answers in Bangla for the offline AI fallback (`offline_tutor.json`).
  - Write the AI Tutor system prompt for online mode (astronaut mentor persona).
* **Who depends on Humaira?**:
  - **Mahi**: Needs `seed.json` to build the database seeder.
  - **Shahi**: Needs actual lesson/quiz questions to render the curriculum.
  - **Jim**: Needs `offline_tutor.json` for the offline chat fallback.
* **Who does Humaira depend on?**:
  - **Mahi & Shahi** *(Hour 0–2 only)*: Must agree on the JSON structure so content can be written without rework.

---

### @siNN Mahim — Moon Landing Mission & Mascot Animations
* **Day 1 Goal**:
  - Setup `react-native-reanimated` and `lottie-react-native`.
  - Build reusable feedback components (animated correct/wrong mascot popup, XP bar filling animation).
  - Build **Screen 1 of the Mission**: Interactive Moon Landing site selection (selecting 1 of 3 lunar regions with risk/reward stats).
* **Day 2 Goal**:
  - Build **Screen 2 of the Mission**: Cargo Packing mini-game (weight/oxygen balance checklist or touch interaction).
  - Build **Mission Debrief Screen**: Calculates score, displays debrief feedback, and awards XP.
* **Who depends on Mahim?**:
  - **Shahi**: Needs the Mission component exported to wire into the main navigation.
* **Who does Mahim depend on?**:
  - **Jim**: Needs Lottie mascot assets and lunar graphics by Hour 12.
  - **Shahi**: Needs profile XP store function to credit mission rewards.

---

### @Jim — Design Assets, AI Tutor Chat Screen & Device Testing
* **Day 1 Goal**:
  - Install and configure Bengali typography (*Noto Sans Bengali* or *Hind Siliguri*) across Expo.
  - Supply graphics into `assets/` (mascot Lottie animations, lunar background, vector badges).
  - Build the AI Tutor Chat Screen UI (`app/tutor.tsx`) with mock chat messages, send button, and input box.
* **Day 2 Goal**:
  - Connect Chat UI to Mahi's Cloudflare endpoint (online) and Humaira's keyword matcher (offline).
  - Generate an Android build and test on a physical Android device:
    - Test full airplane mode.
    - Check Bangla font rendering (no clipping/broken conjuncts).
    - Compile a bug list for the team testing session.
* **Who depends on Jim?**:
  - **Mahim & Shahi**: Need font setup and visual assets early on Day 1.
  - **Entire Team**: Needs Jim’s bug list at Hour 44 to fix critical flaws before review.
* **Who does Jim depend on?**:
  - **Mahi & Humaira** *(Hour 30)*: Needs the AI proxy URL and offline Q&A JSON to make chat work.

---

## 3. Step-by-Step "How-To" Instructions per Role

### Guide for Shahi (App Navigation & Quiz)
1. **Initialize Screens**: Inside `app/`, create:
   - `app/(tabs)/index.tsx` (Dashboard / Level Overview)
   - `app/(tabs)/lessons.tsx` (Lesson list & reader)
   - `app/quiz/[id].tsx` (Quiz question flow)
   - `app/mission/index.tsx` (Mission hub)
2. **Mock State**: Use a Zustand store in `src/state/useAppStore.ts` with local mock data:
   ```typescript
   export const useAppStore = create((set) => ({
     xp: 0,
     rank: 'Cadet',
     addXP: (amount) => set((s) => ({ xp: s.xp + amount })),
   }));
   ```
3. **Integration**: At Hour 28, import `{ getLessons, saveQuizAttempt }` from `src/db/` to replace mock arrays.

### Guide for Mahi (Database & Cloudflare Proxy)
1. **SQLite Native Setup**:
   - Install `@op-engineering/op-sqlite` and configure libSQL replica options.
   - Run `npx expo prebuild --platform android` to generate the native Android project.
2. **Database Module (`src/db/`)**:
   - Create tables using the schema defined in [`docs/ARCHITECTURE.md`](file:///d:/Coding/mohakashjr/docs/ARCHITECTURE.md) §4.
   - Export strongly typed query functions:
     `export async function getLessons(): Promise<Lesson[]> { ... }`
3. **Seed Function**:
   - Read Humaira's `seed.json` on app startup; if `profiles` or `lessons` is empty, perform batch insertion.
4. **Cloudflare Worker**:
   - In `server/`, create a simple worker with a `fetch` handler listening for `POST /api/tutor` that passes user text to Claude/Gemini API using server secrets.

### Guide for Humaira (Bangla Content & AI Knowledge)
1. **Schema Agreement (Hour 0–2)**:
   Ensure JSON output matches:
   ```json
   {
     "lessons": [
       {
         "id": "lesson-1",
         "level": "Cadet",
         "order_index": 1,
         "title_bn": "চাঁদের বুকে প্রথম পদক্ষেপ",
         "summary_bn": "...",
         "content_bn": "...",
         "nasa_source": "https://science.nasa.gov/..."
       }
     ],
     "quizzes": [
       {
         "lesson_id": "lesson-1",
         "prompt_bn": "চাঁদে বায়ু না থাকার কারণে কোনটি ঘটে না?",
         "options_bn": ["বাতাস বয় না", "শব্দ শোনা যায় না", "বৃষ্টি হয় না", "সবগুলো সঠিক"],
         "correct_index": 3
       }
     ]
   }
   ```
2. **Write Offline Fallback (`offline_tutor.json`)**:
   Create keyword pairs:
   ```json
   [
     {
       "keywords": ["চাঁদ", "পানি", "বরফ"],
       "answer_bn": "চাঁদের দক্ষিণ মেরুতে স্থায়ী ছায়াযুক্ত গর্তে বরফ আকারে পানি পাওয়া গেছে..."
     }
   ]
   ```

### Guide for Mahim (Mascot Motion & Moon Mission)
1. **Lottie Mascot Reactions**:
   - Create `<MascotReaction state="correct" | "incorrect" | "celebrate" />` using Jim’s Lottie files.
2. **Interactive Site Selection**:
   - Display a lunar surface map with 3 selectable zones (e.g., *Shackleton Crater*, *Mare Tranquillitatis*, *Oceanus Procellarum*).
   - Give each zone stats: Sunlight (Power), Ice (Water), Terrain Risk.
3. **Cargo Packing Game**:
   - Provide items (Solar Panels, Oxygen Tanks, Rover Battery, Drill).
   - Set max weight (e.g., 500kg). Let the user toggle/drag items into the cargo bay.
   - Calculate score based on survival balance.

### Guide for Jim (Typography, Design, Chat UI & QA)
1. **Fonts & Assets**:
   - Add `.ttf` files for *Noto Sans Bengali* to `assets/fonts/`.
   - Load them in `app/_layout.tsx` using `expo-font` (`useFonts`).
2. **AI Tutor Chat UI**:
   - Build a clean chat interface in `app/tutor.tsx` with a FlatList for messages and a sticky bottom TextInput.
   - Add an offline badge indicator:
     `{isOnline ? "অনলাইন টিউটর" : "অফলাইন মোড (ক্যাশড)"}`
3. **Testing Pass (Hour 44)**:
   - Build dev client: `eas build --profile development --platform android` or `npx expo run:android`.
   - Turn on Airplane Mode. Walk through Cadet Lesson 1 ➔ Quiz ➔ Mission ➔ Offline Tutor.
   - Document any bugs or layout clippings.

---

## 4. Key Milestones Timeline

| Sprint Time | Deliverable / Handoff | Responsible |
|---|---|---|
| **Hour 0–2** | Finalize JSON Schema structure | Entire Team |
| **Hour 12** | Bengali fonts & Lottie mascot delivered | Jim ➔ Shahi & Mahim |
| **Hour 24** | `seed.json` delivered | Humaira ➔ Mahi & Shahi |
| **Hour 28** | `src/db/` typed query client ready | Mahi ➔ Shahi |
| **Hour 36** | Cloudflare AI proxy URL & offline Q&A ready | Mahi & Humaira ➔ Jim |
| **Hour 44** | Android build ready on test phones | Mahi & Jim ➔ Entire Team |
| **Hour 48** | **TEAM TESTING SESSION & REVIEW** | Entire Team |
