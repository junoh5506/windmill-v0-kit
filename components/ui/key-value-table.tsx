"use client";

// Vendored from packages/ui/src/components/KeyValueTable. Styling verbatim; @wind/Remix deps stripped for v0.
// NOTE: @wind/util StringUtil.formatAsReadableTitle inlined as a local helper (camel/snake/kebab -> Title Case).

import { UnknownTypeViewer } from "@/components/ui/data-viewer";
import { cn } from "@/lib/utils";

// NOTE: inlined stand-in for @wind/util StringUtil.formatAsReadableTitle.
const formatAsReadableTitle = (key: string): string =>
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

interface Props {
  className?: string;
  // object is a key value pair
  object: Record<string, unknown> | string | number | boolean;
  hiddenKeys?: string[];
  borderLess?: boolean;
}

export const KeyValueTable = ({ className, object, hiddenKeys, borderLess }: Props) => {
  // If not an object just return unknown type
  if (typeof object !== "object") {
    return <UnknownTypeViewer value={object} />;
  }

  const keys = Object.keys(object).filter((key) => !hiddenKeys?.includes(key));
  const filteredKeys = keys.filter((key) => {
    // Filter out anything where value is undefined
    return object[key] !== undefined;
  });

  return (
    <div
      className={cn(className, "overflow-hidden ", {
        "rounded-lg border shadow-sm": !borderLess,
      })}
    >
      <table className="w-full">
        <tbody>
          {filteredKeys.map((key, index) => {
            const value = object[key];

            return (
              <tr key={key}>
                <td
                  width={100}
                  className={cn("border-b border-r bg-surface font-mono text-xs last:border-b-0", {
                    "border-b-0": index === filteredKeys.length - 1,
                  })}
                >
                  <div className="px-3 py-2 text-secondary">{formatAsReadableTitle(key)}</div>
                </td>
                <td
                  width={150}
                  className={cn("border-b bg-surface-muted", {
                    "border-b-0 ": index === filteredKeys.length - 1,
                  })}
                >
                  <div className="break-all px-3 py-2 text-xs">
                    <UnknownTypeViewer value={value} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default KeyValueTable;
