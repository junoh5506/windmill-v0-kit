import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

/*
 * Faithful port of packages/ui/tailwind.config.cjs, trimmed to what
 * prototypes need. All colors resolve from the CSS variables defined in
 * app/globals.css. Keep class names identical to the real design system so
 * components copy over 1:1 (text-primary, bg-surface, bg-accent, etc.).
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        mono: ["Geist Mono", ...defaultTheme.fontFamily.mono],
        serif: ["Recoleta", ...defaultTheme.fontFamily.serif],
      },
      screens: { xs: "480px" },
      // Tremor tokens (ported verbatim from packages/ui/tailwind.config.cjs) so the
      // recharts-based charts render with the right content/border/background colors.
      // These flow into text-/bg-/border-/stroke-/fill-tremor-* via the ...theme("colors")
      // spreads in each color map below.
      colors: {
        tremor: {
          brand: {
            faint: "#eff6ff",
            muted: "#bfdbfe",
            subtle: "#60a5fa",
            DEFAULT: "#3b82f6",
            emphasis: "#1d4ed8",
            inverted: "#ffffff",
          },
          background: {
            muted: "#f9fafb",
            subtle: "#f3f4f6",
            DEFAULT: "#ffffff",
            emphasis: "#374151",
          },
          border: { DEFAULT: "#e5e7eb" },
          ring: { DEFAULT: "#e5e7eb" },
          content: {
            subtle: "#9ca3af",
            DEFAULT: "#6b7280",
            emphasis: "#374151",
            strong: "#111827",
            inverted: "#ffffff",
          },
        },
      },
      borderRadius: {
        "tremor-small": "0.375rem",
        "tremor-default": "0.5rem",
        "tremor-full": "9999px",
      },
      boxShadow: {
        "tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "tremor-card": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "tremor-dropdown": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
      fontSize: {
        "header-lg": [
          "var(--font-header-lg-size)",
          {
            lineHeight: "var(--font-header-lg-line-height)",
            letterSpacing: "var(--font-header-lg-letter-spacing)",
            fontWeight: "var(--font-header-lg-weight)",
          },
        ],
        "header-md": [
          "var(--font-header-md-size)",
          {
            lineHeight: "var(--font-header-md-line-height)",
            letterSpacing: "var(--font-header-md-letter-spacing)",
            fontWeight: "var(--font-header-md-weight)",
          },
        ],
        "header-sm": [
          "var(--font-header-sm-size)",
          {
            lineHeight: "var(--font-header-sm-line-height)",
            letterSpacing: "var(--font-header-sm-letter-spacing)",
            fontWeight: "var(--font-header-sm-weight)",
          },
        ],
        "body-md": [
          "var(--font-body-md-size)",
          {
            lineHeight: "var(--font-body-md-line-height)",
            letterSpacing: "var(--font-body-md-letter-spacing)",
            fontWeight: "var(--font-body-md-weight)",
          },
        ],
        "body-sm": [
          "var(--font-body-sm-size)",
          {
            lineHeight: "var(--font-body-sm-line-height)",
            letterSpacing: "var(--font-body-sm-letter-spacing)",
            fontWeight: "var(--font-body-sm-weight)",
          },
        ],
        caption: [
          "var(--font-caption-size)",
          {
            lineHeight: "var(--font-caption-line-height)",
            letterSpacing: "var(--font-caption-letter-spacing)",
            fontWeight: "var(--font-caption-weight)",
          },
        ],
        ui: [
          "var(--font-ui-size)",
          {
            lineHeight: "var(--font-ui-line-height)",
            letterSpacing: "var(--font-ui-letter-spacing)",
            fontWeight: "var(--font-ui-weight)",
          },
        ],
        "tremor-label": ["0.75rem", { lineHeight: "1rem" }],
        "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
        "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
        "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
      },
    },
    borderRadius: {
      none: "0",
      sm: "var(--radius-sm)",
      DEFAULT: "var(--radius-DEFAULT)",
      md: "var(--radius-md)",
      lg: "var(--radius-lg)",
      xl: "var(--radius-xl)",
      full: "var(--radius-full)",
    },
    borderWidth: { 0: "0", 1: "1px", DEFAULT: "var(--border-width-DEFAULT)", 2: "2px", 4: "4px" },
    backgroundColor: ({ theme }) => ({
      ...theme("colors"),
      transparent: "transparent",
      highlight: "rgb(var(--highlight) / <alpha-value>)",
      selected: "rgb(var(--selected) / <alpha-value>)",
      base: { DEFAULT: "rgb(var(--bg-base) / <alpha-value>)" },
      surface: {
        DEFAULT: "rgb(var(--bg-surface) / <alpha-value>)",
        muted: "rgb(var(--bg-surface-muted) / <alpha-value>)",
      },
      primary: { hover: "rgb(var(--bg-primary-hover) / <alpha-value>)" },
      secondary: { hover: "rgb(var(--bg-secondary-hover) / <alpha-value>)" },
      accent: {
        DEFAULT: "rgb(var(--bg-accent) / <alpha-value>)",
        inverse: "rgb(var(--bg-accent-muted) / <alpha-value>)",
      },
      error: {
        DEFAULT: "rgb(var(--bg-error) / <alpha-value>)",
        accent: "rgb(var(--bg-error-accent) / <alpha-value>)",
      },
      green: {
        DEFAULT: "rgb(var(--green-background) / <alpha-value>)",
        foreground: "rgb(var(--green-foreground) / <alpha-value>)",
      },
      red: {
        DEFAULT: "rgb(var(--red-background) / <alpha-value>)",
        foreground: "rgb(var(--red-foreground) / <alpha-value>)",
      },
      yellow: {
        DEFAULT: "rgb(var(--yellow-background) / <alpha-value>)",
        foreground: "rgb(var(--yellow-foreground) / <alpha-value>)",
      },
      blue: {
        DEFAULT: "rgb(var(--blue-background) / <alpha-value>)",
        foreground: "rgb(var(--blue-foreground) / <alpha-value>)",
      },
      purple: {
        DEFAULT: "rgb(var(--purple-background) / <alpha-value>)",
        foreground: "rgb(var(--purple-foreground) / <alpha-value>)",
      },
      fuchsia: {
        DEFAULT: "rgb(var(--fuchsia-background) / <alpha-value>)",
        foreground: "rgb(var(--fuchsia-foreground) / <alpha-value>)",
      },
      orange: {
        DEFAULT: "rgb(var(--orange-background) / <alpha-value>)",
        foreground: "rgb(var(--orange-foreground) / <alpha-value>)",
      },
      sidebar: {
        DEFAULT: "rgb(var(--sidebar-background) / <alpha-value>)",
        accent: "rgb(var(--sidebar-accent) / <alpha-value>)",
      },
      gradientBanner: {
        DEFAULT: "rgb(var(--gradient-banner-background) / <alpha-value>)",
        accent1: "rgb(var(--gradient-banner-accent1) / <alpha-value>)",
        accent2: "rgb(var(--gradient-banner-accent2) / <alpha-value>)",
        accent3: "rgb(var(--gradient-banner-accent3) / <alpha-value>)",
      },
    }),
    textColor: ({ theme }) => ({
      ...theme("colors"),
      DEFAULT: "rgb(var(--text-primary) / <alpha-value>)",
      primary: "rgb(var(--text-primary) / <alpha-value>)",
      secondary: "rgb(var(--text-secondary) / <alpha-value>)",
      tertiary: "rgb(var(--text-tertiary) / <alpha-value>)",
      accent: {
        DEFAULT: "rgb(var(--text-accent) / <alpha-value>)",
        inverse: "rgb(var(--text-accent-inverse) / <alpha-value>)",
      },
      inverse: "rgb(var(--text-inverse) / <alpha-value>)",
      error: { DEFAULT: "rgb(var(--text-error) / <alpha-value>)" },
      green: "rgb(var(--green-foreground) / <alpha-value>)",
      red: "rgb(var(--red-foreground) / <alpha-value>)",
      yellow: "rgb(var(--yellow-foreground) / <alpha-value>)",
      blue: "rgb(var(--blue-foreground) / <alpha-value>)",
      purple: "rgb(var(--purple-foreground) / <alpha-value>)",
      fuchsia: "rgb(var(--fuchsia-foreground) / <alpha-value>)",
      orange: "rgb(var(--orange-foreground) / <alpha-value>)",
    }),
    borderColor: ({ theme }) => ({
      ...theme("colors"),
      DEFAULT: "rgb(var(--border-default) / <alpha-value>)",
      base: "rgb(var(--border-default) / <alpha-value>)",
      accent: {
        DEFAULT: "rgb(var(--border-accent) / <alpha-value>)",
        inverse: "rgb(var(--bg-accent-muted) / <alpha-value>)",
      },
      strong: "rgb(var(--border-strong) / <alpha-value>)",
      surface: {
        DEFAULT: "rgb(var(--bg-surface) / <alpha-value>)",
        muted: "rgb(var(--bg-surface-muted) / <alpha-value>)",
      },
      muted: "rgb(var(--border-muted) / <alpha-value>)",
      error: "rgb(var(--border-error) / <alpha-value>)",
    }),
    ringColor: ({ theme }) => ({
      ...theme("colors"),
      DEFAULT: "rgb(var(--border-default) / <alpha-value>)",
      highlight: "rgb(var(--highlight) / <alpha-value>)",
      accent: "rgb(var(--border-accent) / <alpha-value>)",
    }),
    placeholderColor: ({ theme }) => ({
      ...theme("colors"),
      secondary: "rgb(var(--text-secondary) / <alpha-value>)",
      tertiary: "rgb(var(--text-tertiary) / <alpha-value>)",
    }),
  },
  plugins: [],
};

export default config;
