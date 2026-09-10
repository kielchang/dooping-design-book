import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import type { UrlStateAdapter } from "@/lib/dooping/use-table-url-state";

/**
 * useTableUrlState 的 react-router 版 adapter。元件庫刻意不綁路由（UrlStateAdapter 是注入點），
 * 宿主用自家路由 API 包出同一個介面——這是 ADR-0011「純呈現、路由由宿主注入」的第二個接縫。
 *
 * 寫入時**只替換 `prefix` 開頭的參數**、保留其他參數。useTableUrlState 交給 set 的是
 * 「這張表的完整 search 字串」，照單全收會把同頁其他參數（例如分頁籤的 view）一起洗掉——
 * 元件庫預設的 historyAdapter 就是整串覆寫，prefix 因此只隔離了讀、沒有隔離寫。
 * 這一點記在 LEDGER.md 的回饋。
 */
export function useRouterUrlAdapter(prefix: string): UrlStateAdapter {
  if (!prefix) throw new Error("同頁還有其他網址參數時，表格狀態必須帶 prefix");

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
      set: (search) => {
        const next = new URLSearchParams(searchRef.current);
        for (const key of [...next.keys()]) if (key.startsWith(prefix)) next.delete(key);
        for (const [key, value] of new URLSearchParams(search)) next.set(key, value);
        const s = next.toString();
        // replace 而不是 push：每敲一個字就多一筆歷史，上一頁會變成倒帶打字機
        navigate({ search: s ? `?${s}` : "" }, { replace: true });
      },
      subscribe: (cb) => {
        listeners.current.add(cb);
        return () => {
          listeners.current.delete(cb);
        };
      },
    }),
    [navigate, prefix],
  );
}
