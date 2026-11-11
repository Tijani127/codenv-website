// Generates src/search/docs-index.json for the client-side Ctrl-K search.
//
// Run with: bun run scripts/build-search.ts
//
// Each docs page is rendered to static markup at build time, tags are
// stripped, and the text is split into searchable chunks at the H2/H3
// level — one entry per heading, plus one for the page as a whole.
import { mkdirSync, writeFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { renderToStaticMarkup } from "react-dom/server"
import { MemoryRouter } from "react-router-dom"
import { Fragment } from "react"

import { docNav } from "../src/pages/docs/nav"
import {
  commands,
  configuration,
  devbox,
  generate,
  guarantees,
  install,
  introduction,
  quickStart,
  reference,
  secrets,
  services,
  store,
} from "../src/pages/docs/content"
import { CliReference } from "../src/pages/docs/cli"
import { CiRecipes } from "../src/pages/docs/ci"
import { Templates } from "../src/pages/docs/templates"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")

type Entry = { slug: string; title: string; heading: string; text: string }

// Ordered to match the sidebar nav.
const pageBySlug: Record<string, React.ReactNode> = {
  introduction,
  install,
  "quick-start": quickStart,
  configuration,
  secrets,
  services,
  store,
  commands,
  generate,
  cli: <CliReference />,
  templates: <Templates />,
  ci: <CiRecipes />,
  guarantees,
  devbox,
  reference,
}

function htmlToText(html: string): string {
  return (
    html
      .replace(/<h2[^>]*>/g, "\n## ")
      .replace(/<h3[^>]*>/g, "\n### ")
      .replace(/<li[^>]*>/g, "\n- ")
      // JSX strips whitespace between block elements, so mark paragraph and
      // table boundaries with newlines before stripping inline tags.
      .replace(/<\/(p|div|table|thead|tbody|tr|pre|blockquote|h1|h2|h3|h4|h5|h6|ol|ul|td|th|summary)>/g, "\n")
      .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\n\s*\n+/g, "\n")
    .replace(/[^\S\n]+/g, " ")
    .trim()
  )
}

const entries: Entry[] = []
for (const group of docNav) {
  for (const item of group.items) {
    const page = pageBySlug[item.slug]
    if (!page) continue
    const html = renderToStaticMarkup(
      <MemoryRouter>{page as React.ReactNode}</MemoryRouter>,
    )
    const text = htmlToText(html)
    // Strip the heading markers used for splitting from the display text so
    // previews don't leak "## ...".
    entries.push({
      slug: item.slug,
      title: item.title,
      heading: "",
      text: text.replace(/\n#{2,3} /g, " ").slice(0, 400),
    })

    // One chunk per H2/H3 heading.
    const re = /\n(#{2,3}) ([^\n]+)\n([\s\S]*?)(?=\n#{2,3} |$)/g
    let m: RegExpExecArray | null
    while ((m = re.exec(text))) {
      const body = m[3].replace(/\n?#{2,3} ?/g, "\n").trim()
      if (body.length < 40) continue
      entries.push({
        slug: item.slug,
        title: item.title,
        heading: m[2].replace(/\s*\([^)]*\)\s*$/, "").trim(),
        text: body.replace(/\n/g, "  ").slice(0, 700),
      })
    }
  }
}

mkdirSync(resolve(root, "src/search"), { recursive: true })
// A .ts file rather than .json: the app tsconfig would need resolveJsonModule
// otherwise, and this keeps the search data type-safe at zero cost.
writeFileSync(
  resolve(root, "src/search/docs-index.ts"),
  "export const searchDocs = " + JSON.stringify(entries) + " as const\n",
)
console.log(
  `wrote src/search/docs-index.ts: ${entries.length} entries across ${docNav.reduce((n, g) => n + g.items.length, 0)} pages`,
)
