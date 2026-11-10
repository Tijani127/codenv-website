import { useEffect, useMemo, useRef, useState } from "react"
import { Search } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { searchDocs } from "@/search/docs-index"

type Entry = {
  slug: string
  title: string
  heading: string
  text: string
}

const idx: Entry[] = searchDocs as unknown as Entry[]

function matches(e: Entry, terms: string[]): number {
  // 0 = no match, 1 = text match, 2 = heading match, 3 = title match
  if (terms.length === 0) return 1
  const title = e.title.toLowerCase()
  const heading = e.heading.toLowerCase()
  const text = (e.title + " " + e.heading + " " + e.text).toLowerCase()
  let rank = 3
  for (const t of terms) {
    if (title.includes(t)) continue
    rank = Math.min(rank, heading.includes(t) ? 2 : text.includes(t) ? 1 : 0)
    if (rank === 0) return 0
  }
  return rank
}

export function SearchDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const terms = useMemo(
    () => query.toLowerCase().split(/\s+/).filter(Boolean),
    [query],
  )

  const results = useMemo(() => {
    const scored = idx.map((e) => [matches(e, terms), e] as const)
    return scored
      .filter(([rank]) => rank > 0)
      .sort((a, b) => b[0] - a[0])
      .slice(0, 12)
      .map(([, e]) => e)
  }, [terms])

  useEffect(() => setActive(0), [query])

  useEffect(() => {
    if (open) {
      setQuery("")
      // Focus after the dialog paints.
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  if (!open) return null

  const go = (slug: string) => {
    onClose()
    navigate(`/docs/${slug}`)
  }

  const onKeyDown = (ev: React.KeyboardEvent) => {
    if (ev.key === "Escape") {
      onClose()
    } else if (ev.key === "ArrowDown") {
      ev.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (ev.key === "ArrowUp") {
      ev.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (ev.key === "Enter") {
      const pick = results[active]
      if (pick) go(pick.slug)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-background w-full max-w-xl overflow-hidden rounded-xl border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b">
          <div className="relative">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search the docs…"
              className="bg-transparent h-13 w-full py-4 pr-4 pl-10 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="text-muted-foreground px-3 py-8 text-center text-sm">
              No matches.
            </p>
          ) : (
            results.map((e, i) => (
              <button
                key={`${e.slug}::${e.heading}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(e.slug)}
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-left",
                  i === active && "bg-muted",
                )}
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium">{e.title}</span>
                  {e.heading && (
                    <span className="text-muted-foreground truncate text-xs text-emerald-400">
                      {e.heading}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs leading-relaxed">
                  {e.text}
                </p>
              </button>
            ))
          )}
        </div>
        <div className="text-muted-foreground flex items-center gap-4 border-t px-4 py-2 text-[11px]">
          <span>
            <kbd className="bg-muted rounded px-1.5 py-0.5 font-mono">↑↓</kbd>{" "}
            navigate
          </span>
          <span>
            <kbd className="bg-muted rounded px-1.5 py-0.5 font-mono">↵</kbd>{" "}
            open
          </span>
          <span>
            <kbd className="bg-muted rounded px-1.5 py-0.5 font-mono">esc</kbd>{" "}
            close
          </span>
        </div>
      </div>
    </div>
  )
}

// Global Ctrl/Cmd-K wiring plus the header search button live here so any
// layout can include <DocSearch /> once.
export function DocSearch() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:text-foreground hover:border-border hidden items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs transition-colors sm:flex"
        aria-label="Search docs"
      >
        <Search className="size-3.5" />
        <span>Search docs</span>
        <kbd className="bg-muted ml-2 rounded border px-1.5 font-mono text-[10px]">
          Ctrl K
        </kbd>
      </button>
      <SearchDialog open={open} onClose={() => setOpen(false)} />
    </>
  )
}
