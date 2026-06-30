import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const KIT = "/Users/junoh/Desktop/windmill-v0-kit";
const UI = join(KIT, "components/ui");

const titleCase = (name) =>
  name
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

// One-line description per component (best-effort; edit freely later).
const DESCRIPTIONS = {
  button: "Primary action button (intent + size variants).",
  stack: "VStack / HStack flexbox layout primitives.",
  page: "Page shell with title, CTAs, breadcrumbs.",
  card: "Surface container with Header / Body / Footer.",
  input: "Text input.",
  badge: "Tag, Tags, and Chip status labels.",
  avatar: "Initials / image avatar.",
  dialog: "Modal dialog (Radix).",
  "dropdown-menu": "Dropdown menu (Radix).",
  tabs: "Tabbed navigation (Radix).",
  checkbox: "Checkbox control.",
  "checkbox-with-label": "Checkbox with label + description.",
  "checkbox-group": "Group of checkboxes.",
  "radio-group": "Radio button group.",
  toggle: "Switch / boolean toggle.",
  "segmented-control": "Segmented multi-option control.",
  "text-area": "Multi-line text input.",
  "component-label-wrapper": "Form field label + error wrapper.",
  command: "Command palette (cmdk).",
  popover: "Popover (Radix).",
  calendar: "Date calendar (react-day-picker).",
  combobox: "Searchable select.",
  "date-picker": "Single date picker.",
  "date-range-picker": "Date range picker with quick ranges.",
  callout: "Inline callout / alert.",
  banner: "Full-width banner.",
  announcement: "Announcement card.",
  "help-banner": "Gradient help banner.",
  "empty-state": "Empty / zero-data state.",
  progress: "Progress bar (linear, radial, timed).",
  spinner: "Loading spinner.",
  "status-icon": "Status indicator icon.",
  tooltip: "Tooltip (Radix).",
  "hover-card": "Hover card (Radix).",
  sheet: "Side sheet / drawer (Radix dialog).",
  divider: "Horizontal / vertical divider.",
  section: "Collapsible titled section.",
  panel: "Resizable panel group.",
  keyboard: "Keyboard shortcut hint.",
  typography: "Header, Paragraph, Label, MonoLabel, Identifier.",
  breadcrumbs: "Breadcrumb trail.",
  link: "Styled anchor link.",
  "copy-to-clipboard": "Copy-to-clipboard button.",
  "vertical-steps": "Vertical step indicator.",
  grid: "Responsive grid layout.",
  containers: "Max-width + expandable containers.",
  "flexible-spacer": "Flex spacer.",
  "scroll-area": "Scroll area (Radix).",
  table: "Data table with selection + row actions.",
  charts: "Bar / line / gauge charts (recharts) + chart color tokens.",
  "column-chart": "Column / bar chart.",
  "composed-chart": "Composed bar + line + area chart.",
  "auto-height-transition": "Animated height auto-transition.",
  "fade-up-with-delay": "Staggered fade-up entrance.",
  "roulette-transition": "Cycling roulette number/text animation.",
  "thinking-animation": "AI thinking animations (grid + windmill).",
  "navigation-loading-spinner": "Top navigation loading spinner.",
  marquee: "Infinite scrolling marquee.",
  "gradient-background": "Animated gradient backdrop.",
  sidebar: "Full sidebar system (provider, menu, groups, rail).",
  "left-nav": "Left navigation with sections + links.",
  "slide-over": "Slide-over panel.",
  "sheet-contents": "Sheet content scaffolding (header, sections, tabs).",
  "resizable-side-panel": "Resizable side panel.",
  filter: "Debounced filter search bar.",
  "data-viewer": "JSON / text data viewer.",
  "diff-view": "Text diff viewer (diff-match-patch).",
  "key-value-table": "Key / value table.",
  checklist: "Checklist with completion state.",
  sortable: "Drag-and-drop sortable list (dnd-kit).",
  "sort-control": "Sort field / direction control.",
  "hero-numbers": "Large hero stat numbers.",
  "tiptap-editor": "Rich text editor (TipTap).",
  "markdown-text-area": "Markdown editor (MDXEditor).",
  chat: "Chat message list + streaming markdown.",
  settings: "Settings container / sections / rows.",
  wireframe: "Wireframe placeholder container.",
  "command-palette": "Headless command palette (⌘K).",
};

const files = readdirSync(UI)
  .filter((f) => f.endsWith(".tsx"))
  .sort();

const items = [];

// Base lib item: cn()
items.push({
  name: "utils",
  type: "registry:lib",
  title: "cn() utility",
  description:
    "clsx + extended tailwind-merge, aware of Windmill's custom font sizes and token colors.",
  dependencies: ["clsx", "tailwind-merge"],
  files: [{ path: "lib/utils.ts", type: "registry:lib" }],
});

// Base style item: tokens + tailwind config
items.push({
  name: "windmill-tokens",
  type: "registry:style",
  title: "Windmill tokens",
  description:
    "Design tokens resolved from WINDMILL_LIGHT_THEME_V3 plus the Tailwind config. Install once as the base style.",
  registryDependencies: ["utils"],
  files: [
    { path: "app/globals.css", type: "registry:file", target: "app/globals.css" },
    { path: "tailwind.config.ts", type: "registry:file", target: "tailwind.config.ts" },
  ],
});

for (const file of files) {
  const name = file.replace(/\.tsx$/, "");
  const src = readFileSync(join(UI, file), "utf8");
  const importSources = [...src.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]);

  const npm = new Set();
  const registryDeps = new Set();

  for (const s of importSources) {
    if (s === "react" || s.startsWith("react/")) {
      continue;
    }
    if (s === "@/lib/utils") {
      registryDeps.add("utils");
      continue;
    }
    if (s.startsWith("@/components/ui/")) {
      registryDeps.add(s.replace("@/components/ui/", ""));
      continue;
    }
    if (s.startsWith("@/")) {
      continue;
    }
    // Normalize subpath imports to the installable package name:
    // "@tiptap/pm/model" -> "@tiptap/pm", "recharts/types/..." -> "recharts".
    const pkg = s.startsWith("@") ? s.split("/").slice(0, 2).join("/") : s.split("/")[0];
    npm.add(pkg);
  }

  const item = {
    name,
    type: "registry:ui",
    title: titleCase(name),
    files: [{ path: `components/ui/${file}`, type: "registry:ui" }],
  };
  if (DESCRIPTIONS[name]) {
    item.description = DESCRIPTIONS[name];
  }
  if (npm.size) {
    item.dependencies = [...npm].sort();
  }
  // every UI item needs the tokens; list utils explicitly too for cn()
  registryDeps.add("windmill-tokens");
  if (registryDeps.size) {
    item.registryDependencies = [...registryDeps].sort();
  }
  items.push(item);
}

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "windmill",
  homepage: "https://github.com/gowindmill/go-windmill",
  items,
};

writeFileSync(join(KIT, "registry.json"), JSON.stringify(registry, null, 2) + "\n");

// Collect all npm deps for package.json
const allNpm = new Set(["clsx", "tailwind-merge"]);
for (const it of items) {
  (it.dependencies ?? []).forEach((d) => allNpm.add(d));
}
console.log("components:", files.length);
console.log("npm deps:", [...allNpm].sort().join(", "));
