// app.js：渲染结果
import { summarize } from "./window.js";
import { decide } from "./budget.js";

export function render(spec) {
  const stats = summarize(spec.events || [], spec.window, spec.now);
  const state = Object.assign(
    { recover_after: spec.recover_after, degrade_actions: spec.degrade_actions },
    spec.state || {});
  const verdict = decide(stats.errors, stats.total, spec.budget, state);
  const again = decide(stats.errors, stats.total, spec.budget, state);
  const idempotent = JSON.stringify(verdict) === JSON.stringify(again);
  return { total: stats.total, errors: stats.errors, level: verdict.level,
           remaining: verdict.remaining, recovered: verdict.recovered,
           degraded: verdict.degraded, idempotent: idempotent };
}
