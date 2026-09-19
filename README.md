# Learn Aid

A free, browser-only worksheet generator for the **Victorian Curriculum**, Grades 1–12. Built for students, parents and teachers who want quick, random practice worksheets without signing up for anything.

- Pick a **subject** (Maths or English) and a **grade** (1–12)
- Choose which **topics** to include
- Set how many **questions** you want
- Generate a worksheet, preview it, then **download a PDF** with a matching answer key on the last page

Everything runs client-side — no backend, no accounts, no data collection.

## Coverage

**Maths**, banded by grade:

| Grades | Topics |
|---|---|
| 1–2 | Addition/subtraction, skip counting, number sequences, shapes |
| 3–4 | Times tables, division facts, simple fractions, time, money, perimeter |
| 5–6 | Multi-digit multiplication/division, fractions, decimals, percentages, area, order of operations, negative numbers |
| 7–8 | Integers, algebra (like terms, one-step equations), ratio, percentage change, angles, probability |
| 9–10 | Two-step/simultaneous equations, factoring quadratics, Pythagoras, trigonometry, index laws, gradients |
| 11–12 | Differentiation (power rule), log laws, compound interest, sequences, exact trig values, the discriminant |

**English**, banded by grade:

| Grades | Topics |
|---|---|
| 1–2 | Opposites, plurals, rhyming words, punctuation, nouns/verbs |
| 3–4 | Synonyms, antonyms, contractions, punctuation, parts of speech |
| 5–6 | Verb tenses, figurative language, homophones, prefixes |
| 7–8 | Active/passive voice, clauses, persuasive techniques, vocabulary in context |
| 9–10 | Grammar editing, literary devices, word roots, run-on sentences |
| 11–12 | Advanced vocabulary, rhetorical techniques, grammar editing, text purpose |

Questions are procedurally generated (maths) or randomly sampled from curated item banks (English), so each worksheet is different.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
```

## Deployment

Pushing to `main` builds the app and deploys it to **GitHub Pages** automatically via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Enable Pages once in the repo settings (Settings → Pages → Source: GitHub Actions), and it publishes on every push.
