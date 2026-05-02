const LB_KEY = "firehelm.leaderboard.v1";
const TAG_KEY = "firehelm.gamertag";
const RUN_KEY = "firehelm.lastRun";

const SEED = [
  ["Amelia", 95], ["Benjamin", 99], ["Arthur", 110], ["Mehmet", 115],
  ["Sonja", 135], ["Günther", 145], ["Keanu", 155], ["Olivia", 165],
  ["Emma", 175], ["Liam", 177], ["Noah", 185], ["Elijah", 192],
  ["Emma", 198], ["Asher", 205], ["Luca", 212], ["James", 220],
  ["Sarah", 228], ["Lisa", 235], ["Richard", 244], ["Michael", 255],
];

export function getLeaderboard() {
  const raw = localStorage.getItem(LB_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch {}
  }
  const seed = SEED.map(([name, time]) => ({ name, time, seeded: true }));
  localStorage.setItem(LB_KEY, JSON.stringify(seed));
  return seed;
}

export function insertScore(name, time) {
  const board = getLeaderboard();
  const entry = { name, time, you: true };
  board.push(entry);
  board.sort((a, b) => a.time - b.time);
  const trimmed = board.slice(0, 20);
  const rank = trimmed.findIndex((e) => e === entry) + 1;
  localStorage.setItem(LB_KEY, JSON.stringify(trimmed.map((e) => ({ ...e, you: false }))));
  return rank > 0 ? rank : null;
}

export function setGamertag(tag) {
  localStorage.setItem(TAG_KEY, tag);
  sessionStorage.setItem(TAG_KEY, tag);
}

export function getGamertag() {
  return sessionStorage.getItem(TAG_KEY) || localStorage.getItem(TAG_KEY) || "";
}

export function saveRun(time, rank) {
  sessionStorage.setItem(RUN_KEY, JSON.stringify({ time, rank }));
}

export function getLastRun() {
  const raw = sessionStorage.getItem(RUN_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
