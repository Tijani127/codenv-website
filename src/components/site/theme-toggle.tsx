import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

// Re-renders when the theme changes, for components that must adapt their
// classes (the docs prose wrapper).
export function useSyncTheme(): boolean {
  const [light, setLight] = useState(
    () => localStorage.getItem("codenv-theme") === "light",
  )
  useEffect(() => {
    const on = (e: Event) => setLight((e as CustomEvent).detail === "light")
    window.addEventListener("codenv-theme", on)
    return () => window.removeEventListener("codenv-theme", on)
  }, [])
  return light
}

// Dark is the default; a stored choice persists across visits.
export function ThemeToggle() {
  const [light, setLight] = useState(
    () => localStorage.getItem("codenv-theme") === "light",
  )
  useSyncTheme()

  useEffect(() => {
    document.documentElement.className = light ? "" : "dark"
    localStorage.setItem("codenv-theme", light ? "light" : "dark")
    window.dispatchEvent(new CustomEvent("codenv-theme", { detail: light ? "light" : "dark" }))
  }, [light])

  return (
    <button
      onClick={() => setLight((v) => !v)}
      aria-label="Toggle color theme"
      className="text-muted-foreground hover:text-foreground hover:bg-accent/60 inline-flex size-8 items-center justify-center rounded-md transition-colors"
    >
      {light ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </button>
  )
}
