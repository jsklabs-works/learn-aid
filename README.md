# Learn Aid

A free, browser-only worksheet and online-test generator, Grades 1–12. Built for students, parents and teachers who want quick, random practice without signing up for anything.

- Pick a **syllabus** (Victorian Curriculum or Cambridge International), **subject** (Maths, English, General knowledge, or a Grade 9+ elective: Accounting, Business Studies, Economics, Biology, Chemistry, Physics), **grade** (1–12) and **difficulty** (Standard or Advanced)
- Choose which **topics** to include and how many **questions** you want (up to 50)
- **Worksheet mode**: generate, preview (with diagrams for geometry questions), then **download a PDF** with a matching answer key on the last page
- **Online test mode**: answer questions right in the browser (multiple choice or free text), submit, and get an instant score with a per-question breakdown. Wrong answers show the correct answer and a short explanation or worked steps (the same explanations appear under "Show answers" and in the PDF answer key)
- **Calculator** (Grade 10 and above, any subject): a floating scientific calculator with brackets, powers, roots, trig (degrees or radians), logs, factorials, percentages and an Ans key. It works from the on-screen keys or the keyboard, and uses a small built-in expression parser (no `eval`).
- **Share a test**: after generating a worksheet or test, click *Share as online test* (or *Share this test*) to get a link. Everyone who opens it gets the same questions in the same order as an online test, and you can choose whether they see the correct answers afterwards or just their score. The link only holds the settings and a random seed (the questions are rebuilt from it in the browser), so nothing is stored on a server. Links are tied to the app version: when question content changes, bump `SHARE_VERSION` in [`src/share.ts`](src/share.ts) so older links show a warning.
- Answers are checked leniently: units are optional (`45`, `45°` and `45 degrees` all count), unit spellings are flexible (`m²`, `sq m`, `square metres`) and coordinates like `(3,4)` and `(3, 4)` match
- No question is ever repeated within one worksheet or test

Everything runs client-side — no backend, no accounts, no data collection.

## Coverage

**Maths**, banded by grade (Standard):

| Grades | Topics |
|---|---|
| 1–2 | Addition/subtraction, skip counting, number sequences, shapes, comparing numbers, tens and ones, doubling/halving, missing numbers, odd/even |
| 3–4 | Times tables, division facts, simple fractions, time, money, perimeter, place value, rounding, equivalent fractions, unit conversion, elapsed time |
| 5–6 | Multi-digit multiplication/division, fractions, decimals, percentages, area, order of operations, negative numbers, HCF/LCM, prime numbers, mean/median/mode, fractions of an amount, volume, the Cartesian plane (Grade 6) |
| 7–8 | Integers, algebra (like terms, one-step equations, expanding brackets, x on both sides, substitution), ratio, percentage change, angles, polygons, probability, circles, simple interest, mean/median/mode |
| 9–10 | Two-step/simultaneous equations, factoring and expanding quadratics, Pythagoras, trigonometry, index laws, gradients, cylinders, reverse percentages, probability of two events |
| 11–12 | Differentiation (power rule), stationary points, log laws, compound interest, sequences and series, exact trig values, the discriminant, permutations and combinations, vectors |

**English**, banded by grade (Standard):

| Grades | Topics |
|---|---|
| 1–2 | Opposites, plurals, rhyming words, punctuation, nouns/verbs, compound words, types of sentences, spelling |
| 3–4 | Synonyms, antonyms, contractions, punctuation, parts of speech, sentence types, tricky spellings, suffixes, subject-verb agreement |
| 5–6 | Verb tenses, figurative language, homophones, prefixes, suffixes, agreement, apostrophes for belonging, simple/compound/complex sentences |
| 7–8 | Active/passive voice, clauses, persuasive techniques, vocabulary in context, commonly confused words, colons and semicolons, point of view |
| 9–10 | Grammar editing, literary devices, word roots, run-on sentences, connotation, ethos/pathos/logos |
| 11–12 | Advanced vocabulary, rhetorical techniques, grammar editing, text purpose, connotation, ethos/pathos/logos, parallel structure, concise writing |

**General knowledge** (Grade 6 and up) is a set of multiple-choice quizzes rather than curriculum drills:

| Grades | Topics |
|---|---|
| 6–8 | World history, Australian history, geography, science facts, inventors and discoveries, fun true-or-false |
| 9–12 | Modern world history, government and civics, current topics, world geography, arts and books, fun brain teasers |

Advanced adds the next band's topics (and, at Grade 9–12, political ideas and great scientists). The "current topics" quiz covers evergreen themes (climate, technology and AI literacy, media literacy, economics basics). It does not track the news, so it never goes out of date.

Every Maths grade band and both Accounting bands include a **Word problems** topic: short real-world stories (shopping, time, ratios, savings, ladders, depreciation, cash budgets and so on) with randomised names and numbers, which you can tick on or off like any other topic.

Questions are procedurally generated (maths) or randomly sampled from curated item banks (English), so each worksheet is different. Perimeter, area, angle, and Pythagoras/trigonometry questions include a labelled diagram, both on screen and in the downloaded PDF.

**Grade 9+ electives** (only offered from Grade 9; picking one from a lower grade jumps the grade up to 9):

| Subject | Grades 9–10 | Grades 11–12 |
|---|---|---|
| Accounting | Accounting equation, classifying accounts, debits/credits, net profit, straight-line depreciation, trial balance check | Reducing-balance depreciation, profit margins, current ratio, doubtful debts, FIFO inventory, break-even, cash flow classification |
| Business Studies | Business ownership, marketing mix (4Ps), SWOT, objectives, markup pricing, market share | Stakeholders, business functions, leadership styles, return on investment, staff turnover, labour productivity |
| Economics | Supply and demand, economic systems, factors of production, opportunity cost, inflation rate | Price elasticity of demand, economic growth, unemployment rate, fiscal vs monetary policy, market structures |
| Biology | Cell structures, levels of organisation, body systems, photosynthesis/respiration, Punnett squares, energy transfer in food chains | DNA replication/transcription/translation, base pairing, dihybrid crosses, natural selection, feedback loops, enzymes, magnification, SA:V ratio |
| Chemistry | Atomic structure, periodic table groups, balancing equations, pH, neutralisation salts, moles and mass, physical vs chemical change | Stoichiometry, concentration, Le Chatelier, oxidation numbers, organic families, alkanes, heat energy |
| Physics | Speed, F = ma, Ohm's law, energy transformations, wave equation, density, work and power | Kinematics, momentum and impulse, kinetic/potential energy, series/parallel resistors, projectile motion, wave behaviour, half-life |

Advanced adds, at Grade 11–12: Ansoff growth strategies, market segmentation and sales growth (Business Studies); the multiplier, real vs nominal GDP and comparative advantage (Economics); Hardy-Weinberg, cell process locations and X-linked inheritance (Biology); dilution, limiting reagents and pH of strong acids/bases (Chemistry); circular motion, electrical power and lens calculations (Physics). Cambridge adds VAT and statement terminology (Accounting); sectors of industry, fixed/variable costs and average cost (Business Studies); exchange rates, direct/indirect taxes and trade balance (Economics); characteristics of living organisms and osmosis (Biology); gas tests, separation techniques and relative formula mass (Chemistry); pressure, thermal transfer and the electromagnetic spectrum (Physics).

All electives are registered in [`src/curriculum/subjects.ts`](src/curriculum/subjects.ts). The sciences are text-only for now; diagrams (circuits, cells, apparatus) are a possible future addition.

### Difficulty and syllabus

- **Advanced** pulls in a taste of the *next* grade band's topics (e.g. Grade 5–6 Advanced adds some Grade 7–8 algebra/ratio topics); the top band (11–12) gets genuinely new extension topics instead (e.g. the quadratic formula, integration, the chain rule; idioms and tone analysis for English).
- **Cambridge International** shares the same core skill topics as the Victorian Curriculum (arithmetic, algebra, grammar, etc. are common ground) and adds a handful of Cambridge-flavoured topics at Grade 9+ (standard form, bearings, sets/Venn diagrams; formal/informal register, inference; VAT and financial-statement terminology for Accounting). It is not a full parallel curriculum — see [`src/curriculum/maths.ts`](src/curriculum/maths.ts) and [`src/curriculum/english.ts`](src/curriculum/english.ts) for exactly what's added.

### Online test scoring

Free-text answers are graded with a lenient, case-insensitive string match (whitespace/punctuation-tolerant) — fine for numeric and short-phrase answers, but sentence-correction style answers need an exact match, so the results screen always shows your answer next to the correct one for transparency. There's no backend, so scores aren't saved anywhere — the test lives for the current browser session only.

### About the static item banks

The repo is public, so the static question/answer banks (English in [`src/curriculum/english.ts`](src/curriculum/english.ts), plus the classification-style banks in [`accounting.ts`](src/curriculum/accounting.ts), [`business.ts`](src/curriculum/business.ts) and [`economics.ts`](src/curriculum/economics.ts) and the three science modules) are stored as base64 blobs (see [`src/curriculum/codec.ts`](src/curriculum/codec.ts)) rather than plain arrays, so an answer isn't sitting as literal, greppable text next to its question in the source or the shipped JS. This is **not real security** — anyone who reads `codec.ts` can decode it in one line, and it does nothing to stop someone inspecting a live online test's React state in dev tools. Properly hiding answers from a determined user would need a backend to check answers server-side, which this project deliberately doesn't have. Maths answers are computed live from random numbers, so there's nothing to encode there.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
```

## Deployment

Pushing to `main` builds the app and deploys it to **GitHub Pages** automatically via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Enable Pages once in the repo settings (Settings → Pages → Source: GitHub Actions), and it publishes on every push.

## Licence

Copyright (c) 2026 jsklabs-works. All rights reserved. The website may be used for personal, educational and classroom purposes; copying, hosting or redistributing the source code or question content needs written permission. See [`LICENSE`](LICENSE).
