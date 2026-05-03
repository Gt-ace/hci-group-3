import { createTimer } from "./timer.js";
import { attachDrag } from "./drag.js";
import { openModal, closeModal, bindCloseOnBackdrop } from "./modals.js";
import { insertScore, getGamertag, saveRun, formatTime } from "./store.js";

const ROUNDS = [
  {
    id: 1,
    thumb: "assets/images/helm_gelb.png",
    correctTarget: "modern",
    model: "assets/models/helm_gelb.usdz",
    info: {
      title: "Bullard Modell R330",
      rows: [
        ["Material", "Hitzebeständiger Kunststoff"],
        ["Details", "Schutzvisier + textiler Nackenschutz"],
        ["Herkunft", "Deutschland, ab 2008"],
      ],
    },
  },
  {
    id: 2,
    thumb: "assets/images/feuerwehrhelm.png",
    correctTarget: "vintage",
    model: "assets/models/feuerwehrhelm.usdz",
    info: {
      title: "Historischer Feuerwehrhelm",
      rows: [
        ["Material", "Leder mit Messingbeschlägen"],
        ["Details", "Messingkamm, rotes Frontschild mit Aufschrift"],
        ["Herkunft", "Europa, spätes 19. Jahrhundert"],
      ],
    },
  },
  {
    id: 3,
    thumb: "assets/images/gasmaske.png",
    correctTarget: "third",
    model: "assets/models/gasmaske.usdz",
    info: {
      title: "Atemschutzmaske",
      rows: [
        ["Material", "Silikon mit Polycarbonat-Sichtscheibe"],
        ["Details", "Doppelfilter, integrierte Sprechmembran"],
        ["Herkunft", "Modernes Einsatzgerät"],
      ],
    },
  },
];

const timerEl = document.getElementById("timer");
const draggable = document.getElementById("draggable");
const dragThumb = document.getElementById("drag-thumb");
const scene = document.getElementById("scene");
const korrekt = document.getElementById("korrekt");
const penaltyBanner = document.getElementById("penalty");
const weiterBar = document.getElementById("weiter-bar");
const dock = document.getElementById("dock");

let currentRound = 0;
let placedNode = null;

const timer = createTimer((sec) => { timerEl.textContent = formatTime(sec); });
timer.start();

function loadRound(idx) {
  currentRound = idx;
  const round = ROUNDS[idx];
  dragThumb.src = round.thumb;
  draggable.style.display = "";
  draggable.style.left = "";
  draggable.style.top = "";
  draggable.classList.remove("dragging");
  korrekt.hidden = true;
  weiterBar.hidden = true;
  if (placedNode) { placedNode.remove(); placedNode = null; }
  dock.style.display = "";
}

function getDropTargets() {
  return [...scene.querySelectorAll(".firefighter")].map((el) => ({
    id: el.dataset.id, el,
  }));
}

function onDrop(hit) {
  if (!hit) return;
  const round = ROUNDS[currentRound];
  if (hit.id !== round.correctTarget) {
    draggable.classList.add("shake");
    setTimeout(() => draggable.classList.remove("shake"), 350);
    timer.addPenalty(5000);
    penaltyBanner.hidden = false;
    penaltyBanner.style.animation = "none";
    void penaltyBanner.offsetWidth;
    penaltyBanner.style.animation = "";
    setTimeout(() => { penaltyBanner.hidden = true; }, 1200);
    return;
  }
  placeOnTarget(hit.el, round);
}

function placeOnTarget(targetEl, round) {
  draggable.style.display = "none";
  dock.style.display = "none";
  const placed = document.createElement("div");
  placed.className = "placed-item";
  const targetRect = targetEl.getBoundingClientRect();
  const sceneRect = scene.getBoundingClientRect();
  const w = targetRect.width * 0.9;
  const left = targetRect.left - sceneRect.left + (targetRect.width - w) / 2;
  const top = targetRect.top - sceneRect.top - w * 0.7;
  placed.style.left = `${left}px`;
  placed.style.top = `${top}px`;
  placed.style.width = `${w}px`;
  placed.innerHTML = `
    <img src="${round.thumb}" alt="" style="width:100%;display:block;">
    <button class="placed-item__info-btn" id="info-btn">
      <span style="font-family:Georgia,serif;font-style:italic;font-weight:900;color:#fff;font-size:18px;">i</span>
    </button>`;
  scene.appendChild(placed);
  placedNode = placed;
  placed.querySelector("#info-btn").addEventListener("click", () => openInfobox(round));

  korrekt.hidden = false;
  weiterBar.hidden = false;
}

function openInfobox(round) {
  document.getElementById("info-title").textContent = round.info.title;
  document.getElementById("info-rows").innerHTML = round.info.rows
    .map(([k, v]) => `<div class="row"><dt>${k}:</dt><dd>${v}</dd></div>`).join("");
  const ar = document.getElementById("info-ar");
  ar.href = round.model;
  openModal("infobox");
}

document.getElementById("weiter-btn").addEventListener("click", () => {
  if (currentRound + 1 >= ROUNDS.length) {
    finish();
  } else {
    loadRound(currentRound + 1);
  }
});

function finish() {
  const time = timer.stop();
  const tag = getGamertag() || "Spieler";
  const rank = insertScore(tag, time);
  saveRun(time, rank);
  location.href = "finish.html";
}

document.getElementById("exit-btn").addEventListener("click", () => openModal("leave-modal"));
document.getElementById("leave-cancel").addEventListener("click", () => closeModal("leave-modal"));
document.getElementById("leave-confirm").addEventListener("click", () => { location.href = "index.html"; });

bindCloseOnBackdrop("leave-modal");
bindCloseOnBackdrop("infobox");

attachDrag({
  handle: draggable,
  getDropTargets,
  onDrop,
});

loadRound(0);
