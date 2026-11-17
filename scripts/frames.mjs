#!/usr/bin/env node
/**
 * Frames pipeline for <ScrollSequence>.
 *
 *   node scripts/frames.mjs <input-video> <slug> [--fps 24] [--width 1920]
 *        [--mobile-width 900] [--quality 72] [--out public/demos]
 *
 * Writes into <out>/<slug>/:
 *   f_0001.webp …        desktop frames (max --width wide, never upscaled)
 *   m/f_0001.webp …      mobile frames (max --mobile-width wide)
 *   poster.webp          first desktop frame
 *   fallback.mp4         H.264, no audio, +faststart (reduced-motion fallback)
 *   manifest.json        { slug, count, width, height, frames, framesMobile, poster, video }
 *
 * Paths in the manifest are relative to manifest.json. Requires system ffmpeg
 * (override the binary with FFMPEG_PATH). The <slug>/ directory is replaced.
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { copyFile, mkdir, open, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FFMPEG = process.env.FFMPEG_PATH || "ffmpeg";
const DESKTOP_WARN_BYTES = 25 * 1024 * 1024;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const USAGE =
  "Usage: node scripts/frames.mjs <input-video> <slug> [--fps 24] [--width 1920] [--mobile-width 900] [--quality 72] [--out public/demos]";

class UsageError extends Error {}

export function parseArgs(argv) {
  const opts = { fps: 24, width: 1920, mobileWidth: 900, quality: 72, out: path.join(ROOT, "public", "demos") };
  const positional = [];
  const numeric = { "--fps": "fps", "--width": "width", "--mobile-width": "mobileWidth", "--quality": "quality" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-h" || a === "--help") throw new UsageError(USAGE);
    if (a in numeric || a === "--out") {
      const v = argv[++i];
      if (v === undefined) throw new UsageError(`Missing value for ${a}\n${USAGE}`);
      if (a === "--out") opts.out = path.resolve(v);
      else {
        const n = Number(v);
        if (!Number.isFinite(n) || n <= 0) throw new UsageError(`${a} must be a positive number`);
        opts[numeric[a]] = n;
      }
    } else if (a.startsWith("--")) {
      throw new UsageError(`Unknown option ${a}\n${USAGE}`);
    } else positional.push(a);
  }
  if (positional.length !== 2) throw new UsageError(USAGE);
  const [input, slug] = positional;
  if (!SLUG_RE.test(slug)) throw new UsageError(`Invalid slug "${slug}" — use lowercase letters, digits and hyphens`);
  if (opts.quality > 100) throw new UsageError("--quality must be 1–100");
  opts.width = Math.round(opts.width);
  opts.mobileWidth = Math.round(opts.mobileWidth);
  return { input: path.resolve(input), slug, ...opts };
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

/** Width/height from a WebP file header (VP8, VP8L or VP8X). */
export async function webpSize(file) {
  const fh = await open(file, "r");
  try {
    const buf = Buffer.alloc(30);
    await fh.read(buf, 0, 30, 0);
    if (buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WEBP") {
      throw new Error(`${file} is not a WebP file`);
    }
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8 ") return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    if (chunk === "VP8L") {
      const bits = buf.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (chunk === "VP8X") return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
    throw new Error(`${file}: unknown WebP chunk ${chunk}`);
  } finally {
    await fh.close();
  }
}

const scale = (w) => `scale='min(${w},iw)':-2:flags=lanczos`;

const webpArgs = (input, fps, width, quality, pattern) => [
  "-hide_banner", "-loglevel", "error", "-y",
  "-i", input,
  "-an",
  "-vf", `fps=${fps},${scale(width)}`,
  "-c:v", "libwebp", "-quality", String(quality), "-compression_level", "4",
  pattern,
];

async function sizeOf(files) {
  let total = 0;
  for (const f of files) total += (await stat(f)).size;
  return total;
}

const mb = (b) => `${(b / 1024 / 1024).toFixed(2)} MB`;

async function listFrames(dir) {
  return (await readdir(dir)).filter((f) => /^f_\d{4,}\.webp$/.test(f)).sort();
}

export async function main(argv) {
  const opts = parseArgs(argv);
  if (!existsSync(opts.input)) throw new UsageError(`Input video not found: ${opts.input}`);
  await checkFfmpeg();

  const dir = path.join(opts.out, opts.slug);
  const mDir = path.join(dir, "m");
  await rm(dir, { recursive: true, force: true });
  await mkdir(mDir, { recursive: true });

  console.log(`→ desktop frames (${opts.fps} fps, ≤${opts.width}px, q${opts.quality})`);
  await run(webpArgs(opts.input, opts.fps, opts.width, opts.quality, path.join(dir, "f_%04d.webp")));
  console.log(`→ mobile frames (≤${opts.mobileWidth}px)`);
  await run(webpArgs(opts.input, opts.fps, opts.mobileWidth, opts.quality, path.join(mDir, "f_%04d.webp")));
  console.log("→ fallback.mp4");
  await run([
    "-hide_banner", "-loglevel", "error", "-y",
    "-i", opts.input,
    "-an",
    "-vf", scale(opts.width),
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "26", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    path.join(dir, "fallback.mp4"),
  ]);

  const frames = await listFrames(dir);
  const framesMobile = (await listFrames(mDir)).map((f) => `m/${f}`);
  if (!frames.length) throw new Error("ffmpeg produced no frames — is the input a valid video?");
  await copyFile(path.join(dir, frames[0]), path.join(dir, "poster.webp"));
  const { width, height } = await webpSize(path.join(dir, frames[0]));

  const manifest = {
    slug: opts.slug,
    count: frames.length,
    width,
    height,
    frames,
    framesMobile,
    poster: "poster.webp",
    video: "fallback.mp4",
  };
  await writeFile(path.join(dir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

  const desktopBytes = await sizeOf(frames.map((f) => path.join(dir, f)));
  const mobileBytes = await sizeOf(framesMobile.map((f) => path.join(dir, f)));
  const videoBytes = await sizeOf([path.join(dir, "fallback.mp4")]);
  console.log(`\n${opts.slug}: ${frames.length} frames at ${width}×${height} → ${path.relative(process.cwd(), dir) || dir}`);
  console.log(`  desktop frames ${mb(desktopBytes)} · mobile frames ${mb(mobileBytes)} · fallback.mp4 ${mb(videoBytes)}`);
  console.log(`  total payload  ${mb(desktopBytes + mobileBytes + videoBytes)}`);
  if (desktopBytes > DESKTOP_WARN_BYTES) {
    console.warn(
      `  WARNING: desktop frames exceed ${mb(DESKTOP_WARN_BYTES)}. Lower --fps, --width or --quality, or shorten the clip.`
    );
  }
  return manifest;
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  main(process.argv.slice(2)).catch((err) => {
    console.error(err instanceof UsageError ? err.message : `frames.mjs failed: ${err.message}`);
    process.exit(err instanceof UsageError ? 2 : 1);
  });
}
