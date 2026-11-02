import { Check, Copy } from "lucide-react"
import { useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code: string
  lang?: string
  /** Show the traffic-light dots for terminal-looking sessions. */
  terminal?: boolean
  className?: string
  children?: ReactNode
}

export function CodeBlock({
  code,
  lang,
  terminal,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable; ignore
    }
  }

  return (
    <figure
      className={cn(
        "not-prose group my-6 overflow-hidden rounded-xl border bg-zinc-950",
        className,
      )}
    >
      <figcaption className="flex items-center gap-2 border-b px-4 py-2.5">
        {terminal ? (
          <span className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-red-500/70" />
            <span className="size-2.5 rounded-full bg-yellow-500/70" />
            <span className="size-2.5 rounded-full bg-green-500/70" />
          </span>
        ) : null}
        <span className="text-muted-foreground font-mono text-xs tracking-wide">
          {lang ?? (terminal ? "terminal" : "code")}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy code"
          className="text-muted-foreground hover:text-foreground ml-auto cursor-pointer transition-colors"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </button>
      </figcaption>
      <pre className="overflow-x-auto p-4 text-left text-[13px] leading-relaxed">
        <code className="font-mono">{code}</code>
      </pre>
    </figure>
  )
}
