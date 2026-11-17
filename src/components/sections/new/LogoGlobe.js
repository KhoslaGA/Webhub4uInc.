"use client";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onReadyFor3D } from "./defer3d";
import styles from "./LogoGlobe.module.css";

/**
 * The Webhub4U globe mark as a 3D object — the site's signature moment.
 *
 *  - ~3k particles start scattered in a diffuse cloud and IMPLODE into a
 *    fibonacci-sphere globe + two tilted "swoosh" rings, staggered per particle.
 *  - The assembly is driven 100% on the GPU: a ShaderMaterial mixes each
 *    particle from its scattered start → home position by a single `uProgress`
 *    uniform, so there is zero per-particle CPU work — smooth on mobile.
 *  - Once assembled, the orange comet fades in and orbits the main ring.
 *
 * Two variants:
 *  - `cta` (default): assembly is scrubbed by the globe's OWN ScrollTrigger as
 *    it scrolls into view (used in the closing CTA).
 *  - `hero`: the anchored hero centerpiece. Assembles once on load, then the
 *    parent feeds hero-scroll progress (0→1) via the imperative `setScroll`
 *    handle — the globe rotates further, the camera eases in, and the whole
 *    thing fades out as the hero hands off to the next section.
 *
 * Perf/discipline (per CLAUDE.md): DPR capped, particle count scaled down on
 * mobile, RAF paused off-screen, WebGL guarded in try/catch. Reduced-motion
 * renders a single static, fully-assembled frame (no motion, never blank).
 */

const VERT = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uFade;
  attribute vec3 aStart;
  attribute float aDelay;
  attribute float aScale;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vAlpha;
  const float STAG = 0.55;
  void main() {
    // staggered, eased assembly factor 0 → 1
    float raw = clamp((uProgress - aDelay * STAG) / (1.0 - STAG), 0.0, 1.0);
    float a = 1.0 - pow(1.0 - raw, 3.0); // easeOutCubic — a firm "lock in"
    vec3 pos = mix(aStart, position, a);
    float twinkle = 0.8 + 0.2 * sin(uTime * 1.6 + aDelay * 24.0);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aScale * (0.35 + 0.65 * a) * uPixelRatio * (1.0 / -mv.z);
    // depth shading — front hemisphere reads brighter than the back
    float df = clamp((mv.z + 10.5) / 4.5, 0.28, 1.0);
    vColor = aColor;
    vAlpha = a * twinkle * df * uFade;
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float mask = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, mask * vAlpha * 0.7);
  }
`;

// smoothstep on the CPU side (used for the hero fade handoff)
const smooth01 = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const LogoGlobe = forwardRef(({ size = 460, variant = "cta" }, ref) => {
  const mountRef = useRef(null);
  const progressRef = useRef(0); // assembly progress (0→1)
  const heroScrollRef = useRef(0); // hero-scroll progress fed by the parent

  // Parent (the pinned hero) writes normalized scroll progress here.
  useImperativeHandle(
    ref,
    () => ({
      setScroll: (p) => {
        heroScrollRef.current = p;
      },
    }),
    []
  );

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const hero = variant === "hero";

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let disposed = false;
    let running = true;
    let raf;
    let cleanup = () => {};

    const init = () =>
      import("three")
      .then((THREE) => {
        if (disposed) return;

        const isMobile =
          Math.min(window.innerWidth, window.innerHeight) < 720 ||
          window.matchMedia("(pointer: coarse)").matches;

        // --- Renderer / scene / camera ---
        let renderer;
        try {
          renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        } catch {
          return; // no WebGL — CSS glow remains
        }
        const dpr = Math.min(window.devicePixelRatio, 1.5);
        renderer.setPixelRatio(dpr);
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);
        const CAM_Z = 8.2;
        const CAM_Y = 0.35;
        camera.position.set(0, CAM_Y, CAM_Z);

        const group = new THREE.Group();
        scene.add(group);

        // Sampled straight from the logo: core azure, bright chrome glint,
        // and the mark's deep-navy shadow. Comet keeps the site's orange.
        const AZURE = new THREE.Color(0x15a9dd); // brand azure (--wh-accent-2)
        const AZURE_HI = new THREE.Color(0x6fdcf5); // bright chrome-cyan glint
        const AZURE_DIM = new THREE.Color(0x0f375b); // logo shadow navy
        const ORANGE = new THREE.Color(0xff4d1c);

        const R = 2.15;
        const RING1_R = R * 1.35;
        const RING1_TILT = Math.PI / 2.4;
        const RING2_R = R * 1.5;
        const RING2_TILT = Math.PI / 2.15;

        // --- Particle buffers ---
        const COUNT = isMobile ? 1700 : 3200;
        const RING_FRAC = 0.3;
        const ringCount = Math.floor(COUNT * RING_FRAC);
        const globeCount = COUNT - ringCount;

        const home = new Float32Array(COUNT * 3);
        const start = new Float32Array(COUNT * 3);
        const delay = new Float32Array(COUNT);
        const scale = new Float32Array(COUNT);
        const color = new Float32Array(COUNT * 3);

        const tmp = new THREE.Vector3();
        const xAxis = new THREE.Vector3(1, 0, 0);
        const setHome = (i, v) => {
          home[i * 3] = v.x;
          home[i * 3 + 1] = v.y;
          home[i * 3 + 2] = v.z;
        };
        const setCol = (i, c) => {
          color[i * 3] = c.r;
          color[i * 3 + 1] = c.g;
          color[i * 3 + 2] = c.b;
        };
        const scatter = (i) => {
          // random direction on a big diffuse shell → implosion look
          const u = Math.random();
          const vv = Math.random();
          const theta = 2 * Math.PI * u;
          const phi = Math.acos(2 * vv - 1);
          const rr = R * (2.6 + Math.random() * 3.6);
          start[i * 3] = Math.sin(phi) * Math.cos(theta) * rr;
          start[i * 3 + 1] = Math.cos(phi) * rr;
          start[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * rr;
          delay[i] = Math.random();
        };

        // Globe surface — fibonacci sphere (even coverage)
        const golden = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < globeCount; i++) {
          const y = 1 - (i / (globeCount - 1)) * 2;
          const rad = Math.sqrt(Math.max(0, 1 - y * y));
          const th = golden * i;
          tmp.set(Math.cos(th) * rad, y, Math.sin(th) * rad).multiplyScalar(R);
          setHome(i, tmp);
          // azure gradient, poles dimmer, a few bright sparks
          const c = AZURE.clone().lerp(AZURE_DIM, Math.abs(y) * 0.5);
          if (Math.random() > 0.9) c.lerp(AZURE_HI, 0.6);
          setCol(i, c);
          scale[i] = 0.7 + Math.random() * 0.7;
          scatter(i);
        }

        // Two swoosh rings — dense particle bands
        for (let k = 0; k < ringCount; k++) {
          const i = globeCount + k;
          const onFirst = k % 2 === 0;
          const rr = onFirst ? RING1_R : RING2_R;
          const tilt = onFirst ? RING1_TILT : RING2_TILT;
          const ang = Math.random() * Math.PI * 2;
          const jitter = (Math.random() - 0.5) * 0.06 * R;
          tmp
            .set(
              Math.cos(ang) * (rr + jitter),
              (Math.random() - 0.5) * 0.05 * R,
              Math.sin(ang) * (rr + jitter)
            )
            .applyAxisAngle(xAxis, tilt);
          setHome(i, tmp);
          const c = (onFirst ? AZURE_HI : AZURE).clone();
          setCol(i, c);
          scale[i] = onFirst ? 0.9 + Math.random() * 0.5 : 0.65 + Math.random() * 0.4;
          scatter(i);
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(home, 3));
        geo.setAttribute("aStart", new THREE.BufferAttribute(start, 3));
        geo.setAttribute("aDelay", new THREE.BufferAttribute(delay, 1));
        geo.setAttribute("aScale", new THREE.BufferAttribute(scale, 1));
        geo.setAttribute("aColor", new THREE.BufferAttribute(color, 3));

        // Size scales off the live canvas width, so the hero (fluid, large)
        // and CTA (fixed px) instances both read correctly.
        const dim = mount.clientWidth || size;
        const baseSize = (isMobile ? 22 : 26) * (dim / 420);
        const mat = new THREE.ShaderMaterial({
          uniforms: {
            uProgress: { value: reduce ? 1 : 0 },
            uTime: { value: 0 },
            uSize: { value: baseSize },
            uPixelRatio: { value: dpr },
            uFade: { value: 1 },
          },
          vertexShader: VERT,
          fragmentShader: FRAG,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const points = new THREE.Points(geo, mat);
        points.frustumCulled = false;
        group.add(points);

        // --- Orange comet + trail (appear once assembled) ---
        const comet = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 16, 16),
          new THREE.MeshBasicMaterial({ color: ORANGE, transparent: true, opacity: 0 })
        );
        group.add(comet);

        const TRAIL = 26;
        const trailGeo = new THREE.BufferGeometry();
        trailGeo.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(new Float32Array(TRAIL * 3), 3)
        );
        const trailMat = new THREE.PointsMaterial({
          color: ORANGE,
          size: 0.07,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const trail = new THREE.Points(trailGeo, trailMat);
        group.add(trail);
        const trailPts = [];

        const cometAt = (ang) =>
          tmp
            .set(Math.cos(ang) * RING1_R, 0, Math.sin(ang) * RING1_R)
            .applyAxisAngle(xAxis, RING1_TILT)
            .clone();

        // --- Cursor parallax ---
        // Hero listens on the window (its canvas is a pointer-transparent
        // background layer); the CTA listens on its own element.
        const target = { x: 0, y: 0 };
        const onMove = (e) => {
          const r = mount.getBoundingClientRect();
          target.x = ((e.clientX - r.left) / r.width - 0.5) * 0.5;
          target.y = ((e.clientY - r.top) / r.height - 0.5) * 0.35;
        };
        const onLeave = () => {
          target.x = 0;
          target.y = 0;
        };

        const onResize = () => {
          renderer.setSize(mount.clientWidth, mount.clientHeight);
          camera.aspect = mount.clientWidth / mount.clientHeight;
          camera.updateProjectionMatrix();
        };
        window.addEventListener("resize", onResize);
        onResize();

        // ---- Reduced motion: one static, fully-assembled frame ----
        if (reduce) {
          group.rotation.y = -0.5;
          comet.material.opacity = 1;
          comet.position.copy(cometAt(0.6));
          renderer.render(scene, camera);
          cleanup = () => {
            window.removeEventListener("resize", onResize);
            geo.dispose();
            mat.dispose();
            comet.geometry.dispose();
            comet.material.dispose();
            trailGeo.dispose();
            trailMat.dispose();
            renderer.dispose();
            if (renderer.domElement.parentNode === mount)
              mount.removeChild(renderer.domElement);
          };
          return;
        }

        const moveTarget = hero ? window : mount;
        moveTarget.addEventListener("pointermove", onMove);
        if (!hero) mount.addEventListener("pointerleave", onLeave);

        // --- Assembly driver ---
        // hero: assemble once on load, then scroll drives motion/fade.
        // cta:  the globe's own ScrollTrigger scrubs the assembly on entry.
        let st;
        let introTween;
        if (hero) {
          introTween = gsap.to(progressRef, {
            current: 1,
            duration: 1.5,
            ease: "power2.out",
            delay: 0.15,
          });
        } else {
          gsap.registerPlugin(ScrollTrigger);
          st = ScrollTrigger.create({
            trigger: mount,
            start: "top 85%",
            end: "top 38%",
            scrub: 1,
            onUpdate: (self) => {
              progressRef.current = self.progress;
            },
          });
          if (document.fonts?.ready) {
            document.fonts.ready.then(() => ScrollTrigger.refresh());
          }
        }

        // --- Off-screen pause ---
        const io = new IntersectionObserver(
          ([entry]) => {
            running = entry.isIntersecting;
            if (running) animate();
          },
          { threshold: 0.02 }
        );
        io.observe(mount);

        // --- Render loop ---
        const clock = new THREE.Clock();
        let elapsed = 0;
        let cometAng = 0;
        let prog = 0;

        function animate() {
          if (!running || disposed) return;
          raf = requestAnimationFrame(animate);
          const dt = Math.min(clock.getDelta(), 0.05);
          elapsed += dt;

          // ease uniform toward assembly progress for extra silk
          prog += (progressRef.current - prog) * 0.14;
          mat.uniforms.uProgress.value = prog;
          mat.uniforms.uTime.value = elapsed;

          const heroS = hero ? heroScrollRef.current : 0;

          // steady spin + cursor parallax; hero adds scroll-driven rotation
          group.rotation.y = elapsed * 0.16 + target.x + heroS * 1.3;
          group.rotation.x += (target.y - group.rotation.x) * 0.05;

          // hero handoff: ease the camera in and dissolve as we scroll past
          let fade = 1;
          if (hero) {
            camera.position.z = CAM_Z - heroS * 1.7;
            camera.position.y = CAM_Y + heroS * 0.5;
            camera.lookAt(0, heroS * 0.25, 0);
            group.scale.setScalar(1 - heroS * 0.1);
            fade = 1 - smooth01(0.55, 1.0, heroS);
            mat.uniforms.uFade.value = fade;
          }

          // comet orbits only once assembled
          const assembled = Math.min(1, Math.max(0, (prog - 0.82) / 0.18));
          comet.material.opacity = assembled * fade;
          trailMat.opacity = assembled * 0.55 * fade;
          comet.visible = assembled > 0.01 && fade > 0.01;
          trail.visible = comet.visible;
          if (assembled > 0.5) {
            cometAng += dt * 0.95;
            const p = cometAt(cometAng);
            comet.position.copy(p);
            trailPts.unshift(p);
            if (trailPts.length > TRAIL) trailPts.pop();
            const tp = trailGeo.attributes.position.array;
            for (let i = 0; i < TRAIL; i++) {
              const v = trailPts[i] || p;
              tp[i * 3] = v.x;
              tp[i * 3 + 1] = v.y;
              tp[i * 3 + 2] = v.z;
            }
            trailGeo.attributes.position.needsUpdate = true;
          }

          renderer.render(scene, camera);
        }
        animate();

        cleanup = () => {
          cancelAnimationFrame(raf);
          st?.kill();
          introTween?.kill();
          io.disconnect();
          window.removeEventListener("resize", onResize);
          moveTarget.removeEventListener("pointermove", onMove);
          if (!hero) mount.removeEventListener("pointerleave", onLeave);
          geo.dispose();
          mat.dispose();
          comet.geometry.dispose();
          comet.material.dispose();
          trailGeo.dispose();
          trailMat.dispose();
          renderer.dispose();
          if (renderer.domElement.parentNode === mount)
            mount.removeChild(renderer.domElement);
        };
      })
      .catch(() => {});

    const cancelGate = onReadyFor3D(mount, init, { mode: hero ? "idle" : "visible" });

    return () => {
      disposed = true;
      cancelGate();
      cleanup();
    };
  }, [size, variant]);

  return (
    <div
      ref={mountRef}
      className={variant === "hero" ? styles.heroGlobe : styles.globe}
      style={variant === "hero" ? undefined : { width: size, height: size }}
      aria-hidden="true"
    />
  );
});

LogoGlobe.displayName = "LogoGlobe";

export default LogoGlobe;
