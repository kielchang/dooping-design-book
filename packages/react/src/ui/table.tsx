import * as React from "react";
import { ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";
import type { SortState } from "../lib/use-sort";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & { zebra?: boolean; maxHeight?: string }
>(({ className, zebra, maxHeight, ...props }, ref) => (
  <div className={cn("relative w-full overflow-auto", maxHeight)}>
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", zebra && "[&_tbody_tr:nth-child(even)]:bg-muted/30", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & { sticky?: boolean }
>(({ className, sticky, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "[&_tr]:border-b",
      // 列印時取消黏性：印出來的表頭由 `display: table-header-group` 每頁重複，
      // 保留 sticky 反而會讓表頭壓在第一頁的內容上。
      sticky && "sticky top-0 z-10 bg-background [&_th]:bg-background print:static",
      className,
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />,
);
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)} {...props} />
  ),
);
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    // 三種列狀態全部走 `state-layer`：它疊在列**自己**的底色上，因此斑馬列（`bg-muted/30`）
    // 被指到時一樣是「深了一階」。改版前 hover 是 `bg-muted/50`、已選是 `bg-muted`——
    // 與斑馬列同一個顏色的不同透明度，實測一般→hover 只差 ΔE00 1.6，等於看不出來。
    // 已選的列把「弱化文字」整個重新定義成正文色：22% 疊加之後 `muted-foreground`
    // 掉到 2.58:1（淺）／2.75:1（深），低於 4.5:1。這不是調數值能解的——已選的列在語意上
    // 就是被強調的，它的次要文字不該繼續弱化。改 CSS 變數而不是逐個換 class，
    // 是為了讓列裡任何吃 `--muted-foreground` 的東西（文字、圖示、分隔線）一次跟上。
    <tr
      ref={ref}
      className={cn(
        "state-layer border-b data-[state=selected]:[--muted-foreground:var(--foreground)]",
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn("h-10 whitespace-nowrap px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", className)}
      {...props}
    />
  ),
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn("p-2 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
  ),
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />,
);
TableCaption.displayName = "TableCaption";

/** 數字欄表頭：右對齊。 */
const NumHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => <TableHead ref={ref} className={cn("text-right", className)} {...props} />,
);
NumHead.displayName = "NumHead";

/** 數字儲存格：右對齊＋等寬數字（位數對齊才看得出量級差異）。 */
const NumCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => <TableCell ref={ref} className={cn("text-right tabular-nums", className)} {...props} />,
);
NumCell.displayName = "NumCell";

/** 凍結首欄：長表水平捲動時保留「這一列是誰」的脈絡。套在第一個 th/td。 */
const freezeFirst = "sticky left-0 z-10 bg-background";

export interface SortHeadProps extends React.PropsWithChildren {
  sortKey: string;
  sort: SortState;
  onSort: (key: string) => void;
  numeric?: boolean;
  className?: string;
}

/** 可排序表頭：點擊循環 無→大到小→小到大；箭頭標示目前狀態（未排序時淡化，不是消失）。 */
function SortHead({ sortKey, sort, onSort, numeric = false, className, children }: SortHeadProps) {
  const active = sort?.key === sortKey;
  const Icon = !active ? ChevronsUpDown : sort!.dir === "desc" ? ChevronDown : ChevronUp;
  return (
    <TableHead className={cn(numeric && "text-right", "p-0", className)} aria-sort={active ? (sort!.dir === "asc" ? "ascending" : "descending") : "none"}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "inline-flex h-10 w-full items-center gap-1 px-2 hover:text-foreground",
          numeric ? "justify-end" : "justify-start",
          active && "text-foreground",
        )}
      >
        {numeric && <Icon className={cn("size-3.5", !active && "opacity-40")} aria-hidden />}
        {children}
        {!numeric && <Icon className={cn("size-3.5", !active && "opacity-40")} aria-hidden />}
      </button>
    </TableHead>
  );
}

export {
  Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption,
  NumHead, NumCell, SortHead, freezeFirst,
};
