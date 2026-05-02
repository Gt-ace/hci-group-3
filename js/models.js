import { mountViewer } from "./model-viewer.js";

const slots = document.querySelectorAll(".model-card__viewer");

slots.forEach(async (slot) => {
  const url = slot.dataset.model;
  const fallback = slot.dataset.fallback;
  showLoading(slot);
  try {
    await mountViewer(slot, url, { autoRotate: true, controls: true });
  } catch (err) {
    console.error("Failed to load", url, err);
    slot.innerHTML = `<img src="${fallback}" alt="" style="width:55%;">
      <p style="color:var(--text-muted);font-size:12px;text-align:center;padding:8px 16px 14px;">3D-Vorschau konnte nicht geladen werden — AR Quick Look funktioniert weiterhin.</p>`;
  }
});

function showLoading(el) {
  el.innerHTML = `<div class="viewer-loading"><span class="spinner"></span><span>Lade Modell …</span></div>`;
}
