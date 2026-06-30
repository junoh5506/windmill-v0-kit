"use client";

// Vendored from packages/ui/src/components/HoverCard/HoverCard.tsx. Styling verbatim; Remix/workspace deps stripped for v0.

import { cn } from "@/lib/utils";
import { Content, Portal, Root, Trigger } from "@radix-ui/react-hover-card";
import {
  forwardRef,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type FC,
} from "react";

const HoverCard: FC<ComponentProps<typeof Root>> = ({ children, ...props }) => {
  return (
    <Root openDelay={700} {...props}>
      {children}
    </Root>
  );
};

const HoverCardTrigger = Trigger;

const HoverCardPortal = Portal;

export type HoverCardSide = "top" | "right" | "bottom" | "left";

interface HoverCardContentProps extends ComponentPropsWithoutRef<typeof Content> {
  align?: "center" | "start" | "end";
  side?: HoverCardSide;
  sideOffset?: number;
  className?: string;
}

const HoverCardContent = forwardRef<ElementRef<typeof Content>, HoverCardContentProps>(
  ({ className, align = "center", side = "left", sideOffset = 4, ...props }, ref) => (
    <HoverCardPortal>
      <Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        side={side}
        className={cn(
          "text-popover-foreground z-50 w-64 rounded-md border bg-surface p-4 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </HoverCardPortal>
  )
);
HoverCardContent.displayName = Content.displayName;

export { HoverCard, HoverCardContent, HoverCardTrigger };
