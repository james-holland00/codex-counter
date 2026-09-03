const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suits = ["♠", "♥", "♦", "♣"];
const dealerCards = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "A"];
const strategyActions = {
  H: { label: "Hit", className: "action-hit" },
  S: { label: "Stand", className: "action-stand" },
  D: { label: "Double if allowed, otherwise hit", className: "action-double" },
  P: { label: "Split", className: "action-split" },
};
const basicStrategy = {
  hard: {
    rows: [
      ["17+", "SSSSSSSSSS"],
      ["13–16", "SSSSSHHHHH"],
      ["12", "HHSSSHHHHH"],
      ["11", "DDDDDDDDDH"],
      ["10", "DDDDDDDDHH"],
      ["9", "HDDDDHHHHH"],
      ["8 or less", "HHHHHHHHHH"],
    ],
  },
  soft: {
    rows: [
      ["A,9", "SSSSSSSSSS"],
      ["A,8", "SSSSSSSSSS"],
      ["A,7", "SDDDDSSHHH"],
      ["A,6", "HDDDDHHHHH"],
      ["A,4–A,5", "HHDDDHHHHH"],
      ["A,2–A,3", "HHHDDHHHHH"],
    ],
  },
  pairs: {
    rows: [
      ["A,A", "PPPPPPPPPP"],
      ["10,10", "SSSSSSSSSS"],
      ["9,9", "PPPPP SPPSS".replaceAll(" ", "")],
      ["8,8", "PPPPPPPPPP"],
      ["7,7", "PPPPPPHHHH"],
      ["6,6", "PPPPPHHHHH"],
      ["5,5", "DDDDDDDDHH"],
      ["4,4", "HHHPPHHHHH"],
      ["2,2–3,3", "PPPPPPHHHH"],
    ],
  },
};
const trueCountScenarios = [
  { running: 6, decks: 3, answer: 2 },
  { running: -8, decks: 4, answer: -2 },
  { running: 9, decks: 3, answer: 3 },
  { running: 4, decks: 2, answer: 2 },
  { running: -6, decks: 3, answer: -2 },
  { running: 10, decks: 5, answer: 2 },
  { running: 5, decks: 2.5, answer: 2 },
  { running: -3, decks: 1.5, answer: -2 },
];
const levelThresholds = [0, 150, 350, 650, 1000, 1500, 2200, 3000, 4000, 5200, 6600, 8200];
const rankMilestones = [
  { level: 1, title: "Rookie Counter", copy: "Learn the values. Make the count automatic.", icon: "♠" },
  { level: 3, title: "Running Counter", copy: "Hold the count cleanly through longer sequences.", icon: "+1" },
  { level: 5, title: "Deck Estimator", copy: "See the shoe depth and convert without hesitation.", icon: "◫" },
  { level: 8, title: "Casino Sharp", copy: "Keep your process steady at real table speed.", icon: "◆" },
  { level: 11, title: "True Count Master", copy: "Card values, deck estimation, and conversion work as one.", icon: "★" },
];
const achievementPageSize = 6;
const achievementDefinitions = [
  { id: "first-deal", tier: 1, icon: "♠", title: "First Deal", copy: "Count 20 practice cards.", unlocked: (p) => p.totalCards >= 20 },
  { id: "session-one", tier: 1, icon: "1", title: "Session One", copy: "Complete your first practice session.", unlocked: (p) => p.practiceSessions >= 1 },
  { id: "first-flash", tier: 1, icon: "⚡", title: "First Flash", copy: "Complete a Rapid Flash sprint.", unlocked: (p) => p.flashSessions >= 1 },
  { id: "table-debut", tier: 1, icon: "◆", title: "Table Debut", copy: "Complete your first Casino shoe.", unlocked: (p) => p.casinoSessions >= 1 },
  { id: "seven-up", tier: 1, fun: true, icon: "7", title: "Seven Up", copy: "Put together a seven-card streak.", unlocked: (p) => p.bestStreak >= 7 },
  { id: "night-shift", tier: 1, fun: true, icon: "☾", title: "Night Shift", copy: "Finish a practice session after 10pm.", unlocked: (p) => p.nightSessions >= 1 },

  { id: "hundred-club", tier: 2, icon: "100", title: "Hundred Club", copy: "Count 100 practice cards.", unlocked: (p) => p.totalCards >= 100 },
  { id: "five-sessions", tier: 2, icon: "5", title: "Finding Rhythm", copy: "Complete five practice sessions.", unlocked: (p) => p.practiceSessions >= 5 },
  { id: "ten-straight", tier: 2, icon: "10", title: "Ten Straight", copy: "Reach a ten-card answer streak.", unlocked: (p) => p.bestStreak >= 10 },
  { id: "clean-twenty", tier: 2, icon: "✓", title: "Clean Twenty", copy: "Perfect a 20-card practice session.", unlocked: (p) => p.perfectTwentySessions >= 1 },
  { id: "back-to-zero", tier: 2, fun: true, icon: "0", title: "Back to Zero", copy: "Finish a practice session on a running count of zero.", unlocked: (p) => p.zeroFinishSessions >= 1 },
  { id: "triple-header", tier: 2, fun: true, icon: "Ⅲ", title: "Triple Header", copy: "Complete three practice sessions in one day.", unlocked: (p) => p.maxSessionsInDay >= 3 },

  { id: "five-hundred", tier: 3, icon: "500", title: "Five Hundred", copy: "Count 500 practice cards.", unlocked: (p) => p.totalCards >= 500 },
  { id: "true-converter", tier: 3, icon: "÷", title: "True Converter", copy: "Answer eight true-count lab questions in a row.", unlocked: (p) => p.trueCountBestStreak >= 8 },
  { id: "flash-point", tier: 3, icon: "⚡", title: "Flash Point", copy: "Perfect a Rapid Flash sprint.", unlocked: (p) => p.flashBestAccuracy >= 100 },
  { id: "casino-ready", tier: 3, icon: "◆", title: "Casino Ready", copy: "Clear every count checkpoint in a Casino shoe.", unlocked: (p) => p.casinoBestAccuracy >= 100 },
  { id: "split-personality", tier: 3, fun: true, icon: "↔", title: "Split Personality", copy: "Split five hands in Casino mode.", unlocked: (p) => p.casinoSplits >= 5 },
  { id: "double-agent", tier: 3, fun: true, icon: "2×", title: "Double Agent", copy: "Double down ten times in Casino mode.", unlocked: (p) => p.casinoDoubles >= 10 },

  { id: "four-figures", tier: 4, icon: "1K", title: "Four Figures", copy: "Count 1,000 practice cards.", unlocked: (p) => p.totalCards >= 1000 },
  { id: "hot-run", tier: 4, icon: "↗", title: "Hot Run", copy: "Reach a 20-card answer streak.", unlocked: (p) => p.bestStreak >= 20 },
  { id: "committed", tier: 4, icon: "7D", title: "Committed", copy: "Build a seven-day training streak.", unlocked: (p) => practiceDayStreak(p) >= 7 },
  { id: "all-rounder", tier: 4, icon: "◎", title: "All-Rounder", copy: "Reach 90% in every card group after 100 attempts each.", unlocked: (p) => groupsMastered(p) },
  { id: "speed-demon", tier: 4, fun: true, icon: "»", title: "Speed Demon", copy: "Perfect a Rapid Flash sprint at Pit Boss speed.", unlocked: (p) => p.flashPitBossPerfects >= 1 },
  { id: "full-house", tier: 4, fun: true, icon: "♣", title: "Full House", copy: "Perfect a Casino shoe with three automatic players.", unlocked: (p) => p.casinoThreePlayerPerfects >= 1 },

  { id: "perfect-deck", tier: 5, icon: "52", title: "Perfect Deck", copy: "Score 100% in a 52-card practice session.", unlocked: (p) => p.perfectFullDeckSessions >= 1 },
  { id: "dedicated", tier: 5, icon: "25", title: "Dedicated", copy: "Complete 25 practice sessions.", unlocked: (p) => p.practiceSessions >= 25 },
  { id: "month-in-making", tier: 5, icon: "30", title: "Month in the Making", copy: "Train on 30 different days.", unlocked: (p) => new Set(p.practiceDates).size >= 30 },
  { id: "five-thousand", tier: 5, icon: "5K", title: "Five Thousand", copy: "Count 5,000 practice cards.", unlocked: (p) => p.totalCards >= 5000 },
  { id: "blackjack-magnet", tier: 5, fun: true, icon: "21", title: "Blackjack Magnet", copy: "Receive ten natural blackjacks in Casino mode.", unlocked: (p) => p.casinoBlackjacks >= 10 },
  { id: "pit-boss-royalty", tier: 5, fun: true, icon: "★", title: "Pit Boss Royalty", copy: "Perfect five Rapid Flash sprints at Pit Boss speed.", unlocked: (p) => p.flashPitBossPerfects >= 5 },
];

const storageKey = "counted-progress-v1";
const defaultProgress = {
  totalCards: 0,
  correctCards: 0,
  bestStreak: 0,
  groups: { low: [0, 0], neutral: [0, 0], high: [0, 0] },
  sessions: [],
  practiceDates: [],
  flashSessions: 0,
  flashBestAccuracy: 0,
  flashPitBossPerfects: 0,
  casinoSessions: 0,
  casinoBestAccuracy: 0,
  casinoThreePlayerPerfects: 0,
  casinoSplits: 0,
  casinoDoubles: 0,
  casinoBlackjacks: 0,
  practiceSessions: 0,
  perfectTwentySessions: 0,
  perfectFullDeckSessions: 0,
  zeroFinishSessions: 0,
  nightSessions: 0,
  sessionDays: {},
  maxSessionsInDay: 0,
  trueCountBestStreak: 0,
  xp: 0,
  dailyGoal: { date: "", xp: 0 },
};

let progress = loadProgress();
let sessionLength = 20;
let deck = [];
let cardIndex = 0;
let correct = 0;
let sessionStreak = 0;
let sessionBestStreak = 0;
let runningCount = 0;
let locked = false;
let soundOn = loadSoundPreference();
let audioContext = null;
const casinoSettingsKey = "counted-casino-rules-v1";
const defaultCasinoSettings = { autoPlayers: 2, decks: 6, soft17: "stand", doubleAfterSplit: true, surrender: true };
const casinoPaceProfiles = {
  tourist: { speed: 1500, checkpointEvery: 2, decisionSeconds: 0 },
  casino: { speed: 950, checkpointEvery: 3, decisionSeconds: 0 },
  pitboss: { speed: 600, checkpointEvery: 5, decisionSeconds: 8 },
};
let casinoSettings = loadCasinoSettings();
let casinoPace = "casino";
let casinoShoe = [];
let casinoShoeIndex = 0;
let casinoCutIndex = 0;
let casinoRunningCount = 0;
let casinoRound = 0;
let casinoCompletedRounds = 0;
let casinoDealerHand = [];
let casinoSeats = [];
let casinoUserSeat = null;
let casinoUserHandIndex = 0;
let casinoWins = 0;
let casinoLosses = 0;
let casinoPushes = 0;
let casinoCheckpoints = 0;
let casinoCorrect = 0;
let casinoSpeed = casinoPaceProfiles[casinoPace].speed;
let casinoTimer = null;
let casinoDecisionTimer = null;
let casinoDecisionSecondsRemaining = 0;
let casinoPlaying = false;
let casinoPaused = false;
let casinoAwaitingCount = false;
let casinoSubmitting = false;
let casinoActionLocked = false;
let casinoRunToken = 0;
let casinoCheckDue = false;
let casinoPhase = "idle";
let trueCountIndex = 0;
let trueCountStreak = 0;
let trueCountLocked = false;
let trueCountTimer = null;
let appToastTimer = null;
let screenWakeLock = null;
let flashDeck = [];
let flashIndex = 0;
let flashRunningCount = 0;
let flashCheckpoints = 0;
let flashCorrect = 0;
let flashSpeed = 700;
let flashStartingDecks = 2;
let flashTimer = null;
let flashPlaying = false;
let flashPaused = false;
let flashAwaitingCount = false;
let flashSubmitting = false;
let learnScrollPosition = 0;
let navigationFrame = 0;
let achievementPage = 0;
let achievementScrollFrame = 0;
let paywallScrollPosition = 0;
let subscriptionState = {
  ready: false,
  isPro: false,
  productAvailable: false,
  displayPrice: "£2.99",
  expirationDate: null,
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const subscriptionPlugin = () => window.Capacitor?.Plugins?.CountedSubscription;

function subscriptionErrorMessage(error, fallback) {
  const message = error?.message || error?.errorMessage || "";
  if (/cancel/i.test(message)) return "Purchase cancelled — nothing was charged.";
  return message || fallback;
}

function renderSubscriptionUI() {
  document.documentElement.dataset.entitlement = subscriptionState.isPro ? "pro" : "free";
  $$(`[data-pro-feature]`).forEach((element) => {
    element.classList.toggle("pro-locked", !subscriptionState.isPro);
  });

  const price = subscriptionState.displayPrice || "£2.99";
  $("#subscribe-price").textContent = `${price}/year`;
  $("#subscription-setting-value").textContent = subscriptionState.isPro ? "Active" : `${price}/year`;
  $("#subscription-setting-copy").textContent = subscriptionState.isPro
    ? "All advanced training is unlocked"
    : "Longer drills, Rapid Flash and Casino";
  $("#subscription-open").setAttribute("aria-label", subscriptionState.isPro ? "Counted Pro active, view subscription" : "View Counted Pro");
  $("#manage-subscription").hidden = !subscriptionState.isPro;
  $("#subscribe-button").disabled = subscriptionState.isPro;
  $("#subscribe-button span").textContent = subscriptionState.isPro ? "Counted Pro is active" : "Start Counted Pro";

  if (!subscriptionState.isPro && sessionLength !== 20) {
    sessionLength = 20;
    $$(`[data-length]`).forEach((item) => item.classList.toggle("active", item.dataset.length === "20"));
  }
}

function setPaywallScrollLock(locked) {
  if (locked) {
    if (document.body.classList.contains("paywall-open")) return;
    paywallScrollPosition = window.scrollY;
    document.documentElement.classList.add("paywall-open");
    document.body.classList.add("paywall-open");
    document.body.style.setProperty("--paywall-scroll-offset", `-${paywallScrollPosition}px`);
    return;
  }

  if (!document.body.classList.contains("paywall-open")) return;
  document.documentElement.classList.remove("paywall-open");
  document.body.classList.remove("paywall-open");
  document.body.style.removeProperty("--paywall-scroll-offset");
  window.scrollTo(0, paywallScrollPosition);
}

function showPaywall(requestedFeature = "") {
  const featureNames = { flash: "Rapid Flash", casino: "Casino", practice: "longer practice sessions" };
  const feature = featureNames[requestedFeature];
  $("#purchase-feedback").textContent = feature ? `${feature} is included with Counted Pro.` : "";
  if (!$("#paywall-dialog").open) {
    setPaywallScrollLock(true);
    $("#paywall-dialog").showModal();
  }
  playSound("tap");
}

async function refreshSubscriptionStatus() {
  const plugin = subscriptionPlugin();
  if (!plugin) {
    subscriptionState = { ...subscriptionState, ready: true };
    renderSubscriptionUI();
    return;
  }

  try {
    const status = await plugin.getStatus();
    subscriptionState = { ...subscriptionState, ...status, ready: true };
  } catch (error) {
    subscriptionState = { ...subscriptionState, ready: true };
    showAppToast(subscriptionErrorMessage(error, "Counted Pro status could not be refreshed."));
  }
  renderSubscriptionUI();
}

async function purchaseSubscription() {
  const plugin = subscriptionPlugin();
  if (!plugin) {
    $("#purchase-feedback").textContent = "Subscriptions are purchased in the Counted iPhone app.";
    return;
  }
  if (!subscriptionState.productAvailable) {
    $("#purchase-feedback").textContent = "The local StoreKit product is unavailable. Run Counted from the supplied Xcode scheme to test it.";
    return;
  }

  const button = $("#subscribe-button");
  button.disabled = true;
  $("#purchase-feedback").textContent = "Opening Apple’s purchase sheet…";
  try {
    const status = await plugin.purchase();
    subscriptionState = { ...subscriptionState, ...status, ready: true };
    renderSubscriptionUI();
    $("#purchase-feedback").textContent = subscriptionState.isPro ? "Counted Pro is unlocked." : "The purchase is still pending.";
  } catch (error) {
    $("#purchase-feedback").textContent = subscriptionErrorMessage(error, "The purchase could not be completed.");
    button.disabled = subscriptionState.isPro;
  }
}

async function restorePurchases() {
  const plugin = subscriptionPlugin();
  if (!plugin) {
    $("#purchase-feedback").textContent = "Restore is available in the Counted iPhone app.";
    return;
  }
  $("#purchase-feedback").textContent = "Checking your Apple Account…";
  try {
    const status = await plugin.restore();
    subscriptionState = { ...subscriptionState, ...status, ready: true };
    renderSubscriptionUI();
    $("#purchase-feedback").textContent = subscriptionState.isPro ? "Counted Pro has been restored." : "No active Counted Pro subscription was found.";
  } catch (error) {
    $("#purchase-feedback").textContent = subscriptionErrorMessage(error, "Purchases could not be restored.");
  }
}

async function manageSubscription() {
  const plugin = subscriptionPlugin();
  if (!plugin) return;
  try {
    await plugin.manageSubscriptions();
  } catch (error) {
    $("#purchase-feedback").textContent = subscriptionErrorMessage(error, "Subscription settings could not be opened.");
  }
}

async function initializeSubscription() {
  const plugin = subscriptionPlugin();
  if (plugin?.addListener) {
    plugin.addListener("subscriptionChanged", (status) => {
      subscriptionState = { ...subscriptionState, ...status, ready: true };
      renderSubscriptionUI();
    });
  }
  await refreshSubscriptionStatus();
}

function applyTheme(theme, persist = true) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = theme;
  $("#theme-toggle").setAttribute("aria-pressed", String(isDark));
  $("#theme-toggle").setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  $("#theme-setting-value").textContent = isDark ? "Dark" : "Light";
  $("#theme-color").setAttribute("content", isDark ? "#081611" : "#f3f0e8");
  if (persist) localStorage.setItem("counted-theme", theme);
}

function renderStrategyChart(type = "hard") {
  const chart = basicStrategy[type];
  const table = $("#strategy-chart");
  if (!table || !chart) return;

  table.setAttribute("aria-labelledby", `${type}-tab`);
  table.innerHTML = `
    <caption class="sr-only">${type} basic strategy chart for dealer upcards 2 through ace</caption>
    <thead><tr><th scope="col">Your hand</th>${dealerCards.map((card) => `<th scope="col">${card}</th>`).join("")}</tr></thead>
    <tbody>${chart.rows.map(([hand, actions]) => `
      <tr><th scope="row">${hand}</th>${[...actions].map((action) => {
        const detail = strategyActions[action];
        return `<td class="${detail.className}" title="${detail.label}" aria-label="${detail.label}">${action}</td>`;
      }).join("")}</tr>
    `).join("")}</tbody>`;
}

function renderTrueCountScenario() {
  window.clearTimeout(trueCountTimer);
  trueCountLocked = false;
  const scenario = trueCountScenarios[trueCountIndex];
  $("#lab-running-count").textContent = signedCount(scenario.running);
  $("#lab-decks").textContent = scenario.decks;
  $("#true-count-feedback").textContent = "Choose an answer.";
  $("#true-count-feedback").className = "true-count-feedback";

  const options = [scenario.answer - 1, scenario.answer, scenario.answer + 1].sort(() => Math.random() - .5);
  $("#true-count-options").innerHTML = options.map((value) => `<button data-true-count-answer="${value}">${signedCount(value)}</button>`).join("");
}

function answerTrueCount(value) {
  if (trueCountLocked) return;
  trueCountLocked = true;
  const scenario = trueCountScenarios[trueCountIndex];
  const isCorrect = value === scenario.answer;
  trueCountStreak = isCorrect ? trueCountStreak + 1 : 0;
  progress.trueCountBestStreak = Math.max(progress.trueCountBestStreak, trueCountStreak);
  $("#true-count-streak").textContent = trueCountStreak;

  $$(`[data-true-count-answer]`).forEach((button) => {
    const buttonValue = Number(button.dataset.trueCountAnswer);
    button.disabled = true;
    if (buttonValue === scenario.answer) button.classList.add("correct");
    else if (buttonValue === value) button.classList.add("wrong");
  });

  const feedback = $("#true-count-feedback");
  feedback.textContent = isCorrect ? "Correct — keep converting." : `${signedCount(scenario.running)} ÷ ${scenario.decks} = ${signedCount(scenario.answer)}.`;
  feedback.className = `true-count-feedback ${isCorrect ? "correct" : "wrong"}`;
  playSound(isCorrect ? "correct" : "wrong");
  awardXP(isCorrect ? 6 : 1);
  if (navigator.vibrate) navigator.vibrate(isCorrect ? 20 : [25, 35, 25]);

  trueCountTimer = window.setTimeout(() => {
    trueCountIndex = (trueCountIndex + 1) % trueCountScenarios.length;
    renderTrueCountScenario();
  }, 1050);
}

function showAppToast(message, duration = 3200) {
  window.clearTimeout(appToastTimer);
  $("#app-toast-copy").textContent = message;
  $("#app-toast").hidden = false;
  appToastTimer = window.setTimeout(() => { $("#app-toast").hidden = true; }, duration);
}

function isStandaloneApp() {
  return window.Capacitor?.isNativePlatform?.() === true
    || window.location.protocol === "capacitor:"
    || window.matchMedia("(display-mode: standalone)").matches
    || window.navigator.standalone === true;
}

async function requestScreenWakeLock() {
  const activeTraining = (casinoPlaying && !casinoPaused) || (flashPlaying && !flashPaused);
  if (!("wakeLock" in navigator) || document.visibilityState !== "visible" || !activeTraining) return;
  try {
    screenWakeLock = await navigator.wakeLock.request("screen");
    screenWakeLock.addEventListener("release", () => { screenWakeLock = null; });
  } catch { screenWakeLock = null; }
}

async function releaseScreenWakeLock() {
  if (!screenWakeLock) return;
  try { await screenWakeLock.release(); } catch { /* The browser may have released it already. */ }
  screenWakeLock = null;
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (!saved) return structuredClone(defaultProgress);
    const merged = {
      ...defaultProgress,
      ...saved,
      groups: { ...defaultProgress.groups, ...saved.groups },
      dailyGoal: { ...defaultProgress.dailyGoal, ...saved.dailyGoal },
      sessionDays: { ...defaultProgress.sessionDays, ...saved.sessionDays },
    };
    const savedSessions = Array.isArray(saved.sessions) ? saved.sessions : [];
    if (!Number.isFinite(saved.practiceSessions)) merged.practiceSessions = savedSessions.length;
    if (!Number.isFinite(saved.perfectTwentySessions)) merged.perfectTwentySessions = savedSessions.filter((session) => session.cards === 20 && session.accuracy === 100).length;
    if (!Number.isFinite(saved.perfectFullDeckSessions)) merged.perfectFullDeckSessions = savedSessions.filter((session) => session.cards === 52 && session.accuracy === 100).length;
    if (!saved.sessionDays) {
      merged.sessionDays = savedSessions.reduce((days, session) => {
        const day = new Date(session.date).toISOString().slice(0, 10);
        days[day] = (days[day] || 0) + 1;
        return days;
      }, {});
      merged.maxSessionsInDay = Math.max(0, ...Object.values(merged.sessionDays));
    }
    if (!Number.isFinite(saved.nightSessions)) {
      merged.nightSessions = savedSessions.filter((session) => {
        const hour = new Date(session.date).getHours();
        return hour >= 22 || hour < 4;
      }).length;
    }
    if (!Number.isFinite(saved.xp)) {
      merged.xp = (saved.totalCards || 0) * 2 + (saved.sessions?.length || 0) * 40 + (saved.flashSessions || 0) * 90;
    }
    if (merged.dailyGoal.date !== todayKey()) merged.dailyGoal = { date: todayKey(), xp: 0 };
    return merged;
  } catch {
    return structuredClone(defaultProgress);
  }
}

function saveProgress() {
  localStorage.setItem(storageKey, JSON.stringify(progress));
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function levelFromXP(xp) {
  let level = 1;
  levelThresholds.forEach((threshold, index) => {
    if (xp >= threshold) level = index + 1;
  });
  return level;
}

function rankForLevel(level) {
  return [...rankMilestones].reverse().find((rank) => level >= rank.level) || rankMilestones[0];
}

function awardXP(amount) {
  const previousLevel = levelFromXP(progress.xp);
  if (progress.dailyGoal.date !== todayKey()) progress.dailyGoal = { date: todayKey(), xp: 0 };
  progress.xp += amount;
  progress.dailyGoal.xp += amount;
  saveProgress();
  renderProgression();

  const nextLevel = levelFromXP(progress.xp);
  if (nextLevel > previousLevel) showAppToast(`Level ${nextLevel} unlocked — ${rankForLevel(nextLevel).title}.`, 4400);
}

function getValue(rank) {
  return CountedCore.hiLoValue(rank);
}

function getGroup(rank) {
  return CountedCore.hiLoGroup(rank);
}

function makeDeck() {
  const cards = suits.flatMap((suit) => ranks.map((rank) => ({ rank, suit })));
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards.slice(0, sessionLength);
}

function loadCasinoSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(casinoSettingsKey));
    if (!saved) return { ...defaultCasinoSettings };
    return {
      autoPlayers: [0, 1, 2, 3].includes(Number(saved.autoPlayers)) ? Number(saved.autoPlayers) : defaultCasinoSettings.autoPlayers,
      decks: [1, 2, 6, 8].includes(Number(saved.decks)) ? Number(saved.decks) : defaultCasinoSettings.decks,
      soft17: saved.soft17 === "hit" ? "hit" : "stand",
      doubleAfterSplit: saved.doubleAfterSplit !== false,
      surrender: saved.surrender !== false,
    };
  } catch {
    return { ...defaultCasinoSettings };
  }
}

function saveCasinoSettings() {
  try { localStorage.setItem(casinoSettingsKey, JSON.stringify(casinoSettings)); } catch { /* Rules remain in memory. */ }
}

function makeCasinoDeck() {
  const cards = Array.from({ length: casinoSettings.decks }, () => suits.flatMap((suit) => ranks.map((rank) => ({ rank, suit })))).flat();
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

function makeFlashDeck() {
  const cards = Array.from({ length: flashStartingDecks }, () => suits.flatMap((suit) => ranks.map((rank) => ({ rank, suit })))).flat();
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards.slice(0, 30);
}

function signedCount(value) {
  return value > 0 ? `+${value}` : String(value);
}

function casinoRankValue(rank) {
  if (rank === "A") return 11;
  return ["10", "J", "Q", "K"].includes(rank) ? 10 : Number(rank);
}

function casinoHandValue(cards) {
  let total = cards.reduce((sum, card) => sum + casinoRankValue(card.rank), 0);
  let aces = cards.filter((card) => card.rank === "A").length;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return { total, soft: aces > 0 };
}

function makeCasinoHand(cards = [], fromSplit = false) {
  return { cards, fromSplit, status: "", outcome: "", doubled: false };
}

function makeCasinoSeat(name, isUser = false) {
  return { name, isUser, hands: [makeCasinoHand()] };
}

function drawCasinoCard(visible = true) {
  const source = casinoShoe[casinoShoeIndex];
  if (!source) return null;
  casinoShoeIndex += 1;
  const card = { ...source, hidden: !visible, counted: visible, isNew: true };
  if (visible) casinoRunningCount += getValue(card.rank);
  return card;
}

function revealCasinoCard(card) {
  if (!card || !card.hidden) return;
  card.hidden = false;
  card.isNew = true;
  if (!card.counted) {
    casinoRunningCount += getValue(card.rank);
    card.counted = true;
  }
}

function casinoCardMarkup(card) {
  if (card.hidden) return `<span class="table-card back${card.isNew ? " deal-in" : ""}" aria-label="Face-down card"><i>♠</i></span>`;
  const red = card.suit === "♥" || card.suit === "♦";
  return `<span class="table-card${red ? " red" : ""}${card.isNew ? " deal-in" : ""}" aria-label="${card.rank} of ${card.suit}"><strong>${card.rank}</strong><span>${card.suit}</span></span>`;
}

function casinoHandStatus(hand) {
  if (hand.outcome) return hand.outcome;
  if (hand.status === "surrendered") return "Surrender";
  if (hand.status === "blackjack") return "Blackjack";
  const value = casinoHandValue(hand.cards);
  if (value.total > 21) return "Bust";
  return hand.cards.length ? `${value.total}${value.soft ? " soft" : ""}` : "—";
}

function renderCasinoTable() {
  const visibleDealerCards = casinoDealerHand.filter((card) => !card.hidden);
  const dealerValue = casinoHandValue(visibleDealerCards);
  $("#casino-dealer-total").textContent = visibleDealerCards.length ? `${dealerValue.total}${casinoDealerHand.some((card) => card.hidden) ? "+?" : ""}` : "—";
  $("#casino-dealer-hand").innerHTML = casinoDealerHand.length
    ? casinoDealerHand.map(casinoCardMarkup).join("")
    : '<span class="table-card back" aria-label="Face-down card"><i>♠</i></span>';

  const seats = casinoSeats.length ? casinoSeats : [makeCasinoSeat("You", true)];
  $("#casino-seats").style.setProperty("--seat-count", seats.length);
  $("#casino-seats").dataset.seatCount = String(seats.length);
  $("#casino-seats").innerHTML = seats.map((seat) => {
    const hands = seat.hands.map((hand, index) => {
      const active = seat.isUser && casinoPhase === "player" && index === casinoUserHandIndex;
      return `<div class="seat-hand${active ? " active" : ""}"><div class="table-hand">${hand.cards.length ? hand.cards.map(casinoCardMarkup).join("") : '<span class="table-card back"><i>♠</i></span>'}</div><small>${casinoHandStatus(hand)}</small></div>`;
    }).join("");
    const outcomes = seat.hands.map((hand) => hand.outcome).filter(Boolean).join(" · ");
    return `<div class="casino-seat${seat.isUser ? " user-seat" : " auto-seat"}${casinoSeats.length ? "" : " idle-seat"}"><span>${seat.name}</span><div class="seat-hands">${hands}</div><div class="casino-outcome">${outcomes}</div></div>`;
  }).join("");

  casinoDealerHand.forEach((card) => { card.isNew = false; });
  casinoSeats.forEach((seat) => seat.hands.forEach((hand) => hand.cards.forEach((card) => { card.isNew = false; })));
  updateCasinoUI();
}

function updateCasinoUI() {
  const decksLeft = casinoShoe.length ? Math.max(0, (casinoShoe.length - casinoShoeIndex) / 52) : casinoSettings.decks;
  $("#casino-round").textContent = casinoRound;
  $("#casino-shoe-depth").textContent = `${decksLeft.toFixed(1)}d`;
  $("#casino-record").textContent = `${casinoWins}–${casinoLosses}–${casinoPushes}`;
}

function setCasinoControlsDisabled(disabled) {
  ["#casino-minus", "#casino-plus", "#casino-count-input", ".casino-submit"].forEach((selector) => { $(selector).disabled = disabled; });
}

function casinoWait(multiplier = .38, token = casinoRunToken) {
  window.clearTimeout(casinoTimer);
  return new Promise((resolve) => {
    casinoTimer = window.setTimeout(() => resolve(token === casinoRunToken), Math.max(110, Math.round(casinoSpeed * multiplier)));
  });
}

function activeCasinoPace() {
  return casinoPaceProfiles[casinoPace];
}

function renderCasinoPaceUI() {
  const profile = activeCasinoPace();
  casinoSpeed = profile.speed;
  $$(`[data-casino-pace]`).forEach((button) => button.classList.toggle("active", button.dataset.casinoPace === casinoPace));
}

function clearCasinoDecisionTimer() {
  window.clearInterval(casinoDecisionTimer);
  casinoDecisionTimer = null;
  casinoDecisionSecondsRemaining = 0;
  const clock = $("#casino-decision-clock");
  clock.hidden = true;
  clock.classList.remove("urgent");
}

function updateCasinoDecisionClock() {
  const clock = $("#casino-decision-clock");
  const total = activeCasinoPace().decisionSeconds;
  $("#casino-decision-seconds").textContent = casinoDecisionSecondsRemaining;
  clock.style.setProperty("--decision-progress", `${total ? (casinoDecisionSecondsRemaining / total) * 100 : 0}%`);
  clock.classList.toggle("urgent", casinoDecisionSecondsRemaining <= 3);
}

function startCasinoDecisionTimer() {
  clearCasinoDecisionTimer();
  const seconds = activeCasinoPace().decisionSeconds;
  if (!seconds || casinoPhase !== "player") return;
  casinoDecisionSecondsRemaining = seconds;
  $("#casino-decision-clock").hidden = false;
  updateCasinoDecisionClock();
  casinoDecisionTimer = window.setInterval(() => {
    if (casinoPhase !== "player" || casinoActionLocked) {
      clearCasinoDecisionTimer();
      return;
    }
    casinoDecisionSecondsRemaining = CountedCore.nextDecisionSeconds(casinoDecisionSecondsRemaining);
    updateCasinoDecisionClock();
    if (CountedCore.hasDecisionTimedOut(casinoDecisionSecondsRemaining)) {
      clearCasinoDecisionTimer();
      handleCasinoDecisionTimeout();
    }
  }, 1000);
}

async function handleCasinoDecisionTimeout() {
  if (casinoPhase !== "player" || casinoActionLocked) return;
  const hand = casinoUserSeat?.hands[casinoUserHandIndex];
  if (!hand) return;
  casinoActionLocked = true;
  hand.status = "stand";
  $("#casino-status").textContent = "Time up · auto stand";
  $("#casino-round-message").textContent = "Pit Boss called time. Your hand stands automatically.";
  playSound("wrong");
  if (navigator.vibrate) navigator.vibrate([35, 30, 35]);
  casinoActionLocked = false;
  casinoUserHandIndex += 1;
  renderCasinoTable();
  await beginCasinoPlayerTurn(casinoRunToken);
}

async function dealCasinoCardTo(cards, visible, token) {
  const card = drawCasinoCard(visible);
  if (!card || token !== casinoRunToken) return false;
  cards.push(card);
  renderCasinoTable();
  playSound("deal");
  return casinoWait(.38, token);
}

function canCasinoSplit(hand, seat) {
  if (hand.cards.length !== 2 || seat.hands.length >= 4) return false;
  return casinoRankValue(hand.cards[0].rank) === casinoRankValue(hand.cards[1].rank);
}

function canCasinoDouble(hand) {
  return hand.cards.length === 2 && (!hand.fromSplit || casinoSettings.doubleAfterSplit);
}

function autoCasinoDecision(hand, dealerCard, seat) {
  const dealer = casinoRankValue(dealerCard.rank);
  const value = casinoHandValue(hand.cards);
  const pair = canCasinoSplit(hand, seat) ? casinoRankValue(hand.cards[0].rank) : 0;
  if (casinoSettings.surrender && !hand.fromSplit && hand.cards.length === 2 && ((value.total === 16 && dealer >= 9) || (value.total === 15 && dealer === 10))) return "surrender";
  if (pair === 11 || pair === 8) return "split";
  if (pair === 10) return "stand";
  if (pair === 9) return [2, 3, 4, 5, 6, 8, 9].includes(dealer) ? "split" : "stand";
  if (pair === 7 && dealer <= 7) return "split";
  if (pair === 6 && dealer <= 6 && (casinoSettings.doubleAfterSplit || dealer >= 3)) return "split";
  if ((pair === 2 || pair === 3) && dealer <= 7 && (casinoSettings.doubleAfterSplit || dealer >= 4)) return "split";
  if (pair === 4 && casinoSettings.doubleAfterSplit && [5, 6].includes(dealer)) return "split";
  if (value.soft) {
    if (value.total >= 19) return "stand";
    if (value.total === 18) return canCasinoDouble(hand) && dealer >= 3 && dealer <= 6 ? "double" : dealer <= 8 ? "stand" : "hit";
    if (value.total === 17) return canCasinoDouble(hand) && dealer >= 3 && dealer <= 6 ? "double" : "hit";
    if (value.total >= 15) return canCasinoDouble(hand) && dealer >= 4 && dealer <= 6 ? "double" : "hit";
    return canCasinoDouble(hand) && dealer >= 5 && dealer <= 6 ? "double" : "hit";
  }
  if (value.total >= 17) return "stand";
  if (value.total >= 13) return dealer <= 6 ? "stand" : "hit";
  if (value.total === 12) return dealer >= 4 && dealer <= 6 ? "stand" : "hit";
  if (value.total === 11) return canCasinoDouble(hand) && dealer <= 10 ? "double" : "hit";
  if (value.total === 10) return canCasinoDouble(hand) && dealer <= 9 ? "double" : "hit";
  if (value.total === 9) return canCasinoDouble(hand) && dealer >= 3 && dealer <= 6 ? "double" : "hit";
  return "hit";
}

async function splitCasinoHand(seat, index, token) {
  const original = seat.hands[index];
  const first = makeCasinoHand([original.cards[0]], true);
  const second = makeCasinoHand([original.cards[1]], true);
  seat.hands.splice(index, 1, first, second);
  renderCasinoTable();
  if (!await dealCasinoCardTo(first.cards, true, token)) return false;
  if (!await dealCasinoCardTo(second.cards, true, token)) return false;
  if (first.cards[0].rank === "A") {
    first.status = "stand";
    second.status = "stand";
    renderCasinoTable();
  }
  return true;
}

async function playAutomaticCasinoSeat(seat, token) {
  for (let index = 0; index < seat.hands.length && token === casinoRunToken; index += 1) {
    let hand = seat.hands[index];
    while (!hand.status && token === casinoRunToken) {
      const value = casinoHandValue(hand.cards);
      if (value.total > 21) { hand.status = "bust"; break; }
      if (value.total === 21) { hand.status = "stand"; break; }
      const action = autoCasinoDecision(hand, casinoDealerHand[0], seat);
      if (action === "split") {
        if (!await splitCasinoHand(seat, index, token)) return;
        hand = seat.hands[index];
      } else if (action === "double") {
        hand.doubled = true;
        if (!await dealCasinoCardTo(hand.cards, true, token)) return;
        hand.status = casinoHandValue(hand.cards).total > 21 ? "bust" : "stand";
      } else if (action === "hit") {
        if (!await dealCasinoCardTo(hand.cards, true, token)) return;
      } else {
        hand.status = action === "surrender" ? "surrendered" : "stand";
      }
      renderCasinoTable();
    }
  }
}

function casinoDealerShouldHit() {
  const value = casinoHandValue(casinoDealerHand);
  return value.total < 17 || (value.total === 17 && value.soft && casinoSettings.soft17 === "hit");
}

function updateCasinoActions() {
  const hand = casinoUserSeat?.hands[casinoUserHandIndex];
  const actions = $("#casino-actions");
  if (!hand || casinoPhase !== "player") {
    actions.hidden = true;
    return;
  }
  actions.hidden = false;
  $(".casino-round-bar").hidden = true;
  const doubleButton = $('[data-casino-action="double"]');
  const splitButton = $('[data-casino-action="split"]');
  const surrenderButton = $('[data-casino-action="surrender"]');
  doubleButton.disabled = !canCasinoDouble(hand) || casinoActionLocked;
  splitButton.disabled = !canCasinoSplit(hand, casinoUserSeat) || casinoActionLocked;
  surrenderButton.hidden = !casinoSettings.surrender;
  surrenderButton.disabled = hand.fromSplit || hand.cards.length !== 2 || casinoActionLocked;
  actions.style.setProperty("--action-count", casinoSettings.surrender ? 5 : 4);
  $$('[data-casino-action="hit"], [data-casino-action="stand"]').forEach((button) => { button.disabled = casinoActionLocked; });
}

async function beginCasinoPlayerTurn(token = casinoRunToken) {
  if (token !== casinoRunToken) return;
  const next = casinoUserSeat.hands.findIndex((hand, index) => index >= casinoUserHandIndex && !hand.status);
  if (next === -1) {
    await playCasinoDealer(token);
    return;
  }
  casinoUserHandIndex = next;
  casinoPhase = "player";
  $("#casino-status").textContent = casinoUserSeat.hands.length > 1 ? `Your hand ${next + 1}` : "Your decision";
  $("#casino-round-message").textContent = "Choose the correct blackjack action while holding the count.";
  renderCasinoTable();
  updateCasinoActions();
  startCasinoDecisionTimer();
}

async function handleCasinoAction(action) {
  if (casinoPhase !== "player" || casinoActionLocked) return;
  const hand = casinoUserSeat.hands[casinoUserHandIndex];
  if (!hand) return;
  if (action === "double" && !canCasinoDouble(hand)) return;
  if (action === "split" && !canCasinoSplit(hand, casinoUserSeat)) return;
  if (action === "surrender" && (!casinoSettings.surrender || hand.fromSplit || hand.cards.length !== 2)) return;

  clearCasinoDecisionTimer();
  casinoActionLocked = true;
  updateCasinoActions();
  const token = casinoRunToken;
  if (action === "hit") {
    await dealCasinoCardTo(hand.cards, true, token);
    const total = casinoHandValue(hand.cards).total;
    if (total >= 21) hand.status = total > 21 ? "bust" : "stand";
  } else if (action === "stand") {
    hand.status = "stand";
  } else if (action === "double") {
    hand.doubled = true;
    progress.casinoDoubles += 1;
    saveProgress();
    await dealCasinoCardTo(hand.cards, true, token);
    hand.status = casinoHandValue(hand.cards).total > 21 ? "bust" : "stand";
  } else if (action === "split") {
    progress.casinoSplits += 1;
    saveProgress();
    await splitCasinoHand(casinoUserSeat, casinoUserHandIndex, token);
  } else if (action === "surrender") {
    hand.status = "surrendered";
  }
  casinoActionLocked = false;
  renderCasinoTable();
  if (action === "split" && !casinoUserSeat.hands[casinoUserHandIndex].status) {
    updateCasinoActions();
    startCasinoDecisionTimer();
  } else if (casinoUserSeat.hands[casinoUserHandIndex].status) {
    casinoUserHandIndex += 1;
    await beginCasinoPlayerTurn(token);
  } else {
    updateCasinoActions();
    startCasinoDecisionTimer();
  }
  playSound("tap");
}

function resolveCasinoHands() {
  const dealer = casinoHandValue(casinoDealerHand);
  const dealerBlackjack = dealer.total === 21 && casinoDealerHand.length === 2;
  casinoSeats.forEach((seat) => seat.hands.forEach((hand) => {
    const value = casinoHandValue(hand.cards);
    const blackjack = value.total === 21 && hand.cards.length === 2 && !hand.fromSplit;
    if (hand.status === "surrendered") hand.outcome = "Surrender";
    else if (value.total > 21) hand.outcome = "Loss";
    else if (dealerBlackjack) hand.outcome = blackjack ? "Push" : "Loss";
    else if (blackjack) hand.outcome = "Blackjack";
    else if (dealer.total > 21 || value.total > dealer.total) hand.outcome = "Win";
    else if (value.total < dealer.total) hand.outcome = "Loss";
    else hand.outcome = "Push";
  }));
}

function finishCasinoRound() {
  clearCasinoDecisionTimer();
  resolveCasinoHands();
  const naturalBlackjacks = casinoUserSeat.hands.filter((hand) => hand.outcome === "Blackjack").length;
  if (naturalBlackjacks) {
    progress.casinoBlackjacks += naturalBlackjacks;
    saveProgress();
  }
  casinoPhase = "round-end";
  casinoCompletedRounds += 1;
  $("#casino-actions").hidden = true;
  casinoUserSeat.hands.forEach((hand) => {
    if (["Win", "Blackjack"].includes(hand.outcome)) casinoWins += 1;
    else if (hand.outcome === "Push") casinoPushes += 1;
    else casinoLosses += 1;
  });
  casinoCheckDue = casinoRound % activeCasinoPace().checkpointEvery === 0 || casinoShoeIndex >= casinoCutIndex;
  const summary = casinoUserSeat.hands.map((hand) => hand.outcome).join(" · ");
  $("#casino-status").textContent = "Round complete";
  $(".casino-live").classList.remove("dealing");
  $(".casino-round-bar").hidden = false;
  $("#casino-round-message").textContent = summary || "Round complete.";
  $("#casino-next-round").hidden = false;
  $("#casino-next-round").innerHTML = casinoCheckDue ? `Count check <span>→</span>` : `Next hand <span>→</span>`;
  renderCasinoTable();
}

async function playCasinoDealer(token) {
  if (token !== casinoRunToken) return;
  clearCasinoDecisionTimer();
  casinoPhase = "dealer";
  $("#casino-actions").hidden = true;
  $(".casino-round-bar").hidden = false;
  $("#casino-round-message").textContent = "Dealer reveals and completes the hand.";
  $("#casino-status").textContent = "Dealer plays";
  revealCasinoCard(casinoDealerHand[1]);
  renderCasinoTable();
  playSound("deal");
  if (!await casinoWait(.5, token)) return;

  const liveHands = casinoSeats.some((seat) => seat.hands.some((hand) => !["bust", "surrendered"].includes(hand.status)));
  while (liveHands && casinoDealerShouldHit() && token === casinoRunToken) {
    if (!await dealCasinoCardTo(casinoDealerHand, true, token)) return;
  }
  finishCasinoRound();
}

async function startCasinoRound() {
  const token = casinoRunToken;
  if (!casinoPlaying || token !== casinoRunToken) return;
  clearCasinoDecisionTimer();
  if (casinoShoeIndex >= casinoCutIndex) {
    finishCasinoShoe();
    return;
  }

  casinoRound += 1;
  casinoPhase = "dealing";
  casinoDealerHand = [];
  casinoSeats = Array.from({ length: casinoSettings.autoPlayers }, (_, index) => makeCasinoSeat(`Player ${index + 1}`));
  casinoUserSeat = makeCasinoSeat("You", true);
  casinoSeats.push(casinoUserSeat);
  casinoUserHandIndex = 0;
  casinoActionLocked = false;
  casinoCheckDue = false;
  $("#casino-count-prompt").hidden = true;
  $("#casino-actions").hidden = true;
  $(".casino-round-bar").hidden = false;
  $("#casino-next-round").hidden = true;
  $("#casino-round-message").textContent = "Cards are moving. Count every exposed card.";
  $("#casino-status").textContent = "Dealing round";
  $(".casino-live").classList.add("dealing");
  renderCasinoTable();

  for (let pass = 0; pass < 2 && token === casinoRunToken; pass += 1) {
    for (const seat of casinoSeats) {
      if (!await dealCasinoCardTo(seat.hands[0].cards, true, token)) return;
    }
    if (!await dealCasinoCardTo(casinoDealerHand, pass === 0, token)) return;
  }

  casinoSeats.forEach((seat) => {
    const value = casinoHandValue(seat.hands[0].cards);
    if (value.total === 21) seat.hands[0].status = "blackjack";
  });
  const dealerNatural = casinoHandValue(casinoDealerHand).total === 21;
  if (dealerNatural) {
    await playCasinoDealer(token);
    return;
  }
  for (const seat of casinoSeats.filter((seat) => !seat.isUser)) {
    await playAutomaticCasinoSeat(seat, token);
    if (token !== casinoRunToken) return;
  }
  await beginCasinoPlayerTurn(token);
}

function startCasinoShoe() {
  if (!subscriptionState.isPro) {
    showPaywall("casino");
    return;
  }
  casinoRunToken += 1;
  window.clearTimeout(casinoTimer);
  clearCasinoDecisionTimer();
  casinoShoe = makeCasinoDeck();
  casinoShoeIndex = 0;
  casinoCutIndex = Math.floor(casinoShoe.length * .75);
  casinoRunningCount = 0;
  casinoRound = 0;
  casinoCompletedRounds = 0;
  casinoWins = 0;
  casinoLosses = 0;
  casinoPushes = 0;
  casinoCheckpoints = 0;
  casinoCorrect = 0;
  casinoPlaying = true;
  casinoPaused = false;
  casinoAwaitingCount = false;
  casinoSubmitting = false;
  casinoPhase = "dealing";
  $("#casino-result-dialog").open && $("#casino-result-dialog").close();
  $("#casino-count-prompt").hidden = true;
  $("#casino-rules-open").disabled = true;
  $$(`[data-casino-pace]`).forEach((button) => { button.disabled = true; });
  $("#casino-end").disabled = false;
  $("#casino-start span").textContent = "New shoe";
  $("#casino-start").setAttribute("aria-label", "Start a new shoe");
  playSound("start");
  requestScreenWakeLock();
  updateCasinoUI();
  startCasinoRound();
}

function showCasinoCountPrompt() {
  if (!casinoPlaying || !casinoCheckDue) return;
  clearCasinoDecisionTimer();
  casinoAwaitingCount = true;
  casinoPhase = "count";
  $("#casino-count-input").value = "0";
  $("#casino-prompt-copy").textContent = `Round ${casinoRound} is complete with ${((casinoShoe.length - casinoShoeIndex) / 52).toFixed(1)} decks left.`;
  $("#casino-prompt-feedback").textContent = "";
  $("#casino-prompt-feedback").classList.remove("wrong");
  setCasinoControlsDisabled(false);
  $("#casino-count-prompt").hidden = false;
  $("#casino-count-input").focus();
  $("#casino-count-input").select();
}

function advanceCasinoRound() {
  if (!casinoPlaying || casinoPhase !== "round-end") return;
  if (casinoCheckDue) showCasinoCountPrompt();
  else startCasinoRound();
}

function adjustCasinoCount(delta) {
  const input = $("#casino-count-input");
  input.value = Math.max(-100, Math.min(100, Number(input.value || 0) + delta));
}

function finishCasinoShoe() {
  if (!casinoPlaying) return;
  casinoRunToken += 1;
  casinoPlaying = false;
  casinoAwaitingCount = false;
  casinoPhase = "complete";
  window.clearTimeout(casinoTimer);
  clearCasinoDecisionTimer();
  $("#casino-count-prompt").hidden = true;
  $("#casino-actions").hidden = true;
  $(".casino-round-bar").hidden = false;
  $("#casino-next-round").hidden = true;
  $("#casino-round-message").textContent = "Shoe complete. Review the session and deal again when ready.";
  $("#casino-status").textContent = "Shoe complete";
  $(".casino-live").classList.remove("dealing");
  $("#casino-end").disabled = true;
  $("#casino-rules-open").disabled = false;
  $$(`[data-casino-pace]`).forEach((button) => { button.disabled = false; });
  $("#casino-start span").textContent = "Deal again";
  $("#casino-start").setAttribute("aria-label", "Deal another shoe");
  releaseScreenWakeLock();
  playSound("complete");

  const accuracy = casinoCheckpoints ? Math.round((casinoCorrect / casinoCheckpoints) * 100) : 0;
  const today = todayKey();
  if (!progress.practiceDates.includes(today)) progress.practiceDates.push(today);
  progress.casinoSessions += 1;
  progress.casinoBestAccuracy = Math.max(progress.casinoBestAccuracy, accuracy);
  if (casinoCheckpoints && accuracy === 100 && casinoSettings.autoPlayers === 3) progress.casinoThreePlayerPerfects += 1;
  awardXP(20 + casinoCorrect * 20 + casinoWins * 3);
  saveProgress();
  renderProgress();

  $("#casino-result-title").textContent = accuracy === 100 && casinoCheckpoints ? "Table sharp." : accuracy >= 67 ? "Strong shoe." : "Stay with the count.";
  $("#casino-result-copy").textContent = `${casinoCompletedRounds} ${casinoCompletedRounds === 1 ? "round" : "rounds"} completed under live table rules. ${casinoCorrect} of ${casinoCheckpoints} count checks correct.`;
  $("#casino-result-accuracy").textContent = casinoCheckpoints ? `${accuracy}%` : "—";
  $("#casino-result-record").textContent = `${casinoWins}–${casinoLosses}–${casinoPushes}`;
  $("#casino-result-dialog").showModal();
}

function submitCasinoCount(event) {
  event.preventDefault();
  if (!casinoAwaitingCount || casinoSubmitting) return;
  casinoSubmitting = true;
  const submitted = Number($("#casino-count-input").value || 0);
  const isCorrect = submitted === casinoRunningCount;
  casinoCheckpoints += 1;
  if (isCorrect) casinoCorrect += 1;

  const feedback = $("#casino-prompt-feedback");
  feedback.textContent = isCorrect ? "Correct. Keep the count." : `The running count is ${signedCount(casinoRunningCount)}.`;
  feedback.classList.toggle("wrong", !isCorrect);
  setCasinoControlsDisabled(true);
  playSound(isCorrect ? "correct" : "wrong");
  awardXP(isCorrect ? 20 : 4);

  casinoTimer = window.setTimeout(() => {
    $("#casino-count-prompt").hidden = true;
    casinoSubmitting = false;
    casinoAwaitingCount = false;
    casinoCheckDue = false;
    if (casinoShoeIndex >= casinoCutIndex) finishCasinoShoe();
    else startCasinoRound();
  }, 900);
}

function renderCasinoSettingsUI() {
  $("#casino-decks").value = String(casinoSettings.decks);
  $$('[data-casino-players]').forEach((button) => button.classList.toggle("active", Number(button.dataset.casinoPlayers) === casinoSettings.autoPlayers));
  $$('[data-casino-soft17]').forEach((button) => button.classList.toggle("active", button.dataset.casinoSoft17 === casinoSettings.soft17));
  $$('[data-casino-das]').forEach((button) => button.classList.toggle("active", (button.dataset.casinoDas === "true") === casinoSettings.doubleAfterSplit));
  $$('[data-casino-surrender]').forEach((button) => button.classList.toggle("active", (button.dataset.casinoSurrender === "true") === casinoSettings.surrender));
  const playerCopy = casinoSettings.autoPlayers === 0 ? "no automatic players" : `${casinoSettings.autoPlayers} automatic ${casinoSettings.autoPlayers === 1 ? "player" : "players"}`;
  $("#casino-rules-open").setAttribute("aria-label", `Open table rules: ${casinoSettings.decks} decks, ${playerCopy}, dealer ${casinoSettings.soft17 === "hit" ? "hits" : "stands"} soft 17`);
  updateCasinoUI();
}

function closeCasinoRules() {
  saveCasinoSettings();
  renderCasinoSettingsUI();
  $("#casino-rules-dialog").close();
  playSound("tap");
}

function getFlashDecksRemaining() {
  const cardsRemaining = Math.max(1, (flashStartingDecks * 52) - flashIndex);
  return Math.max(.5, Math.round(cardsRemaining / 26) / 2);
}

function getFlashTrueCount() {
  return Math.trunc(flashRunningCount / getFlashDecksRemaining());
}

function updateFlashUI() {
  $("#flash-card-number").textContent = flashIndex;
  $("#flash-decks-left").textContent = getFlashDecksRemaining();
  $("#flash-score").textContent = flashCorrect;
  $("#flash-progress-bar").style.width = `${(flashIndex / 30) * 100}%`;
}

function setFlashControlsDisabled(disabled) {
  ["#flash-minus", "#flash-plus", "#flash-count-input", ".flash-submit"].forEach((selector) => {
    $(selector).disabled = disabled;
  });
}

function scheduleFlashCard(delay = flashSpeed) {
  window.clearTimeout(flashTimer);
  if (!flashPlaying || flashPaused || flashAwaitingCount) return;
  flashTimer = window.setTimeout(dealFlashCard, delay);
}

function renderFlashCard(card) {
  [$("#flash-rank-top"), $("#flash-rank-bottom")].forEach((el) => { el.textContent = card.rank; });
  [$("#flash-suit-top"), $("#flash-suit-bottom"), $("#flash-card-suit")].forEach((el) => { el.textContent = card.suit; });
  const cardElement = $("#flash-card");
  cardElement.classList.remove("face-down", "flash-in");
  cardElement.classList.toggle("red", card.suit === "♥" || card.suit === "♦");
  void cardElement.offsetWidth;
  cardElement.classList.add("flash-in");
  if (audioContext) playSound("deal");
}

function showFlashCountPrompt() {
  if (!flashPlaying || !flashAwaitingCount) return;
  $("#flash-count-input").value = "0";
  $("#flash-prompt-decks").textContent = getFlashDecksRemaining();
  $("#flash-prompt-feedback").textContent = "";
  $("#flash-prompt-feedback").classList.remove("wrong");
  setFlashControlsDisabled(false);
  $("#flash-count-prompt").hidden = false;
  $("#flash-count-input").focus();
  $("#flash-count-input").select();
}

function dealFlashCard() {
  if (!flashPlaying || flashPaused || flashAwaitingCount) return;
  const card = flashDeck[flashIndex];
  if (!card) return;

  flashRunningCount += getValue(card.rank);
  renderFlashCard(card);
  flashIndex += 1;
  updateFlashUI();

  if (flashIndex % 10 === 0) {
    flashAwaitingCount = true;
    $("#flash-status").textContent = "True count check";
    $(".flash-live").classList.remove("flashing");
    $("#flash-pause").disabled = true;
    flashTimer = window.setTimeout(showFlashCountPrompt, Math.min(450, flashSpeed / 2));
  } else {
    scheduleFlashCard();
  }
}

function startFlashSprint() {
  if (!subscriptionState.isPro) {
    showPaywall("flash");
    return;
  }
  window.clearTimeout(flashTimer);
  flashStartingDecks = Number($("#flash-decks").value);
  flashDeck = makeFlashDeck();
  flashIndex = 0;
  flashRunningCount = 0;
  flashCheckpoints = 0;
  flashCorrect = 0;
  flashPlaying = true;
  flashPaused = false;
  flashAwaitingCount = false;
  flashSubmitting = false;

  $("#flash-count-prompt").hidden = true;
  $("#flash-paused-overlay").hidden = true;
  $("#flash-card").className = "flash-card face-down";
  $("#flash-status").textContent = "Cards flashing";
  $(".flash-live").classList.add("flashing");
  $("#flash-pause").disabled = false;
  $("#flash-pause").innerHTML = "<span>Ⅱ</span> Pause";
  $("#flash-start span").textContent = "Restart sprint";
  $("#flash-start").setAttribute("aria-label", "Restart sprint");
  $("#flash-decks").disabled = true;
  $$(`[data-flash-speed]`).forEach((button) => { button.disabled = true; });
  updateFlashUI();
  playSound("start");
  requestScreenWakeLock();
  scheduleFlashCard(500);
}

function setFlashPaused(shouldPause) {
  if (!flashPlaying || flashAwaitingCount || flashPaused === shouldPause) return;
  flashPaused = shouldPause;
  window.clearTimeout(flashTimer);
  $("#flash-paused-overlay").hidden = !flashPaused;
  $("#flash-status").textContent = flashPaused ? "Sprint paused" : "Cards flashing";
  $(".flash-live").classList.toggle("flashing", !flashPaused);
  $("#flash-pause").innerHTML = flashPaused ? "<span>▶</span> Resume" : "<span>Ⅱ</span> Pause";
  playSound("tap");
  if (flashPaused) releaseScreenWakeLock();
  else {
    requestScreenWakeLock();
    scheduleFlashCard(350);
  }
}

function adjustFlashCount(delta) {
  const input = $("#flash-count-input");
  input.value = Math.max(-30, Math.min(30, Number(input.value || 0) + delta));
}

function finishFlashSprint() {
  flashPlaying = false;
  flashAwaitingCount = false;
  window.clearTimeout(flashTimer);
  $("#flash-status").textContent = "Sprint complete";
  $(".flash-live").classList.remove("flashing");
  $("#flash-pause").disabled = true;
  $("#flash-decks").disabled = false;
  $$(`[data-flash-speed]`).forEach((button) => { button.disabled = false; });
  $("#flash-start span").textContent = "Sprint again";
  $("#flash-start").setAttribute("aria-label", "Sprint again");
  releaseScreenWakeLock();
  playSound("complete");

  const accuracy = Math.round((flashCorrect / 3) * 100);
  const today = todayKey();
  if (!progress.practiceDates.includes(today)) progress.practiceDates.push(today);
  progress.flashSessions += 1;
  progress.flashBestAccuracy = Math.max(progress.flashBestAccuracy, accuracy);
  if (accuracy === 100 && flashSpeed === 350) progress.flashPitBossPerfects += 1;
  awardXP(accuracy === 100 ? 60 : 25);
  saveProgress();
  renderProgress();

  $("#flash-result-title").textContent = accuracy === 100 ? "Count held at speed." : accuracy >= 67 ? "Nearly automatic." : "Slow it down, then build.";
  $("#flash-result-copy").textContent = accuracy === 100 ? "You converted every checkpoint correctly." : "Own the slower pace before moving the cards faster.";
  $("#flash-result-accuracy").textContent = `${accuracy}%`;
  $("#flash-result-count").textContent = signedCount(flashRunningCount);
  $("#flash-result-dialog").showModal();
}

function submitFlashCount(event) {
  event.preventDefault();
  if (!flashAwaitingCount || flashSubmitting) return;
  flashSubmitting = true;
  const submitted = Number($("#flash-count-input").value || 0);
  const expected = getFlashTrueCount();
  const decksRemaining = getFlashDecksRemaining();
  const isCorrect = submitted === expected;
  flashCheckpoints += 1;
  if (isCorrect) flashCorrect += 1;
  updateFlashUI();

  const feedback = $("#flash-prompt-feedback");
  feedback.textContent = isCorrect ? "Correct. Keep flashing." : `${signedCount(flashRunningCount)} ÷ ${decksRemaining} = ${signedCount(expected)}.`;
  feedback.classList.toggle("wrong", !isCorrect);
  setFlashControlsDisabled(true);
  playSound(isCorrect ? "correct" : "wrong");
  awardXP(isCorrect ? 25 : 5);

  flashTimer = window.setTimeout(() => {
    $("#flash-count-prompt").hidden = true;
    flashSubmitting = false;
    if (flashIndex >= 30) {
      finishFlashSprint();
    } else {
      flashAwaitingCount = false;
      $("#flash-status").textContent = "Cards flashing";
      $(".flash-live").classList.add("flashing");
      $("#flash-pause").disabled = false;
      scheduleFlashCard(450);
    }
  }, 950);
}

function startSession() {
  sessionLength = CountedCore.normalizeSessionLength(sessionLength, subscriptionState.isPro);
  deck = makeDeck();
  cardIndex = 0;
  correct = 0;
  sessionStreak = 0;
  sessionBestStreak = 0;
  runningCount = 0;
  locked = false;
  updateSessionUI();
  renderCard();
}

function renderCard() {
  const card = deck[cardIndex];
  if (!card) return;
  [$("#card-rank-top"), $("#card-rank-bottom")].forEach((el) => { el.textContent = card.rank; });
  [$("#card-suit-top"), $("#card-suit-bottom"), $("#card-pips")].forEach((el) => { el.textContent = card.suit; });
  $("#playing-card").classList.toggle("red", card.suit === "♥" || card.suit === "♦");
  $("#playing-card").classList.remove("dealing");
  void $("#playing-card").offsetWidth;
  $("#playing-card").classList.add("dealing");
  if (audioContext) playSound("deal");
}

function updateSessionUI() {
  const answered = cardIndex;
  $("#card-number").textContent = Math.min(cardIndex + 1, sessionLength);
  $("#card-total").textContent = sessionLength;
  $("#session-progress").style.width = `${(answered / sessionLength) * 100}%`;
  $("#accuracy-value").textContent = answered ? `${Math.round((correct / answered) * 100)}%` : "—";
  $("#streak-value").textContent = sessionStreak;
  $("#running-count").textContent = runningCount > 0 ? `+${runningCount}` : runningCount;
}

function answer(value) {
  if (locked || !deck[cardIndex]) return;
  locked = true;
  const card = deck[cardIndex];
  const expected = getValue(card.rank);
  const isCorrect = value === expected;
  const group = getGroup(card.rank);

  progress.totalCards += 1;
  progress.groups[group][1] += 1;
  if (isCorrect) {
    correct += 1;
    sessionStreak += 1;
    sessionBestStreak = Math.max(sessionBestStreak, sessionStreak);
    progress.correctCards += 1;
    progress.groups[group][0] += 1;
  } else {
    sessionStreak = 0;
  }

  runningCount += expected;
  awardXP(isCorrect ? 3 : 1);
  showFeedback(isCorrect, expected);
  playSound(isCorrect ? "correct" : "wrong");
  cardIndex += 1;
  updateSessionUI();

  window.setTimeout(() => {
    if (cardIndex >= sessionLength) finishSession();
    else {
      renderCard();
      locked = false;
    }
  }, 520);
}

function showFeedback(isCorrect, expected) {
  const feedback = $("#feedback");
  feedback.textContent = isCorrect ? "Correct" : `It’s ${expected > 0 ? "+1" : expected === 0 ? "0" : "−1"}`;
  feedback.classList.remove("show", "wrong");
  void feedback.offsetWidth;
  feedback.classList.toggle("wrong", !isCorrect);
  feedback.classList.add("show");
}

function loadSoundPreference() {
  try { return localStorage.getItem("counted-sound") !== "off"; }
  catch { return true; }
}

function updateSoundUI() {
  const toggle = $("#sound-toggle");
  toggle.setAttribute("aria-pressed", String(soundOn));
  toggle.setAttribute("aria-label", soundOn ? "Turn sounds off" : "Turn sounds on");
  $("#sound-setting-value").textContent = soundOn ? "On" : "Off";
}

function playSound(kind) {
  if (!soundOn) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext ||= new AudioContext();
    if (audioContext.state === "suspended") audioContext.resume();

    const now = audioContext.currentTime;
    const tones = {
      tap: [[420, 0, .045, "sine", .018, 520]],
      deal: [[260, 0, .065, "triangle", .016, 170]],
      start: [[360, 0, .09, "sine", .028, 480], [540, .075, .11, "sine", .025, 680]],
      correct: [[560, 0, .09, "sine", .038, 650], [760, .075, .11, "sine", .034, 880]],
      wrong: [[210, 0, .14, "triangle", .035, 135]],
      complete: [[440, 0, .1, "sine", .03, 500], [620, .09, .1, "sine", .03, 690], [840, .18, .16, "sine", .034, 920]],
    };

    (tones[kind] || tones.tap).forEach(([startHz, delay, duration, type, volume, endHz]) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const start = now + delay;
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(startHz, start);
      oscillator.frequency.exponentialRampToValueAtTime(endHz, start + duration);
      gain.gain.setValueAtTime(volume, start);
      gain.gain.exponentialRampToValueAtTime(.001, start + duration);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + duration);
    });
  } catch { /* Sound is an optional enhancement. */ }
}

function finishSession() {
  const accuracy = Math.round((correct / sessionLength) * 100);
  const today = todayKey();
  const hour = new Date().getHours();
  if (!progress.practiceDates.includes(today)) progress.practiceDates.push(today);
  progress.bestStreak = Math.max(progress.bestStreak, sessionBestStreak);
  progress.practiceSessions += 1;
  if (accuracy === 100 && sessionLength === 20) progress.perfectTwentySessions += 1;
  if (accuracy === 100 && sessionLength === 52) progress.perfectFullDeckSessions += 1;
  if (runningCount === 0) progress.zeroFinishSessions += 1;
  if (hour >= 22 || hour < 4) progress.nightSessions += 1;
  progress.sessionDays[today] = (progress.sessionDays[today] || 0) + 1;
  progress.maxSessionsInDay = Math.max(progress.maxSessionsInDay, progress.sessionDays[today]);
  progress.sessions.unshift({ date: Date.now(), cards: sessionLength, accuracy, streak: sessionBestStreak });
  progress.sessions = progress.sessions.slice(0, 12);
  awardXP(accuracy >= 90 ? 50 : 25);
  saveProgress();
  renderProgress();
  playSound("complete");

  $("#session-progress").style.width = "100%";
  $("#dialog-title").textContent = accuracy >= 90 ? "Counted clean." : accuracy >= 75 ? "Good momentum." : "Keep building.";
  $("#dialog-copy").textContent = accuracy >= 90 ? "Your card recognition is becoming automatic." : "A little repetition now will pay off at the table.";
  $("#dialog-accuracy").textContent = `${accuracy}%`;
  $("#dialog-streak").textContent = sessionBestStreak;
  $("#session-dialog").showModal();
}

function navigate(viewName) {
  if (!CountedCore.canAccessView(viewName, subscriptionState.isPro)) {
    showPaywall(viewName);
    return;
  }
  const previousView = document.body.dataset.activeView;
  if (previousView === "learn") learnScrollPosition = window.scrollY;
  if (viewName !== "flash" && flashPlaying && !flashPaused && !flashAwaitingCount) setFlashPaused(true);
  $$(".view").forEach((view) => {
    const active = view.dataset.view === viewName;
    view.hidden = !active;
    view.classList.toggle("active-view", active);
  });
  $$(`[data-nav]`).forEach((button) => {
    const active = button.dataset.nav === viewName;
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  document.body.dataset.activeView = viewName;
  if (viewName === "progress") renderProgress();
  window.cancelAnimationFrame(navigationFrame);
  navigationFrame = window.requestAnimationFrame(() => {
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, viewName === "learn" ? learnScrollPosition : 0);
    document.documentElement.style.scrollBehavior = previousScrollBehavior;
  });
}

function percentage(pair) {
  return pair[1] ? `${Math.round((pair[0] / pair[1]) * 100)}%` : "—";
}

function practiceDayStreak(source = progress) {
  if (!source.practiceDates.length) return 1;
  const days = [...new Set(source.practiceDates)].sort().reverse();
  let streak = 0;
  let cursor = new Date();
  const today = cursor.toISOString().slice(0, 10);
  if (days[0] !== today) cursor.setDate(cursor.getDate() - 1);
  for (const day of days) {
    if (day === cursor.toISOString().slice(0, 10)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }
  return Math.max(streak, 1);
}

function groupsMastered(source) {
  return Object.values(source.groups).every(([correctAnswers, attempts]) => attempts >= 100 && (correctAnswers / attempts) >= .9);
}

function achievementCardMarkup(achievement) {
  const unlocked = achievement.unlocked(progress);
  const kind = achievement.fun ? "fun" : "milestone";
  return `<article class="achievement-card ${kind}${unlocked ? " unlocked" : ""}" role="listitem" aria-label="${achievement.title}: ${unlocked ? "unlocked" : achievement.copy}">
    <span class="achievement-badge" aria-hidden="true">${achievement.icon}</span>
    <div class="achievement-card-copy">
      <span class="achievement-card-meta"><em>${achievement.fun ? "Fun challenge" : `Tier ${achievement.tier}`}</em><b>${unlocked ? "Unlocked" : "Locked"}</b></span>
      <strong>${achievement.title}</strong>
      <small>${achievement.copy}</small>
    </div>
  </article>`;
}

function updateAchievementPageControls() {
  const pageCount = Math.ceil(achievementDefinitions.length / achievementPageSize);
  achievementPage = Math.max(0, Math.min(pageCount - 1, achievementPage));
  $("#achievement-prev").disabled = achievementPage === 0;
  $("#achievement-next").disabled = achievementPage === pageCount - 1;
  $("#achievement-page-status").textContent = `Page ${achievementPage + 1} of ${pageCount} · Tier ${achievementPage + 1}`;
  $$("#achievement-dots button").forEach((button, index) => {
    const active = index === achievementPage;
    button.classList.toggle("active", active);
    button.setAttribute("aria-current", active ? "page" : "false");
  });
}

function setAchievementPage(page, smooth = true) {
  const pageCount = Math.ceil(achievementDefinitions.length / achievementPageSize);
  achievementPage = Math.max(0, Math.min(pageCount - 1, page));
  const viewport = $("#achievement-viewport");
  viewport.scrollTo({ left: viewport.clientWidth * achievementPage, behavior: smooth ? "smooth" : "auto" });
  updateAchievementPageControls();
}

function renderAchievements() {
  const unlockedAchievements = achievementDefinitions.filter((achievement) => achievement.unlocked(progress));
  const unlockedSignature = unlockedAchievements.map((achievement) => achievement.id).join("|");
  const track = $("#achievement-grid");
  const pageCount = Math.ceil(achievementDefinitions.length / achievementPageSize);
  const needsRender = track.dataset.signature !== unlockedSignature;

  $("#achievement-total").textContent = `${unlockedAchievements.length} / ${achievementDefinitions.length} unlocked`;
  if (needsRender) {
    track.dataset.signature = unlockedSignature;
    track.innerHTML = Array.from({ length: pageCount }, (_, pageIndex) => {
      const pageAchievements = achievementDefinitions.slice(pageIndex * achievementPageSize, (pageIndex + 1) * achievementPageSize);
      return `<div class="achievement-page" role="list" aria-label="Achievement tier ${pageIndex + 1}">${pageAchievements.map(achievementCardMarkup).join("")}</div>`;
    }).join("");
    $("#achievement-dots").innerHTML = Array.from({ length: pageCount }, (_, index) => `<button type="button" data-achievement-page="${index}" aria-label="Show achievement tier ${index + 1}"></button>`).join("");
    window.requestAnimationFrame(() => setAchievementPage(achievementPage, false));
  }
  updateAchievementPageControls();
}

function renderProgression() {
  if (!$("#player-level")) return;
  if (progress.dailyGoal.date !== todayKey()) progress.dailyGoal = { date: todayKey(), xp: 0 };

  const level = levelFromXP(progress.xp);
  const rank = rankForLevel(level);
  const currentThreshold = levelThresholds[level - 1];
  const nextThreshold = levelThresholds[level] ?? currentThreshold;
  const levelSpan = Math.max(1, nextThreshold - currentThreshold);
  const levelProgress = level >= levelThresholds.length ? 100 : Math.min(100, ((progress.xp - currentThreshold) / levelSpan) * 100);
  const xpToNext = Math.max(0, nextThreshold - progress.xp);
  const dailyPercent = Math.min(100, Math.round((progress.dailyGoal.xp / 100) * 100));

  $("#header-level").textContent = level;
  $("#player-level").textContent = level;
  $("#player-rank").textContent = rank.title;
  $("#rank-message").textContent = rank.copy;
  $("#current-xp").textContent = progress.xp.toLocaleString();
  $("#next-level-copy").textContent = level >= levelThresholds.length ? "Maximum level reached" : `${xpToNext} XP to Level ${level + 1}`;
  $("#xp-progress").style.width = `${levelProgress}%`;
  $("#daily-xp").textContent = progress.dailyGoal.xp;
  $("#daily-percent").textContent = `${dailyPercent}%`;
  $("#daily-ring").style.setProperty("--daily", `${dailyPercent}%`);
  $("#daily-goal-copy").textContent = dailyPercent >= 100 ? "Daily goal complete. Keep going for bonus XP." : dailyPercent >= 50 ? "Halfway there—one more focused drill." : "Complete a short drill to build today’s run.";
  $("#rank-road-progress").textContent = `Level ${level} of ${levelThresholds.length}`;

  $("#rank-track").innerHTML = rankMilestones.map((milestone) => {
    const isCurrent = rank.title === milestone.title;
    const isUnlocked = level >= milestone.level;
    return `<article class="rank-step${isUnlocked ? " unlocked" : ""}${isCurrent ? " current" : ""}"><small>Level ${milestone.level}</small><strong>${milestone.title}</strong><span>${isUnlocked ? (isCurrent ? "Current rank" : "Unlocked") : `${levelThresholds[milestone.level - 1].toLocaleString()} XP`}</span></article>`;
  }).join("");

  renderAchievements();
}

function renderProgress() {
  renderProgression();
  const accuracy = progress.totalCards ? Math.round((progress.correctCards / progress.totalCards) * 100) : null;
  $("#overall-accuracy").textContent = accuracy === null ? "—" : `${accuracy}%`;
  $("#accuracy-note").textContent = accuracy === null ? "Complete your first session to set a baseline." : accuracy >= 90 ? "You’re reading cards with confidence." : "Aim for 90% before adding more speed.";
  $("#cards-counted").textContent = progress.totalCards.toLocaleString();
  $("#best-streak").textContent = progress.bestStreak;
  $("#practice-days").textContent = Math.max(progress.practiceDates.length, 1);
  $("#header-streak").textContent = practiceDayStreak();
  $("#low-mastery").textContent = percentage(progress.groups.low);
  $("#neutral-mastery").textContent = percentage(progress.groups.neutral);
  $("#high-mastery").textContent = percentage(progress.groups.high);
  $("#session-total").textContent = `${progress.sessions.length} ${progress.sessions.length === 1 ? "session" : "sessions"}`;

  const history = $("#history-list");
  if (!progress.sessions.length) {
    history.innerHTML = '<div class="empty-history">Your completed sessions will appear here.<br>Ready when you are.</div>';
    return;
  }
  history.innerHTML = progress.sessions.slice(0, 5).map((session) => {
    const date = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(session.date));
    return `<div class="history-item"><span>${date}</span><small>${session.cards} cards · ${session.streak} streak</small><strong>${session.accuracy}%</strong></div>`;
  }).join("");
}

$$(`[data-nav]`).forEach((button) => button.addEventListener("click", () => navigate(button.dataset.nav)));
$$(`[data-answer]`).forEach((button) => button.addEventListener("click", () => answer(Number(button.dataset.answer))));
$$(`[data-length]`).forEach((button) => button.addEventListener("click", () => {
  const requestedLength = Number(button.dataset.length);
  if (!CountedCore.canUseSessionLength(requestedLength, subscriptionState.isPro)) {
    showPaywall("practice");
    return;
  }
  sessionLength = requestedLength;
  $$(`[data-length]`).forEach((item) => item.classList.toggle("active", item === button));
  startSession();
}));
$$(`[data-strategy-tab]`).forEach((button) => button.addEventListener("click", () => {
  $$(`[data-strategy-tab]`).forEach((item) => {
    const isActive = item === button;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-selected", String(isActive));
  });
  renderStrategyChart(button.dataset.strategyTab);
}));
$("#true-count-options").addEventListener("click", (event) => {
  const button = event.target.closest("[data-true-count-answer]");
  if (button) answerTrueCount(Number(button.dataset.trueCountAnswer));
});
$("#achievement-prev").addEventListener("click", () => setAchievementPage(achievementPage - 1));
$("#achievement-next").addEventListener("click", () => setAchievementPage(achievementPage + 1));
$("#achievement-dots").addEventListener("click", (event) => {
  const button = event.target.closest("[data-achievement-page]");
  if (button) setAchievementPage(Number(button.dataset.achievementPage));
});
$("#achievement-viewport").addEventListener("scroll", () => {
  window.cancelAnimationFrame(achievementScrollFrame);
  achievementScrollFrame = window.requestAnimationFrame(() => {
    const viewport = $("#achievement-viewport");
    if (!viewport.clientWidth) return;
    const nextPage = Math.round(viewport.scrollLeft / viewport.clientWidth);
    if (nextPage !== achievementPage) {
      achievementPage = nextPage;
      updateAchievementPageControls();
    }
  });
}, { passive: true });
window.addEventListener("resize", () => setAchievementPage(achievementPage, false));
$$(`[data-casino-pace]`).forEach((button) => button.addEventListener("click", () => {
  casinoPace = button.dataset.casinoPace;
  renderCasinoPaceUI();
  playSound("tap");
}));
$$(`[data-flash-speed]`).forEach((button) => button.addEventListener("click", () => {
  flashSpeed = Number(button.dataset.flashSpeed);
  $$(`[data-flash-speed]`).forEach((item) => item.classList.toggle("active", item === button));
}));

$("#reset-session").addEventListener("click", startSession);
$("#settings-open").addEventListener("click", () => {
  $("#settings-dialog").showModal();
  playSound("tap");
});
$("#subscription-open").addEventListener("click", () => {
  $("#settings-dialog").close();
  showPaywall();
});
$("#paywall-close").addEventListener("click", () => $("#paywall-dialog").close());
$("#paywall-dialog").addEventListener("close", () => setPaywallScrollLock(false));
$("#subscribe-button").addEventListener("click", purchaseSubscription);
$("#restore-purchases").addEventListener("click", restorePurchases);
$("#manage-subscription").addEventListener("click", manageSubscription);
$("#sound-toggle").addEventListener("click", () => {
  soundOn = !soundOn;
  try { localStorage.setItem("counted-sound", soundOn ? "on" : "off"); } catch { /* Preference remains in memory. */ }
  updateSoundUI();
  if (soundOn) playSound("tap");
});
$("#theme-toggle").addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
});
$("#practice-again").addEventListener("click", () => { $("#session-dialog").close(); startSession(); });
$("#view-progress").addEventListener("click", () => { $("#session-dialog").close(); navigate("progress"); });
$("#casino-start").addEventListener("click", startCasinoShoe);
$("#casino-end").addEventListener("click", finishCasinoShoe);
$("#casino-next-round").addEventListener("click", advanceCasinoRound);
$("#casino-actions").addEventListener("click", (event) => {
  const button = event.target.closest("[data-casino-action]");
  if (button) handleCasinoAction(button.dataset.casinoAction);
});
$("#casino-minus").addEventListener("click", () => adjustCasinoCount(-1));
$("#casino-plus").addEventListener("click", () => adjustCasinoCount(1));
$("#casino-count-prompt").addEventListener("submit", submitCasinoCount);
$("#casino-again").addEventListener("click", () => { $("#casino-result-dialog").close(); startCasinoShoe(); });
$("#casino-leave").addEventListener("click", () => { $("#casino-result-dialog").close(); navigate("practice"); });
$("#casino-rules-open").addEventListener("click", () => {
  if (casinoPlaying) return;
  renderCasinoSettingsUI();
  $("#casino-rules-dialog").showModal();
  playSound("tap");
});
$("#casino-rules-close").addEventListener("click", closeCasinoRules);
$("#casino-rules-done").addEventListener("click", closeCasinoRules);
$$('[data-casino-players]').forEach((button) => button.addEventListener("click", () => {
  casinoSettings.autoPlayers = Number(button.dataset.casinoPlayers);
  renderCasinoSettingsUI();
}));
$$('[data-casino-soft17]').forEach((button) => button.addEventListener("click", () => {
  casinoSettings.soft17 = button.dataset.casinoSoft17;
  renderCasinoSettingsUI();
}));
$$('[data-casino-das]').forEach((button) => button.addEventListener("click", () => {
  casinoSettings.doubleAfterSplit = button.dataset.casinoDas === "true";
  renderCasinoSettingsUI();
}));
$$('[data-casino-surrender]').forEach((button) => button.addEventListener("click", () => {
  casinoSettings.surrender = button.dataset.casinoSurrender === "true";
  renderCasinoSettingsUI();
}));
$("#casino-decks").addEventListener("change", (event) => {
  casinoSettings.decks = Number(event.target.value);
  renderCasinoSettingsUI();
});
$("#flash-start").addEventListener("click", startFlashSprint);
$("#flash-pause").addEventListener("click", () => setFlashPaused(!flashPaused));
$("#flash-minus").addEventListener("click", () => adjustFlashCount(-1));
$("#flash-plus").addEventListener("click", () => adjustFlashCount(1));
$("#flash-count-prompt").addEventListener("submit", submitFlashCount);
$("#flash-again").addEventListener("click", () => { $("#flash-result-dialog").close(); startFlashSprint(); });
$("#flash-leave").addEventListener("click", () => { $("#flash-result-dialog").close(); navigate("practice"); });
$("#app-toast-close").addEventListener("click", () => { $("#app-toast").hidden = true; });
window.addEventListener("offline", () => showAppToast("You’re offline — training still works."));
window.addEventListener("online", () => showAppToast("Back online."));
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && ((casinoPlaying && !casinoPaused) || (flashPlaying && !flashPaused))) requestScreenWakeLock();
});

document.addEventListener("keydown", (event) => {
  if ($("#practice-view").hidden || $("#session-dialog").open) return;
  if (event.key === "1" || event.key === "+") answer(1);
  if (event.key === "0") answer(0);
  if (event.key === "-" || event.key === "_") answer(-1);
});

if (!isStandaloneApp() && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").then((registration) => {
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        worker?.addEventListener("statechange", () => {
          if (worker.state === "activated" && navigator.serviceWorker.controller) showAppToast("Counted was updated for your next session.");
        });
      });
    }).catch(() => showAppToast("Offline setup will retry next time."));
  });
}

applyTheme(document.documentElement.dataset.theme || "light", false);
updateSoundUI();
renderStrategyChart();
renderTrueCountScenario();
renderProgress();
renderCasinoSettingsUI();
renderCasinoPaceUI();
renderCasinoTable();
startSession();
document.body.dataset.activeView = "practice";
const requestedView = new URLSearchParams(window.location.search).get("view");
initializeSubscription().then(() => {
  if (["learn", "practice", "flash", "casino", "progress"].includes(requestedView)) navigate(requestedView);
});
