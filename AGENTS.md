# AGENT.md — Instructions for AI coding agents

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


