import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../lib/utils";

/**
 * 側板（右側滑出）。與 Dialog 的分工是**脈絡**，不是大小：
 *   - Dialog：攔截式——確認、短表單，置中、背景失焦，做完才能繼續
 *   - Drawer：延伸式——從清單快看一筆明細、次要編輯，背景仍看得到「我從哪一列來」
 * 內容超過兩個畫面高就該是有網址的獨立頁（明細頁），不是更大的側板。
 *
 * 刻意只做右側：後台的閱讀動線由左至右，清單在左、延伸內容從右滑出。
 * 要左側／底部再議（三次法則）。行動版全寬（保留邊距會露出一條沒意義的縫）。
 *
 * 底層復用 @radix-ui/react-dialog：焦點圈禁、Esc 關閉、aria 連動全部繼承，
 * 不另帶新相依。
 */
const Drawer = DialogPrimitive.Root;
const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerPortal = DialogPrimitive.Portal;
const DrawerClose = DialogPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay ref={ref} className={cn("fixed inset-0 z-50 bg-black/70", className)} {...props} />
));
DrawerOverlay.displayName = "DrawerOverlay";

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { closeLabel?: string }
>(({ className, children, closeLabel = "關閉", ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-y-0 right-0 z-50 flex w-full flex-col gap-4 border-l bg-background p-6 shadow-lg sm:max-w-md",
        "animate-in slide-in-from-right duration-normal motion-reduce:animate-none",
        className,
      )}
      {...props}
    >
      {children}
      {/* 關閉鈕慣例與 Dialog 同一份：state-layer、focus-visible、弱化字色 → 正文色 */}
      <DialogPrimitive.Close className="state-layer absolute right-3 top-3 rounded-sm p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        <X className="size-4" />
        <span className="sr-only">{closeLabel}</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 pr-8", className)} {...props} />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
));
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DrawerDescription.displayName = "DrawerDescription";

export {
  Drawer, DrawerPortal, DrawerOverlay, DrawerClose, DrawerTrigger,
  DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription,
};
