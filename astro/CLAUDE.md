# Sampada VR Speciality Eye Care — Website

## Project Identity
- Marketing/content website for Sampada VR Speciality Eye Care, migrated from WordPress/Elementor to Astro (static output).
- **Stack**: Astro 6 (static output), TypeScript, content collections (`astro:content` glob loader), `@astrojs/sitemap`. No framework UI library — pages are plain `.astro` with inline styles/scripts carried over from the WordPress export.
- **Hosting**: GitHub Pages, deployed via `.github/workflows/` (the repo's actual workflow file lives one level up, at the git repo root — `working-directory: astro` in CI points at this folder).
- **Repo layout gotcha**: the git repo root (`../`) also contains a stale, untracked-but-present `src/`, `node_modules/`, `dist/` from a pre-migration setup. Ignore that outer folder — this folder (`astro/astro/` from repo root) is the real, deployed project.

## Working in This Repo
- Install/build/dev all run from *this* directory (where `package.json` and `astro.config.mjs` live), not the repo root.
```bash
npm install
npm run dev       # localhost:4321
npm run build     # → ./dist
npm run preview
```
- Always run a real `npm run build` after changing anything under `src/content/`, `src/pages/blog/`, or `src/layouts/BlogPost.astro` — this codebase has a history of content-collection wiring silently breaking with no error at dev-server level beyond a console warning (`The collection "blog" does not exist or is empty`). Check the build log for that string.

## Blog System
- Posts: Markdown files in `src/content/blog/*.md`. Collection config: `src/content.config.ts` — **must** stay at `src/content.config.ts` (or legacy `src/content/config.ts`); Astro 6 does not look anywhere else, including `src/content/content.config.ts`, and fails to register the collection silently.
- Frontmatter schema (`src/content.config.ts`):
  ```yaml
  title: string
  description: string
  publishDate: "YYYY-MM-DD"   # quoted
  heroImage: "/wp-content/uploads/<year>/<month>/<file>.webp"   # optional
  category: string            # optional — used values: diagnostic, treatment, education, news
  ```
- Content-layer entries expose `.id` (the filename-derived slug), **not** `.slug`. Both `src/pages/blog/index.astro` and `src/pages/blog/[...slug].astro` use `post.id`.
- Rendering a post body uses the standalone `render(post)` import from `astro:content`, not `post.render()` (that method doesn't exist on Astro 6 content-layer entries).
- New post checklist:
  1. Add the `.md` file to `src/content/blog/` with the frontmatter above.
  2. Convert/save the hero image as `.webp` under `public/wp-content/uploads/<year>/<month>/` (use `cwebp -q 82 in.jpg -o out.webp` if you have a raw photo).
  3. `npm run build` and confirm `dist/blog/<slug>/index.html` was generated with the right `<title>`, hero `<img>` src, and no console warnings.
- `src/layouts/BlogPost.astro` is a large (~630 line) WordPress-export template. The `<head>` still carries a lot of dead WordPress cruft (fake `/wp-json/` oEmbed links, RSD, shortlink with a stale numeric post ID, an RSS "comments feed" link, a WhatsApp chat prefill string) that references the original OCT post by name — none of it is functional on this static site, but it's not yet fully cleaned up. `title`, `description` (meta), `canonical`, `h1`, and hero `<img>` **do** correctly use the post's own data/`slug` prop — trust those; be skeptical of anything else in that file's `<head>` claiming to be post-specific.
- `_template.md` no longer exists — it used to be a copy-paste starting point but was accidentally being published as a live (broken-looking) post on `/blog/`. `QUICK_START.md` now documents creating the frontmatter directly instead.

## Conventions
- No component framework — everything is server-rendered `.astro` with the original Elementor-era inline CSS/JS preserved. Don't try to "componentize" this without a deliberate, separately-scoped refactor; the WordPress export is deeply repetitive (header/nav markup is duplicated verbatim across most pages in `src/pages/`) and safe extraction needs care.
- Images live under `public/wp-content/uploads/<year>/<month>/...webp`, matching the old WordPress upload path structure so existing hardcoded references keep working.
- Commit messages: no enforced convention observed in history; keep them descriptive and imperative.

## Known Gaps (not yet fixed, worth flagging if touched)
- `BlogPost.astro` `<head>` still has stale WordPress meta (oEmbed/RSD/shortlink/RSS-comments/WhatsApp-prefill) hardcoded to the original OCT post — cosmetic/SEO issue, not a functional blocker.
- No Open Graph / Twitter Card meta tags anywhere in the blog layout.
- Most non-blog pages (`about`, `treatments`, `why-sampada-vr`, etc.) duplicate the full header/nav/footer markup inline rather than sharing a layout — a future refactor candidate, not something to change opportunistically mid-task.
