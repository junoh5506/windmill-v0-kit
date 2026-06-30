"use client";

// Vendored from packages/ui/src/components/Table/Table.tsx. Styling verbatim; Remix/workspace deps stripped for v0.

import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FlexibleSpacer from "@/components/ui/flexible-spacer";
import ScrollArea from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Info, MoreHorizontal } from "lucide-react";
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";

type Variants = "default" | "simple";

/**
 * Controls which rows are considered "selected."
 *
 * - `DEFAULT_UNSELECTED` — nothing is selected by default; `selectedRowIds` is the
 *   explicit list of selected rows. Use for ordinary "pick specific rows" flows.
 * - `DEFAULT_SELECTED` — every row matching the caller's filter is considered
 *   selected; `unselectedRowIds` is an exclusion list. Use for "select all N matching"
 *   flows across pagination.
 */
export enum TableSelectionMode {
  DEFAULT_UNSELECTED = "DEFAULT_UNSELECTED",
  DEFAULT_SELECTED = "DEFAULT_SELECTED",
}

export type TableSelection =
  | { mode: TableSelectionMode.DEFAULT_UNSELECTED; selectedRowIds: string[] }
  | { mode: TableSelectionMode.DEFAULT_SELECTED; unselectedRowIds: string[] };

const isRowSelected = (selection: TableSelection | undefined, id: string): boolean => {
  if (!selection) {
    return false;
  }
  return selection.mode === TableSelectionMode.DEFAULT_SELECTED
    ? !selection.unselectedRowIds.includes(id)
    : selection.selectedRowIds.includes(id);
};

const toggleRowSelection = (
  selection: TableSelection,
  rowId: string,
  checked: boolean
): TableSelection => {
  if (selection.mode === TableSelectionMode.DEFAULT_SELECTED) {
    return {
      mode: TableSelectionMode.DEFAULT_SELECTED,
      unselectedRowIds: checked
        ? selection.unselectedRowIds.filter((id) => id !== rowId)
        : [...selection.unselectedRowIds, rowId],
    };
  }
  return {
    mode: TableSelectionMode.DEFAULT_UNSELECTED,
    selectedRowIds: checked
      ? [...selection.selectedRowIds, rowId]
      : selection.selectedRowIds.filter((id) => id !== rowId),
  };
};

interface HeaderCheckboxState {
  checked: boolean;
  indeterminate: boolean;
}

const getHeaderCheckboxState = (
  selection: TableSelection | undefined,
  rows: ReadonlyArray<{ id: string }>
): HeaderCheckboxState => {
  if (!selection || rows.length === 0) {
    return { checked: false, indeterminate: false };
  }
  if (selection.mode === TableSelectionMode.DEFAULT_SELECTED) {
    const hasExclusionsOnPage = rows.some((r) => selection.unselectedRowIds.includes(r.id));
    return { checked: true, indeterminate: hasExclusionsOnPage };
  }
  const { selectedRowIds } = selection;
  if (selectedRowIds.length === 0) {
    return { checked: false, indeterminate: false };
  }
  const allVisibleSelected = rows.every((r) => selectedRowIds.includes(r.id));
  return { checked: allVisibleSelected, indeterminate: !allVisibleSelected };
};

const tableRowStyles = cva("group", {
  variants: {
    variant: {
      simple: "",
      default: "",
    },
    isHeader: {
      true: "",
    },
    isSelected: {
      true: "bg-surface-muted",
    },
  },
  compoundVariants: [
    {
      isHeader: true,
      variant: "default",
      class: "bg-black/5",
    },
  ],
  defaultVariants: {
    variant: "default",
    isHeader: false,
    isSelected: false,
  },
});

const tableHeaderStyles = cva("text-left border-x-0", {
  variants: {
    variant: {
      simple: "font-medium border-b py-2 px-4 text-secondary text-body-sm",
      default: "border-b bg-surface-muted uppercase font-medium text-body-sm px-4 py-2",
    },
    isFirstColumn: {
      true: "",
    },
    isLastColumn: {
      true: "",
    },
  },
  defaultVariants: {
    variant: "default",
    isFirstColumn: false,
    isLastColumn: false,
  },
});

const tableCellStyles = cva(["group-hover:bg-surface-muted/50", "max-w-sm"], {
  variants: {
    variant: {
      simple: "py-3 px-4 text-body-sm",
      default: "bg-surface px-4 py-2 text-body-sm",
    },
    isLastRow: {
      true: "border-b-0",
      false: "border-b",
    },
    isFirstColumn: {
      true: "",
    },
    isLastColumn: {
      true: "",
    },
    isHighlighted: {
      true: "bg-accent/20",
    },
    rightAlign: {
      true: "text-right",
      false: "text-left",
    },
  },
  defaultVariants: {
    isLastRow: false,
    isHighlighted: false,
    rightAlign: false,
    variant: "default",
  },
});

const tableContainerStyles = cva("w-full", {
  variants: {
    variant: {
      simple: "",
      default: "border shadow-sm rounded-lg overflow-hidden",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const tableMobileCardStyles = cva("w-full", {
  variants: {
    variant: {
      simple: "flex flex-col divide-y",
      default: "flex flex-col divide-y overflow-hidden rounded-lg border bg-surface shadow-sm",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

// NOTE: InfoTooltip replaced with a simple title-attribute icon for v0.
const TableHeaderTooltip = ({ helpText }: { helpText: string }) => {
  return (
    <span
      className="inline-block opacity-0 transition-opacity group-hover/th:opacity-100"
      title={helpText}
    >
      <Info className="h-3 w-3 text-tertiary" />
    </span>
  );
};

const TH = ({
  children,
  align = "left",
  helpText,
  className,
  ...variantProps
}: {
  children?: ReactNode;
  align?: "left" | "right" | "center";
  helpText?: string;
  className?: string;
} & VariantProps<typeof tableHeaderStyles>) => {
  return (
    <th className={cn(tableHeaderStyles(variantProps), className)}>
      <div
        className={cn("flex gap-1 items-center group/th", {
          "justify-end text-right": align === "right",
          "justify-center": align === "center",
        })}
      >
        {helpText && align === "right" && <TableHeaderTooltip helpText={helpText} />}
        {children}
        {helpText && align === "left" && <TableHeaderTooltip helpText={helpText} />}
      </div>
    </th>
  );
};

export interface TableColumn<T> {
  id: string;
  name?: string;
  defaultHidden?: boolean;
  isHidable?: boolean;
  rightAlign?: boolean;
  render?: (rowData: T, index: number, mobile: boolean) => ReactNode;
  hideOnMobile?: boolean;
  cellClassName?: string;

  /**
   * If present will render an info button next to column header
   */
  helpText?: string;
}

export interface HasId {
  id: string;
}

// NOTE: DropdownMenuSimple's prop shape preserved minimally — a `rowDropdown`
// returns `{ actions }` and each action renders as a DropdownMenuItem.
interface RowDropdownAction {
  label: ReactNode;
  onClick?: () => void;
}
interface RowDropdownProps {
  actions: RowDropdownAction[];
}

// NOTE: EmptyState minimally inlined for v0.
interface EmptyStateProps {
  title: string;
  description?: string;
  className?: string;
}
const EmptyState = ({ title, description, className }: EmptyStateProps) => (
  <div className={cn("flex flex-col items-center justify-center gap-1 text-center", className)}>
    <div className="text-body-sm font-medium text-primary">{title}</div>
    {description && <div className="text-body-sm text-secondary">{description}</div>}
  </div>
);

// NOTE: react-loading-skeleton replaced with a pulsing div for v0.
const Skeleton = ({
  width,
  containerClassName,
}: {
  width?: number;
  containerClassName?: string;
}) => (
  <div
    className={cn("h-4 animate-pulse rounded bg-surface-muted", containerClassName)}
    style={width ? { width } : undefined}
  />
);

interface Props<T extends HasId> {
  variant?: Variants;
  loading?: boolean;
  className?: string;
  columns: Array<TableColumn<T>>;
  rows: T[];
  onRowClick?: (data: T, idx: number) => void;
  rowHighlight?: (data: T) => boolean;
  getRowClassName?: (data: T) => string | undefined;
  rowDropdown?: (data: T) => RowDropdownProps;
  emptyState: ComponentProps<typeof EmptyState>;
  mobileCard?: (data: T, options: { highlight?: boolean }) => ReactNode;

  showRowSelection?: boolean;

  /**
   * Current selection state. Pass a `DEFAULT_UNSELECTED` selection for ordinary
   * explicit selection, or `DEFAULT_SELECTED` to represent "select all matching"
   * across pagination.
   */
  selection?: TableSelection;

  /**
   * Called when the user toggles a row or header checkbox. The caller owns the
   * state and decides how to interpret the next selection — e.g. mapping a
   * `DEFAULT_SELECTED` emission into a domain-specific "all-matching" selection.
   */
  onSelectionChange?: (next: TableSelection) => void;

  isSelected?: (data: T) => boolean;
  loadingRowCount?: number;
  noRowMaxHeight?: boolean;

  /** Actions on the right side of the table */
  tableActions?: ReactNode;

  /** Filters on the left side of the table */
  tableFilters?: ReactNode;

  /** Append this many skeleton rows after data rows (useful for infinite scroll loading indicators) */
  trailingLoadingRows?: number;
}

// NOTE: DynamicPagination, TableColumnPicker, Wrapper, and UnknownTypeViewer
// dependencies dropped for v0 — pagination/column-hiding controls are omitted
// and unrendered cell values fall back to String().
const Table = <T extends HasId>({
  className,
  columns,
  loadingRowCount = 10,
  rows,
  loading,
  onRowClick,
  emptyState,
  rowDropdown,
  rowHighlight,
  getRowClassName,
  mobileCard,
  isSelected,
  showRowSelection,
  selection,
  onSelectionChange,
  variant,
  noRowMaxHeight,
  tableActions,
  tableFilters,
  trailingLoadingRows,
}: Props<T>) => {
  const [visibleColumnIds] = useState<string[]>(
    columns.filter((c) => !c.defaultHidden).map((c) => c.id)
  );
  const visibleColumns = columns.filter((c) => visibleColumnIds.includes(c.id));

  const columnsLength = columns.length + (rowDropdown ? 1 : 0) + (showRowSelection ? 1 : 0);

  const columnVariants = (columnNumber: number) => {
    return {
      isFirstColumn: columnNumber === 0,
      isLastColumn: columnNumber === columnsLength - 1,
    };
  };

  const globalSelectAllCheckboxRef = useRef<HTMLInputElement>(null);
  const headerState = getHeaderCheckboxState(selection, rows);

  useEffect(() => {
    if (!globalSelectAllCheckboxRef.current) {
      return;
    }
    globalSelectAllCheckboxRef.current.indeterminate = headerState.indeterminate;
    globalSelectAllCheckboxRef.current.checked = headerState.checked;
  }, [headerState.checked, headerState.indeterminate]);

  const handleHeaderToggle = () => {
    if (!onSelectionChange) {
      return;
    }
    if (headerState.checked && !headerState.indeterminate) {
      onSelectionChange({ mode: TableSelectionMode.DEFAULT_UNSELECTED, selectedRowIds: [] });
    } else {
      onSelectionChange({ mode: TableSelectionMode.DEFAULT_SELECTED, unselectedRowIds: [] });
    }
  };

  const showControls = tableActions || tableFilters;

  return (
    <div className={cn("w-full @container/table", className)}>
      {showControls && (
        <div className="@2xl/table:flex-row mb-2 flex flex-col items-center gap-2">
          {tableFilters}
          <FlexibleSpacer />
          {tableActions}
        </div>
      )}
      {mobileCard && (
        <div className={cn(tableMobileCardStyles({ variant }), "md:hidden")}>
          {rows.map((row, i) => {
            const inner = (
              <div>
                {mobileCard(row, {
                  highlight: rowHighlight?.(row),
                })}
              </div>
            );
            return onRowClick ? (
              <button className="block text-left" onClick={() => onRowClick(row, i)} key={row.id}>
                {inner}
              </button>
            ) : (
              <div key={row.id}>{inner}</div>
            );
          })}
        </div>
      )}

      <ScrollArea orientation="horizontal">
        <div
          className={cn(tableContainerStyles({ variant }), {
            "hidden md:block": mobileCard,
          })}
        >
          <table className="table w-full">
            <thead className="w-full">
              <tr className={tableRowStyles({ variant, isHeader: true })}>
                {showRowSelection && (
                  <TH variant={variant}>
                    <Checkbox
                      ref={globalSelectAllCheckboxRef}
                      disabled={loading}
                      value={headerState.checked}
                      onChange={handleHeaderToggle}
                    />
                  </TH>
                )}
                {visibleColumns.map((c, i) => (
                  <TH
                    {...columnVariants(i)}
                    key={c.id}
                    helpText={c.helpText}
                    align={c.rightAlign ? "right" : "left"}
                    variant={variant}
                  >
                    {c.name}
                  </TH>
                ))}
                {rowDropdown && <TH variant={variant} />}
              </tr>
            </thead>

            <tbody>
              {loading &&
                [...new Array(loadingRowCount)].map((_j, i) => (
                  <tr key={i} className={tableRowStyles({ variant })}>
                    {showRowSelection && (
                      <td
                        className={tableCellStyles({
                          isLastRow: i === loadingRowCount - 1,
                          variant,
                        })}
                      >
                        <Checkbox value={false} disabled />
                      </td>
                    )}
                    {visibleColumns.map((c, columnIndex) => {
                      return (
                        <td
                          key={c.id}
                          className={tableCellStyles({
                            ...columnVariants(columnIndex),
                            rightAlign: c.rightAlign,
                            isLastRow: i === 9,
                            variant,
                          })}
                        >
                          {/* TODO: Fix Skeleton */}
                          <Skeleton width={100} />
                        </td>
                      );
                    })}
                    {rowDropdown && (
                      <td
                        className={tableCellStyles({
                          variant,
                          ...columnVariants(visibleColumns.length),
                        })}
                      />
                    )}
                  </tr>
                ))}
              {!loading && rows.length === 0 && emptyState && (
                <tr className={tableRowStyles({ variant })}>
                  <td colSpan={columnsLength} className="border-b px-12 py-8">
                    <EmptyState {...emptyState} className="border-0" />
                  </td>
                </tr>
              )}
              {!loading &&
                rows.map((row, rowIndex) => (
                  <tr
                    className={cn(
                      tableRowStyles({ variant, isSelected: isSelected?.(row) }),
                      getRowClassName?.(row)
                    )}
                    key={row.id}
                  >
                    {showRowSelection && (
                      <td
                        className={tableCellStyles({
                          isLastRow: rowIndex === rows.length - 1,
                          isHighlighted: rowHighlight?.(row),
                          variant,
                        })}
                      >
                        <Checkbox
                          name={`row-checkbox-${row.id}`}
                          data-testid={`row-checkbox-${row.id}`}
                          id={`row-checkbox-${row.id}`}
                          value={isRowSelected(selection, row.id)}
                          onChange={(checked) => {
                            if (!selection || !onSelectionChange) {
                              return;
                            }
                            onSelectionChange(toggleRowSelection(selection, row.id, checked));
                          }}
                        />
                      </td>
                    )}
                    {visibleColumns.map((c, columnIndex) => {
                      const formatter =
                        c.render ?? ((rowData: T) => <span>{String(rowData)}</span>);

                      return (
                        /*
                         * @author @Mxs2019
                         * Not sure a better way to get the whole role clickable. If you put a button inside the cell it messes with spacing.
                         */
                        <td
                          key={columnIndex}
                          className={cn(
                            tableCellStyles({
                              isLastRow: rowIndex === rows.length - 1,
                              isHighlighted: rowHighlight?.(row),
                              rightAlign: c.rightAlign,
                              variant,
                              ...columnVariants(columnIndex),
                            }),
                            {
                              "cursor-pointer": !!onRowClick,
                            },
                            c.cellClassName
                          )}
                          onClick={() => onRowClick?.(row, rowIndex)}
                        >
                          <div
                            className={cn("overflow-y-auto", { "max-h-[200px]": !noRowMaxHeight })}
                          >
                            <div
                              className={cn("overflow-x-auto", {
                                "flex justify-end": c.rightAlign,
                              })}
                            >
                              {formatter(row, rowIndex, false)}
                            </div>
                          </div>
                        </td>
                      );
                    })}
                    {rowDropdown && (
                      <td
                        className={tableCellStyles({
                          isLastRow: rowIndex === rows.length - 1,
                          isHighlighted: rowHighlight?.(row),
                          variant,
                        })}
                      >
                        {rowDropdown(row).actions.length > 0 && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="text-tertiary hover:text-primary">
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {rowDropdown(row).actions.map((action, i) => (
                                <DropdownMenuItem key={i} onClick={action.onClick}>
                                  {action.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              {!loading &&
                trailingLoadingRows != null &&
                trailingLoadingRows > 0 &&
                [...new Array(trailingLoadingRows)].map((_j, i) => (
                  <tr key={`trailing-skeleton-${i}`} className={tableRowStyles({ variant })}>
                    {visibleColumns.map((c, columnIndex) => (
                      <td
                        key={c.id}
                        className={tableCellStyles({
                          ...columnVariants(columnIndex),
                          rightAlign: c.rightAlign,
                          isLastRow: i === trailingLoadingRows - 1,
                          variant,
                        })}
                      >
                        <Skeleton containerClassName="w-full max-w-[60%]" />
                      </td>
                    ))}
                    {rowDropdown && (
                      <td
                        className={tableCellStyles({
                          variant,
                          ...columnVariants(visibleColumns.length),
                        })}
                      />
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Table;
