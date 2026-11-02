import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, FileText } from "lucide-react"
import { Link, Outlet, useLocation } from "react-router-dom"
import { docNav, flatDocNav } from "./nav"
import { cn } from "@/lib/utils"

function Sidebar() {
  const location = useLocation()
  const current = location.pathname.split("/")[2] ?? "introduction"

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] shrink-0 overflow-y-auto py-10 pr-8 lg:block lg:w-56">
      <nav className="space-y-8">
        {docNav.map((group) => (
          <div key={group.section}>
            <h4 className="text-foreground mb-2 px-3 text-[13px] font-semibold">
              {group.section}
            </h4>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.slug}>
                  <Link
                    to={`/docs/${item.slug}`}
                    className={cn(
                      "text-muted-foreground hover:text-foreground block rounded-md px-3 py-1.5 text-sm transition-colors",
                      current === item.slug &&
                        "text-foreground bg-accent/60 font-medium",
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}

function PrevNext() {
  const location = useLocation()
  const current = location.pathname.split("/")[2] ?? "introduction"
  const flat = flatDocNav()
  const index = flat.findIndex((item) => item.slug === current)
  const prev = index > 0 ? flat[index - 1] : null
  const next = index >= 0 && index < flat.length - 1 ? flat[index + 1] : null

  if (index === -1) return null

  return (
    <div className="mt-14 flex items-stretch justify-between gap-4 border-t pt-6">
      {prev ? (
        <Button variant="ghost" className="h-auto flex-col items-start gap-0.5 py-2" asChild>
          <Link to={`/docs/${prev.slug}`}>
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              <ChevronLeft className="size-3" /> Previous
            </span>
            <span className="text-sm font-medium">{prev.title}</span>
          </Link>
        </Button>
      ) : (
        <span />
      )}
      {next ? (
        <Button
          variant="ghost"
          className="h-auto flex-col items-end gap-0.5 py-2 text-right"
          asChild
        >
          <Link to={`/docs/${next.slug}`}>
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              Next <ChevronRight className="size-3" />
            </span>
            <span className="text-sm font-medium">{next.title}</span>
          </Link>
        </Button>
      ) : null}
    </div>
  )
}

export function DocsLayout() {
  return (
    <div className="mx-auto flex max-w-6xl px-4 sm:px-6">
      <Sidebar />
      <main className="min-w-0 flex-1 py-10 lg:max-w-3xl">
        <div className="prose prose-invert prose-neutral max-w-none prose-headings:tracking-tight prose-a:text-emerald-400 prose-code:font-normal">
          <Outlet />
        </div>
        <PrevNext />
      </main>
    </div>
  )
}

export function DocPage({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <article>
      <h1 className="mb-2 flex items-center gap-2.5 text-3xl font-semibold">
        <FileText className="size-6 text-emerald-400" />
        {title}
      </h1>
      {children}
    </article>
  )
}
