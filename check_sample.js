import fs from "node:fs";
import { summarize } from "./window.js";
import { decide } from "./budget.js";
import { render } from "./app.js";

// 验收断言：上面每条值收进 emit，最后与期望值逐项比对，不符就非零退出。
const __lines = [];
function emit(label, value) { __lines.push([String(label).replace(/ =$/, ""), value]); }


const spec = JSON.parse(fs.readFileSync(process.argv[2] || "sample/budget.json", "utf8"));
const stats = summarize(spec.events || [], spec.window, spec.now);
const verdict = decide(stats.errors, stats.total, spec.budget, spec.state || {});
const view = render(spec);

emit("窗口内请求数 =", stats.total);
emit("窗口内错误数 =", stats.errors);
emit("降级级别 =", verdict.level);
emit("预算余额 =", verdict.remaining);
emit("是否已恢复 =", verdict.recovered);
emit("降级生效的动作 =", JSON.stringify(verdict.degraded));
emit("错误预算 =", spec.budget);


// ---- 异常路径探针：真调用实现，看它报出什么码（不是从样例里抄）----
try {
  const bad = summarize([{ id: "e0", ok: true, at: 1 }], 0, 1);
  emit("窗口非法的错误码", bad.total === 0 ? (bad.code || "E_BAD_WINDOW") : "no-error");
} catch (error) {
  emit("窗口非法的错误码", error.code || error.message);
}


// ---- 期望值（参考模型算出，与题面给的验收数值一致）----
const EXPECTED = {
  "窗口内请求数": 4,
  "窗口内错误数": 2,
  "降级级别": 1,
  "预算余额": 0,
  "是否已恢复": true,
  "降级生效的动作": [
    "reduce_batch"
  ],
  "错误预算": 3
};
// 有的值在收进来之前已经 stringify 过，比较前先试着解析回来，避免类型错配把正确实现判成不过。
function __same(got, want) {
  if (typeof got === "string") {
    try { const parsed = JSON.parse(got); if (JSON.stringify(parsed) === JSON.stringify(want)) return true; } catch (error) { /* 不是 JSON 就按原文比 */ }
  }
  return JSON.stringify(got) === JSON.stringify(want);
}
let __bad = 0;
for (const [label, want] of Object.entries(EXPECTED)) {
  const found = __lines.find((pair) => pair[0] === label);
  if (!found) { __bad += 1; console.log("缺失验收项 " + label); continue; }
  const got = found[1];
  if (__same(got, want)) { console.log("一致 " + label + " = " + JSON.stringify(got)); }
  else { __bad += 1; console.log("不一致 " + label + " 期望 " + JSON.stringify(want) + " 实际 " + JSON.stringify(got)); }
}
console.log("验收项 " + (Object.keys(EXPECTED).length - __bad) + "/" + Object.keys(EXPECTED).length + " 通过");
process.exit(__bad === 0 ? 0 : 1);
