# Implementation Plan — Mohakash Jr (initial scaffold → MVP)

Give this file to your coding agent as the task list for standing up the repo. Each phase should end in a working, committable state.

## Phase 0 — Repo & tooling (Day 1)
- [ ] `npx create-expo-app` with the TypeScript template, then `expo prebuild` to generate native projects (required for op-sqlite).
- [ ] Install: `expo-router`, `zustand`, `@op-engineering/op-sqlite` (libsql build), `react-native-reanimated`, `react-native-skia`, `lottie-react-native`, `react-native-svg`, `expo-localization`/`i18n-js`.
- [ ] Set up EAS (`eas.json`) and do one dev-client build for Android so the team can test native modules on real devices.
- [ ] Add `.env.example` with `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, and the AI tutor API key placeholder (real key only in the server proxy, never in the app).
- [ ] Create the repo scaffold files: `CONTEXT.md`, `AGENT.md`, `docs/ARCHITECTURE.md`, `docs/FEATURES.md` (stub), `TEST.md` (stub), `implemented_features.md` (empty), `Graphify-out/` (empty).
- [ ] Set up `dev` and `main` branches with branch protection if the git host supports it.

## Phase 1 — Local DB + Turso wiring (Day 1-2)
- [ ] Create a Turso database and get the URL + auth token.
- [ ] Write the schema from `docs/ARCHITECTURE.md` §4 as SQL migrations, applied to both the local op-sqlite file and the Turso remote.
- [ ] Wire up the embedded-replica client: local path + `syncUrl` + `authToken`. Confirm a write made offline appears in Turso after calling `sync()` with the network back on.
- [ ] Build a minimal `src/db/` module exposing typed query functions — no raw SQL scattered through feature code.

## Phase 2 — Content pipeline (Day 2-3)
- [ ] Define the JSON schema for a lesson, a quiz question, and a mission.
- [ ] Write 8-10 Cadet/Astronaut lessons in Bangla (content + which NASA image/fact each draws from).
- [ ] Write a seed script that loads bundled content into the local DB on first launch.

## Phase 3 — Quiz engine + progression (Day 3-5)
- [ ] Placement quiz on first launch.
- [ ] Per-lesson quiz screens; correct/incorrect state feeds XP.
- [ ] Rank calculation (Cadet → Astronaut → Mission Specialist → Commander) from XP thresholds.
- [ ] Illustrated feedback states (Lottie mascot reactions for correct/incorrect).

## Phase 4 — Mission flow (Day 6-7)
- [ ] Build the Moon-landing mission: site selection screen, cargo-packing interaction (Skia/Reanimated drag-and-drop), scored debrief screen.
- [ ] Store each run in `mission_runs` with the decisions made, for the debrief and for the demo's "here's what a student just did" moment.

## Phase 5 — AI tutor (Day 6-7, parallel to Phase 4)
- [ ] Deploy the server proxy (Cloudflare Worker/Vercel function) that forwards a Bangla question to the AI API and returns a Bangla answer.
- [ ] Wire the "online" tutor UI to call it, with a loading/illustrated-thinking state.
- [ ] Build the offline fallback: bundle a JSON of common questions/answers per lesson, matched by simple keyword overlap; cache any online answer locally so it works offline next time it's asked.

## Phase 6 — Offline hardening + polish (Day 8)
- [ ] Full airplane-mode pass: fresh install → complete a lesson, quiz, and mission with no network at all.
- [ ] Confirm sync catches up correctly once network returns (no duplicate or lost progress).
- [ ] Pass over animation timing, loading states, and Bangla text rendering on at least one low-end Android device.

## Phase 7 — Demo prep (Day 9)
- [ ] Script and record the 240-second video: problem → live demo (including the airplane-mode moment) → NASA data used → roadmap.
- [ ] Finalize the public repo + README.
- [ ] Update `implemented_features.md` and `CONTEXT.md` to reflect final MVP state.
