# AGENTS.md — Instructions for AI coding agents

This file is read by AI agents (Claude Code, Antigravity, Cursor, Codex, or similar) before working in this repo. Follow these rules exactly.

## Environment & secrets
1. Never open, read, or modify `.env`. To understand what environment variables exist, read `.env.example` instead.

## Git workflow & credentials
2. Never push directly to `dev` or `main`. Never delete `dev` or `main`.
3. Never push anything without explicit user permission.
4. Work on feature branches; open a PR only when the user asks for one.
5. **Git Identity & Push Verification (MANDATORY)**:
   - Before pushing any code, fetch and check the git credentials via `git config user.name` and `git config user.email`.
   - If git credentials are not available or not configured, prompt the user for their GitHub username and email address.
   - When credentials are found or retrieved, **explicitly ask the user for confirmation**:
     > *"Are these your GitHub account details? Username: `<username>`, Email: `<email>`. Should I proceed to push with this identity?"*
   - **Only if the user confirms "yes"**, use those credentials to push to the feature branch.
   - If the user says "no", ask for the correct account credentials, set them, and re-confirm before pushing.

## Context & docs
6. Read `CONTEXT.md` first to understand the project.
7. Read `docs/ARCHITECTURE.md` before making structural changes (new modules, DB schema changes, new dependencies).
8. Check `graphify-out/` when you need the current full-project state/graph:
   - **Query the graph**: When `graphify-out/graph.json` exists, query it before reading raw files to save tokens and understand connections:
     - `graphify query "<question>"` — returns a scoped subgraph for codebase or architecture questions.
     - `graphify path "<node A>" "<node B>"` — traces connections between components.
     - `graphify explain "<concept>"` — returns focused explanation of a specific symbol and its neighbors.
     - Consult `graphify-out/GRAPH_REPORT.md` for broad architectural reviews.
   - **Update the graph**:
     - Run `graphify update .` after adding or modifying code files in a session (uses fast AST-only extraction, zero token cost).
     - Run `graphify update . --force` if files were deleted or majorly refactored.
     - Run `graphify extract .` (or `/graphify .`) for full semantic extraction with an LLM backend when needed.
     - Git hooks (`post-commit` and `post-checkout`) are installed via `graphify hook install` to automatically update the graph across commits and branch switches.
9. Use the project's existing patterns and skills to fix a bug or add a feature rather than introducing a new pattern without reason.

## Bookkeeping
10. Before every push, update `implemented_features.md` with what you built and how.
11. Keep `CONTEXT.md` current — if a change shifts the project's scope or status, update it in the same session.
12. Track your own token usage. Before you'd hit a session/daily limit, write or update `HANDOFF.md` so the next agent session can pick up cleanly. Use this template:

```markdown
# HANDOFF — <date/time>

## Current task status
<what you were doing, in one or two lines>

## Just completed
- ...

## Active blockers
- ...

## Immediate next steps
1. ...
2. ...
```

Treat `HANDOFF.md` as the primary session-state file, not an overflow note — a new agent session should be able to read only `HANDOFF.md` and `CONTEXT.md` and know exactly where to resume.

13. **Agent Activity Log in this file (`AGENT.md` / `AGENTS.md`)**:
   - Whenever any developer or teammate's agent works on a feature or task, that agent **MUST** log the date and what task was performed directly in the `## Agent Activity Log` table below in this file.
   - If working from `AGENTS.md`, ensure the entry is recorded there (and kept in sync with `AGENT.md`).

## Testing
14. Check `TEST.md` for how to run and write tests before submitting a feature as complete.

---

## Agent Activity Log
<!-- Teammates & Agents: Record your task and feature activity below before finishing your session -->
| Date | Contributor / Agent | Task / Feature Worked On | Files Affected | Status |
|---|---|---|---|---|
| 2026-09-22 | Antigravity | Initialized dev branch, configured local/remote branch alignment, installed graphify & git hooks, created docs structure, and added agent logging + git push verification rules | `AGENT.md`, `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/FEATURES.md`, `TEST.md`, `implemented_features.md` | Completed |
| 2026-09-22 | Antigravity | Created TEAMCONTRIBUTION.md with 48h sprint task breakdown, dependencies, git workflow, and role-based how-to guides | `TEAMCONTRIBUTION.md`, `implemented_features.md` | Completed |
| 2026-09-22 | Shahi / Antigravity | Scaffolded Expo Router routes (/lessons, /quiz, /mission, /profile), child-friendly space UI, lesson reader, interactive quiz engine, Zustand store (XP gain, Cadet->Astronaut level-up celebration), and decoupled service adapters | `app/*`, `src/*`, `tests/*`, `package.json`, `app.json`, `tsconfig.json`, `babel.config.js` | Completed |
| 2026-09-22 | Shahi / Antigravity | High-end visual design & UX overhaul: implemented double-bezel concentric cards, tactile button-in-button architecture, energy tube XP bar, storybook chunking, spaceship quiz deck console, and SDK 57 upgrade | `src/theme/*`, `src/components/*`, `app/(tabs)/*`, `app/lessons/*`, `app/quiz/*` | Completed |
| 2026-09-22 | Shahi / Antigravity | Astronaut & Space Flight Deck transformation: built SVG CosmicBackground starfield & orbital rings, custom SVG Astronaut Helmet with gold thermal visor, SpaceTelemetryHUD life support bar, Apollo thruster ignition buttons, cryogenic plasma fuel cell XP gauge, holographic AI comms box, and official NASA Astronaut Mission ID dossier | `src/theme/*`, `src/components/*`, `app/*` | Completed |
| 2026-09-22 | Shahi / Antigravity | Applied ui-ux-pro-max skill for educational kids UI: implemented Soft 3D Claymorphism, Duolingo-style pressable buttons with bottom elevation lips & spring squish, cute cartoon Astro-Buddy mascot speech bubble, starry cosmic sky, and rounded typography with diacritic protection | `src/theme/*`, `src/components/*`, `app/*` | Completed |
| 2026-09-22 | Shahi / Antigravity | Implemented Launch Splash screen (/splash), interactive 4-step story Onboarding (/onboarding) with Astro-Buddy & multi-avatar picker, spring-physics buttons, animated twinkling stars, shooting meteor, and celebration confetti | `app/splash.tsx`, `app/onboarding.tsx`, `src/components/*`, `src/theme/*`, `app/*` | Completed |
| 2026-09-22 | Shahi / Antigravity | Built Mission to Mars interplanetary splash journey & 3-question Cadet Psychometric Assessment in Onboarding with dynamic Cadet Archetypes (Scientist, Engineer, Pioneer, Astrobiologist) and rank-based suit upgrades | `app/splash.tsx`, `app/onboarding.tsx`, `src/state/useAppStore.ts`, `src/components/AstronautAvatar.tsx`, `app/(tabs)/*` | Completed |
| 2026-09-22 | Shahi / Antigravity | Rebuilt onboarding psychometric assessment around genuine kid space passions (Rocket Pilot, Stargazer, Space Engineer, Alien Explorer), created custom vector SVG illustration badges (SpaceChoiceBadge.tsx) to eliminate generic emojis, and synchronized across tabs & tests | `src/state/useAppStore.ts`, `src/components/SpaceChoiceBadge.tsx`, `app/onboarding.tsx`, `app/(tabs)/*`, `tests/appStore.test.ts` | Completed |
| 2026-09-22 | Shahi / Antigravity | Implemented multi-select answers and empty initial selection in onboarding; added selection validation requiring at least 1 pick before advancing; updated calculateArchetype for multi-selections | `app/onboarding.tsx`, `src/state/useAppStore.ts`, `tests/appStore.test.ts` | Completed |
| 2026-09-22 | Shahi / Antigravity | Smart Dashboard Redesign: integrated Cadet Archetype identity & motto, replaced debug XP button with gamified Daily Fuel Cell Recharge (+25 XP), implemented dynamic next-lesson mission dispatch with archetype affinity matching, built Duolingo-style Daily Cadet Quests, transformed navigation into 2x2 tactile Bento Grid, and added Cosmic NASA Facts widget | `app/(tabs)/index.tsx`, `implemented_features.md` | Completed |
| 2026-09-22 | Shahi / Antigravity | Dark Cosmic Dashboard Restyle (ui-ux-pro-max): replaced all white/washed surfaces with deep indigo void glass (`rgba(14,18,60,0.88)`), applied vivid neon glow borders per section (cyan/gold/emerald/pink/purple), Duolingo 3D clay elevation lips, translucent dark glass cards — matching onboarding dark aesthetic 100% | `app/(tabs)/index.tsx` | Completed |
| 2026-09-24 | Mahim / Antigravity | Moon Landing Mission & Mascot Animations: installed react-native-reanimated & lottie-react-native, built MascotReaction & MascotFeedbackPopup, AnimatedXPBar, Screen 1 (LunarSiteSelector with 3 regions and radar), Screen 2 (CargoPackingGame with 500kg payload HUD and gauges), Screen 3 (MissionDebriefView with telemetry scoring and XP awarding), and MoonLandingMission coordinator exported for Shahi and wired into main navigation | `src/components/*`, `src/content/*`, `app/(tabs)/mission.tsx`, `app/mission/index.tsx`, `tests/mission.test.ts` | Completed |
| 2026-09-25 | Humaira / Antigravity | Delivered complete NASA curriculum (4 Cadet + 4 Astronaut lessons) with science.nasa.gov citations & Bangla cultural analogies, 24 per-lesson quizzes + 5 placement questions (29 total), 30 offline Q&As in offline_tutor.json, offline keyword matching service (offlineTutorService.ts), online AI Tutor Captain Rover prompt (aiTutorPrompt.ts & docs/AI_TUTOR_PROMPT.md), packaged master seed.json for Mahi's SQLite seeder, and 14 unit tests | `src/content/*`, `src/services/*`, `docs/AI_TUTOR_PROMPT.md`, `tests/content.test.ts`, `app/quiz/*` | Completed |
| 2026-09-25 | Jim / Antigravity | Configured Bengali typography (Noto Sans Bengali & Hind Siliguri) with line-height diacritic protection, generated vector/Lottie design assets (4 mascot animations, lunar terrain, landing zones, cargo items, vector badges), built AI Tutor Chat Screen (app/tutor.tsx) with Captain Rover persona & online/offline fallback, compiled device testing report (docs/DEVICE_TESTING_REPORT.md), and verified 20 unit tests | `assets/*`, `src/theme/typography.ts`, `app/tutor.tsx`, `app/_layout.tsx`, `app/(tabs)/index.tsx`, `docs/DEVICE_TESTING_REPORT.md`, `tests/tutorAndAssets.test.ts` | Completed |
| 2026-09-27 | Antigravity | Full Feature Integration: Analyzed all 3 feature branches (`feature/mahim-mission-flow`, `feature/humaira-content-pipeline`, `feature/assets-tutor-ui`), consolidated via local integration branch with dependency conflict resolution (package.json, Google Bengali fonts, Lottie for web), fixed Expo typedRoutes navigation casting, verified 27/27 test suite & zero TS errors, and cleanly merged into local dev branch | `package.json`, `app/*`, `src/*`, `assets/*`, `tests/*`, `AGENT.md`, `AGENTS.md`, `HANDOFF.md` | Completed |
| 2026-09-27 | Antigravity | Cargo Packing UI Overhaul: Fixed broken +প্যাক করো button overlaps by separating card header and dedicated action footer, redesigned cockpit telemetry HUD with live linear gauges & capacity indicator, modern segmented category pills with counters, and polished glassmorphic cards | `src/components/mission/CargoPackingGame.tsx`, `implemented_features.md`, `AGENT.md`, `AGENTS.md` | Completed |
| 2026-10-02 | Antigravity | Branch Audit & Dev Sync: Verified all feature branches (`feature/shahi-app-shell`, `feature/mahim-mission-flow`, `feature/humaira-content-pipeline`, `feature/assets-tutor-ui`) are merged into `dev`, fast-forwarded local `dev` to `origin/dev`, verified 27/27 unit tests pass, 0 TS lint errors, and updated graphify AST graph | `AGENT.md`, `AGENTS.md`, `HANDOFF.md`, `graphify-out/*` | Completed |
| 2026-10-02 | Antigravity | Main Merge & Remote Feature Branches Deletion: Merged `dev` into `main` (fast-forward, passing all 27 tests), and deleted all fully-merged remote feature branches (`feature/assets-tutor-ui`, `feature/humaira-content-pipeline`, `feature/mahim-mission-flow`, `feature/shahi-app-shell`) from origin | Remote refs, `HANDOFF.md`, `AGENT.md`, `AGENTS.md` | Completed |
| 2026-10-02 | Shahi / Antigravity | UI/UX Redesign: "Illustrated Cosmos" & Natural Learning Experience: Built Soft Space warm palette, upgraded Bengali typography to 17pt with 1.88x line-height, created StoryCard, GentleButton, WonderBox, NightSkyCanvas, IllustrationHeader; redesigned Lesson Reader into an illustrated storybook, Quiz into a calm narrative inquiry, polished Dashboard, Profile, Onboarding, Splash, and Tutor; verified 27/27 test suite & zero TS errors | `app/*`, `src/*`, `implemented_features.md` | Completed |
| 2026-10-02 | Antigravity | Merge UI/UX Redesign into dev: Merged feature/ui-ux-redesign into local dev branch with merge commit; verified 27/27 test suite passes with 0 TypeScript errors | `app/*`, `src/*`, `AGENT.md`, `AGENTS.md`, `HANDOFF.md`, `implemented_features.md` | Completed |
| 2026-10-04 | Antigravity | User Account Creation, Persistent Storage Database, and Modern Home Page Redesign: Built multi-user persistence (`authDatabase.ts`), `/auth` route (Sign Up, Log In, Guest Mode), Step 5 in Onboarding walkthrough, Profile account verification & guest upgrade banner, and refreshed Dashboard (`app/(tabs)/index.tsx`) with Cadet Command Bar, micro-animations, animated fuel recharge, segmented quests, and high-craft cosmic glassmorphism (33/33 tests passing, 0 TS errors) | `app/*`, `src/*`, `tests/authDatabase.test.ts`, `implemented_features.md`, `AGENT.md`, `AGENTS.md` | Completed |
| 2026-10-04 | Antigravity | Universal Bilingual Localization Engine (Bangla & English): built translations.ts, state persistence in authDatabase.ts, top command bar quick switcher pill, dashboard & profile language cards, localized tab navigation, telemetry HUD, quests, bento modules, lessons reader, and verified with 36/36 tests passing | `src/i18n/*`, `src/state/*`, `src/services/*`, `app/(tabs)/*`, `src/components/*`, `tests/i18n.test.ts` | Completed |
| 2026-10-04 | Antigravity | Remote Feature Branches Consolidation & Deletion: Checked remote feature branches (`origin/feature/ui-ux-redesign` and `origin/feature/bilingual-localization`), merged `origin/feature/bilingual-localization` into `dev` with Illustrated Cosmos design harmonization (36/36 tests passing, 0 TS errors), updated graphify AST knowledge graph, and deleted both feature branches from remote origin and local refs | `app/*`, `src/*`, Remote refs, `AGENT.md`, `AGENTS.md`, `HANDOFF.md`, `graphify-out/*` | Completed |
| 2026-10-04 | Antigravity | Interactive Moon Mission Game & Chondro Ovijan Redesign: Replaced vertical icons with 5-stage interactive simulation game (AstronautSuitUpGame, RocketFuelingStation, CockpitIgnitionDeck, LunarDescentModule, MoonwalkCelebration) featuring authentic NASA science, vector illustrations, micro-animations, flight path hub, and +120 XP award (39/39 tests passing, 0 TS errors) | `app/(tabs)/mission.tsx`, `src/components/mission/*`, `src/i18n/translations.ts`, `tests/missionGame.test.ts`, `implemented_features.md`, `AGENT.md`, `AGENTS.md` | Completed |
| 2026-10-05 | Antigravity | Full App UI/UX Overhaul, Soothing Colors & 6-Layer Atmospheric Moon Flight: Built Illustrated Cosmos 2.0 soothing warm cream palette (#FAF7F2), Nunito typography, 3-module clean Dashboard, animated rocket splash screen, 6-layer Atmospheric Crossing (Troposphere to Space with ISS flyby), animated suit wearing, lunar touchdown dust & shake, and victory confetti (40/40 tests passing, 0 TS errors) | `app/*`, `src/*`, `tests/missionGame.test.ts`, `implemented_features.md`, `AGENT.md`, `AGENTS.md`, `HANDOFF.md`, `graphify-out/*` | Completed |
| 2026-10-05 | Antigravity | App-Wide Color Harmonization, Interplanetary Mars Splash & Homepage Gamification: Purged all residual dark navy/void styles across Onboarding, Auth, AI Tutor, Quiz, and Lessons; fixed invisible text inputs; enhanced Mars destination on Splash (/splash) with Phobos/Deimos moons and clear vector labels; integrated SpaceTelemetryHUD and XPProgressBar energy tube into Homepage; verified 40/40 tests passing | `app/*`, `src/*`, `implemented_features.md`, `AGENT.md`, `AGENTS.md`, `HANDOFF.md`, `graphify-out/*` | Completed |
| 2026-10-05 | Antigravity | Play Store Educational UI/UX Polish, Safe Area Gestures & Realistic Rocket Flight: Forensically analyzed Android screenshots; resolved Android gesture navigation pill tab collision with dynamic `useSafeAreaInsets().bottom`; removed mission tab dark header clash and harmonized all 4 tabs with cream palette; eliminated stage title clipping by hiding tab navigation in full-screen mission simulations; fixed Astro-Buddy speech bubble text illegibility (crisp white card with dark charcoal text `#1A1A2E`); fixed washed-out white text on pale green in Rocket Fueling to deep emerald `#064E3B`; fixed Lunar Descent dark-on-dark telemetry gauges to high-contrast cockpit display; built realistic multi-stage rocket launch & flight in `AtmosphericJourney.tsx` (Prandtl-Glauert supersonic condensation cone at Mach 1, SRB booster separation in Stratosphere, vacuum plume expansion, ISS flyby at 400 km, Blue Marble Earth, Moon craters, live flight telemetry HUD, and interactive thruster boost); verified 40/40 tests passing and 0 TypeScript errors | `app/(tabs)/*`, `src/components/*`, `implemented_features.md`, `AGENT.md`, `AGENTS.md`, `HANDOFF.md`, `graphify-out/*` | Completed |
| 2026-10-05 | Antigravity | Local-First Architecture, Space Hub & Dev/Main Merge: Migrated app to zero-friction local-first model (`profileStorage.ts`), created interactive Space Destination Hub (`SpaceHub.tsx`, `spaceDestinations.ts`), added animated `AppLogo.tsx` & brand icons, consolidated header/navigation with `ScreenHeader.tsx`, expanded offline tutor to 114+ FAQs with connectivity awareness, verified 37/37 tests and 0 TS errors, and executed branch merges into dev and main | `app/*`, `src/*`, `tests/*`, `implemented_features.md`, `AGENTS.md`, `HANDOFF.md`, `CONTEXT.md` | Completed |
| 2026-10-05 | Antigravity | Project README, Brand Logo Integration & Feature Branch Cleanup: Deleted local and remote feature branches (`feature/local-first-space-hub`, `feature/mahi-sqlite-db`); authored comprehensive project `README.md` featuring app logo, architecture, 5-stage moon flight details, and quick start guide; pushed directly to dev and main per repo owner authorization | `README.md`, `AGENTS.md`, `HANDOFF.md`, `implemented_features.md` | Completed |
| 2026-10-05 | Antigravity | Interactive Planetary Dossiers (গ্রহ পরিক্রমা): Unlocked all 8 destinations with dynamic Planetary Weight Calculator, NASA telemetry specs, relatable Bangla analogies, spacesuit survival guides, robotic mission archives, and interactive mini-quizzes (+10 XP) | `src/components/PlanetaryDossier.tsx`, `src/content/spaceDestinations.ts`, `src/components/SpaceHub.tsx`, `app/(tabs)/mission.tsx`, `src/i18n/translations.ts`, `tests/planetaryDossiers.test.ts` | Completed |
| 2026-10-05 | Antigravity | EAS Project Linking, Cloud Build & OTA Updates: Linked Expo project ID `a9ab89a8-86ae-4fe5-a706-06f08ff84329` (`@sheikhhossainns-team/mohakash-jr`), configured `expo-updates`, created `preview` & `production` channels, setup direct installable APK & AAB in `eas.json`, published live OTA updates to both channels, and dispatched Android preview cloud build `f776d1ce-3027-4056-a97c-1ab328160177` | `app.json`, `eas.json`, `package.json`, `package-lock.json`, `implemented_features.md`, `AGENTS.md` | Completed |
| 2026-10-07 | Antigravity | Dynamic Cosmic Illustrations, Quiz Ovijan UX, Moon Mission Fix & Planetary Missions: Built vector `CosmicTopicIllustration.tsx` & `cosmicTopics.ts` for 13 space topics with smart Bangla/EN detection; fixed vertical char wrap in `MascotFeedbackSlot.tsx` on quiz completion; resolved option badge contrast in `quiz/[id].tsx` with dark text and clean explanations; eliminated Moon flight native driver blank screen crash in `AtmosphericJourney.tsx`; authored authentic 5-stage missions in `planetaryMissionsData.ts` for all Solar System destinations; built `PlanetaryMissionSimulator.tsx` and wired direct launch across Space Hub, Dossier, and Mission tab (41/41 tests passing, 0 TS errors) | `app/*`, `src/*`, `tests/planetaryMissions.test.ts`, `implemented_features.md`, `AGENTS.md`, `HANDOFF.md` | Completed |
| 2026-10-07 | Antigravity | Slow Celestial Brand Logo Animation & Fast Start Button: Rebuilt AppLogo.tsx with 100% native UI thread hardware-accelerated animations (zero SVG DOM prop lag on Android APKs), continuous slow celestial orbit (~5.5s cycle) with 3D depth layering, zero-G helmet float, breathing halo & pulsing beacon; updated /splash with AppLogo, gold title, and sub-second button appearance (~450ms) | `app/splash.tsx`, `src/components/AppLogo.tsx`, `implemented_features.md`, `AGENTS.md` | Completed |
| 2026-10-07 | Antigravity | Quiz Ovijan UI Polish, Gemini/AI Icon Removal & 1x Daily Bonus Enforcement: Replaced text-box style borders in quiz options and MascotFeedbackSlot with soft storybook borders; purged AI/Gemini sparkle icons across 20+ files with domain-accurate icons (Zap, Star, Award, BookOpen, Bot); implemented single-claim daily bonus (+25 XP) keyed by YYYY-MM-DD calendar date with disk persistence; verified 42/42 tests passing | `app/*`, `src/*`, `tests/appStore.test.ts`, `implemented_features.md` | Completed |







