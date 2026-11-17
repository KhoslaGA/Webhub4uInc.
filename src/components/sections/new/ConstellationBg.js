"use client";
import { useEffect, useRef } from "react";
import { onReadyFor3D } from "./defer3d";
import styles from "./ConstellationBg.module.css";

/**
 * Azure "constellation" — a bespoke network of drifting nodes linked by lines
 * that brighten as they near each other and the cursor. A NET-style ambient
 * background for the dark inner-page heroes, built to our own craft + brand
 * (logo azure) rather than a generic library.
 *
 * Perf/discipline (per CLAUDE.md): DPR capped at 1.5, node count scaled down on
 * mobile, O(n²) link pass kept cheap by a low node budget, RAF paused off-screen
 * via IntersectionObserver, WebGL guarded in try/catch (CSS glow is the
 * fallback), and skipped entirely for prefers-reduced-motion. Everything is
 * disposed on cleanup. pointer-events: none, so it never blocks the content.
 */
const ConstellationBg = ({ density = 1, className = "" }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let running = true;
    let raf;
    let cleanup = () => {};

    const init = () =>
      import("three")
      .then((THREE) => {
        if (disposed) return;

        let renderer;
        try {
          renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        } catch {
          return; // no WebGL — the CSS glow remains
        }
        const dpr = Math.min(window.devicePixelRatio, 1.5);
        renderer.setPixelRatio(dpr);
        let W = mount.clientWidth;
        let H = mount.clientHeight;
        renderer.setSize(W, H);
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        let aspect = W / H || 1;
        const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 10);
        camera.position.z = 2;

        const group = new THREE.Group();
        scene.add(group);

        const isMobile =
          Math.min(window.innerWidth, window.innerHeight) < 720 ||
          window.matchMedia("(pointer: coarse)").matches;

        const N = Math.max(12, Math.round((isMobile ? 32 : 64) * density));
        const LINK = isMobile ? 0.46 : 0.4; // link distance (world units)
        const AZURE = new THREE.Color(0x2fbfec);

        // --- nodes (drifting in a normalized box: x∈[-aspect,aspect], y∈[-1,1]) ---
        const nodes = [];
        const rand = (a, b) => a + Math.random() * (b - a);
        for (let i = 0; i < N; i++) {
          nodes.push({
            x: rand(-aspect, aspect),
            y: rand(-1, 1),
            vx: rand(-0.0016, 0.0016),
            vy: rand(-0.0016, 0.0016),
          });
        }

        // --- points ---
        const pPos = new Float32Array(N * 3);
        const pGeo = new THREE.BufferGeometry();
        pGeo.setAttribute(
          "position",
          new THREE.BufferAttribute(pPos, 3).setUsage(THREE.DynamicDrawUsage)
        );
        const pMat = new THREE.PointsMaterial({
          color: AZURE,
          size: 2.4 * dpr,
          sizeAttenuation: false,
          transparent: true,
          opacity: 0.85,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        group.add(new THREE.Points(pGeo, pMat));

        // --- links (preallocated; also room for cursor→node links) ---
        const maxSeg = (N * (N - 1)) / 2 + N;
        const lPos = new Float32Array(maxSeg * 2 * 3);
        const lCol = new Float32Array(maxSeg * 2 * 3);
        const lGeo = new THREE.BufferGeometry();
        lGeo.setAttribute(
          "position",
          new THREE.BufferAttribute(lPos, 3).setUsage(THREE.DynamicDrawUsage)
        );
        lGeo.setAttribute(
          "color",
          new THREE.BufferAttribute(lCol, 3).setUsage(THREE.DynamicDrawUsage)
        );
        const lMat = new THREE.LineBasicMaterial({
          vertexColors: true,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const lines = new THREE.LineSegments(lGeo, lMat);
        group.add(lines);

        // --- cursor (world-space, only while over the hero) ---
        const mouse = { x: 999, y: 999, active: false };
        const onMove = (e) => {
          const r = mount.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width;
          const ny = (e.clientY - r.top) / r.height;
          if (nx < 0 || nx > 1 || ny < 0 || ny > 1) {
            mouse.active = false;
            return;
          }
          mouse.x = (nx * 2 - 1) * aspect;
          mouse.y = -(ny * 2 - 1);
          mouse.active = true;
        };
        window.addEventListener("pointermove", onMove, { passive: true });

        // --- visibility pause ---
        const io = new IntersectionObserver(
          ([entry]) => {
            running = entry.isIntersecting;
            if (running) animate();
          },
          { threshold: 0.01 }
        );
        io.observe(mount);

        // --- resize ---
        const onResize = () => {
          W = mount.clientWidth;
          H = mount.clientHeight;
          aspect = W / H || 1;
          camera.left = -aspect;
          camera.right = aspect;
          camera.updateProjectionMatrix();
          renderer.setSize(W, H);
        };
        window.addEventListener("resize", onResize);

        const link = AZURE.clone();
        function animate() {
          if (!running || disposed) return;
          raf = requestAnimationFrame(animate);

          // drift + edge bounce
          for (let i = 0; i < N; i++) {
            const n = nodes[i];
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < -aspect || n.x > aspect) n.vx *= -1;
            if (n.y < -1 || n.y > 1) n.vy *= -1;
            pPos[i * 3] = n.x;
            pPos[i * 3 + 1] = n.y;
            pPos[i * 3 + 2] = 0;
          }
          pGeo.attributes.position.needsUpdate = true;

          // subtle cursor parallax of the whole field
          group.position.x += ((mouse.active ? mouse.x * 0.05 : 0) - group.position.x) * 0.06;
          group.position.y += ((mouse.active ? mouse.y * 0.05 : 0) - group.position.y) * 0.06;

          // rebuild links
          let seg = 0;
          const push = (x1, y1, x2, y2, intensity) => {
            const o = seg * 6;
            lPos[o] = x1; lPos[o + 1] = y1; lPos[o + 2] = 0;
            lPos[o + 3] = x2; lPos[o + 4] = y2; lPos[o + 5] = 0;
            const r = link.r * intensity, g = link.g * intensity, b = link.b * intensity;
            lCol[o] = r; lCol[o + 1] = g; lCol[o + 2] = b;
            lCol[o + 3] = r; lCol[o + 4] = g; lCol[o + 5] = b;
            seg++;
          };
          for (let i = 0; i < N; i++) {
            const a = nodes[i];
            for (let j = i + 1; j < N; j++) {
              const b = nodes[j];
              const dx = a.x - b.x;
              const dy = a.y - b.y;
              const d = Math.hypot(dx, dy);
              if (d < LINK) push(a.x, a.y, b.x, b.y, (1 - d / LINK) * 0.6);
            }
            if (mouse.active) {
              const dx = a.x - mouse.x;
              const dy = a.y - mouse.y;
              const d = Math.hypot(dx, dy);
              const MR = LINK * 1.5;
              if (d < MR) push(a.x, a.y, mouse.x, mouse.y, (1 - d / MR) * 0.9);
            }
          }
          lGeo.setDrawRange(0, seg * 2);
          lGeo.attributes.position.needsUpdate = true;
          lGeo.attributes.color.needsUpdate = true;

          renderer.render(scene, camera);
        }
        animate();

        cleanup = () => {
          cancelAnimationFrame(raf);
          io.disconnect();
          window.removeEventListener("resize", onResize);
          window.removeEventListener("pointermove", onMove);
          pGeo.dispose();
          pMat.dispose();
          lGeo.dispose();
          lMat.dispose();
          renderer.dispose();
          if (renderer.domElement.parentNode === mount)
            mount.removeChild(renderer.domElement);
        };
      })
      .catch(() => {});

    const cancelGate = onReadyFor3D(mount, init, { mode: "idle" });

    return () => {
      disposed = true;
      cancelGate();
      cleanup();
    };
  }, [density]);

  return (
    <div
      ref={mountRef}
      className={`${styles.bg} ${className}`}
      aria-hidden="true"
    />
  );
};

export default ConstellationBg;
