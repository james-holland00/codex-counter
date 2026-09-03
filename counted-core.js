(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.CountedCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const PRODUCT_ID = "com.jamesholland.counted.pro.annual";
  const FREE_SESSION_LENGTH = 20;
  const PRO_VIEWS = new Set(["flash", "casino"]);

  function hiLoValue(rank) {
    if (["2", "3", "4", "5", "6"].includes(rank)) return 1;
    if (["7", "8", "9"].includes(rank)) return 0;
    return -1;
  }

  function hiLoGroup(rank) {
    const value = hiLoValue(rank);
    return value === 1 ? "low" : value === 0 ? "neutral" : "high";
  }

  function mergeFreeSessionsUsed(...sources) {
    return Object.fromEntries([...PRO_VIEWS].map((mode) => [mode, sources.some((source) => Boolean(source?.[mode]))]));
  }

  function canStartProSession(viewName, isPro, freeSessionsUsed = {}) {
    return Boolean(isPro) || (PRO_VIEWS.has(viewName) && !freeSessionsUsed[viewName]);
  }

  function canAccessView(viewName, isPro, freeSessionsUsed = {}, sessionActive = false) {
    return !PRO_VIEWS.has(viewName) || sessionActive || canStartProSession(viewName, isPro, freeSessionsUsed);
  }

  function canUseSessionLength(length, isPro) {
    return Number(length) === FREE_SESSION_LENGTH || Boolean(isPro);
  }

  function normalizeSessionLength(length, isPro) {
    const parsed = Number(length);
    if (![20, 40, 52].includes(parsed)) return FREE_SESSION_LENGTH;
    return canUseSessionLength(parsed, isPro) ? parsed : FREE_SESSION_LENGTH;
  }

  function nextDecisionSeconds(seconds) {
    return Math.max(0, Number(seconds) - 1);
  }

  function hasDecisionTimedOut(seconds) {
    return Number(seconds) <= 0;
  }

  return {
    PRODUCT_ID,
    FREE_SESSION_LENGTH,
    PRO_VIEWS,
    hiLoValue,
    hiLoGroup,
    mergeFreeSessionsUsed,
    canStartProSession,
    canAccessView,
    canUseSessionLength,
    normalizeSessionLength,
    nextDecisionSeconds,
    hasDecisionTimedOut,
  };
});
