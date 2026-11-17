"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ScrollSequence.module.css";

const MOBILE_MAX = 767; // px — below 768 we use the manifest's framesMobile
const MAX_DPR = 1.5;
const CONCURRENCY = 6; // parallel frame downloads

/**
 * Scroll-scrubbed image sequence on a sticky canvas.
 *
 * Reads a manifest written by `scripts/frames.mjs`:
 *   { slug, count, width, height, frames, framesMobile, poster, video }
 * Frame/poster/video paths are resolved relative to the manifest URL.
 *
 * Props:
 *  - manifestUrl (string, required)
 *  - caption (string, required) — always-visible label, e.g. "Concept rendering"
 *  - poster (string, optional) — server-known poster URL, shown before JS / frames load
 *  - heightVh (number, default 300) — scroll length of the section
 *  - children — optional overlay copy (never animated)
 *
 * Guards:
 *  - canvas pixel ratio capped at 1.5
 *  - no drawing or new downloads while the section is off-screen (IntersectionObserver)
 *  - prefers-reduced-motion → no scrubbing; poster + the manifest's video fallback
 *  - ScrollTrigger killed, observers disconnected and images released on unmount
 *  - resize-safe (ResizeObserver re-sizes the backing store and redraws)
 */
const ScrollSequence = ({ manifestUrl, caption, poster, heightVh = 300, children }) => {
  const wrapRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const [mode, setMode] = useState("pending"); // pending | scrub | static
  const [video, setVideo] = useState(null);
  const [posterSrc, setPosterSrc] = useState(poster || null);
  const [ready, setReady] = useState(false); // first frame drawn on canvas

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !stage) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const controller = new AbortController();
    const base = new URL(manifestUrl, window.location.href);
    const resolve = (p) => new URL(p, base).toString();

    let disposed = false;
    let images = [];
    let loaded = [];
    let queue = [];
    let inflight = 0;
    let visible = false;
    let progress = 0;
    let current = -1;
    let dirty = true;
    let rafId = 0;
    let trigger = null;
    let io = null;
    let ro = null;
    let ctx = null;
    let drawnOnce = false;

    // ---------- reduced motion: poster + video fallback, nothing else ----------
    if (reduce || !canvas) {
      setMode("static");
      fetch(manifestUrl, { signal: controller.signal })
        .then((r) => (r.ok ? r.json() : null))
        .then((m) => {
          if (disposed || !m) return;
          if (m.poster && !poster) setPosterSrc(resolve(m.poster));
          if (m.video) setVideo(resolve(m.video));
        })
        .catch(() => {});
      return () => {
        disposed = true;
        controller.abort();
      };
    }

    setMode("scrub");
    gsap.registerPlugin(ScrollTrigger); // idempotent; SmoothScroll also registers it

    try {
      ctx = canvas.getContext("2d", { alpha: false });
    } catch {
      ctx = null;
    }

    const count = () => images.length;
    const targetIndex = () => Math.round(progress * Math.max(0, count() - 1));

    const nearestLoaded = (i) => {
      const n = count();
      for (let d = 0; d < n; d++) {
        if (i - d >= 0 && loaded[i - d]) return i - d;
        if (i + d < n && loaded[i + d]) return i + d;
      }
      return -1;
    };

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const w = Math.max(1, Math.round(stage.clientWidth * dpr));
      const h = Math.max(1, Math.round(stage.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        dirty = true;
      }
    };

    const draw = (i) => {
      const img = images[i];
      if (!ctx || !img) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      if (!iw || !ih) return;
      // cover-fit
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    const render = () => {
      rafId = 0;
      if (disposed || !visible) return;
      const i = nearestLoaded(targetIndex());
      if (i < 0) return;
      if (i === current && !dirty) return;
      draw(i);
      current = i;
      dirty = false;
      if (!drawnOnce) {
        drawnOnce = true;
        setReady(true);
      }
    };

    const requestRender = () => {
      if (!rafId && visible && !disposed) rafId = requestAnimationFrame(render);
    };

    const pump = () => {
      while (!disposed && visible && inflight < CONCURRENCY && queue.length) {
        const i = queue.shift();
        if (loaded[i]) continue;
        inflight++;
        const img = images[i];
        img.onload = img.onerror = (e) => {
          inflight--;
          img.onload = img.onerror = null;
          if (disposed) return;
          if (e.type === "load") {
            loaded[i] = true;
            const t = targetIndex();
            if (current < 0 || Math.abs(i - t) < Math.abs(current - t)) requestRender();
          }
          pump();
        };
        img.src = img.dataset.src;
      }
    };

    // Coarse-to-fine order: every 16th frame first, then 8th, 4th … so the
    // nearest-loaded frame is close to the target early on.
    const buildQueue = (n) => {
      const seen = new Uint8Array(n);
      const order = [];
      for (const step of [16, 8, 4, 2, 1]) {
        for (let i = 0; i < n; i += step) {
          if (!seen[i]) {
            seen[i] = 1;
            order.push(i);
          }
        }
      }
      return order;
    };

    // ---------- scroll → progress ----------
    trigger = ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        progress = self.progress;
        requestRender();
      },
    });

    // ---------- visibility: no draws / downloads off-screen ----------
    io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          dirty = true;
          requestRender();
          pump();
        } else if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { rootMargin: "50% 0px" }
    );
    io.observe(wrap);

    // ---------- resize ----------
    ro = new ResizeObserver(() => {
      sizeCanvas();
      requestRender();
    });
    ro.observe(stage);
    sizeCanvas();

    // ---------- manifest → first frame immediately, rest progressively ----------
    fetch(manifestUrl, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`manifest ${r.status}`);
        return r.json();
      })
      .then((m) => {
        if (disposed) return;
        const mobile =
          window.innerWidth <= MOBILE_MAX && Array.isArray(m.framesMobile) && m.framesMobile.length;
        const list = mobile ? m.framesMobile : m.frames;
        if (!Array.isArray(list) || !list.length) throw new Error("manifest has no frames");
        if (m.poster && !poster) setPosterSrc(resolve(m.poster));

        images = list.map((p) => {
          const img = new Image();
          img.decoding = "async";
          img.dataset.src = resolve(p);
          return img;
        });
        loaded = new Array(images.length).fill(false);
        queue = buildQueue(images.length);
        progress = trigger ? trigger.progress : 0;

        // First frame now, regardless of visibility (it is the poster).
        const first = queue.shift();
        const img0 = images[first];
        inflight++;
        img0.onload = img0.onerror = (e) => {
          inflight--;
          img0.onload = img0.onerror = null;
          if (disposed) return;
          if (e.type === "load") {
            loaded[first] = true;
            dirty = true;
            requestRender();
          }
          pump();
        };
        img0.src = img0.dataset.src;
      })
      .catch(() => {
        // Missing/invalid manifest: stay on the poster (if any). No console noise.
      });

    return () => {
      disposed = true;
      controller.abort();
      if (rafId) cancelAnimationFrame(rafId);
      if (trigger) trigger.kill();
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      for (const img of images) {
        img.onload = img.onerror = null;
        img.removeAttribute("src");
      }
      images = [];
      loaded = [];
      queue = [];
    };
  }, [manifestUrl, poster]);

  const isStatic = mode === "static";

  return (
    <section
      ref={wrapRef}
      className={`wh ${styles.wrap} ${isStatic ? styles.static : ""}`}
      style={{ "--seq-h": `${heightVh}vh` }}
      aria-label={caption}
    >
      <div ref={stageRef} className={styles.stage}>
        {isStatic && video ? (
          <video
            className={styles.media}
            src={video}
            poster={posterSrc || undefined}
            controls
            muted
            playsInline
            preload="none"
            aria-label={caption}
          />
        ) : (
          posterSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className={styles.media} src={posterSrc} alt={caption} />
          )
        )}
        {!isStatic && (
          <canvas
            ref={canvasRef}
            className={`${styles.canvas} ${ready ? styles.canvasReady : ""}`}
            aria-hidden="true"
          />
        )}
        {children && <div className={styles.overlay}>{children}</div>}
        <p className={styles.caption}>{caption}</p>
      </div>
    </section>
  );
};

export default ScrollSequence;
