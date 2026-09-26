# Feature Specifications — Mohakash Jr

Detailed specifications for core features. To be updated as features are scoped and implemented.

## 1. Bangla Lessons
- Levels: Cadet, Astronaut, Mission Specialist, Commander.
- **Cadet Lessons (4 completed)**:
  1. `lesson-1`: চাঁদের বুকে প্রথম পদক্ষেপ (Apollo 11, Moon landing, vacuum preserving footprints, 1/6th gravity).
  2. `lesson-2`: মহাকাশে ওজনহীনতা ও মহাকর্ষ (Microgravity on ISS, free fall, surface tension floating water spheres).
  3. `lesson-3`: রকেটের অগ্নিকুণ্ড: মহাকাশে উড্ডয়ন (Newton's 3rd Law, balloon analogy, escape velocity 40,000 km/h).
  4. `lesson-4`: চাঁদের গোপন বরফ ও পানির সন্ধান (Artemis missions, South Pole dark craters, water to rocket fuel).
- **Astronaut Lessons (4 completed)**:
  5. `lesson-5`: মহাকাশচারীর জীবন্ত ঢাল: স্পেসস্যুট (EMU space suit, thermal insulation, gold visor, liquid cooling).
  6. `lesson-6`: আন্তর্জাতিক মহাকাশ স্টেশন (ISS) (400km orbit, 27,600 km/h, 16 sunrises/sunsets a day, 98% water recycling).
  7. `lesson-7`: মঙ্গলের বুকে রোবট বিজ্ঞানী: কিউরিওসিটি ও পারসিভিয়ারেন্স (Jezero crater, MOXIE oxygen generator, Ingenuity helicopter).
  8. `lesson-8`: জেমস ওয়েব মহাকাশ দূরবীন: মহাবিশ্বের প্রাচীনতম চোখ (JWST at L2 1.5M km, infrared cosmology, 18 gold hexagonal mirrors).
- Structure: Storybook chunks (`paragraph`, `analogy`, `nasa_fact`, `did_you_know`), estimated read times, XP awards, and verified science.nasa.gov citations.

## 2. Quiz Engine & Progression
- **Placement Challenge Quiz (5 questions)**: Evaluates student space baseline across Solar System, gravity, atmosphere protection, rocket propulsion, and Mars iron oxide.
- **Per-Lesson Quizzes (24 questions)**: Exactly 3 unique questions for every lesson with 4 options each, detailed Bengali explanations, and helpful hints.
- XP calculation and rank progression (Cadet → Astronaut → Mission Specialist → Commander).

## 3. Playable Missions
- Interactive scenarios (e.g., Moon landing site selection & cargo packing).
- Scored debrief based on decisions.

## 4. AI Tutor
- **Online Mode ("Captain Rover" Persona)**:
  - Experienced astronaut mentor & mission commander persona ("ক্যাপ্টেন রোভার").
  - Speaks child-friendly standard Bangla with everyday Bangladeshi analogies (নৌকার দাঁড়, নাগরদোলা, থার্মাস ফ্লাস্ক, কুপি বাতি).
  - 4-part structured response: Warm Affirmation ➔ Core Science ➔ NASA Fact ➔ Curiosity Follow-up.
  - Strict kid safety guardrails & STEM topic boundaries.
- **Offline Mode (`offline_tutor.json` & `offlineTutorService.ts`)**:
  - 30 curated high-interest space Q&As in simple Bangla with rich keyword sets.
  - Fast client-side keyword matching engine with stop word filtering and suggested question chips.

## 5. Offline-First Sync
- Local SQLite storage via `@op-engineering/op-sqlite`.
- Embedded replica sync to Turso when online.
- Starter seed bundled in `src/content/seed.json` for first-launch population.

