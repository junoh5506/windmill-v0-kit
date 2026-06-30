"use client";

// Vendored from packages/ui/src/components/LeftNav/LeftNav.tsx. Styling verbatim; @wind/Remix/app-state deps stubbed for v0.

import { Label } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
// NOTE: react-icons (BsArrowUpRight/FaBars/VscClose) is not in the kit — swapped
// for @tabler/icons-react equivalents with the same sizing classes.
import { IconArrowUpRight as ArrowUpRight, IconMenu2 as Menu, IconX as X } from "@tabler/icons-react";
import { Fragment, useState, type ReactNode } from "react";

export interface LeftNavSection {
  title?: string;

  // Optional button to the right of the title
  titleAccessory?: ReactNode;

  children: ReactNode;
}

function LeftNavSection({ title, titleAccessory, children }: LeftNavSection) {
  return (
    <nav className="px-2">
      <div className="space-y-1">
        {title && (
          <div className="flex items-center">
            <Label intent="secondary">{title}</Label>
            {titleAccessory && <div>{titleAccessory}</div>}
          </div>
        )}
        <div>{children}</div>
      </div>
    </nav>
  );
}

export interface LeftNavLink {
  id?: string | number;
  children: ReactNode;
  to: string;
  icon: ReactNode;
  end?: boolean;

  external?: boolean;

  // NOTE: Remix NavLink active state derived from a router context in
  // production; here pass `isActive` directly as a prop.
  isActive?: boolean;

  // Optional overaly on top of icon
  iconOverlay?: ReactNode;
}

function LeftNavLinkInner({ children, icon, external, isActive, iconOverlay }: LeftNavLink) {
  return (
    <>
      <div
        className={cn(
          "relative",
          isActive ? "text-primary" : "text-tertiary group-hover:text-secondary",
          "flex-shrink-0 text-2xl"
        )}
        aria-hidden="true"
      >
        {icon}
        {iconOverlay && <div className="absolute inset-0">{iconOverlay}</div>}
      </div>
      <span className="line-clamp-2 flex-grow">{children}</span>
      {external && (
        <ArrowUpRight className="opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </>
  );
}

function LeftNavLink(props: LeftNavLink) {
  const { to, external, isActive } = props;

  const itemClassName = "group flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium";
  const itemNotActiveClassName =
    "text-secondary hover:bg-surface-muted hover:text-primary focus:bg-surface-muted focus:text-primary";

  // NOTE: Remix Link/NavLink replaced with a plain <a>. Active styling is driven
  // by the `isActive` prop instead of router state.
  if (external) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noreferrer"
        className={cn(itemNotActiveClassName, itemClassName)}
      >
        <LeftNavLinkInner {...props} />
      </a>
    );
  } else {
    return (
      <a
        href={to}
        className={cn(
          {
            "bg-black/10 text-primary": isActive,
            [itemNotActiveClassName]: !isActive,
          },
          itemClassName
        )}
      >
        <LeftNavLinkInner {...props} />
      </a>
    );
  }
}

interface LeftNavProps {
  top: ReactNode;
  bottom?: ReactNode;
  children: ReactNode;
  marginTop?: number;
}

function LeftNav({ top, bottom, children, marginTop }: LeftNavProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // NOTE: production closed the sidebar on Remix navigation (useNavigation);
  // dropped for v0 — mobile sidebar closes via the close button / overlay.

  return (
    <>
      <div>
        <Transition show={sidebarOpen} as={Fragment}>
          {/* Mobile Sidebar */}
          <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
            <TransitionChild
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/50" />
            </TransitionChild>

            <div className="fixed inset-0 z-40 flex">
              <TransitionChild
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <DialogPanel className="relative flex w-full max-w-sm flex-1 flex-col bg-base">
                  <TransitionChild
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute right-2 top-0 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => {
                          setSidebarOpen(false);
                        }}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <X className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </TransitionChild>
                  <div className="h-0 flex-1 overflow-y-auto pb-4 pt-5">
                    <nav className="mt-6 space-y-4 px-2">
                      {top}
                      {bottom && <div className="flex flex-col gap-1 border-t pt-4">{bottom}</div>}
                    </nav>
                  </div>
                  <div className="flex flex-shrink-0 p-4"></div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>

        {/* Static sidebar for desktop */}
        <div
          className="hidden border-r border-muted md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col"
          style={{ marginTop }}
        >
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto pb-1 pt-2">
              {top}
              {/* <nav className="mt-3 flex-1 space-y-8 px-2">{sectonsList}</nav> */}
            </div>
            {bottom && (
              <div className="flex flex-shrink-0 border-t pb-2 pt-2">
                <div className="flex w-full flex-shrink-0 flex-col gap-4">{bottom}</div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col md:pl-64">
          <div className="sticky top-0 z-10 border-b bg-base/50 pl-1 pt-1 backdrop-blur-md sm:pl-3 sm:pt-3 md:hidden">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-secondary hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
              onClick={() => {
                setSidebarOpen(true);
              }}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </>
  );
}

LeftNav.Section = LeftNavSection;
LeftNav.Link = LeftNavLink;

export default LeftNav;
