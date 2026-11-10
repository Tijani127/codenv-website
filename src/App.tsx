import { Footer } from "@/components/site/footer"
import { Header } from "@/components/site/header"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom"
import Changelog from "@/pages/changelog"
import Home from "@/pages/home"
import { DocsLayout } from "@/pages/docs/layout"
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
} from "@/pages/docs/content"
import { CliReference } from "@/pages/docs/cli"
import { CiRecipes } from "@/pages/docs/ci"

const docRoutes: Record<string, React.ReactNode> = {
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
  guarantees,
  devbox,
  reference,
  ci: <CiRecipes />,
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-mono text-sm text-emerald-400">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">
        This page is not in the environment
      </h1>
      <p className="text-muted-foreground max-w-sm">
        The page you are looking for does not exist or was moved.
      </p>
      <Button variant="outline" asChild>
        <Link to="/docs/introduction">Back to the docs</Link>
      </Button>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/docs" element={<DocsLayout />}>
              <Route index element={docRoutes.introduction} />
              {Object.entries(docRoutes).map(([slug, element]) => (
                <Route key={slug} path={slug} element={element} />
              ))}
            </Route>
            <Route path="/changelog" element={<Changelog />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
