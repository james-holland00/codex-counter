const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const sandbox = {};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "..", "counted-core.js"), "utf8"), sandbox);
const core = sandbox.CountedCore;

test("Hi-Lo values cover every rank", () => {
  for (const rank of ["2", "3", "4", "5", "6"]) assert.equal(core.hiLoValue(rank), 1);
  for (const rank of ["7", "8", "9"]) assert.equal(core.hiLoValue(rank), 0);
  for (const rank of ["10", "J", "Q", "K", "A"]) assert.equal(core.hiLoValue(rank), -1);
});

test("Hi-Lo groups match their values", () => {
  assert.equal(core.hiLoGroup("4"), "low");
  assert.equal(core.hiLoGroup("8"), "neutral");
  assert.equal(core.hiLoGroup("A"), "high");
});

test("free users keep Learn, Practice, Progress, and the 20-card drill", () => {
  assert.equal(core.canAccessView("learn", false), true);
  assert.equal(core.canAccessView("practice", false), true);
  assert.equal(core.canAccessView("progress", false), true);
  assert.equal(core.canAccessView("flash", false), false);
  assert.equal(core.canAccessView("casino", false), false);
  assert.equal(core.canUseSessionLength(20, false), true);
  assert.equal(core.canUseSessionLength(40, false), false);
  assert.equal(core.canUseSessionLength(52, false), false);
});

test("Pro unlocks advanced training and longer drills", () => {
  for (const view of ["flash", "casino"]) assert.equal(core.canAccessView(view, true), true);
  assert.equal(core.normalizeSessionLength(40, true), 40);
  assert.equal(core.normalizeSessionLength(52, true), 52);
});

test("locked or invalid session lengths fall back safely", () => {
  assert.equal(core.normalizeSessionLength(52, false), 20);
  assert.equal(core.normalizeSessionLength(999, true), 20);
});

test("Pit Boss decision timer reaches timeout after eight ticks", () => {
  let seconds = 8;
  for (let tick = 0; tick < 8; tick += 1) seconds = core.nextDecisionSeconds(seconds);
  assert.equal(seconds, 0);
  assert.equal(core.hasDecisionTimedOut(seconds), true);
  assert.equal(core.nextDecisionSeconds(seconds), 0);
});
