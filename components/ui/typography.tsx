"use client";

// Vendored from packages/ui/src/components/Typography. Styling verbatim; Remix/workspace deps stripped for v0.

import { CopyToClipboard } from "@/components/ui/copy-to-clipboard";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

export type LineLimit = 1 | 2 | 3 | 4 | 5 | 6;

export const LINE_LIMIT_CLASSES: Record<LineLimit, string> = {
  1: "line-clamp-1",
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
  6: "line-clamp-6",
};

interface HeaderProps {
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  id?: string;
}

export const Header = ({ className, children, level = 1, id }: HeaderProps) => {
  const Node = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5";
  return (
    <Node
      className={cn(
        {
          "text-primary text-header-lg": level === 1,
          "text-primary font-medium text-body-sm": level === 2,
          "text-primary text-header-sm ": level === 3,
          "text-body-md font-medium leading-snug": level === 4, //aim to deprecate
          "text-md font-medium leading-snug": level === 5, //aim to deprecate
          "text-sm font-medium leading-snug": level === 6, //aim to deprecate
        },
        className
      )}
      id={id}
    >
      {children}
    </Node>
  );
};

interface ParagraphProps {
  className?: string;
  children: ReactNode;
  lineLimit?: LineLimit;
  id?: string;
}

export const Paragraph = ({ className, children, lineLimit, id }: ParagraphProps) => {
  return (
    <div
      id={id}
      className={cn(
        "text-body-sm text-secondary font-normal",
        className,
        lineLimit ? LINE_LIMIT_CLASSES[lineLimit] : undefined
      )}
    >
      {children}
    </div>
  );
};

export type LabelIntent =
  | "tertiary"
  | "secondary"
  | "primary"
  | "nav"
  | "nav-header"
  | "table-header";

interface LabelProps {
  className?: string;
  children: ReactNode;
  id?: string;
  icon?: ReactNode;
  intent?: LabelIntent;
}

const LabelStyles = cva("", {
  variants: {
    intent: {
      primary: "text-primary text-body-sm font-medium",
      secondary: "text-secondary text-body-sm font-medium",
      tertiary: "text-secondary text-caption",
      nav: "text-body-sm font-medium",
      "nav-header": "text-caption font-medium",
      "table-header": "text-body-sm font-medium text-secondary",
    },
    maxLines: {
      1: "line-clamp-1",
      2: "line-clamp-2",
      3: "line-clamp-3",
      4: "line-clamp-4",
    },
  },
  defaultVariants: {
    intent: "primary",
    maxLines: null,
  },
});

export const Label = ({
  className,
  children,
  id,
  icon,
  ...styleProps
}: LabelProps & VariantProps<typeof LabelStyles>) => {
  if (icon) {
    return (
      <div id={id} className={cn("flex items-center gap-2", className)}>
        {icon && <span className="text-tertiary">{icon}</span>}
        <div className={LabelStyles(styleProps)}>{children}</div>
      </div>
    );
  } else {
    return <div className={cn(LabelStyles(styleProps), className)}>{children}</div>;
  }
};

interface MonoLabelProps {
  className?: string;
  children: string;
  id?: string;
  masked?: boolean;
  hideCopyButton?: boolean;
}

export const MonoLabel = ({ className, children, id, masked, hideCopyButton }: MonoLabelProps) => {
  return (
    <Label className={cn(className, "font-mono")} intent="secondary" id={id}>
      {hideCopyButton && children}
      {!hideCopyButton && <CopyToClipboard masked={masked}>{children}</CopyToClipboard>}
    </Label>
  );
};

interface IdentifierProps {
  className?: string;
  id: string;
  children: ReactNode | string;
  to?: string;
  newTab?: boolean;
  onClick?: () => void;
  hideCopyButton?: boolean;
}

// NOTE: Remix Link replaced with a plain <a> for v0.
export const Identifier = ({
  className,
  id,
  children,
  to,
  newTab,
  onClick,
  hideCopyButton,
}: IdentifierProps) => {
  const Inner = (
    <div className={className}>
      <Label
        className={cn({
          "text-accent underline": to,
        })}
      >
        {children}
      </Label>
      <MonoLabel hideCopyButton={hideCopyButton} className="text-xs">
        {id}
      </MonoLabel>
    </div>
  );

  if (to) {
    return (
      <a href={to} target={newTab ? "_blank" : undefined}>
        {Inner}
      </a>
    );
  } else if (onClick) {
    return (
      <button onClick={onClick} className="cursor-pointer text-left">
        {Inner}
      </button>
    );
  } else {
    return Inner;
  }
};
