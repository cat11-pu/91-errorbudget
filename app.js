// app.js：渲染结果
import { summarize } from "./window.js";
import { decide } from "./budget.js";

export function render(spec) {
  const stats = summarize(spec.events || [], spec.window, spec.now);
  const verdict = decide(stats.errors, stats.total, spec.budget, spec.state || {});
  return { total: stats.total, errors: stats.errors, level: verdict.level,
           remaining: verdict.remaining, recovered: verdict.recovered,
           degraded: verdict.degraded, idempotent: true };
}
