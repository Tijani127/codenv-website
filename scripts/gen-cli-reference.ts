// Generates src/content/cli.generated.ts from the real codenv CLI help output.
//
// Run on a machine that has codenv on PATH (or set CODEENV_EXE):
//   bun run scripts/gen-cli-reference.ts
//
// The generated file is committed, so the site builds anywhere. Re-run after
// every codenv release so the reference cannot drift from the binary.
import { execFileSync } from "node:child_process"
import { mkdirSync, writeFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")

const exe = process.env.CODEENV_EXE ?? "codenv"

function help(args: string[]): string {
  return execFileSync(exe, [...args, "--help"], {
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024,
  })
}

type Flag = { names: string; usage: string }
type Sub = { name: string; short: string }
type Command = {
  name: string
  usage: string[]
  long: string
  flags: Flag[]
  globalFlags: Flag[]
  subs: Sub[]
}

// Cobra help layout:
//   <long>\n
//   \n
//   Usage:\n  <lines>\n\n
//   [Available Commands:\n  <name> <short>...\n\n]
//   [Flags:\n...\n\n]
//   [Global Flags:\n...\n\n]
//   [<extra sections>]
//
// Flag lists wrap: a line that does not start a new flag is a continuation
// of the previous one.
function parseFlags(lines: string[]): Flag[] {
  const out: Flag[] = []
  for (const line of lines) {
    if (line.length === 0) continue
    const startsFlag = /^\s*(-|-\w,\s|--)/.test(line)
    if (!startsFlag && out.length > 0) {
      out[out.length - 1].usage += " " + line.trim()
      continue
    }
    const m = line.trim().match(/^((?:-\w,\s)?--?[\w\[\]]+(?:\s+\S+)?|-\w)\s{2,}(.*)$/)
    if (m) {
      out.push({ names: m[1], usage: m[2] })
    } else if (line.trim().length > 0) {
      // A flag without usage text (e.g. "-h, --help").
      out.push({ names: line.trim().split(/\s{2,}/)[0], usage: "" })
    }
  }
  return out
}

function parseOne(name: string, text: string): Command {
  const lines = text.replace(/\r\n/g, "\n").split("\n")
  const usageIdx = lines.findIndex((l) => l.trim() === "Usage:")
  if (usageIdx === -1) throw new Error(`no Usage: block for ${name}`)

  const long = lines.slice(0, usageIdx).join("\n").trim()

  // Split the rest into blocks separated by blank lines; the first block of a
  // section declares the section name.
  const rest = lines.slice(usageIdx + 1)
  let usage: string[] = []
  let flags: Flag[] = []
  let globalFlags: Flag[] = []
  let subs: Sub[] = []
  let section = "usage"
  let current: string[] = []
  const flush = () => {
    if (current.length === 0) return
    if (section === "usage") usage = current.slice()
    else if (section === "available commands")
      subs = current
        .map((l) => {
          const t = l.trim()
          const sp = t.match(/^(\S+)\s+(.*)$/)
          return sp ? { name: sp[1], short: sp[2] } : { name: t, short: "" }
        })
        .filter((s) => s.name !== "help" && s.name !== "completion")
        .filter((s) => !/\[flags\]/.test(s.name))
    else if (section === "flags") flags = parseFlags(current)
    else if (section === "global flags") globalFlags = parseFlags(current)
    current = []
  }
  
  for (const line of rest) {
    if (line.trim() === "") {
      flush()
      continue
    }
    if (/^\S.*:$/.test(line.trim()) && /^\s*\S/.test(line) && !line.startsWith("  ")) {
      flush()
      section = line.trim().replace(/:$/, "").toLowerCase()
      continue
    }
    current.push(line)
  }
  flush()

  return { name, usage, long, flags, globalFlags, subs }
}

const rootHelp = help([])

// The command list comes from the root help itself, so new commands appear
// automatically on regeneration.
const tops: string[] = []
{
  const [, body] = splitRoot(rootHelp)
  for (const line of body) {
    const t = line.trim()
    const m = t.match(/^(\S+)\s{2,}/)
    if (m && m[1] !== "help" && m[1] !== "completion") tops.push(m[1])
  }
}

function splitRoot(text: string): [string, string[]] {
  const lines = text.replace(/\r\n/g, "\n").split("\n")
  const idx = lines.findIndex((l) => l.trim() === "Available Commands:")
  return [lines.slice(0, idx).join("\n"), lines.slice(idx + 1)]
}

// Nested command groups: everything with real subcommands.
const groups: Record<string, string[]> = {
  generate: ["codenv", "dockerfile", "devcontainer", "direnv", "readme", "ci"],
  global: ["add", "rm", "list", "install", "update", "run", "shellenv", "pull", "push", "path", "codenvx"],
  secrets: ["add", "from", "list", "set", "rm", "download"],
  services: ["up", "start", "stop", "restart", "ls", "logs", "clean"],
}
// Discover group members from each group's own help instead of hardcoding.
for (const g of Object.keys(groups)) {
  const text = help([g])
  const lines = text.replace(/\r\n/g, "\n").split("\n")
  const idx = lines.findIndex((l) => l.trim() === "Available Commands:")
  if (idx === -1) continue
  groups[g] = lines
    .slice(idx + 1)
    .map((l) => l.trim())
    .filter((l) => /^\S+\s{2,}/.test(l))
    .filter((l) => !/^(help|completion)\b/.test(l))
    .filter((l) => !/\[flags\]/.test(l))
    .map((l) => l.split(/\s{2,}/)[0])
  // guard: the root 'codenv' line can leak in, drop unknown entries
  groups[g] = groups[g].filter(
    (s) => !["codenv", "completion", "help"].includes(s),
  )
}

const data: Record<string, Command | Record<string, Command>> = {}
for (const name of tops) {
  if (groups[name]) {
    const obj: Record<string, Command> = {}
    for (const sub of groups[name]) {
      obj[sub] = parseOne(`codenv ${name} ${sub}`, help([name, sub]))
    }
    data[name] = { __root__: parseOne(`codenv ${name}`, help([name])), ...obj }
  } else {
    data[name] = parseOne(`codenv ${name}`, help([name]))
  }
}
void rootHelp

const banner = `// GENERATED FILE - do not edit by hand.
// Regenerate with: bun run scripts/gen-cli-reference.ts
// Source of truth: \`codenv --help\` output of the installed binary.
`
const body = `export type CliFlag = { names: string; usage: string }\nexport type CliSub = { name: string; short: string }\nexport type CliCommand = {\n  name: string\n  usage: string[]\n  long: string\n  flags: CliFlag[]\n  globalFlags: CliFlag[]\n  subs: CliSub[]\n}\nexport const cliCommands: Record<string, unknown> = ` + JSON.stringify(data, null, 2) + `\n`

mkdirSync(resolve(root, "src/content"), { recursive: true })
writeFileSync(resolve(root, "src/content/cli.generated.ts"), banner + body + "\n")
console.log("wrote src/content/cli.generated.ts with", Object.keys(data).join(", "))
