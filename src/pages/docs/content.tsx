import { CodeBlock } from "@/components/site/code-block"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DocPage } from "./layout"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

function H2({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <h2 className={cn("mt-10", className)}>{children}</h2>
}

function H3({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <h3 className={cn("mt-8", className)}>{children}</h3>
}

const storeLayout = `%LOCALAPPDATA%\\codenv\\          CODEENV_HOME
├── store\\                      shared store (default)
│   ├── apps\\<pkg>\\<version>\\   installed packages; 'current' is a junction codenv never uses
│   ├── buckets\\<name>\\         cloned Scoop buckets (main, extras, versions)
│   ├── cache\\                  download cache
│   └── .codenv-index.json      harvested bin directories, per package@version
└── global\\store\\               separate store for 'codenv global'`

const configExample = `{
  // List form, or map form: { "ripgrep": "14.1.1" }
  "packages": ["ripgrep", "7zip@24.09", "extras/python@3.13.2"],

  // Extra buckets to clone into the store, beyond main/extras/versions
  "buckets": ["sysinternals"],

  // "shared" (default) reuses one store across projects; "project" isolates
  // this project completely so version pins can never collide.
  "store": "shared",

  // Environment variables set inside the codenv environment
  "env": { "NODE_ENV": "development" },

  // Variables whose values come from your environment, never from this file.
  "secrets": {
    "names": ["API_KEY", "DATABASE_URL"],
    "from": { "DATABASE_URL": "PG_URL,PG_URL_FALLBACK" }
  },

  // Merge other codenv.json files (paths relative to this file)
  "include": ["../shared-toolchain/codenv.json"],

  "shell": {
    // Runs on every \`codenv shell\` and \`codenv run\`
    "init_hook": "$env:PATH = \\"$env:PATH;C:\\\\tools\\"",
    "scripts": {
      "test": "pytest -q",
      "lint": "golangci-lint run"
    }
  }
}`

const servicesExample = `{
  "services": {
    "api": {
      "command": "npm run dev",
      "environment": ["PORT=3000"],
      "is_daemon": true
    },
    "db": { "command": "docker run --rm -p 5432:5432 postgres:16" }
  }
}`

export const introduction = (
  <DocPage title="Introduction">
    <p className="lead">
      <strong>codenv</strong> is a Windows reimplementation of{" "}
      <a href="https://github.com/jetify-com/devbox" target="_blank" rel="noreferrer">
        Jetify's devbox
      </a>
      , backed by <a href="https://scoop.sh" target="_blank" rel="noreferrer">Scoop</a>{" "}
      instead of Nix — and with <strong>shims disabled</strong>. You declare your
      toolchain in <code>codenv.json</code>, and every machine gets the exact
      same package versions placed directly on <code>PATH</code>, without
      shims, without touching your system <code>PATH</code>, and without
      leaving Start Menu shortcuts behind.
    </p>
    <CodeBlock lang="powershell" code={`codenv init\ncodenv add ripgrep 7zip\ncodenv shell`} terminal />

    <H2>Why shims are the wrong tool here</H2>
    <p>
      Scoop makes every program reachable through one global directory of
      shims, which it adds to your <strong>persistent user PATH</strong>. That
      is right for a general-purpose package manager and wrong for a
      reproducible environment:
    </p>
    <table>
      <thead>
        <tr>
          <th>Problem with shims</th>
          <th>What codenv does instead</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            One global shim dir, so two projects cannot run different versions
            of a tool
          </td>
          <td>
            <code>PATH</code> points at the exact{" "}
            <code>apps/&lt;pkg&gt;/&lt;version&gt;</code> directory per project
          </td>
        </tr>
        <tr>
          <td>
            The shim dir sits permanently on your <code>PATH</code> and leaks
            into unrelated terminals
          </td>
          <td>
            The shims directory is <strong>deleted</strong> after every install
          </td>
        </tr>
        <tr>
          <td>
            Installing writes to your <code>PATH</code> even when the install
            fails
          </td>
          <td>
            Your <code>PATH</code> is snapshotted and restored around every
            Scoop call
          </td>
        </tr>
        <tr>
          <td>GUI packages silently add Start Menu shortcuts</td>
          <td>Shortcuts created by an install are removed again</td>
        </tr>
      </tbody>
    </table>
    <p>
      So two projects can hold 7-Zip <strong>24.09</strong> and{" "}
      <strong>26.03</strong> at the same time, from one store, with no shims
      involved.
    </p>

    <H2>How it works</H2>
    <CodeBlock code={storeLayout} />
    <ol>
      <li>
        <strong>Bootstrap.</strong> On first use, <code>codenv</code> clones
        Scoop and the default buckets into the store using <code>git</code>.
      </li>
      <li>
        <strong>Resolve.</strong> Package specs (<code>ripgrep</code>,{" "}
        <code>7zip@24.09</code>, <code>extras/vcredist2022</code>) are resolved
        against the local bucket manifests and written to{" "}
        <code>codenv.lock.json</code> as exact versions.
      </li>
      <li>
        <strong>Install.</strong> <code>scoop install … -u</code> runs inside a
        wrapper that snapshots the persistent user <code>PATH</code>,{" "}
        <code>SCOOP_PATH</code> and <code>PSModulePath</code>, then restores
        them afterwards — even if Scoop fails.
      </li>
      <li>
        <strong>Harvest, then delete.</strong> Scoop writes shim files
        recording the <em>resolved</em> target of every binary.{" "}
        <code>codenv</code> reads those files to learn exactly which
        directories a package contributes, records them in{" "}
        <code>.codenv-index.json</code>, then <strong>deletes the entire
        shims directory</strong>.
      </li>
      <li>
        <strong>Activate.</strong> <code>codenv shell</code> builds{" "}
        <code>PATH</code> from those directories (falling back to the
        manifest's <code>bin</code> entries) and launches a child shell with
        that environment. Nothing is persisted.
      </li>
    </ol>
    <p>
      Because <code>PATH</code> is built from concrete version directories,{" "}
      <code>codenv</code> never depends on the <code>current</code> junction,
      so a background <code>scoop update</code> cannot change what an existing
      environment resolves to.
    </p>
  </DocPage>
)

export const install = (
  <DocPage title="Install">
    <p>
      Requires <strong>Windows</strong>, <strong>PowerShell 5.1 or PowerShell
      7</strong>, and <strong>git</strong> (used to clone Scoop and its
      buckets).
    </p>
    <p>
      Download the latest release and unzip it, or build from source:
    </p>
    <CodeBlock
      lang="powershell"
      code={`git clone https://github.com/Tijani127/codenv.git\ncd codenv\ngo build -o codenv.exe .`}
    />
    <p>
      The binary is self-contained; drop it anywhere on your <code>PATH</code>.
      Windows x64 and arm64 are both published.
    </p>
    <p>
      Check your setup at any time with <code>codenv doctor</code>.
    </p>

    <H2>Releases</H2>
    <p>
      Releases are named after Canadian provinces and territories. The{" "}
      <strong>major version is the province</strong>, and each{" "}
      <strong>minor version is a place inside it</strong>:
    </p>
    <table>
      <thead>
        <tr>
          <th>Tag</th>
          <th>Codename</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><code>v1.0</code></td><td>Saskatchewan</td></tr>
        <tr><td><code>v1.1</code></td><td>Regina</td></tr>
        <tr><td><code>v1.4</code></td><td>Saskatoon</td></tr>
        <tr><td><code>v2.0</code></td><td>Manitoba</td></tr>
        <tr><td><code>v2.2</code></td><td>Winnipeg</td></tr>
        <tr><td><code>v3.0</code></td><td>Alberta</td></tr>
        <tr><td><code>v4.0</code></td><td>British Columbia</td></tr>
      </tbody>
    </table>
    <p>
      To cut a release: add the tag and codename to{" "}
      <code>.github/CODENAMES.txt</code>, commit, then push the tag. The
      release workflow reads that file, so a tag that is not listed simply
      ships without a codename.
    </p>
  </DocPage>
)

export const quickStart = (
  <DocPage title="Quick start">
    <CodeBlock
      lang="powershell"
      terminal
      code={`# 1. Scaffold a project (or use 'codenv init' in an existing directory)
codenv create go myapp
cd myapp

# 2. Declare your toolchain
codenv add ripgrep 7zip
codenv add versions/python313   # a versioned package
codenv add extras/vcredist2022  # name a bucket

# 3. Use it
codenv shell                    # interactive shell, prompt marked with "codenv:"
codenv run rg --version         # one-off command in the environment
codenv shellenv | Out-String    # export the environment into an existing shell
codenv shellenv --compact       # just a single PATH export, for a profile or CI`}
    />
    <p>
      <code>codenv create</code> writes <code>codenv.json</code>, a{" "}
      <code>README.md</code> and a <code>.gitignore</code>, and pins the
      toolchain each template needs. List them with{" "}
      <code>codenv create templates</code>.
    </p>
    <p>
      <code>codenv.json</code> and <code>codenv.lock.json</code> should both
      be committed; <code>.codenv/</code> should be git-ignored:
    </p>
    <CodeBlock lang=".gitignore" code=".codenv/" />
    <p>
      Templates are <code>go</code>, <code>python</code>, <code>node</code>,{" "}
      <code>rust</code> and <code>minimal</code>.
    </p>
  </DocPage>
)

export const configuration = (
  <DocPage title="Configuration">
    <p>
      Everything a project needs lives in <code>codenv.json</code> next to
      your code. A full reference:
    </p>
    <CodeBlock lang="codenv.json" code={configExample} />
    <p>
      <code>codenv.lock.json</code> is generated. Do not edit it by hand; it
      records the exact version, bucket, architecture and dependency graph
      that <code>codenv install</code> materialised.
    </p>

    <H2>Package specs</H2>
    <ul>
      <li>
        <code>ripgrep</code> — latest version from the <code>main</code>{" "}
        bucket
      </li>
      <li>
        <code>7zip@24.09</code> — a pin to an exact version
      </li>
      <li>
        <code>extras/vcredist2022</code> — a package from a named bucket
      </li>
      <li>
        <code>versions/python313</code> — versioned Python is published as
        separate packages, so <code>python@3.13</code> is not a valid
        reference
      </li>
    </ul>
    <p>
      The map form ({"{"}<code>"ripgrep": "14.1.1"</code>{"}"}) is equivalent
      to pinning with <code>@</code>.
    </p>

    <H2>Shell hooks &amp; scripts</H2>
    <p>
      <code>shell.init_hook</code> runs on every <code>codenv shell</code> and{" "}
      <code>codenv run</code> start, after the environment is applied — handy
      for extra <code>PATH</code> entries or status output. Scripts declared
      under <code>shell.scripts</code> are run with{" "}
      <code>codenv run &lt;script&gt;</code> and propagate the child's exit
      code. Meaningful errors fail loudly: a script that exits non-zero is
      reported as-is, never swallowed.
    </p>
    <p>
      Every shell marks its prompt with a <code>codenv:</code> prefix and{" "}
      <code>CODEENV_SHELL=1</code>, so it is always obvious when you are
      inside a project environment. <code>--pure</code> strips the inherited
      environment down to a minimal set plus the package directories,{" "}
      <code>--env KEY=VALUE</code> sets individual variables and{" "}
      <code>--env-file &lt;path&gt;</code> loads a project-local file.
    </p>

    <H2>Store selection</H2>
    <p>
      <code>"store": "shared"</code> (the default) keeps one download cache
      and one store for every project on the machine, while each project
      still pins its own versions. <code>"store": "project"</code> moves the
      packages under <code>.codenv/store</code> for full isolation. The
      trade-offs, and how multiple versions of one package coexist either
      way, are covered on the{" "}
      <Link to="/docs/store" className="text-emerald-400 hover:underline">
        Store modes &amp; pinning
      </Link>{" "}
      page.
    </p>

    <H2>Services</H2>
    <p>
      Background processes a project needs — dev servers, databases, queues —
      are declared in a separate <code>codenv-services.json</code> and
      supervised by the built-in supervisor, with no external process manager
      to install. See the{" "}
      <Link to="/docs/services" className="text-emerald-400 hover:underline">
        Services
      </Link>{" "}
      page.
    </p>
  </DocPage>
)

export const secrets = (
  <DocPage title="Secrets">
    <p>
      <strong>codenv never stores secret values.</strong> You declare{" "}
      <em>which</em> variables a project needs, and codenv picks the values up
      from your environment when a shell or script starts. Nothing sensitive
      is ever written to disk or committed — <code>codenv.json</code> stays
      safe to push.
    </p>
    <CodeBlock
      lang="powershell"
      terminal
      code={`codenv secrets add API_KEY DATABASE_URL   # declare them
codenv secrets from DATABASE_URL PG_URL   # read DATABASE_URL from $PG_URL
codenv secrets list                       # shows set/unset, never values`}
    />
    <CodeBlock
      lang="codenv.json"
      code={`"secrets": {
  "names": ["API_KEY", "DATABASE_URL"],
  "from": { "DATABASE_URL": "PG_URL,PG_URL_FALLBACK" }
}`}
    />
    <ul>
      <li>
        <code>from</code> remaps a secret onto other variables, trying each in
        order and using the first one that is set. That is how you point one
        project at a developer's local database and another at CI's.
      </li>
      <li>
        If a mapped source variable is unset, <code>codenv shell</code> and{" "}
        <code>codenv run</code> <strong>fail</strong> rather than starting a
        shell where your tooling would silently misbehave.{" "}
        <code>codenv shellenv</code> only warns, because direnv and IDE
        integrations invoke it unconditionally and a hard failure there would
        break your editor.
      </li>
      <li>
        <code>codenv secrets download</code> prints values{" "}
        <strong>redacted</strong> by default; <code>--values</code> is an
        explicit opt-in.
      </li>
      <li>
        Values come from the ambient environment, so anything that can set an
        environment variable can inject one. On a shared machine, prefer a
        per-project <code>--env-file</code> over relying on global variables.
      </li>
    </ul>
  </DocPage>
)

export const store = (
  <DocPage title="Store modes & pinning">
    <p>
      <strong>Multiple versions of the same package coexist in one store.</strong>{" "}
      Two projects can pin different versions of the same tool at the same
      time:
    </p>
    <CodeBlock
      lang="terminal"
      terminal
      code={`$ codenv -c ./project-a shell 7z     # 7-Zip 24.09
$ codenv -c ./project-b shell 7z     # 7-Zip 26.03`}
    />
    <p>
      Each environment's <code>PATH</code> points at a concrete{" "}
      <code>apps&lt;pkg&gt;&lt;version&gt;</code> directory, so nothing
      interferes. Installing a new version never disturbs a project that
      pinned an older one, and a background <code>scoop update</code> cannot
      change what an existing environment resolves to.
    </p>

    <H3>
      <code>"store": "shared"</code> (default)
    </H3>
    <p>
      One store for all projects, with per-project versions selected via{" "}
      <code>PATH</code>. Fast and deduplicated: the download is shared, and
      only the directories differ. This is what you want unless you have a
      reason not to.
    </p>

    <H3>
      <code>"store": "project"</code>
    </H3>
    <p>
      A private store under <code>.codenv/store</code>, fully isolated from
      every other project. Useful when you want a project's packages to be
      removable without affecting others. The cost is disk space, since
      nothing is shared.
    </p>
    <CodeBlock
      lang="codenv.json"
      code={`{ "packages": ["7zip@24.09"], "store": "project" }`}
    />

    <H2>Version pinning details</H2>
    <p>
      Pinning to a version other than the bucket's current version relies on
      Scoop's <em>autoupdate</em>, which downloads the release to compute its
      hashes. Three caveats:
    </p>
    <ul>
      <li>
        It only works if that release publishes assets for every architecture
        Scoop probes. Packages from before arm64 Windows builds existed (for
        example <code>ripgrep@14.1.1</code>) cannot be resolved this way.
      </li>
      <li>
        Autoupdate rewrites the bucket manifest in place. <code>codenv</code>{" "}
        resets every bucket to a pristine git state after each install, so
        this can never leak a downgrade into another project's unpinned
        resolution.
      </li>
      <li>
        Versioned Python is published as separate packages (<code>python311</code>,{" "}
        <code>python312</code>, …), so <code>python@3.11</code> is not a valid
        reference. <code>codenv</code> detects this and tells you what to use
        instead.
      </li>
    </ul>
    <p>
      If a pinned version genuinely cannot be installed, <code>codenv</code>{" "}
      <strong>fails the command</strong> rather than substituting a different
      version:
    </p>
    <CodeBlock
      code={`error: could not install the exact versions this project pins: main/ripgrep@14.1.1
codenv will not substitute a different version, because that would break reproducibility`}
    />
    <p>
      That is deliberate. A reproducible environment that silently runs the
      wrong version is worse than one that tells you it cannot be built.
    </p>
  </DocPage>
)

export const commands = (
  <DocPage title="Commands & scripts">
    <table>
      <thead>
        <tr>
          <th>Command</th>
          <th>Purpose</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><code>codenv doctor</code></td><td>Diagnose the setup; <code>--fix</code> repairs what is safe to repair</td></tr>
        <tr><td><code>codenv create &lt;template&gt; [dir]</code></td><td>Scaffold a project (<code>go</code>, <code>python</code>, <code>node</code>, <code>rust</code>, <code>minimal</code>)</td></tr>
        <tr><td><code>codenv init [dir]</code></td><td>Create just <code>codenv.json</code></td></tr>
        <tr><td><code>codenv add &lt;pkg&gt;...</code></td><td>Add packages and install them</td></tr>
        <tr><td><code>codenv install</code></td><td>Install everything in <code>codenv.json</code></td></tr>
        <tr><td><code>codenv rm &lt;pkg&gt;...</code></td><td>Remove packages (<code>--purge</code> also deletes from the store)</td></tr>
        <tr><td><code>codenv update</code></td><td>Update unpinned packages to latest (<code>--all</code> re-resolves pins too)</td></tr>
        <tr><td><code>codenv list</code></td><td>Show packages, versions and install status</td></tr>
        <tr><td><code>codenv shell [cmd...]</code></td><td>Interactive shell, or run one command inside the environment</td></tr>
        <tr><td><code>codenv run &lt;script|cmd&gt;</code></td><td>Run a script from <code>codenv.json</code>, or any command</td></tr>
        <tr><td><code>codenv shellenv</code></td><td>Print shell code that applies the environment; <code>--compact</code> emits a single <code>PATH</code> export</td></tr>
        <tr><td><code>codenv search &lt;query&gt;</code></td><td>Search the local buckets</td></tr>
        <tr><td><code>codenv info &lt;pkg&gt;...</code></td><td>Show a manifest: version, licence, dependencies, binaries</td></tr>
        <tr><td><code>codenv global &lt;sub&gt;</code></td><td><code>add</code>, <code>rm</code>, <code>list</code>, <code>install</code>, <code>update</code>, <code>run</code>, <code>shellenv</code>, <code>pull</code>, <code>push</code>, <code>path</code></td></tr>
        <tr><td><code>codenv services &lt;sub&gt;</code></td><td><code>up</code>, <code>start</code>, <code>stop</code>, <code>restart</code>, <code>ls</code>, <code>logs</code>, <code>clean</code></td></tr>
        <tr><td><code>codenv secrets &lt;sub&gt;</code></td><td><code>add</code>, <code>from</code>, <code>list</code>, <code>rm</code>, <code>download</code></td></tr>
        <tr><td><code>codenv generate &lt;target&gt;</code></td><td><code>dockerfile</code>, <code>devcontainer</code>, <code>direnv</code>, <code>readme</code></td></tr>
        <tr><td><code>codenv import &lt;format&gt;</code></td><td><code>devbox</code> — convert a <code>devbox.json</code> into <code>codenv.json</code></td></tr>
        <tr><td><code>codenv cache &lt;sub&gt;</code></td><td><code>info</code>, <code>clean</code></td></tr>
        <tr><td><code>codenv completion &lt;shell&gt;</code></td><td><code>powershell</code>, <code>bash</code>, <code>zsh</code>, <code>fish</code></td></tr>
        <tr><td><code>codenv version</code></td><td>Version and store information</td></tr>
      </tbody>
    </table>
    <p>
      Useful flags: <code>-c/--config &lt;dir&gt;</code>,{" "}
      <code>-q/--quiet</code>, <code>--pure</code>,{" "}
      <code>--env KEY=VALUE</code>, <code>--env-file &lt;path&gt;</code>,{" "}
      <code>--format powershell|bash|zsh|fish|cmd</code>,{" "}
      <code>--no-install</code>.
    </p>

    <H2>Shell completion</H2>
    <Tabs defaultValue="powershell">
      <TabsList>
        <TabsTrigger value="powershell">PowerShell</TabsTrigger>
        <TabsTrigger value="bash">bash / zsh</TabsTrigger>
        <TabsTrigger value="fish">fish</TabsTrigger>
      </TabsList>
      <TabsContent value="powershell">
        <p>
          Add to your <code>$PROFILE</code>.{" "}
          <strong><code>Out-String</code> is required</strong> — piping
          straight into <code>Invoke-Expression</code> fails with{" "}
          <code>{"Missing closing '}'"}</code>, because PowerShell runs each piped
          line as its own statement and the script contains multi-line
          function blocks.
        </p>
        <CodeBlock
          lang="powershell"
          code={`codenv completion powershell | Out-String | Invoke-Expression`}
        />
      </TabsContent>
      <TabsContent value="bash">
        <CodeBlock
          lang="bash"
          code={`# ~/.bashrc or ~/.zshrc
source <(codenv completion bash)
source <(codenv completion zsh)`}
        />
      </TabsContent>
      <TabsContent value="fish">
        <CodeBlock
          lang="fish"
          code={`# ~/.config/fish/config.fish
codenv completion fish | source`}
        />
      </TabsContent>
    </Tabs>

    <H2>POSIX shells</H2>
    <p>
      <code>codenv shellenv --format</code> accepts <code>bash</code>,{" "}
      <code>sh</code>, <code>zsh</code>, <code>fish</code>, <code>ksh</code>{" "}
      and <code>dash</code>. All six share one script shape, built from POSIX
      arrays and <code>export NAME=value</code>, so nothing in it is
      bash-specific. <code>codenv</code> also detects the shell from{" "}
      <code>$SHELL</code> and, under Git Bash or MSYS2, from{" "}
      <code>$MSYSTEM</code>, so{" "}
      <code>eval "$(codenv shellenv)"</code> works without naming a format.
      Override with <code>CODEENV_SHELL_FORMAT</code> when the detection is
      wrong.
    </p>
    <p>
      <code>codenv shell</code> can start <code>zsh</code>, <code>fish</code>,{" "}
      <code>sh</code>, <code>ksh</code> and <code>dash</code> directly, and
      runs your init hook and scripts through them.
    </p>
    <p>
      Two things remain Windows-specific:
    </p>
    <ul>
      <li>
        Packages are installed by Scoop. A unix build needs a different
        installer and a different shim concept; the shim-harvesting trick has
        no unix equivalent.
      </li>
      <li>
        Generated paths use the platform separator, so the script is correct
        either way, but the store layout and manifest lookup assume Windows
        paths.
      </li>
    </ul>
  </DocPage>
)

export const guarantees = (
  <DocPage title="Guarantees">
    <H3 className="mt-0">What codenv guarantees</H3>
    <ul>
      <li>
        <strong>No system <code>PATH</code> pollution.</strong> The persistent
        user <code>PATH</code> is snapshotted before every Scoop invocation
        and restored afterwards, including on failure. Start Menu shortcuts
        created by an install are removed.
      </li>
      <li>
        <strong>No shims.</strong> The shims directory is deleted after every
        install, and <code>PATH</code> is composed from real package
        directories.
      </li>
      <li>
        <strong>Version fidelity.</strong> <code>PATH</code> references{" "}
        <code>apps&lt;pkg&gt;&lt;version&gt;</code>, never the{" "}
        <code>current</code> junction, so a background{" "}
        <code>scoop update</code> cannot change what an existing environment
        resolves to. Multiple versions of a package coexist in the store, so
        one project can pin an older version without affecting another.
      </li>
      <li>
        <strong>No silent substitution.</strong> If an exact pinned version
        cannot be installed, the command fails instead of quietly running
        something else.
      </li>
      <li>
        <strong>Reproducibility.</strong> <code>codenv.lock.json</code> pins
        exact versions; <code>codenv install</code> materialises exactly
        those.
      </li>
      <li>
        <strong>Idempotence.</strong> Re-running <code>install</code> reuses
        what is already present and does nothing when nothing changed.
      </li>
      <li>
        <strong>Exit-code fidelity.</strong> <code>codenv run</code> and{" "}
        <code>codenv shell &lt;cmd&gt;</code> propagate the child's exit code.
      </li>
    </ul>

    <H2>How this was verified</H2>
    <p>
      The shimless approach is not theoretical. It was validated end to end
      against real Scoop packages before being implemented, and every claim in
      the docs is reproducible:
    </p>
    <ul>
      <li>
        After <code>codenv install</code>, the store has{" "}
        <strong>no <code>shims</code> directory</strong> at all.
      </li>
      <li>
        <code>rg --version</code> inside <code>codenv shell</code> reports the
        version pinned in <code>codenv.lock.json</code>, not the version on
        the ambient system <code>PATH</code>.
      </li>
      <li>
        The persistent user <code>PATH</code> is byte-identical before and
        after any <code>codenv</code> command, including failed ones. The CI
        build asserts this on every run.
      </li>
      <li>
        <code>codenv shell --pure</code> reduces the environment from 96
        variables to 36 while the packages still resolve.
      </li>
      <li>
        Two projects hold different versions of the same tool simultaneously (
        <code>7zip@24.09</code> and <code>7zip@26.03</code>).
      </li>
      <li>
        Bucket repositories are left pristine (<code>git status</code> clean)
        after every install, so Scoop's autoupdate can never leak a downgrade
        between projects.
      </li>
      <li>
        81 tests cover the lockfile, package resolution, secret resolution,
        template rendering, <code>PATH</code> lookup, shell-output formats,
        config merging, package layout probing, shell detection, and the
        devbox import mapping. CI runs them on every push.
      </li>
    </ul>
  </DocPage>
)

export const devbox = (
  <DocPage title="vs. devbox">
    <p>
      <code>codenv</code> mirrors devbox's behaviour and command surface.
      These are the deliberate differences:
    </p>
    <table>
      <thead>
        <tr>
          <th>devbox</th>
          <th>codenv</th>
          <th>Why</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Nix store, content-addressed</td>
          <td>Scoop store, versions kept side by side</td>
          <td>Different package manager. Reproducibility comes from the lockfile rather than content addressing.</td>
        </tr>
        <tr>
          <td><code>devbox.json</code> + <code>devbox.lock.json</code></td>
          <td><code>codenv.json</code> + <code>codenv.lock.json</code></td>
          <td>Same model, different names</td>
        </tr>
        <tr>
          <td><code>devbox secrets</code> (Jetify Cloud)</td>
          <td><code>codenv secrets</code> (local, no cloud)</td>
          <td>Secrets are declared, not stored: values come from your environment at shell start. No account required.</td>
        </tr>
        <tr>
          <td><code>devbox auth</code>, <code>devbox cache upload</code></td>
          <td>not implemented</td>
          <td>Jetify Cloud services. There is nothing to authenticate against locally.</td>
        </tr>
        <tr>
          <td>Devbox plugins (jsonnet)</td>
          <td>not implemented</td>
          <td>Plugins describe Nix build setup; Scoop packages are prebuilt and need none.</td>
        </tr>
        <tr>
          <td><code>devbox generate dockerfile</code> → Linux image</td>
          <td><code>codenv generate dockerfile</code> → <strong>Windows</strong> container image</td>
          <td>Scoop cannot run in a Linux container.</td>
        </tr>
        <tr>
          <td><code>devbox services</code> (process-compose)</td>
          <td><code>codenv services</code> (built-in supervisor)</td>
          <td>No external process manager to install on Windows. Different config format.</td>
        </tr>
        <tr>
          <td><code>devbox create &lt;template&gt;</code> (remote catalogue)</td>
          <td><code>codenv create &lt;template&gt;</code> (built-in)</td>
          <td>Built-in templates ship with the binary; there is no remote template catalogue.</td>
        </tr>
        <tr>
          <td><code>devbox.json</code> written by hand</td>
          <td><code>codenv import devbox</code> converts one</td>
          <td>Package names are mapped to their Scoop equivalents. Packages with no equivalent are reported and left out rather than replaced by a guess.</td>
        </tr>
        <tr>
          <td><code>devbox add --platform</code></td>
          <td>not implemented</td>
          <td>Only one platform exists.</td>
        </tr>
      </tbody>
    </table>

    <H2>Importing from devbox</H2>
    <p>
      <code>codenv import devbox</code> converts your existing setup in one
      command — it keeps every version pin, maps Nix spellings to their Scoop
      equivalents, and adds buckets such as <code>java</code> automatically.
      Packages with no Scoop equivalent are reported and left out rather than
      replaced by a guess, with a suggested alternative where one exists.
    </p>
    <p>
      The full conversion rules and the generated-file commands (
      <code>dockerfile</code>, <code>devcontainer</code>, <code>direnv</code>,{" "}
      <code>readme</code>) are on the{" "}
      <Link to="/docs/generate" className="text-emerald-400 hover:underline">
        Generate &amp; import
      </Link>{" "}
      page.
    </p>

    <Separator className="my-8" />

    <H2>Two structural notes about Scoop</H2>
    <ul>
      <li>
        <strong>The dependency graph is effectively flat.</strong> Of the
        4,815 manifests in <code>main</code>, <code>extras</code> and{" "}
        <code>versions</code>, <strong>zero</strong> declare a{" "}
        <code>dependencies</code> key — modern Scoop uses{" "}
        <code>pre_install</code>/<code>installer</code> scripts instead. The
        dependency support in <code>codenv</code> is therefore correct but
        rarely exercised. Harvesting Scoop's own shim metadata is what makes{" "}
        <code>PATH</code> complete, since it reflects the real on-disk layout
        including <code>persist</code> directories.
      </li>
      <li>
        <strong><code>git</code> is required</strong>, because Scoop is a git
        checkout and <code>codenv</code> clones it and the buckets.
      </li>
    </ul>
  </DocPage>
)

const envVarsRead = [
  ["CODEENV_HOME", "Override the codenv home directory (default %LOCALAPPDATA%\\codenv)"],
  ["CODEENV_SHELL_BIN", "Force the shell `codenv shell` launches (PowerShell path, `bash`, `cmd`, ...)"],
  ["CODEENV_SHELL_FORMAT", "Default format for `shellenv` output: `powershell`, `bash` or `cmd`"],
  ["CODEENV_POWERSHELL", "PowerShell executable used to run Scoop internally"],
  ["NO_COLOR, CODEENV_FORCE_COLOR", "Colour control"],
]

const envVarsSet = [
  ["CODEENV_SHELL", "`1` inside a codenv environment"],
  ["CODEENV_PROJECT_DIR", "Absolute path of the active project"],
  ["CODEENV_GLOBAL", "`1` inside a `codenv global` environment"],
  ["CODEENV_STORE", "Store root backing the current environment"],
  ["CODEENV_PATH_PREFIX", "The package directories codenv prepended to PATH"],
]

export const reference = (
  <DocPage title="Env vars & troubleshooting">
    <H2 className="mt-0">Troubleshooting</H2>
    <p>Start with:</p>
    <CodeBlock
      lang="powershell"
      terminal
      code={`codenv doctor          # diagnose
codenv doctor --fix    # repair what codenv can safely repair`}
    />
    <p>
      <code>doctor</code> checks the things that actually go wrong: missing{" "}
      <code>git</code>, an unwritable store, bucket manifests left dirty by
      Scoop's autoupdate, a leftover shims directory, index entries for
      packages no longer on disk, pinned versions that are not installed,
      unset secret sources, and package directories that are already on your
      system <code>PATH</code>. It exits non-zero only when something
      genuinely blocks codenv.
    </p>
    <p>
      <code>--fix</code> is deliberately conservative. It removes a stray
      shims directory, resets dirty bucket manifests, and prunes dead index
      entries. It never installs or uninstalls packages, because that needs
      your judgement — it points you at <code>codenv install</code> instead.
    </p>

    <Separator className="my-8" />

    <H2>Environment variables codenv reads</H2>
    <table>
      <thead>
        <tr><th>Variable</th><th>Purpose</th></tr>
      </thead>
      <tbody>
        {envVarsRead.map(([name, purpose]) => (
          <tr key={name}>
            <td><code>{name}</code></td>
            <td>
              {purpose.split("`").map((part, i) =>
                i % 2 === 1 ? <code key={i}>{part}</code> : part,
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <H2>Environment variables codenv sets</H2>
    <p>Inside an activated environment:</p>
    <table>
      <thead>
        <tr><th>Variable</th><th>Purpose</th></tr>
      </thead>
      <tbody>
        {envVarsSet.map(([name, purpose]) => (
          <tr key={name}>
            <td><code>{name}</code></td>
            <td>
              {purpose.split("`").map((part, i) =>
                i % 2 === 1 ? <code key={i}>{part}</code> : part,
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <H2>Project layout on disk</H2>
    <p>Commit these, ignore that:</p>
    <ul>
      <li>
        <code>codenv.json</code> — commit
      </li>
      <li>
        <code>codenv.lock.json</code> — commit
      </li>
      <li>
        <code>codenv-services.json</code> — commit, if you use services
      </li>
      <li>
        <code>.codenv/</code> — git-ignore
      </li>
    </ul>
    <p className="flex items-center gap-2">
      <Badge variant="outline" className="font-mono">v1.0 Saskatchewan</Badge>
      is the current stable release — see the{" "}
      <a href="https://github.com/Tijani127/codenv/blob/main/CHANGELOG.md" target="_blank" rel="noreferrer">
        full changelog
      </a>
      .
    </p>
  </DocPage>
)

export const services = (
  <DocPage title="Services">
    <p>
      A codenv environment is not just tools — it can also run the processes a
      project needs. Services are declared in{" "}
      <code>codenv-services.json</code> instead of devbox's{" "} <code>process-compose.yml</code>, next to your <code>codenv.json</code>{" "}
      and supervised by a <strong>built-in supervisor</strong>: there is no
      external process manager to install on Windows.
    </p>

    <H2>The services file</H2>
    <CodeBlock lang="codenv-services.json" code={servicesExample} />
    <ul>
      <li>
        <code>command</code> — the process to start, run inside the project's
        environment so the pinned toolchain is on <code>PATH</code>.
      </li>
      <li>
        <code>environment</code> — per-service variables, on top of the ones
        declared in <code>codenv.json</code>.
      </li>
      <li>
        <code>is_daemon</code> — run in the background; services without it
        stream their logs directly.
      </li>
      <li>
        <code>depends_on</code> — start other services first, in dependency
        order.
      </li>
    </ul>

    <H2>Managing services</H2>
    <table>
      <thead>
        <tr><th>Command</th><th>Purpose</th></tr>
      </thead>
      <tbody>
        <tr><td><code>codenv services up</code></td><td>Start everything declared, in dependency order</td></tr>
        <tr><td><code>codenv services start [name]</code></td><td>Start one or all</td></tr>
        <tr><td><code>codenv services stop [name]</code></td><td>Stop one or all</td></tr>
        <tr><td><code>codenv services restart [name]</code></td><td>Restart one or all</td></tr>
        <tr><td><code>codenv services ls</code></td><td>List services and their state</td></tr>
        <tr><td><code>codenv services logs &lt;name&gt;</code></td><td>Show a service's logs</td></tr>
        <tr><td><code>codenv services clean</code></td><td>Clean up leftover state</td></tr>
      </tbody>
    </table>
    <p>
      Unlike devbox, which shells out to <code>process-compose</code>, the
      supervisor ships inside the binary. It's not like devbox's <code>process-compose.yml</code>, but it is a drop-in replacement for the same use cases.
    </p>
  </DocPage>
)

export const generate = (
  <DocPage title="Generate & import">
    <p>
      codenv can emit supporting files for a project and convert devbox
      projects. Everything is generated from <code>codenv.json</code> and{" "}
      <code>codenv.lock.json</code>, so the output always matches the pinned
      toolchain.
    </p>

    <H2>Generate</H2>
    <table>
      <thead>
        <tr><th>Command</th><th>Produces</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><code>codenv generate dockerfile</code></td>
          <td>
            A <strong>Windows</strong> container image that installs the
            pinned packages — Scoop cannot run in a Linux container, so this
            is deliberately different from devbox
          </td>
        </tr>
        <tr>
          <td><code>codenv generate devcontainer</code></td>
          <td>A VS Code dev container wired for the environment</td>
        </tr>
        <tr>
          <td><code>codenv generate direnv</code></td>
          <td>
            An <code>.envrc</code> that applies the environment via{" "}
            <code>shellenv</code> and{" "}
            <a href="https://direnv.net" target="_blank" rel="noreferrer">direnv</a>
          </td>
        </tr>
        <tr>
          <td><code>codenv generate readme</code></td>
          <td>A README section documenting the project's environment</td>
        </tr>
      </tbody>
    </table>

    <H2>Importing from devbox</H2>
    <CodeBlock
      lang="sh"
      code={`codenv import devbox            # writes codenv.json from ./devbox.json
codenv import devbox --dry-run  # report the conversion without writing
codenv import devbox --force    # overwrite an existing codenv.json`}
    />
    <p>
      The conversion is a <strong>test-enforced mapping table</strong>: every
      entry is checked against the real <code>main</code>, <code>extras</code>{" "}
      and <code>versions</code> buckets, so it cannot drift into naming a
      package that does not exist.
    </p>
    <ul>
      <li>
        Version pins are kept. A version written the Nix way becomes a
        versions-bucket pin: <code>postgresql_16</code> imports as{" "}
        <code>versions/postgresql16</code>, <code>python311</code> as{" "}
        <code>versions/python311</code> — never an unpinned guess.
      </li>
      <li>
        Nix attribute-path and flake-reference spellings such as{" "}
        <code>python310Packages.python310</code> and{" "}
        <code>flake:nixpkgs#go</code> are reduced to a bare name.
      </li>
      <li>
        Java imports from the <code>java</code> bucket — for example{" "}
        <code>java21</code> becomes <code>java/temurin21-jdk</code> — and the
        bucket is added to <code>"buckets"</code> automatically, because
        codenv does not sync it by default.
      </li>
      <li>
        Packages with no Scoop equivalent are{" "}
        <strong>reported and left out</strong> rather than replaced by a
        guess. Known cases carry a suggested alternative, for example{" "}
        <code>tmux</code> points at <code>cygwin</code> or <code>msys2</code>.
      </li>
      <li>
        <code>golang</code> (the name asdf and mise use for Go) is mapped, and
        names containing a version dot such as <code>golang1.22</code> are
        handled.
      </li>
    </ul>
  </DocPage>
)
