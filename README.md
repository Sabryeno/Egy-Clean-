# Egy Cleans

A premium bilingual (English / العربية) mobile marketplace for multi-vendor home
cleaning in Egypt, built from the Claude Design handoff in `project/Egy Cleans.dc.html`.

Two implementations live here:

| App | Path | Notes |
|-----|------|-------|
| **Flutter (Android)** | [`egy_cleans/`](egy_cleans/) | Native app with eased login, live pricing, and real-time in-app sync. **Build the APK via GitHub Actions** (`.github/workflows/build-apk.yml`) or `flutter build apk`. See [egy_cleans/README.md](egy_cleans/README.md). |
| **React + Vite + TS** (web) | `src/`, `index.html` | The original web port (below). |

---

## React web app

Implemented in **React + Vite + TypeScript**.

## Run it

```bash
npm install
npm run dev        # dev server (Vite) → http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
```

Open the app and the animated splash auto-advances to login. Log in as
**Individual** (customer app) or **Corporate** (vendor app — try "Simulate
approval" or "Continue with limited access" from the review screen).

## What's implemented

- **Auth:** splash → login (Individual/Corporate) → signup → corporate document
  registration → under-review.
- **Customer app:** home dashboard, search, vendor profile, 2-step booking with a
  live-updating **Estimated total** (rate × hours × cleaners × property multiplier
  + supplies, then 5% platform fee + 14% VAT), summary, payment (7 methods),
  success, bookings (upcoming/past), account, notifications, personal details.
- **Company app:** dashboard (analytics + weekly earnings chart + filter sheet),
  services with add/edit form, customer history, notifications (cash Approve /
  paid Acknowledge), profile (editable contacts, locked verified docs with expiry
  highlighting, staff management + add-staff form).
- **Cross-cutting:** EN⇄AR toggle with full RTL mirroring, light/dark theme.

## Architecture

- `src/state/` — the app "brain," a faithful port of the prototype's logic:
  - `i18n.ts` (EN/AR dictionaries), `data.ts` (companies, rates, initial state,
    theme tokens), `types.ts`, `helpers.ts` (pricing, formatting, pills).
  - `vals.tsx` — `buildVals(state, api)` computes every derived value and action
    handler (the port of the prototype's `renderVals`). Its return type `Vals` is
    the contract every screen consumes.
  - `AppContext.tsx` — single `useState` store + `set`/`setState`/`go` actions +
    splash timer; provides `state` and computed `vals`.
- `src/lib/css.ts` — `css("a:b;c:d")` parses inline-style strings into React style
  objects, letting the prototype's exact styles (incl. `--var` theme tokens) port
  verbatim.
- `src/components/` — `Phone` (frame, status bar, theming, scroll area),
  `StickyBars` (bottom price bars + tab navs), `Sheets` (property + filter
  bottom-sheets).
- `src/screens/` — one component per screen, each gated on its `vals.isX` flag.

The original design files remain untouched in `project/` for reference.

---

# HANDOFF BUNDLE (original) — for reference

This is a **handoff bundle** from Claude Design (claude.ai/design).

A user mocked up designs in HTML/CSS/JS using an AI design tool, then exported this bundle so a coding agent can implement the designs for real.

## What you should do — IMPORTANT

**Read the chat transcripts first.** There are 1 chat transcript(s) in `chats/`. The transcripts show the full back-and-forth between the user and the design assistant — they tell you **what the user actually wants** and **where they landed** after iterating. Don't skip them. The final HTML files are the output, but the chat is where the intent lives.

**Read `project/Egy Cleans.dc.html` in full.** The user had this file open when they triggered the handoff, so it's almost certainly the primary design they want built. Read it top to bottom — don't skim. Then **follow its imports**: open every file it pulls in (shared components, CSS, scripts) so you understand how the pieces fit together before you start implementing.

**If anything is ambiguous, ask the user to confirm before you start implementing.** It's much cheaper to clarify scope up front than to build the wrong thing.

## About the design files

The design medium is **HTML/CSS/JS** — these are prototypes, not production code. Your job is to **recreate them pixel-perfectly** in whatever technology makes sense for the target codebase (React, Vue, native, whatever fits). Match the visual output; don't copy the prototype's internal structure unless it happens to fit.

**Don't render these files in a browser or take screenshots unless the user asks you to.** Everything you need — dimensions, colors, layout rules — is spelled out in the source. Read the HTML and CSS directly; a screenshot won't tell you anything they don't.

## Bundle contents

- `README.md` — this file
- `chats/` — conversation transcripts (read these!)
- `project/` — the `Egy Cleans mobile marketplace` project files (HTML prototypes, assets, components)
