// window.js：窗口统计（基线：累计全部、不看窗口）
export function summarize(events, window, now) {
  let errors = 0;
  for (const event of events) if (event.ok === false) errors += 1;
  return { total: events.length, errors: errors };
}
