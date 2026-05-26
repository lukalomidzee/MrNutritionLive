import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../api/adminApi";

type Mapper<ApiDTO, Row> = (dto: ApiDTO) => Row;

interface UseLoadListOptions<ApiDTO, Row> {
  url?: string;
  query?: Record<string, any>;
  map: Mapper<ApiDTO, Row>;
  select?: (raw: any) => ApiDTO[];
  enabled?: boolean;
}

export function useLoadList<ApiDTO, Row>(opts: UseLoadListOptions<ApiDTO, Row>) {
  const { url, query, map, select, enabled = true } = opts;
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const acRef = useRef<AbortController | null>(null);

  const reload = useCallback(async () => {
    if (!enabled || !url) {
      setLoading(false);
      return;
    }

    if (acRef.current) acRef.current.abort();
    const ac = new AbortController();
    acRef.current = ac;

    setLoading(true);
    setError(null);
    try {
      const res = await api.get(url, { params: query, signal: ac.signal });
      const payload = res?.data?.data ?? res?.data ?? res;

      const fallbackExtract = (d: any): ApiDTO[] =>
        Array.isArray(d)
          ? d
          : (d?.items ??
              d?.results ??
              d?.data ??
              d?.value ??
              d?.list ??
              []);

      const list: ApiDTO[] = (select ?? fallbackExtract)(payload);
      setRows(list.map(map));
    } catch (e: any) {
      if (e.code !== "ERR_CANCELED") setError(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [enabled, url, JSON.stringify(query), select, map]);

  useEffect(() => { reload(); return () => acRef.current?.abort(); }, [reload]);

  return { rows, loading, error, reload };
}
