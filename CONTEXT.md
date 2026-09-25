# Mohakash Jr — Project Context

**One-liner:** An offline-first, Bangla-first mobile app that teaches space science to rural Bangladeshi students through illustrated missions, quizzes, and an AI tutor.

**Team:** Aspire 5 — NASA Space Apps Challenge 2026 (Local: BASIS Bangladesh, Global: Space Apps main event)
**Challenge:** Build a Junior Astronaut Mission Trainer

**Problem we're solving:** Rural students in Bangladesh have little access to engaging space/STEM education, spotty or no internet, and most learning content isn't in Bangla or built with low-end Android devices in mind.

**Who it's for:** Students roughly grade 6-10 in rural/semi-urban Bangladesh, used in classrooms with a teacher or independently on a shared family phone.

**Core experience:** A 4-level progression (Cadet → Astronaut → Mission Specialist → Commander) where students read illustrated Bangla lessons, take quizzes to earn XP/ranks, play a short interactive mission (starting with a Moon landing site + supply-packing scenario), and can ask an AI tutor questions in Bangla — online or offline.

**MVP scope (local round, due Oct 1, 2026):**
1. Bangla lessons — Cadet + Astronaut levels (8-10 lessons, illustrated)
2. Quiz engine — placement quiz + per-lesson quizzes, XP + rank
3. One playable mission — Moon landing site selection + supply packing, scored debrief
4. AI tutor — online (live API) + offline (cached Bangla Q&A)
5. Offline-first sync — all progress stored locally, syncs when online

**Deadlines:**
- Local (BASIS): Oct 1, 2026, 12:00 AM — 240s demo video + source link
- Global hackathon: Nov 14–15, 2026 — 48-hour build window

**Where to look for more:**
- `docs/ARCHITECTURE.md` — full technical architecture, data model, folder structure
- `docs/FEATURES.md` — detailed feature specs (fill in as features are scoped)
- `AGENT.md` — rules and workflow for AI coding agents working in this repo
- `IMPLEMENTATION_PLAN.md` — the phased build plan, from empty repo to MVP
- `HANDOFF.md` — current session state (created/updated as work progresses)
- `implemented_features.md` — running log of what's been built and how

**Status:** Active Sprint — Full 8-lesson NASA curriculum (4 Cadet + 4 Astronaut), 24 per-lesson quizzes, 5-question placement challenge, 30 offline Q&As in `offline_tutor.json` with keyword matching engine, AI Tutor "Captain Rover" prompt, and packaged `seed.json` delivered on `feature/humaira-content-pipeline`. Jim's Bengali typography setup, design & Lottie assets, AI Tutor Chat Screen (`app/tutor.tsx`) with online/offline fallback, and device testing report delivered on `feature/jim-assets-tutor-ui`. Ready for Mahi's SQLite database seeder & Cloudflare proxy, and Shahi's curriculum rendering.

