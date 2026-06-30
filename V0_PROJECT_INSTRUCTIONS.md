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

## Icons — use Tabler (`@tabler/icons-react`), never lucide/Heroicons/raw SVGs
- Windmill's icon set **is Tabler**, and it's installed in this project as
  `@tabler/icons-react` (the kit's primitives already import from it). Import the real
  thing — `import { IconHome, IconBell } from "@tabler/icons-react"` — and use the exact
  `Icon<Name>` PascalCase names. Do NOT reach for `lucide-react`, Heroicons, emoji, or
  hand-rolled SVGs. If you can't find a Tabler name, pick the closest Tabler icon; never
  substitute another library.
- **Use these exact icons for these concepts** (this is the production mapping — don't guess):
  - Sidebar / nav: Home → `IconHome` · 1:1s → `IconMessages` · People/employees →
    `IconUsers` (group → `IconUsersGroup`) · Chat (Windy) → `IconMessageCircle` · Search →
    `IconSearch` · Notes → `IconFileText` · Pulse → `IconBulb` · Reviews → `IconChecklist` ·
    Analytics → `IconDeviceDesktopAnalytics` · Settings → `IconSettings` · Calendar →
    `IconCalendarWeek`.
  - Account setup / actions: Invite member → `IconUserPlus` (multiple → `IconUsersPlus`) ·
    Integrations / connect → `IconPlugConnected` · Notifications → `IconBell` · Help →
    `IconHelpSquareRounded` · Recaps → `IconChecks` · Feedback received → `IconMessage2Down` ·
    Feedback given → `IconMessage2Up` · Shoutout / recognition → `IconMedal` · Performance →
    `IconClipboardData`.
- **Brand / product logos are the ONE exception to "muted, never black": render them in
  full brand color**, not as a monochrome Tabler glyph. Slack, Google, Notion, GitHub,
  Zoom, etc. are real logos — use a brand-logo source (the `react-icons` `Fa*`/`Si*`
  sets, `simple-icons`, or an inline SVG / `<img>`) at the brand's real colors. The
  "Add Slack channels" card uses the **multicolor Slack logo**, never a gray hash/plug.
  The top-left workspace mark is a brand avatar, not an icon.
- Generic UI icons are **almost never black.** Default them to a muted token —
  `text-secondary` or `text-tertiary` — so they recede next to body text. `text-primary`/
  `text-accent` only for a deliberately strong icon; a status color (`text-red`, etc.)
  only for status. Never `text-black`, `fill-black`, or an uncolored default that paints
  pure black. (Brand logos are exempt — they keep their own colors.)
- Size icons to the adjacent text: `size-4` (16px) inline with body, `size-5` (20px) for
  nav/section headers. Tabler's default stroke is 1.5–2px — don't bolden it.

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
- **Avatar** (`avatar.tsx`): image-first — **pass a real photo `imageUrl` for people**
  (use a placeholder face URL, not initials, whenever you're depicting a person); `letter`
  is only the fallback. `size="xs|sm|md|lg"` (or `sizePixels`). The fallback is a **light
  surface** (`bg-base text-secondary`) — NEVER a black circle / black-bg-white-text. The
  black fill is opt-in only via `accent`. `topRightAvatar` overlays a small badge avatar.
  `InitialsAvatar` is a back-compat wrapper taking `firstName`/`lastName`/`src`.
- **AvatarStack** (`avatar-stack.tsx`): for any row that shows **multiple people**, stack
  overlapping avatars — don't render a single initials bubble. Pass
  `avatars={[{imageUrl}, …]}`, `maxAvatars` (default 3, extras collapse to a `+N` badge),
  `size="sm"`. Home "to-do" rows stack the participants (e.g. assignee → Windy AI → the
  person being reviewed) this way.
- **Status pills** (`Tag`): NEVER a colored fill. `success|error|warning` render as a
  white/surface bg with colored text + colored border (e.g. error = white bg, red text,
  red border). Only `accent` is a filled (black) pill.
- **Status circles** (`indicator.tsx`): the little circle on a to-do / list row is a
  `StatusIndicator`, not a checkbox. `status="not-started"` and `"overdue"` render a **red
  empty ring**, `"in-progress"` a blue half-filled ring, `"complete"` a green filled check.
  An incomplete Home to-do is the **red ring** — never a neutral/black outline circle.
- If a needed component is NOT in `components/ui/`, **compose it from existing primitives**
  and add a `// TODO: not yet in Windmill DS` comment. Do NOT invent a new styled
  component or pull in another UI library.

## Layout grammar — Windmill is compact, not airy
- Compose top-down: `Page > VStack(sections) > Card > HStack(rows)`.
- Section gap (between cards) is `gapMd`. **Inside a card, lists are dense:** wrap rows in
  `<VStack gapXs>` (4px), give each row `py-1` and a hover affordance
  (`-mx-2 rounded-md px-2 py-1 hover:bg-surface-muted`), and tighten the card body with
  `<Card.Body className="py-2">`. Don't pad list rows out to `py-4`/`gapMd`.
- A row's leading cluster is tight: `<HStack gapSm>` for the row, `gapXs` for an avatar
  group. Account-setup-style cards go in a responsive grid
  (`grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-2`).
- Cards sit on `bg-surface` over a `bg-base` page. Right-align primary actions in headers
  and dialog footers.

## Domain vocabulary (these are NOT interchangeable — get them right in copy)
- **Employee** = org-chart person (has manager, role, start date).
- **Member** = a workspace user with login. **User** = account identity.
- **Pulse** = recurring survey. **1:1** = recurring meeting w/ shared agenda.
- **Recap** = AI summary of recent work. **Cycle** = a review period. **Shoutout** =
  peer recognition.

## Default posture
When unsure, prefer the boring composition of existing primitives over a novel one.
Fidelity to the system beats cleverness. Monochrome accent, hairline borders, **compact
dense lists**, real Tabler icons, real photo avatars, Inter — that's the Windmill feel.
