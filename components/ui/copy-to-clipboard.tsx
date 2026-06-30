"use client";

// Vendored from packages/ui/src/components/CopyToClipboard/CopyToClipboard.tsx. Styling verbatim; Remix/workspace deps stripped for v0.

import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface Props {
  children: string;
  overflowEllipsis?: boolean;
  masked?: boolean;
}

// NOTE: @wind useBool hook + toast notifications dropped; uses local state and
// the browser navigator.clipboard API for v0.
export const CopyToClipboard = ({ children, masked, overflowEllipsis = false }: Props) => {
  const [hasCopied, setHasCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    setHasCopied(true);
    navigator.clipboard.writeText(children).finally(() => {
      setTimeout(() => {
        setHasCopied(false);
      }, 1000);
    });
  };

  const displayChildren = masked && !hovered ? children.replace(/./g, "•") : children;

  return (
    <span
      className="group max-w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="inline-flex items-center">
        <span
          data-masked-value={children}
          data-testid="masked-value"
          className={cn({
            "overflow-hidden text-ellipsis whitespace-nowrap flex-none": overflowEllipsis,
          })}
        >
          {displayChildren}
        </span>

        <span
          onClick={(e) => {
            handleClick();
            e.preventDefault();
            e.stopPropagation();
          }}
          className={cn(
            "ml-3 cursor-pointer text-xs text-tertiary opacity-0",
            "transition-all",
            "hover:text-primary group-hover:opacity-100"
          )}
        >
          {hasCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </span>
      </span>
    </span>
  );
};

export default CopyToClipboard;
