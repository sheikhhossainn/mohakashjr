# Graph Report - mohakashjr  (2026-09-22)

## Corpus Check
- 31 files · ~24,565 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 180 nodes · 150 edges · 32 communities (20 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9e70258d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- What You Must Do When Invoked
- What You Must Do When Invoked
- /graphify
- /graphify
- Implementation Plan — Mohakash Jr (initial scaffold → MVP)
- graphify reference: extra exports and benchmark
- Architecture — Mohakash Jr
- graphify reference: extra exports and benchmark
- AGENT.md — Instructions for AI coding agents
- graphify reference: query, path, explain
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- graphify.md
- extraction-spec.md
- graphify.md
- CLAUDE.md
- CLAUDE.md
- extraction-spec.md
- CONTEXT.md
- Feature Specifications — Mohakash Jr
- Testing Guide — Mohakash Jr
- implemented_features.md
- AGENT.md — Instructions for AI coding agents

## God Nodes (most connected - your core abstractions)
1. `What You Must Do When Invoked` - 12 edges
2. `What You Must Do When Invoked` - 12 edges
3. `/graphify` - 11 edges
4. `/graphify` - 10 edges
5. `Implementation Plan — Mohakash Jr (initial scaffold → MVP)` - 9 edges
6. `graphify reference: extra exports and benchmark` - 8 edges
7. `graphify reference: extra exports and benchmark` - 8 edges
8. `Architecture — Mohakash Jr` - 8 edges
9. `AGENT.md — Instructions for AI coding agents` - 7 edges
10. `AGENT.md — Instructions for AI coding agents` - 7 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (32 total, 12 thin omitted)

### Community 0 - "What You Must Do When Invoked"
Cohesion: 0.13
Nodes (15): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 0 - GitHub repos and multi-path merge (only if a URL or several paths), Step 1 - Ensure graphify is installed, Step 2.5 - Video and audio (only if video files detected), Step 2 - Detect files, Step 3 - Extract entities and relationships (+7 more)

### Community 1 - "What You Must Do When Invoked"
Cohesion: 0.13
Nodes (15): Part A - Structural extraction for code files, Part B - Semantic extraction (parallel subagents), Part C - Merge AST + semantic into final extraction, Step 0 - GitHub repos and multi-path merge (only if a URL or several paths), Step 1 - Ensure graphify is installed, Step 2.5 - Video and audio (only if video files detected), Step 2 - Detect files, Step 3 - Extract entities and relationships (+7 more)

### Community 2 - "/graphify"
Cohesion: 0.17
Nodes (11): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, PowerShell 5.1: Vertical scrolling stops working (+3 more)

### Community 3 - "/graphify"
Cohesion: 0.20
Nodes (9): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Usage (+1 more)

### Community 4 - "Implementation Plan — Mohakash Jr (initial scaffold → MVP)"
Cohesion: 0.20
Nodes (9): Implementation Plan — Mohakash Jr (initial scaffold → MVP), Phase 0 — Repo & tooling (Day 1), Phase 1 — Local DB + Turso wiring (Day 1-2), Phase 2 — Content pipeline (Day 2-3), Phase 3 — Quiz engine + progression (Day 3-5), Phase 4 — Mission flow (Day 6-7), Phase 5 — AI tutor (Day 6-7, parallel to Phase 4), Phase 6 — Offline hardening + polish (Day 8) (+1 more)

### Community 5 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 6 - "Architecture — Mohakash Jr"
Cohesion: 0.22
Nodes (8): 1. Design goals, 2. High-level stack, 3. Why Turso over Firebase here, 4. Data model (first pass), 5. Sync strategy, 6. Repo structure (proposed), 7. Open questions to settle before/at hackathon start, Architecture — Mohakash Jr

### Community 7 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 8 - "AGENT.md — Instructions for AI coding agents"
Cohesion: 0.25
Nodes (7): Agent Activity Log, AGENT.md — Instructions for AI coding agents, Bookkeeping, Context & docs, Environment & secrets, Git workflow & credentials, Testing

### Community 9 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 10 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 11 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 12 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 13 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 14 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 15 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 16 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 28 - "Feature Specifications — Mohakash Jr"
Cohesion: 0.29
Nodes (6): 1. Bangla Lessons, 2. Quiz Engine & Progression, 3. Playable Missions, 4. AI Tutor, 5. Offline-First Sync, Feature Specifications — Mohakash Jr

### Community 29 - "Testing Guide — Mohakash Jr"
Cohesion: 0.50
Nodes (3): Running Tests, Testing Checklist, Testing Guide — Mohakash Jr

### Community 31 - "AGENT.md — Instructions for AI coding agents"
Cohesion: 0.25
Nodes (7): Agent Activity Log, AGENT.md — Instructions for AI coding agents, Bookkeeping, Context & docs, Environment & secrets, Git workflow & credentials, Testing

## Knowledge Gaps
- **123 isolated node(s):** `graphify`, `Usage`, `What graphify is for`, `Step 0 - GitHub repos and multi-path merge (only if a URL or several paths)`, `Step 1 - Ensure graphify is installed` (+118 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `What You Must Do When Invoked` connect `What You Must Do When Invoked` to `/graphify`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `What You Must Do When Invoked` connect `What You Must Do When Invoked` to `/graphify`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `/graphify` connect `/graphify` to `What You Must Do When Invoked`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `graphify`, `Usage`, `What graphify is for` to the rest of the system?**
  _123 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `What You Must Do When Invoked` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `What You Must Do When Invoked` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._