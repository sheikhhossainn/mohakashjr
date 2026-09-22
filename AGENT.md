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
