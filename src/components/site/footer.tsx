import { SquareTerminal } from "lucide-react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"

export function Footer() {
  return (
    <footer className="border-t py-10">
      <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center text-sm sm:flex-row sm:justify-between sm:text-left sm:px-6">
        <div className="flex items-center gap-2 font-mono">
          <SquareTerminal className="size-4 text-emerald-400" />
          codenv
          <span className="text-muted-foreground/70 ml-2">
            MIT © Tijani
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/docs/introduction" className="hover:text-foreground transition-colors">
            Docs
          </Link>
          <Link to="/changelog" className="hover:text-foreground transition-colors">
            Changelog
          </Link>
          <a
            href="https://github.com/Tijani127/codenv"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <Badge variant="outline" className="font-mono text-[11px]">
            v1.1 Regina
          </Badge>
        </div>
      </div>
    </footer>
  )
}
