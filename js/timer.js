export function createTimer(onTick) {
  let startMs = 0;
  let intervalId = null;
  let elapsedSec = 0;

  function tick() {
    elapsedSec = Math.floor((performance.now() - startMs) / 1000);
    onTick(elapsedSec);
  }

  return {
    start() {
      startMs = performance.now();
      tick();
      intervalId = setInterval(tick, 250);
    },
    stop() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      elapsedSec = Math.floor((performance.now() - startMs) / 1000);
      return elapsedSec;
    },
    addPenalty(ms) { startMs -= ms; tick(); },
    get elapsed() { return elapsedSec; },
  };
}
