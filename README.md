# Honhaar.com — Scholarships, Contests & Careers for Promising Students

Free scholarship finder (35+ programmes across India, Pakistan and fully funded study abroad), deadline tracker, study-abroad / education-loan / CGPA tools, 9 long-form guides, curated videos, monthly talent contests — monetised with Google AdSense, consented education leads, sponsorships and donations.

- **Stack:** Jekyll static site for **GitHub Pages (free plan)**. One shared layout (`_layouts/default.html`) carries the AdSense script, the top contact bar and the footer trademark disclosure.
- **Styles / scripts:** `assets/css/style.css`, `assets/js/main.js` (forms, finder, tools, countdown, video facades), `assets/js/data.js` (scholarship data).
- **Forms:** all submit by AJAX to a form-forwarding service; the destination inbox is encoded in `main.js` and never appears in plain text. The **first submission triggers a one-time activation email** to the inbox — click it once and every form is live.
- **Lead engine:** `/match.html` (4 steps) tags each lead HOT / WARM / NURTURE and attaches UTM + first-landing data.

## Live
https://honhaar.com — GitHub Pages, deploy from `main` / root, custom domain via `CNAME`.
DNS: A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; `www` CNAME → `webworksa1.github.io`.

## Launch checklist
1. Settings → Pages → tick **Enforce HTTPS** once the certificate is issued.
2. Submit one test form and click the one-time activation email in the inbox.
3. Apply for AdSense on honhaar.com (ads.txt is served at the domain root).
4. Submit `https://honhaar.com/sitemap.xml` in Google Search Console.

See `BUILD-PROMPTS.md` (phase-wise build prompts) and `RESEARCH.md` (concept, revenue model, 35-site benchmark).

Trademark: "Honhaar" is a common Hindi–Urdu word used descriptively. This site is not affiliated with the Government of Punjab (Pakistan) Honhaar Scholarship Programme or any other "Honhaar" brand. See `/trademark.html`.
