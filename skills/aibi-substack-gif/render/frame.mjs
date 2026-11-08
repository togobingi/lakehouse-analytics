#!/usr/bin/env node
// Put a screen recording (GIF/MP4/MOV) into the Lakehouse Analytics brand frame: trim, scale into a
// window under a branded header, add an engine/product watermark and timed badges.
//
//   node frame.mjs <config.json>
//
// config.json (times are seconds in the SOURCE recording):
//   { "video": "~/Desktop/rec.gif", "start": 0.8, "end": 22.0, "hold": 3, "fps": 12,
//     "out": "issues/2026-10/assets/rt.gif",
//     "title": "Lakehouse|//RT",            // text after "|" is the Ember accent
//     "sub": "Sunny Bay dashboard, 58M rows", "label": "Lakehouse|//RT",
//     "badges": [{ "at": 5.9, "until": 6.9, "text": "data in <b>2.4 s</b>" }],
//     "speed": 2 }                          // optional: play the clip faster (hold stays real time)
//
// Layers are rendered from frame.html with your installed Chrome; ffmpeg composes and encodes.

import { readFile, mkdir, rm, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { tmpdir, homedir } from "node:os";
import path from "node:path";
import { serve, urlPath, ROOT } from "./serve.mjs";

const cfgPath = process.argv[2];
if (!cfgPath) { console.error("usage: node frame.mjs <config.json>"); process.exit(1); }
const cfg = JSON.parse(await readFile(cfgPath, "utf8"));
const W = cfg.width ?? 1200, H = cfg.height ?? 720;
const S = cfg.screen ?? { x: 40, y: 72, w: 1120, h: 630 };   // 16:9 window for the recording
const fps = cfg.fps ?? 12, hold = cfg.hold ?? 3, speed = cfg.speed ?? 1;
const video = cfg.video.replace(/^~/, homedir());
const out = path.resolve(ROOT, cfg.out);
const dir = path.join(tmpdir(), `la-frame-${process.pid}`);
await rm(dir, { recursive: true, force: true });
await mkdir(dir, { recursive: true });

// 1. Render the PNG layers.
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}${urlPath(path.join(ROOT, "skills/aibi-substack-gif/render/frame.html"))}`;
const { chromium } = await import("playwright-core");
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const geo = { w: W, h: H, sx: S.x, sy: S.y, sw: S.w, sh: S.h };
async function layer(file, params, clear) {
  await page.goto(`${base}?${new URLSearchParams({ ...geo, ...params })}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(dir, file), omitBackground: clear });
}
await layer("bg.png", { layer: "bg", title: cfg.title ?? "", sub: cfg.sub ?? "" }, false);
await layer("mark.png", { layer: "mark", label: cfg.label ?? cfg.title ?? "" }, true);
const badges = cfg.badges ?? [];
for (const [i, b] of badges.entries()) await layer(`badge${i}.png`, { layer: "badge", text: b.text }, true);
await browser.close();
server.close();

// 2. Compose with ffmpeg: bg <- trimmed + scaled recording <- watermark <- badges (timed), then hold the end.
const dur = (cfg.end - cfg.start) / speed;
const rel = (t) => (Math.max(0, t - cfg.start) / speed).toFixed(2);
const inputs = ["-loop", "1", "-i", path.join(dir, "bg.png"), "-i", video, "-loop", "1", "-i", path.join(dir, "mark.png")];
badges.forEach((_, i) => inputs.push("-loop", "1", "-i", path.join(dir, `badge${i}.png`)));
const f = [
  `[1:v]trim=start=${cfg.start}:end=${cfg.end},setpts=(PTS-STARTPTS)/${speed},fps=${fps},scale=${S.w}:${S.h}:flags=lanczos,format=rgba,tpad=stop_mode=clone:stop_duration=${hold}[rec]`,
  `[0:v][rec]overlay=${S.x}:${S.y}:shortest=1[s0]`,
  `[s0][2:v]overlay=0:0:shortest=1[s1]`,
];
badges.forEach((b, i) => {
  const until = b.until ?? cfg.end + hold * speed;
  f.push(`[s${i + 1}][${i + 3}:v]overlay=0:0:shortest=1:enable='between(t,${rel(b.at)},${rel(until)})'[s${i + 2}]`);
});
const last = `s${badges.length + 1}`;
f.push(`[${last}]split[a][b]`,
  `[a]palettegen=max_colors=${cfg.colors ?? 192}:stats_mode=diff[p]`,
  `[b][p]paletteuse=dither=${cfg.dither ?? "sierra2_4a"}:diff_mode=rectangle`);
execFileSync("ffmpeg", ["-v", "error", "-y", ...inputs, "-filter_complex", f.join(";"),
  "-t", String(dur + hold), "-loop", "0", out], { stdio: "inherit" });
if (cfg.mp4) {
  execFileSync("ffmpeg", ["-v", "error", "-y", ...inputs, "-filter_complex", f.slice(0, f.length - 3).join(";") +
    `;[${last}]format=yuv420p`, "-t", String(dur + hold),
    "-c:v", "libx264", "-crf", "20", out.replace(/\.gif$/, ".mp4")], { stdio: "inherit" });
}
await rm(dir, { recursive: true, force: true });
console.log(`${out} (${((await stat(out)).size / 1e6).toFixed(1)} MB, ${(dur + hold).toFixed(1)} s @ ${fps} fps)`);
