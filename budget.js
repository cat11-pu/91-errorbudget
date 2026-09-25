// budget.js：预算与降级（基线：不判降级、不恢复）
export function decide(errors, total, budget, state) {
  return { level: 0, remaining: budget, recovered: false, degraded: [] };
}
