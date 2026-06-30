"use client";

// Vendored from packages/ui/src/components/RouletteTransition/RouletteTransition.tsx. Verbatim animation; @wind/Remix deps stripped for v0.

import { AnimatePresence, motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

const EASING_PRESETS = {
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  spring: [0.175, 0.885, 0.32, 1.275],
  bounce: [0.68, -0.55, 0.265, 1.55],
  smooth: [0.25, 0.1, 0.25, 1],
} as const;

type EasingPreset = keyof typeof EASING_PRESETS;

export interface RouletteTransitionProps {
  children: ReactNode;
  transitionKey: string | number;
  duration?: number;
  blur?: number;
  xOffset?: number;
  yOffset?: number;
  ySquish?: number;
  easing?: EasingPreset;
  className?: string;
  style?: CSSProperties;
  /** Controls visibility with height animation. When provided, animates height from/to 0 on show/hide. */
  show?: boolean;
}

/**
 * RouletteTransition - Vertical roulette-style transition effect
 *
 * Animates content changes with a "spinning wheel" effect:
 * - Exit: Content blurs, moves UP-RIGHT, squishes vertically
 * - Enter: New content enters from BOTTOM-RIGHT, unblurs, snaps into place
 */
export const RouletteTransition = ({
  children,
  transitionKey,
  duration = 0.4,
  blur = 8,
  xOffset = 15,
  yOffset = 30,
  ySquish = 0.7,
  easing = "easeInOut",
  className,
  style,
  show,
}: RouletteTransitionProps) => {
  // If show prop is provided, use height animation mode
  const animateHeight = show !== undefined;
  const exitVariant = {
    x: xOffset,
    y: -yOffset,
    opacity: 0,
    filter: `blur(${blur}px)`,
    scaleY: ySquish,
  };

  const enterVariant = {
    x: xOffset,
    y: yOffset,
    opacity: 0,
    filter: `blur(${blur}px)`,
    scaleY: ySquish,
  };

  const visibleVariant = {
    x: 0,
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    scaleY: 1,
  };

  // Grid-based height animation: 0fr (collapsed) -> 1fr (expanded)
  // Include marginTop to smoothly animate spacing when entering/exiting
  const heightCollapsed = { gridTemplateRows: "0fr", marginTop: 0 };
  const heightExpanded = { gridTemplateRows: "1fr", marginTop: 8 };

  const content = (
    <motion.div
      key={transitionKey}
      initial={enterVariant}
      animate={visibleVariant}
      exit={exitVariant}
      transition={{
        duration,
        ease: EASING_PRESETS[easing],
      }}
      style={{
        transformOrigin: "left center",
      }}
    >
      {children}
    </motion.div>
  );

  if (animateHeight) {
    // Combined exit: height collapse + roulette effect
    const heightExitWithRoulette = {
      ...heightCollapsed,
      ...exitVariant,
    };

    return (
      <AnimatePresence>
        {show && (
          <motion.div
            key="roulette-height-wrapper"
            className={className}
            initial={heightCollapsed}
            animate={heightExpanded}
            exit={heightExitWithRoulette}
            transition={{
              duration,
              ease: EASING_PRESETS[easing],
            }}
            style={{
              display: "grid",
              position: "relative",
              transformOrigin: "left center",
              ...style,
            }}
          >
            <div style={{ minHeight: 0 }}>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={transitionKey}
                  initial={enterVariant}
                  animate={visibleVariant}
                  exit={exitVariant}
                  transition={{
                    duration,
                    ease: EASING_PRESETS[easing],
                  }}
                  style={{
                    transformOrigin: "left center",
                  }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div
      className={className}
      style={{
        position: "relative",
        ...style,
      }}
    >
      <AnimatePresence mode="popLayout">{content}</AnimatePresence>
    </div>
  );
};

export default RouletteTransition;
