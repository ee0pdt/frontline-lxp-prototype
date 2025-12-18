# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Frontline LXP Prototype is a mobile-first React application for frontline worker learning management. It features two modes:
- **Learner mode**: View mandatory training, track daily XP goals, manage streaks
- **Manager mode**: View team compliance stats, identify team members needing attention, send reminders

The app is designed to be embedded in a Curatr LXP Content Box, receiving configuration via `window.FRONTLINE_CONFIG` or legacy window variables.

## Commands

```bash
npm run dev      # Start development server (Vite)
npm run build    # Type-check with tsc, then build with Vite
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture

### Tech Stack
- React 19 with TypeScript
- Zustand for state management (with persistence middleware)
- Tailwind CSS v4 (via @tailwindcss/vite plugin)
- Vite 7 for build tooling

### Key Files

- `src/config.ts` - Runtime configuration from Content Box injection or dev defaults. Defines `FRONTLINE_CONFIG` interface and `isDev` flag.
- `src/store.ts` - Zustand store with all app state (user, mode, streak, courses, team data). Persists streak/dailyGoal/mode to localStorage.
- `src/api/client.ts` - API client class with mock data for development (`isDev` returns mocks). Transform functions map API responses to TypeScript interfaces.

### Build Output

Vite is configured to output predictable filenames for Content Box embedding:
- `frontline-app.js` - Main bundle
- `frontline-app.css` - Styles

Base path is `/frontline-lxp-prototype/` for GitHub Pages deployment.

### Styling

Uses Duolingo-inspired design system defined in `src/index.css`:
- CSS custom properties for colors: `--color-duo-green`, `--color-duo-blue`, `--color-duo-orange`, `--color-duo-red`, etc.
- Utility classes: `.btn-primary`, `.card`
- Nunito font family

### Component Structure

- `src/screens/` - Main views (LearnerHome, ManagerHome)
- `src/components/` - Reusable UI components (CourseCard, TeamMemberCard, ProgressRing, DailyGoal, etc.)

### State Flow

1. App mounts and loads user from API/mock
2. User's `isManager` flag enables mode switcher
3. Each screen loads its own data via `api` client
4. Zustand store updates trigger re-renders

### Deployment

GitHub Actions automatically builds and deploys to GitHub Pages on push to `main`. The workflow is defined in `.github/workflows/deploy.yml`.

### API Authentication

When running inside the LXP Content Box, the API client relies on browser session cookies for authentication (same-origin requests). No Bearer token is needed. The `Authorization` header is only sent when an explicit token is provided.

## User Preferences

- Claude should commit and push changes directly when completing tasks
