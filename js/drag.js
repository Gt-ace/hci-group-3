export function attachDrag({ handle, getDropTargets, onDrop }) {
  let active = false;
  let pointerId = null;
  let originRect = null;

  function start(ev) {
    if (active) return;
    ev.preventDefault();
    active = true;
    pointerId = ev.pointerId;
    handle.setPointerCapture(pointerId);
    originRect = handle.getBoundingClientRect();
    handle.classList.add("dragging");
    move(ev);
  }

  function move(ev) {
    if (!active) return;
    handle.style.left = `${ev.clientX}px`;
    handle.style.top = `${ev.clientY}px`;
  }

  function end(ev) {
    if (!active) return;
    active = false;
    handle.releasePointerCapture(pointerId);
    handle.classList.remove("dragging");

    const targets = getDropTargets();
    const x = ev.clientX;
    const y = ev.clientY;
    const hit = targets.find((t) => {
      const r = t.el.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    });

    handle.style.left = "";
    handle.style.top = "";

    if (hit) {
      onDrop(hit, { x, y });
    } else {
      handle.classList.add("shake");
      setTimeout(() => handle.classList.remove("shake"), 350);
      onDrop(null, { x, y });
    }
  }

  handle.addEventListener("pointerdown", start);
  handle.addEventListener("pointermove", move);
  handle.addEventListener("pointerup", end);
  handle.addEventListener("pointercancel", end);

  return () => {
    handle.removeEventListener("pointerdown", start);
    handle.removeEventListener("pointermove", move);
    handle.removeEventListener("pointerup", end);
    handle.removeEventListener("pointercancel", end);
  };
}
