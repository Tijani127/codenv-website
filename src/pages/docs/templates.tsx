import { CodeBlock } from "@/components/site/code-block"
import { DocPage } from "./layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

function H2({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h2 className={cn("mt-10", className)}>{children}</h2>
}

// All data below is real: templates.List() and the scaffolded files come from
// running `codenv create <tpl>` with the v1.2 binary, and the script tables
// are the actual shell.scripts blocks written into each codenv.json.
const templates: {
  name: string
  title: string
  description: string
  packages: string[]
  files: string[]
  scripts: [string, string][]
}[] = [
  {
    name: "go",
    title: "Go",
    description: "Go module with test, vet and build scripts",
    packages: ["go", "ripgrep"],
    files: ["README.md", "codenv.json", ".gitignore", "go.mod", "main.go", "main_test.go"],
    scripts: [
      ["build", "go build -o bin/go.exe ."],
      ["run", "go run ."],
      ["test", "go test ./..."],
      ["vet", "go vet ./..."],
      ["fmt", "gofmt -w ."],
      ["check", "codenv run vet; if ($LASTEXITCODE -eq 0) { codenv run test } else { exit $LASTEXITCODE }"],
    ],
  },
  {
    name: "python",
    title: "Python",
    description: "Python project with a virtualenv-friendly layout",
    packages: ["versions/python313", "ripgrep"],
    files: ["README.md", "codenv.json", ".gitignore"],
    scripts: [
      ["venv", "python -m venv .venv"],
      ["activate", "Write-Output 'run .venv/Activate.ps1 (bash: source .venv/bin/activate) inside the shell'"],
      ["test", "python -m pytest -q"],
      ["lint", "python -m ruff check ."],
    ],
  },
  {
    name: "node",
    title: "Node.js",
    description: "Node.js project pinned to an LTS runtime",
    packages: ["nodejs-lts", "ripgrep"],
    files: ["README.md", "codenv.json", ".gitignore"],
    scripts: [
      ["install-deps", "npm install"],
      ["build", "npm run build"],
      ["test", "npm test"],
      ["lint", "npm run lint"],
    ],
  },
  {
    name: "rust",
    title: "Rust",
    description: "Cargo project with fmt, clippy and test scripts",
    packages: ["rust", "ripgrep"],
    files: ["README.md", "codenv.json", ".gitignore"],
    scripts: [
      ["build", "cargo build --release"],
      ["test", "cargo test"],
      ["lint", "cargo clippy -- -D warnings"],
      ["fmt", "cargo fmt"],
    ],
  },
  {
    name: "minimal",
    title: "Minimal",
    description: "Just codenv.json, with example scripts",
    packages: ["ripgrep"],
    files: ["README.md", "codenv.json", ".gitignore"],
    scripts: [["hello", 'Write-Output "hello from minimal"']],
  },
]

export function Templates() {
  return (
    <DocPage title="Project templates">
      <p className="lead">
        <code>codenv create</code> scaffolds a complete project: a{" "}
        <code>codenv.json</code> with the right toolchain packages pre-pinned, a{" "}
        <code>.gitignore</code>, a README, and starter code with{" "}
        <code>codenv run</code> scripts already wired. Start from a builtin
        template, a local directory, or any git repository. Builtin templates
        also come as a top-level command:
      </p>
      <CodeBlock lang="powershell" code="codenv templates" terminal />

      <H2>What you get</H2>
      <p>
        Every template copies its files into a new directory (named after the
        template unless you pass one), with the placeholders{" "}
        <code>{"{{PROJECT}}"}</code>, <code>{"{{TITLE}}"}</code> and{" "}
        <code>{"{{MODULE}}"}</code> expanded. <code>codenv create</code> then
        prints exactly what it wrote:
      </p>
      <CodeBlock
        lang="text"
        code={`✓ Created a Go project in ...\\go
    · README.md
    · codenv.json
    · .gitignore
    · go.mod
    · main.go
    · main_test.go
hint: cd go && codenv install && codenv shell`}
      />
      <p>
        The three steps the hint gives you are all it takes:{" "}
        <code>cd</code> in, <code>codenv install</code> to build the
        environment, <code>codenv shell</code> to enter it.
      </p>

      <H2>The builtin templates</H2>
      <p>
        Packages and scripts below are the real contents each template writes
        into its <code>codenv.json</code> — run{" "}
        <code>codenv templates</code> to see this list live.
      </p>

      <Tabs defaultValue="go" className="mt-4">
        <TabsList className="flex-wrap">
          {templates.map((t) => (
            <TabsTrigger key={t.name} value={t.name}>
              {t.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {templates.map((t) => (
          <TabsContent key={t.name} value={t.name}>
            <p className="text-muted-foreground text-sm">{t.description}</p>
            <p className="mt-3 text-sm">
              Pre-pinned packages:{" "}
              {t.packages.map((p) => (
                <code key={p} className="mr-2">
                  {p}
                </code>
              ))}
            </p>
            <p className="mt-3 text-sm">
              Scaffolded files: {t.files.map((f) => f).join(" · ")}
            </p>
            <p className="text-muted-foreground mt-4 text-sm">
              Scripts the template defines (run with{" "}
              <code>codenv run &lt;name&gt;</code>):
            </p>
            <table>
              <thead>
                <tr>
                  <th>Script</th>
                  <th>Command</th>
                </tr>
              </thead>
              <tbody>
                {t.scripts.map(([name, cmd]) => (
                  <tr key={name}>
                    <td>
                      <code>codenv run {name}</code>
                    </td>
                    <td>{cmd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <CodeBlock
              className="mt-4"
              lang="powershell"
              code={`codenv create ${t.name}\ncd ${t.name}\ncodenv install`}
              terminal
            />
          </TabsContent>
        ))}
      </Tabs>

      <H2>Generate CI for a scaffolded project</H2>
      <p>
        Every builtin template works with{" "}
        <Link to="/docs/ci" className="text-emerald-400 hover:underline">
          <code>codenv generate ci</code>
        </Link>{" "}
        — run it right after <code>codenv create</code> and the GitHub Actions
        workflow is committed alongside the scaffold:
      </p>
      <CodeBlock
        lang="powershell"
        code={`codenv create rust\ncd rust\ncodenv generate ci\ncodenv install`}
        terminal
      />

      <H2>Your own templates</H2>
      <p>
        <code>codenv create</code> resolves its first argument in this order:
      </p>
      <ul>
        <li>
          <strong>Builtin</strong> — <code>go</code>, <code>python</code>,{" "}
          <code>node</code>, <code>rust</code>, <code>minimal</code>. Builtins
          win if a local template shares the name.
        </li>
        <li>
          <strong>Local</strong> — a subdirectory of{" "}
          <code>~/.codenv/templates</code> (or the directory set in{" "}
          <code>CODEENV_TEMPLATES</code>). The files are copied as-is and{" "}
          <code>{"{{PROJECT}}"}</code> substitution still applies.
        </li>
        <li>
          <strong>Git</strong> — <code>owner/repo</code>,{" "}
          <code>github:owner/repo</code>, or a full <code>https://</code> /{" "}
          <code>git@</code> URL. Use <code>--ref</code> for a branch or tag:
        </li>
      </ul>
      <CodeBlock
        lang="powershell"
        code={`codenv create github:myteam/dotnet-template\ncodenv create myteam/dotnet-template my-api --ref v2`}
        terminal
      />
      <p>
        If the target directory already exists, <code>codenv create</code>{" "}
        refuses to overwrite anything — pass <code>--force</code>, or{" "}
        <code>--no-readme</code> to skip the README when adopting a template
        into an existing project.
      </p>
    </DocPage>
  )
}
