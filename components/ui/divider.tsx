"use client";

// Vendored from packages/ui/src/components/Divider/Divider.tsx. Styling verbatim; Remix/workspace deps stripped for v0.

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

interface Props {
  className?: string;
}

const dividerStyles = cva("", {
  variants: {
    orientation: {
      horizontal: "h-[1px] w-full my-1",
      vertical: "w-[1px] h-full mx-1",
    },
    color: {
      primary: "bg-border",
      "accent-inverse": "bg-accent-inverse",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    color: "primary",
  },
});

const Divider = ({ className, ...variantStyles }: Props & VariantProps<typeof dividerStyles>) => {
  return <div className={cn(dividerStyles(variantStyles), className)} />;
};

export default Divider;
