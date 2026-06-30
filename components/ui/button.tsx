"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { IconLoader2 as Loader2 } from "@tabler/icons-react";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

/*
 * Vendored from packages/ui/src/components/Button/Button.tsx. The ButtonStyles
 * CVA (intent/size/compoundVariants + classNames) is copied verbatim so the
 * look matches production exactly. The Remix-router Wrapper, Tooltip, hotkey,
 * and framer-motion loading choreography are dropped for prototyping — a plain
 * <button> with a lucide spinner stands in.
 */
export const ButtonStyles = cva(
  "relative inline-flex items-center justify-center transition transition-all duration-75 group group/button whitespace-nowrap overflow-hidden",
  {
    variants: {
      intent: {
        primary: "text-accent-inverse border",
        secondary: "border",
        transparent: "text-primary",
        link: "",
        icon: "",
      },
      size: {
        subtle: "text-body-sm text-secondary",
        sm: "px-2 rounded-md text-ui h-7",
        md: "px-3 rounded-md text-ui h-8",
        lg: "px-4 rounded-md text-ui h-9",
      },
      block: { true: "w-full" },
      mobileBlock: { true: "w-full md:w-auto" },
      loading: { true: "cursor-wait" },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "active:scale-[98%]",
      },
    },
    defaultVariants: { intent: "secondary", disabled: false, size: "md", loading: false },
    compoundVariants: [
      { intent: "primary", className: "bg-accent border-accent" },
      { intent: "link", className: "hover:underline underline-offset-4" },
      { intent: "secondary", className: "bg-surface translate-y-0" },
      { intent: "transparent", className: "bg-accent/5" },
      {
        intent: "primary",
        loading: false,
        disabled: false,
        className: "hover:bg-primary-hover hover:border-accent/80",
      },
      {
        intent: "secondary",
        loading: false,
        disabled: false,
        className: "hover:bg-secondary-hover",
      },
      { intent: "transparent", loading: false, disabled: false, className: "hover:bg-accent/10" },
      { intent: "primary", loading: true, className: "bg-primary-hover border-accent/80" },
      { intent: "secondary", loading: true, className: "bg-secondary-hover" },
      { intent: "transparent", loading: true, className: "bg-accent/10" },
    ],
  }
);

type StyleVariants = Omit<VariantProps<typeof ButtonStyles>, "disabled" | "loading">;

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled">, StyleVariants {
  label?: ReactNode;
  icon?: ReactNode;
  iconRight?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      intent = "secondary",
      size = "md",
      block = false,
      mobileBlock = false,
      label,
      icon,
      iconRight = false,
      loading = false,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          ButtonStyles({ intent, size, block, mobileBlock, loading, disabled }),
          className
        )}
        {...props}
      >
        {icon && !iconRight && <span className="relative pr-2 opacity-80">{icon}</span>}
        <span className={cn("relative max-w-xs truncate", loading && "opacity-0")}>
          {label ?? children}
        </span>
        {icon && iconRight && <span className="relative pl-2 opacity-50">{icon}</span>}
        {loading && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
