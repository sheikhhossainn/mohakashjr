# Feature Specifications — Mohakash Jr

Detailed specifications for core features. To be updated as features are scoped and implemented.

## 1. Bangla Lessons
- Levels: Cadet, Astronaut, Mission Specialist, Commander
- Illustrated story-style lessons with NASA imagery and space science concepts in Bangla.

## 2. Quiz Engine & Progression
- Placement quiz on initial app launch.
- Lesson quizzes for reinforcement.
- XP calculation and rank progression (Cadet → Astronaut → Mission Specialist → Commander).

## 3. Playable Missions
- Interactive scenarios (e.g., Moon landing site selection & cargo packing).
- Scored debrief based on decisions.

## 4. AI Tutor
- Online mode: Proxied API requests to LLM (Claude/Gemini) returning Bangla explanations.
- Offline mode: Local keyword-matched Q&A cache bundled with the app.

## 5. Offline-First Sync
- Local SQLite storage via `@op-engineering/op-sqlite`.
- Embedded replica sync to Turso when online.
