import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import type { UrlStateAdapter } from "@/lib/dooping/use-table-url-state";

/**
 * useTableUrlState 的 react-router 版 adapter。元件庫刻意不綁路由（UrlStateAdapter 是注入點），
 * 宿主用自家路由 API 包出同一個介面——這是 ADR-0011「純呈現、路由由宿主注入」的第二個接縫。
 *
 * hook 交給 set 的是**整串** search（已保留同頁不屬於這張表的參數），這裡照單寫回即可。
 * 第一版曾在這裡自己合併參數：當時 hook 只交出本表的參數、prefix 只隔離了讀。
 * 元件庫修好後拿掉（LEDGER.md 回饋 2）。
 */
export function useRouterUrlAdapter(): UrlStateAdapter {
  const location = useLocation();
  const navigate = useNavigate();

  // render 期間同步：useSyncExternalStore 的 getSnapshot 要讀到這一輪的網址
  const searchRef = useRef(location.search);
  searchRef.current = location.search;

  const listeners = useRef(new Set<() => void>());
  useEffect(() => {
    for (const cb of listeners.current) cb();
  }, [location.search]);

  return useMemo<UrlStateAdapter>(
    () => ({
      get: () => searchRef.current.replace(/^\?/, ""),
      // replace 而不是 push：每敲一個字就多一筆歷史，上一頁會變成倒帶打字機
      set: (search) => navigate({ search: search ? `?${search}` : "" }, { replace: true }),
      subscribe: (cb) => {
        listeners.current.add(cb);
        return () => {
          listeners.current.delete(cb);
        };
      },
    }),
    [navigate],
  );
}
