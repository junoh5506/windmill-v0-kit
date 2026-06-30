"use client";
// Vendored from packages/ui/src/components/Combobox/BaseCombobox.tsx (+ RowCommandItem, SingleSelectTrigger, models). Styling verbatim; Remix/workspace deps stripped for v0.
// FlexibleSpacer -> flex-1 div; Label -> span; Tooltip/Wrapper/react-loading-skeleton dropped.

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HStack } from "@/components/ui/stack";
import { cn } from "@/lib/utils";
import { CheckIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { CommandInput as CommandInputPrimitive } from "cmdk";
import { IconChevronDown as ChevronDownIcon } from "@tabler/icons-react";
import MiniSearch from "minisearch";
import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";

export interface ComboboxOption<P> {
  key?: string;
  value: P;
  label?: string | null;
  description?: string | null;
  icon?: ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  clearable?: boolean;
  tooltip?: string | null;
}

export interface TriggerProps<T> {
  options: {
    allowClear?: boolean;
    selectedOptions: Array<ComboboxOption<T>>;
    disabled?: boolean;
    triggerClassName?: string;
    triggerIcon?: React.ReactNode;
    onRemoveValue: (value: T) => void;
    onClearAll: () => void;
    placeholder?: string;
  };
}

interface RowCommandItemProps {
  isSelected: boolean;
  onSelect: () => void;
  hasIcons?: boolean;
  label?: string | null;
  description?: string | null;
  icon?: ReactNode;
  inlineDescription?: boolean;
  disabled?: boolean;
  value?: string;
  tooltip?: string | null;
}

export const RowCommandItem = ({
  label,
  description,
  icon,
  inlineDescription,
  disabled,
  hasIcons,
  isSelected,
  onSelect,
  value,
}: RowCommandItemProps) => {
  return (
    <CommandItem onSelect={onSelect} disabled={disabled} value={value}>
      <HStack
        className={cn("w-full", {
          "opacity-80": disabled,
        })}
      >
        {hasIcons && <div className="flex w-6 flex-none items-center justify-center">{icon}</div>}
        <div
          className={cn("flex", {
            "flex-col": !inlineDescription,
            "flex-row items-center gap-2": inlineDescription,
          })}
        >
          <span className="text-primary">{label}</span>
          {description && <span className="text-secondary">{description}</span>}
        </div>
        <div className="flex-1" />
        <CheckIcon
          className={cn("w-6 flex-none text-accent", {
            "opacity-100": isSelected,
            "opacity-0": !isSelected,
          })}
        />
      </HStack>
    </CommandItem>
  );
};

export const SingleSelectTrigger = forwardRef(
  (
    {
      options: { selectedOptions, triggerIcon, triggerClassName, placeholder },
      ...rest
    }: TriggerProps<unknown>,
    forwardedRef: Ref<HTMLButtonElement>
  ) => (
    <button
      type="button"
      {...rest}
      ref={forwardedRef}
      className={cn(
        "min-w-[100px] rounded-md border bg-surface px-4 hover:bg-surface-muted shadow-sm data-[state=open]:bg-surface-muted disabled:bg-surface-muted h-[calc(1em+28px)]",
        triggerClassName
      )}
    >
      <HStack gapXs className="h-full">
        {selectedOptions.length > 0 && (
          <HStack gapSm>
            {(triggerIcon ?? selectedOptions[0].icon) && (
              <div className="-ml-1 flex-none">{triggerIcon ?? selectedOptions[0].icon}</div>
            )}
            <div className="text-body-sm font-medium">{selectedOptions[0].label}</div>
          </HStack>
        )}
        {selectedOptions.length === 0 && (
          <div className="text-body-sm font-medium">{placeholder}</div>
        )}
        <div className="flex-1" />
        <ChevronDownIcon className="w-4" />
      </HStack>
    </button>
  )
);
SingleSelectTrigger.displayName = "SingleSelectTrigger";

export interface BaseComboboxProps<T> {
  placeholder?: string;
  inputClassName?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onChange: (options: Array<ComboboxOption<T>>) => void;
  selectedOptions: Array<ComboboxOption<T>>;
  disabled?: boolean;
  optionsLoading?: boolean;
  options?: Array<ComboboxOption<T>>;
  align?: "start" | "end";
  multiSelect?: boolean;
  hasMore?: boolean;

  /**
   * Allows the user to clear the selection
   */
  allowClear?: boolean;

  /**
   * Show descrpitions inlined with the options
   */
  inlineDescription?: boolean;

  /**
   * Custom label for clear selection. Will default to the placeholder if not provided.
   */
  clearSelectLabel?: string;

  /**
   * Custom icon for clear selection option
   */
  clearSelectIcon?: React.ReactNode;

  triggerClassName?: string;
  triggerIcon?: React.ReactNode;
  dropdownClassName?: string;

  trigger?: ComponentType<TriggerProps<T>>;

  /**
   * If true, the visible combobox control is the search input and the dropdown
   * only contains results.
   */
  searchInputAsTrigger?: boolean;

  /**
   * Optionally turn query into a controlled input to be support custom filtering and
   * async loading of options. If passed in that ALL options are always displayed. Both
   * query and onQueryChange must be passed in together.
   */
  query?: string;
  onQueryChange?: (query: string) => void;

  /**
   * Functions that compars two values and returns true if they are equal. You should
   * pass this in if the values are complex and the options load asynchronously.
   */
  valuesEqual?: (value1: T, value2: T) => boolean;

  /**
   * If true, clears the query when a selection is made or cleared.
   */
  clearQueryOnChange?: boolean;

  /**
   * If true, clears the query when the popover closes.
   */
  clearQueryOnClose?: boolean;

  /**
   * If true, the popover opens immediately on mount.
   */
  defaultOpen?: boolean;
}

const BaseCombobox = <T,>({
  selectedOptions,
  placeholder,
  allowClear,
  clearSelectLabel,
  clearSelectIcon,
  options,
  multiSelect,
  triggerClassName,
  triggerIcon,
  dropdownClassName,
  align = "start",
  inlineDescription,
  onChange,
  disabled,
  optionsLoading,
  trigger = SingleSelectTrigger,
  hasMore,
  valuesEqual,
  clearQueryOnChange,
  clearQueryOnClose,
  defaultOpen,
  inputClassName,
  query,
  onQueryChange,
  onKeyDown,
  searchInputAsTrigger,
}: BaseComboboxProps<T>) => {
  const [localQuery, setLocalQuery] = useState("");
  const [isShowingPopover, setIsShowingPopover] = useState(false);
  const autoOpenedRef = useRef(false);
  const searchInputTriggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (defaultOpen) {
      let timeoutId: ReturnType<typeof setTimeout>;
      const rafId = requestAnimationFrame(() => {
        autoOpenedRef.current = true;
        setIsShowingPopover(true);
        timeoutId = setTimeout(() => {
          autoOpenedRef.current = false;
        }, 300);
      });
      return () => {
        cancelAnimationFrame(rafId);
        clearTimeout(timeoutId);
      };
    }
  }, [defaultOpen]);

  const hasIcons = options?.some((o) => o.icon);
  const hasDescriptions = options?.some((o) => o.description);
  const hasAccessories = hasIcons || hasDescriptions;

  const localSearcher: MiniSearch<ComboboxOption<T>> = useMemo(() => {
    const searcher = new MiniSearch<ComboboxOption<T>>({
      idField: "value",
      fields: ["label", "description"],
      storeFields: [
        "label",
        "description",
        "icon",
        "value",
        "key",
        "disabled",
        "isLoading",
        "clearable",
      ],
      searchOptions: {
        prefix: true,
        fuzzy: 2,
        boost: {
          label: 2,
        },
      },
    });
    if (options) {
      searcher.addAll(options);
    }
    return searcher;
  }, [options]);

  const filteredOptions = useMemo(() => {
    // If we are using a controlled query, it's up to the parent to filter the options
    if (onQueryChange) {
      return options;
    }

    if (!localQuery) {
      return options;
    }

    const optionBySearchId = new Map(options?.map((option) => [String(option.value), option]));
    return localSearcher
      .search(localQuery)
      .map((result) => optionBySearchId.get(String(result.id)))
      .filter((option) => option != null);
  }, [localSearcher, localQuery, onQueryChange, options]);

  const Trigger = trigger;
  const queryValue = onQueryChange ? query : localQuery;
  const openPopover = () => {
    if (!disabled) {
      setIsShowingPopover(true);
    }
  };
  const handleQueryChange = (nextQuery: string) => {
    if (onQueryChange) {
      onQueryChange(nextQuery);
    } else {
      setLocalQuery(nextQuery);
    }
  };
  const clearQuery = () => {
    setLocalQuery("");
    onQueryChange?.("");
  };
  const handlePopoverOpenChange = (open: boolean) => {
    setIsShowingPopover(open);
    if (!open && clearQueryOnClose) {
      clearQuery();
    }
  };

  const commandList = (
    <CommandList>
      <CommandEmpty>{optionsLoading ? "Loading..." : "No results found."}</CommandEmpty>
      <CommandGroup>
        {filteredOptions && allowClear && (
          <CommandItem
            onSelect={() => {
              onChange([]);
              setIsShowingPopover(false);
              if (clearQueryOnChange) {
                clearQuery();
              }
            }}
          >
            <HStack className="w-full">
              {hasIcons && (clearSelectIcon || <div className="w-6" />)}
              <div>{clearSelectLabel ?? "None"}</div>
              <div className="flex-1" />
              <CheckIcon
                className={cn("w-6 flex-none text-accent", {
                  "opacity-100": !selectedOptions.length,
                  "opacity-0": !!selectedOptions.length,
                })}
              />
            </HStack>
          </CommandItem>
        )}
        {filteredOptions?.map((option) => {
          const commandItemValue = option.key || String(option.value) || "___";

          return (
            <RowCommandItem
              {...option}
              key={commandItemValue}
              value={commandItemValue}
              hasIcons={hasIcons}
              inlineDescription={inlineDescription}
              isSelected={selectedOptions.some((o) =>
                valuesEqual ? valuesEqual(o.value, option.value) : o.value === option.value
              )}
              onSelect={() => {
                if (multiSelect) {
                  const selectedValue = option.value;
                  const newValues = selectedOptions.some((o) =>
                    valuesEqual ? valuesEqual(o.value, selectedValue) : o.value === selectedValue
                  )
                    ? selectedOptions.filter((o) => o.value !== selectedValue)
                    : [...selectedOptions, option];

                  onChange(newValues);
                  if (clearQueryOnChange) {
                    clearQuery();
                  }
                } else {
                  onChange([option]);
                  setIsShowingPopover(false);
                  if (clearQueryOnChange) {
                    clearQuery();
                  }
                }
              }}
            />
          );
        })}
      </CommandGroup>
      {!optionsLoading && hasMore && (
        <span className="block p-2 text-center text-tertiary">Search to find more options</span>
      )}
    </CommandList>
  );

  const renderPopoverContent = (children: ReactNode) => (
    <PopoverContent
      className={cn(
        "p-0 w-screen",
        {
          "max-w-[300px]": hasAccessories,
          "max-w-[200px]": !hasAccessories,
        },
        dropdownClassName
      )}
      align={align}
      onOpenAutoFocus={(e) => {
        if (searchInputAsTrigger || autoOpenedRef.current) {
          e.preventDefault();
        }
      }}
      onInteractOutside={(e) => {
        if (
          autoOpenedRef.current ||
          (searchInputAsTrigger &&
            e.target instanceof Node &&
            searchInputTriggerRef.current?.contains(e.target))
        ) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </PopoverContent>
  );

  if (searchInputAsTrigger) {
    return (
      <Popover open={isShowingPopover} onOpenChange={handlePopoverOpenChange}>
        <Command shouldFilter={false} className="overflow-visible rounded-none bg-transparent">
          <PopoverAnchor asChild>
            <div
              ref={searchInputTriggerRef}
              className={cn(
                "flex h-10 items-center gap-2 rounded-md border bg-surface px-3 shadow-sm",
                "focus-within:border-accent focus-within:ring-1 focus-within:ring-accent",
                disabled && "bg-surface-muted text-secondary",
                triggerClassName
              )}
            >
              <MagnifyingGlassIcon className="size-4 flex-none text-tertiary" />
              <CommandInputPrimitive
                value={queryValue}
                onValueChange={(nextQuery) => {
                  handleQueryChange(nextQuery);
                  openPopover();
                }}
                onFocus={openPopover}
                onClick={openPopover}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setIsShowingPopover(false);
                  }
                  onKeyDown?.(event);
                }}
                placeholder={placeholder ?? "Search..."}
                disabled={disabled}
                autoFocus={defaultOpen}
                className={cn(
                  "w-full border-none bg-transparent p-0 text-body-sm outline-none placeholder:text-secondary focus:border-none focus:outline-none focus:ring-0 disabled:cursor-not-allowed",
                  inputClassName
                )}
              />
            </div>
          </PopoverAnchor>
          {renderPopoverContent(commandList)}
        </Command>
      </Popover>
    );
  }

  return (
    <Popover open={isShowingPopover} onOpenChange={handlePopoverOpenChange}>
      <PopoverTrigger
        disabled={disabled}
        asChild
        className={cn({
          "w-full": multiSelect,
        })}
      >
        <Trigger
          options={{
            allowClear,
            selectedOptions,
            triggerClassName,
            triggerIcon,
            placeholder,
            disabled,
            onRemoveValue: (value) => {
              onChange(
                selectedOptions.filter((option) =>
                  valuesEqual ? !valuesEqual(option.value, value) : option.value !== value
                )
              );
              if (clearQueryOnChange) {
                clearQuery();
              }
            },
            onClearAll: () => {
              onChange(selectedOptions.filter((o) => o.clearable === false));
              if (clearQueryOnChange) {
                clearQuery();
              }
            },
          }}
        />
      </PopoverTrigger>
      {renderPopoverContent(
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search..."
            value={queryValue}
            onValueChange={handleQueryChange}
            onKeyDown={onKeyDown}
            loading={optionsLoading}
            className={inputClassName}
          />
          {commandList}
        </Command>
      )}
    </Popover>
  );
};

export { BaseCombobox };
export default BaseCombobox;
