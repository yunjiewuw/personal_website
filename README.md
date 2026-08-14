# personal-site

Personal website — Astro static site (About + Research + Writing).

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
```

## Build

```bash
npm run check      # type + content-schema check
npm run build      # outputs static site to ./dist
npm run preview    # preview the production build locally
```

## Content

- **Research:** add a Markdown file to `src/content/research/`.
- **Writing:** add a Markdown file to `src/content/writing/`. Set `draft: true`
  to keep a post out of the production build.
- Frontmatter is schema-validated (`src/content.config.ts`) — a missing or
  mistyped field fails the build with a clear error.

## Deploy (Cloudflare Pages via GitHub)

1. Create a GitHub repo and push this project.
2. Cloudflare dashboard → Pages → **Connect to Git** → pick the repo.
3. Build settings: **Build command** `npm run build`, **Output directory** `dist`.
4. Add your custom domain in Pages → Custom domains.

Before deploy: set the real domain in `astro.config.mjs` (`site:`), and replace
the `TODO(owner)` placeholders (name, photo, research summaries, links).
