"use client";

// Vendored from packages/ui/src/components/DataViewer. Styling verbatim; @wind/Remix deps stripped for v0.
// NOTE: react-icons (Fa*) mapped to @tabler/icons-react; the app `toast` is replaced with a local no-op stub;
// FormattedTimestampTableCell (Remix/@wind) is stubbed to a locale date string.

import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { IconCopy as Copy, IconCircleCheck as CheckCircle2 } from "@tabler/icons-react";
import { isValidElement, useState, type ReactNode } from "react";
import { JSONTree } from "react-json-tree";

// NOTE: app toast service stubbed — clipboard feedback is logged instead of toasted.
const toast = {
  success: (_msg: string) => {},
  error: (_msg: string) => {},
};

// NOTE: FormattedTimestampTableCell (Remix-coupled) stubbed to a plain locale date string.
const FormattedTimestampTableCell = ({ timestamp }: { timestamp: Date }) => (
  <div className="font-mono text-sm">{timestamp.toLocaleString()}</div>
);

interface JsonViewerProps {
  json: Record<string, unknown> | unknown;
  className?: string;
  condensed?: boolean;
  interactive?: boolean;
  defaultExpandedLevels?: number;
}

export const JsonViewer = ({
  className,
  json,
  condensed,
  interactive,
  defaultExpandedLevels = 2,
}: JsonViewerProps) => {
  const [copied, setCopied] = useState(false);
  const handleClick = () => {
    setCopied(true);
    navigator.clipboard
      .writeText(JSON.stringify(json))
      .then(() => toast.success("Copied to clipboard"))
      .catch((e) => toast.error(`Failed to copy to clipboard: ${e}`))
      .finally(() =>
        setTimeout(() => {
          setCopied(false);
        }, 3000)
      );
  };

  if (condensed) {
    const record = json as Record<string, unknown>;
    return (
      <Tooltip tooltip={JSON.stringify(json, null, 2)}>
        <table className="font-mono">
          <tbody>
            {Object.keys(record).map((key) => {
              let value: ReactNode;
              const raw = record[key];

              if (typeof raw === "object" && raw !== null) {
                value = JSON.stringify(raw);
              } else if (typeof raw === "boolean") {
                value = raw.toString();
              } else {
                value = raw as ReactNode;
              }

              return (
                <tr key={key}>
                  <td>
                    <div className="whitespace-nowrap px-1 text-xs text-secondary">{key}:</div>
                  </td>
                  <td>
                    <div className="line-clamp-1 overflow-ellipsis px-1 text-xs">{value}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Tooltip>
    );
  }

  return (
    <div className="group relative overflow-x-auto">
      {interactive && (
        <JSONTree
          hideRoot
          data={json}
          theme={{}}
          invertTheme
          shouldExpandNodeInitially={(_keyPath, _data, level) => {
            return level < defaultExpandedLevels;
          }}
        />
      )}
      {!interactive && (
        <pre
          className={cn(
            "whitespace-pre-wrap break-all rounded-md font-mono text-xs text-secondary",
            {
              "border border-dashed bg-surface-muted p-4": !condensed,
            },
            className
          )}
        >
          {JSON.stringify(json, null, condensed ? 1 : 4)}
        </pre>
      )}
      <button
        type="button"
        onClick={handleClick}
        className="absolute right-2 top-2 rounded p-3 text-gray-500 opacity-0 transition-colors hover:bg-accent/10 hover:text-accent group-hover:opacity-100"
      >
        {copied && <CheckCircle2 className="h-3.5 w-3.5" />}
        {!copied && <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
};

interface TextViewerProps {
  text: string;
  className?: string;
}

export const TextViewer = ({ className, text }: TextViewerProps) => {
  const [copied, setCopied] = useState(false);
  const handleClick = () => {
    setCopied(true);
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Copied to clipboard"))
      .catch((e) => toast.error(`Failed to copy to clipboard: ${e}`))
      .finally(() =>
        setTimeout(() => {
          setCopied(false);
        }, 3000)
      );
  };

  return (
    <div className="group relative">
      <div className="relative rounded-md border border-dashed bg-surface-muted">
        <pre className={cn("whitespace-pre-wrap break-words p-4 font-mono text-xs", className)}>
          {text}
          {(!text || text === "") && <span className="italic text-tertiary">No Text</span>}
          <button
            type="button"
            onClick={handleClick}
            className="absolute right-2 top-2 rounded p-3 text-gray-500 opacity-0 transition-colors hover:bg-accent/10 hover:text-accent group-hover:opacity-100"
          >
            {copied && <CheckCircle2 className="h-3.5 w-3.5" />}
            {!copied && <Copy className="h-3.5 w-3.5" />}
          </button>
        </pre>
      </div>
    </div>
  );
};

interface UnknownTypeViewerProps {
  value?: unknown;
}

export const UnknownTypeViewer = ({ value }: UnknownTypeViewerProps) => {
  // Check if value is null or undefined
  if (value == null) {
    return <div></div>;
  }
  // Check if value is of type react element
  if (isValidElement(value)) {
    return value;
  } else if (value instanceof Date) {
    return <FormattedTimestampTableCell timestamp={new Date(value)} />;
  } else if (typeof value === "number") {
    return <div className="font-mono text-sm">{value.toLocaleString()}</div>;
  } else if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
    return <div>{value.join(", ")}</div>;
  } else if (typeof value === "object") {
    try {
      return <JsonViewer json={value} interactive />;
    } catch {
      return <div className="break-words text-sm">{String(value)}</div>;
    }
    // check if it's a string that looks like a date
  } else if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.exec(value)) {
    return <FormattedTimestampTableCell timestamp={new Date(value)} />;
  } else if (typeof value === "boolean") {
    // check for booleans
    return <div className="font-mono text-sm">{value ? "Yes" : "No"}</div>;
  } else if (typeof value === "string" && value.length > 100) {
    return <TextViewer text={value} />;
  } else {
    return <div className="break-words text-sm">{String(value)}</div>;
  }
};

export default JsonViewer;
