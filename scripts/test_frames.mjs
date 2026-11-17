import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT = path.join(path.dirname(fileURLToPath(import.meta.url)), "frames.mjs");
const FFMPEG = process.env.FFMPEG_PATH || "ffmpeg";
const hasFfmpeg = spawnSync(FFMPEG, ["-version"], { stdio: "ignore" }).status === 0;
const runScript = (args) => spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8" });

test("frames script rejects bad usage before touching ffmpeg", () => {
  assert.equal(runScript([]).status, 2);
  const badSlug = runScript(["clip.mp4", "../escape"]);
  assert.equal(badSlug.status, 2);
  assert.match(badSlug.stderr, /Invalid slug/);
  const missing = runScript([path.join(tmpdir(), "does-not-exist.mp4"), "ok-slug"]);
  assert.equal(missing.status, 2);
  assert.match(missing.stderr, /not found/);
});

test("frames script writes frames, poster, fallback video and manifest", { skip: !hasFfmpeg && "ffmpeg not installed" }, () => {
  const dir = mkdtempSync(path.join(tmpdir(), "wh-frames-"));
  try {
    const clip = path.join(dir, "clip.mp4");
    const gen = spawnSync(FFMPEG, ["-hide_banner", "-loglevel", "error", "-y", "-f", "lavfi", "-i", "testsrc=duration=2:size=640x360:rate=24", "-pix_fmt", "yuv420p", clip]);
    assert.equal(gen.status, 0, String(gen.stderr));

    const out = path.join(dir, "demos");
    const res = runScript([clip, "test-clip", "--fps", "24", "--width", "480", "--mobile-width", "240", "--out", out]);
    assert.equal(res.status, 0, res.stderr);
    assert.match(res.stdout, /total payload/);

    const slugDir = path.join(out, "test-clip");
    const manifest = JSON.parse(readFileSync(path.join(slugDir, "manifest.json"), "utf8"));
    assert.deepEqual(Object.keys(manifest).sort(), ["count", "frames", "framesMobile", "height", "poster", "slug", "video", "width"]);
    assert.equal(manifest.slug, "test-clip");
    assert.equal(manifest.count, 48);
    assert.equal(manifest.frames.length, 48);
    assert.equal(manifest.framesMobile.length, 48);
    assert.equal(manifest.frames[0], "f_0001.webp");
    assert.equal(manifest.framesMobile[0], "m/f_0001.webp");
    assert.equal(manifest.width, 480);
    assert.equal(manifest.height, 270);
    for (const f of [manifest.frames.at(-1), manifest.framesMobile.at(-1), manifest.poster, manifest.video]) {
      assert.ok(existsSync(path.join(slugDir, f)), `${f} missing`);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
