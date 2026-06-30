"use client";
// Vendored from packages/ui/src/components/Wireframe. Styling verbatim; @wind/Remix/app deps stubbed for v0.

import { Header, Label } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface Props {
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export const WireframeContainer = ({ title, description, children, className }: Props) => (
  <div
    className={cn(
      "flex flex-col gap-4 align-center p-4 bg-black/10 w-full border-dashed border-black border-2 rounded-md",
      className
    )}
  >
    <div className="py-4 text-center">
      <Header level={3}>{title}</Header>
      <Label maxLines={3}>{description}</Label>
    </div>
    {children}
  </div>
);

export default WireframeContainer;
