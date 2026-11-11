import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { DocPage } from "./layout"
import { cliCommands, type CliCommand } from "@/content/cli.generated"
import { Separator } from "@/components/ui/separator"

type Flag = { names: string; usage: string }
type Cmd = CliCommand

const dict = cliCommands as Record<string, Record<string, unknown>>

const categories: { title: string; items: string[] }[] = [
  { title: "Projects & packages", items: ["init", "add", "install", "rm", "update", "list"] },
  { title: "Shells & environment", items: ["shell", "run", "shellenv"] },
  { title: "Secrets", items: ["secrets"] },
  { title: "Store", items: ["gc", "cache"] },
  { title: "Discovery", items: ["search", "info"] },
  { title: "Scaffolding & generation", items: ["create", "generate"] },
  { title: "Global toolchains", items: ["global"] },
  { title: "Services", items: ["services"] },
  { title: "Importing", items: ["import"] },
  { title: "Diagnostics", items: ["doctor", "version"] },
]

// A command entry is either a plain command, or a group with __root__ plus
// subcommands (secrets, generate, global, services).
function asRootGroup(entry: Record<string, unknown>): { root: Cmd; isGroup: true } | { root: Cmd; isGroup: false } {
  if ("__root__" in entry) return { root: entry["__root__"] as Cmd, isGroup: true }
  return { root: entry as unknown as Cmd, isGroup: false }
}

function haystackOf(cmd: Cmd): string {
  return [
    cmd.name,
    ...cmd.usage,
    cmd.long,
    ...cmd.flags.map((f) => `${f.names} ${f.usage}`),
    ...cmd.subs.map((s) => `${s.name} ${s.short}`),
  ].join("\n")
}

function FlagList({ title, flags }: { title: string; flags: Flag[] }) {
  if (flags.length === 0) return null
  return (
    <div className="mt-3">
      <p className="text-foreground/80 mb-1 text-[11px] font-semibold uppercase tracking-wide">
        {title}
      </p>
      {flags.map((f, i) => (
        <div key={i} className="flex flex-wrap items-baseline gap-x-3 py-0.5">
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[12.5px] text-emerald-300">
            {f.names}
          </code>
          <span className="text-muted-foreground text-[13px]">{f.usage}</span>
        </div>
      ))}
    </div>
  )
}

function UsageLine({ usage }: { usage: string[] }) {
  if (usage.length === 0) return null
  return (
    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
      {usage.map((u, i) => (
        <span key={i} className="font-mono text-[12px] whitespace-pre text-muted-foreground">
          {u.trim()}
        </span>
      ))}
    </div>
  )
}

export function CliReference() {
  const [query, setQuery] = useState("")

  const terms = useMemo(
    () =>
      query
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean),
    [query],
  )
  const matches = (text: string) => terms.every((t) => text.toLowerCase().includes(t))

  return (
    <DocPage title="CLI reference">
      <p>
        Every command and flag in the <code>codenv</code> binary, generated
        from the <code>--help</code> output of the released version (
        <code>v1.2 Fort Quapelle</code>). For the story behind the commands, see{" "}
        <a href="/docs/commands" className="text-emerald-400 hover:underline">
          Commands &amp; scripts
        </a>
        .
      </p>

      <div className="relative mt-6">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter commands and flags…"
          className="bg-input/40 focus:border-ring border-border h-9 w-full rounded-md border px-9 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {categories.map((cat) => {
        const cards: React.ReactNode[] = []
        for (const key of cat.items) {
          const raw = dict[key]
          if (!raw) continue
          const { root, isGroup } = asRootGroup(raw)
          const stem = root.name.split(" ").slice(0, -1).join(" ")

          if (isGroup) {
            const subs = (Object.keys(raw) as string[])
              .filter((s) => s !== "__root__")
              .map((s) => raw[s] as Cmd)
            const shown = subs.filter((s) => matches(haystackOf(s)))
            const rootVisible =
              matches(haystackOf(root)) ||
              (terms.length > 0 && shown.length > 0)
            if (!rootVisible) continue
            cards.push(
              <div key={key} className="mt-8">
                <h3 className="font-mono text-lg font-semibold">
                  {stem} <span className="text-emerald-300">{key}</span>
                </h3>
                <UsageLine usage={root.usage} />
                <p className="mt-2 mb-3 text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                  {root.long}
                </p>
                <FlagList title="Flags" flags={root.flags} />
                <div className="mt-4 space-y-4">
                  {(terms.length > 0 ? shown : subs).map((sub) => (
                    <div key={sub.name} className="rounded-lg border p-3">
                      <h4 className="font-mono text-sm font-semibold text-emerald-300">
                        {sub.name.replace(stem + " ", "")}
                      </h4>
                      <UsageLine usage={sub.usage} />
                      <p className="mt-1.5 text-muted-foreground text-[13px] leading-relaxed whitespace-pre-line">
                        {sub.long}
                      </p>
                      <FlagList title="Flags" flags={sub.flags} />
                    </div>
                  ))}
                </div>
              </div>,
            )
          } else {
            if (!matches(haystackOf(root))) continue
            cards.push(
              <div key={key} className="mt-8">
                <h3 className="font-mono text-lg font-semibold">
                  {stem} <span className="text-emerald-300">{key}</span>
                </h3>
                <UsageLine usage={root.usage} />
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                  {root.long}
                </p>
                <FlagList title="Flags" flags={root.flags} />
              </div>,
            )
          }
        }
        if (cards.length === 0) return null
        return (
          <div key={cat.title}>
            <Separator className="my-8" />
            <h2 className="text-xl font-semibold tracking-tight text-emerald-400">
              {cat.title}
            </h2>
            {cards}
          </div>
        )
      })}
    </DocPage>
  )
}
