# iridyne.github.io

Landing page for the Iridyne organization (GitHub Pages).

## What this landing page includes

- Bold, professional dark visual style
- Clear organization intro section
- Repository showcase section powered by GitHub API (`/orgs/iridyne/repos`)
- Responsive layout for desktop/mobile
- Graceful fallback if repository API is unavailable

## Project structure

- `index.html` — page structure and content blocks
- `styles.css` — design tokens, layout, animation and responsive styles
- `app.js` —
  - content/data config (`CONFIG`)
  - repository data service (retry + cache)
  - rendering layer and interaction logic
- `CONTRIBUTING.md` — lightweight contribution rules

## Local preview

Open with a local static server:

```bash
python3 -m http.server 8080
```

Then visit:

- `http://localhost:8080/projects/iridyne.github.io/`

## Deploy

This repository is intended for GitHub Pages at:

- `https://iridyne.github.io`

Push to `main` to publish changes.
