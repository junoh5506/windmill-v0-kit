"use client";

// Vendored from packages/ui/src/components/DiffView. Styling verbatim; @wind/Remix deps stripped for v0.
// Keeps the diff-match-patch engine intact (DiffUtil inlined from DiffUtil.ts).

import { cn } from "@/lib/utils";
import DiffMatchPatch from "diff-match-patch";
import { useMemo } from "react";

export enum DiffType {
  EQUAL = "EQUAL",
  INSERT = "INSERT",
  DELETE = "DELETE",
}

export interface DiffSegment {
  type: DiffType;
  text: string;
}

/**
 * Computes word-level diffs between two texts using diff-match-patch.
 *
 * Runs diff_main on raw text, then diff_cleanupSemantic to group
 * changes at word boundaries for readable output.
 *
 * @author adit-windmill
 */
class DiffUtil {
  static computeDiff(oldText: string, newText: string): DiffSegment[] {
    const dmp = new DiffMatchPatch();
    const diffs = dmp.diff_main(oldText, newText);

    dmp.diff_cleanupSemantic(diffs);

    return diffs.map(([operation, text]) => ({
      type: DiffUtil.resolveType(operation),
      text,
    }));
  }

  private static resolveType(operation: number): DiffType {
    if (operation === DiffMatchPatch.DIFF_INSERT) {
      return DiffType.INSERT;
    }

    if (operation === DiffMatchPatch.DIFF_DELETE) {
      return DiffType.DELETE;
    }

    return DiffType.EQUAL;
  }
}

export interface DiffViewProps {
  oldText: string;
  newText: string;
  className?: string;
}

const SEGMENT_STYLES: Record<DiffType, string> = {
  [DiffType.EQUAL]: "",
  [DiffType.INSERT]: "bg-green text-green font-medium rounded-sm px-0.5",
  [DiffType.DELETE]: "bg-red text-red line-through rounded-sm px-0.5 opacity-70",
};

/**
 * Renders inline word-level diffs between two texts.
 *
 * Changed words are highlighted in-place: green for insertions,
 * red strikethrough for deletions.
 *
 * @author adit-windmill
 */
const DiffView = ({ oldText, newText, className }: DiffViewProps) => {
  const segments = useMemo(() => DiffUtil.computeDiff(oldText, newText), [oldText, newText]);

  return (
    <div
      className={cn("whitespace-pre-wrap rounded-lg border p-4 text-sm leading-relaxed", className)}
    >
      {segments.map((segment, i) => (
        <span key={i} className={SEGMENT_STYLES[segment.type]}>
          {segment.text}
        </span>
      ))}
    </div>
  );
};

export default DiffView;
