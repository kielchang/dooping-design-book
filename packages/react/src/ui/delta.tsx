import { cn, formatNumber } from "../lib/utils";

export interface DeltaProps {
  value: number;
  /**
   * 哪個方向算「好」。差異數字的好壞是**業務決定**、不是數學決定：
   * 「庫存差異 +100」可能是好（備料充足）也可能是壞（積壓），元件不猜。
   */
  goodWhen?: "positive" | "negative";
  /** 正值前綴文字（如「超出」「增加」） */
  posLabel?: string;
  /** 負值前綴文字（如「短少」「減少」） */
  negLabel?: string;
  format?: (n: number) => string;
  zeroLabel?: string;
  className?: string;
}

/**
 * 變異顯示。
 *
 * 三重編碼：**箭頭符號 ▲▼ ＋ 文字 ＋ 顏色**。顏色是三者中最弱的一環——
 * 8% 的男性有紅綠色覺障礙，而後台報表幾乎一定會被灰階列印出來簽核。
 * 因此箭頭與文字必須自己就能把話說完，顏色只是加速。
 */
export function Delta({
  value,
  goodWhen = "positive",
  posLabel = "",
  negLabel = "",
  format = formatNumber,
  zeroLabel = "持平",
  className,
}: DeltaProps) {
  if (value === 0) {
    return <span className={cn("tabular-nums text-muted-foreground", className)}>— {zeroLabel}</span>;
  }
  const positive = value > 0;
  const good = goodWhen === "positive" ? positive : !positive;
  const arrow = positive ? "▲" : "▼";
  const label = positive ? posLabel : negLabel;
  return (
    <span
      className={cn("inline-flex items-center gap-0.5 tabular-nums", good ? "text-success" : "text-danger", className)}
      title={`${label}${format(Math.abs(value))}`}
    >
      <span aria-hidden>{arrow}</span>
      {label && <span>{label}</span>}
      {format(Math.abs(value))}
    </span>
  );
}
