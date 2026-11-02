import { Glass } from "@/components/canvasui/Glass"
import { ParticleReveal } from "@/components/canvasui/ParticleReveal"
import { CodeBlock } from "@/components/site/code-block"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ArrowRight,
  BookOpen,
  GitBranch,
  Layers,
  Lock,
  PackageOpen,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from "lucide-react"
import { Link } from "react-router-dom"

const quickstart = `codenv init
codenv add ripgrep 7zip
codenv shell`

const session = `PS C:\\myapp> codenv add 7zip@24.09
Installed 7zip 24.09 (7zip@24.09) into store
PS C:\\myapp> codenv shell
codenv:myapp> 7z | Select-Object -First 1

7-Zip 24.09 (x64) : Copyright (c) 1999-2024 Igor Pavlov`

const steps = [
  {
    num: "01",
    title: "Bootstrap",
    body: "On first use, codenv clones Scoop and the default buckets into the store using git. Nothing lands on your system PATH.",
  },
  {
    num: "02",
    title: "Resolve",
    body: "Package specs are resolved against local bucket manifests and written to codenv.lock.json as exact versions.",
  },
  {
    num: "03",
    title: "Install",
    body: "scoop install runs in a wrapper that snapshots your persistent PATH, SCOOP_PATH and PSModulePath, then restores them — even on failure.",
  },
  {
    num: "04",
    title: "Harvest, then delete",
    body: "Scoop's shim files record the resolved target of every binary. codenv reads them, indexes the real directories, and deletes the entire shims directory.",
  },
  {
    num: "05",
    title: "Activate",
    body: "codenv shell builds PATH from concrete version directories and launches a child shell. Nothing is persisted.",
  },
]

const features = [
  {
    icon: Trash2,
    title: "No shims, ever",
    body: "codenv harvests Scoop's shim metadata, records the real directories a package contributes, then deletes the shims directory. PATH is composed from concrete app directories.",
  },
  {
    icon: Layers,
    title: "Versions coexist",
    body: "One shared store holds every version side by side. Two projects can pin 7-Zip 24.09 and 26.03 at the same time and never interfere.",
  },
  {
    icon: Lock,
    title: "Locked to exact versions",
    body: "codenv.lock.json pins exact versions, buckets and architectures. A pin that cannot be installed is a hard error — never a silent substitution.",
  },
  {
    icon: ShieldCheck,
    title: "Your PATH stays untouched",
    body: "The persistent user PATH is snapshotted before every Scoop call and restored after, even when the install fails. Start Menu shortcuts are removed again.",
  },
  {
    icon: RefreshCw,
    title: "Resists drift",
    body: "PATH references apps\\<pkg>\\<version>, never the current junction, so a background scoop update cannot change what an environment resolves to.",
  },
  {
    icon: GitBranch,
    title: "devbox compatible",
    body: "Same workflow and command surface as devbox. codenv import devbox converts your devbox.json, keeping every pin.",
  },
]

const badges = ["Windows x64 + arm64", "PowerShell 5.1 / 7", "Requires git", "MIT"]

const stats = [
  { value: "81", label: "tests on every push" },
  { value: "0", label: "shims left behind" },
  { value: "2+", label: "versions of one tool at once" },
  { value: "100", label: "% of user PATH preserved" },
]

export default function Home() {
  return (
    <>
      {/* Hero — Canvas UI effects need an explicit height on the wrapper. */}
      <ParticleReveal className="flex min-h-[calc(100vh-3.5rem)] items-center">
        <section className="mx-auto grid min-h-[calc(100vh-3.5rem)] w-full max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="text-center lg:text-left">
            <Badge variant="outline" className="mb-6 font-mono text-xs">
              backed by Scoop — shims disabled
            </Badge>
            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
              Reproducible dev
              <br />
              environments, <span className="text-emerald-400">Windows native</span>
            </h1>
            <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-lg lg:mx-0">
              Declare your toolchain in{" "}
              <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-sm">
                codenv.json
              </code>
              . Every machine gets the exact same package versions on PATH —
              no shims, no system PATH pollution, no silent substitutions.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Button size="lg" asChild>
                <Link to="/docs/quick-start">
                  Get started <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/docs/introduction">Read the docs</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              {badges.map((b) => (
                <Badge key={b} variant="secondary" className="font-mono text-[11px]">
                  {b}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <CodeBlock lang="powershell" code={quickstart} terminal />
            <p className="text-muted-foreground text-center text-xs lg:text-left">
              That is the entire workflow. The environment is active for that
              shell and gone for everything else.
            </p>
          </div>
        </section>
      </ParticleReveal>

      {/* Stats strip */}
      <section className="border-y bg-zinc-950/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 text-center sm:px-6 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-mono text-3xl font-semibold text-emerald-400">
                {s.value}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why: shims vs codenv */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">
                Scoop shims are great for installs.
                <br />
                Wrong for environments.
              </h2>
              <p className="text-muted-foreground mt-4">
                One global shim directory on your persistent PATH means two
                projects cannot run different versions of a tool, installs
                leak into unrelated terminals, and GUI packages quietly add
                Start Menu shortcuts.
              </p>
              <p className="text-muted-foreground mt-4">
                codenv turns Scoop inside out: it reads the resolved targets
                from Scoop's own shim files, records them in a per-store
                index, and deletes the shims directory. Environments activate
                from real versioned directories — with the licence,
                dependencies and binaries of every manifest still one{" "}
                <code className="bg-muted rounded px-1 font-mono text-sm">
                  codenv info
                </code>{" "}
                away.
              </p>
              <Button variant="outline" className="mt-6" asChild>
                <Link to="/docs/introduction">
                  How it works <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            {/* Glass wrapper needs a height in the native path. */}
            <Glass className="aspect-[4/3] w-full">
              <div className="flex h-full items-center justify-center p-4">
                <div className="w-full max-w-sm rounded-xl border bg-zinc-950 shadow-2xl">
                  <div className="flex items-center gap-2 border-b px-4 py-2.5">
                    <span className="size-2.5 rounded-full bg-red-500/70" />
                    <span className="size-2.5 rounded-full bg-yellow-500/70" />
                    <span className="size-2.5 rounded-full bg-green-500/70" />
                    <span className="text-muted-foreground ml-2 font-mono text-xs">
                      pwsh — codenv shell
                    </span>
                  </div>
                  <pre className="text-[12.5px] leading-relaxed">
                    <code className="block p-4 font-mono">
                      <span className="text-white/40">PS C:</span>
                      <span className="text-white">\myapp</span>
                      <span className="text-white/40">&gt; </span>
                      <span className="text-white">codenv shell</span>
                      {"\n\n"}
                      <span className="text-emerald-400">codenv:myapp</span>
                      <span className="text-white/40">&gt; </span>
                      <span className="text-white">7z --help | Select -First 1</span>
                      {"\n\n"}
                      <span className="text-white/60">7-Zip 24.09 (x64)</span>
                      {"\n"}
                      <span className="text-white/60">Copyright (c) 1999-2024</span>
                      {"\n\n"}
                      <span className="text-white/40">PS C:\other&gt;</span>
                      <span className="text-white"> 7z --help</span>
                      {"\n"}
                      <span className="text-white/60">7-Zip 26.03 (x64)</span>
                      {"\n"}
                      <span className="text-emerald-400">
                        {"                        "}
                        ↑ different pin, same machine
                      </span>
                    </code>
                  </pre>
                </div>
              </div>
            </Glass>
          </div>
        </div>
      </section>

      {/* How it works pipeline */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">
                Five steps, fully automatic
              </h2>
              <p className="text-muted-foreground mt-3 max-w-xl">
                What happens between <code className="bg-muted rounded px-1 font-mono text-sm">codenv add</code>{" "}
                and a working shell. Each step is fail-closed: if something
                cannot be done exactly, the command stops.
              </p>
            </div>
            <PackageOpen className="size-6 text-emerald-400" />
          </div>
          <div className="mt-12 grid gap-4 lg:grid-cols-5">
            {steps.map((s) => (
              <div
                key={s.num}
                className="bg-card/50 border-border/60 hover:border-emerald-400/40 relative rounded-xl border p-5 transition-colors"
              >
                <span className="text-emerald-400/70 font-mono text-sm">
                  {s.num}
                </span>
                <h3 className="mt-2 font-semibold">{s.title}</h3>
                <p className="text-muted-foreground mt-2 text-[13px] leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight">
            Everything codenv guarantees
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card
                key={f.title}
                className="bg-card/50 border-border/60 hover:border-emerald-400/40 transition-colors"
              >
                <CardHeader className="flex-row items-center gap-3">
                  <f.icon className="size-5 text-emerald-400" />
                  <CardTitle className="text-base">{f.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm leading-relaxed">
                  {f.body}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Session proof */}
      <section className="border-b bg-zinc-950/40">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Verified, not promised
            </h2>
            <p className="text-muted-foreground mt-4">
              The shimless approach was validated end to end against real
              Scoop packages before it shipped. After every install the store
              has no shims directory, the user PATH is byte-identical (CI
              asserts it on every run), bucket repositories stay pristine, and
              81 tests cover resolution, shell output, secrets and the devbox
              importer.
            </p>
            <Button variant="outline" className="mt-6" asChild>
              <Link to="/docs/guarantees">
                Guarantees &amp; verification <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <CodeBlock lang="powershell" code={session} terminal />
        </div>
      </section>

      {/* Bottom CTA */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="from-emerald-400/[0.06] relative overflow-hidden rounded-2xl border bg-gradient-to-b to-transparent p-10 text-center sm:p-14">
            <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
            <BookOpen className="mx-auto size-6 text-emerald-400" />
            <h2 className="mx-auto mt-4 max-w-xl text-3xl font-semibold tracking-tight">
              Ship the same environment to every machine
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-lg">
              Commit <code className="bg-muted rounded px-1 font-mono text-sm">codenv.json</code> and{" "}
              <code className="bg-muted rounded px-1 font-mono text-sm">codenv.lock.json</code>. Ignore{" "}
              <code className="bg-muted rounded px-1 font-mono text-sm">.codenv/</code>. Clone, run{" "}
              <code className="bg-muted rounded px-1 font-mono text-sm">codenv install</code>, and everyone
              is on the same toolchain.
            </p>
            <Separator className="mx-auto my-8 max-w-xs" />
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild>
                <Link to="/docs/quick-start">
                  Start in two minutes <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a
                  href="https://github.com/Tijani127/codenv"
                  target="_blank"
                  rel="noreferrer"
                >
                  Star on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
