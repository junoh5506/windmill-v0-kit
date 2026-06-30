"use client";

// Vendored from packages/ui/src/components/Keyboard/Keyboard.tsx. Styling verbatim; Remix/workspace deps stripped for v0. react-icons swapped for @tabler/icons-react equivalents (production's icon set).

import { cn } from "@/lib/utils";
import {
  IconArrowBigUp,
  IconSquareArrowDown,
  IconSquareArrowLeft,
  IconSquareArrowRight,
  IconSquareArrowUp,
  IconCornerDownLeft,
  IconCommand,
  IconBackspace,
  IconDevices,
} from "@tabler/icons-react";
import type { ReactNode } from "react";

// NOTE: keyboard glyphs use Tabler icons; the ⌥ (Option/Alt) key has no Tabler glyph, so it renders as the literal symbol.
const keyMap: Record<string, ReactNode> = {
  command: <IconCommand />,
  meta: <IconCommand />,
  return: <IconCornerDownLeft />,
  enter: <IconCornerDownLeft />,
  shift: <IconArrowBigUp />,
  alt: <span aria-hidden>⌥</span>,
  arrowup: <IconSquareArrowUp />,
  arrowdown: <IconSquareArrowDown />,
  arrowleft: <IconSquareArrowLeft />,
  arrowright: <IconSquareArrowRight />,
  backspace: <IconBackspace />,
  tab: <IconDevices />,
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
