// CDP smoke test: open a page, press Ctrl-K, screenshot the search dialog.
// Usage: bun run scripts/search-smoke.ts <url> <outPng> [query]
import { spawn } from "node:child_process"
import { writeFileSync } from "node:fs"

const url = process.argv[2]
const out = process.argv[3]
const query = process.argv[4] ?? ""

const port = 9337
const chrome = spawn(
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    "--window-size=1400,900",
    "--user-data-dir=" + process.env.TEMP + "\\opencode\\chrome-profile",
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

// Press Ctrl-K down, then up.
await send("Input.dispatchKeyEvent", {
  type: "rawKeyDown",
  modifiers: 2, // Ctrl
  windowsVirtualKeyCode: 75,
  code: "KeyK",
  key: "k",
})
await send("Input.dispatchKeyEvent", {
  type: "keyUp",
  modifiers: 2,
  windowsVirtualKeyCode: 75,
  code: "KeyK",
  key: "k",
})
await wait(400)

if (query) {
  for (const ch of query) {
    await send("Input.dispatchKeyEvent", {
      type: "keyDown",
      text: ch,
      key: ch,
      windowsVirtualKeyCode: ch.charCodeAt(0),
    })
    await send("Input.dispatchKeyEvent", {
      type: "keyUp",
      key: ch,
      windowsVirtualKeyCode: ch.charCodeAt(0),
    })
  }
  await wait(400)
}

const shot = (await send("Page.captureScreenshot", { format: "png" })) as { data: string }
writeFileSync(out, Buffer.from(shot.data, "base64"))
chrome.kill()
console.log("screenshot written:", out)
