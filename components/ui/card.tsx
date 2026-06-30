"use client";

// Vendored from packages/ui/src/components/Card/Card.tsx. Styling copied verbatim; framer-motion/Spinner/Link/Tooltip/Button workspace deps stripped for v0.
// NOTE: CardHeader's `isLoading` spinner (framer-motion) and `viewDetailLink` (Remix Link) are dropped. `button` accepts a ReactNode instead of ButtonProps. Title/Label render as a plain styled element.

import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  id?: string;
}

const CardHeader = ({
  icon,
  title,
  className,
  accessory,
  button,
  viewDetailLink,
}: {
  icon?: ReactNode;
  title: ReactNode;
  className?: string;
  accessory?: ReactNode;
  button?: ReactNode;
  viewDetailLink?: {
    to: string;
    label?: string;
  };
}) => {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center w-full gap-y-1 gap-x-3 border-b px-4 py-2 bg-surface-muted/50",
        {
          "pr-2": button,
        },
        className
      )}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex items-center gap-2">
            <span>{icon}</span>
          </div>
        )}
        <span className="text-body-sm font-medium text-primary">{title}</span>
      </div>
      <div className="flex-grow" />
      <div>
        {accessory}
        {button}
        {viewDetailLink && (
          <a
            href={viewDetailLink.to}
            className="group/view-all-link flex items-center gap-1 text-sm text-secondary underline-offset-2 transition-all hover:text-primary hover:underline"
          >
            {viewDetailLink.label ?? "View All"}
            <ArrowRight className="w-[1.2em] -rotate-45 opacity-50 transition-all group-hover/view-all-link:-translate-y-[2px] group-hover/view-all-link:translate-x-[2px] group-hover/view-all-link:opacity-90" />
          </a>
        )}
      </div>
    </div>
  );
};

export const CardBody = ({
  children,
  className,
  id,
  maxHeight,
  noPadding,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  maxHeight?: boolean;
  noPadding?: boolean;
}) => {
  return (
    <div
      id={id}
      className={cn(
        "flex-grow",
        {
          "": noPadding,
          "p-4": !noPadding,
        },
        {
          "max-h-72 overflow-y-auto": maxHeight,
        },
        className
      )}
    >
      {children}
    </div>
  );
};

const CardFooter = ({
  children,
  id,
  className,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
}) => {
  return (
    <div id={id} className={cn("border-t bg-surface-muted px-4 py-2", className)}>
      {children}
    </div>
  );
};

const CardActions = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <div
      className={cn(
        "border-blue bg-blue flex flex-col gap-2 border-t bg-opacity-20 px-2 py-2 md:flex-row md:items-center md:justify-end",
        className
      )}
    >
      {children}
    </div>
  );
};

export const Card = ({ className, children, id }: Props) => {
  return (
    <div
      id={id}
      className={cn(
        "overflow-hidden rounded-lg border bg-surface shadow-sm flex flex-col",
        className
      )}
    >
      {children}
    </div>
  );
};

Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Actions = CardActions;
Card.Header = CardHeader;

export default Card;
