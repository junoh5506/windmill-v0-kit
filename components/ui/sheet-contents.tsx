"use client";

// Vendored from packages/ui/src/components/SheetContents/* (SheetContents, Header, Section, Tabs, Callout). Styling verbatim; @wind/Remix/app-state deps stubbed for v0.

import FlexibleSpacer from "@/components/ui/flexible-spacer";
import { HStack } from "@/components/ui/stack";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
// NOTE: react-icons (FaCheck/FaExclamationTriangle/FaInfoCircle/FaTimes) is not
// in the kit — swapped for @tabler/icons-react equivalents.
import { IconCheck as Check, IconInfoCircle as Info, IconAlertTriangle as TriangleAlert, IconX as X, IconX as XIcon, type Icon as LucideIcon } from "@tabler/icons-react";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";

/* ── SheetContents ─────────────────────────────────────────────── */

interface SheetContentsProps {
  children: ReactNode;
  className?: string;
}

const SheetContents = ({ children, className }: SheetContentsProps) => (
  <div className={cn("@container/sheet-contents", className)}>{children}</div>
);

/* ── SheetContentsSection ──────────────────────────────────────── */

export const SHEET_CONTENTS_HORIZONTAL_PADDING =
  "px-3 @sm/sheet-contents:px-4 @lg/sheet-contents:px-6";

interface SheetContentsSectionProps {
  className?: string;
  children: ReactNode;
}

const SheetContentsSection = ({ className, children }: SheetContentsSectionProps) => (
  <div className={cn(SHEET_CONTENTS_HORIZONTAL_PADDING, className)}>{children}</div>
);

/* ── SheetContentsHeader ───────────────────────────────────────── */

interface SheetContentsHeaderProps {
  accessory?: ReactNode;
  onClose?: () => void;
  title: string;
  eyebrow?: ReactNode;
  description?: string;
  className?: string;
  icon?: ReactNode;
}

const SheetContentsHeader = ({
  accessory,
  icon,
  title,
  description,
  onClose,
  className,
  eyebrow,
}: SheetContentsHeaderProps) => {
  // NOTE: production used SheetLayoutContext to render a Radix Dialog Title for
  // a11y when inside a Sheet, falling back to a div otherwise. The kit's sheet
  // already drops that context, so a plain div is used here.
  return (
    <SheetContentsSection
      className={cn("pb-3 pt-4 @lg/sheet-contents:pt-6 @lg/sheet-contents:pb-4", className)}
    >
      <div className="flex items-start gap-2">
        <HStack>
          {icon && <div className="flex-none">{icon}</div>}
          <div>
            {eyebrow && <div className="mb-2">{eyebrow}</div>}
            <div className="text-xl font-medium text-primary">{title}</div>
            {description && <p className="mt-1 text-sm text-secondary">{description}</p>}
          </div>
        </HStack>
        <FlexibleSpacer />
        <div className="flex-none">{accessory}</div>
        {onClose && (
          <button
            onClick={onClose}
            tabIndex={0}
            className="group flex size-8 items-center justify-center rounded-md bg-surface-muted/80 text-secondary transition-colors hover:bg-accent/10 active:scale-[98%]"
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>
    </SheetContentsSection>
  );
};

/* ── SheetContentsTabs ─────────────────────────────────────────── */

// NOTE: production SheetContentsTabs wrapped the legacy <Tabs tabs={[...]}>
// array API. The kit rebuilt Tabs on Radix, so this re-exports the kit's Radix
// Tabs parts with the sheet-contents horizontal padding pre-applied. Compose
// with <SheetContentsTabs>, <SheetContentsTabsList>, <TabsTrigger>, <TabsContent>.
const SheetContentsTabs = Tabs;

const SheetContentsTabsList = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof TabsList>) => (
  <TabsList className={cn(SHEET_CONTENTS_HORIZONTAL_PADDING, className)} {...props} />
);

const SheetContentsTabsContent = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof TabsContent>) => (
  <TabsContent className={cn(SHEET_CONTENTS_HORIZONTAL_PADDING, "mt-2", className)} {...props} />
);

/* ── SheetContentsCallout ──────────────────────────────────────── */

const CalloutStyles = cva("px-4 py-3 bg-surface-muted rounded-md", {
  variants: {
    variant: {
      info: "bg-surface-muted border-strong",
      warning: "bg-yellow border-yellow",
      error: "bg-red border-red",
      success: "bg-green border-green",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

const CalloutIconStyles = cva("flex-none text-tertiary", {
  variants: {
    variant: {
      info: "text-accent",
      warning: "text-yellow",
      error: "text-red",
      success: "text-green",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

interface SheetContentsCalloutProps extends VariantProps<typeof CalloutStyles> {
  icon?: ReactNode;
  title: string;
  className?: string;
  children?: ReactNode;
}

const CALLOUT_ICONS: Record<NonNullable<SheetContentsCalloutProps["variant"]>, LucideIcon> = {
  info: Info,
  warning: TriangleAlert,
  error: X,
  success: Check,
};

const SheetContentsCallout = ({
  icon,
  title,
  className,
  children,
  variant = "info",
}: SheetContentsCalloutProps) => {
  const VariantIcon = variant ? CALLOUT_ICONS[variant] : undefined;
  return (
    <div className={cn(CalloutStyles({ variant }), className)}>
      <div className="flex items-center gap-4">
        <div className={CalloutIconStyles({ variant })}>
          {!variant && icon}
          {VariantIcon && <VariantIcon />}
        </div>
        <Label className="text-sm text-secondary/70" intent="secondary">
          {title}
        </Label>
      </div>
      {children}
    </div>
  );
};

export {
  SheetContents,
  SheetContentsCallout,
  SheetContentsHeader,
  SheetContentsSection,
  SheetContentsTabs,
  SheetContentsTabsContent,
  SheetContentsTabsList,
  TabsTrigger as SheetContentsTabsTrigger,
};

export default SheetContents;
