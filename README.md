# Windmill → v0 Kit

A standalone slice of the Windmill design system, packaged so [v0](https://v0.dev) produces
**high-fidelity** prototypes instead of vanilla shadcn lookalikes. Tokens + **78 primitives** +
a built shadcn registry + a project meta-prompt.

Sourced from `go-windmill/packages/ui`. The `@wind/*`, Remix, and workspace-hook
dependencies are stripped; the **Tailwind class strings and CVA variant objects are copied
verbatim**, so the look matches production. Real charting/editor/dnd engines (recharts,
TipTap, dnd-kit, framer-motion) are kept intact.

## Layout

```
windmill-v0-kit/
├── V0_PROJECT_INSTRUCTIONS.md   # paste into v0 Project Settings → Instructions
├── registry.json                # shadcn registry source (80 items)
├── components.json              # shadcn config (for `add` + `build`)
├── public/r/*.json              # BUILT registry — 80 items, ready to deploy
├── scripts/gen-registry.mjs     # regenerates registry.json from imports
├── app/
│   ├── globals.css              # tokens + circle/card/marquee utilities
│   ├── layout.tsx
│   └── page.tsx                 # demo screen — reference composition
├── tailwind.config.ts           # faithful port incl. Tremor chart tokens
├── lib/utils.ts                 # cn() with extended tailwind-merge
└── components/ui/*.tsx          # 78 vendored primitives
```

## Tokens
Resolved from **`WINDMILL_LIGHT_THEME_V3`** — the real production light theme (monochrome
accent `#1A1A1A`, white base, radius 0.3) — through the actual `generateThemeStyleObject`
logic, including the WCAG-derived `--text-accent-inverse` and error palette. `globals.css`
also ports the `circle-*`, `.card`, and marquee utilities; `tailwind.config.ts` includes the
Tremor token block so the recharts charts render with correct colors.

> Ignore `packages/ui/src/theme/themes.tsx` ("Blue Sky") — a placeholder test theme.

## Component catalog (78)

**Layout & structure** — button, stack (VStack/HStack), page, card, grid, containers,
flexible-spacer, divider, section, panel, scroll-area, resizable-side-panel

**Forms & inputs** — input, text-area, checkbox (+with-label/group), radio-group, toggle,
segmented-control, combobox, date-picker, date-range-picker, calendar, command,
command-palette, popover, component-label-wrapper, filter

**Display** — typography, badge (Tag/Tags/Chip), avatar, tabs, breadcrumbs, link, keyboard,
copy-to-clipboard, vertical-steps, table, status-icon, key-value-table, data-viewer,
diff-view, hero-numbers, wireframe

**Feedback & overlays** — dialog, sheet, sheet-contents, slide-over, dropdown-menu, tooltip,
hover-card, callout, banner, announcement, help-banner, empty-state, progress, spinner

**Navigation** — sidebar, left-nav

**Charts** — charts (bar/line/gauge), column-chart, composed-chart

**Content & editors** — tiptap-editor, markdown-text-area, chat, settings, checklist,
sortable, sort-control

**Motion** — auto-height-transition, fade-up-with-delay, roulette-transition,
thinking-animation, navigation-loading-spinner, marquee, gradient-background

Each file's header comment names its source path and what was dropped.

### Fidelity notes (most are high; these are simplified)
The bulk are verbatim. A few app-coupled composites were necessarily reduced to render
standalone — visual tokens are intact, but wiring/behavior is trimmed:
- **tiptap-editor** — minimal self-contained toolbar; drops the production slash-commands,
  context menu, link-hover popover, and Hocuspocus/Liveblocks collaboration.
- **hero-numbers** — tile structure verbatim; `<Await>`/skeleton/percent-change/info-tooltip
  sub-deps stubbed.
- **sheet-contents** — tabs rebuilt on the kit's Radix `Tabs` (legacy array API replaced);
  tokens preserved.
- **sidebar / left-nav / slide-over / filter / settings** — routing/`useNavigation`/global
  state replaced with typed props (`items`, `activeId`, `loading`, etc.).
- **charts** — recharts config and colors verbatim; Tremor tokens ported into the config.

## Using it as a shadcn registry (already built → `public/r/`)
`public/r/*.json` is the compiled registry (via `npx shadcn build`). Each item inlines its
file content, npm `dependencies`, and `registryDependencies` (e.g. `table` →
`checkbox`, `dropdown-menu`, `flexible-spacer`, `scroll-area`, `utils`, `windmill-tokens`),
so installing one pulls its whole chain.

1. **Deploy** `public/r/` behind any static URL (e.g. push this kit to Vercel — the files
   serve at `<host>/r/<name>.json`). Private system → put it behind an authenticated
   registry.
2. **Install the base once** in a target project:
   `npx shadcn add <host>/r/windmill-tokens.json` (tokens + Tailwind config), then add
   components by name: `npx shadcn add <host>/r/table.json`.
3. **In v0** — add the registry URL to the project; v0 installs items (with deps) on request.
4. **Rebuild** after changes: `npx shadcn build` (regenerate `registry.json` first with
   `node scripts/gen-registry.mjs` if you add/remove components).

## Using it as a paste bundle (works today, no hosting)
1. Copy `V0_PROJECT_INSTRUCTIONS.md` into your v0 project's **Settings → Instructions**.
2. Drag the kit folder into a v0 chat, or paste `globals.css` + `tailwind.config.ts` +
   `lib/utils.ts` + the `components/ui/*` files you need (v0 imports from `@/components/ui/*`).
3. `app/page.tsx` is a working reference screen (`Page > VStack > Card > HStack`).

## Regenerating
- **Tokens:** re-resolve `WINDMILL_LIGHT_THEME_V3`
  (`apps/windmill-web/app/themes/themes.tsx`) through `generateThemeStyleObject`
  (`packages/ui/src/theme/helpers.tsx`); replace the `:root` block in `app/globals.css`.
- **registry.json:** `node scripts/gen-registry.mjs` (parses imports in `components/ui/*` to
  rebuild every item's dependency graph), then `npx shadcn build`.
