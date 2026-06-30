"use client";

// Vendored from packages/ui/src/components/Tabs/Tabs.tsx + shared-tab-styles.ts. The production component is a custom button list; here it is rebuilt on @radix-ui/react-tabs (per v0 kit requirement) while reusing the CLASSIC/MINIMAL style tokens verbatim.
// NOTE: The original's mobile <select> fallback, ScrollArea, includeNextAndPrevious nav, badges/tooltips/error-dots are dropped. The CLASSIC/MINIMAL variants and their active/inactive class strings are preserved on TabsList/TabsTrigger.

import { cn } from "@/lib/utils";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import {
  createContext,
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";

export enum TabVariant {
  CLASSIC = "classic",
  MINIMAL = "minimal",
}

const TabVariantContext = createContext<{ variant: TabVariant; inverse?: boolean }>({
  variant: TabVariant.CLASSIC,
});

const Tabs = TabsPrimitive.Root;

const TabsList = forwardRef<
  ElementRef<typeof TabsPrimitive.List>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    variant?: TabVariant;
    inverse?: boolean;
    centerTabs?: boolean;
    horizontalPadding?: boolean;
  }
>(
  (
    { className, variant = TabVariant.CLASSIC, inverse, centerTabs, horizontalPadding, ...props },
    ref
  ) => (
    <TabVariantContext.Provider value={{ variant, inverse }}>
      <TabsPrimitive.List
        ref={ref}
        className={cn(
          "flex items-end justify-start",
          {
            // Classic variant has border bottom
            "mb-2 border-b": variant === TabVariant.CLASSIC,

            // Minimal variant has different spacing and no border
            "gap-px p-2": variant === TabVariant.MINIMAL,

            // Shared styles
            "px-4": horizontalPadding,
            "justify-center": centerTabs,
          },
          className
        )}
        {...props}
      />
    </TabVariantContext.Provider>
  )
);
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = forwardRef<
  ElementRef<typeof TabsPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const { variant, inverse } = useContext(TabVariantContext);
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "group relative flex items-center gap-2",
        {
          // hover applies when not active
          "data-[state=inactive]:hover:bg-accent/5": true,

          // Classic variant styles
          "rounded-t px-4 py-2": variant === TabVariant.CLASSIC,

          // Minimal variant styles
          "rounded-full px-3 py-1": variant === TabVariant.MINIMAL,

          "text-accent-inverse": inverse,
        },
        // active text styling (mirrors getTabTextStyles)
        "data-[state=inactive]:text-secondary data-[state=active]:text-primary",
        {
          "text-body-sm": variant === TabVariant.CLASSIC,
          "text-ui": variant === TabVariant.MINIMAL,
          "group-data-[state=inactive]:hover:text-primary": variant === TabVariant.MINIMAL,
        },
        className
      )}
      {...props}
    >
      {/* Active indicator (mirrors getTabIndicatorStyles); shown only when the parent trigger is active */}
      <div
        className={cn("absolute hidden group-data-[state=active]:block", {
          "inset-0 -mb-[1px] border-b-[2.5px] border-accent":
            variant === TabVariant.CLASSIC && !inverse,
          "inset-0 -mb-[1px] bg-surface/50": variant === TabVariant.CLASSIC && inverse,
          "inset-0 bg-selected rounded-full": variant === TabVariant.MINIMAL && !inverse,
          "inset-0 bg-surface/50 rounded-full": variant === TabVariant.MINIMAL && inverse,
        })}
      />
      <div className="relative flex items-center whitespace-nowrap">{children}</div>
    </TabsPrimitive.Trigger>
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = forwardRef<
  ElementRef<typeof TabsPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content ref={ref} className={cn("block", className)} {...props} />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
