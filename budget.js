// budget.js：预算与降级。纯函数：不改 state，同一输入永远同一输出（幂等，
// 同一批请求重复统计不会把错误算两次）。级别只由消耗与恢复口径决定。
export function decide(errors, total, budget, state) {
  const s = state || {};
  const consumed = (s.errors || 0) + errors;
  const good = Math.max(0, total - errors);
  const recoverAfter = typeof s.recover_after === "number" ? s.recover_after : Infinity;
  const actions = s.degrade_actions || s.actions || [];
  let level = s.level || 0;
  if (consumed >= budget) level += 1;
  const recovered = good >= recoverAfter;
  if (recovered && level > 0) level -= 1;
  if (level < 0) level = 0;
  const remaining = Math.max(0, budget - consumed);
  return { level: level, remaining: remaining, recovered: recovered,
           degraded: actions.slice(0, level) };
}
