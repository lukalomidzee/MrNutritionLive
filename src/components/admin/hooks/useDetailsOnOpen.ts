import { useEffect, useRef, useState } from "react";
import { api } from "../api/adminApi";

type Mapper<T> = (raw: any) => T;

export function useDetailsOnOpen<T>({
  open,
  id,
  url,
  map,
  initial,
  defaults,
}: {
  open: boolean;
  id: string | null;
  url: (id: string) => string;
  map: Mapper<T>;
  initial?: Partial<T>;
  defaults?: Partial<T>;
}) {
  const [model, setModel] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!open || !id) return;

    if (initial || defaults) {
      setModel({ ...(defaults as any), ...(initial as any) } as T);
    } else {
      setModel(null);
    }

    if (abortRef.current) abortRef.current.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    (async () => {
      setLoading(true);
      setError(undefined);
      try {
        const res = await api.get(url(id), { signal: ac.signal });
        const payload = (res as any)?.data?.data ?? (res as any)?.data ?? res;

        const canonical = map(payload);

        setModel({ ...(defaults as any), ...(canonical as any) } as T);
      } catch (e: any) {
        if (e?.code !== "ERR_CANCELED") {
          setError(e?.response?.data?.message ?? e?.message ?? "Failed to load.");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => abortRef.current?.abort();
  }, [open, id]);

  return { model, setModel, loading, error };
}
