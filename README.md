# Ask Itay — AI Portfolio

> **Don't read my CV. Ask it.**

An AI-powered professional interview for [Itay Haephrati](https://itaycode.com/). Recruiters, hiring managers, founders, designers, and developers can ask questions about Itay — or paste a complete job description — and get answers grounded exclusively in his verified professional history.

Built with Next.js (App Router), TypeScript, Tailwind CSS 4, Framer Motion, and the Anthropic API with streaming responses.

## How it works

```
content/*.md  ──►  lib/knowledge.ts (section split + keyword retrieval)
                        │
POST /api/ask ──► retrieve relevant sections ──► Claude (streaming)
                        │
                   metadata line (sources, related projects, follow-ups)
                        + streamed markdown answer
```

- **Knowledge base** — curated markdown in `content/` plus auto-generated files in `content/generated/`. Every section carries its source URL and title in frontmatter.
- **Retrieval** — `lib/knowledge.ts` splits files on `##` headings and scores sections by term overlap with the question (tags > headings > body). Only the relevant, verified context is sent to the model. The retrieval layer can later be swapped for vector search without touching the UI.
- **AI** — `app/api/ask/route.ts` streams Claude's answer. The system prompt forbids invented facts, treats scraped content and pasted job descriptions as untrusted data, and answers "I don't have verified information about that yet…" when the context doesn't cover a question.
- **Mock mode** — with no `ANTHROPIC_API_KEY` (or `MOCK_AI=true`), the API streams a canned answer built from the retrieved context, so the whole UI works without a key.

## Run locally

```bash
npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000
```

No key? It still works — in mock mode.

## Configure the Anthropic API

In `.env.local` (or Vercel project settings):

| Variable | Purpose | Default |
|---|---|---|
| `ANTHROPIC_API_KEY` | Enables real AI answers | _(empty → mock mode)_ |
| `ANTHROPIC_MODEL` | Claude model id | `claude-opus-4-8` |
| `MOCK_AI` | Force mock answers | `false` |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO/OG/sitemap | `https://ask-itay.vercel.app` |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | Privacy-safe product events | `false` |

The API route validates input with Zod, enforces character limits (2,000 for questions / 8,000 for job descriptions), rate-limits by IP (20 requests / 5 min), keeps the key server-side, and never echoes the system prompt.

## Update the knowledge base

### Re-sync from itaycode.com

```bash
npm run sync-profile
```

Crawls the pages listed in `content/sources.json`, strips navigation/duplicate markup, and writes normalized markdown to `content/generated/` (one file per page, source URL preserved). **Curated files are never overwritten.** Note: itaycode.com is partially JS-rendered — pages with too little static text are skipped with a warning; the curated files in `content/` remain the authoritative fallback.

### Add or correct information manually

Edit the curated files — they win over generated content because they're richer and tagged:

```
content/
  profile.md            who Itay is, differentiators, availability
  experience.md         career timeline, one ## section per employer
  skills.md             stack, design, systems, a11y, motion, tools
  leadership.md         design-system leadership, teaching, remote work
  ai-and-automation.md  AI + n8n work
  projects/*.md         one file per project (frontmatter = card data)
  sources.json          crawl allowlist + source registry
```

Rules of thumb:

- Split content with `##` headings — each heading becomes a retrievable section.
- Add relevant lowercase `tags:` in frontmatter — tags get the highest retrieval weight.
- Keep `source:`/`sourceTitle:` accurate — they're shown as source links under answers.
- Never write anything unverified; the AI will repeat whatever is in these files.

### Add a project

Create `content/projects/<slug>.md` with the same frontmatter shape as the existing files (`title`, `slug`, `source`, `liveUrl`, `role`, `disciplines`, `technologies`, `duration`, `location`, `tags`, `summary`) plus a `## <Name>` body section. It automatically appears as a project card and becomes retrievable evidence.

### Add the CV

1. Drop the PDF into `content/cv/` (e.g. `itay-haephrati-cv.pdf`).
2. Run `npm run sync-profile` — the text is extracted into the knowledge base and the file is copied to `public/cv.pdf`, which activates the "Download CV" buttons. Until then they fall back to LinkedIn.

## Contact values

All contact info (email, LinkedIn, portfolio URL, signal bar) lives in one file: [`lib/site-config.ts`](lib/site-config.ts).

## Quality checks

```bash
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
npm run build       # production build
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new) (framework auto-detected: Next.js).
3. Add the environment variables from `.env.example` — at minimum `ANTHROPIC_API_KEY` and `NEXT_PUBLIC_SITE_URL` (set to your production domain).
4. Deploy. `sitemap.xml`, `robots.txt`, Open Graph metadata, and JSON-LD Person schema are generated automatically.

Or with the CLI: `npx vercel` from the project root.

## Analytics

`lib/analytics.ts` defines privacy-safe product events (question submitted, JD mode opened, project viewed, contact/CV clicked). It's disabled until `NEXT_PUBLIC_ANALYTICS_ENABLED=true` and a provider call is wired in `track()`. Recruiter question text is never stored or tracked.
