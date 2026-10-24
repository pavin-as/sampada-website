# Public release update — 24 October 2026

The site owner confirmed clinical review is complete and explicitly authorised public release. Version 1 is released in English; Malayalam translation and review are not claimed complete. The implementation record below describes the original preview and its outstanding manual checks, not the current publication status.

Production now generates `/vision-checks/` and all four tools without an environment flag, includes them in the sitemap, supplies canonical metadata, and links the hub from header and footer. Preview warnings and noindex have been removed. No scoring, clinical decision rules or test instructions were changed for release. No patient data collection was added.

Rollback: revert the public-release commit to restore preview gating and remove public navigation links.

---

# Vision Checks — Phase 0 / 1 review packet

Status: English implementation ready for review. NOT clinically approved or ready for patient release.
Version: 1, prepared 24 October 2026.

## Local preview

Run from the inner `astro` directory:

```sh
VISION_CHECKS_PREVIEW=true npm run dev -- --host 127.0.0.1 --port 4330
```

Open http://127.0.0.1:4330/vision-checks/ . The normal build omits the hub and all four tool routes. Preview pages carry noindex and are excluded from the sitemap. Noindex is not access control: do not deploy a preview build publicly. No production navigation has been added before launch approval.

```sh
node --test tests/vision-rules.test.mjs
npm run build
VISION_CHECKS_PREVIEW=true npm run build
```

## Content inventory and ownership

- `src/data/vision-checks.mjs`: card copy, urgent message, source links, five educational quiz questions.
- `src/lib/vision-rules.mjs`: all questionnaire and Amsler result rules.
- `src/pages/vision-checks/[tool].astro`: instructions, questions, response labels and interaction.
- `src/layouts/VisionChecks.astro`: privacy, clinical status, emergency advice.

Clinical owner: TO BE ASSIGNED. English copy approval: PENDING. Malayalam translator and clinical reviewer: TO BE ASSIGNED. Operations contact verification: PENDING. Next review date: set at approval (suggest six months, sooner if guidance changes).

## Scope and journeys

1. New symptom → symptom questions → immediate advice on a red flag or uncertainty → clinic call or emergency service. Completing the form adds eye and onset to a printable summary; it never delays initial advice.
2. Central-vision check → instructions → ruler calibration → each eye separately → observation summary → contact guidance. Any concerning observation triggers advice without waiting for calibration or completion.
3. Diabetes → current symptoms first → examination and follow-up history → action guidance → print appointment preparation notes.
4. Education → five knowledge questions → per-answer explanation → knowledge-only score.

## Clinical decision matrix requiring sign-off

| Tool | Trigger | Draft outcome |
| --- | --- | --- |
| Symptoms | Any yes: sudden loss, new shadow, new flashes, new/increased floaters | Immediate eye assessment; overrides all other answers |
| Symptoms | No yes, at least one uncertain | Prompt professional clarification; immediate care if potentially sudden/red flag |
| Symptoms | All no | No exclusion of disease; assessment for persistent/changing symptoms |
| Diabetes | Sudden symptoms | Immediate assessment, overrides schedule |
| Diabetes | Other/uncertain symptoms | Prompt contact, overrides schedule |
| Diabetes | Pregnant/planning/uncertain | Individual plan with eye and diabetes team |
| Diabetes | Advised date passed | Arrange follow-up |
| Diabetes | Active clinician plan | Follow existing plan; earlier contact for symptoms |
| Diabetes | Retinopathy yes/uncertain without plan | Confirm individual follow-up |
| Diabetes | Gestational/unknown type without plan | Clarify type-specific plan |
| Diabetes | Old/never/unknown examination without plan | Contact care team about retinal examination |
| Diabetes | Remaining cases | Confirm ongoing timing; no automatic due-date or risk score |
| Amsler | Either eye changed | Contact ophthalmologist right away; emergency escalation for sudden loss/shadow |
| Amsler | Either eye uncertain | Contact eye doctor; no reassuring interpretation |
| Amsler | Both unchanged, calibration unconfirmed | Cannot interpret setup |
| Amsler | Both unchanged, calibration confirmed | No change reported; does not rule out disease |
| Quiz | Any score | Knowledge score only |

Review every exact question, instruction, branch, result, call-to-action and source, not just this matrix. Confirm use for the intended Indian patient population. The diabetes flow is guidance, not a validated risk model or medical scheduling engine.

## Amsler protocol review

Draft: 10 cm square grid, 20 x 20 squares, black lines/central dot on white, approximately 35 cm viewing distance. Screen calibration uses a ruler-measured 5 cm line; full grid size is twice the line. Recalibration is required after viewport/zoom changes. Ask whether the whole grid is visible. If not, use a larger display or print. Print at 100%; measure the 10 cm grid and 5 cm marker before use.

Clinician must confirm the grid geometry, line/dot visibility, distance and instructions. Physical screen and paper sizes have not been verified with a ruler by a human. No drawing overlay is included; add only after usability testing demonstrates value.

## Sources

- AAO Amsler grid: https://www.aao.org/eye-health/tips-prevention/facts-about-amsler-grid-daily-vision-test
- NEI retinal detachment: https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/retinal-detachment
- CDC diabetes and vision: https://www.cdc.gov/diabetes/diabetes-complications/diabetes-and-vision-loss.html

NEI and CDC consulted 24 October 2026. AAO content was available during planning; a fresh direct fetch returned 403. Reviewer should verify the live source. All patient copy is an original draft; no proprietary clinical scoring instrument or supplied image is reproduced.

## Privacy and technical design

Static Astro with browser-only answers. No backend, accounts, cookies, storage, analytics, health answers in URLs, or automated messages added. Inputs are not submitted over the network; summary uses text nodes, not interpolated HTML. Refresh clears application state; browser history/form restoration may depend on the browser. The shared shell loads existing external fonts; existing site hosting and external services may have their own access logs. This is not a guarantee of anonymous network access.

Summaries are printed using the browser; PDF saving is user-controlled. No automatic sharing. No diary or reminders in this release. No clinic monitoring.

## Mandatory pre-launch checks

- [ ] Assign clinician and approve every branch, source and result, with date/version.
- [ ] Confirm clinic number, opening hours and after-hours instructions; no unverified emergency provider is named.
- [ ] Translate the complete hub and tool journeys into Malayalam, then obtain native and clinical review. English-only implementation currently exists.
- [ ] Human ruler check on at least one phone, tablet, desktop and printed A4 page.
- [ ] Check 200% zoom, portrait/landscape, small screens, and full-grid visibility.
- [ ] Keyboard and screen-reader check of questions, errors, live messages and result focus.
- [ ] Test Safari/iOS, Chrome/Android and desktop browsers, including print output.
- [ ] Pilot with 8–12 representative adults: observe setup, eye covering, fixation, interpretation, urgent next steps, and privacy understanding.
- [ ] Record issues, fix them, and repeat affected checks.
- [ ] Approve minimal aggregate event measurement if desired; no symptom values or health answers in analytics. None is currently installed.
- [ ] Only then replace preview gating, add public navigation/footer/home links, update metadata and sitemap, and verify public release.

No actual clinical approval, translation review, patient pilot or physical sizing validation is claimed by this implementation.

## Pilot script

Ask each participant to find the correct tool for (a) new flashes, (b) diabetes without symptoms, (c) wavy lines. Use fictional cases only. Observe whether urgent care is understood without completing a form. Ask them to explain a normal-looking Amsler result in their own words. Observe ruler setup and each-eye instructions. Test one-handed mobile use and larger text. Record completion, confusion, assistance needed and comprehension without collecting unnecessary medical histories.

## Maintenance and rollback

Review feedback during the first month and clinically at least at the agreed review interval. Check contact links whenever operations change. Re-test grid behaviour after display changes. Normal builds currently remove the entire feature; this is also the initial disable mechanism. Treat any delayed-care or misleading-result report as an immediate review issue. Keep a versioned record of clinical sign-off for each future change.

## Verification record — 24 October 2026

- Production build passed; zero vision-check routes generated.
- Preview build passed; hub plus all four tool pages generated.
- Automated decision-rule tests passed (eight cases, including each red flag, symptom precedence, pregnancy, unknown histories, gestational diabetes and either-eye Amsler observations).
- Browser: hub and all four tool pages loaded; new symptom produced immediate care advice before completing the form; reset hid the old result.
- Browser: diabetes sudden-symptom selection produced immediate advice without completing the form.
- Browser: both-eye unchanged observations without calibration produced “Grid setup was not confirmed”; a changed observation produced contact guidance.
- Browser: five correct quiz answers produced 5/5 and a knowledge-only explanation. No captured browser error logs during the tested journeys.
- Pending: physical ruler/paper sizing, print visual QA, responsive device matrix, screen reader, full browser matrix, native-language review, clinical approval and patient pilot.
