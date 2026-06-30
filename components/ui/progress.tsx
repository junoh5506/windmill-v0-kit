"use client";

// Vendored from packages/ui/src/components/Progress/{Progress,RadialProgress,TimedProgress}.tsx. Styling verbatim; Remix/workspace deps stripped for v0.

import { cn } from "@/lib/utils";
import { Indicator, Root } from "@radix-ui/react-progress";
import {
  forwardRef,
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";

interface Props extends ComponentPropsWithoutRef<typeof Root> {
  className?: string;
  value?: number;
  indicatorClassName?: string;
  indicatorBackgroundColor?: string;
  variant?: "rounded" | "squared";
}

const Progress = forwardRef<ElementRef<typeof Root>, Props>(
  (
    {
      className,
      value,
      indicatorClassName,
      indicatorBackgroundColor,
      variant = "rounded",
      ...props
    },
    ref
  ) => (
    <Root
      ref={ref}
      className={cn(
        "relative h-3 w-full overflow-hidden bg-accent/10",
        {
          "rounded-full": variant === "rounded",
          "rounded-none": variant === "squared",
        },
        className
      )}
      {...props}
    >
      <Indicator
        className={cn(
          "h-full w-full flex-1 bg-accent transition-all duration-500",
          {
            "rounded-full": variant === "rounded",
            "rounded-none": variant === "squared",
          },
          indicatorClassName
        )}
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          ...(indicatorBackgroundColor && { backgroundColor: indicatorBackgroundColor }),
        }}
      />
    </Root>
  )
);
Progress.displayName = Root.displayName;

interface RadialProgressProps {
  className?: string;
  progress: number;
  backgroundClassName?: string;
  progressClassName?: string;
}

export const RadialProgress = ({
  className,
  progress,
  backgroundClassName,
  progressClassName,
}: RadialProgressProps) => {
  const circumference = 2 * Math.PI * 40; // 2πr
  const offset = circumference - progress * circumference;

  return (
    <div className={cn(className)}>
      <div className="h-8 w-8">
        <svg className="h-full w-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className={cn("stroke-current text-black/10", backgroundClassName)}
            strokeWidth="20"
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
          ></circle>
          {/* Progress circle */}
          <circle
            className={cn("stroke-current text-accent", progressClassName)}
            strokeWidth="20"
            strokeLinecap="round"
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            style={{
              strokeDasharray: `${circumference} ${circumference}`,
              strokeDashoffset: offset,
              transition: "stroke-dashoffset 0.35s",
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
            }}
          ></circle>
        </svg>
      </div>
    </div>
  );
};

interface TimedProgressProps {
  className?: string;

  /**
   * Estimated total time of progress bar in seconds
   */
  estimatedTime: number;
}

export const TimedProgress = ({ className, estimatedTime }: TimedProgressProps) => {
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState(estimatedTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time - 1);
      setProgress((time / estimatedTime) * 100);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [time]);

  return <Progress value={progress} className={className} />;
};

export { Progress };

export default Progress;
