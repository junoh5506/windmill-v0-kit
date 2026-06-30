"use client";

// Vendored from packages/ui/src/components/TextArea/TextArea.tsx. Styling verbatim; Remix/workspace deps stripped for v0.

import {
  ComponentLabelWrapper,
  type ComponentLabelWrapperProps,
} from "@/components/ui/component-label-wrapper";
import { cn } from "@/lib/utils";
import {
  forwardRef,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type HTMLInputTypeAttribute,
} from "react";

const DEFAULT_MAX_HEIGHT_PX = 400;

export interface TextAreaProps extends ComponentProps<"textarea"> {
  containerClassName?: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  inputStyle?: "NORMAL" | "CHROMELESS" | "DEEMPHASIZED";
  inputClassName?: string;
  rows?: number;
  value?: string;
  maxRows?: number;
  minRows?: number;
  hidden?: boolean;
  maxHeightPx?: number;
  autoResize?: boolean;
  label?: Omit<ComponentLabelWrapperProps, "htmlFor">;
}

const useIsoEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      containerClassName,
      inputClassName,
      hidden,
      inputStyle = "NORMAL",
      disabled,
      readOnly,
      autoResize,
      onChange,
      id,
      label,
      maxHeightPx,
      ...props
    },
    ref
  ) => {
    const [textAreaHeight, setTextAreaHeight] = useState("auto");

    const internalRef = useRef<HTMLTextAreaElement | null>(null);

    const generatedId = useId();
    id = id ?? generatedId;

    const setRefs = (element: HTMLTextAreaElement | null) => {
      internalRef.current = element;

      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    useIsoEffect(() => {
      if (!autoResize) {
        return;
      }

      if (props.value === "") {
        setTextAreaHeight("auto");
        return;
      }

      const element = internalRef.current;

      if (!element) {
        return;
      }

      const measure = () => {
        const height = Math.min(element.scrollHeight, maxHeightPx ?? DEFAULT_MAX_HEIGHT_PX);
        setTextAreaHeight(`${height}px`);
      };

      if (element.scrollHeight > 0) {
        measure();
        return;
      }

      const observer = new ResizeObserver(() => {
        if (element.scrollHeight > 0) {
          measure();
          observer.disconnect();
        }
      });
      observer.observe(element);
      return () => observer.disconnect();
    }, [props.value, autoResize, maxHeightPx]);

    /*
     * Need this to stop perpetual resizing of textArea on key input due to padding
     * Also to properly resize on text deletion, a reset to 'auto' is needed
     */
    const onChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        setTextAreaHeight("auto");
      }

      if (onChange) {
        onChange(event);
      }
    };

    const textareaEl = (
      <div
        className={cn(
          "rounded-md",
          inputStyle !== "CHROMELESS" && "focus-within:ring-accent focus-within:ring-1"
        )}
      >
        <textarea
          {...props}
          id={id}
          disabled={disabled}
          ref={setRefs}
          onChange={onChangeHandler}
          className={cn(
            "block w-full rounded-md placeholder:text-secondary/50 overflow-auto",
            {
              "border border-base bg-surface text-primary placeholder-secondary focus:outline-none focus:ring-accent focus:border-accent sm:text-body-sm":
                inputStyle === "NORMAL",
              "border-none bg-transparent p-0 focus:border-0 focus:outline-none focus:ring-0":
                inputStyle === "CHROMELESS",
              "border text-body-sm focus:border-accent focus:ring-accent":
                inputStyle === "DEEMPHASIZED",
            },
            {
              hidden: hidden,
            },
            {
              "bg-surface-muted text-secondary cursor-not-allowed": disabled || readOnly,
            },
            "focus:ring-0",
            inputClassName
          )}
          style={{ height: textAreaHeight }}
        />
      </div>
    );

    return (
      <div className={cn("input-wrap relative", containerClassName)}>
        {label ? (
          <ComponentLabelWrapper {...label} htmlFor={id}>
            {textareaEl}
          </ComponentLabelWrapper>
        ) : (
          textareaEl
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
