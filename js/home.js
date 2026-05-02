import { getLeaderboard, setGamertag, getGamertag, formatTime } from "./store.js";
import { openModal, closeModal, bindCloseOnBackdrop } from "./modals.js";

function renderLeaderboard() {
  const list = document.getElementById("leaderboard");
  const board = getLeaderboard().slice(0, 10);
  list.innerHTML = board.map((entry, i) => {
    const rank = `${i + 1}.`;
    const time = formatTime(entry.time);
    const cls = entry.you ? "you" : "";
    return `<li class="${cls}"><span class="rank">${rank}</span><span class="name">${escapeHtml(entry.name)} (${time})</span></li>`;
  }).join("");
}

function escapeHtml(s) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

document.getElementById("start-btn").addEventListener("click", () => {
  const input = document.getElementById("gamertag-input");
  input.value = getGamertag();
  openModal("gamertag-modal");
  setTimeout(() => input.focus(), 50);
});

document.getElementById("gamertag-confirm").addEventListener("click", submitTag);
document.getElementById("gamertag-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitTag();
});

function submitTag() {
  const tag = document.getElementById("gamertag-input").value.trim();
  if (!tag) return;
  setGamertag(tag);
  closeModal("gamertag-modal");
  location.href = "intro.html";
}

bindCloseOnBackdrop("gamertag-modal");
renderLeaderboard();
