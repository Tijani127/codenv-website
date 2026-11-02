export interface DocNavItem {
  slug: string
  title: string
}

export interface DocNavSection {
  section: string
  items: DocNavItem[]
}

export const docNav: DocNavSection[] = [
  {
    section: "Getting started",
    items: [
      { slug: "introduction", title: "Introduction" },
      { slug: "install", title: "Install" },
      { slug: "quick-start", title: "Quick start" },
    ],
  },
  {
    section: "Guides",
    items: [
      { slug: "configuration", title: "Configuration" },
      { slug: "secrets", title: "Secrets" },
      { slug: "services", title: "Services" },
      { slug: "store", title: "Store modes & pinning" },
      { slug: "commands", title: "Commands & scripts" },
      { slug: "generate", title: "Generate & import" },
    ],
  },
  {
    section: "Reference",
    items: [
      { slug: "guarantees", title: "Guarantees" },
      { slug: "devbox", title: "vs. devbox" },
      { slug: "reference", title: "Env vars & troubleshooting" },
    ],
  },
]

export function flatDocNav(): DocNavItem[] {
  return docNav.flatMap((s) => s.items)
}
