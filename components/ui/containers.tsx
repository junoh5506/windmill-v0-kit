"use client";

// Vendored from packages/ui/src/components/Containers. Styling verbatim; Remix/workspace deps stripped for v0.

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { IconChevronRight as ChevronRight } from "@tabler/icons-react";
import { useEffect, useLayoutEffect, useRef, useState, type FC, type ReactNode } from "react";

const maxWidthStyles = cva("w-full", {
  variants: {
    maxWidth: {
      sm: "max-w-screen-sm",
      md: "max-w-screen-md",
      lg: "max-w-screen-lg",
    },
  },
  defaultVariants: {
    maxWidth: "md",
  },
});

interface MaxWidthProps {
  className?: string;
  children?: ReactNode;
}

export const MaxWidthContainer = ({
  className,
  children,
  ...variantStyles
}: MaxWidthProps & VariantProps<typeof maxWidthStyles>) => {
  return <div className={cn(maxWidthStyles(variantStyles), className)}>{children}</div>;
};

const DEFAULT_BUFFER_HEIGHT = 50;

interface ExpandButtonRenderProps {
  onClick: () => void;
  isExpanded: boolean;
  expandGradientToBase?: boolean;
}

const DefaultExpandButton: FC<ExpandButtonRenderProps> = ({
  onClick,
  isExpanded,
  expandGradientToBase,
}) => {
  const expanderIcon = (
    <ChevronRight
      className={cn("transition-transform w-4 opacity-50", {
        "-rotate-90": isExpanded,
        "rotate-90": !isExpanded,
      })}
    />
  );
  return (
    <div className="relative">
      <button
        className="flex w-full items-center gap-2 pt-1 text-xs text-tertiary hover:underline hover:underline-offset-4"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        {isExpanded ? "View Less" : "View More"}
        {expanderIcon}
      </button>
      <div
        className={cn("absolute left-0 right-0 h-6 -top-6 z-10 pointer-events-none", {
          "bg-gradient-to-b from-transparent to-surface": !isExpanded && !expandGradientToBase,
          "bg-gradient-to-b from-transparent to-base": !isExpanded && expandGradientToBase,
        })}
      />
    </div>
  );
};

interface ExpandableProps {
  className?: string;
  maxHeight: number;
  buffer?: number;
  expandButton?: FC<ExpandButtonRenderProps>;
  children: ReactNode;
  // If true, the gradient will be from transparent to base instead of surface
  expandGradientToBase?: boolean;
}

// NOTE: @react-hook/window-size replaced with a window resize listener, and the
// framer-motion height animation replaced with a CSS height transition for v0.
export const ExpandableContainer = ({
  maxHeight,
  buffer = DEFAULT_BUFFER_HEIGHT,
  expandButton,
  expandGradientToBase = false,
  children,
}: ExpandableProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const [width, setWidth] = useState(typeof window === "undefined" ? 0 : window.innerWidth);

  const Expander = expandButton ?? DefaultExpandButton;

  const measureContent = () => {
    const element = contentRef.current;
    if (!element) {
      return;
    }

    const height = element.scrollHeight;
    setContentHeight(height);
    setShouldShowButton(height > maxHeight + buffer);
  };

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useLayoutEffect(() => {
    measureContent();
  }, [children, width, maxHeight, buffer]);

  // Re-measure when page becomes visible (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Small delay to ensure rendering is complete
        setTimeout(measureContent, 100);
      }
    };

    const handleFocus = () => {
      setTimeout(measureContent, 100);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Fallback: re-measure periodically if content height is still null
  useEffect(() => {
    if (contentHeight === null) {
      const interval = setInterval(() => {
        measureContent();
      }, 500);

      return () => clearInterval(interval);
    }
  }, [contentHeight]);

  if (contentHeight === null) {
    return <div ref={contentRef}>{children}</div>;
  }

  const collapsedHeight = shouldShowButton ? maxHeight : contentHeight;
  const displayHeight = isExpanded ? contentHeight : collapsedHeight;

  return (
    <div>
      <div
        className="transition-all duration-300"
        style={{ height: displayHeight, overflow: "hidden" }}
      >
        <div ref={contentRef}>{children}</div>
      </div>
      {shouldShowButton && (
        <Expander
          onClick={() => setIsExpanded(!isExpanded)}
          isExpanded={isExpanded}
          expandGradientToBase={expandGradientToBase}
        />
      )}
    </div>
  );
};
