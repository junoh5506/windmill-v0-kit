"use client";

// Vendored from packages/ui/src/components/Tags/Tags.tsx (Tag/Tags) and Chip/Chip.tsx. Remix Link, HoverCard, Tooltip, Wrapper, react-loading-skeleton stripped for v0.
// NOTE: Tag's `to` (Remix Link) renders as a plain <a>; `hoverCardContent` is dropped. Chip's `tooltip`/`loading` skeleton are dropped — title renders directly.
// DIVERGENCE: the status intents are intentionally NOT verbatim — status pills use a white/surface bg with colored text + colored border (never a colored fill).

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import type { ReactNode } from "react";

const tagStyles = cva(
  "break-none flex-none gap-2 inline-flex border items-center whitespace-nowrap rounded-full py-[2px] px-2 text-caption text-secondary",
  {
    variants: {
      intent: {
        // Status pills are NEVER a colored fill: white/surface bg, colored text, colored border.
        // (border-{color}-foreground = the saturated foreground; bare border-{color} is the pale tint.)
        accent: "bg-accent text-accent-inverse",
        success: "bg-surface text-green border-green-foreground",
        error: "bg-surface text-red border-red-foreground",
        warning: "bg-surface text-yellow border-yellow-foreground",
        default: "bg-surface",
      },
    },
    defaultVariants: {
      intent: "default",
    },
  }
);

export type TagIntent = NonNullable<VariantProps<typeof tagStyles>["intent"]>;

export const Tag = ({
  className,
  children,
  to,
  onClick,
  icon,
  ...variantProps
}: {
  className?: string;
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  icon?: ReactNode;
} & VariantProps<typeof tagStyles>) => {
  const isHoverable = to || onClick;
  const inner = (
    <div
      className={cn(
        tagStyles(variantProps),
        {
          "cursor-point transition-all underline-style-dashed hover:bg-black/5 hover:underline":
            to || onClick || isHoverable,
        },
        className
      )}
    >
      {icon && <div className="text-xs opacity-70">{icon}</div>}
      {children}
    </div>
  );
  if (to) {
    return (
      <a target="_blank" rel="noreferrer" href={to}>
        {inner}
      </a>
    );
  } else if (onClick) {
    return (
      <button type="button" onClick={onClick}>
        {inner}
      </button>
    );
  }
  return inner;
};

export const Tags = ({
  className,
  tags,
  onClick,
  nowrap,
}: {
  className?: string;
  tags: string[];
  onClick?: (tag: string) => void;
  nowrap?: boolean;
}) => {
  return (
    <div
      className={cn(className, "flex gap-2", {
        "flex-wrap": !nowrap,
      })}
    >
      {tags.map((tag) => (
        <Tag
          key={tag}
          onClick={
            onClick
              ? () => {
                  onClick(tag);
                }
              : undefined
          }
        >
          {tag}
        </Tag>
      ))}
    </div>
  );
};

export interface ChipProps {
  className?: string;
  title?: string | null;
  subtitle?: string | null;
  icon?: ReactNode;
  onRemove?: () => void;
  removeDisabled?: boolean;
}

export const Chip = ({ className, title, subtitle, icon, onRemove, removeDisabled }: ChipProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full border bg-surface h-7 overflow-hidden",
        {
          "pl-1": icon,
          "pl-3": !icon,
          "pr-3": !onRemove,
        },
        className
      )}
    >
      <div className="flex min-w-0 flex-grow items-center gap-1">
        {icon && <div className="circle-6 m-[2px] flex-none text-tertiary">{icon}</div>}
        <div className="flex min-w-0 items-center gap-1">
          <span className="truncate text-body-sm text-secondary">{title}</span>
          {subtitle && <span className="text-body-sm text-tertiary">{subtitle}</span>}
        </div>
      </div>
      {onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          disabled={removeDisabled}
          tabIndex={0}
          className="hover:text-accent-hover circle-6 m-[2px] flex-none cursor-pointer text-accent hover:bg-black/10"
        >
          <X className="w-2" />
        </button>
      )}
    </div>
  );
};

export default Tag;
