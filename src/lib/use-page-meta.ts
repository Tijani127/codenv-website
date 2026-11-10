import { useEffect } from "react"
import { useLocation } from "react-router-dom"

const BASE = "https://codenv.netlify.app"

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  )
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute("content", content)
}

// Sets <title> and the meta tags that crawlers read for this route. SPA
// routes render client-side, so the per-route values are applied here; the
// defaults in index.html cover the initial crawl.
export function usePageMeta({
  title,
  description,
}: {
  title: string
  description: string
}) {
  const location = useLocation()

  useEffect(() => {
    document.title = title
    upsertMeta("name", "description", description)
    upsertMeta("property", "og:title", title)
    upsertMeta("property", "og:description", description)
    upsertMeta("property", "og:url", BASE + location.pathname)
    upsertMeta("property", "og:type", "website")
    upsertMeta("property", "og:image", BASE + "/og.png")
    upsertMeta("name", "twitter:card", "summary_large_image")
    upsertMeta("name", "twitter:title", title)
    upsertMeta("name", "twitter:description", description)
  }, [title, description, location.pathname])
}
