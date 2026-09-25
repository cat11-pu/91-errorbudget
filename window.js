// window.js：窗口统计（只算落在窗口内的请求，按 id 去重，单次线性扫描）
export function summarize(events, window, now) {
  if (!Number.isFinite(window) || window <= 0) {
    const error = new Error("E_BAD_WINDOW");
    error.code = "E_BAD_WINDOW";
    throw error;
  }
  const from = now - window;
  const seen = new Set();
  let total = 0;
  let errors = 0;
  for (const event of events) {
    if (!event) continue;
    const at = event.at;
    if (typeof at !== "number" || at < from || at > now) continue;
    const id = event.id;
    if (id !== undefined && id !== null) {
      if (seen.has(id)) continue;
      seen.add(id);
    }
    total += 1;
    if (event.ok === false) errors += 1;
  }
  return { total: total, errors: errors };
}
