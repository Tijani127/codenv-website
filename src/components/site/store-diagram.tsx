import { useEffect, useState } from "react"
import { Check, FolderGit2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

// Animated, faithful rendering of what codenv does to the store and PATH.
// Facts come from the docs (store layout, guarantees) and real CLI output:
// Scoop installs into apps/<pkg>/<version>, codenv harvests the shim targets
// into .codenv-index.json, deletes the shims directory, and composes PATH
// from the exact version directories — never the 'current' junction.
const versions = [
  { pkg: "7zip", version: "24.09" },
  { pkg: "7zip", version: "26.03" },
  { pkg: "ripgrep", version: "15.2.0" },
]

const phases = [
  { label: "scoop install runs inside the wrapper", hint: "PATH snapshotted and restored around every call" },
  { label: "shim targets harvested into the index", hint: ".codenv-index.json records the real bin directories" },
  { label: "shims directory deleted", hint: "nothing global is left on your PATH" },
  { label: "codenv shell composes PATH", hint: "exact version dirs — never the current junction" },
]

export function StoreDiagram() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % phases.length), 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* The store on disk */}
      <div className="bg-card/50 border-border/60 rounded-xl border p-5 font-mono text-[13px]">
        <p className="text-muted-foreground mb-3 flex items-center gap-2 font-sans text-xs tracking-wide uppercase">
          <FolderGit2 className="size-3.5" /> the store — %LOCALAPPDATA%\codenv
        </p>
        <div className="space-y-1.5">
          <div
            className={cn(
              "rounded-md border px-3 py-1.5 transition-colors",
              phase === 0
                ? "border-emerald-400/60 text-emerald-400"
                : "border-transparent text-foreground/80",
            )}
          >
            apps<span className="text-muted-foreground">\</span>
            {versions[0].pkg}
            <span className="text-muted-foreground">\</span>
            {versions[0].version}
            {phase === 0 && (
              <span className="text-muted-foreground ml-2">← wrapped install</span>
            )}
          </div>
          {versions.slice(1).map((v) => (
            <div
              key={v.version}
              className="text-foreground/80 px-3 py-1.5"
            >
              apps<span className="text-muted-foreground">\</span>
              {v.pkg}
              <span className="text-muted-foreground">\</span>
              {v.version}
            </div>
          ))}
          <div
            className={cn(
              "flex items-center gap-2 rounded-md border px-3 py-1.5 transition-colors",
              phase === 1
                ? "border-emerald-400/60 text-emerald-400"
                : "border-transparent text-foreground/80",
            )}
          >
            .codenv-index.json
            {phase === 1 && <Check className="size-3.5" />}
          </div>
          <div
            className={cn(
              "flex items-center gap-2 rounded-md border px-3 py-1.5 transition-colors",
              phase === 2
                ? "border-red-400/60 text-red-400 line-through"
                : "border-transparent text-muted-foreground/60 line-through",
            )}
          >
            shims\
            {phase === 2 ? (
              <>
                <Trash2 className="size-3.5" /> deleted
              </>
            ) : (
              "gone after every install"
            )}
          </div>
        </div>
      </div>

      {/* PATH inside the shell */}
      <div className="bg-card/50 border-border/60 flex flex-col rounded-xl border p-5 font-mono text-[13px]">
        <p className="text-muted-foreground mb-3 font-sans text-xs tracking-wide uppercase">
          PATH inside a codenv shell
        </p>
        <div className="flex-1 space-y-1.5">
          {phase === 3 ? (
            <>
              <div className="rounded-md border border-emerald-400/60 px-3 py-1.5 text-emerald-400">
                …\apps\7zip\24.09<span className="text-muted-foreground">\bin</span>
              </div>
              <div className="rounded-md border border-emerald-400/60 px-3 py-1.5 text-emerald-400">
                …\apps\7zip\26.03<span className="text-muted-foreground">\bin</span>
              </div>
              <div className="rounded-md border border-emerald-400/60 px-3 py-1.5 text-emerald-400">
                …\apps\ripgrep\15.2.0<span className="text-muted-foreground">\bin</span>
              </div>
            </>
          ) : (
            <div className="text-muted-foreground/60 flex h-full items-center px-3">
              composed fresh when the shell starts — nothing persisted
            </div>
          )}
        </div>
        <p className="text-muted-foreground mt-4 text-[11px] font-sans">
          'current' is a junction codenv never references — a background scoop
          update cannot change what an environment resolves to.
        </p>
      </div>

      {/* Caption row */}
      <p className="text-muted-foreground lg:col-span-2 text-center text-xs">
        <span className="text-emerald-400 font-mono">{phases[phase].label}</span>
        {" — "}
        {phases[phase].hint}
      </p>
    </div>
  )
}
