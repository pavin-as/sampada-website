# Sampada VR website redesign: plan and phases

Goal: a simpler, more trustworthy site that ranks for "eye hospital Tirur" and its treatment terms. Remove leftover WordPress/template bloat, keep everything recoverable in `archive/` (git-ignored, never deleted).

## Phases

| # | Phase | What changed | Status |
|---|-------|--------------|--------|
| 0 | Audit + safety net | Baseline build was clean. `archive/` created and added to `.gitignore` (astro/ and repo root). Pre-redesign copies of the edited pages saved in `archive/pages/pre-redesign/`. | Done |
| 1 | Navigation | New shared `Header.astro`: Home, Treatments (dropdown to the 8 procedure pages), About Us, Blog, Contact Us, plus a Book Appointment / Call button. Replaces the Elementor header on every page and layout. "Why Sampada VR" removed from nav; footer links match. | Done |
| 2 | About consolidation | `/about/` rebuilt: story, Tirur landmark, Dr. Sameera's credentials, OCT / Humphrey / Fundus camera / Green laser, Why Sampada VR, Mission / Vision / Patient Promise. `/why-sampada-vr/` now redirects (meta refresh + canonical) to `/about/`. | Done |
| 3 | Treatments page | Six stock-photo cards and the "How Treatment Works" filler removed. 8-card grid (max 1160px, 4 / 2 / 1 columns), each with title, short clinical summary and "View Procedure". FAQ accordion (insurance, booking, day-care recovery, retinal emergencies, more) with FAQPage schema. | Done |
| 4 | Instagram data + automation | `src/data/instagram.json` (fallback), `scripts/fetch-instagram.mjs`, new step in `deploy.yml`. | Done (needs a feed URL or token for live posts) |
| 5 | Homepage | Mission/Vision and homepage FAQ removed. Latest updates now three featured blog articles with real hero images and "Read Article". Instagram grid added under it. Kept: Tirur H1 hero, local intro, Dr. Sameera spotlight, Google reviews. Stock coverflow replaced by a compact 8-card treatment grid. | Done |
| 6 | Verify | `npm run build`: no warnings. All 28 pages crawled at 1366px and 390px: no 404s for local assets, no horizontal overflow. Dead WordPress head tags (feeds, wp-json, oEmbed, RSD, shortlink) removed from touched pages. | Done |

## Decisions worth knowing
- Everything new is scoped under `.svr-page` in `src/styles/site.css`, so legacy Elementor CSS cannot override it.
- Treatment names/summaries live in each treatment's frontmatter (`navLabel`, `cardSummary`), so the header dropdown, homepage grid and /treatments/ grid always agree.
- Stock images with no remaining reference were moved to `archive/images/` (23 files: `placeholder-15..18`, `budha*`, `gallery-35/36`, `1-2..6` coverflow, `4-5`, `5-4`, `6-4`, `1-13`, `2-12`, `3-11`).

## Open items for the clinic
1. **Instagram**: the bundled `instagram.json` is a fallback (clinic photos linking to the profile). Instagram blocks scraping, so real posts need `INSTAGRAM_FEED_URL` (e.g. a Behold/Curator JSON feed) or `INSTAGRAM_ACCESS_TOKEN` added as GitHub repository secrets. The workflow currently runs on push and monthly; add a weekly cron if you want fresher posts.
2. **Insurance / cashless FAQ**: worded neutrally ("call to confirm for your insurer or TPA"). Replace with your actual empanelment policy.
3. **Green laser**: listed on /about/ as requested; it is not mentioned anywhere else on the site yet.
4. **Still Elementor**: contact-us, blog index and Dr. Sameera's page keep their legacy bodies (only header/footer nav changed).
