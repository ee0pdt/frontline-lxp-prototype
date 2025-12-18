# Frontline LXP Prototype

A Duolingo-style, mobile-first learning experience prototype for frontline workers. Built to overlay on the existing LXP platform via Content Box injection.

## Features

### Learner Mode
- **Daily Goals & Streaks** - Track learning progress with XP goals and streak counts
- **Mandatory Training** - Clear visibility of required compliance courses with due dates
- **Progress Tracking** - Visual progress bars and completion percentages
- **Gamification** - XP system, streak shields, and achievement badges

### Manager Mode
- **Team Overview** - Compliance percentage and team statistics at a glance
- **Member Monitoring** - Individual progress cards for each team member
- **Attention Alerts** - Highlights team members falling behind
- **Quick Actions** - Nudge team members and send reminders

## Tech Stack

- **React 19** + TypeScript
- **Vite** for fast development and optimized builds
- **TailwindCSS v4** with custom Duolingo-inspired theme
- **Zustand** for lightweight state management
- **GitHub Pages** for deployment

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This project is configured to auto-deploy to GitHub Pages on push to `main` branch.

### Setup GitHub Pages

1. Push this repo to GitHub
2. Go to Settings > Pages
3. Set source to "GitHub Actions"
4. Push to `main` to trigger deployment

### LXP Integration

To use in an LXP environment:

1. Copy contents of `docs/content-box-loader.html`
2. Go to LXP Admin > Customisable Dashboard
3. Add a new Content Block
4. Switch to "Raw Editor" mode
5. Paste the content and update the GitHub username
6. Save and preview

## Project Structure

```
src/
├── api/
│   └── client.ts        # API client with mock data for dev
├── components/
│   ├── BottomNav.tsx    # Mobile navigation
│   ├── CourseCard.tsx   # Learning content cards
│   ├── DailyGoal.tsx    # XP progress ring
│   ├── ModeSwitch.tsx   # Learner/Manager toggle
│   ├── ProgressRing.tsx # Circular progress component
│   ├── StreakDisplay.tsx
│   └── TeamMemberCard.tsx
├── screens/
│   ├── LearnerHome.tsx  # Learner dashboard
│   └── ManagerHome.tsx  # Manager dashboard
├── config.ts            # Environment configuration
├── store.ts             # Zustand state management
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # TailwindCSS + custom theme
```

## Configuration

The app reads configuration from `window.FRONTLINE_CONFIG` when embedded in LXP:

```javascript
window.FRONTLINE_CONFIG = {
  userId: window.USER_ID,
  userName: window.USER_NAME,
  token: window.BEARER_TOKEN,
  orgId: window.ORG_ID,
  orgAlias: window.ORG_ALIAS,
  apiBase: '/lxp/api/v1'
};
```

In development mode, mock data is used automatically.

## License

Private - Learning Pool Ltd.
