#!/usr/bin/env node
// Render a Lakehouse Analytics explainer scene (HTML + timeline.js) to GIF and MP4.
//
//   node render.mjs <scene.html> [--out <file.gif>] [--fps 15] [--mp4] [--frame 4.2]
//   node render.mjs --serve <scene.html>      # live preview in your browser
//
// The repo root is served over a local HTTP server, so scenes reference shared files with
// absolute paths: /skills/aibi-substack-gif/render/brand.css, .../timeline.js, and
// /brand/identity/logo-transparent-dark.svg. Uses your installed Google Chrome through
// playwright-core (no browser download). Needs ffmpeg; uses gifski if installed.

import { mkdir, rm, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { serve, urlPath } from "./serve.mjs";

const W = 1200, H = 675;

const args = process.argv.slice(2);
const flag = (name, dflt) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : dflt; };
const has = (name) => args.includes(name);
const VALUE_FLAGS = ["--out", "--fps", "--frame"];
const scene = args.find((a, i) => !a.startsWith("--") && !VALUE_FLAGS.includes(args[i - 1]));
if (!scene) { console.error("usage: node render.mjs <scene.html> [--out f.gif] [--fps 15] [--mp4] [--frame t] | --serve <scene.html>"); process.exit(1); }

const scenePath = path.resolve(scene);
const sceneUrlPath = urlPath(scenePath);

const server = await serve(has("--serve") ? 8765 : 0);
const base = `http://127.0.0.1:${server.address().port}`;
if (has("--serve")) {
  console.log(`Preview: ${base}${sceneUrlPath}  (Ctrl+C to stop)`);
} else {
  await render();
  server.close();
}

async function render() {
  const { chromium } = await import("playwright-core");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.goto(base + sceneUrlPath, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const sc = await page.evaluate(() => window.__scene);
  if (!sc) throw new Error("Scene did not load timeline.js (window.__scene missing)");

  const out = path.resolve(flag("--out", scenePath.replace(/\.html$/, ".gif")));
  const single = flag("--frame");
  if (single !== undefined) {
    await page.evaluate((t) => window.__seek(t), parseFloat(single));
    const png = out.replace(/\.gif$/, `@${single}s.png`);
    await page.screenshot({ path: png });
    console.log(`Frame ${single}s -> ${png}`);
    await browser.close();
    return;
  }

  const fps = parseInt(flag("--fps", sc.fps || 15), 10);
  const frames = Math.round(sc.duration * fps) + 1;
  const holdFrames = Math.round((sc.hold ?? 2) * fps);
  const dir = path.join(tmpdir(), `la-gif-${process.pid}`);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });

  for (let i = 0; i < frames + holdFrames; i++) {
    const t = Math.min(i / fps, sc.duration);
    if (i < frames) await page.evaluate((t) => window.__seek(t), t);
    await page.screenshot({ path: path.join(dir, `f${String(i).padStart(5, "0")}.png`) });
    if (i % fps === 0) process.stdout.write(`\rframes ${i}/${frames + holdFrames}`);
  }
  await browser.close();
  process.stdout.write("\n");

  const pattern = path.join(dir, "f%05d.png");
  let gifski = false;
  try { execFileSync("which", ["gifski"], { stdio: "ignore" }); gifski = true; } catch {}
  if (gifski) {
    execFileSync("gifski", ["--fps", String(fps), "--width", String(W), "--quality", "90", "-o", out,
      ...Array.from({ length: frames + holdFrames }, (_, i) => path.join(dir, `f${String(i).padStart(5, "0")}.png`))]);
  } else {
    // Two-pass palette: diff mode keeps the flat brand colors clean and the file small.
    execFileSync("ffmpeg", ["-v", "error", "-y", "-framerate", String(fps), "-i", pattern,
      "-vf", "split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle",
      "-loop", "0", out]);
  }
  if (has("--mp4")) {
    execFileSync("ffmpeg", ["-v", "error", "-y", "-framerate", String(fps), "-i", pattern,
      "-vf", "pad=ceil(iw/2)*2:ceil(ih/2)*2", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", out.replace(/\.gif$/, ".mp4")]);
  }
  await rm(dir, { recursive: true, force: true });
  const mb = ((await stat(out)).size / 1e6).toFixed(1);
  console.log(`GIF ${out} (${mb} MB, ${frames + holdFrames} frames @ ${fps} fps)`);
}
