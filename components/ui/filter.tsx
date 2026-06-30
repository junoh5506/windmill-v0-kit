"use client";

// Vendored from packages/ui/src/components/Filter/FilterSearchBar.tsx. Styling verbatim; @wind/Remix/app-state deps stubbed for v0.

import { cn } from "@/lib/utils";
import { SearchIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_DEBOUNCE_TIME = 200;

// NOTE: useDebouncedCallback (a @wind hook) inlined as a minimal local hook so
// the component renders standalone. Same {debouncedCallback, cancel} shape.
function useDebouncedCallback(
  callback: (value: string) => void,
  delay: number,
  deps: readonly unknown[]
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const debouncedCallback = useCallback(
    (value: string) => {
      cancel();
      timeoutRef.current = setTimeout(() => callback(value), delay);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [delay, cancel, ...deps]
  );

  useEffect(() => cancel, [cancel]);

  return { debouncedCallback, cancel };
}

interface Props {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceTime?: number;
}

const FilterSearchBar = ({
  value,
  onChange,
  placeholder = "Search",
  debounceTime = DEFAULT_DEBOUNCE_TIME,
}: Props) => {
  const [internalValue, setInternalValue] = useState(value);
  const lastSentValueRef = useRef(value);

  const { debouncedCallback: onChangeDebounced, cancel: cancelOnChangeDebounced } =
    useDebouncedCallback(
      (newValue: string) => {
        lastSentValueRef.current = newValue;
        onChange(newValue);
      },
      debounceTime,
      [onChange]
    );

  useEffect(() => {
    // Only update internal state if the external value is different from what we last sent
    // This prevents the input from resetting when the parent is just catching up
    if (value !== lastSentValueRef.current) {
      setInternalValue(value ?? "");
      lastSentValueRef.current = value;
      cancelOnChangeDebounced();
    }
  }, [value]);

  return (
    <div
      className={cn(
        "h-7 border border-base focus-within:outline-none focus-within:ring-accent focus-within:ring-1 focus-within:border-accent focus-within:bg-surface flex gap-2 items-center pl-2 rounded-md placeholder:text-secondary/50 focus-within:w-56 transition-all bg-surface group relative",
        {
          "w-48": !internalValue,
        }
      )}
    >
      <SearchIcon className="w-4 opacity-50 group-focus-within:opacity-100" />
      <input
        type="text"
        className="block w-full border-none bg-transparent p-0 py-1 pr-2 text-body-sm font-medium leading-6 placeholder-secondary outline-none focus:border-none focus:outline-none focus:ring-0"
        placeholder={placeholder}
        value={internalValue}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        onChange={(e) => {
          const value = e.target.value;
          setInternalValue(value);
          onChangeDebounced(value);
        }}
      />
      <button
        onClick={() => {
          setInternalValue("");
          lastSentValueRef.current = "";
          onChange("");
        }}
        className={cn(
          "opacity-0 translate-x-2 transition-all absolute right-0 top-1/2 -translate-y-1/2 bg-surface rounded-full p-1 mr-[2px]",
          {
            "opacity-100 translate-x-0": internalValue !== "",
          }
        )}
      >
        <XIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default FilterSearchBar;
