const DEFAULT_TIMEOUT = 10000;

export async function httpGet<T = unknown>(
  url: string,
  opts: { query?: Record<string, any>; timeoutMs?: number } = {}
): Promise<T> {
  const { query, timeoutMs = DEFAULT_TIMEOUT } = opts;
  const u = new URL(url);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v == null || v === "") continue;
      if (Array.isArray(v)) v.forEach((vv) => u.searchParams.append(k, String(vv)));
      else u.searchParams.set(k, String(v));
    }
  }
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(u.toString(), { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(t);
  }
}