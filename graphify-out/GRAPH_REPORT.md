# Graph Report - mohakashjr  (2026-09-25)

## Corpus Check
- 187 files · ~274,136 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2535 nodes · 3346 edges · 199 communities (145 shown, 54 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 210 edges (avg confidence: 0.75)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6fcf8431`
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
- 1. Quick Start & Git Workflow (For Every Teammate & Agent)
- dependencies
- expo
- tsconfig.json
- babel.config.js
- HANDOFF — 2026-09-22 21:23
- BM25
- Tailwind CSS Utility Reference
- slide_search_core.py
- Brand Guidelines v1.0
- Design
- Canvas Design System
- design_system.py
- Prerequisites
- spacing
- Form & Input Components
- Tailwind CSS Responsive Design
- search_stack
- Typography Specifications
- Logo Usage Rules
- Component Specifications
- shadcn/ui Accessibility Patterns
- TestTailwindConfigGenerator
- _select_palette_for_mode
- html-token-validator.py
- core.py
- Asset Approval Checklist
- Logo AI Prompt Engineering
- Color Palette Management
- CIP Deliverable Guide
- BM25
- States and Variants
- UI Styling Skill
- Workflow
- Design System
- Tailwind CSS Customization
- read_rows
- search
- Routing by Task Type
- generate-slide.py
- shadcn/ui Theming & Customization
- TailwindConfigGenerator
- DesignSystemGenerator
- Asset Organization Guide
- Primary Color Meanings
- Core Logo Types
- color
- main
- Brand Consistency Checklist
- CIP Mockup Prompt Engineering
- fetch-background.py
- TestThresholdGate
- Design Principles
- Design Principles
- generate.py
- fontSize
- TestShadcnInstaller
- CatalogRefreshTest
- CIP Design Reference
- Icon Design Reference
- Copywriting Formulas
- Copywriting Formulas
- BM25
- detect_domain
- .generate
- Banner Design - Multi-Format Creative Banner System
- Messaging Framework
- Brand Voice Framework
- Layout Patterns
- Tailwind Integration
- Layout Patterns
- update.md
- Logo Design Reference
- design-tokens-starter.json
- .add_components
- card
- ShadcnInstaller
- _resolve_color_mode
- Core Visual Elements
- CIP Design Style Guide
- primitive
- test_tailwind_config_gen.py
- TestStyleTaxonomy
- Brand
- Slide Strategies
- generate.py
- button
- Slide Strategies
- ._base_config
- parse_decision_rules
- _run
- _normalize
- input
- radius
- ._generate_javascript
- test_core.py
- Slides Reference
- HTML Slide Template
- HTML Slide Template
- _filter_anti_patterns_for_mode
- TestTextLayoutDataContracts
- shadow
- Slides
- _row_identities
- Brand Guidelines Template
- $type
- radius
- lg
- padding-y
- xl
- md
- none
- test_sync_brand_to_tokens.py
- main
- destructive
- destructive-foreground
- muted
- primary-foreground
- ring
- muted
- shadcn_add.py
- .__init__
- slides-create.md
- create.md
- .test_add_components_with_overwrite
- .test_add_components_dry_run
- .test_add_components_success
- .test_add_components_npx_not_found
- .test_add_all_components_no_config
- .test_list_installed_no_config
- .test_init_default_project_root
- .test_init_dry_run
- .test_get_installed_components_empty
- .test_get_installed_components_with_files
- .test_add_components_no_components
- .test_add_breakpoints
- .test_recommend_plugins
- .test_generate_typescript_config
- .test_generate_javascript_config
- .test_validate_config_no_content
- .test_init_javascript
- .test_write_config_invalid_path
- .test_default_content_paths_react
- .test_default_content_paths_vue
- .test_add_colors
- useAppStore
- colors.ts
- [id].tsx
- DoubleBezelCard.tsx
- onboarding.tsx
- MascotFeedbackSlot.tsx
- secondary-foreground
- md
- expo
- expo-constants
- expo-font
- expo-status-bar
- lucide-react-native
- react
- react-dom
- react-native
- react-native-svg
- @expo-google-fonts/noto-sans-bengali
- expo-linking
- expo-router
- react-native-safe-area-context
- react-native-screens

## God Nodes (most connected - your core abstractions)
1. `TailwindConfigGenerator` - 57 edges
2. `DesignSystemGenerator` - 45 edges
3. `search()` - 40 edges
4. `TestTailwindConfigGenerator` - 35 edges
5. `ShadcnInstaller` - 33 edges
6. `search_stack()` - 30 edges
7. `useAppStore` - 28 edges
8. `TestShadcnInstaller` - 26 edges
9. `Colors` - 23 edges
10. `Typography` - 19 edges

## Surprising Connections (you probably didn't know these)
- `ProfileScreen()` --calls--> `useAppStore`  [EXTRACTED]
  app/(tabs)/profile.tsx → src/state/useAppStore.ts
- `RootLayout()` --calls--> `useAppStore`  [EXTRACTED]
  app/_layout.tsx → src/state/useAppStore.ts
- `SplashScreen()` --calls--> `useAppStore`  [EXTRACTED]
  app/splash.tsx → src/state/useAppStore.ts
- `PsychometricOption` --references--> `CadetArchetype`  [EXTRACTED]
  app/onboarding.tsx → src/state/useAppStore.ts
- `OnboardingScreen()` --calls--> `useAppStore`  [EXTRACTED]
  app/onboarding.tsx → src/state/useAppStore.ts

## Import Cycles
- None detected.

## Communities (199 total, 54 thin omitted)

### Community 0 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 1 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 2 - "/graphify"
Cohesion: 0.07
Nodes (46): read_rows(), TestAccessibilityGuidance, TestChartsTypographyAndIcons, TestCurrentReactGuidance, TestSemanticColors, _catalog_date(), _check_app_interface_contract(), _check_catalog_contract() (+38 more)

### Community 3 - "/graphify"
Cohesion: 0.20
Nodes (15): LessonReaderScreen(), styles, QuizHubScreen(), styles, DashboardScreen(), LessonsScreen(), styles, DoubleBezelCard() (+7 more)

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

### Community 32 - "1. Quick Start & Git Workflow (For Every Teammate & Agent)"
Cohesion: 0.09
Nodes (21): 1. Quick Start & Git Workflow (For Every Teammate & Agent), 2. Team Task Allocation & Dependency Matrix, 3. Step-by-Step "How-To" Instructions per Role, 4. Key Milestones Timeline, Guide for Humaira (Bangla Content & AI Knowledge), Guide for Jim (Typography, Design, Chat UI & QA), Guide for Mahi (Database & Cloudflare Proxy), Guide for Mahim (Mascot Motion & Moon Mission) (+13 more)

### Community 33 - "dependencies"
Cohesion: 0.29
Nodes (7): scripts, android, ios, lint, start, test, web

### Community 34 - "expo"
Cohesion: 0.11
Nodes (18): backgroundColor, adaptiveIcon, reactCompiler, typedRoutes, expo, android, experiments, ios (+10 more)

### Community 35 - "tsconfig.json"
Cohesion: 0.13
Nodes (14): expo-env.d.ts, expo/tsconfig.base, .expo/types/**/*.ts, node, ./src/*, **/*.ts, **/*.tsx, compilerOptions (+6 more)

### Community 36 - "babel.config.js"
Cohesion: 0.05
Nodes (53): $type, $value, $type, $value, $type, $value, $type, $value (+45 more)

### Community 37 - "HANDOFF — 2026-09-22 21:23"
Cohesion: 0.33
Nodes (5): Active blockers, Current task status, HANDOFF — 2026-09-25 12:40, Immediate next steps, Just completed

### Community 38 - "BM25"
Cohesion: 0.06
Nodes (42): BM25, detect_domain(), get_cip_brief(), _load_csv(), Load CSV and return list of dicts, Core search function using BM25, Auto-detect the most relevant domain from query, Main search function with auto-domain detection (+34 more)

### Community 39 - "Tailwind CSS Utility Reference"
Cohesion: 0.05
Nodes (43): Arbitrary Values, Aspect Ratio, Background Colors, Border Color, Border Radius, Border Style, Border Width, Borders (+35 more)

### Community 40 - "slide_search_core.py"
Cohesion: 0.08
Nodes (36): format_context(), format_result(), main(), Format a single search result for display, Format contextual recommendations for display., BM25, calculate_pattern_break(), detect_domain() (+28 more)

### Community 41 - "Brand Guidelines v1.0"
Cohesion: 0.05
Nodes (37): 1. Color Palette, 2. Typography, 3. Logo Usage, 4. Voice & Tone, 5. Imagery Guidelines, 6. Design Components, Accessibility, AI Image Generation (+29 more)

### Community 42 - "Design"
Cohesion: 0.06
Nodes (35): Banner Design (Built-in), Banner: Design Rules, Banner: Quick Size Reference, Banner: Top Art Styles, Banner: Workflow, CIP Design (Built-in), CIP: Generate Brief, CIP: Generate Mockups (+27 more)

### Community 43 - "Canvas Design System"
Cohesion: 0.06
Nodes (35): 1. Visual Communication First, 2. Minimal Text Integration, 3. Expert Craftsmanship, 4. Systematic Patterns, Analog Meditation, Approach, Canvas Boundaries, Canvas Design System (+27 more)

### Community 44 - "design_system.py"
Cohesion: 0.08
Nodes (30): ansi_ljust(), _detect_page_type(), format_ascii_box(), format_markdown(), format_master_md(), format_page_override_md(), generate_design_system(), _generate_intelligent_overrides() (+22 more)

### Community 45 - "Prerequisites"
Cohesion: 0.06
Nodes (34): Accessibility, Available Domains, Available Stacks, Common Rules for Professional UI, Common Sticking Points, Example Workflow, How to Use This Skill, Icons & Visual Elements (+26 more)

### Community 46 - "spacing"
Cohesion: 0.06
Nodes (34): $type, $value, $type, $value, $type, $value, $type, $value (+26 more)

### Community 47 - "Form & Input Components"
Cohesion: 0.06
Nodes (32): Accordion, Alert, Alert Dialog, Avatar, Badge, Button, Card, Checkbox (+24 more)

### Community 48 - "Tailwind CSS Responsive Design"
Cohesion: 0.06
Nodes (32): 1. Mobile-First Design, 2. Consistent Breakpoint Usage, 3. Test at Breakpoint Boundaries, 4. Use Container for Content Width, 5. Progressive Enhancement, 6. Avoid Too Many Breakpoints, Best Practices, Breakpoint System (+24 more)

### Community 49 - "search_stack"
Cohesion: 0.10
Nodes (8): _project_row(), Search stack-specific guidelines, search_stack(), _valid_max_results(), _rows(), TestNativeDesktopStackFreshness, _rows(), TestWebStackFreshness

### Community 50 - "Typography Specifications"
Cohesion: 0.06
Nodes (30): Accessibility, Base System, Best Practices, Clean & Modern, Common Font Pairings, Contrast Requirements, CSS Implementation, Editorial (+22 more)

### Community 51 - "Logo Usage Rules"
Cohesion: 0.07
Nodes (28): Absolute Don'ts, Approved Backgrounds, Before Using Logo, Clear Space, Co-branding, Color Rules, Color Usage, Color Variants (+20 more)

### Community 52 - "Component Specifications"
Cohesion: 0.07
Nodes (28): Alert, Anatomy, Anatomy, Anatomy, Anatomy, Anatomy, Badge, Button (+20 more)

### Community 53 - "shadcn/ui Accessibility Patterns"
Cohesion: 0.07
Nodes (28): Accordion, Alert, ARIA Labels, Checkbox and Radio, Color Contrast, Command Palette Navigation, Component-Specific Patterns, Dialog/Modal Navigation (+20 more)

### Community 54 - "TestTailwindConfigGenerator"
Cohesion: 0.07
Nodes (15): Test adding colors multiple times., Test adding full color palette., Test adding custom spacing., Test TailwindConfigGenerator class., Test that adding same plugin twice doesn't duplicate., Test plugin recommendations for Next.js., Test initialization with default settings., Test generating config with custom colors. (+7 more)

### Community 55 - "_select_palette_for_mode"
Cohesion: 0.10
Nodes (14): _contrast_ratio(), _derive_dark_palette(), _palette_is_dark(), WCAG relative luminance of a #RRGGBB string, or None if unparseable., True when a colors.csv row's Background is a dark surface., WCAG contrast ratio for two hex colors, or None if either is invalid., Keep product brand tokens while deriving accessible dark surfaces., Pick the highest-ranked palette matching the resolved mode.      Only the dark (+6 more)

### Community 56 - "html-token-validator.py"
Cohesion: 0.14
Nodes (24): get_context(), is_allowed_exception(), is_allowed_rgba(), is_inside_block(), load_css_variables(), main(), print_result(), print_summary() (+16 more)

### Community 57 - "core.py"
Cohesion: 0.12
Nodes (25): _contains_phrase(), _domain_keywords(), _file_signature(), _get_bm25(), _load_csv(), _load_csv_snapshot(), _load_product_keywords(), _load_rows_or_empty() (+17 more)

### Community 58 - "Asset Approval Checklist"
Cohesion: 0.08
Nodes (25): Accessibility, Archival, Asset Approval Checklist, Automation Support, Color Compliance, Common Issues & Fixes, Content Accessibility, Content Quality (+17 more)

### Community 59 - "Logo AI Prompt Engineering"
Cohesion: 0.08
Nodes (25): Common Pitfalls, Core Prompt Structure, Detailed Brief, Eco/Sustainable, Effective Keywords by Style, Fashion Brand, Healthcare, Industry-Specific Prompts (+17 more)

### Community 60 - "Color Palette Management"
Cohesion: 0.08
Nodes (24): Accessibility Requirements, Brand Compliance Validation, Checking Contrast, Color Documentation Format, Color Extraction, Color Palette Examples, Color Palette Management, Color System Structure (+16 more)

### Community 61 - "CIP Deliverable Guide"
Cohesion: 0.08
Nodes (24): Apparel, Business Card, Car/Sedan, CIP Deliverable Guide, Core Identity, Digital Assets, Email Signature, Envelope (+16 more)

### Community 62 - "BM25"
Cohesion: 0.11
Nodes (19): BM25, detect_domain(), _load_csv(), Load CSV and return list of dicts, Core search function using BM25, Auto-detect the most relevant domain from query, Main search function with auto-domain detection, Search across all domains and combine results (+11 more)

### Community 63 - "States and Variants"
Cohesion: 0.08
Nodes (24): Accessibility, Accessibility Requirements, ARIA States, Color Contrast, Color Variants, Disabled States, Error Messages, Error States (+16 more)

### Community 64 - "UI Styling Skill"
Cohesion: 0.08
Nodes (24): Accessibility Patterns, Alternative: Tailwind-Only Setup, Best Practices, Common Patterns, Component Layer: shadcn/ui, Component Library Guide, Component + Styling Setup, Core Stack (+16 more)

### Community 65 - "Workflow"
Cohesion: 0.08
Nodes (23): Art Direction Styles (Reuse from Banner), Color & Contrast, Design Best Practices, HTML Design Rules, HTML Template Structure, Option A: Chrome Headless CLI (Recommended — zero dependencies), Option B: chrome-devtools skill, Option C: Playwright script (+15 more)

### Community 66 - "Design System"
Cohesion: 0.09
Nodes (22): Best Practices, Chart.js Integration, Command, Component Spec Pattern, Contextual Decision Flow, Decision System CSVs, Design System, Integration (+14 more)

### Community 67 - "Tailwind CSS Customization"
Cohesion: 0.09
Nodes (22): @apply Directive, Best Practices, Color Customization, Complete Tailwind Config, Configuration Examples, Content Configuration, Custom Color Palette, Custom Font Sizes (+14 more)

### Community 68 - "read_rows"
Cohesion: 0.15
Nodes (6): read_rows(), split_values(), style_identities(), TestGeneratedCatalogContract, TestLandingAndStackContract, TestStyleIdentityContract

### Community 69 - "search"
Cohesion: 0.14
Nodes (8): _exact_stack_identifier(), Resolve a deprecated in-domain alias, or expose a cross-domain redirect., Main search function with auto-domain detection, Resolve a standalone API identifier even when its BM25 IDF is low., search(), _style_search_destination(), TestSearchDomains, TestTextLayoutRetrieval

### Community 70 - "Routing by Task Type"
Cohesion: 0.10
Nodes (19): Banner Design Tasks, Brand Identity Tasks, Component Creation, Corporate Identity Program Tasks, Design Routing Guide, Design System Migration, Icon Design Tasks, Implementation Tasks (+11 more)

### Community 71 - "generate-slide.py"
Cohesion: 0.15
Nodes (19): _e(), generate_chart_slide(), generate_cta_slide(), generate_deck(), generate_metrics_slide(), generate_problem_slide(), generate_solution_slide(), generate_testimonial_slide() (+11 more)

### Community 72 - "shadcn/ui Theming & Customization"
Cohesion: 0.10
Nodes (19): Base Color Presets, Best Practices, Color Customization, Color Format, Component Customization, CSS Variable System, Customize Styles, Customize Variants (+11 more)

### Community 73 - "TailwindConfigGenerator"
Cohesion: 0.10
Nodes (11): Generate Tailwind CSS configuration files., Add full color palette (50-950 shades) for a base color.          Args:, TailwindConfigGenerator, Test adding custom fonts., Test validating valid configuration., Test generating complete TypeScript configuration., Test initialization with different frameworks., Test default output path for TypeScript. (+3 more)

### Community 74 - "DesignSystemGenerator"
Cohesion: 0.17
Nodes (5): DesignSystemGenerator, Generates design system recommendations from aggregated searches., Load reasoning rules from CSV., TestReasoningMatch, TestReasoningContract

### Community 75 - "Asset Organization Guide"
Cohesion: 0.11
Nodes (18): Asset Entry (manifest.json), Asset Organization Guide, By Campaign, By Status, By Type, Cleanup Workflow, Components, Directory Structure (+10 more)

### Community 76 - "Primary Color Meanings"
Cohesion: 0.11
Nodes (18): Accessibility Considerations, Analogous, Black, Blue, Color Combinations by Industry, Color Harmony Types, Complementary, Green (+10 more)

### Community 77 - "Core Logo Types"
Cohesion: 0.11
Nodes (18): 1. Wordmark (Logotype), 2. Lettermark (Monogram), 3. Pictorial Mark (Brand Mark), 4. Abstract Mark, 5. Mascot, 6. Emblem, 7. Combination Mark, Aesthetic Styles (+10 more)

### Community 78 - "color"
Cohesion: 0.11
Nodes (19): $type, $value, background, foreground, muted-foreground, primary, primary-hover, secondary (+11 more)

### Community 79 - "main"
Cohesion: 0.11
Nodes (10): main(), Add custom font families.          Args:             fonts: Dict of font_type, Add custom spacing values.          Args:             spacing: Dict of name:, Add custom breakpoints.          Args:             breakpoints: Dict of name:, Add plugin requirements.          Args:             plugins: List of plugin n, Get plugin recommendations based on configuration.          Returns:, Generate configuration file content.          Returns:             Configurat, Write configuration to file.          Returns:             Tuple of (success, (+2 more)

### Community 80 - "Brand Consistency Checklist"
Cohesion: 0.11
Nodes (17): Audit Frequency, Brand Consistency Checklist, Channel Audit, Collateral, Colors, Common Issues, Email, Imagery (+9 more)

### Community 81 - "CIP Mockup Prompt Engineering"
Cohesion: 0.11
Nodes (17): Apparel (Polo/T-Shirt), Base Prompt Structure, Business Card, CIP Mockup Prompt Engineering, Context Modifiers, Corporate Minimal, Deliverable-Specific Modifiers, Letterhead (+9 more)

### Community 82 - "fetch-background.py"
Cohesion: 0.17
Nodes (17): generate_css_for_background(), get_background_image(), get_curated_images(), get_overlay_css(), get_pexels_search_url(), load_backgrounds_config(), load_brand_colors(), main() (+9 more)

### Community 83 - "TestThresholdGate"
Cohesion: 0.13
Nodes (3): TestFixtureValidation, TestMetricMath, TestThresholdGate

### Community 84 - "Design Principles"
Cohesion: 0.12
Nodes (15): 22 Art Direction Styles, Banner Sizes & Art Direction Styles Reference, Complete Banner Sizes, CTA Rules, Design Principles, Pinterest Research Queries, Print, Print Specs (+7 more)

### Community 85 - "Design Principles"
Cohesion: 0.12
Nodes (15): 22 Art Direction Styles, Banner Sizes & Art Direction Styles Reference, Complete Banner Sizes, CTA Rules, Design Principles, Pinterest Research Queries, Print, Print Specs (+7 more)

### Community 86 - "generate.py"
Cohesion: 0.20
Nodes (15): apply_color(), apply_viewbox_size(), extract_svgs(), generate_batch(), generate_icon(), generate_sizes(), load_env(), main() (+7 more)

### Community 87 - "fontSize"
Cohesion: 0.12
Nodes (16): $type, $value, $type, $value, $type, $value, $type, $value (+8 more)

### Community 88 - "TestShadcnInstaller"
Cohesion: 0.12
Nodes (9): Test adding components without shadcn config., Test adding components that are already installed., Test ShadcnInstaller class., Test adding all components in dry run mode., Create temporary project structure., Test successful addition of all components., Test listing installed components when none exist., Test checking for non-existent shadcn config. (+1 more)

### Community 90 - "CIP Design Reference"
Cohesion: 0.13
Nodes (14): CIP Brief (Start Here), CIP Design Reference, Commands, Deliverable Categories, Design Styles, Detailed References, Generate Mockups, HTML Presentation Features (+6 more)

### Community 91 - "Icon Design Reference"
Cohesion: 0.13
Nodes (14): Available Styles, CLI Options, Commands, Generate Batch Variations, Generate Multiple Sizes, Generate Single Icon, Icon Categories, Icon Design Reference (+6 more)

### Community 92 - "Copywriting Formulas"
Cohesion: 0.13
Nodes (14): AIDA (Attention-Interest-Desire-Action), Before-After-Bridge, Contrast Patterns, Copywriting Formulas, Core Formulas, Cost of Inaction, FAB (Features-Advantages-Benefits), Formula-to-Slide Mapping (+6 more)

### Community 93 - "Copywriting Formulas"
Cohesion: 0.13
Nodes (14): AIDA (Attention-Interest-Desire-Action), Before-After-Bridge, Contrast Patterns, Copywriting Formulas, Core Formulas, Cost of Inaction, FAB (Features-Advantages-Benefits), Formula-to-Slide Mapping (+6 more)

### Community 94 - "BM25"
Cohesion: 0.19
Nodes (7): BM25, BM25 ranking algorithm for text search, Lowercase, normalize synonyms, split, remove punctuation, filter stopwords, Build BM25 index from documents, Suggest complete public identities so a retry can bypass score thresholds., _suggest_identities(), TestTokenizer

### Community 95 - "detect_domain"
Cohesion: 0.23
Nodes (3): detect_domain(), Auto-detect the most relevant domain from query.      Matches are weighted by, TestDomainDetection

### Community 96 - ".generate"
Cohesion: 0.14
Nodes (8): Execute searches across multiple domains., Find matching reasoning rule for a category., Apply reasoning rules to search results., Select best matching result based on priority keywords., Extract results list from search result dict., Generate complete design system recommendation.          variance/motion/densi, Bucket a 1-10 dial value into its tier config. Returns None if value is None., _resolve_dial()

### Community 97 - "Banner Design - Multi-Format Creative Banner System"
Cohesion: 0.14
Nodes (13): Art Direction Styles (Top 10), Banner Design - Multi-Format Creative Banner System, Banner Size Quick Reference, Design Rules, Prerequisites, Security, Step 1: Gather Requirements (AskUserQuestion), Step 2: Research & Art Direction (+5 more)

### Community 98 - "Messaging Framework"
Cohesion: 0.14
Nodes (13): Core Statements, Elevator Pitches, Framework Structure, Message Architecture, Message by Audience, Message Testing, Messaging Framework, Mission Statement (+5 more)

### Community 99 - "Brand Voice Framework"
Cohesion: 0.14
Nodes (13): Brand Voice Framework, Character Spectrum, Emotion Spectrum, Language Spectrum, Step 1: Define Personality Traits, Step 2: Create Voice Chart, Step 3: Context Adaptation, Tone Spectrum (+5 more)

### Community 100 - "Layout Patterns"
Cohesion: 0.14
Nodes (13): Card Styles, Component Variants, CSS Structures, Feature Grid (3 columns), Layout Decision Flow, Layout Patterns, Layout Selection by Use Case, Metric Styles (+5 more)

### Community 101 - "Tailwind Integration"
Cohesion: 0.14
Nodes (13): Animation Tokens, Base Layer, Button Example, Component Classes, CSS Variables Setup, Dark Mode Toggle, HSL Format Benefits, shadcn/ui Alignment (+5 more)

### Community 102 - "Layout Patterns"
Cohesion: 0.14
Nodes (13): Card Styles, Component Variants, CSS Structures, Feature Grid (3 columns), Layout Decision Flow, Layout Patterns, Layout Selection by Use Case, Metric Styles (+5 more)

### Community 103 - "update.md"
Cohesion: 0.15
Nodes (12): Color Presets, Examples, Files Modified, Important, Overview, Skills Used, Step 1: Gather Brand Input, Step 2: Update Brand Guidelines (+4 more)

### Community 104 - "Logo Design Reference"
Cohesion: 0.15
Nodes (12): Available Styles, Color Psychology, Commands, Design Brief (Start Here), Detailed References, Generate Logo, Industry Defaults, Logo Design Reference (+4 more)

### Community 105 - "design-tokens-starter.json"
Cohesion: 0.15
Nodes (12): component, $type, $value, dark, semantic, $schema, $type, $value (+4 more)

### Community 106 - ".add_components"
Cohesion: 0.22
Nodes (7): main(), Add all available shadcn/ui components.          Args:             overwrite:, List installed components.          Returns:             Tuple of (success, m, Check if shadcn is initialized in project.          Returns:             True, Get list of already installed components.          Returns:             List, Read shadcn version from project package.json; fall back to a pinned default., Add shadcn/ui components.          Args:             components: List of comp

### Community 107 - "card"
Cohesion: 0.20
Nodes (12): $type, $value, bg, bg, padding, shadow, card, bg (+4 more)

### Community 108 - "ShadcnInstaller"
Cohesion: 0.17
Nodes (7): Handle shadcn/ui component installation., ShadcnInstaller, Test component addition with subprocess error., Test listing installed components when they exist., Test initialization with custom project root., Test checking for existing shadcn config., Test getting installed components without config.

### Community 109 - "_resolve_color_mode"
Cohesion: 0.21
Nodes (7): _query_wants_dark(), True when a styles.csv row describes itself as dark-first., True when the query explicitly asks for a dark theme., Resolve the mode the rest of the output has to agree with., _resolve_color_mode(), _style_is_dark_primary(), TestModeResolution

### Community 110 - "Core Visual Elements"
Cohesion: 0.18
Nodes (10): Color Palette, Colors, Core Visual Elements, Logo, Logo, Quick Checks, Typography, Typography (+2 more)

### Community 111 - "CIP Design Style Guide"
Cohesion: 0.18
Nodes (10): Bold Dynamic, CIP Design Style Guide, Classic Traditional, Color Psychology, Corporate Minimal, Fresh Modern, Luxury Premium, Modern Tech (+2 more)

### Community 112 - "primitive"
Cohesion: 0.20
Nodes (10): fast, normal, slow, $type, $value, $type, $value, duration (+2 more)

### Community 113 - "test_tailwind_config_gen.py"
Cohesion: 0.20
Nodes (7): Tests for tailwind_config_gen.py, Reduce a generated TS/JS config to a bare assignable object so it can be     ha, Regression guard for the missing-comma bug between the ``theme`` block and, The property preceding ``plugins`` must end with a comma (pure-Python         c, The emitted config parses as valid JS via ``node --check``., _strip_to_object(), TestGeneratedConfigIsValidJs

### Community 115 - "Brand"
Cohesion: 0.20
Nodes (9): Brand, Brand Sync Workflow, Quick Start, References, Routing, Scripts, Subcommands, Templates (+1 more)

### Community 116 - "Slide Strategies"
Cohesion: 0.20
Nodes (9): Common Structures, Duarte Sparkline Pattern, Matching Strategy to Context, Product Demo (6 slides), Sales Pitch (9 slides), Search Commands, Slide Strategies, Strategy Selection (+1 more)

### Community 117 - "generate.py"
Cohesion: 0.29
Nodes (9): enhance_prompt(), generate_batch(), generate_logo(), load_env(), main(), Enhance the logo prompt with style and industry modifiers, Generate a logo using Gemini models with image generation      Args:, Generate multiple logo variants with different styles (+1 more)

### Community 118 - "button"
Cohesion: 0.20
Nodes (10): fg, font-size, hover-bg, button, $type, $value, $type, $value (+2 more)

### Community 119 - "Slide Strategies"
Cohesion: 0.20
Nodes (9): Common Structures, Duarte Sparkline Pattern, Matching Strategy to Context, Product Demo (6 slides), Sales Pitch (9 slides), Search Commands, Slide Strategies, Strategy Selection (+1 more)

### Community 120 - "._base_config"
Cohesion: 0.22
Nodes (6): Path, Initialize generator.          Args:             typescript: If True, generat, Determine default output path., Create base configuration structure., Get default content paths for framework., Any

### Community 121 - "parse_decision_rules"
Cohesion: 0.27
Nodes (6): apply_decision_rules(), _object_without_duplicates(), parse_decision_rules(), Return deterministic mutations and an audit trail; never execute data., Parse the canonical condition -> action-array representation., _validate_action()

### Community 122 - "_run"
Cohesion: 0.28
Nodes (8): Path, Regression tests for validate-tokens.cjs.  The validator used to skip any line, A hardcoded hex on the same line as a var() token is still a violation., A line that references only tokens produces no false positives., _run(), test_flags_hardcoded_hex_sharing_line_with_token(), test_token_only_line_reports_no_violation(), CompletedProcess

### Community 123 - "_normalize"
Cohesion: 0.25
Nodes (9): _exact_match_diagnostic(), _legacy_successor_guidance(), _normalize(), Apply longest-first synonym substitution at token boundaries., Whether a stack query explicitly targets an older framework generation., Choose one coherent applicability generation for stack retrieval., Prefer the explicit successor row for a brand-new app on legacy-only stacks., _stack_query_requests_legacy() (+1 more)

### Community 124 - "input"
Cohesion: 0.29
Nodes (8): padding-x, input, $type, $value, focus-ring, padding-x, $type, $value

### Community 125 - "radius"
Cohesion: 0.24
Nodes (10): $type, $value, $type, $value, primitive, radius, shadow, full (+2 more)

### Community 126 - "._generate_javascript"
Cohesion: 0.29
Nodes (4): Generate TypeScript configuration., Generate JavaScript configuration., Format plugins array for config.          Validates each plugin name against a, Add indentation to JSON string.

### Community 128 - "Slides Reference"
Cohesion: 0.29
Nodes (6): Key Features, Knowledge Base, Slides Reference, Usage, When to Use, Workflow

### Community 129 - "HTML Slide Template"
Cohesion: 0.29
Nodes (6): Animation Classes, Background Images, Base Structure, Chart.js Integration, CSS Variables Reference, HTML Slide Template

### Community 130 - "HTML Slide Template"
Cohesion: 0.29
Nodes (6): Animation Classes, Background Images, Base Structure, Chart.js Integration, CSS Variables Reference, HTML Slide Template

### Community 131 - "_filter_anti_patterns_for_mode"
Cohesion: 0.43
Nodes (3): _filter_anti_patterns_for_mode(), Drop "avoid dark mode" advice once dark mode is the resolved answer., TestAntiPatternGating

### Community 133 - "shadow"
Cohesion: 0.60
Nodes (5): sm, sm, sm, $type, $value

### Community 134 - "Slides"
Cohesion: 0.33
Nodes (5): References (Knowledge Base), Routing, Slides, Subcommands, When to Use

### Community 135 - "_row_identities"
Cohesion: 0.33
Nodes (6): _exact_row_identity(), Return non-empty public identities from ordinary and alias fields., Resolve an explicit style identity without opening generic variant ranking., Return one row whose stable public identity exactly matches the query., _row_identities(), _style_identity()

### Community 136 - "Brand Guidelines Template"
Cohesion: 0.40
Nodes (4): Brand Guidelines Template, Document Structure, Extractable Fields, Usage

### Community 137 - "$type"
Cohesion: 0.67
Nodes (4): padding-y, padding-y, $type, $value

### Community 138 - "radius"
Cohesion: 0.60
Nodes (5): radius, radius, radius, $type, $value

### Community 139 - "lg"
Cohesion: 0.60
Nodes (5): lg, $type, $value, lg, lg

### Community 140 - "padding-y"
Cohesion: 0.13
Nodes (15): expo-asset, expo-constants, @expo-google-fonts/hind-siliguri, lucide-react-native, dependencies, expo-asset, expo-constants, @expo-google-fonts/hind-siliguri (+7 more)

### Community 141 - "xl"
Cohesion: 0.14
Nodes (22): lessonQuizzes, outputPath, seedData, AI_TUTOR_CONFIG, ASTRONAUT_MENTOR_SYSTEM_PROMPT, MOCK_QUIZZES, AITutorConfig, CurriculumSeedData (+14 more)

### Community 142 - "md"
Cohesion: 0.18
Nodes (11): @expo/ngrok, devDependencies, @expo/ngrok, tsx, @types/node, @types/react, typescript, tsx (+3 more)

### Community 143 - "none"
Cohesion: 0.22
Nodes (11): AITutorChatScreen(), ChatMessage, styles, OfflineQAItem, findOfflineAnswer(), getAllOfflineQuestions(), getOfflineQuestionsByCategory(), ITEMS (+3 more)

### Community 146 - "destructive"
Cohesion: 0.67
Nodes (3): destructive, $type, $value

### Community 147 - "destructive-foreground"
Cohesion: 0.60
Nodes (5): $type, $value, border, border, border

### Community 148 - "muted"
Cohesion: 0.67
Nodes (4): xl, xl, $type, $value

### Community 149 - "primary-foreground"
Cohesion: 0.67
Nodes (3): destructive-foreground, $type, $value

### Community 150 - "ring"
Cohesion: 0.67
Nodes (3): ring, $type, $value

### Community 151 - "muted"
Cohesion: 0.67
Nodes (3): muted, $type, $value

### Community 177 - "useAppStore"
Cohesion: 0.11
Nodes (26): SplashScreen(), styles, { width: SCREEN_WIDTH, height: SCREEN_HEIGHT }, COSMIC_FACTS, GLOW_SHADOW, styles, styles, ProfileScreen() (+18 more)

### Community 178 - "colors.ts"
Cohesion: 0.33
Nodes (5): 1. Persona Overview, 2. Core Pedagogical Rules, 3. System Prompt (Ready for API Injection), 4. Example In-Flight Interaction, AI Tutor System Prompt & Persona Specification — Mohakash Jr

### Community 179 - "[id].tsx"
Cohesion: 0.12
Nodes (18): BENGALI_DIGITS, OPTION_PREFIXES, QuizScreen(), styles, toBengaliNumber(), AstronautAvatar(), AstronautAvatarProps, styles (+10 more)

### Community 180 - "DoubleBezelCard.tsx"
Cohesion: 0.67
Nodes (3): primary-foreground, $type, $value

### Community 181 - "onboarding.tsx"
Cohesion: 0.24
Nodes (10): OnboardingScreen(), PsychometricOption, PsychometricQuestion, QUESTIONS, styles, SpaceChoiceBadge(), SpaceChoiceBadgeProps, styles (+2 more)

### Community 182 - "MascotFeedbackSlot.tsx"
Cohesion: 0.18
Nodes (10): plugins, RootLayout(), styles, expo-asset, expo-font, CLUSTER_A, CLUSTER_B, CosmicBackground() (+2 more)

### Community 183 - "secondary-foreground"
Cohesion: 0.67
Nodes (3): secondary-foreground, $type, $value

### Community 184 - "md"
Cohesion: 0.67
Nodes (4): $type, $value, md, md

### Community 186 - "expo-constants"
Cohesion: 0.15
Nodes (12): 1. Executive Summary, 2.1 Embedded Bengali Fonts, 2.2 Conjunct & Diacritic Stress Testing, 2. Typography & Rendering Verification, 3. Full Airplane Mode Walkthrough, 4. Compiled Bug & Remediation List (Hour 44 Review), 5. Visual Asset Inventory Supplied in `assets/`, Device Testing, Typography & Bug Report — Mohakash Jr (+4 more)

### Community 192 - "react-native"
Cohesion: 0.40
Nodes (4): main, name, private, version

### Community 193 - "react-native-svg"
Cohesion: 0.67
Nodes (4): $type, $value, default, default

## Knowledge Gaps
- **1107 isolated node(s):** `$schema`, `$value`, `$type`, `$value`, `$type` (+1102 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **54 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `DesignSystemGenerator` connect `DesignSystemGenerator` to `.generate`, `_filter_anti_patterns_for_mode`, `read_rows`, `search`, `design_system.py`, `_resolve_color_mode`, `_select_palette_for_mode`, `test_core.py`, `BM25`, `detect_domain`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `search()` connect `search` to `.generate`, `/graphify`, `_row_identities`, `design_system.py`, `search_stack`, `TestStyleTaxonomy`, `core.py`, `_normalize`, `test_core.py`, `BM25`, `detect_domain`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `BM25` connect `BM25` to `search`, `DesignSystemGenerator`, `design_system.py`, `test_core.py`, `BM25`, `detect_domain`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Are the 36 inferred relationships involving `TailwindConfigGenerator` (e.g. with `TestGeneratedConfigIsValidJs` and `.test_node_check_parses_generated_config()`) actually correct?**
  _`TailwindConfigGenerator` has 36 INFERRED edges - model-reasoned connections that need verification._
- **Are the 30 inferred relationships involving `DesignSystemGenerator` (e.g. with `TestBm25CoreBehavior` and `TestDiagnosticsContracts`) actually correct?**
  _`DesignSystemGenerator` has 30 INFERRED edges - model-reasoned connections that need verification._
- **Are the 22 inferred relationships involving `search()` (e.g. with `.generate()` and `._multi_domain_search()`) actually correct?**
  _`search()` has 22 INFERRED edges - model-reasoned connections that need verification._
- **Are the 23 inferred relationships involving `ShadcnInstaller` (e.g. with `TestShadcnInstaller` and `.test_add_all_components_dry_run()`) actually correct?**
  _`ShadcnInstaller` has 23 INFERRED edges - model-reasoned connections that need verification._