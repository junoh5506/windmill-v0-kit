# Windmill — v0 Project Instructions

Paste this into your v0 project's **Project Settings → Instructions** (not a per-message
prompt). It applies to every generation in the project, so v0 stops reaching for vanilla
shadcn defaults and composes with the real Windmill system instead.

---

You are prototyping UI for **Windmill**, an AI-powered performance/HR platform for People
Ops teams. A Windmill design system is already installed in this project (tokens in
`app/globals.css`, primitives in `components/ui/*`). Follow these rules with zero deviation.

## Tokens — never use raw colors, hex, or the default shadcn/slate palette
- **Text:** `text-primary` (default body), `text-secondary` (supporting), `text-tertiary`
  (faint/metadata), `text-accent`, `text-accent-inverse` (on accent bg).
- **Surfaces:** `bg-base` (page background), `bg-surface` (cards/panels/rows),
  `bg-surface-muted` (insets, table headers).
- **Accent (primary actions):** `bg-accent` with `text-accent-inverse`. Accent is
  near-black `#1A1A1A` — Windmill is monochrome-first, NOT blue.
- **Status:** pair `bg-{green|red|yellow|blue|purple|orange|fuchsia}` with the matching
  `text-{…}` foreground. Use for badges, callouts, banners.
- **Borders:** `border-DEFAULT` (hairlines), `border-strong`, `border-muted`. Default
  border width is 1px.
- **Type scale (use these, not text-sm/text-lg):** `text-ui` (controls/buttons/labels),
  `text-body-md`, `text-body-sm`, `text-header-sm`, `text-header-md`, `text-header-lg`,
  `text-caption`.
- **Font:** Inter (sans), already the default. **Radius:** use rounded-sm/md/lg tokens
  (≈0.3rem base) — never hardcode pixel radii.

## Icons — Tabler, muted, never black
- Windmill uses **Tabler icons** (`@tabler/icons-react` in production; in this v0 project
  use `lucide-react` as the stand-in — pick the nearest equivalent). Do NOT use
  Heroicons, raw SVGs, or emoji.
- Icons are **almost never black.** Default them to a muted text token — `text-secondary`
  or `text-tertiary` — so they recede next to body text. Use `text-primary`/`text-accent`
  only for a deliberately strong icon, and a status color (`text-red`, etc.) only for
  status. Never `text-black`, `fill-black`, or an uncolored default that paints pure black.
- Size icons to the adjacent text: `size-4` (16px) inline with body, `size-5` (20px) for
  nav/section headers. Match stroke weight to Tabler's default (1.5–2px) — don't bolden.

## Primitives — import from `@/components/ui/*`. NEVER recreate them.
- **Button** (`button.tsx`): `intent="primary | secondary | transparent | link"`,
  `size="sm | md | lg"`, plus `icon`, `iconRight`, `loading`, `block`. Primary = filled
  accent; secondary = bordered surface; transparent = ghost.
- **Layout:** compose with **VStack / HStack only** (`stack.tsx`) — never raw
  `<div className="flex">`. Props are **boolean flags**, not strings:
  - VStack: `gapXs|gapSm|gapMd|gapLg`, `alignStart|alignCenter|alignEnd|alignStretch`,
    `justifyBetween`, `divide`. e.g. `<VStack gapMd alignStart>`.
  - HStack: `gapXs|gapSm|gapMd|gapLg`, `alignXStart|alignXCenter|alignXEnd|alignXBetween`,
    `alignYTop|alignYCenter|alignYBottom`, `stackOnMobile`. e.g. `<HStack gapSm alignYCenter>`.
- **Page** (`page.tsx`): wrap every screen. Pass `title`, optional `subtitle`,
  `primaryCTA`, `secondaryCTA`, `breadcrumbs`, `width`.
- **Forms:** Input, and any Checkbox/Radio/Select from `components/ui/`.
- **Display:** Card (with `Card.Header`/`Card.Body`/`Card.Footer`), `Tag`
  (`intent="accent|success|error|warning|default"`) and `Chip` from `badge.tsx`,
  `Avatar` from `avatar.tsx`, Tabs, Dialog, DropdownMenu.
- **Avatar** (`avatar.tsx`): image-first — pass `imageUrl` for a photo, `letter` for the
  fallback, `size="xs|sm|md|lg"` (or `sizePixels`). The fallback is a **light surface**
  (`bg-base text-secondary`) — NEVER a black circle / black-bg-white-text. The black fill
  is opt-in only via `accent`. `topRightAvatar` overlays a small badge avatar.
  `InitialsAvatar` is a back-compat wrapper taking `firstName`/`lastName`/`src`.
- **Status pills** (`Tag`): NEVER a colored fill. `success|error|warning` render as a
  white/surface bg with colored text + colored border (e.g. error = white bg, red text,
  red border). Only `accent` is a filled (black) pill.
- If a needed component is NOT in `components/ui/`, **compose it from existing primitives**
  and add a `// TODO: not yet in Windmill DS` comment. Do NOT invent a new styled
  component or pull in another UI library.

## Layout grammar
- Compose top-down: `Page > VStack(sections) > Card > HStack(rows)`.
- Default section gap is `gap="md"`; tighten to `sm`/`xs` inside dense rows.
- Cards sit on `bg-surface` over a `bg-base` page; keep generous internal padding.
- Right-align primary actions in headers and dialog footers.

## Domain vocabulary (these are NOT interchangeable — get them right in copy)
- **Employee** = org-chart person (has manager, role, start date).
- **Member** = a workspace user with login. **User** = account identity.
- **Pulse** = recurring survey. **1:1** = recurring meeting w/ shared agenda.
- **Recap** = AI summary of recent work. **Cycle** = a review period. **Shoutout** =
  peer recognition.

## Default posture
When unsure, prefer the boring composition of existing primitives over a novel one.
Fidelity to the system beats cleverness. Monochrome accent, hairline borders, generous
spacing, Inter — that's the Windmill feel.
