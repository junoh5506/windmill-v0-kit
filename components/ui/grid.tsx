"use client";

// Vendored from packages/ui/src/components/Grid/Grid.tsx. Styling verbatim; Remix/workspace deps stripped for v0.

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

interface Props {
  className?: string;
  children?: ReactNode;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
}

const gridStyles = cva("grid grid-cols-1", {
  variants: {
    columns: {
      1: "grid-cols-1",
      2: "@lg:grid-cols-2",
      3: "@lg:grid-cols-3",
      4: "@lg:grid-cols-3 @sm:grid-cols-2 @lg:grid-cols-4",
      5: "@xl:grid-cols-5 @md:grid-cols-3",
      6: "@xl:grid-cols-6 @md:grid-cols-4",
    },
    gap: {
      none: "gap-0",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-8",
    },
    equalHeights: {
      false: "items-start",
    },
  },
  defaultVariants: {
    columns: 2,
    gap: "md",
    equalHeights: true,
  },
});

const Grid = ({ className, children, ...styles }: Props & VariantProps<typeof gridStyles>) => {
  return (
    <div className="@container">
      <div className={cn(gridStyles(styles), className)}>{children}</div>
    </div>
  );
};

export default Grid;
