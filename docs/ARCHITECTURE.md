# Architecture — Mohakash Jr

## 1. Design goals
- Works fully offline; syncs opportunistically when online.
- Animation/illustration-heavy — the interface should feel like a storybook/game, not a form.
- Bangla-first text and voice throughout.
- Runs acceptably on low-to-mid-range Android phones.
- One data layer, one query language (SQL), on-device and in the cloud.

## 2. High-level stack

| Layer | Choice | Why |
|---|---|---|
| App shell | Expo (custom dev client, not Expo Go) + React Native + TypeScript | op-sqlite is a native module — Expo Go can't load it. `expo prebuild` + an EAS dev client gives native modules while keeping Expo's tooling. |
| Navigation | expo-router | File-based routing, less boilerplate for a 4-level content flow. |
| State | Zustand | Small, no boilerplate, plays well with SQLite-backed data. |
| Local DB | `@op-engineering/op-sqlite` (libSQL build) | A real native SQLite engine, fast enough for animation-heavy UI, and the current path to Turso embedded replicas on-device. |
| Remote DB + sync | Turso (libSQL) | SQLite-compatible edge DB. Embedded replicas mean the same schema and SQL run locally and remotely — no translation layer between offline SQLite and an online NoSQL store. Free tier is generous enough for a hackathon MVP and a classroom pilot — verify current limits at turso.tech before relying on exact numbers. |
| AI tutor (online) | Claude or Gemini API, called through a small serverless proxy (Cloudflare Worker / Vercel Edge Function) | Keeps the API key off the device; lets you swap models without an app update. |
| AI tutor (offline) | Pre-generated Bangla Q&A bundled as JSON, matched by keyword | No on-device model — keeps the app small and fast. |
| Animation | `lottie-react-native` for mascot/character animation and transitions; `react-native-reanimated` + `react-native-skia` for interactive illustration | Lottie is fast to produce from Figma/After Effects exports; Skia gives real interactivity where Lottie can't (drag targets, particle effects). |
| Illustration assets | `react-native-svg` for static/vector art, PNG/WebP for painted backgrounds | Keeps bundle size down; SVG scales cleanly across phone sizes. |
| Localization | `expo-localization` / `i18n-js` + Noto Sans Bengali or Hind Siliguri fonts | Bangla-only for MVP; structured so English can be added later. |

## 3. Why Turso over Firebase here
Firestore's offline cache is a different data model (documents) from an on-device SQLite file (rows) — every sync path has to translate between the two. Turso is SQLite end-to-end: the schema written for `op-sqlite` is the same schema Turso stores, and libSQL's embedded-replica mode does bidirectional sync as a background operation rather than app logic you write yourself. For a 9-day build, that's meaningfully less code.

**The catch:** on-device Turso sync (via `op-sqlite` + the libsql extension) needs a custom dev client. You cannot use Expo Go, and you cannot fully test it in a bare web preview. Budget day 1 for `expo prebuild` + one EAS dev-client build for the platform you're demoing on (Android alone is fine for the hackathon).

## 4. Data model (first pass)

```
profiles(id, display_name, rank, xp, created_at, last_synced_at)
lessons(id, level, order_index, title_bn, content_json, illustration_asset, is_bundled)
quiz_questions(id, lesson_id, prompt_bn, options_json, correct_index, difficulty)
quiz_attempts(id, profile_id, question_id, chosen_index, correct, answered_at)
missions(id, level, title_bn, scenario_json)
mission_runs(id, profile_id, mission_id, decisions_json, score, completed_at)
ai_tutor_cache(id, question_hash, question_bn, answer_bn, source) -- source: 'bundled' | 'online_cached'
sync_meta(key, value) -- last_pull_at, last_push_at, device_id
```
All tables live in both the local `op-sqlite` database and the Turso remote — same schema, migrations written once and applied to both.

## 5. Sync strategy
- **Reads:** always from the local replica (instant, works offline).
- **Writes:** always to the local replica first (progress, quiz answers, mission runs never block on network).
- **Sync:** call the libSQL `sync()` on the embedded replica opportunistically — on app foreground, after a mission/quiz completes, and on a timer while the app is open and online. No sync just means a delayed backup, never lost data.
- **Content updates** (new lessons/missions) come down from Turso the same way. The app ships with a bundled starter set so day-one offline use needs zero network calls.

## 6. Repo structure (proposed)
```
mohakash-jr/
├── AGENT.md
├── CONTEXT.md
├── TEST.md
├── HANDOFF.md
├── implemented_features.md
├── docs/
│   ├── ARCHITECTURE.md
│   └── FEATURES.md
├── Graphify-out/
├── app/                      # expo-router screens
├── src/
│   ├── db/                   # schema, migrations, op-sqlite + turso client setup
│   ├── content/               # bundled lessons/quizzes/missions as JSON
│   ├── features/
│   │   ├── lessons/
│   │   ├── quiz/
│   │   ├── mission/
│   │   └── ai-tutor/
│   ├── components/            # shared UI, illustration/animation components
│   ├── i18n/
│   └── state/                 # zustand stores
├── assets/
│   ├── lottie/
│   ├── illustrations/
│   └── fonts/
├── server/                    # AI tutor proxy (Cloudflare Worker / Vercel function)
├── .env.example
└── app.json / eas.json
```

## 7. Open questions to settle before/at hackathon start
- Exact NASA source images/data for Level 1-2 content (science.nasa.gov, images.nasa.gov).
- Which AI model powers the online tutor, and per-request cost at demo scale.
- Whether mission debrief scoring should be deterministic or AI-generated.
