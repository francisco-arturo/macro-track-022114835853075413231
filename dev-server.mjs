import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import apiHandler from "./api/meal-plan.mjs";

const ROOT = fileURLToPath(new URL(".", import.meta.url));

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

function safePath(pathname) {
  const decoded = decodeURIComponent(pathname);
  const resolved = normalize(join(ROOT, decoded));
  if (resolved !== ROOT.replace(/[\\/]$/, "") && !resolved.startsWith(ROOT.endsWith(sep) ? ROOT : ROOT + sep)) {
    return null;
  }
  return resolved;
}

export function createAppServer() {
  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url || "/", `http://${req.headers.host || "127.0.0.1"}`);

      if (url.pathname === "/api/meal-plan") {
        await apiHandler(req, res);
        return;
      }

      if (req.method !== "GET" && req.method !== "HEAD") {
        res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Method not allowed");
        return;
      }

      let pathname = url.pathname;
      if (pathname === "/") pathname = "/index.html";
      const filePath = safePath(pathname);
      if (!filePath) {
        res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Forbidden");
        return;
      }

      let target = filePath;
      const info = await stat(target).catch(() => null);
      if (!info) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
        return;
      }
      if (info.isDirectory()) target = join(target, "index.html");

      const body = await readFile(target);
      res.writeHead(200, {
        "Content-Type": MIME[extname(target).toLowerCase()] || "application/octet-stream",
        "Content-Length": body.length,
        "Cache-Control": "no-cache",
        "Service-Worker-Allowed": "/",
      });
      if (req.method === "HEAD") res.end();
      else res.end(body);
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Local preview error");
      if (process.env.DEBUG) console.error(error);
    }
  });
}

const direct = process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
if (direct) {
  const port = Number(process.env.PORT) || 4173;
  const server = createAppServer();
  server.listen(port, "127.0.0.1", () => {
    console.log(`Fit Code preview: http://127.0.0.1:${port}`);
  });
}
