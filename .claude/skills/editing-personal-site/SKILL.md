---
name: editing-personal-site
description: Use when adding or editing writing posts, research entries, the About section, or profile photo in this personal-site repo (Yun-Jie Christina Wu's Astro site), or when modifying its page structure or Cloudflare Workers deploy setup.
---

# Editing personal-site

## Overview
Astro static site (`output: "static"`). Two content types (research, writing) are
Zod-validated Markdown collections defined in `src/content.config.ts`; the About
section is hand-coded in `src/pages/index.astro`. Deploy is git-push-triggered:
GitHub → Cloudflare Worker "personal-website" (builds with `npm run build`, ships
`dist/` via `npx wrangler deploy` per `wrangler.jsonc`) → live at
`https://me.yunjietracker.com` and `https://personal-website.yunjie-christina.workers.dev`.

## Architecture map
| Path | What it is |
|---|---|
| `src/pages/index.astro` | Home: About (hard-coded) + Projects preview + Writing preview |
| `src/pages/research/index.astro` | Full research list |
| `src/pages/research/[slug].astro` | Individual research entry page (mirrors writing's) |
| `src/pages/writing/index.astro` | Full writing list, with type filter buttons |
| `src/pages/writing/[slug].astro` | Individual writing post |
| `src/content/research/*.md`, `src/content/writing/*.md` | Content collections (schema-checked) |
| `src/content.config.ts` | Zod schemas — source of truth for frontmatter fields |
| `src/layouts/BaseLayout.astro` | Shared shell + nav (`active` prop: `about`/`projects`/`writing`) |
| `src/components/GalleryCard.astro` | Card used by research/writing grids |
| `src/lib/format.ts` | Maps enum values → CSS classes/labels (gradient, tag, status) |
| `public/` | Static files served as-is, e.g. `public/profile.png` → `/profile.png` |
| `astro.config.mjs` | `site:` canonical domain |
| `wrangler.jsonc` | Cloudflare Worker name + `assets.directory: "dist"` |

## Add a writing post
New `.md` file in `src/content/writing/`, **filename = kebab-case slug of the title**
(e.g. "On Peer Review" → `on-peer-review.md`; it becomes the URL `/writing/on-peer-review/`).
Frontmatter per schema:
```yaml
title: string
date: 2026-08-20        # coerced to Date — first publish date, never changes after
updated: 2026-08-25       # optional, coerced to Date — only set on a substantive revision;
                              # shows "· 更新於 ..." next to the date, omit entirely otherwise
type: reflective          # reflective | science-observation | industry-observation | opinion
summary: string           # one-liner on card — required, ask the user rather than inventing one
color: fog                 # optional: sage|clay|slate|mauve|sand|fog, default fog
image: /post-x.jpg          # optional — full-width cover photo shown below the title block
imageCredit: 'Photo by <a href="...">...</a> on <a href="...">Unsplash</a>'  # optional, raw HTML under the cover photo
tags: [opinion, some_topic]  # optional freeform labels — rendered at the very end of the article, not inline
draft: false                # optional, excluded from prod build if true
```
`type` display label: reflective→Reflective, science-observation→Science,
industry-observation→Industry, opinion→Opinion.
List page is empty ("Coming soon") until the first non-draft post exists — that's expected, not a bug.

### Body conventions (the article-page format — always write new posts this way)
The body is regular Markdown below the frontmatter, rendered by `src/pages/writing/[slug].astro`.
That template auto-generates the sidebar table of contents, footnote list, reading time,
tags block, prev/next nav, and "更多文章" — none of that is written by hand. What the
*author* controls is just the Markdown shape:

- **Headings** — `##` (H2) = top-level TOC entry, `###` (H3) = indented second-level entry.
  The TOC sidebar is fixed-width and truncates long titles with an ellipsis (full text still
  shows on hover), so keep headings short and front-load the key words.
- **Footnotes** — use standard GFM syntax, *not* inline HTML:
  ```markdown
  一段有註解的文字[^1]。

  [^1]: 註解內容，可以放在同一段落後面，也可以全部集中放在文件最後——渲染結果不看位置。
  ```
  Astro's bundled `remark-gfm` auto-collects every `[^N]` into a "註解" list at the very end
  of the article with a backlink to the reference — no extra setup, and no `<sup class="note-ref">`/
  `<p class="note">` markup (that pattern is retired; only kept for historical reference in
  `docs/superpowers/specs/2026-09-03-writing-article-redesign-design.md`).
- **Images with a caption** — image markdown immediately followed by a `<p class="credit">` line,
  e.g.:
  ```markdown
  ![alt text](/some-image.jpg)
  <p class="credit">Photo by <a href="...">Name</a> on <a href="...">Unsplash</a></p>
  ```
  Renders small, centered, gray text directly under the image.
- **Quotes** — plain `>` blockquote for pull-quotes or quoted material; renders bold + italic
  with a left color bar.
- **Section breaks** — `---` on its own line to separate major sections/chapters within the piece.
- **Tags** — go in frontmatter `tags:`, never written inline in the body; they render as a block
  at the very end of the article, after the content and before the comments section.

Full rationale/history of this format is in
`docs/superpowers/specs/2026-09-03-writing-article-redesign-design.md` (plus its 2026-09-04
revision note) if a future change needs the original reasoning.

## Add a research entry
New `.md` file in `src/content/research/`, filename = kebab-case slug of the title
(matches existing files, e.g. `unconscious-recognition.md`). Frontmatter per schema:
```yaml
title: string
status: under-review        # under-review | in-progress | published
category: string             # e.g. "Neuroscience"
summary: string
order: 1                       # sort key, ascending — lower number shows first
color: sage                    # optional, default sage — used for the card/hero gradient when no image is set
image: /project-x.jpg           # optional — hero photo on the entry page + list card, overrides the color gradient
imageCredit: <a href="...">...</a>  # optional, raw HTML rendered under the hero photo
```
`status` display label: under-review→"Under review", in-progress→**"In training"**
(use this for anything phrased as "still training/in progress"), published→"Published".
Before picking `order`, check the `order` values already used in other `src/content/research/*.md`
files to avoid an unintended tie/collision. Each entry gets its own page at
`/research/<slug>/` (`src/pages/research/[slug].astro`) rendering the Markdown body —
same pattern as writing posts, just no `date`/`type` fields.

## Edit About / profile photo
Not a content collection — edit `src/pages/index.astro` directly (About section,
roughly lines 22–55 — search for `<section class="about"` rather than trusting the
line numbers, they drift as the file changes): name/role/bio text, the `#tags` list,
and the `.social` links (currently: Email, GitHub, Medium — each is an `<a>` + inline
`<svg>` icon; swapping a platform means changing both the `href`/`title`/`aria-label`
and the `<path>` d= data for that platform's icon).

**Photo rotation:** the `.photo` div holds one or more `<img class="photo-frame">`
elements (one needs `is-active` too); a `<script>` + `<style>` block right before
`</BaseLayout>` crossfades between them every 20s (`setInterval`, toggles `is-active`).
- Single static photo → just overwrite `public/profile.png` in place (filename unchanged).
- Add a photo to the rotation → drop the new file in `public/` (e.g. `profile-3.png`),
  add another `<img class="photo-frame" src="/profile-3.png" alt="...">` inside `.photo`
  — no other changes needed, the script picks up any `.photo-frame` count automatically.
- Remove a photo from rotation → delete its `<img>` line (and the file in `public/` if unused).
- Change rotation speed → edit the `20000` (ms) in the `setInterval` call.

## Workflow (always)
```
npm run dev       # preview at localhost:4321
npm run check      # type + content-schema validation — run before pushing
npm run build      # sanity-check the production build locally
git add -A && git commit -m "..." && git push
```
Push to `main` → Cloudflare auto-rebuilds and redeploys. No dashboard steps needed
for content changes — only touch Cloudflare's dashboard for infra changes (custom
domains, env vars).

## Common mistakes
- Editing `dist/` directly — it's build output (gitignored), gets overwritten every deploy.
- Wrong enum value for `type`/`status`/`color` — `npm run check` catches this before it reaches Cloudflare's build log.
- Forgetting `draft: false`→ default is already `false`, only set `draft: true` to hide a post.
- Assuming `.workers.dev` and the custom domain are on the same Cloudflare account — they aren't (Worker lives under `Yunjie.christina@gmail.com`; the `yunjietracker.com` zone is a separate account). Only matters if re-doing domain setup.
