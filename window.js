// window.js：窗口统计，只算 (now - window, now] 里的请求，单次线性扫描。
export function summarize(events, window, now) {
  if (!(typeof window === "number" && window > 0)) {
    const error = new Error("E_BAD_WINDOW");
    error.code = "E_BAD_WINDOW";
    throw error;
  }
  const from = now - window;
  let total = 0;
  let errors = 0;
  for (const event of events || []) {
    if (!event || typeof event.at !== "number") continue;
    if (event.at <= from || event.at > now) continue;
    total += 1;
    if (event.ok === false) errors += 1;
  }
  return { total: total, errors: errors };
}
