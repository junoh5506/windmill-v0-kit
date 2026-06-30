"use client";

// Vendored from packages/ui/src/components/FadeUpWithDelay/FadeUpWithDelay.tsx. Verbatim animation; @wind/Remix deps stripped for v0.

import { motion } from "framer-motion";
import { useState, type PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  className?: string;
  index?: number;
  baseDelay?: number;
  delayIncrement?: number;
  isVisible?: boolean;
}

const FadeUpWithDelay = ({
  children,
  className,
  index = 0,
  baseDelay = 0,
  delayIncrement = 0.1,
  isVisible = true,
}: Props) => {
  const [isVisibleOnLoad] = useState(isVisible);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{
        duration: 0.3,
        delay: isVisibleOnLoad ? baseDelay + index * delayIncrement : 0,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeUpWithDelay;
