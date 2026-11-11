// Screenshot a page in dark or light theme via CDP.
// Usage: bun run scripts/shot.ts <url> <outPng> [light|dark] [width] [height] [scrollY]
import { spawn } from "node:child_process"
import { writeFileSync } from "node:fs"

const url = process.argv[2]
const out = process.argv[3]
const theme = process.argv[4] ?? "dark"
const width = process.argv[5] ?? "1400"
const height = process.argv[6] ?? "900"
const scrollY = process.argv[7] ?? "0"

const port = 9341 + Math.floor(Math.random() * 2000)
const chrome = spawn(
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--window-size=${width},${height}`,
    "--user-data-dir=" + process.env.TEMP + "\\opencode\\chrome-shot-" + Date.now(),
    "about:blank",
  ],
  { stdio: "ignore" },
)

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function getWs(): Promise<string> {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`)
      const tabs = (await res.json()) as { type: string; webSocketDebuggerUrl: string }[]
      const page = tabs.find((t) => t.type === "page")
      if (page) return page.webSocketDebuggerUrl
    } catch {}
    await wait(250)
  }
  throw new Error("no page target")
}

const ws = new WebSocket(await getWs())
let id = 0
const pending = new Map<number, (v: unknown) => void>()
const send = (method: string, params: object) =>
  new Promise<unknown>((resolve) => {
    const mid = ++id
    pending.set(mid, resolve)
    ws.send(JSON.stringify({ id: mid, method, params }))
  })
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data as string)
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)!(msg.result)
    pending.delete(msg.id)
  }
}
await new Promise((r) => ws.onopen = r)

await send("Page.enable", {})
await send("Runtime.enable", {})
await send("Page.navigate", { url })
await wait(2500)
if (theme === "light") {
  await send("Runtime.evaluate", {
    expression: `localStorage.setItem('codenv-theme','light'); location.reload();`,
  })
  await wait(3000)
}
if (scrollY !== "0") {
  // The SPA may not have mounted/laid out yet after (re)load; retry until the
  // scroll actually sticks.
  for (let i = 0; i < 15; i++) {
    const r = (await send("Runtime.evaluate", {
      expression: `window.scrollTo(0, ${scrollY}); window.scrollY`,
    })) as { result?: { value?: number } }
    if (r?.result?.value === Number(scrollY)) break
    await wait(400)
  }
  await wait(600)
}

const shot = (await send("Page.captureScreenshot", { format: "png" })) as { data: string }
writeFileSync(out, Buffer.from(shot.data, "base64"))
chrome.kill()
console.log("screenshot written:", out)
