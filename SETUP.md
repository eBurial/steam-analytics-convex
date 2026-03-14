# 🚀 Quick Setup Guide

## Initial Git Setup

If you haven't initialized a git repository yet, follow these steps:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Steam Analytics Dashboard"

# Create main branch (if not already on main)
git branch -M main

# Add remote repository
git remote add origin https://github.com/eBurial/steam-analytics-convex.git

# Push to GitHub
git push -u origin main
```

## Creating a GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `steam-analytics-dashboard`
3. **Do NOT** initialize with README, .gitignore, or license (we already have these)
4. Copy the repository URL
5. Follow the git commands above with your repository URL

## Adding Screenshots

Before pushing to GitHub, add screenshots to make your README look professional:

1. Run the application: `npm run dev`
2. Take screenshots of:
   - Dashboard (grid view)
   - Dashboard (table view)
   - Game detail page
3. Save them in the `screenshots/` directory with these exact names:
   - `dashboard.png`
   - `grid-view.png`
   - `table-view.png`
   - `game-detail.png`

See `screenshots/README.md` for detailed instructions.

## Environment Variables

Remember to **NEVER** commit your `.env.local` file or Steam access token to GitHub!

The `.gitignore` file already excludes:
- `.env.local`
- `.env*.local`
- Environment variables

## Updating README

Before publishing, update these sections in `README.md`:

1. **Contact section** (line 258):
   ```markdown
   Your Name - [@yourtwitter](https://twitter.com/yourtwitter)
   ```
   Replace with your actual name and Twitter handle

2. **Project Link** (line 260):
   ```markdown
   Project Link: [https://github.com/yourusername/steam-analytics-dashboard](...)
   ```
   Replace with your actual GitHub repository URL

3. **Clone URL** (line 83):
   ```bash
   git clone https://github.com/eBurial/steam-analytics-convex.git
   ```
   Replace with your actual repository URL

## GitHub Repository Settings

### Topics/Tags
Add these topics to your repository for better discoverability:
- `steam`
- `analytics`
- `dashboard`
- `nextjs`
- `convex`
- `typescript`
- `tailwindcss`
- `recharts`
- `real-time`
- `steam-api`

### About Section
Use this description:
> Real-time Steam player tracking dashboard with historical data, charts, and comprehensive game information for the top 100 games.

### Website
Add your deployed URL (if you deploy to Vercel/Netlify)

## Optional: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts to link your project
```

Make sure to add `STEAM_ACCESS_TOKEN` as an environment variable in Vercel settings!

## Checklist Before Publishing

- [ ] Screenshots added to `screenshots/` directory
- [ ] README.md updated with your information
- [ ] LICENSE file reviewed
- [ ] .gitignore includes sensitive files
- [ ] No sensitive data (API keys, tokens) in code
- [ ] All features working locally
- [ ] Git repository initialized
- [ ] First commit created
- [ ] Pushed to GitHub
- [ ] Repository topics/tags added
- [ ] Repository description added

## Need Help?

Check out the [CONTRIBUTING.md](CONTRIBUTING.md) guide or open an issue!
