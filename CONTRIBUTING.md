# CONTRIBUTING.md

## Scope

This repository serves the `iridyne.github.io` landing page and is deployed via GitHub Pages.

## Structure

- `index.html`: page structure and semantic sections.
- `styles.css`: visual system, layout, and animation styling.
- `app.js`: content config, UI hydration, and repository data loading.

## Editing Rules

- Keep content changes in the `CONFIG` object in `app.js` whenever possible.
- Keep styling changes in `styles.css` instead of inline styles.
- Keep DOM rendering and GitHub API logic separated in `app.js`.
- Avoid introducing build tooling unless there is clear team agreement.

## Repository Showcase Guidelines

- Use `featuredRepos` to pin important repositories first.
- Use `hiddenRepoPatterns` to exclude meta/archive noise.
- Keep fallback text concise and user-facing.

## Local Preview

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.
