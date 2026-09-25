import assert from "node:assert";
import { summarize } from "../window.js";
import { decide } from "../budget.js";
import { render } from "../app.js";

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

const events = [{ id: "e0", ok: true, at: 1 }, { id: "e1", ok: false, at: 2 }];

check("summarize counts errors", () => {
  assert.strictEqual(summarize(events, 5, 3).errors, 1);
});

check("summarize returns total", () => {
  assert.strictEqual(typeof summarize(events, 5, 3).total, "number");
});

check("decide reports level", () => {
  assert.strictEqual(typeof decide(1, 2, 3, {}).level, "number");
});

check("decide reports remaining", () => {
  assert.strictEqual(typeof decide(1, 2, 3, {}).remaining, "number");
});

check("render exposes recovered flag", () => {
  assert.strictEqual(typeof render({ events: events, window: 5, now: 3, budget: 3 }).recovered, "boolean");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
