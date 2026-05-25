# Notebook — To Do

A collaborative task manager with a warm, notebook-style design. Organize tasks by book, set due dates and priorities, and get AI-powered help deciding where to start.

**Live app:** https://ramin-todo-helper.vercel.app

## Features
- Tasks organized into Books (Personal, Work, or custom)
- Due dates, priority stars, and notes per task
- Views: All Tasks, High Priority, Today, Upcoming, Completed
- Tasks grouped by day, sorted by priority within each day
- Voice input — speak a task and AI fills in the details
- "Where should I start?" — AI recommends the single best task to focus on

## Tech
Single-file vanilla JS app (`index.html`) with no build step. Data stored in browser localStorage. AI features powered by Claude (Anthropic) via Vercel serverless functions.

## Contributing

### First-time setup
1. Clone the repo: `git clone https://github.com/jefflash/notebook-todo.git`
2. Install Vercel CLI: `npm i -g vercel`
3. Link to the project: `vercel link`
4. Pull environment variables: `vercel env pull .env.local`

### Running locally
```
vercel dev
```
Opens at `http://localhost:3000`. AI features (voice input, suggestions) work locally with this command.

### Deploying
```
git add .
git commit -m "description of change"
git push
```
Vercel auto-deploys within ~60 seconds of every push to `main`.

### Environment variables
`ANTHROPIC_API_KEY` — required for AI features. Set in the Vercel dashboard under Project Settings → Environment Variables.
