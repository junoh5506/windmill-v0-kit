"use client";

// Vendored from packages/ui/src/components/GradientBackground/GradientBackground.tsx. Verbatim animation; @wind/Remix deps stripped for v0.

import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

const GradientBackground = ({ className }: Props) => (
  <div className={cn("overflow-hidden -z-10 pointer-events-none rounded-lg", className)}>
    <div className="absolute bottom-[-34%] left-[-20%] h-[40%] w-[60%] rounded-full bg-gradientBanner-accent1/30 blur-2xl"></div>
    <div className="absolute bottom-[-36%] right-[10%] h-[50%] w-[70%] rounded-full bg-gradientBanner-accent2/30 blur-2xl"></div>
    <div className="absolute bottom-[-30%] right-[-20%] h-[45%] w-[65%] rounded-full bg-gradientBanner-accent3/30 blur-2xl"></div>
  </div>
);

export default GradientBackground;
