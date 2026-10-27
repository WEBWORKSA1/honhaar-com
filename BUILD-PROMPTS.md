# Honhaar.com — Phase-wise Build Prompts

Use these prompts in order to rebuild, extend or audit the site. Each phase is self-contained.

---

## Phase 0 — Concept lock
> You are building **Honhaar.com** ("Honhaar" = promising/talented in Hindi–Urdu): a free scholarship, funding and talent-opportunity hub for students in India, Pakistan and the South Asian diaspora. Revenue: Google AdSense (publisher ca-pub-6620975821265271), consented education leads (study abroad, loans, online degrees, test prep), sponsorships, donations. The site is independent and must never imply affiliation with the Government of Punjab (Pakistan) Honhaar Scholarship Programme or any other "Honhaar" brand. Output a sitemap, page purposes, primary keyword per page and conversion goal per page.

## Phase 1 — Foundation & compliance
> Create a Jekyll static site for GitHub Pages free plan with `_config.yml` (url + baseurl), one shared layout `_layouts/default.html`, `assets/css/style.css`, `assets/js/main.js`, `assets/js/data.js`. In the layout `<head>` include exactly:
> `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6620975821265271" crossorigin="anonymous"></script>`
> Add at the very top of every page: "Contact, if you are interested in this website/domain name/Sponsorship/Advertisement/Partnership" linking to https://web.works/contact. Add ads.txt (`google.com, pub-6620975821265271, DIRECT, f08c47fec0942fa0`), robots.txt, sitemap.xml (Liquid), web manifest, favicon, OG image, 404. Add Privacy (AdSense cookie disclosure + opt-out links), Terms (incl. contest terms), Disclaimer, Cookies, Trademark & Copyright pages, and a footer trademark disclosure on every page.

## Phase 2 — Design system
> Build a warm, aspirational, accessible design: cream background, deep teal primary, marigold accent; Fraunces display + Plus Jakarta Sans body; light/dark themes with stored preference; sticky header, mobile burger menu, sticky mobile CTA bar; cards, pills, chips, multi-step forms, tabs, FAQ accordions, reduced-motion support; print styles. No frameworks; mobile-first; no horizontal scroll at 360 px.

## Phase 3 — Hidden-inbox forms
> All forms (`form.js-form`) submit via AJAX to a form-forwarding endpoint whose destination inbox is XOR-encoded in `main.js` and never appears in HTML or as plain text. Include honeypot, consent checkboxes, success/error states, UTM + first-landing attribution, and a `[data-mail]` link handler that opens email without exposing the address in markup. The only inbox used site-wide is the owner's single private inbox.

## Phase 4 — Scholarship finder (core product)
> Build `data.js` with 35+ real programmes (India, Pakistan, international fully funded) — name, provider, region, destination, level, type, funding, typical closing month, official URL, own-words summary. Build `/scholarships.html` with keyword search, region/level/type/funding filters, sort (fully funded / closing soonest / A–Z), quick chips, URL params (`?q=`, `?region=`, `?level=`), save-to-favourites (localStorage), "closing soon" badges and official-site buttons. Home page shows "Closing soon" and featured fully funded awards from the same data.

## Phase 5 — Lead generation engine
> Build `/match.html`: a 4-step, high-conversion form (situation → needs → budget & timeline → contact) with progress bar, choice cards, optional partner-consent checkbox, privacy consent, under-18 guardian note, and a lead tier (HOT/WARM/NURTURE) computed from timeline, needs, budget and phone. Redirect to `/thank-you.html` with next actions. Add match CTAs in hero, finder sidebar, tools results, guide callouts, mobile CTA bar.

## Phase 6 — Tools
> `/tools.html` with tabs: study-abroad cost estimator (8 countries, living style, scholarship slider, optional PKR conversion), education-loan EMI calculator with simple/compound moratorium interest and Section 80E note, CGPA→% converter (CBSE, linear, Mumbai, AKTU, 4.0 estimate), backward deadline planner (domestic vs international), application readiness checklist saved locally.

## Phase 7 — Content for AdSense approval & SEO
> Write 9+ original long-form guides (900–1,500 words): scholarship essay, SOP, interviews, fully funded scholarships table, education loans, Indian government scholarships (NSP), independent explainer of the Punjab Honhaar Scholarship (non-affiliation callout, official link only), scholarship scams, winning competitions. Each with TOC/callouts, internal links to tools/finder/match, unique title + meta description.

## Phase 8 — Video & engagement
> `/videos.html` with verified YouTube IDs grouped by Study smarter / Mindset / Applications, privacy-enhanced click-to-load facades, and one-line takeaways. Monthly contest page `/contests.html` with live countdown (last day of month, 11:59 pm IST), monthly theme, prize tiers, rubric, rules, calendar and submission form.

## Phase 9 — Money pages
> `/support.html` donations (one-time/monthly, tiers, currencies, purpose allocation: prizes, research, outreach, hiring, ops; payment link sent by email — no card fields). `/careers.html` hiring (researchers, writers, video creators, campus ambassadors, mentors, judges) with application form. `/partners.html` sponsorship packages, scholarship listing, consented enquiries, advertising and domain acquisition.

## Phase 10 — QA, deploy, launch
> Validate every page renders the AdSense script once, the top contact bar, footer disclosure; no inbox string in any file; all internal links resolve with baseurl; Lighthouse ≥ 90 mobile. Push to `webworksa1/honhaar-com`, publish with GitHub Pages. When honhaar.com DNS is pointed to GitHub Pages: set `url: https://honhaar.com`, `baseurl: ""`, add `CNAME`, enforce HTTPS, then apply to AdSense and submit the sitemap in Search Console.

## Phase 11 — Growth (post-launch)
> Weekly: verify 10 listings and add 5 new; publish 1 guide; send Monday Deadline Alerts. Monthly: run contest, publish winners, pitch one Prize Partner. Quarterly: add Hindi and Urdu versions of top guides; add state-wise India pages and province-wise Pakistan pages; build a partner lead-routing sheet with per-lead pricing.
