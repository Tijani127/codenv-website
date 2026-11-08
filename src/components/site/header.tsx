import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Menu, SquareTerminal } from "lucide-react"
import { Link, NavLink, useLocation } from "react-router-dom"
import { useState } from "react"
import { cn } from "@/lib/utils"

const nav = [
  { to: "/", label: "Home" },
  { to: "/docs/introduction", label: "Docs" },
  { to: "/changelog", label: "Changelog" },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const inDocs = location.pathname.startsWith("/docs")

  return (
    <header className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight"
        >
          <SquareTerminal className="size-4 text-emerald-400" />
          codenv
        </Link>
        <Badge variant="outline" className="hidden font-mono text-[11px] sm:inline-flex">
          v1.1 Regina
        </Badge>

        <nav className="ml-4 hidden items-center gap-1 sm:flex">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "text-muted-foreground hover:text-foreground rounded-md px-3 py-1.5 text-sm transition-colors",
                  isActive &&
                    (item.to !== "/docs" || inDocs) &&
                    "text-foreground bg-accent/60",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden font-mono text-xs sm:inline-flex" asChild>
            <a
              href="https://github.com/Tijani127/codenv"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <Menu className="size-4" />
          </Button>
        </div>
      </div>

      {open ? (
        <nav className="border-t sm:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "text-muted-foreground hover:text-foreground rounded-md px-3 py-2 text-sm",
                    isActive && "text-foreground bg-accent/60",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  )
}
