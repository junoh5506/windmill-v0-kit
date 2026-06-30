"use client";

// Vendored from packages/ui/src/components/AutoHeightTransition/AutoHeightTransition.tsx. Verbatim animation; @wind/Remix deps stripped for v0.

import { useEffect, useState, type PropsWithChildren } from "react";

interface AutoHeightTransitionProps {
  delay?: number;
  defaultHeight?: number | "auto";
}

// TODO (jchaiken1) if performance becomes an issue with many of these - share the observer instance
const AutoHeightTransition = ({
  children,
  delay = 0.5,
  defaultHeight = "auto",
}: PropsWithChildren<AutoHeightTransitionProps>) => {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<"auto" | number>(defaultHeight);

  const cssHeight = height === "auto" ? height : `${height}px`;

  useEffect(() => {
    if (!element || typeof ResizeObserver === "undefined") {
      return;
    }
    const observer = new ResizeObserver((entries) => {
      setHeight(entries[0].contentRect.height);
    });

    observer.observe(element);

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [element]);

  const isServer = typeof document === "undefined";

  return (
    <div
      className="outer relative z-[1] overflow-hidden transition-[height]"
      style={{ height: cssHeight, transitionDuration: `${delay}s` }}
    >
      <div
        ref={(ref) => {
          setElement(ref);
        }}
        className="inner left-0 top-0 w-full"
        style={{
          position: typeof ResizeObserver === "undefined" && !isServer ? "initial" : "absolute",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AutoHeightTransition;
