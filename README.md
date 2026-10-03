# BuildWave

**A referral-powered registration engine for the free workshop _“Build Your First AI Project in 60 Minutes.”_**

Built for the NxtWave Growth Challenge. The goal: get **500 final-year engineering students** to register, on a **₹2,000 budget** over **7 days**.

🔗 **Live demo:** _enable GitHub Pages (Settings → Pages → Source: GitHub Actions) and the link appears here._

---

## Why this isn't a landing page

The brief hinted that *everyone* will build a landing page — so a landing page can't be the differentiator. And ₹2,000 can't *buy* 500 registrations (it's ~10–15 paid clicks). The only path to 500 on that budget is to **make the first registrants bring the next ones.**

So BuildWave isn't a form that collects signups. It's the **growth loop itself**:

1. **Pick what you'll build** — an interactive idea generator shows each student the exact project they'll walk out with. Personalisation is the hook; they register for *their* project, not a generic pitch.
2. **Scarcity** — a live seat counter (`341 / 500`) and a countdown turn "maybe later" into "now."
3. **Referral engine** — every registrant gets a unique link. Bring two friends → unlock the Project Starter Kit + priority batch.
4. **Leaderboard** — top referrers earn a Verified Builder badge. Final-year CSE students live in ranking culture (LeetCode, Codeforces); a public board makes them compete to invite.
5. **Organizer view** — the same engine from the growth side: K-factor, cost-per-registration, and the funnel from seed → 1st-degree → 2nd-degree referrals.

The full reasoning and the funnel math that reaches 500 are in **[GROWTH_PLAN.md](GROWTH_PLAN.md)**.

---

## What's inside

| File | What it is |
|------|------------|
| `index.html` | The whole single-page app |
| `assets/styles.css` | Design system — tokens, components, responsive, reduced-motion |
| `assets/app.js` | App logic: idea generator, registration, referral tracking, leaderboard, organizer funnel, confetti |
| `assets/data.js` | Content + seed data (project ideas, seeded leaderboard, share copy) |
| `GROWTH_PLAN.md` | The 5-slide growth plan (persona, channels, budget, funnel math) |
| `AI_NOTES.md` | What I asked AI → what it suggested → what I changed (incl. what I rejected) |
| `.github/workflows/deploy.yml` | Auto-deploys to GitHub Pages on every push to `main` |

**Zero dependencies, zero build step.** Plain HTML/CSS/JS so it runs by opening `index.html` and deploys to any static host.

---

## Run it

```bash
# just open it
open index.html            # macOS   (xdg-open on Linux)

# or serve locally (so referral links use http://, not file://)
python3 -m http.server 8000
# → http://localhost:8000
```

## Deploy (GitHub Pages)

1. Push to GitHub.
2. **Settings → Pages → Source: GitHub Actions.**
3. The included workflow publishes the site on every push. The live URL shows up in the Pages settings.

---

## Prototype vs. production

This is a working **prototype**: registrations and referral counts persist in the browser's `localStorage`, and the leaderboard is pre-seeded so the page looks alive. Real referrals travel across different phones — so the **Organizer view** includes a *Simulate referrals* control to demonstrate the loop in a single browser.

Making it production-ready is a small, well-isolated change: **every read and write goes through the `Store` object in `app.js`.** Swap its four methods (`load` / `save` / `reset` / `get`) for Supabase or Firestore calls — a single table of `registrations(code, referred_by, …)` — and nothing else in the app changes. Add a serverless endpoint for the signup write and the same UI runs on real, cross-device data.

---

_Names, colleges, and counts shown are illustrative prototype data._
