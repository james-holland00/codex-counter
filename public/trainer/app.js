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
    title: "Hard total",
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
    title: "Your hand",
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
    title: "Your pair",
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

const storageKey = "counted-progress-v1";
const defaultProgress = {
  totalCards: 0,
  correctCards: 0,
  bestStreak: 0,
  groups: { low: [0, 0], neutral: [0, 0], high: [0, 0] },
  sessions: [],
  practiceDates: [],
};

let progress = loadProgress();
let sessionLength = 40;
let deck = [];
let cardIndex = 0;
let correct = 0;
let sessionStreak = 0;
let sessionBestStreak = 0;
let runningCount = 0;
let locked = false;
let soundOn = true;
let casinoDeck = [];
let casinoIndex = 0;
let casinoRunningCount = 0;
let casinoCheckpoints = 0;
let casinoCorrect = 0;
let casinoSpeed = 950;
let casinoTimer = null;
let casinoPlaying = false;
let casinoPaused = false;
let casinoAwaitingCount = false;
let casinoSubmitting = false;
let trueCountIndex = 0;
let trueCountStreak = 0;
let trueCountLocked = false;
let trueCountTimer = null;
let deferredInstallPrompt = null;
let appToastTimer = null;
let screenWakeLock = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function applyTheme(theme, persist = true) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = theme;
  $("#theme-toggle").setAttribute("aria-pressed", String(isDark));
  $("#theme-toggle").setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
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
    <thead><tr><th scope="col">${chart.title}</th>${dealerCards.map((card) => `<th scope="col">${card}</th>`).join("")}</tr></thead>
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
  playTone(isCorrect);
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
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function openInstallDialog() {
  if (isStandaloneApp()) {
    showAppToast("Counted is already installed.");
    return;
  }
  $("#install-dialog").showModal();
}

async function requestScreenWakeLock() {
  if (!("wakeLock" in navigator) || document.visibilityState !== "visible" || !casinoPlaying || casinoPaused) return;
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
    return saved ? { ...defaultProgress, ...saved, groups: { ...defaultProgress.groups, ...saved.groups } } : structuredClone(defaultProgress);
  } catch {
    return structuredClone(defaultProgress);
  }
}

function saveProgress() {
  localStorage.setItem(storageKey, JSON.stringify(progress));
}

function getValue(rank) {
  if (["2", "3", "4", "5", "6"].includes(rank)) return 1;
  if (["7", "8", "9"].includes(rank)) return 0;
  return -1;
}

function getGroup(rank) {
  const value = getValue(rank);
  return value === 1 ? "low" : value === 0 ? "neutral" : "high";
}

function makeDeck() {
  const cards = suits.flatMap((suit) => ranks.map((rank) => ({ rank, suit })));
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards.slice(0, sessionLength);
}

function makeCasinoDeck() {
  const cards = suits.flatMap((suit) => ranks.map((rank) => ({ rank, suit })));
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards.slice(0, 20);
}

function signedCount(value) {
  return value > 0 ? `+${value}` : String(value);
}

function updateCasinoUI() {
  $("#casino-cards-left").textContent = 20 - casinoIndex;
  $("#casino-checkpoint").textContent = casinoCheckpoints;
}

function setCasinoControlsDisabled(disabled) {
  ["#casino-minus", "#casino-plus", "#casino-count-input", ".casino-submit"].forEach((selector) => {
    $(selector).disabled = disabled;
  });
}

function scheduleCasinoDeal(delay = casinoSpeed) {
  window.clearTimeout(casinoTimer);
  if (!casinoPlaying || casinoPaused || casinoAwaitingCount) return;
  casinoTimer = window.setTimeout(dealCasinoCard, delay);
}

function renderCasinoCard(card) {
  [$("#casino-rank-top"), $("#casino-rank-bottom")].forEach((el) => { el.textContent = card.rank; });
  [$("#casino-suit-top"), $("#casino-suit-bottom"), $("#casino-card-suit")].forEach((el) => { el.textContent = card.suit; });
  const cardElement = $("#casino-card");
  cardElement.classList.remove("face-down", "deal-in");
  cardElement.classList.toggle("red", card.suit === "♥" || card.suit === "♦");
  void cardElement.offsetWidth;
  cardElement.classList.add("deal-in");

  const miniCard = document.createElement("span");
  miniCard.className = `dealt-mini-card${card.suit === "♥" || card.suit === "♦" ? " red" : ""}`;
  miniCard.innerHTML = `${card.rank}<span>${card.suit}</span>`;
  $("#casino-dealt-cards").appendChild(miniCard);
}

function showCasinoCountPrompt() {
  if (!casinoPlaying || !casinoAwaitingCount) return;
  $("#casino-count-input").value = "0";
  $("#casino-prompt-copy").textContent = `Cards ${casinoIndex - 4}–${casinoIndex} are out.`;
  $("#casino-prompt-feedback").textContent = "";
  $("#casino-prompt-feedback").classList.remove("wrong");
  setCasinoControlsDisabled(false);
  $("#casino-count-prompt").hidden = false;
  $("#casino-count-input").focus();
  $("#casino-count-input").select();
}

function dealCasinoCard() {
  if (!casinoPlaying || casinoPaused || casinoAwaitingCount) return;
  const card = casinoDeck[casinoIndex];
  if (!card) return;

  casinoRunningCount += getValue(card.rank);
  renderCasinoCard(card);
  casinoIndex += 1;
  updateCasinoUI();

  if (casinoIndex % 5 === 0) {
    casinoAwaitingCount = true;
    $("#casino-status").textContent = "Count check";
    $(".casino-live").classList.remove("dealing");
    $("#casino-pause").disabled = true;
    casinoTimer = window.setTimeout(showCasinoCountPrompt, Math.min(500, casinoSpeed / 2));
  } else {
    scheduleCasinoDeal();
  }
}

function startCasinoShoe() {
  window.clearTimeout(casinoTimer);
  casinoDeck = makeCasinoDeck();
  casinoIndex = 0;
  casinoRunningCount = 0;
  casinoCheckpoints = 0;
  casinoCorrect = 0;
  casinoPlaying = true;
  casinoPaused = false;
  casinoAwaitingCount = false;
  casinoSubmitting = false;

  $("#casino-dealt-cards").innerHTML = "";
  $("#casino-count-prompt").hidden = true;
  $("#casino-paused-overlay").hidden = true;
  $("#casino-card").className = "casino-card face-down";
  $("#casino-status").textContent = "Cards moving";
  $(".casino-live").classList.add("dealing");
  $("#casino-pause").disabled = false;
  $("#casino-pause").innerHTML = "<span>Ⅱ</span> Pause";
  $("#casino-start span").textContent = "Restart shoe";
  updateCasinoUI();
  requestScreenWakeLock();
  scheduleCasinoDeal(450);
}

function setCasinoPaused(shouldPause) {
  if (!casinoPlaying || casinoAwaitingCount || casinoPaused === shouldPause) return;
  casinoPaused = shouldPause;
  window.clearTimeout(casinoTimer);
  $("#casino-paused-overlay").hidden = !casinoPaused;
  $("#casino-status").textContent = casinoPaused ? "Table paused" : "Cards moving";
  $(".casino-live").classList.toggle("dealing", !casinoPaused);
  $("#casino-pause").innerHTML = casinoPaused ? "<span>▶</span> Resume" : "<span>Ⅱ</span> Pause";
  if (casinoPaused) releaseScreenWakeLock();
  else {
    requestScreenWakeLock();
    scheduleCasinoDeal(350);
  }
}

function adjustCasinoCount(delta) {
  const input = $("#casino-count-input");
  const next = Math.max(-20, Math.min(20, Number(input.value || 0) + delta));
  input.value = next;
}

function finishCasinoShoe() {
  casinoPlaying = false;
  casinoAwaitingCount = false;
  window.clearTimeout(casinoTimer);
  $("#casino-status").textContent = "Shoe complete";
  $(".casino-live").classList.remove("dealing");
  $("#casino-pause").disabled = true;
  $("#casino-start span").textContent = "Deal again";
  releaseScreenWakeLock();

  const accuracy = Math.round((casinoCorrect / 4) * 100);
  const today = new Date().toISOString().slice(0, 10);
  if (!progress.practiceDates.includes(today)) progress.practiceDates.push(today);
  saveProgress();
  renderProgress();

  $("#casino-result-title").textContent = accuracy === 100 ? "Table sharp." : accuracy >= 75 ? "Strong shoe." : "Stay with the count.";
  $("#casino-result-copy").textContent = accuracy === 100 ? "You held the running count through every checkpoint." : "Review the misses, then slow the pace until the count feels automatic.";
  $("#casino-result-accuracy").textContent = `${accuracy}%`;
  $("#casino-result-count").textContent = signedCount(casinoRunningCount);
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
  updateCasinoUI();

  const feedback = $("#casino-prompt-feedback");
  feedback.textContent = isCorrect ? "Correct. Keep the count." : `The count is ${signedCount(casinoRunningCount)}.`;
  feedback.classList.toggle("wrong", !isCorrect);
  setCasinoControlsDisabled(true);
  playTone(isCorrect);

  casinoTimer = window.setTimeout(() => {
    $("#casino-count-prompt").hidden = true;
    casinoSubmitting = false;
    if (casinoIndex >= 20) {
      finishCasinoShoe();
    } else {
      casinoAwaitingCount = false;
      $("#casino-status").textContent = "Cards moving";
      $(".casino-live").classList.add("dealing");
      $("#casino-pause").disabled = false;
      scheduleCasinoDeal(450);
    }
  }, 900);
}

function startSession() {
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
  showFeedback(isCorrect, expected);
  playTone(isCorrect);
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

function playTone(isCorrect) {
  if (!soundOn) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = isCorrect ? 540 : 190;
    gain.gain.setValueAtTime(0.055, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.12);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.12);
  } catch { /* Sound is an optional enhancement. */ }
}

function finishSession() {
  const accuracy = Math.round((correct / sessionLength) * 100);
  const today = new Date().toISOString().slice(0, 10);
  if (!progress.practiceDates.includes(today)) progress.practiceDates.push(today);
  progress.bestStreak = Math.max(progress.bestStreak, sessionBestStreak);
  progress.sessions.unshift({ date: Date.now(), cards: sessionLength, accuracy, streak: sessionBestStreak });
  progress.sessions = progress.sessions.slice(0, 12);
  saveProgress();
  renderProgress();

  $("#session-progress").style.width = "100%";
  $("#dialog-title").textContent = accuracy >= 90 ? "Counted clean." : accuracy >= 75 ? "Good momentum." : "Keep building.";
  $("#dialog-copy").textContent = accuracy >= 90 ? "Your card recognition is becoming automatic." : "A little repetition now will pay off at the table.";
  $("#dialog-accuracy").textContent = `${accuracy}%`;
  $("#dialog-streak").textContent = sessionBestStreak;
  $("#session-dialog").showModal();
}

function navigate(viewName) {
  if (viewName !== "casino" && casinoPlaying && !casinoPaused && !casinoAwaitingCount) setCasinoPaused(true);
  $$(".view").forEach((view) => {
    const active = view.dataset.view === viewName;
    view.hidden = !active;
    view.classList.toggle("active-view", active);
  });
  $$(`[data-nav]`).forEach((button) => button.classList.toggle("active", button.dataset.nav === viewName));
  if (viewName === "progress") renderProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function percentage(pair) {
  return pair[1] ? `${Math.round((pair[0] / pair[1]) * 100)}%` : "—";
}

function practiceDayStreak() {
  if (!progress.practiceDates.length) return 1;
  const days = [...new Set(progress.practiceDates)].sort().reverse();
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

function renderProgress() {
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
  sessionLength = Number(button.dataset.length);
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
$$(`[data-casino-speed]`).forEach((button) => button.addEventListener("click", () => {
  casinoSpeed = Number(button.dataset.casinoSpeed);
  $$(`[data-casino-speed]`).forEach((item) => item.classList.toggle("active", item === button));
}));

$("#reset-session").addEventListener("click", startSession);
$("#guide-toggle").addEventListener("change", (event) => document.body.classList.toggle("guide-off", !event.target.checked));
$("#sound-toggle").addEventListener("click", (event) => {
  soundOn = !soundOn;
  event.currentTarget.setAttribute("aria-pressed", soundOn);
  event.currentTarget.setAttribute("aria-label", soundOn ? "Turn sounds off" : "Turn sounds on");
  event.currentTarget.style.opacity = soundOn ? "1" : ".45";
});
$("#theme-toggle").addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
});
$("#practice-again").addEventListener("click", () => { $("#session-dialog").close(); startSession(); });
$("#view-progress").addEventListener("click", () => { $("#session-dialog").close(); navigate("progress"); });
$("#casino-start").addEventListener("click", startCasinoShoe);
$("#casino-pause").addEventListener("click", () => setCasinoPaused(!casinoPaused));
$("#casino-minus").addEventListener("click", () => adjustCasinoCount(-1));
$("#casino-plus").addEventListener("click", () => adjustCasinoCount(1));
$("#casino-count-prompt").addEventListener("submit", submitCasinoCount);
$("#casino-again").addEventListener("click", () => { $("#casino-result-dialog").close(); startCasinoShoe(); });
$("#casino-leave").addEventListener("click", () => { $("#casino-result-dialog").close(); navigate("practice"); });
$("#install-button").addEventListener("click", openInstallDialog);
$("#install-dismiss").addEventListener("click", () => $("#install-dialog").close());
$("#native-install-button").addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  $("#install-dialog").close();
});
$("#app-toast-close").addEventListener("click", () => { $("#app-toast").hidden = true; });

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  $("#native-install-button").hidden = false;
  $("#install-dialog").classList.add("native-ready");
});
window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  $("#install-button").hidden = true;
  showAppToast("Counted is installed.");
});
window.addEventListener("offline", () => showAppToast("You’re offline — training still works."));
window.addEventListener("online", () => showAppToast("Back online."));
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && casinoPlaying && !casinoPaused) requestScreenWakeLock();
});

document.addEventListener("keydown", (event) => {
  if ($("#practice-view").hidden || $("#session-dialog").open) return;
  if (event.key === "1" || event.key === "+") answer(1);
  if (event.key === "0") answer(0);
  if (event.key === "-" || event.key === "_") answer(-1);
});

if ("serviceWorker" in navigator) {
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
if (isStandaloneApp()) $("#install-button").hidden = true;
renderStrategyChart();
renderTrueCountScenario();
renderProgress();
startSession();
const requestedView = new URLSearchParams(window.location.search).get("view");
if (["learn", "practice", "casino", "progress"].includes(requestedView)) navigate(requestedView);
