# Now & Next — Project Plan

A web app for parents and carers of autistic children. Tools to support daily routine, transitions, and communication.

---

## Vision

Calm, clear, and reassuring. Not clinical. Not babyish. Designed for the child but usable by the parent. The kind of thing you'd be happy to put on a tablet and hand to your kid.

**Tone:** Friendly, warm, simple. Language like "What's happening now" not "Current task".
**Style:** Minimalist geometric shapes. Rounded corners. Calm palette (soft blues, greens, warm neutrals). High contrast text. Large touch targets.

---

## Tools (phased)

### Phase 1

#### 1. Now & Next board
Shows two things: what's happening **now**, and what's coming **next**.
- Each slot has a pictogram + label
- Tap "done" to advance (Next becomes Now, a new Next is chosen)
- **"First and Then" mode:** reframed language ("First we do X, then we do Y") — same mechanic, different wording and possibly layout

#### 2. Today's Plan
A vertical sequence of steps for the day (e.g. wake up → breakfast → get dressed → school).
- Each step has a pictogram + label
- Tap to mark as done (crossed out or greyed out)
- **"Routine" mode:** the same plan repeats daily without needing to rebuild it — saved as a named routine (e.g. "Morning routine", "Bedtime routine")

---

### Phase 2+ (future tools, not in scope yet)
- Choice board (pick between two or more options)
- Feelings check-in
- Timer / countdown visual
- Social stories builder
- Reward chart

---

## Symbol picker — the most important UI

The speed and ease of building a board depends almost entirely on how good the symbol picker is. This needs to feel effortless. A parent shouldn't have to scroll through 3,000 symbols to find "brush teeth".

### Discovery layers (in order of likely use)

1. **Suggestions** — context-aware. When a slot is empty, show the most commonly used symbols globally (and eventually, by this user). "Eat", "sleep", "school", "play" etc. should be one tap away with zero searching.

2. **Most used** — the user's own history. Surfaces their personal vocabulary first. Becomes more useful over time.

3. **Categories** — browse by group. Not too many top-level categories (6–8 max). e.g. Activities · Places · People · Food & Drink · Feelings · Time · Self-care · School
   - Each category shows a grid, not a list
   - Sub-categories only if needed (keep it flat where possible)

4. **Search** — fast, forgiving. Should match on label, synonyms, and common misspellings. e.g. "teeth" finds "brush teeth". "wee" finds "toilet". Returns results as you type (no submit button).

### Symbol customisation

A huge part of the value is being able to make it personal:

- **Relabel any symbol** — use the Mulberry pictogram for "school" but call it "St. Joseph's". The image stays, the text changes.
- **Upload your own image** — use a photo of their actual classroom, their actual plate of food. Real photos can be more effective for some children than pictograms.
- **Custom symbols** — type a label, pick a background colour, choose an emoji or icon. For things the symbol library doesn't have.
- **Symbol variants** — some concepts have multiple pictograms. Let the user pick which one resonates.

Custom and uploaded symbols should be saved to the user's personal library and show up in their "most used" / suggestions.

### Symbol card anatomy
Each symbol card = image/pictogram + label underneath. The label is always editable. The image can be replaced. Both are independently swappable.

---

## Pictograms

### Source: Mulberry Symbols
- **License:** CC-BY-SA 2.0 (UK) — allows commercial use and modification ✓
- **Format:** SVG — ideal for restyling ✓
- **Size:** ~3,000 symbols
- **Repo:** https://github.com/mulberrysymbols/mulberry-symbols

### Approach to custom styling
The SVGs from Mulberry are clean enough to restyle programmatically or via Illustrator/Figma. Options:
1. **CSS fill override** — load SVGs inline, override colours with CSS custom properties. Fast, no regeneration needed.
2. **AI-assisted redraw** — use the Mulberry set as reference, generate a custom flat geometric set in a consistent style. More work but fully ownable aesthetic.
3. **Hybrid** — use Mulberry as-is for launch, commission/generate a custom set for V2.

Recommendation: start with CSS-styled Mulberry SVGs for Phase 1. Define the visual style clearly enough that a custom set could be generated later without rebuilding the UI.

### Categories needed for Phase 1
- Activities (eating, brushing teeth, getting dressed, school, play, bath, bed, etc.)
- Places (home, school, shops, park, etc.)
- People (mum, dad, teacher, friend, etc.)
- Feelings (happy, sad, tired, angry, etc.)
- Time markers (now, next, morning, afternoon, evening)

---

## Auth & data

### Login
- Email + password (simple, no OAuth friction for parents)
- Or magic link (even simpler — no password to forget)

### What gets saved
- **Symbols library** — user's saved/favourited pictograms with custom labels
- **Boards** — named Now & Next boards (e.g. "School morning", "Hospital visit")
- **Routines** — saved Today's Plan sequences that repeat

### Stack
- **Frontend:** React + Vite (same as other apps in this repo)
- **Backend:** Node/Express + Prisma (same pattern as Wunwurd)
- **Database:** PostgreSQL
- **Auth:** JWT or session-based; consider `lucia-auth` or rolling our own (it's simple enough)
- **Hosting:** Frontend on Fasthosts like other apps. Backend needs a server — could use Railway, Render, or a VPS.

---

## Design system

### Palette (draft — to be refined)
| Name | Hex | Use |
|------|-----|-----|
| Sky | `#E8F4FD` | Background |
| Calm | `#5B9BD5` | Primary action |
| Sage | `#7BC67E` | Success / done |
| Warm | `#F9F3E8` | Card background |
| Stone | `#4A4A4A` | Body text |
| Soft red | `#E8706A` | Alerts / remove |

### Typography
- Clear, rounded sans-serif. Consider: **Nunito**, **Atkinson Hyperlegible** (designed for low vision), or **Lexie Readable**
- Large base size (18px+)
- Labels on pictograms: bold, short, sentence case

### Components needed
- **SymbolCard** — image/pictogram + editable label, tappable, "done" state
- **Slot** — empty state with "+" tap to open picker; filled state shows SymbolCard
- **Board** — 2-slot (Now/Next) or linear sequence (Today's Plan)
- **SymbolPicker** (the key component) — bottom sheet / modal with:
  - Suggestion strip at the top (most common / recently used)
  - Category tabs (icons, not just text)
  - Search bar (always visible, results update as you type)
  - Grid of results (large touch targets, label underneath)
  - "Make your own" option at the bottom
- **SymbolEditor** — label input + image replace/upload + colour picker (for custom symbols)
- **UserLibrary** — saved custom and favourite symbols, shown first in picker

---

## Open questions
1. Should the symbol picker search happen client-side (bundle the SVG index) or server-side?
2. Do we want offline support (PWA)? Parents might use this without wifi.
3. Should children be able to interact directly, or is it always parent-configured?
4. "First and Then" vs "Now and Next" — are these genuinely different modes or just label swaps?
5. What happens when Now & Next runs out of items?

---

## First steps
1. Set up `apps/nowandnext/frontend` skeleton (Vite + React)
2. Download Mulberry SVG set, build a script to index them by category/keyword
3. Design the Now & Next board component — static first, no backend
4. Agree on colour palette and font before building anything else
5. Set up backend skeleton with auth once frontend shape is clear
