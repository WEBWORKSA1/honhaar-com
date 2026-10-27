# Honhaar.com — Scholarships, Contests & Careers for Promising Students

Free scholarship finder (35+ programmes across India, Pakistan and fully funded study abroad), deadline tracker, study-abroad / education-loan / CGPA tools, 9 long-form guides, curated videos, monthly talent contests — monetised with Google AdSense, consented education leads, sponsorships and donations.

- **Stack:** Jekyll static site for **GitHub Pages (free plan)**. One shared layout (`_layouts/default.html`) carries the AdSense script, the top contact bar and the footer trademark disclosure.
- **Styles / scripts:** `assets/css/style.css`, `assets/js/main.js` (forms, finder, tools, countdown, video facades), `assets/js/data.js` (scholarship data).
- **Forms:** all submit by AJAX to a form-forwarding service; the destination inbox is encoded in `main.js` and never appears in plain text. The **first submission triggers a one-time activation email** to the inbox — click it once and every form is live.
- **Lead engine:** `/match.html` (4 steps) tags each lead HOT / WARM / NURTURE and attaches UTM + first-landing data.

## Live URL
https://webworksa1.github.io/honhaar-com/

## Move to honhaar.com (when ready)
honhaar.com currently resolves to the registrar's servers, so it is not set as the Pages domain yet (that would redirect the live site to a parked page).
1. DNS: A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; CNAME `www` → `webworksa1.github.io`.
2. In `_config.yml` set `url: "https://honhaar.com"` and `baseurl: ""`; add a `CNAME` file containing `honhaar.com`.
3. Settings → Pages → custom domain `honhaar.com` → **Enforce HTTPS**.
4. Apply for AdSense on honhaar.com (ads.txt is then served at the domain root) and submit `/sitemap.xml` in Google Search Console.

See `BUILD-PROMPTS.md` (phase-wise build prompts) and `RESEARCH.md` (concept, revenue model, 35-site benchmark).

Trademark: "Honhaar" is a common Hindi–Urdu word used descriptively. This site is not affiliated with the Government of Punjab (Pakistan) Honhaar Scholarship Programme or any other "Honhaar" brand. See `/trademark.html`.
