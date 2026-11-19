#!/usr/bin/env node
/**
 * Photo walkthrough: ordered still photos → one continuous clip.
 *
 *   node scripts/walkthrough.mjs <photos-dir> <out.mp4> [--seconds 2.5] [--fade 0.6]
 *        [--width 1920] [--height 1080] [--fps 24] [--zoom 0.1] [--supersample 3]
 *
 * The photo order IS the camera path: files are taken in natural filename order
 * (01-entrance.jpg, 02-living.jpg, … hero room last). Each photo gets a slow
 * push-in or pull-back with a slight sideways drift, and consecutive photos
 * cross-fade. Every pixel comes from the photos themselves — nothing is
 * generated — so a walkthrough of a real listing needs no "AI" label.
 *
 * Feed the result to the frames pipeline. Scroll-scrubbing doesn't need 24 fps,
 * and --fps 12 halves the payload:
 *   node scripts/frames.mjs <out.mp4> <slug> --fps 12
 *
 * Landscape photos work best (each is cover-cropped to --width × --height).
 * Requires system ffmpeg (override the binary with FFMPEG_PATH).
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const FFMPEG = process.env.FFMPEG_PATH || "ffmpeg";
const PHOTO_RE = /\.(jpe?g|png|webp)$/i;
const MAX_PHOTOS = 40;

const USAGE =
  "Usage: node scripts/walkthrough.mjs <photos-dir> <out.mp4> [--seconds 2.5] [--fade 0.6] [--width 1920] [--height 1080] [--fps 24] [--zoom 0.1] [--supersample 3]";

class UsageError extends Error {}

export function parseArgs(argv) {
  const opts = { seconds: 2.5, fade: 0.6, width: 1920, height: 1080, fps: 24, zoom: 0.1, supersample: 3 };
  const numeric = {
    "--seconds": "seconds",
    "--fade": "fade",
    "--width": "width",
    "--height": "height",
    "--fps": "fps",
    "--zoom": "zoom",
    "--supersample": "supersample",
  };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-h" || a === "--help") throw new UsageError(USAGE);
    if (a in numeric) {
      const v = argv[++i];
      if (v === undefined) throw new UsageError(`Missing value for ${a}\n${USAGE}`);
      const n = Number(v);
      if (!Number.isFinite(n) || n <= 0) throw new UsageError(`${a} must be a positive number`);
      opts[numeric[a]] = n;
    } else if (a.startsWith("--")) {
      throw new UsageError(`Unknown option ${a}\n${USAGE}`);
    } else positional.push(a);
  }
  if (positional.length !== 2) throw new UsageError(USAGE);
  if (opts.fade >= opts.seconds) throw new UsageError("--fade must be shorter than --seconds");
  if (opts.zoom > 0.5) throw new UsageError("--zoom must be 0.5 or less");
  // H.264 needs even dimensions.
  opts.width = Math.round(opts.width / 2) * 2;
  opts.height = Math.round(opts.height / 2) * 2;
  opts.fps = Math.round(opts.fps);
  opts.supersample = Math.min(4, Math.max(1, Math.round(opts.supersample)));
  return { dir: path.resolve(positional[0]), out: path.resolve(positional[1]), ...opts };
}

/** Natural filename order, so 2.jpg sorts before 10.jpg. */
export function sortPhotos(names) {
  return names
    .filter((n) => PHOTO_RE.test(n) && !n.startsWith("."))
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true, sensitivity: "base" }));
}

/** Timing for `count` photos: frames per shot, cross-fade offsets and total length. */
export function planShots(count, { seconds, fade, fps }) {
  const frames = Math.max(2, Math.round(seconds * fps));
  const shot = frames / fps;
  const step = shot - fade;
  const offsets = Array.from({ length: Math.max(0, count - 1) }, (_, i) => +((i + 1) * step).toFixed(4));
  return { frames, shot, offsets, total: +(count * shot - (count - 1) * fade).toFixed(4) };
}

/** ffmpeg filter graph: per-photo pan/zoom, then a chain of cross-fades into [out]. */
export function buildFilter(count, opts) {
  const { width: w, height: h, fps, zoom, fade, supersample } = opts;
  const { frames, offsets } = planShots(count, opts);
  const sw = w * supersample;
  const sh = h * supersample;
  const t = `(on/${frames - 1})`;
  const parts = [];
  for (let i = 0; i < count; i++) {
    // Even shots push in, odd shots pull back; drift alternates left/right.
    const z = i % 2 === 0 ? `1+${zoom}*${t}` : `1+${zoom}*(1-${t})`;
    const drift = i % 4 < 2 ? 0.3 : -0.3;
    const x = `(iw-iw/zoom)*(0.5+${drift}*(${t}-0.5))`;
    parts.push(
      `[${i}:v]scale=${sw}:${sh}:force_original_aspect_ratio=increase:flags=lanczos,crop=${sw}:${sh},setsar=1,` +
        `zoompan=z='${z}':x='${x}':y='(ih-ih/zoom)/2':d=${frames}:s=${w}x${h}:fps=${fps},` +
        `format=yuv420p,settb=AVTB[v${i}]`
    );
  }
  let last = "v0";
  for (let i = 1; i < count; i++) {
    const label = i === count - 1 ? "out" : `x${i}`;
    parts.push(`[${last}][v${i}]xfade=transition=fade:duration=${fade}:offset=${offsets[i - 1]}[${label}]`);
    last = label;
  }
  if (count === 1) parts.push("[v0]null[out]");
  return parts.join(";");
}

function run(args) {
  return new Promise((resolve, reject) => {
    let stderr = "";
    let child;
    try {
      child = spawn(FFMPEG, args, { stdio: ["ignore", "ignore", "pipe"] });
    } catch (err) {
      reject(err);
      return;
    }
    child.stderr.on("data", (d) => (stderr += d));
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`ffmpeg exited with code ${code}\n${stderr.trim()}`))
    );
  });
}

async function checkFfmpeg() {
  try {
    await run(["-hide_banner", "-version"]);
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new UsageError(
        `ffmpeg not found (looked for "${FFMPEG}"). Install it (e.g. "brew install ffmpeg" or "apt install ffmpeg") or set FFMPEG_PATH.`
      );
    }
    throw err;
  }
}

export async function main(argv) {
  const opts = parseArgs(argv);
  if (!existsSync(opts.dir) || !(await stat(opts.dir)).isDirectory()) {
    throw new UsageError(`Photos folder not found: ${opts.dir}`);
  }
  const photos = sortPhotos(await readdir(opts.dir));
  if (photos.length < 2) throw new UsageError(`Need at least 2 photos (jpg, png or webp) in ${opts.dir}`);
  if (photos.length > MAX_PHOTOS) throw new UsageError(`Too many photos (${photos.length}); the limit is ${MAX_PHOTOS}`);
  await checkFfmpeg();

  const plan = planShots(photos.length, opts);
  console.log(`→ ${photos.length} photos, in this order (the camera path):`);
  photos.forEach((p, i) => console.log(`   ${String(i + 1).padStart(2, " ")}. ${p}`));

  await mkdir(path.dirname(opts.out), { recursive: true });
  const inputs = photos.flatMap((p) => ["-i", path.join(opts.dir, p)]);
  await run([
    "-hide_banner", "-loglevel", "error", "-y",
    ...inputs,
    "-filter_complex", buildFilter(photos.length, opts),
    "-map", "[out]",
    "-an",
    "-r", String(opts.fps),
    "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    opts.out,
  ]);

  const bytes = (await stat(opts.out)).size;
  console.log(
    `\n${path.relative(process.cwd(), opts.out) || opts.out}: ${plan.total.toFixed(1)} s at ${opts.width}×${opts.height}, ${opts.fps} fps (${(bytes / 1024 / 1024).toFixed(2)} MB)`
  );
  console.log(`Next: node scripts/frames.mjs ${path.relative(process.cwd(), opts.out) || opts.out} <slug> --fps 12`);
  return { photos, ...plan };
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  main(process.argv.slice(2)).catch((err) => {
    console.error(err instanceof UsageError ? err.message : `walkthrough.mjs failed: ${err.message}`);
    process.exit(err instanceof UsageError ? 2 : 1);
  });
}
