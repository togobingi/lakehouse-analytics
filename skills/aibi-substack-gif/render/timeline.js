// Deterministic timeline for Lakehouse Analytics explainer GIFs.
//
// A scene is plain HTML. Every animated element declares *when* it happens with data
// attributes; seek(t) sets every style as a pure function of t. No CSS animations or
// timers, so render.mjs can screenshot any frame in any order and get the same pixels.
//
//   data-at="1.2"                fade + slide in at t=1.2s (data-dur, default 0.35s)
//   data-until="6"               fade out again at t=6s
//   data-type="agentbricks init" type the text from data-at at data-cps chars/sec (default 18)
//   data-draw                    SVG path/line/polyline: draw the stroke from data-at over data-dur
//   data-count="0:1250"          count a number from 0 to 1250 from data-at over data-dur
//                                (optional data-prefix="-", data-suffix=" MB", data-decimals="1")
//   data-grow="w" | "h"          bar grows to its CSS width/height from data-at over data-dur
//   data-class="read"            add a class from data-class-at until data-class-until, e.g. highlight
//                                a box; independent of data-at, so a box can fade in and light up later
//
// The scene sets window.SCENE = { duration: 13, fps: 15, hold: 2 } (hold = seconds the
// last frame stays up before the GIF loops).

(function () {
  const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(1 - x, 3)); // easeOutCubic
  const num = (el, name, dflt) => {
    const v = el.getAttribute(name);
    return v === null || v === "" ? dflt : parseFloat(v);
  };
  const progress = (el, t, dfltDur) => {
    const at = num(el, "data-at", 0);
    const dur = num(el, "data-dur", dfltDur);
    return ease((t - at) / dur);
  };

  function prepare() {
    document.querySelectorAll("[data-type]").forEach((el) => {
      el.dataset.full = el.getAttribute("data-type");
    });
    document.querySelectorAll("[data-draw]").forEach((el) => {
      const len = el.getTotalLength ? el.getTotalLength() : 0;
      el.dataset.len = len;
      el.style.strokeDasharray = `${len} ${len}`;
    });
    document.querySelectorAll("[data-grow]").forEach((el) => {
      const cs = getComputedStyle(el);
      el.dataset.target = el.dataset.grow === "h" ? cs.height : cs.width;
    });
  }

  function seek(t) {
    document.querySelectorAll("[data-at]:not([data-type]):not([data-draw]):not([data-count]):not([data-grow])").forEach((el) => {
      let p = progress(el, t, 0.35);
      const until = num(el, "data-until", Infinity);
      if (t >= until) p = 1 - ease((t - until) / 0.3);
      el.style.opacity = p;
      el.style.transform = `translateY(${(1 - p) * 8}px)`;
    });

    document.querySelectorAll("[data-type]").forEach((el) => {
      const at = num(el, "data-at", 0);
      const cps = num(el, "data-cps", 18);
      const full = el.dataset.full;
      const n = Math.max(0, Math.min(full.length, Math.floor((t - at) * cps)));
      el.textContent = t < at ? "" : full.slice(0, n);
      // Blinking caret only while this line is the active one.
      const done = n >= full.length;
      const next = num(el, "data-caret-until", at + full.length / cps + 0.6);
      el.classList.toggle("caret", t >= at && (!done || (t < next && Math.floor(t * 3) % 2 === 0)));
    });

    document.querySelectorAll("[data-draw]").forEach((el) => {
      const len = parseFloat(el.dataset.len);
      const p = progress(el, t, 0.5);
      el.style.strokeDashoffset = len * (1 - p);
      el.style.opacity = p > 0 ? 1 : 0;
    });

    document.querySelectorAll("[data-count]").forEach((el) => {
      const [from, to] = el.dataset.count.split(":").map(parseFloat);
      const p = progress(el, t, 1.0);
      const d = num(el, "data-decimals", 0);
      const v = from + (to - from) * p;
      el.textContent = (el.dataset.prefix || "") + v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }) + (el.dataset.suffix || "");
      el.style.opacity = t >= num(el, "data-at", 0) ? 1 : 0;
    });

    document.querySelectorAll("[data-grow]").forEach((el) => {
      const p = progress(el, t, 0.8);
      const prop = el.dataset.grow === "h" ? "height" : "width";
      el.style[prop] = `calc(${el.dataset.target} * ${p})`;
    });

    document.querySelectorAll("[data-class]").forEach((el) => {
      const at = num(el, "data-class-at", 0);
      const until = num(el, "data-class-until", Infinity);
      el.classList.toggle(el.dataset.class, t >= at && t < until);
    });
  }

  window.addEventListener("DOMContentLoaded", () => {
    prepare();
    const scene = window.SCENE || { duration: 10, fps: 15, hold: 2 };
    window.__seek = seek;
    window.__scene = scene;
    // Preview in a normal browser: play in real time and loop (the renderer ignores this).
    if (!navigator.webdriver) {
      const start = performance.now();
      const loop = () => {
        const total = scene.duration + (scene.hold || 0);
        seek(Math.min(((performance.now() - start) / 1000) % total, scene.duration));
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    } else {
      seek(0);
    }
  });
})();
