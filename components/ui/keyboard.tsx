"use client";

// Vendored from packages/ui/src/components/Keyboard/Keyboard.tsx. Styling verbatim; Remix/workspace deps stripped for v0. react-icons swapped for lucide-react equivalents.

import { cn } from "@/lib/utils";
import {
  ArrowBigUp,
  ArrowDownSquare,
  ArrowLeftSquare,
  ArrowRightSquare,
  ArrowUpSquare,
  CornerDownLeft,
  Command,
  Delete,
  Option,
  TabletSmartphone,
} from "lucide-react";
import type { ReactNode } from "react";

// NOTE: original mapped react-icons/bs + react-icons/md; substituted nearest lucide-react icons.
const keyMap: Record<string, ReactNode> = {
  command: <Command />,
  meta: <Command />,
  return: <CornerDownLeft />,
  enter: <CornerDownLeft />,
  shift: <ArrowBigUp />,
  alt: <Option />,
  arrowup: <ArrowUpSquare />,
  arrowdown: <ArrowDownSquare />,
  arrowleft: <ArrowLeftSquare />,
  arrowright: <ArrowRightSquare />,
  backspace: <Delete />,
  tab: <TabletSmartphone />,
  escape: "ESC",
};

export interface Props {
  className?: string;
  children: string;
}

const Keyboard = ({ className, children }: Props) => (
  <kbd
    className={cn(
      className,
      "bg-text/10 flex h-5 items-center gap-1 rounded border border-text/20 bg-base/20 px-2 py-1 font-mono text-xs font-semibold"
    )}
  >
    {children.split("+").map((char) => {
      if (char.toLowerCase() in keyMap) {
        return (
          <span key={char}>
            {keyMap[char.toLowerCase()]} <span className="sr-only">{char}</span>
          </span>
        );
      } else {
        return (
          <span key={char} style={{ fontSize: "0.8rem" }}>
            {char.toUpperCase()}
          </span>
        );
      }
    })}
  </kbd>
);

export default Keyboard;
