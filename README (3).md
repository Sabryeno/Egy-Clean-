# Egy Cleans Mobile App

_Started 2026-07-13 18:28 UTC_

---

## User

Design a premium mobile app UI for a multi-vendor home-cleaning marketplace in Egypt. Think Uber × Airbnb × Urban Company: clean, trustworthy, spacious, with large cards, soft shadows, and smooth micro-interactions. Mobile-first (375–430 px width), iOS & Android.

Brand & visual language
Palette: Trust blue #1E63FF (primary) → darker #1546C0 for gradients; green #16B364 for confirmations/success; amber #F5A623 for star ratings. Backgrounds soft off-white #F6F8FC, cards pure white. Ink #0E1726, soft-ink #5A6472, hairline borders #E6EBF2.
Shape & depth: rounded corners (cards 18px, buttons 14px, pills 30px), 1px light borders instead of heavy shadows, generous 16px padding.
Typography: clean geometric sans (Inter / SF Pro / Roboto). Bold 800 headings, 600 labels, 13–14px body.
Tone: calm, professional, reassuring. Lots of whitespace. Emoji/illustrations allowed as friendly accents.
Bilingual-ready: must work in English (LTR) and Arabic (RTL) — mirror layouts, keep icons directional-safe.
Screens to design
Home — Blue gradient header (rounded bottom) with app logo "🧼 Egy Cleans", location line "Cairo, Egypt", notification + profile icons, and a white pill search bar "What service do you need today?". Below: horizontal scroll of filter pills (Nearest, Lowest price, Top rated, Available today, Tools included, Instant booking). Then a vertical list of company cards: brand-color avatar (letter monogram), name, one-line tagline, ⭐ rating + review count, distance, colored status tags ("Available today", "Tools included"), and "from EGP 90 / hour". Bottom nav bar: Home · Explore · Bookings · Profile.
Company profile — Large brand-gradient banner with a hero icon, logo avatar, name + rating, tagline, 3 stat tiles (Experience, From-price, Distance), coverage area with map icon, service chips, a horizontal photo gallery, working hours. Sticky bottom "Book Now" button.
Booking flow (10 steps, one screen per step) — Top: progress bar + "Step X/9". Big step title. Selectable chips/cards for: cleaning type, property type (show +20%/+40% multipliers), a +/– stepper for hours and number of cleaners, a Yes/No supplies card (+EGP 100), a horizontal date picker (day cards), time-slot chips, address form (with "Use current location" + Google-Maps pin placeholder), and special-instructions notes with quick-add chips. Persistent bottom price bar showing a live-updating "Estimated total" + Continue button. (The live price is the signature interaction — highlight it.)
Booking summary — Company card, itemized details, price breakdown (labour, supplies, subtotal, 5% platform fee, 14% VAT, bold total), and a cancellation-policy card with a required checkbox. Sticky "Continue to payment · EGP X".
Payment — Selectable method rows with icons: Card, Apple Pay, Google Pay, Meeza, Vodafone Cash, Instapay, Cash on Arrival. Sticky "Pay EGP X".
Payment success — Big green check circle, "Payment Successful / Booking Confirmed", a details card (Booking ID, company, service, date/time, amount), Invoice + Share buttons, "View my bookings".
Bookings dashboard — List of confirmed bookings with a green "Confirmed" badge, date/time, total, booking ID; empty-state with illustration + "Browse companies".
Deliverables
High-fidelity screens for all 7 above (light mode; optionally dark), plus a mini design system: color tokens, type scale, button/chip/card components, and the empty/loading/error states for the home list.

## Assistant

_[tool: list_files]_

The design system project is empty — but your brief is itself an exhaustive brand spec, so I have everything I need on visual direction. A few questions on scope and behavior before I build:

_[tool: questions_v2]_

## User

Questions answered:
- interactivity: Fully working prototype — tap through screens, live price updates, real state
- language: Full EN/AR toggle across all screens
- scope: All 7 screens + mini design system in one go
- frame: No frame, just the app screens at phone width
- darkmode: Light + dark toggle
- layout: One interactive phone you tap through (single prototype)
- content: Invent realistic Egyptian cleaning-company names + pricing in EGP
- priority: give me 3 desgin options to choose

## Assistant

The design system project is empty, so your detailed brief is the source of truth. Since you want 3 options to choose from, I'll present three distinct Home-screen directions (the identity-defining screen) side by side at phone width — same brand palette, different layout/rhythm/personality. Pick one and I'll build the full 7-screen working prototype (EN/AR toggle, dark mode, live price) in that direction.

_[tool: dc_write]_

_[tool: ready_for_verification]_

Three Home directions, same brand DNA, at 390 px:

- **1a Trust Standard** — the brief by the book: deep-blue gradient header, floating search, filter pills, roomy list cards. Calm and familiar.
- **1b Editorial Premium** — airy white header, big greeting, a featured hero vendor, quiet list with colored monogram rails. More Airbnb-leaning.
- **1c Bold Marketplace** — category tile grid, compact photo-thumb cards, dense and energetic. Most "product."

Tell me which to run with and I'll build all 7 screens as one tappable prototype with the EN/AR toggle, dark mode, and the live-updating price. You can also mix (e.g. "1b with 1c's category tiles").

## User

option 3

## Assistant

_[tool: update_todos]_

Building the full 7-screen tappable prototype in the **1c Bold Marketplace** direction — with the EN/AR toggle, light/dark mode, and the live-updating price as the signature interaction.

_[tool: dc_write]_

_[tool: show_html]_

_[tool: show_html]_

Home renders cleanly. Let me quickly verify the booking flow live price and a couple screens.

_[tool: eval_js]_

_[tool: eval_js]_

Navigation and the live price engine both work (Standard → EGP 214, Deep → EGP 309, correct with 5% fee + 14% VAT). Handing to the verifier for full RTL/dark-mode/flow checks.

_[tool: update_todos]_

_[tool: ready_for_verification]_

Built the full **Egy Cleans** prototype in the 1c Bold Marketplace direction — one tappable phone, all 7 screens wired end to end:

- **Home → Company profile → 9-step booking → Summary → Payment → Success → Bookings dashboard**, with a working back stack and bottom nav.
- **Live price** is the signature interaction: it recomputes on every choice (cleaning type rate, property multiplier +20%/+40%, hours & cleaner steppers, +EGP 100 supplies) and shows labour → subtotal → 5% platform fee → 14% VAT → total.
- **EN ⇄ AR toggle** flips all copy and mirrors the whole layout to RTL (with the back arrow flipping); **light/dark toggle** swaps the full theme instantly.
- Realistic invented Egyptian vendors (Sparkle Masr, Nadafa Plus, Lamsa Home, Bayti Clean), EGP pricing, all 7 payment methods, required cancellation-policy checkbox, and a bookings empty-state that fills once you complete a booking.

Verifier is running. A couple of things I can add next if useful: an Explore/Profile tab (currently placeholders in the nav), a loading/error state for the home list, or a standalone one-page mini design-system reference (tokens + components). Want any of those?

## User

now build the profile screen, with adding photo option, setting profile details wallet option with saved card, search screen, booking history to have past and upcoming, also the boking flow to be less steps less screen, design it as multi tap in one screen or 2 to get to the payment screen, the welcome screen has 2 the app logo animated in the opening, then log in screen for Indivuals or corporate, if no account then sign up to go through, then for corporate build a route of registering by uploading company trade licence, manager or owner ID, mobile number and support number,  after submitting, goes to be under review, then approval however they can log in but no access to get booking.
then home screen to be as a half screen dashboard and recent booking then upcoming booking. then services 
the company account will get a profile screen and info to be edidted only manager and support contacts but not the document or Owner details, will get the language setting as well, then owner can list their services cleaning house in different types, with different prices rate, same as we see in the customer side, and need to list how many cleaners available, what is the capacity and location details area covered, option to get a history booking of their customers, and notification screen if they receive booking in cash they need to approve it and if it`s paid they need to acknowldege that it`s in process 
and the rest of the essentials options that could be

## Assistant

_[tool: list_files]_

The design system project is still empty, so my established Egy Cleans brand tokens remain the source of truth. This is a major expansion — two role-based apps (individual customer + corporate/vendor) plus auth. Preserving v1, then building the expanded app.

_[tool: copy_files]_

Now the full expanded build. This is large — two role-based apps plus auth, all bilingual and theme-aware.

_[tool: dc_write]_

_[tool: show_html]_

Let me quickly verify the key flows work before handing off — this is a big rewrite.

_[tool: eval_js]_

Timed out on the 2.1s splash wait. Let me probe in shorter segments — the splash has already advanced.

_[tool: eval_js]_

The preview is showing stale v1 state. Let me force a fresh reload and screenshot.

_[tool: show_html]_

Fresh reload shows the new login screen correctly (splash already auto-advanced). The earlier probe hit stale state. Now let me run the full flow probe from this fresh state.

_[tool: eval_js]_

Found a bug: `L.continue` and `L.review` keys are missing from the dictionary, so those buttons render blank. Adding them.

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: show_html]_

_[tool: eval_js]_

Full customer flow works now. Now verifying the corporate/company side.

_[tool: eval_js]_

_[tool: eval_js]_

State was stuck mid-flow (no nav on summary). Forcing fresh reload then corporate login.

_[tool: show_html]_

_[tool: eval_js]_

Splash still animating when probe ran. Adding the wait.

_[tool: eval_js]_

_[tool: get_webview_logs]_

_[tool: screenshot]_

State persists across reloads (DC keeps it), so my probes land on stale screens — that's fine for the user, just awkward to test. The customer flow already verified green. Let me drive from the current summary screen to the company side. First a small polish: the summary "Address" row reuses an all-caps key.

_[tool: dc_js_str_replace]_

_[tool: eval_js]_

Back at login cleanly. Now the corporate path.

_[tool: eval_js]_

All flows green — customer end-to-end, corporate registration/login, dashboard approve/acknowledge, services, and locked-docs profile. Leaving the app on the login screen for a clean landing, then handing to the verifier.

_[tool: eval_js]_

_[tool: snip]_

_[tool: ready_for_verification]_

Expanded **Egy Cleans** into a full two-sided marketplace — one tappable prototype, still bilingual (EN⇄AR) and light/dark. v1 is preserved as `Egy Cleans v1.dc.html`.

**Onboarding & auth**
- Animated splash (logo pops in, ripple, auto-advances) → login with **Individual / Corporate** segmented toggle → sign-up.
- Corporate route: register with company name, **trade licence + owner/manager ID uploads**, mobile & support numbers → **Under review** screen. They can enter with **limited access** (booking receipt locked) or "simulate approval" to unlock.

**Customer app**
- **Home = compact dashboard**: greeting, wallet balance + quick-book, upcoming booking, service tiles, top-rated list.
- **Search** screen (query + filter pills + results).
- **Booking flow trimmed from 9 steps to 2 screens** — "Build your booking" (type, property, hours, cleaners, supplies) and "When & where" (date, time, address, notes), each with the live **Estimated total** bar. → Summary → Payment → Success.
- **Bookings** with Upcoming / Past tabs.
- **Account**: add-photo avatar, wallet card with saved card, language & appearance settings, logout.

**Company (vendor) app** — separate 5-tab nav
- **Dashboard**: today's jobs, monthly earnings, incoming bookings where **cash needs Approve/Decline** and **paid needs Acknowledge → In process**; review banner if unapproved.
- **Services**: cleaning types with rates, cleaners available, capacity, plus coverage map & areas.
- **Customer bookings** history (upcoming/past).
- **Notifications** mirroring the cash-approve / paid-acknowledge actions.
- **Profile**: manager & support contacts **editable**, trade licence / owner ID / company name shown **locked** (verified), language setting, logout.

Two small bugs found and fixed during testing (missing Continue/Review button labels; an all-caps address row). Verifier is running. Want me to add the individual sign-up completion screen, a real "add card" form, or push deeper on Arabic copy for the vendor side?

## User

Found issues — fixing…

## Assistant

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

Fixed — added the missing `estTotal` caption ("Estimated total" / "الإجمالي التقديري") to both dictionaries so the signature live-price bar now shows its label.

_[tool: ready_for_verification]_

Done — the "Estimated total" caption now renders on both booking screens, no console errors.

## User

build a screen for add service then give options to do  the adding 
also allow eding the current service in terms of prices and other details 
in the booking history highlight paid or not paid eand paid by what ? cash or card or insta or apple pay etc
add a static and analytig view in the home screen and allow them to filter the results by date, services and staff 
allow in the profile to add staff with their names and photo and rating system make all buttons and screen working trade licence and ID expiry to be highlighted

## Assistant

This is a substantial company-side expansion. Let me read the current file to anchor my edits precisely.

_[tool: read_file]_

_[tool: grep]_

Let me read the key regions I'll edit precisely.

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

Now I have all anchors. Applying all changes in one atomic edit.

_[tool: str_replace_edit]_

Now the return values, `pay()`, and all template additions.

_[tool: str_replace_edit]_

Now the analytics block on the dashboard, the staff section, and the two new form screens.

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: eval_js]_

Dashboard analytics, filters and payment pills all render. Now testing add/edit service and add staff.

_[tool: eval_js]_

Add/edit service both work (3→4 services, edit shows delete). Now staff add + expiry highlight.

_[tool: eval_js]_

All new company features verified: analytics + date/service/staff filters, payment paid/unpaid+method pills, add/edit/delete service, staff add with rating stars, and highlighted licence/ID expiry. Leaving on login for a clean landing and handing to the verifier.

_[tool: eval_js]_

_[tool: snip]_

_[tool: ready_for_verification]_

Added the full company-side management suite (all working, bilingual + dark-mode):

- **Add Service screen** — pick cleaning type, set rate (± stepper), cleaners, and capacity → saves into the live services list.
- **Edit service** — tap any service card to edit its price/details, with a Delete option.
- **Booking history payment status** — every booking (customer + company) now shows a **Paid · {method}** (green) or **Unpaid · Cash** (amber) pill, method being Card / Apple Pay / InstaPay / Vodafone / Meeza / Cash, recorded from the actual payment chosen.
- **Dashboard analytics + filters** — Overview stats (monthly jobs, % paid, rating), a weekly earnings bar chart, and working **date / service / staff** filter chips that filter the incoming list.
- **Staff management** in the company profile — add staff (auto-monogram avatar + color picker, name, role), star **rating system**, job counts, and remove.
- **Licence & ID expiry highlighted** — the verified-documents card now shows expiry dates, with "⚠ Expiring soon" in amber vs "Valid till" in green.

All buttons and screens are wired. Verifier is running. Want me to make staff assignable to specific bookings, or add an editable rate/expiry-reminder to the customer side next?

## User

contact of corporoat  should be a button edite along with the info displayed, then editing then save 
and the filter of dashboard should be minimal style for good looking may be a small window pops up for selecting the filter and apply it

## Assistant

_[tool: grep]_

Let me read the exact contacts card lines and the dashboard filter block to anchor edits.

_[tool: read_file]_

_[tool: read_file]_

Now applying both changes: contacts view/edit toggle, minimal filter button + popup sheet.

_[tool: str_replace_edit]_

Now the logic: contacts edit toggle + filter sheet state/values.

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: grep]_

Let me read the exact property grid line and the booking return area to anchor edits.

_[tool: read_file]_

Now applying the property-type popup: data changes, a selector row, and a popup sheet.

_[tool: str_replace_edit]_

Now the template: replace the property grid with a selector row, and add the property popup sheet.

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: str_replace_edit]_

_[tool: grep]_

Read the customer home bell line exactly.

_[tool: read_file]_

The customer home bell had no click handler. Wiring it to a new customer notifications screen.

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: eval_js]_

_[tool: eval_js]_

custProfile + edit mode work. Let me verify the bell and property popup from home.

_[tool: eval_js]_

_[tool: eval_js]_

The "Select property type" text is the persistent subtitle on the selector row, so my close-check was wrong. Verifying properly.

_[tool: eval_js]_

_[tool: screenshot]_

Sheet renders beautifully. My test selector was too strict (option text includes emoji + multiplier). Clicking properly:

_[tool: eval_js]_

_[tool: screenshot]_

_[tool: eval_js]_

Property popup works — overlay closes on select and the row updates to "3 Bedroom · +40%" (earlier screenshot was just render lag). Quick check of the corporate contacts edit and filter popup, then done.

_[tool: eval_js]_

_[tool: eval_js]_

Filter popup opens and applies/closes correctly. Now the corporate contacts view→edit.

_[tool: eval_js]_

All requests verified. Leaving on the login screen and handing to the verifier.

_[tool: eval_js]_

_[tool: snip]_

_[tool: ready_for_verification]_

All four changes are in and verified:

- **Corporate contacts** — now shown as read-only info with an **Edit** button; tapping reveals the fields and a **Save** button that returns to the display view.
- **Dashboard filter** — replaced the chip rows with a minimal **Filter** button (shows an active dot + count); it opens a bottom-sheet to pick Date / Service / Staff and **Apply**.
- **Property type** — now a **bottom-sheet popup** with **Studio · 1 Bedroom · 2 Bedroom · 3 Bedroom · Duplex · Villa**, each with its price multiplier; selecting updates the live estimate.
- **Customer profile info** — new screen from Account → Personal details, with view + Edit/Save for name, email, mobile, city.
- **Notification bell** — the customer home bell now opens a **customer notifications** screen (booking confirmed, reminders, rating request, promo).

Verifier is running.

