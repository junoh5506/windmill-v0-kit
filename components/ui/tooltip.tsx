"use client";

// Vendored from packages/ui/src/components/Tooltip/Tooltip.tsx. Styling verbatim; Remix/workspace deps stripped for v0.

import { cn } from "@/lib/utils";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { TooltipContentProps } from "@radix-ui/react-tooltip";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from "react";

// Inlined from packages/ui/src/shadcn/ShadTooltip.tsx so this file is self-contained.
const ShadTooltipProvider = TooltipPrimitive.Provider;
const ShadTooltip = TooltipPrimitive.Root;
const ShadTooltipTrigger = TooltipPrimitive.Trigger;

const ShadTooltipContent = forwardRef<
  ElementRef<typeof TooltipPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md bg-accent text-accent-inverse animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
ShadTooltipContent.displayName = TooltipPrimitive.Content.displayName;

export interface TooltipProps extends Pick<TooltipContentProps, "side"> {
  children?: ReactNode;
  tooltip?: ReactNode;
  /** Shortens the delay to 100ms for "instant" tooltips. */
  instant?: boolean;
  tooltipClassName?: string;
  /** Use card when the tooltip has more content. Compact is default */
  variant?: "compact" | "card";
  /** Controls whether the tooltip is open */
  open?: boolean;
}

const Tooltip = ({
  children,
  tooltip,
  instant,
  side,
  tooltipClassName,
  variant = "compact",
  open,
}: TooltipProps) => (
  <ShadTooltipProvider delayDuration={instant ? 100 : 400}>
    <ShadTooltip open={open}>
      <ShadTooltipTrigger asChild>{children}</ShadTooltipTrigger>
      <ShadTooltipContent
        updatePositionStrategy="always"
        className={cn(
          "text-ui shadow-lg dark-container border border-solid border-[#3F3F48] rounded-lg",
          { "max-w-[250px] px-3 py-1": variant === "compact" },
          { "max-w-sm p-3 py-1.5": variant === "card" },
          tooltipClassName
        )}
        side={side}
      >
        {tooltip}
      </ShadTooltipContent>
    </ShadTooltip>
  </ShadTooltipProvider>
);

export default Tooltip;
