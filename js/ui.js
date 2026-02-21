import { CONFIG } from "./config.js";
import { hasApiKey, saveApiKey, prefetchAllRounds } from "./api.js";
import { createGame, getCurrentRound, selectAnswer, nextRound, getState, getResultMessage } from "./game.js";

// ---- DOM refs ----
const $ = (sel) => document.querySelector(sel);
const screens = {
  start: $("#screen-start"),
  setup: $("#screen-setup"),
  loading: $("#screen-loading"),
  game: $("#screen-game"),
  results: $("#screen-results"),
};

const roundIndicator = $("#round-indicator");
const scoreIndicator = $("#score-indicator");
const cityPhoto = $("#city-photo");
const photoFallback = $("#photo-fallback");
const attribution = $("#attribution");
const optionsContainer = $("#options-container");
const btnNext = $("#btn-next");
const finalScore = $("#final-score");
const resultMessage = $("#result-message");
const roundSummary = $("#round-summary");

// Track which option was selected in each round (for results summary)
const selectedAnswers = [];

// ---- Screen management ----
function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[name].classList.add("active");
}

// ---- Image loading with timeout ----
function loadImage(url) {
  return new Promise((resolve, reject) => {
    if (!url) { reject(new Error("no url")); return; }
    const img = new Image();
    const timeout = setTimeout(() => reject(new Error("timeout")), CONFIG.IMAGE_TIMEOUT_MS);
    img.onload = () => { clearTimeout(timeout); resolve(url); };
    img.onerror = () => { clearTimeout(timeout); reject(new Error("load failed")); };
    img.src = url;
  });
}

// ---- Render a round ----
async function renderRound() {
  const state = getState();
  const round = getCurrentRound();

  roundIndicator.textContent = `Round ${state.currentRound + 1} / ${state.totalRounds}`;
  scoreIndicator.textContent = `Score: ${state.score}`;

  // Reset photo state
  cityPhoto.classList.remove("loaded");
  cityPhoto.src = "";
  photoFallback.hidden = true;
  attribution.innerHTML = "";
  btnNext.hidden = true;

  // Load photo or show fallback
  if (round.imageUrl) {
    try {
      await loadImage(round.imageUrl);
      cityPhoto.src = round.imageUrl;
      cityPhoto.classList.add("loaded");
      attribution.innerHTML = `Photo by <a href="${encodeURI(round.photographerUrl)}?utm_source=guess_the_city&utm_medium=referral" target="_blank" rel="noopener">${escapeHtml(round.photographerName)}</a> on <a href="https://unsplash.com/?utm_source=guess_the_city&utm_medium=referral" target="_blank" rel="noopener">Unsplash</a>`;
    } catch {
      photoFallback.hidden = false;
    }
  } else {
    photoFallback.hidden = false;
  }

  // Render option buttons
  optionsContainer.innerHTML = "";
  round.options.forEach((option, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = `${option.name}, ${option.country}`;
    btn.addEventListener("click", () => handleAnswer(i));
    optionsContainer.appendChild(btn);
  });
}

// ---- Handle answer selection ----
function handleAnswer(index) {
  const state = getState();
  selectedAnswers[state.currentRound] = index;

  const result = selectAnswer(index);
  if (!result) return;

  const buttons = optionsContainer.querySelectorAll(".option-btn");
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === result.correctIndex) {
      btn.classList.add("correct");
    } else if (i === index && !result.isCorrect) {
      btn.classList.add("wrong");
    } else {
      btn.classList.add("dimmed");
    }
  });

  scoreIndicator.textContent = `Score: ${getState().score}`;

  btnNext.hidden = false;
  btnNext.textContent = state.currentRound >= state.totalRounds - 1 ? "See Results" : "Next Round";
  btnNext.focus();
}

// ---- Show results screen ----
function showResults() {
  const state = getState();

  finalScore.textContent = `${state.score} / ${state.totalRounds}`;
  resultMessage.textContent = getResultMessage();

  roundSummary.innerHTML = "";
  state.rounds.forEach((round, i) => {
    const selectedIdx = selectedAnswers[i] ?? -1;
    const wasCorrect = selectedIdx !== -1 && round.options[selectedIdx].isCorrect;

    const div = document.createElement("div");
    div.className = "round-result";

    const icon = document.createElement("div");
    icon.className = `round-icon ${wasCorrect ? "correct" : "wrong"}`;
    icon.textContent = wasCorrect ? "\u2713" : "\u2717";

    const cityName = document.createElement("span");
    cityName.className = "round-city";
    cityName.textContent = `${round.correctCity.name}, ${round.correctCity.country}`;

    div.appendChild(icon);
    div.appendChild(cityName);

    if (!wasCorrect && selectedIdx !== -1) {
      const answer = document.createElement("span");
      answer.className = "round-answer";
      answer.textContent = `You said: ${round.options[selectedIdx].name}`;
      div.appendChild(answer);
    }

    roundSummary.appendChild(div);
  });

  showScreen("results");
}

// ---- Start a new game ----
async function startGame() {
  selectedAnswers.length = 0;
  showScreen("loading");

  const state = createGame();
  const error = await prefetchAllRounds(state.rounds);

  if (error === "invalid_key") {
    showSetupError("Invalid API key. Please check and try again.");
    return;
  }
  if (error === "rate_limited") {
    showSetupError("API rate limit reached. Please try again in a few minutes.");
    return;
  }

  showScreen("game");
  renderRound();
}

function showSetupError(message) {
  const errorEl = $("#setup-error");
  errorEl.textContent = message;
  errorEl.hidden = false;
  showScreen("setup");
}

// ---- Escape HTML for attribution ----
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---- Event listeners ----
$("#btn-start").addEventListener("click", () => {
  startGame();
});

btnNext.addEventListener("click", () => {
  const state = nextRound();
  if (state.phase === "results") {
    showResults();
  } else {
    renderRound();
  }
});

$("#btn-play-again").addEventListener("click", () => startGame());
