const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
const purchaseSource = source.slice(source.indexOf("async function purchaseSubscription()"), source.indexOf("async function restorePurchases()"));

function setup(plugin, isPro = false) {
  const button = { disabled: false };
  const feedback = { textContent: "" };
  const context = {
    subscriptionPurchasePending: false,
    subscriptionState: { ready: true, isPro, productAvailable: false },
    subscriptionPlugin: () => plugin,
    $: selector => selector === "#subscribe-button" ? button : feedback,
    renderSubscriptionUI: () => {},
    subscriptionErrorMessage: (error, fallback) => error.message || fallback,
  };
  vm.runInNewContext(purchaseSource, context);
  return { context, button, feedback, purchase: () => context.purchaseSubscription() };
}

test("purchase retries native StoreKit after an unavailable startup product", async () => {
  let calls = 0;
  const app = setup({ purchase: async () => { calls++; return { isPro: true, productAvailable: true }; } });
  await app.purchase();
  assert.equal(calls, 1);
  assert.equal(app.context.subscriptionState.isPro, true);
  assert.equal(app.button.disabled, true);
  assert.equal(app.feedback.textContent, "Counted Pro is unlocked.");
});

test("failed purchase can be retried without reopening the app", async () => {
  let calls = 0;
  const app = setup({ purchase: async () => {
    if (++calls === 1) throw new Error("App Store unavailable");
    return { isPro: true };
  } });
  await app.purchase();
  assert.equal(app.button.disabled, false);
  assert.equal(app.context.subscriptionPurchasePending, false);
  assert.equal(app.feedback.textContent, "App Store unavailable");
  await app.purchase();
  assert.equal(calls, 2);
  assert.equal(app.context.subscriptionState.isPro, true);
});

test("repeated taps do not open concurrent native purchases", async () => {
  let resolve;
  let calls = 0;
  const app = setup({ purchase: () => { calls++; return new Promise(done => { resolve = done; }); } });
  const first = app.purchase();
  await app.purchase();
  assert.equal(calls, 1);
  assert.equal(app.button.disabled, true);
  resolve({ isPro: false, pending: true });
  await first;
  assert.equal(app.context.subscriptionState.isPro, false);
  assert.equal(app.context.subscriptionPurchasePending, false);
  assert.equal(app.button.disabled, false);
  assert.equal(app.feedback.textContent, "The purchase is still pending.");
});

test("existing Pro users do not start another purchase", async () => {
  const app = setup({ purchase: () => { throw new Error("Unexpected purchase"); } }, true);
  await app.purchase();
  assert.equal(app.context.subscriptionPurchasePending, false);
});

test("web users receive the existing iPhone purchase guidance", async () => {
  const app = setup(undefined);
  await app.purchase();
  assert.equal(app.feedback.textContent, "Subscriptions are purchased in the Counted iPhone app.");
  assert.equal(app.context.subscriptionPurchasePending, false);
});
