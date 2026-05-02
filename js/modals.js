export function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.hidden = false;
}

export function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.hidden = true;
}

export function bindCloseOnBackdrop(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener("click", (e) => {
    if (e.target === el) closeModal(id);
  });
}
