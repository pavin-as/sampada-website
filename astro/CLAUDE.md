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

## Malayalam Blog (i18n)
- Most patients are Malayalam speakers, so blog posts can have a Malayalam translation, toggleable from the English version. The rest of the site (nav, footer, non-blog pages) is **not** translated — this is a deliberate, blog-only scope; see the tradeoffs noted in commit history / conversation before expanding it site-wide.
- Structure mirrors the English blog one level down:
  - Content: `src/content/blog-ml/*.md` — same schema as `blog`, registered as collection key `'blog-ml'` in `src/content.config.ts`.
  - Routes: `src/pages/ml/blog/index.astro` (listing) and `src/pages/ml/blog/[...slug].astro` (post), both mirroring their English counterparts under `src/pages/blog/`.
- **A Malayalam post's filename must exactly match the English post's filename** (i.e. its `.id`/slug) it translates — that's how the language-toggle link is derived on both sides (`/blog/<slug>/` ↔ `/ml/blog/<slug>/`). A translation is optional per post: `getStaticPaths` in `src/pages/blog/[...slug].astro` checks `blog-ml` for a matching id and only renders the toggle link when one exists, so untranslated English posts (and vice versa) render fine with no dead link.
- `src/layouts/BlogPost.astro` takes optional `lang` (`'en' | 'ml'`), `altHref`, `altLabel` props — this drives `<html lang>`, the canonical URL, an `hreflang` alternate tag, Malayalam web font loading (Noto Sans Malayalam, loaded only when `lang === 'ml'`), and the visible toggle link near the H1.
- New Malayalam post checklist: translate the English post's frontmatter + body into a new file at `src/content/blog-ml/<same-slug>.md`, then `npm run build` and confirm `dist/ml/blog/<slug>/index.html` exists and the English post's page now shows the "മലയാളത്തിൽ വായിക്കുക" toggle.
- Translation quality matters here — this is patient-facing medical content. Treat translations as a first draft that should get a native/clinical review pass, not a final artifact.

## Sitewide Header, Shared Styles & Redesigned Pages (Sept 2026 redesign)
- **Header**: one component, `src/components/Header.astro`, is used by every page and layout (the old per-page Elementor header markup is gone). 5 items: Home, Treatments (dropdown fed by the `treatments` collection in the order of `TREATMENT_ORDER`), About Us, Blog, Contact Us, plus a "Book Appointment / Call: +91 91885 72412" button. Active state comes from `Astro.url.pathname`. Footer "Quick Links" are the same 5 links in a `.svr-footer-nav` list.
- **Footer**: one component, `src/components/Footer.astro`, on every page and layout (NAP, hours Mon 9-5 / Tue 3-5 PM / Wed-Sat 9-5 / Sun closed, phone and WhatsApp only, no email, Instagram/Facebook/YouTube, quick links). It also renders the native floating WhatsApp button (`.svr-wa`, replaces the old joinchat plugin); there is no Tidio live chat any more (WhatsApp only). Edit the footer once, there.
- **Head**: `src/components/SiteHead.astro` emits favicons and Google Fonts (DM Serif Display + Poppins). Pass `legacy` on Elementor-body pages to also load Roboto, Roboto Slab and Open Sans. Do not paste WordPress head tags (generator, wp-json, RSD, shortlink, feeds, emoji script) back in.
- **Shared constants**: `src/data/site.ts` (phone, Instagram URL, `MAPS_DIRECTIONS`, `TREATMENT_ORDER`). Change the phone number or the treatment order there, not per page.
- **Shared styles**: `src/styles/site.css`, everything scoped under `.svr-page` (so it beats the legacy Elementor CSS). Import it in a page's frontmatter and wrap redesigned sections in `<main class="svr-page">` (or `<div class="svr-page">` on legacy Elementor pages). Palette: navy `#04092A`, accent `#F28738`, "DM Serif Display" headings.
- **Treatment cards**: `src/components/TreatmentGrid.astro` (used on `/` compact, and on `/treatments/`). Card text comes from each treatment's frontmatter: `navLabel` (short name, also used in the header dropdown) and `cardSummary` (one short clinical sentence).
- **/about/** now holds the clinic story, Dr. Sameera's credentials, equipment, "Why Sampada VR" and Mission/Vision/Patient Promise. `/why-sampada-vr/` is an Astro `redirects` entry in `astro.config.mjs` (emits a meta-refresh + canonical page pointing at `/about/`).
- **/treatments/** = 8-card grid + FAQ accordion (`<details>`, with FAQPage JSON-LD built from the same `faqs` array in the page frontmatter). Edit FAQs there.
- **Homepage "Latest updates"** slides are defined in `src/pages/index.astro` frontmatter (`featured`); the build throws if a slug no longer exists in the blog collection.
- **Instagram**: `src/data/instagram.json` feeds the homepage "Life at Sampada VR" grid. `scripts/fetch-instagram.mjs` refreshes it (CI step in `deploy.yml`) from `INSTAGRAM_FEED_URL` (JSON feed service) or `INSTAGRAM_ACCESS_TOKEN` (Instagram API), downloads images to `public/instagram/`, and is a silent no-op if neither secret is set. The committed JSON is a **fallback set** (clinic photos linking to the profile), not real posts.
- **/eye-hospital-in-tirur/** (`src/pages/eye-hospital-in-tirur/index.astro`) is the local-SEO landing page for the "eye hospital Tirur" search: lean head (no Elementor bundle), WebPage + BreadcrumbList + FAQPage JSON-LD (the clinic entity itself, `#clinic`, is defined on the homepage), NAP/hours/map, reviews from `src/data/reviews.json`, FAQs in the page frontmatter. It uses the new `src/components/Footer.astro` (phone and WhatsApp only, no email) and is linked from the homepage intro H2 and every footer nav. Keep NAP and hours identical to the Google Business Profile.
- **Homepage section order** (`src/pages/index.astro`, top to bottom): hero slider, local intro (H1/H2), Dr. Sameera spotlight, Instagram "Life at Sampada VR", Google reviews, Latest updates (blog slider), compact treatment grid, footer. **Treatment order** is retina-first, cataract last, set once in `TREATMENT_ORDER` (`src/data/site.ts`); it drives the header dropdown, both grids and the /treatments/ ItemList schema.
- **Legacy CSS**: the five pages that still have Elementor bodies (`index`, `contact-us`, `blog/index`, `ml/blog/index`, `about-dr-sameera-v-v`) import a purged bundle instead of ~1.3 MB of plugin CSS: `src/styles/legacy-home.css` (home, includes the bdt-uikit slider styles; the page loads only `bdt-uikit.min.js`) or `src/styles/legacy-pages.css`. Those bundles were generated with PurgeCSS (`variables:false`, `fontFace`/`keyframes` on) from the old stylesheets; if you add a new Elementor-style widget you must add its CSS by hand. Blog posts and treatment pages use `src/styles/base.css` (the theme's Normalize/Reboot, ~5 KB). `.elementor-invisible` is forced visible because Elementor's JS is gone. The contact page has no form (the WPForms form could not work on a static host); it has Call / WhatsApp / Directions buttons.
- **`archive/`** (git-ignored, project root of this folder): deprecated pages and stock images moved out of the build instead of deleted (`archive/pages/`, `archive/images/`, `archive/components/`, and `archive/public-unused/` = ~870 unreferenced WordPress/Elementor plugin, wp-includes and generated-CSS files that used to sit in `public/`). Restore by moving a file back to its original path.
- **Verifying changes locally on a non-macOS box**: `node_modules` here is macOS-native; build from a copy (`rsync` the project, exclude `node_modules`/`dist`, `npm ci`, `npm run build`).

## Conventions
- No component framework: server-rendered `.astro`. Header, Footer and SiteHead are shared components; the five legacy Elementor page bodies are still verbatim markup (styled by the purged legacy CSS bundles) and only worth componentizing as a deliberate, separate refactor.
- Images live under `public/wp-content/uploads/<year>/<month>/...webp`, matching the old WordPress upload path structure so existing hardcoded references keep working.
- Commit messages: no enforced convention observed in history; keep them descriptive and imperative.

## Known Gaps (not yet fixed, worth flagging if touched)
- No Open Graph / Twitter Card meta on the legacy-body pages other than the blog layout.
- `contact-us`, `blog/index`, `ml/blog/index`, `about-dr-sameera-v-v` and the homepage hero still use Elementor-era markup. The homepage loads `bdt-uikit.min.js` (~143 KB) only for the hero slider.
- The homepage hero image `3.png` is ~1.6 MB; converting it to webp would be the next largest page-weight win.
- The unreferenced images in `public/wp-content/uploads/2024/02/` (for example `1.png`, `2.png`, `4.png`, `Mask-Group-*`) were left in place on purpose; they are user media, not plugin bloat.
