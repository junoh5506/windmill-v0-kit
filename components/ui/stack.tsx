"use client";

// Vendored from packages/ui/src/components/Stack/VStack.tsx, HStack.tsx, genericStyles.ts. Styling copied verbatim; Remix/workspace deps stripped for v0.

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Children, Fragment, forwardRef, type CSSProperties, type ReactNode } from "react";

export const GenericStyles = cva("", {
  variants: {
    padding: {
      sm: "p-2",
      md: "p-4",
      lg: "p-8",
      true: "p-4",
    },
    paddingX: {
      true: "px-4",
    },
    paddingY: {
      true: "py-4",
    },
    border: {
      true: "border",
    },
    bg: {
      accent: "bg-accent",
    },
  },
});

export type GenericStylesProps = VariantProps<typeof GenericStyles>;

interface VStackProps extends GenericStylesProps {
  id?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  gapNone?: boolean;
  gapXs?: boolean;
  gapSm?: boolean;
  gapMd?: boolean;
  gapLg?: boolean;
  alignStart?: boolean;
  alignCenter?: boolean;
  alignEnd?: boolean;
  alignStretch?: boolean;
  alignBetween?: boolean;
  justifyBetween?: boolean;
  divide?: boolean;
  style?: CSSProperties;
}

export const VStack = forwardRef<HTMLDivElement, VStackProps>(
  (
    {
      id,
      onClick,
      alignCenter,
      alignEnd,
      alignStart,
      alignStretch,
      alignBetween,
      justifyBetween,
      gapNone,
      gapSm,
      gapMd,
      gapLg,
      gapXs,
      className,
      children,
      style,
      divide = false,
      ...styles
    },
    ref
  ) => {
    return (
      <div
        id={id}
        ref={ref}
        onClick={onClick}
        className={cn(
          "items-stretch gap-4 flex flex-col",
          {
            "items-start": alignStart,
            "items-center": alignCenter,
            "items-end": alignEnd,
            "items-stretch": alignStretch,
            "items-between": alignBetween,
            "justify-between": justifyBetween,
            "gap-y-0": gapNone,
            "gap-y-1": gapXs,
            "gap-y-2": gapSm,
            "gap-y-4": gapMd,
            "gap-y-8": gapLg,
            "divide-border gap-0 divide-y": divide,
          },
          GenericStyles(styles),
          className
        )}
        style={style}
      >
        {children}
      </div>
    );
  }
);

VStack.displayName = "VStack";

interface HStackProps extends GenericStylesProps {
  children: ReactNode;
  divider?: ReactNode | boolean;
  className?: string;
  gapNone?: boolean;
  gapXs?: boolean;
  gapSm?: boolean;
  gapMd?: boolean;
  gapLg?: boolean;

  alignXStart?: boolean;
  alignXCenter?: boolean;
  alignXEnd?: boolean;
  alignXStretch?: boolean;
  alignXBetween?: boolean;

  alignYTop?: boolean;
  alignYCenter?: boolean;
  alignYBottom?: boolean;
  alignYStretch?: boolean;
  alignYBetween?: boolean;

  stackOnMobile?: boolean;
}

export const HStack = ({
  className,
  children,
  gapNone,
  gapXs,
  gapSm,
  gapMd,
  gapLg,
  alignXStart,
  alignXCenter,
  alignXEnd,
  alignXStretch,
  alignXBetween,
  alignYTop,
  alignYCenter,
  alignYBottom,
  alignYStretch,
  alignYBetween,
  stackOnMobile,
  divider,
  ...styles
}: HStackProps) => {
  const childrenArray = Children.toArray(children);
  return (
    <div
      className={cn(
        "items-center gap-x-4 gap-y-1",
        "flex",
        {
          "gap-x-0": gapNone,
          "gap-x-1": gapXs,
          "gap-x-2": gapSm,
          "gap-x-4": gapMd,
          "gap-x-8": gapLg,
        },
        {
          "justify-start": alignXStart,
          "justify-center": alignXCenter,
          "justify-end": alignXEnd,
          "justify-stretch": alignXStretch,
          "justify-between": alignXBetween,
        },
        {
          "items-start": alignYTop,
          "items-center": alignYCenter,
          "items-end": alignYBottom,
          "items-stretch": alignYStretch,
          "items-between": alignYBetween,
        },
        {
          "flex-col md:flex-row": stackOnMobile,
        },
        GenericStyles(styles),
        className
      )}
    >
      {childrenArray.map((child, index) => {
        return (
          <Fragment key={index}>
            {child}
            {index !== childrenArray.length - 1 && divider && (
              <div className="flex-shrink-0">{typeof divider === "boolean" ? null : divider}</div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
};
