"use client";
// Vendored from packages/ui/src/components/Command/Command.tsx. Styling verbatim; @wind/Remix/app deps stubbed for v0.

import { cn } from "@/lib/utils";
import { Dialog, Transition } from "@headlessui/react";
import { Search } from "lucide-react";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";

export interface CommandOption<S extends string> {
  id: string;
  icon?: ReactNode;
  section: S;
  label: string;
  secondaryLabel?: string;
  item: unknown;
  preview?: ReactNode;
}

type FilteredOptions<S extends string> = {
  [sectionName in S]: Array<CommandOption<sectionName>>;
};

type OnSelect<S extends string, T extends { item: unknown }> = {
  [sectionName in S]: (item: Extract<T, { section: sectionName }>["item"]) => void;
};

interface Props<S extends string, T extends { item: unknown }> {
  filteredOptions: FilteredOptions<S>;
  open: boolean;
  onClose: () => void;
  onSelect: OnSelect<S, T>;
  query: string;
  setQuery: (query: string) => void;
  showPreview?: boolean;
  placeholder?: string;
  emptyState?: ReactNode;
}

// NOTE: source used the shared useHotkeys hook for the "esc" binding; replaced
// here with a plain keydown listener so the palette stays self-contained.
function CommandPalette<S extends string, T extends { item: unknown }>({
  query,
  setQuery,
  filteredOptions,
  open,
  onClose,
  onSelect,
  showPreview,
  emptyState,
}: Props<S, T>) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Turn object into flat array with the section added as key
  const optionsArray: Array<CommandOption<S> & { section: S }> = [];

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleCommandSelect = (index: number) => {
    const option = optionsArray[index];
    if (option) {
      onSelect[option.section](option.item);
      onClose();
    }
  };

  Object.keys(filteredOptions).forEach((section) => {
    filteredOptions[section as S].forEach((option) => {
      optionsArray.push({ ...option, section: section as S });
    });
  });

  const selectedOption = optionsArray[selectedIndex];

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return (
    <Transition.Root
      show={open}
      as={Fragment}
      afterLeave={() => {
        setQuery("");
      }}
      appear
    >
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="divide mx-auto max-w-xl transform divide-y overflow-hidden rounded-lg bg-base shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                  placeholder="Search..."
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleCommandSelect(selectedIndex);
                    } else if (event.key === "ArrowDown") {
                      event.preventDefault();
                      setSelectedIndex((i) => Math.min(i + 1, optionsArray.length - 1));
                    } else if (event.key === "ArrowUp") {
                      event.preventDefault();
                      setSelectedIndex((i) => Math.max(i - 1, 0));
                    }
                  }}
                />
              </div>
              {optionsArray.length === 0 && <div>{emptyState}</div>}

              {optionsArray.length > 0 && (
                <div className={showPreview ? "grid grid-cols-2" : ""}>
                  <div className="max-h-72 scroll-py-2 overflow-y-auto py-2 text-gray-800">
                    {optionsArray.map((o, i) => (
                      <button
                        ref={i === selectedIndex ? buttonRef : null}
                        onMouseMove={() => {
                          setSelectedIndex(i);
                        }}
                        key={o.id}
                        className={cn(
                          "flex w-full cursor-default select-none items-center justify-between gap-2 px-4 py-2 text-left",
                          {
                            "bg-accent text-accent-inverse": i === selectedIndex,
                          }
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={cn({
                              "text-accent-inverse": i === selectedIndex,
                              "text-accent": i !== selectedIndex,
                            })}
                          >
                            {o.icon}
                          </div>

                          <div>{o.label}</div>
                        </div>
                        {o.secondaryLabel && !showPreview && (
                          <div
                            className={cn("text-xs text-secondary", {
                              "text-accent-inverse": i === selectedIndex,
                            })}
                          >
                            {o.secondaryLabel}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  {showPreview && (
                    <div className="relative flex items-center justify-center border-l">
                      {/* Show Selected Row Preview */}
                      {selectedOption.preview}

                      {selectedOption.secondaryLabel && showPreview && (
                        <div className="absolute bottom-1 left-0 right-0 text-center text-xs text-secondary">
                          {selectedOption.secondaryLabel}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {query !== "" && optionsArray.length === 0 && (
                <p className="p-4 text-sm text-gray-500">Nothing found.</p>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default CommandPalette;
