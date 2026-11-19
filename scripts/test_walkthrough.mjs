import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildFilter, planShots, sortPhotos } from "./walkthrough.mjs";

const SCRIPT = path.join(path.dirname(fileURLToPath(import.meta.url)), "walkthrough.mjs");
const FFMPEG = process.env.FFMPEG_PATH || "ffmpeg";
const hasFfmpeg = spawnSync(FFMPEG, ["-version"], { stdio: "ignore" }).status === 0;
const runScript = (args) => spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8" });

test("photo order is natural filename order and ignores non-photos", () => {
  assert.deepEqual(sortPhotos(["10-hero.jpg", "2-living.JPG", "1-entrance.png", "notes.txt", ".DS_Store", "3-kitchen.webp"]), [
    "1-entrance.png",
    "2-living.JPG",
    "3-kitchen.webp",
    "10-hero.jpg",
  ]);
});

test("shot plan: cross-fades overlap, so total is shorter than the sum of shots", () => {
  const plan = planShots(4, { seconds: 2.5, fade: 0.5, fps: 24 });
  assert.equal(plan.frames, 60);
  assert.deepEqual(plan.offsets, [2, 4, 6]);
  assert.equal(plan.total, 8.5);
  const filter = buildFilter(4, { seconds: 2.5, fade: 0.5, fps: 24, width: 640, height: 360, zoom: 0.1, supersample: 2 });
  assert.equal(filter.match(/zoompan=/g).length, 4);
  assert.equal(filter.match(/xfade=/g).length, 3);
  assert.match(filter, /\[out\]$/);
});

test("walkthrough script rejects bad usage before touching ffmpeg", () => {
  assert.equal(runScript([]).status, 2);
  const missing = runScript([path.join(tmpdir(), "wh-no-such-folder"), "out.mp4"]);
  assert.equal(missing.status, 2);
  assert.match(missing.stderr, /not found/);
  const badFade = runScript(["photos", "out.mp4", "--seconds", "1", "--fade", "1"]);
  assert.equal(badFade.status, 2);
  assert.match(badFade.stderr, /--fade/);
});

test("walkthrough script renders ordered photos into one clip", { skip: !hasFfmpeg && "ffmpeg not installed" }, () => {
  const dir = mkdtempSync(path.join(tmpdir(), "wh-walk-"));
  try {
    const photos = path.join(dir, "photos");
    mkdirSync(photos);
    for (const [i, src] of ["testsrc2", "smptebars", "rgbtestsrc"].entries()) {
      const gen = spawnSync(FFMPEG, ["-hide_banner", "-loglevel", "error", "-y", "-f", "lavfi", "-i", `${src}=size=800x600`, "-frames:v", "1", path.join(photos, `${i + 1}.png`)]);
      assert.equal(gen.status, 0, String(gen.stderr));
    }

    const out = path.join(dir, "clip.mp4");
    const res = runScript([photos, out, "--seconds", "1", "--fade", "0.25", "--width", "320", "--height", "180", "--fps", "12", "--supersample", "2"]);
    assert.equal(res.status, 0, res.stderr);
    assert.match(res.stdout, /1\. 1\.png[\s\S]*3\. 3\.png/);
    assert.ok(existsSync(out) && statSync(out).size > 0, "clip missing or empty");

    // 3 shots × 1 s − 2 fades × 0.25 s = 2.5 s → 30 frames at 12 fps.
    const probe = spawnSync(FFMPEG, ["-hide_banner", "-i", out, "-map", "0:v", "-f", "null", "-"], { encoding: "utf8" });
    const frames = [...probe.stderr.matchAll(/frame=\s*(\d+)/g)].map((m) => Number(m[1])).at(-1);
    assert.equal(frames, 30);
    assert.match(probe.stderr, /320x180/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
