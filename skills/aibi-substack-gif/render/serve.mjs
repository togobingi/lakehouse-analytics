// Static server rooted at the repo, so scenes and frames load /skills/... and /brand/... by absolute path.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".json": "application/json" };

export function serve(port = 0) {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      const p = path.join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname));
      if (!p.startsWith(ROOT)) { res.writeHead(403).end(); return; }
      let body;
      try { body = await readFile(p); } catch { res.writeHead(404).end(); return; }
      res.writeHead(200, { "content-type": TYPES[path.extname(p)] || "application/octet-stream" });
      res.end(body);
    });
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

export const urlPath = (file) => "/" + path.relative(ROOT, path.resolve(file)).split(path.sep).map(encodeURIComponent).join("/");
