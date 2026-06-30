"use client";

// Vendored from packages/ui/src/components/FlexibleSpacer/FlexibleSpacer.tsx. Styling verbatim; Remix/workspace deps stripped for v0.

import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

const FlexibleSpacer = ({ className }: Props) => {
  return <div className={cn(className, "flex-grow")}></div>;
};

export default FlexibleSpacer;
