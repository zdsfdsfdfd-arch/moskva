// Локальная имитация GitHub Pages для проверки статического экспорта.
// Usage: node scripts/serve-static.mjs <dir> <port> <basePath>
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";

const [dir = "out", port = "3003", base = "/moskva"] = process.argv.slice(2);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

async function resolve(pathname) {
  // GitHub Pages: /foo → foo/index.html, затем foo.html
  const candidates = [pathname, join(pathname, "index.html"), `${pathname}.html`];
  for (const c of candidates) {
    const file = join(dir, normalize(c).replace(/^(\.\.[/\\])+/, ""));
    try {
      const s = await stat(file);
      if (s.isFile()) return file;
    } catch {}
  }
  return null;
}

createServer(async (req, res) => {
  let pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (base && pathname.startsWith(base)) pathname = pathname.slice(base.length) || "/";
  else if (base && pathname !== "/") {
    res.writeHead(404, { "Content-Type": "text/plain" });
    return res.end("404 (вне basePath)");
  }

  const file = await resolve(pathname);
  if (!file) {
    const notFound = join(dir, "404.html");
    try {
      const body = await readFile(notFound);
      res.writeHead(404, { "Content-Type": TYPES[".html"] });
      return res.end(body);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("404");
    }
  }
  const body = await readFile(file);
  res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" });
  res.end(body);
}).listen(Number(port), () => console.log(`serving ${dir} at http://localhost:${port}${base}/`));
