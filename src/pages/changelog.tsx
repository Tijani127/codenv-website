import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mt-6">
      <h3 className="text-sm font-semibold tracking-wide text-emerald-400 uppercase">
        {title}
      </h3>
      <ul className="text-muted-foreground mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
        {items.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ul>
    </section>
  )
}

export default function Changelog() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight">Changelog</h1>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        All notable changes to codenv are recorded here. The format follows{" "}
        <a
          href="https://keepachangelog.com/en/1.1.0/"
          target="_blank"
          rel="noreferrer"
          className="text-emerald-400 hover:underline"
        >
          Keep a Changelog
        </a>{" "}
        and codenv adheres to Semantic Versioning.
      </p>
      <p className="text-muted-foreground mt-3 leading-relaxed">
        Release codenames are Canadian provinces and territories: the{" "}
        <strong>major version is the province</strong>, and each{" "}
        <strong>minor version names a place inside it</strong> (v1.0
        Saskatchewan, v1.1 Regina, v2.0 Manitoba, v2.2 Winnipeg). The map
        lives in <code className="bg-muted rounded px-1 font-mono text-[13px]">.github/CODENAMES.txt</code>;
        the release workflow reads it, so a tag that is not listed ships
        without a codename.
      </p>

      <Separator className="my-10" />

      <div className="mb-2 flex items-center gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">Unreleased</h2>
        <Badge variant="secondary" className="font-mono text-[11px]">
          in development
        </Badge>
      </div>

      <Section
        title="Fixed"
        items={[
          "<code>codenv shellenv --format bash</code> split <code>PATH</code> on <code>:</code> regardless of platform. On Windows <code>PATH</code> is joined with <code>;</code>, so the script never split it and the inherited entries were not deduplicated. Every generated format now uses the platform separator.",
          "<code>codenv shell</code> could not start a unix shell. Only <code>pwsh</code>, <code>powershell</code> and <code>bash</code> were recognised, so <code>zsh</code>, <code>fish</code>, <code>sh</code>, <code>dash</code> and <code>ksh</code> were launched with <code>/c</code>, which no unix shell accepts. They are now recognised and run with <code>-c</code>.",
          "Shell detection compared substrings, so a program named <code>bashtop</code> was treated as bash and <code>resharper</code> as powershell. It now compares the program name.",
          "<code>CODEENV_SHELL_FORMAT</code> and <code>$SHELL</code> detection had drifted apart. Both now go through the same parser, and an unrecognised value falls back to detection instead of silently defaulting.",
        ]}
      />
      <Section
        title="Added"
        items={[
          "<code>codenv</code> silently resolved the <strong>wrong</strong> program when a manifest declared no <code>bin</code>. About 1,346 of the 4,716 manifests in the synced buckets declare no bin and keep their executables in a subdirectory, so only the app root was put on PATH. Installing a JDK from the <code>java</code> bucket and running <code>java</code> returned the system JDK instead of the pinned one. codenv now probes the installed layout for the directories that actually hold executables.",
          "<code>\"buckets\"</code> in <code>codenv.json</code> was ignored. <code>config.Merge</code> copied the receiver's buckets but never appended the other side's, so any bucket from an included config was dropped and never cloned. A project declaring <code>\"buckets\": [\"java\"]</code> failed to resolve anything.",
          "<code>codenv import devbox</code> mangled names containing a version dot. <code>golang1.22</code> was split on the dot and reduced to <code>22</code>, so the package was lost.",
          "<code>codenv import devbox</code> did not map <code>golang</code>, the name asdf and mise use for Go.",
          "<code>codenv import devbox</code> reported \"no equivalent found\" even for packages that exist in a bucket codenv knows about but does not sync, such as Java. The message now names what it actually checked.",
          "<code>codenv import devbox</code> converts a <code>devbox.json</code> into <code>codenv.json</code>. Nix package names are mapped to the Scoop packages that provide them, attribute-path and flake-reference spellings (<code>python310Packages.python310</code>, <code>flake:nixpkgs#go</code>) reduce to a bare name, and version suffixes are preserved as versions-bucket pins so <code>postgresql_16</code> becomes <code>versions/postgresql16</code> rather than an unpinned <code>postgresql</code>.",
          "Packages with no Scoop equivalent are reported and left out instead of being replaced by a guess. Known cases carry a suggested alternative, for example <code>tmux</code> points at <code>cygwin</code> or <code>msys2</code>.",
          "Java imports from the <code>java</code> bucket, with pins such as <code>java21</code> becoming <code>java/temurin21-jdk</code>, and the required bucket added to the generated config automatically.",
          "<code>--dry-run</code> reports the conversion without writing anything; <code>--force</code> overwrites an existing <code>codenv.json</code>.",
          "The mapping is a test-enforced table: every entry is checked against the real <code>main</code>, <code>extras</code> and <code>versions</code> buckets, so a mapping cannot drift into naming a package that does not exist.",
          "<code>codenv shellenv --format</code> accepts <code>zsh</code>, <code>sh</code>, <code>ksh</code> and <code>dash</code> alongside <code>bash</code> and <code>fish</code>. The POSIX script is verified by test to avoid bash-only constructs such as <code>[[</code>, <code>local</code> and <code>mapfile</code>.",
        ]}
      />
      <Section
        title="Removed"
        items={[
          "<code>codenv shellenv --compact</code> was advertised in <code>--help</code> but never read, so it silently printed the full multi-line script. It now emits a single <code>PATH</code> export for PowerShell, bash and cmd.",
          "<code>CODEENV_SHELL_FORMAT</code> was documented but not implemented. It now selects the <code>shellenv</code> format and falls back to auto-detection when the value is not recognised.",
          "<code>codenv rm --force</code> did nothing; <code>rm</code> already succeeds when a package is absent, so the flag has been removed.",
          "<code>LookPath</code> resolved relative paths against codenv's own working directory instead of the project's, so <code>codenv shell .\\bin\\app.exe</code> failed. Relative paths are now resolved against the project directory.",
          "An in-place environment filter used by <code>--pure</code> compacted a slice without shortening it, which leaked unrelated variables into the sanitised environment.",
          "Dead code with no callers: <code>engine.lastLines</code>, <code>project.RelOrSame</code>, <code>ui.SetOutput</code>, <code>ui.SetColorEnabled</code>, <code>ui.KeyValue</code>, <code>ui.Rule</code> and an unused <code>flagAddOutputs</code> variable.",
        ]}
      />
      <Section
        title="Documentation"
        items={[
          "Documented installing shell completions per shell, and called out that PowerShell needs <code>Out-String</code>: <code>codenv completion powershell | Out-String | Invoke-Expression</code>. Piping straight into <code>Invoke-Expression</code> fails with <code>Missing closing '}'</code>, because PowerShell runs each piped line as its own statement and the script contains multi-line function blocks.",
        ]}
      />

      <Separator className="my-10" />

      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">1.0.0 — Saskatchewan</h2>
        <Badge variant="outline" className="font-mono text-[11px]">
          2026-10-06 · stable
        </Badge>
      </div>
      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
        First stable release. codenv creates isolated, reproducible
        development environments on Windows, backed by Scoop instead of Nix,
        with <strong>shims disabled</strong>.
      </p>

      <Section
        title="Environments"
        items={[
          "<code>codenv init</code> creates a <code>codenv.json</code>; <code>codenv add/rm/install/update/list</code> manage packages.",
          "<code>codenv.lock.json</code> pins exact versions, buckets and architectures. A pinned version that cannot be installed is a hard error, never a silent substitution.",
          "<strong>Multiple versions of one package coexist in a shared store.</strong> Two projects can pin 7-Zip 24.09 and 26.03 at the same time, from one store.",
          "<code>store: \"project\"</code> gives a project a private store under <code>.codenv/store</code>.",
          "<code>include</code> merges other <code>codenv.json</code> files.",
          "Every install snapshots and restores your persistent <code>PATH</code>, <code>SCOOP_PATH</code> and <code>PSModulePath</code>, even when Scoop fails, and removes Start Menu shortcuts that an install created.",
        ]}
      />
      <Section
        title="Shell and running things"
        items={[
          "<code>codenv shell</code> opens an isolated shell with a <code>codenv:</code> prompt marker; <code>codenv shell &lt;cmd&gt;</code> runs one command inside it.",
          "<code>codenv run</code> executes a script from <code>codenv.json</code> or any command, propagating the child's exit code.",
          "<code>shell.init_hook</code> runs on every shell and script start.",
          "<code>--pure</code> reduces the environment to a minimal set; <code>--env</code>/<code>--env-file</code> set variables; <code>codenv shellenv</code> prints PowerShell, bash or cmd code for direnv and editor integrations.",
        ]}
      />
      <Section
        title="Global packages"
        items={[
          "<code>codenv global add/rm/list/install/update/run/shellenv/pull/push/path</code> manage a set of tools available to every project, in their own store.",
        ]}
      />
      <Section
        title="Services"
        items={[
          "<code>codenv services up/start/stop/restart/ls/logs/clean</code> supervise the services in <code>codenv-services.json</code>, natively, with no external process manager. Supports <code>depends_on</code>, per-service environment and working directories, and background or streaming-log operation.",
        ]}
      />
      <Section
        title="Secrets"
        items={[
          "<code>codenv secrets add/from/list/rm/download</code> declare which variables a project needs. <strong>Values are never stored.</strong> They are read from your environment when a shell or script starts, so <code>codenv.json</code> stays safe to commit.",
          "<code>secrets.from</code> remaps a secret onto other variables, trying each in order.",
          "A missing source variable is a hard error for <code>shell</code>/<code>run</code> and a warning for <code>shellenv</code>, because editor integrations invoke the latter unconditionally.",
          "<code>secrets download</code> redacts by default; <code>--values</code> is an explicit opt-in.",
        ]}
      />
      <Section
        title="Discovery and diagnostics"
        items={[
          "<code>codenv search</code> searches the local buckets offline. <code>codenv info</code> shows a manifest: version, licence, dependencies, binaries.",
          "<code>codenv doctor</code> checks the things that actually break: missing git, an unwritable store, dirty bucket manifests, a stray shims directory, stale index entries, uninstalled pins, unset secret sources, and packages already on your system PATH. <code>doctor --fix</code> repairs what is safe to repair and never installs or removes packages.",
        ]}
      />
      <Section
        title="Scaffolding and generation"
        items={[
          "<code>codenv create &lt;template&gt;</code> scaffolds a project with a pinned toolchain. Templates: <code>go</code>, <code>python</code>, <code>node</code>, <code>rust</code>, <code>minimal</code>.",
          "<code>codenv generate dockerfile|devcontainer|direnv|readme</code> produces supporting files.",
          "<code>codenv cache info|clean</code>, and shell completions for PowerShell, bash, zsh and fish.",
        ]}
      />
      <Section
        title="Known limitations"
        items={[
          "<strong>Windows only.</strong> Scoop and Windows PATH semantics are the foundation. The code compiles elsewhere, but the tool cannot function there.",
          "<strong>Requires git.</strong> Scoop is a git checkout and codenv clones its buckets.",
          "<strong>Historical version pins are limited by Scoop.</strong> Releases from before arm64 Windows existed (for example <code>ripgrep@14.1.1</code>) cannot be resolved via autoupdate.",
          "<strong>Versioned Python is published as separate packages.</strong> <code>python@3.11</code> is not a valid reference; use <code>versions/python311</code>.",
          "<strong>The package dependency graph is effectively flat.</strong> None of the 4,815 manifests in <code>main</code>, <code>extras</code> and <code>versions</code> declare a <code>dependencies</code> key.",
        ]}
      />
      <Section
        title="Not implemented"
        items={[
          "Jetify Cloud equivalents: <code>auth</code>, and cloud <code>secrets</code>/<code>cache</code>. There is nothing to authenticate against locally.",
          "Devbox plugins, which describe Nix build setup. Scoop packages are prebuilt.",
          "<code>devbox create</code>-style templates from a remote catalogue.",
          "Linux and macOS releases. <code>generate dockerfile</code> emits a <strong>Windows</strong> container Dockerfile, since a Linux image cannot run Scoop.",
        ]}
      />
    </div>
  )
}
