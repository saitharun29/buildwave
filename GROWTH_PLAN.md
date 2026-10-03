# Growth Plan — 500 registrations, ₹2,000, 7 days

> Workshop: **Build Your First AI Project in 60 Minutes** · Audience: final-year engineering students
> This is the 5-slide plan. The working asset that executes it is in this repo (see [README](README.md)).

---

## Slide 1 — The student

**Who:** Final-year B.Tech students (CSE and adjacent — ECE, IT), deep in placement season.

**What keeps them up at night:** Interviews are weeks away and their resume has coursework but **no real project to point to.** They watch batchmates land shortlists and feel behind.

**Why they'd care about this workshop:** It removes the scariest part of "build a project" — starting. 60 minutes, free, and you leave with something concrete to put on a resume and talk about in an interview.

**What makes them actually register (not just "interesting, maybe later"):**
- They can *see their specific project* before signing up (not a vague "learn AI").
- Friends from their own class are doing it — social proof beats a cold ad.
- Seats are limited and visibly filling — loss aversion.

---

## Slide 2 — The core insight

**₹2,000 cannot buy 500 registrations.** That's ~10–15 paid clicks. Anyone running ads here has misread the constraint.

**The budget forces a referral strategy.** The only way to 500 is to make each registrant recruit the next ones. So the plan optimises for one number:

> **K-factor** = invites sent per registrant × conversion rate. If each student brings even ~1 more who converts, growth compounds instead of being bought.

The ₹2,000 isn't ad spend — it's a **reward pool** that fuels the loop.

---

## Slide 3 — Channels (prioritised, not 20 ideas)

Three channels, in order. Everything else is deliberately cut.

**1. College WhatsApp groups — the engine (primary).**
Where this audience already is. Warm, instant, free. Seed via **class reps and coding-club heads**: one message from a trusted rep hits 60–200 students at once. The referral link is built to be dropped straight into these groups (one-tap WhatsApp share, with Open-Graph preview).

**2. Coding / tech clubs + student ambassadors (amplifier).**
Club leads announce it; top referrers become micro-ambassadors chasing the leaderboard. This is what turns a flat blast into a compounding loop.

**3. Targeted LinkedIn + email (closer).**
A few well-written posts and a short email to known final-year contacts, for the students not reachable via #1. Low volume, catches the stragglers.

**Budget split of ₹2,000:**
| Item | ₹ | Why |
|---|---|---|
| Referral reward pool (vouchers for top ~15 referrers) | 1,400 | Fuels the loop — the one thing that drives virality |
| Starter-kit assets / Canva Pro / printables for reps | 400 | Makes the kit and club posters look legit |
| Buffer | 200 | Contingency |

---

## Slide 4 — How 500 comes in (the funnel math)

Conservative, compounding — not a single big push.

| Source | Registrations |
|---|---|
| **Seed:** ~12 class reps + club heads blast their groups, Day 1–2 | ~60 |
| **1st-degree:** each registrant brings ~1.1 friends via the kit-unlock mechanic (invite 2 → reward) | ~270 |
| **2nd-degree:** a share of those friends refer again, chasing the leaderboard | ~170 |
| **Total by Day 7** | **~500** |

**7-day cadence** (anti-spam — three waves, not constant noise):
- **Day 1–2:** reps seed groups → ~60 in. Leaderboard goes live.
- **Day 3:** "seats filling — 300 left" nudge + top-referrer shout-outs.
- **Day 4–5:** reward pool announced; ambassadors push hardest.
- **Day 6:** "last 100 seats" urgency wave.
- **Day 7:** final call, counter near full.

**Why it works:** scarcity creates urgency, the idea generator converts the click, and the reward + leaderboard turn every registrant into a channel — so acquisition cost trends toward **₹0 per registration** instead of the ₹130+ paid ads would cost.

---

## Slide 5 — What I built

Not a landing page (the brief warned everyone builds one). A **referral-powered registration engine** — the loop above, working:

- Interactive **idea generator** (the conversion hook)
- Live **seat counter + countdown** (scarcity)
- **Referral engine** with unique links + one-tap WhatsApp share
- Gamified **leaderboard** with Verified Builder badges
- **Organizer view** showing K-factor, cost-per-reg, and the referral funnel live

Zero-dependency, deployed on GitHub Pages, architected so a one-file swap takes it from prototype to real cross-device data.

### The three reflection questions

**What changed between first idea and final solution?**
First idea was a polished landing page with a signup form. I rejected it on two grounds: the brief said everyone would build one, and a form doesn't *generate* registrations — it only collects them. The final solution makes the asset *be* the growth mechanism (referral loop + leaderboard), because on a ₹2,000 budget virality is the only thing that reaches 500.

**If I had another 24 hours, what would I improve?**
Wire a real backend (Supabase) so referrals work across devices, not just in one browser; add a serverless signup endpoint and a simple admin auth for the organizer view; and A/B test two hero headlines to lift the register conversion.

**What did AI suggest that I rejected?**
See [AI_NOTES.md](AI_NOTES.md) — the headline rejections were paid ads, a generic landing page, and over-stuffing the plan with 20 channels.
