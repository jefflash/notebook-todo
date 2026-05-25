# Notebook — To Do

A collaborative task manager for Jeff Lash and collaborators, built with a warm notebook aesthetic. Deployed at Vercel project `ramin-todo-helper`.

## Who you're working with
Jeff is a non-technical product manager. Explain technical trade-offs in plain language. Avoid jargon. He's learning git/GitHub workflows as he goes — brief explanations of *why* git steps matter are welcome.

## Stack
- **Single file app**: all UI lives in `index.html` — HTML, CSS, and JavaScript together. No framework, no build step, no npm.
- **Storage**: browser `localStorage` (key: `notebook_todo_v3`). No database.
- **API routes**: `/api/*.js` — Node.js serverless functions deployed on Vercel. Currently:
  - `parse-voice.js` — converts voice transcript to structured task data via Claude API
  - `suggest-task.js` — recommends which task to start with ("Where should I start?" feature)
- **Fonts**: Lora (serif, body) + DM Mono (monospace, labels/UI chrome) via Google Fonts
- **Icons**: Tabler Icons webfont
- **AI**: Anthropic Claude Haiku via direct API calls. Key stored as `ANTHROPIC_API_KEY` Vercel env var.
- **Hosting**: Vercel. Auto-deploys on every push to `main` on GitHub (repo: `jefflash/notebook-todo`).

## Architecture
The app is a single render loop: `state` + `ui` objects → `render()` → innerHTML. No virtual DOM, no reactivity library. Every user action updates state/ui then calls `render()`.

- `state` — persisted to localStorage (tasks, books, active nav, etc.)
- `ui` — ephemeral UI state (edit mode, open pickers, suggestion panel, etc.)
- `render()` → `renderSidebar()` + `renderMain()` → innerHTML strings

All date comparisons use local time via `localDateStr(d)` / `todayStr()` / `tomorrowStr()` — NOT `toISOString()` which returns UTC and causes off-by-one day bugs for US timezones.

## Design system
Warm, paper-like aesthetic. Do not deviate from this.

```
--bg: #F7F5F0          (warm off-white background)
--surface: #FFFFFF     (card/form surfaces)
--border: #E2DDD5      (light borders)
--border-strong: #C8C2B8
--text: #2A2520        (near-black)
--text-secondary: #7A746C
--text-faint: #B0AAA2
--danger: #C0392B
--star-filled: #E8A838 (amber stars)
```

Suggestion panel uses warm yellow: `background: #FFFBF0`, `border: #E8C84A`.

## Current features
- **Books** — tasks belong to a Book (Personal, Work, or user-created), organized under categories
- **Left nav** — Views (All Tasks, High Priority, Today, Upcoming, Completed) + Filters (categories/books)
- **Due dates** — date picker per task; date-aware views
- **Priority** — 1–3 star rating; "High Priority" view shows 3-star only
- **Day grouping** — All Tasks, High Priority, Upcoming views group tasks by day with section headers; sorted by priority within each day
- **Today view** — shows tasks due today + overdue (anything with `dueDate <= today`)
- **Voice input** — mic button → Web Speech API → Claude API parses transcript into task fields
- **"Where should I start?"** — button sends full task list to Claude, returns single recommendation with reasoning; persists across view changes until dismissed
- **Highlights** — color-coded task backgrounds (yellow, rose, blue, green, purple)
- **Inline editing** — click pencil icon to edit task text, notes, due date, priority

## Conventions
- All new CSS goes in the `<style>` block, grouped by component with `/* ── Label ── */` headers
- All new JS goes in the `<script>` block
- Render functions return HTML strings; never manipulate DOM directly
- `escHtml()` must be used on all user-supplied content inserted into HTML strings
- API routes follow the pattern in `parse-voice.js` — check for method, validate input, call Anthropic, return JSON
- Do not add npm packages, build tools, or frameworks. Keep it one file.
- Do not add comments explaining what code does — only add comments for non-obvious *why*

## Deployment workflow
Edit → commit (`git add`, `git commit`) → `git push` → Vercel auto-deploys within ~60 seconds.
To test locally: `npx serve .` runs the static UI but API routes won't work (they need Vercel). Use `vercel dev` to run API routes locally.
