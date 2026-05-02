import { getLastRun, formatTime } from "./store.js";

const run = getLastRun();
if (run) {
  document.getElementById("final-time").textContent = formatTime(run.time);
  document.getElementById("final-rank").textContent = run.rank ? `#${run.rank}` : "#21+";
}
