"use client";
// Vendored from packages/ui/src/shadcn/ShadCommand.tsx. Styling verbatim; Remix/workspace deps stripped for v0.

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { DialogProps } from "@radix-ui/react-dialog";
import {
  CommandEmpty as CommandEmptyPrimitive,
  CommandGroup as CommandGroupPrimitive,
  CommandInput as CommandInputPrimitive,
  CommandItem as CommandItemPrimitive,
  CommandList as CommandListPrimitive,
  CommandLoading as CommandLoadingPrimitive,
  Command as CommandPrimitive,
  CommandSeparator as CommandSeparatorPrimitive,
} from "cmdk";
import { IconLoader2 as Loader2, IconSearch as Search } from "@tabler/icons-react";
import {
  forwardRef,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";

const Command = forwardRef<
  ElementRef<typeof CommandPrimitive>,
  ComponentPropsWithoutRef<typeof CommandPrimitive> & {
    className?: string;
  }
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
      className
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = forwardRef<
  ElementRef<typeof CommandInputPrimitive>,
  ComponentPropsWithoutRef<typeof CommandInputPrimitive> & {
    className?: string;
    loading?: boolean;
  }
>(({ className, loading, ...props }, ref) => (
  <div className="flex items-center border-b px-3">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandInputPrimitive
      ref={ref}
      className={cn(
        "placeholder:text-muted-foreground flex h-10 w-full rounded-md border-0 bg-transparent px-0 py-3 text-body-sm outline-none ring-0 focus:border-none focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
    <div
      className={cn("opacity-0 transition-all", {
        "opacity-100": loading,
      })}
    >
      <Loader2
        className={cn("animate-spin text-secondary ", {
          "opacity-100": loading,
        })}
      />
    </div>
  </div>
));

CommandInput.displayName = CommandInputPrimitive.displayName;

const CommandList = forwardRef<
  ElementRef<typeof CommandListPrimitive>,
  ComponentPropsWithoutRef<typeof CommandListPrimitive> & {
    className?: string;
  }
>(({ className, ...props }, ref) => (
  <CommandListPrimitive
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    onWheel={(e) => {
      e.stopPropagation();
    }}
    onTouchMove={(e) => {
      e.stopPropagation();
    }}
    {...props}
  />
));

CommandList.displayName = CommandListPrimitive.displayName;

const CommandEmpty = forwardRef<
  ElementRef<typeof CommandEmptyPrimitive>,
  ComponentPropsWithoutRef<typeof CommandEmptyPrimitive> & {
    className?: string;
  }
>((props, ref) => (
  <CommandEmptyPrimitive ref={ref} className="py-6 text-center text-sm" {...props} />
));

CommandEmpty.displayName = CommandEmptyPrimitive.displayName;

const CommandGroup = forwardRef<
  ElementRef<typeof CommandGroupPrimitive>,
  ComponentPropsWithoutRef<typeof CommandGroupPrimitive> & {
    className?: string;
  }
>(({ className, children, ...props }, ref) => (
  <CommandGroupPrimitive
    ref={ref}
    className={cn(
      "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
      className
    )}
    {...props}
  >
    {children}
  </CommandGroupPrimitive>
));

CommandGroup.displayName = CommandGroupPrimitive.displayName;

const CommandSeparator = forwardRef<
  ElementRef<typeof CommandSeparatorPrimitive>,
  ComponentPropsWithoutRef<typeof CommandSeparatorPrimitive> & {
    className?: string;
  }
>(({ className, ...props }, ref) => (
  <CommandSeparatorPrimitive
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandSeparatorPrimitive.displayName;

const CommandItem = forwardRef<
  ElementRef<typeof CommandItemPrimitive>,
  ComponentPropsWithoutRef<typeof CommandItemPrimitive> & {
    className?: string;
  }
>(({ className, ...props }, ref) => (
  <CommandItemPrimitive
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-lg px-2 py-1.5 text-body-sm outline-none aria-selected:bg-surface-muted aria-selected:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
      className
    )}
    {...props}
  />
));

CommandItem.displayName = CommandItemPrimitive.displayName;

const CommandShortcut = ({
  className,
  ...props
}: ComponentProps<"span"> & {
  className?: string;
}) => {
  return (
    <span
      className={cn("text-muted-foreground ml-auto text-xs tracking-widest", className)}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

const CommandLoading = forwardRef<
  ElementRef<typeof CommandLoadingPrimitive>,
  ComponentPropsWithoutRef<typeof CommandLoadingPrimitive>
>((props, ref) => (
  <CommandLoadingPrimitive ref={ref} className="py-6 text-center text-sm" {...props} />
));
CommandLoading.displayName = "CommandLoading";

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  CommandSeparator,
  CommandShortcut,
};
