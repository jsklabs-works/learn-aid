# Learn Aid

A free, browser-only worksheet and online-test generator, Grades 1–12. Built for students, parents and teachers who want quick, random practice without signing up for anything.

- Pick a **syllabus** (Victorian Curriculum or Cambridge International), **subject** (Maths or English), **grade** (1–12) and **difficulty** (Standard or Advanced)
- Choose which **topics** to include and how many **questions** you want (up to 50)
- **Worksheet mode**: generate, preview (with diagrams for geometry questions), then **download a PDF** with a matching answer key on the last page
- **Online test mode**: answer questions right in the browser (multiple choice or free text), submit, and get an instant score with a per-question breakdown

Everything runs client-side — no backend, no accounts, no data collection.

## Coverage

**Maths**, banded by grade (Standard):

| Grades | Topics |
|---|---|
| 1–2 | Addition/subtraction, skip counting, number sequences, shapes |
| 3–4 | Times tables, division facts, simple fractions, time, money, perimeter |
| 5–6 | Multi-digit multiplication/division, fractions, decimals, percentages, area, order of operations, negative numbers |
| 7–8 | Integers, algebra (like terms, one-step equations), ratio, percentage change, angles, probability |
| 9–10 | Two-step/simultaneous equations, factoring quadratics, Pythagoras, trigonometry, index laws, gradients |
| 11–12 | Differentiation (power rule), log laws, compound interest, sequences, exact trig values, the discriminant |

**English**, banded by grade (Standard):

| Grades | Topics |
|---|---|
| 1–2 | Opposites, plurals, rhyming words, punctuation, nouns/verbs |
| 3–4 | Synonyms, antonyms, contractions, punctuation, parts of speech |
| 5–6 | Verb tenses, figurative language, homophones, prefixes |
| 7–8 | Active/passive voice, clauses, persuasive techniques, vocabulary in context |
| 9–10 | Grammar editing, literary devices, word roots, run-on sentences |
| 11–12 | Advanced vocabulary, rhetorical techniques, grammar editing, text purpose |

Questions are procedurally generated (maths) or randomly sampled from curated item banks (English), so each worksheet is different. Perimeter, area, angle, and Pythagoras/trigonometry questions include a labelled diagram, both on screen and in the downloaded PDF.

### Difficulty and syllabus

- **Advanced** pulls in a taste of the *next* grade band's topics (e.g. Grade 5–6 Advanced adds some Grade 7–8 algebra/ratio topics); the top band (11–12) gets genuinely new extension topics instead (e.g. the quadratic formula, integration, the chain rule; idioms and tone analysis for English).
- **Cambridge International** shares the same core skill topics as the Victorian Curriculum (arithmetic, algebra, grammar, etc. are common ground) and adds a handful of Cambridge-flavoured topics at Grade 9+ (standard form, bearings, sets/Venn diagrams; formal/informal register, inference). It is not a full parallel curriculum — see [`src/curriculum/maths.ts`](src/curriculum/maths.ts) and [`src/curriculum/english.ts`](src/curriculum/english.ts) for exactly what's added.

### Online test scoring

Free-text answers are graded with a lenient, case-insensitive string match (whitespace/punctuation-tolerant) — fine for numeric and short-phrase answers, but sentence-correction style answers need an exact match, so the results screen always shows your answer next to the correct one for transparency. There's no backend, so scores aren't saved anywhere — the test lives for the current browser session only.

### About the English item banks

The repo is public, so the static English question/answer banks in [`src/curriculum/english.ts`](src/curriculum/english.ts) are stored as base64 blobs (see [`src/curriculum/codec.ts`](src/curriculum/codec.ts)) rather than plain arrays, so an answer isn't sitting as literal, greppable text next to its question in the source or the shipped JS. This is **not real security** — anyone who reads `codec.ts` can decode it in one line, and it does nothing to stop someone inspecting a live online test's React state in dev tools. Properly hiding answers from a determined user would need a backend to check answers server-side, which this project deliberately doesn't have. Maths answers are computed live from random numbers, so there's nothing to encode there.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
```

## Deployment

Pushing to `main` builds the app and deploys it to **GitHub Pages** automatically via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Enable Pages once in the repo settings (Settings → Pages → Source: GitHub Actions), and it publishes on every push.
