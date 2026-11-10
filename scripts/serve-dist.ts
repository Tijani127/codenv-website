// Minimal static server with SPA fallback for local smoke tests.
import { serve } from "bun"
import { readFileSync, existsSync } from "node:fs"
import { extname, join } from "node:path"

const dist = join(import.meta.dir, "..", "dist")
const types: Record<string, string> = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".woff2": "font/woff2",
}

serve({
  port: 4199,
  async fetch(req) {
    const path = new URL(req.url).pathname
    let file = join(dist, path === "/" ? "index.html" : path)
    if (!existsSync(file)) file = join(dist, "index.html") // SPA fallback
    try {
      return new Response(readFileSync(file), {
        headers: { "content-type": types[extname(file)] ?? "application/octet-stream" },
      })
    } catch {
      return new Response("not found", { status: 404 })
    }
  },
})
console.log("serving dist on http://127.0.0.1:4199")
