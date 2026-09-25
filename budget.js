// budget.js：预算与降级（消耗升级、连续好请求恢复；纯函数，同一输入必得同一输出）
export function decide(errors, total, budget, state) {
  const prev = state || {};
  const prevLevel = Number.isFinite(prev.level) ? prev.level : 0;
  const prevConsumed = Number.isFinite(prev.errors) ? prev.errors : 0;
  const recoverAfter = Number.isFinite(prev.recover_after) && prev.recover_after > 0 ? prev.recover_after : 1;
  const actions = Array.isArray(prev.degrade_actions) ? prev.degrade_actions : [];

  const consumed = prevConsumed + errors;
  const good = Math.max(0, total - errors);

  let level = prevLevel;
  let recovered = false;
  if (consumed >= budget) level += 1;
  if (level > 0 && good >= recoverAfter) {
    level -= 1;
    recovered = true;
  }
  const remaining = Math.max(0, budget - consumed);
  return { level: level, remaining: remaining, recovered: recovered,
           degraded: actions.slice(0, level) };
}
