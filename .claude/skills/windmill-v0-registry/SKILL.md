---
name: windmill-v0-registry
description: >-
  Maintain the Windmill → v0 design-system kit and shadcn registry (this
  repo: a Next.js app hosting 78 vendored primitives + tokens at /r/*.json,
  deployed to Vercel). Use when adding, updating, or removing a vendored
  component; re-vendoring from go-windmill packages/ui; regenerating
  registry.json; re-resolving design tokens; rebuilding the registry; or
  deploying/redeploying to Vercel. Triggers: "add a component", "update the
  registry", "re-vendor X", "regenerate tokens", "rebuild registry", "redeploy
  the kit", or any edit inside this windmill-v0-kit project.
---

# Windmill → v0 Registry Maintenance

## What this repo is
A standalone Next.js app that does two jobs: (1) hosts a **shadcn registry** at
`/r/<name>.json` (consumed by the shadcn CLI and v0), and (2) serves a demo
screen. The components in `components/ui/*.tsx` are **vendored copies** of
`go-windmill`'s `packages/ui` primitives — styling copied verbatim, workspace
deps stripped — so v0 prototypes look like production. The source repo is at
`/Users/junoh/Documents/GitHub/go-windmill`.

Live: `https://windmill-v0-kit.vercel.app` (Vercel project `windmill-v0-kit`,
account `jun-6827`). Base token install is `/r/windmill-tokens.json`.

## Pipeline (mental model)
```
go-windmill/packages/ui  ──vendor──▶  components/ui/*.tsx
WINDMILL_LIGHT_THEME_V3  ──resolve──▶  app/globals.css (CSS vars) + tailwind.config.ts
components/ui/*  +  lib/utils  +  tokens  ──gen──▶  registry.json  ──build──▶  public/r/*.json  ──deploy──▶  Vercel
```
`registry.json` and `public/r/*.json` are **generated** — never hand-edit them.

## Vendoring conventions (match existing files exactly)
When adding/updating a component, read its real source at
`go-windmill/packages/ui/src/components/<Dir>/` and produce a self-contained file:
- Start with `"use client";` then a comment: `// Vendored from packages/ui/src/components/<Path>. Styling verbatim; <deps> stripped for v0.`
- **Copy CVA variant objects and Tailwind className strings VERBATIM** — fidelity is the whole point. Do not simplify styling.
- Import `cn` from `@/lib/utils`; `cva`/`VariantProps` from `class-variance-authority`; icons from `lucide-react` (map any `react-icons` to nearest lucide). Keep `@radix-ui/*`, `cmdk`, `recharts`, `@tiptap/*`, `@dnd-kit/*`, `framer-motion` where the source uses them.
- Import already-vendored siblings from `@/components/ui/<name>` — do not recreate them.
- **Strip** `@wind/*`, Remix (`@remix-run/*`, `Link`, loaders, `useNavigation`), and app/global state → replace with typed props. Keep `framer-motion` for the motion helpers (animation is their purpose).
- Preserve `forwardRef`, `displayName`, prop names, and default exports. No `any`, no `as Type` casts (`as const` is fine).
- If a token utility is missing (e.g. `circle-*`, `bg-gradientBanner-*`, `text-tremor-*`), add it to `app/globals.css` / `tailwind.config.ts` rather than changing the component's classes.

## Add / update / remove a component
1. Write/edit `components/ui/<kebab-name>.tsx` per the conventions above. New deps → add to `package.json` (use the source repo's pinned version).
2. Add a one-line description in `scripts/gen-registry.mjs` (the `DESCRIPTIONS` map) so the registry item is labeled.
3. Regenerate + rebuild (next section). To remove: delete the file (and its `DESCRIPTIONS` entry), then regenerate.

## Regenerate the registry (after ANY change to components/ui, lib, or tokens)
```bash
npm run registry:build      # = node scripts/gen-registry.mjs && shadcn build
```
- `gen-registry.mjs` parses the imports in every `components/ui/*.tsx`, derives each item's npm `dependencies` and `registryDependencies` (sibling components + `utils` + `windmill-tokens`), and rewrites `registry.json`. Subpath imports are normalized to package names.
- `shadcn build` compiles `registry.json` → `public/r/*.json` with inlined file content.

Validate before deploying:
```bash
node -e 'const fs=require("fs"),r=require("./registry.json");const n=new Set(r.items.map(i=>i.name));let e=0;for(const it of r.items){for(const f of it.files)if(!fs.existsSync(f.path)){console.log("MISSING",f.path);e++}for(const d of it.registryDependencies||[])if(!n.has(d)){console.log("UNRESOLVED",it.name,"->",d);e++}}console.log("items",r.items.length,"errors",e)'
```

## Re-resolve design tokens (only if the production theme changed)
Tokens in `app/globals.css` are resolved from **`WINDMILL_LIGHT_THEME_V3`** in
`go-windmill/apps/windmill-web/app/themes/themes.tsx`, run through
`generateThemeStyleObject` in `go-windmill/packages/ui/src/theme/helpers.tsx`
(derives `text-accent-inverse` via WCAG contrast, `accentMuted` via `blendHexes`,
and the error palette). Re-resolve those values and replace the `:root` block.
Ignore `packages/ui/src/theme/themes.tsx` ("Blue Sky") — it's a placeholder test theme.

## Deploy
```bash
vercel deploy --prod --yes        # builds remotely; project is already linked
```
Then verify it serves publicly with CORS (shadcn/v0 need both):
```bash
curl -s -o /dev/null -w "%{http_code}\n" https://windmill-v0-kit.vercel.app/r/button.json   # expect 200
curl -sI https://windmill-v0-kit.vercel.app/r/button.json | grep -i access-control-allow-origin  # expect *
```

## Gotchas (these were load-bearing fixes — keep them)
- **`@` alias:** `next.config.mjs` sets an explicit `resolve.alias["@"] = __dirname`. Next's tsconfig-paths resolver flaked on a subset of `@/components/ui/*` imports during build; the explicit webpack alias is required. Do not remove it.
- **Install:** `.npmrc` has `legacy-peer-deps=true` and `vercel.json` pins `npm install --legacy-peer-deps` — the mixed heavy libs (tiptap/recharts/headlessui) have conflicting React peer ranges. Keep both.
- **Build resilience:** `next.config.mjs` sets `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds`. Most primitives aren't imported by any page, so they aren't type-checked at build; this keeps a stray issue in an unused one from blocking the registry deploy. The registry JSON serves regardless.
- **CORS:** `vercel.json` adds `Access-Control-Allow-Origin: *` on `/r/(.*)`. Required for cross-origin fetches from v0/CLI.
- **Never hand-edit** `registry.json` or `public/r/*.json` — regenerate.
- **Fidelity ledger** lives in `README.md`; update it when a vendored component is simplified/stubbed (e.g. tiptap-editor, sidebar, hero-numbers).

## Consume the registry (for reference / sharing)
```bash
npx shadcn@latest add https://windmill-v0-kit.vercel.app/r/windmill-tokens.json   # base: tokens + config
npx shadcn@latest add https://windmill-v0-kit.vercel.app/r/<name>.json            # any component; deps auto-resolve
```
Pair with `V0_PROJECT_INSTRUCTIONS.md` (paste into v0 Project Settings) for full fidelity.
