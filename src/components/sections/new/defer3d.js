/**
 * Start-up gate for decorative WebGL (ConstellationBg, LogoGlobe).
 *
 * Starting three.js + a render loop while the page is still loading is the
 * single biggest main-thread cost on our pages (mobile Lighthouse TBT). The
 * visuals are decorative — the CSS glow underneath is the designed fallback —
 * so they wait until the page no longer needs the main thread:
 *
 *  - mode "idle" (above-the-fold pieces): start on the visitor's first
 *    interaction, or after `load` + `delay` ms + an idle slot, whichever first.
 *  - mode "visible" (below-the-fold pieces): start after `load`, once the
 *    element is within 200px of the viewport.
 *  - Data Saver on: never start.
 *
 * Returns a cancel function; call it from the effect cleanup.
 */
export function onReadyFor3D(el, start, { mode = "idle", delay = 2500 } = {}) {
  if (typeof window === "undefined" || !el) return () => {};
  if (navigator.connection && navigator.connection.saveData) return () => {};

  let done = false;
  const cleanups = [];
  const stop = () => {
    while (cleanups.length) cleanups.pop()();
  };
  const fire = () => {
    if (done) return;
    done = true;
    stop();
    start();
  };
  const afterLoad = (cb) => {
    if (document.readyState === "complete") {
      cb();
      return;
    }
    window.addEventListener("load", cb, { once: true });
    cleanups.push(() => window.removeEventListener("load", cb));
  };

  if (mode === "visible") {
    let visible = false;
    let loaded = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && loaded) fire();
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(el);
    cleanups.push(() => io.disconnect());
    afterLoad(() => {
      loaded = true;
      if (visible) fire();
    });
  } else {
    const events = ["pointerdown", "pointermove", "keydown", "touchstart", "wheel", "scroll"];
    events.forEach((ev) => window.addEventListener(ev, fire, { passive: true }));
    cleanups.push(() => events.forEach((ev) => window.removeEventListener(ev, fire)));

    let timer;
    let idle;
    afterLoad(() => {
      timer = setTimeout(() => {
        if ("requestIdleCallback" in window) idle = window.requestIdleCallback(fire, { timeout: 1000 });
        else fire();
      }, delay);
    });
    cleanups.push(() => {
      clearTimeout(timer);
      if (idle && "cancelIdleCallback" in window) window.cancelIdleCallback(idle);
    });
  }

  return () => {
    done = true;
    stop();
  };
}
