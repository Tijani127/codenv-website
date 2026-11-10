// GENERATED FILE - do not edit by hand.
// Regenerate with: bun run scripts/gen-cli-reference.ts
// Source of truth: `codenv --help` output of the installed binary.
export type CliFlag = { names: string; usage: string }
export type CliSub = { name: string; short: string }
export type CliCommand = {
  name: string
  usage: string[]
  long: string
  flags: CliFlag[]
  globalFlags: CliFlag[]
  subs: CliSub[]
}
export const cliCommands: Record<string, unknown> = {
  "add": {
    "name": "codenv add",
    "usage": [
      "  codenv add <pkg>... [flags]"
    ],
    "long": "Add one or more Scoop packages to codenv.json and install them.\n\nPackage references accept an optional bucket and version:\n  ripgrep                 latest ripgrep from any bucket\n  ripgrep@14.1.0          a specific version\n  extras/vcredist2022     a package from a specific bucket",
    "flags": [
      {
        "names": "-h, --help",
        "usage": "help for add"
      },
      {
        "names": "--no-install",
        "usage": ""
      },
      {
        "names": "--sync",
        "usage": "refresh bucket manifests before resolving (default true)"
      }
    ],
    "globalFlags": [
      {
        "names": "-c, --config string",
        "usage": "path to a directory containing codenv.json"
      },
      {
        "names": "-q, --quiet",
        "usage": "suppress logs"
      }
    ],
    "subs": []
  },
  "cache": {
    "name": "codenv cache",
    "usage": [
      "  codenv cache [command]"
    ],
    "long": "Inspect and clean the codenv download cache",
    "flags": [
      {
        "names": "-h, --help",
        "usage": "help for cache"
      }
    ],
    "globalFlags": [
      {
        "names": "Use \"codenv cache [command] --help\" for more information about a command.",
        "usage": ""
      }
    ],
    "subs": [
      {
        "name": "clean",
        "short": "Delete cached downloads"
      },
      {
        "name": "info",
        "short": "Show cache and store statistics"
      }
    ]
  },
  "create": {
    "name": "codenv create",
    "usage": [
      "  codenv create <template|repo> [dir] [flags]",
      "  codenv create [command]"
    ],
    "long": "Create a new directory containing codenv.json, a README and a .gitignore.\n\nTEMPLATE can be a builtin template, the name of a template in \n~/.codenv/templates, or set CODEENV_TEMPLATES, or a git repository:\n  github:owner/repo    clone https://github.com/owner/repo\n  owner/repo           clone https://github.com/owner/repo\n  https://... / git@...  clone the URL as-is\n\nBuiltin templates:\n  go        Go module with test, vet and build scripts\n  python    Python project with a virtualenv-friendly layout\n  node      Node.js project pinned to an LTS runtime\n  rust      Cargo project with fmt, clippy and test scripts\n  minimal   Just codenv.json, with example scripts\n\nEvery file is copied to the output directory, with the substitutions\n{{PROJECT}}, {{TITLE}} and {{MODULE}} expanded.",
    "flags": [
      {
        "names": "--force",
        "usage": "overwrite existing files"
      },
      {
        "names": "-h, --help",
        "usage": "help for create"
      },
      {
        "names": "--no-readme",
        "usage": ""
      },
      {
        "names": "--ref string",
        "usage": "branch or tag to clone when TEMPLATE is a git repository"
      }
    ],
    "globalFlags": [
      {
        "names": "Use \"codenv create [command] --help\" for more information about a command.",
        "usage": ""
      }
    ],
    "subs": [
      {
        "name": "templates",
        "short": "List the available project templates"
      }
    ]
  },
  "doctor": {
    "name": "codenv doctor",
    "usage": [
      "  codenv doctor [flags]"
    ],
    "long": "Check that codenv can actually do its job on this machine.\n\nLooks for the things that commonly go wrong: a missing or unwritable store, dirty\nbucket manifests left behind by autoupdate, a leftover shims directory, stale index\nentries, pinned versions that are not installed, and unset secret sources.",
    "flags": [
      {
        "names": "--fix",
        "usage": "repair what codenv can repair safely"
      },
      {
        "names": "-h, --help",
        "usage": "help for doctor"
      },
      {
        "names": "--json",
        "usage": "emit JSON"
      },
      {
        "names": "--no-hints",
        "usage": ""
      }
    ],
    "globalFlags": [
      {
        "names": "-c, --config string",
        "usage": "path to a directory containing codenv.json"
      },
      {
        "names": "-q, --quiet",
        "usage": "suppress logs"
      }
    ],
    "subs": []
  },
  "gc": {
    "name": "codenv gc",
    "usage": [
      "  codenv gc [--dry-run] [--force] [flags]"
    ],
    "long": "Delete store versions that no registered project's codenv.lock.json pins,\nand prune index entries for versions that no longer exist on disk.\n\nThe store's own Scoop installation, every version a project still pins,\nand every version the current junction points at are always spared. codenv\nregisters projects automatically; a project pinned before this feature\narrived is invisible to gc until it runs any codenv command again — or\npass --force to sweep without its references.",
    "flags": [
      {
        "names": "--dry-run",
        "usage": ""
      },
      {
        "names": "--force",
        "usage": "proceed even when a registered project's lockfile cannot be read"
      },
      {
        "names": "-h, --help",
        "usage": "help for gc"
      }
    ],
    "globalFlags": [
      {
        "names": "-c, --config string",
        "usage": "path to a directory containing codenv.json"
      },
      {
        "names": "-q, --quiet",
        "usage": "suppress logs"
      }
    ],
    "subs": []
  },
  "generate": {
    "__root__": {
      "name": "codenv generate",
      "usage": [
        "  codenv generate [command]"
      ],
      "long": "Generate supporting files for this project",
      "flags": [
        {
          "names": "-h, --help",
          "usage": "help for generate"
        }
      ],
      "globalFlags": [
        {
          "names": "Use \"codenv generate [command] --help\" for more information about a command.",
          "usage": ""
        }
      ],
      "subs": [
        {
          "name": "ci",
          "short": "Generate a GitHub Actions workflow that runs this project on windows-latest"
        },
        {
          "name": "devcontainer",
          "short": "Generate .devcontainer files for this project"
        },
        {
          "name": "direnv",
          "short": "Generate a .envrc that loads this environment automatically"
        },
        {
          "name": "dockerfile",
          "short": "Generate a Windows container Dockerfile that mirrors codenv.json"
        },
        {
          "name": "readme",
          "short": "Generate a README documenting this environment"
        }
      ]
    },
    "ci": {
      "name": "codenv generate ci",
      "usage": [
        "  codenv generate ci [flags]"
      ],
      "long": "Generate .github/workflows/codenv.yml: a workflow that installs codenv from its\nreleases, prepares this project's environment with Scoop buckets and store\ncaches, and runs your command inside it.\n\nExample:\n  codenv generate ci --command run test",
      "flags": [
        {
          "names": "--codenv-ref string",
          "usage": ""
        },
        {
          "names": "--command string",
          "usage": "command list to run inside the environment (quoted) (default \"run test\")"
        },
        {
          "names": "-h, --help",
          "usage": "help for ci"
        }
      ],
      "globalFlags": [
        {
          "names": "-c, --config string",
          "usage": "path to a directory containing codenv.json"
        },
        {
          "names": "-q, --quiet",
          "usage": "suppress logs"
        }
      ],
      "subs": []
    },
    "direnv": {
      "name": "codenv generate direnv",
      "usage": [
        "  codenv generate direnv [flags]"
      ],
      "long": "Generate an .envrc file for direnv. Entering the directory with direnv installed\nwill then apply codenv's PATH automatically.",
      "flags": [
        {
          "names": "--force",
          "usage": "overwrite existing files"
        },
        {
          "names": "-h, --help",
          "usage": "help for direnv"
        }
      ],
      "globalFlags": [
        {
          "names": "-c, --config string",
          "usage": "path to a directory containing codenv.json"
        },
        {
          "names": "-q, --quiet",
          "usage": "suppress logs"
        }
      ],
      "subs": []
    },
    "dockerfile": {
      "name": "codenv generate dockerfile",
      "usage": [
        "  codenv generate dockerfile [flags]"
      ],
      "long": "Generate a Dockerfile for a Windows container that installs codenv and the\npackages from codenv.json.\n\nA Linux container cannot help here: Scoop is Windows-only, so codenv environments\ncannot be reproduced in a Linux image.",
      "flags": [
        {
          "names": "--codenv-src string",
          "usage": ""
        },
        {
          "names": "--force",
          "usage": "overwrite existing files"
        },
        {
          "names": "-h, --help",
          "usage": "help for dockerfile"
        },
        {
          "names": "--image string",
          "usage": "container image to use"
        },
        {
          "names": "--windows-version string",
          "usage": ""
        }
      ],
      "globalFlags": [
        {
          "names": "-c, --config string",
          "usage": "path to a directory containing codenv.json"
        },
        {
          "names": "-q, --quiet",
          "usage": "suppress logs"
        }
      ],
      "subs": []
    },
    "readme": {
      "name": "codenv generate readme",
      "usage": [
        "  codenv generate readme <name> [flags]"
      ],
      "long": "Generate a README documenting this environment",
      "flags": [
        {
          "names": "--force",
          "usage": "overwrite existing files"
        },
        {
          "names": "-h, --help",
          "usage": "help for readme"
        }
      ],
      "globalFlags": [
        {
          "names": "-c, --config string",
          "usage": "path to a directory containing codenv.json"
        },
        {
          "names": "-q, --quiet",
          "usage": "suppress logs"
        }
      ],
      "subs": []
    }
  },
  "global": {
    "__root__": {
      "name": "codenv global",
      "usage": [
        "  codenv global [command]"
      ],
      "long": "Manage a set of packages installed once and made available to every codenv shell,\nwhether or not a project declares them.\n\nGlobal packages live in their own store so they never collide with a project's pins.",
      "flags": [
        {
          "names": "-h, --help",
          "usage": "help for global"
        }
      ],
      "globalFlags": [
        {
          "names": "Use \"codenv global [command] --help\" for more information about a command.",
          "usage": ""
        }
      ],
      "subs": [
        {
          "name": "add",
          "short": "Add a package to the global configuration"
        },
        {
          "name": "install",
          "short": "Install every package in the global configuration"
        },
        {
          "name": "list",
          "short": "List globally installed packages"
        },
        {
          "name": "path",
          "short": "Print the location of the global configuration and store"
        },
        {
          "name": "pull",
          "short": "Load a global configuration from a file or URL"
        },
        {
          "name": "push",
          "short": "Print the global configuration"
        },
        {
          "name": "rm",
          "short": "Remove a package from the global configuration"
        },
        {
          "name": "run",
          "short": "Run a command in the global environment"
        },
        {
          "name": "shellenv",
          "short": "Print shell commands that add global packages to PATH"
        },
        {
          "name": "update",
          "short": "Update global packages to their latest versions"
        }
      ]
    },
    "add": {
      "name": "codenv global add",
      "usage": [
        "  codenv global add <pkg>... [flags]"
      ],
      "long": "Add a package to the global configuration",
      "flags": [
        {
          "names": "-h, --help",
          "usage": "help for add"
        }
      ],
      "globalFlags": [
        {
          "names": "-c, --config string",
          "usage": "path to a directory containing codenv.json"
        },
        {
          "names": "-q, --quiet",
          "usage": "suppress logs"
        }
      ],
      "subs": []
    },
    "install": {
      "name": "codenv global install",
      "usage": [
        "  codenv global install [flags]"
      ],
      "long": "Install every package in the global configuration",
      "flags": [
        {
          "names": "-h, --help",
          "usage": "help for install"
        }
      ],
      "globalFlags": [
        {
          "names": "-c, --config string",
          "usage": "path to a directory containing codenv.json"
        },
        {
          "names": "-q, --quiet",
          "usage": "suppress logs"
        }
      ],
      "subs": []
    },
    "list": {
      "name": "codenv global list",
      "usage": [
        "  codenv global list [flags]"
      ],
      "long": "List globally installed packages",
      "flags": [
        {
          "names": "-h, --help",
          "usage": "help for list"
        }
      ],
      "globalFlags": [
        {
          "names": "-c, --config string",
          "usage": "path to a directory containing codenv.json"
        },
        {
          "names": "-q, --quiet",
          "usage": "suppress logs"
        }
      ],
      "subs": []
    },
    "path": {
      "name": "codenv global path",
      "usage": [
        "  codenv global path [flags]"
      ],
      "long": "Print the location of the global configuration and store",
      "flags": [
        {
          "names": "-h, --help",
          "usage": "help for path"
        }
      ],
      "globalFlags": [
        {
          "names": "-c, --config string",
          "usage": "path to a directory containing codenv.json"
        },
        {
          "names": "-q, --quiet",
          "usage": "suppress logs"
        }
      ],
      "subs": []
    },
    "pull": {
      "name": "codenv global pull",
      "usage": [
        "  codenv global pull <file-or-url> [flags]"
      ],
      "long": "Load a global configuration from a file or URL",
      "flags": [
        {
          "names": "-h, --help",
          "usage": "help for pull"
        }
      ],
      "globalFlags": [
        {
          "names": "-c, --config string",
          "usage": "path to a directory containing codenv.json"
        },
        {
          "names": "-q, --quiet",
          "usage": "suppress logs"
        }
      ],
      "subs": []
    },
    "push": {
      "name": "codenv global push",
      "usage": [
        "  codenv global push [flags]"
      ],
      "long": "Print the global configuration",
      "flags": [
        {
          "names": "-h, --help",
          "usage": "help for push"
        }
      ],
      "globalFlags": [
        {
          "names": "-c, --config string",
          "usage": "path to a directory containing codenv.json"
        },
        {
          "names": "-q, --quiet",
          "usage": "suppress logs"
        }
      ],
      "subs": []
    },
    "rm": {
      "name": "codenv global rm",
      "usage": [
        "  codenv global rm <pkg>... [flags]"
      ],
      "long": "Remove a package from the global configuration",
      "flags": [
        {
          "names": "-h, --help",
          "usage": "help for rm"
        }
      ],
      "globalFlags": [
        {
          "names": "-c, --config string",
          "usage": "path to a directory containing codenv.json"
        },
        {
          "names": "-q, --quiet",
          "usage": "suppress logs"
        }
      ],
      "subs": []
    },
    "run": {
      "name": "codenv global run",
      "usage": [
        "  codenv global run <script|command> [args...] [flags]"
      ],
      "long": "Run a command in the global environment",
      "flags": [
        {
          "names": "-e, --env stringArray",
          "usage": "environment variable to set (KEY=VALUE)"
        },
        {
          "names": "--env-file string",
          "usage": ""
        },
        {
          "names": "--format string",
          "usage": "shell format for printed env (powershell, bash, cmd) (default \"auto\")"
        },
        {
          "names": "-h, --help",
          "usage": "help for run"
        },
        {
          "names": "--no-banner",
          "usage": ""
        },
        {
          "names": "--no-install",
          "usage": ""
        },
        {
          "names": "--pure",
          "usage": "inherit almost nothing from the current environment"
        }
      ],
      "globalFlags": [
        {
          "names": "-c, --config string",
          "usage": "path to a directory containing codenv.json"
        },
        {
          "names": "-q, --quiet",
          "usage": "suppress logs"
        }
      ],
      "subs": []
    },
    "shellenv": {
      "name": "codenv global shellenv",
      "usage": [
        "  codenv global shellenv [flags]"
      ],
      "long": "Print shell commands that add global packages to PATH",
      "flags": [
        {
          "names": "--format string",
          "usage": "shell format to print (powershell, bash, zsh, fish, cmd) (default \"auto\")"
        },
        {
          "names": "-h, --help",
          "usage": "help for shellenv"
        }
      ],
      "globalFlags": [
        {
          "names": "-c, --config string",
          "usage": "path to a directory containing codenv.json"
        },
        {
          "names": "-q, --quiet",
          "usage": "suppress logs"
        }
      ],
      "subs": []
    },
    "update": {
      "name": "codenv global update",
      "usage": [
        "  codenv global update [flags]"
      ],
      "long": "Update global packages to their latest versions",
      "flags": [
        {
          "names": "-h, --help",
          "usage": "help for update"
        }
      ],
      "globalFlags": [
        {
          "names": "-c, --config string",
          "usage": "path to a directory containing codenv.json"
        },
        {
          "names": "-q, --quiet",
          "usage": "suppress logs"
        }
      ],
      "subs": []
    }
  },
  "import": {
    "name": "codenv import",
    "usage": [
      "  codenv import [command]"
    ],
    "long": "Import an environment defined by another tool",
    "flags": [
      {
        "names": "-h, --help",
        "usage": "help for import"
      }
    ],
    "globalFlags": [
      {
        "names": "Use \"codenv import [command] --help\" for more information about a command.",
        "usage": ""
      }
    ],
    "subs": [
      {
        "name": "devbox",
        "short": "Convert a devbox.json into codenv.json"
      }
    ]
  },
  "info": {
    "name": "codenv info",
    "usage": [
      "  codenv info <pkg>... [flags]"
    ],
    "long": "Show details about packages, including dependencies and binaries",
    "flags": [
      {
        "names": "-h, --help",
        "usage": "help for info"
      },
      {
        "names": "--json",
        "usage": "emit JSON lines"
      }
    ],
    "globalFlags": [
      {
        "names": "-c, --config string",
        "usage": "path to a directory containing codenv.json"
      },
      {
        "names": "-q, --quiet",
        "usage": "suppress logs"
      }
    ],
    "subs": []
  },
  "init": {
    "name": "codenv init",
    "usage": [
      "  codenv init [dir] [flags]"
    ],
    "long": "Initialize a directory as a codenv project",
    "flags": [
      {
        "names": "-h, --help",
        "usage": "help for init"
      }
    ],
    "globalFlags": [
      {
        "names": "-c, --config string",
        "usage": "path to a directory containing codenv.json"
      },
      {
        "names": "-q, --quiet",
        "usage": "suppress logs"
      }
    ],
    "subs": []
  },
  "install": {
    "name": "codenv install",
    "usage": [
      "  codenv install [flags]"
    ],
    "long": "Install the packages defined in codenv.json",
    "flags": [
      {
        "names": "--global",
        "usage": "install the global configuration instead"
      },
      {
        "names": "-h, --help",
        "usage": "help for install"
      },
      {
        "names": "--no-sync",
        "usage": ""
      }
    ],
    "globalFlags": [
      {
        "names": "-c, --config string",
        "usage": "path to a directory containing codenv.json"
      },
      {
        "names": "-q, --quiet",
        "usage": "suppress logs"
      }
    ],
    "subs": []
  },
  "list": {
    "name": "codenv list",
    "usage": [
      "  codenv list [flags]"
    ],
    "long": "List the packages available in this environment",
    "flags": [
      {
        "names": "--global",
        "usage": "list the global configuration"
      },
      {
        "names": "-h, --help",
        "usage": "help for list"
      }
    ],
    "globalFlags": [
      {
        "names": "-c, --config string",
        "usage": "path to a directory containing codenv.json"
      },
      {
        "names": "-q, --quiet",
        "usage": "suppress logs"
      }
    ],
    "subs": []
  },
  "rm": {
    "name": "codenv rm",
    "usage": [
      "  codenv rm <pkg>... [flags]"
    ],
    "long": "Remove packages from this codenv project",
    "flags": [
      {
        "names": "-h, --help",
        "usage": "help for rm"
      },
      {
        "names": "--purge",
        "usage": "also remove packages from the store"
      }
    ],
    "globalFlags": [
      {
        "names": "-c, --config string",
        "usage": "path to a directory containing codenv.json"
      },
      {
        "names": "-q, --quiet",
        "usage": "suppress logs"
      }
    ],
    "subs": []
  },
  "run": {
    "name": "codenv run",
    "usage": [
      "  codenv run <script|command> [args...] [flags]"
    ],
    "long": "Run a script defined in codenv.json, or an arbitrary command, inside a codenv\nenvironment. The environment exits when the command finishes.",
    "flags": [
      {
        "names": "-e, --env stringArray",
        "usage": "environment variable to set (KEY=VALUE)"
      },
      {
        "names": "--env-file string",
        "usage": ""
      },
      {
        "names": "--format string",
        "usage": "shell format for printed env (powershell, bash, cmd) (default \"auto\")"
      },
      {
        "names": "-h, --help",
        "usage": "help for run"
      },
      {
        "names": "--no-banner",
        "usage": ""
      },
      {
        "names": "--no-install",
        "usage": ""
      },
      {
        "names": "--no-prompt",
        "usage": ""
      },
      {
        "names": "--pure",
        "usage": "inherit almost nothing from the current environment"
      }
    ],
    "globalFlags": [
      {
        "names": "-c, --config string",
        "usage": "path to a directory containing codenv.json"
      },
      {
        "names": "-q, --quiet",
        "usage": "suppress logs"
      }
    ],
    "subs": []
  },
  "search": {
    "name": "codenv search",
    "usage": [
      "  codenv search <query> [flags]"
    ],
    "long": "Search the configured Scoop buckets",
    "flags": [
      {
        "names": "-h, --help",
        "usage": "help for search"
      },
      {
        "names": "--json",
        "usage": "emit JSON lines"
      },
      {
        "names": "--limit int",
        "usage": "maximum results (0 for all) (default 50)"
      },
      {
        "names": "--sync",
        "usage": "git-pull buckets before searching"
      }
    ],
    "globalFlags": [
      {
        "names": "-c, --config string",
        "usage": "path to a directory containing codenv.json"
      },
      {
        "names": "-q, --quiet",
        "usage": "suppress logs"
      }
    ],
    "subs": []
  },
  "secrets": {
    "__root__": {
      "name": "codenv secrets",
      "usage": [
        "  codenv secrets [command]"
      ],
      "long": "Manage the secret *declaration* in codenv.json.\n\nBy default codenv never stores secret values: you declare which variables a\nproject needs, and codenv picks their values up from your environment when\na shell or script starts.\n\nWith 'codenv secrets set <NAME>' a value can be stored in the Windows\nCredential Manager (never on codenv's own disk) as a fallback for names\nyour environment does not provide.",
      "flags": [
        {
          "names": "-h, --help",
          "usage": "help for secrets"
        }
      ],
      "globalFlags": [
        {
          "names": "Use \"codenv secrets [command] --help\" for more information about a command.",
          "usage": ""
        }
      ],
      "subs": [
        {
          "name": "add",
          "short": "Declare a variable as a required secret"
        },
        {
          "name": "download",
          "short": "Write resolved secrets to a file or stdout"
        },
        {
          "name": "from",
          "short": "Map a secret to one or more environment variables"
        },
        {
          "name": "list",
          "short": "List declared secrets and whether their values are present"
        },
        {
          "name": "rm",
          "short": "Stop treating variables as secrets (optionally delete stored values)"
        },
        {
          "name": "set",
          "short": "Store a secret value in the Windows Credential Manager"
        }
      ]
    },
    "add": {
      "name": "codenv secrets add",
      "usage": [
        "  codenv secrets add <NAME> [flags]"
      ],
      "long": "Declare a variable as a required secret",
      "flags": [
        {
          "names": "-h, --help",
          "usage": "help for add"
        }
      ],
      "globalFlags": [
        {
          "names": "-c, --config string",
          "usage": "path to a directory containing codenv.json"
        },
        {
          "names": "-q, --quiet",
          "usage": "suppress logs"
        }
      ],
      "subs": []
    },
    "download": {
      "name": "codenv secrets download",
      "usage": [
        "  codenv secrets download [flags]"
      ],
      "long": "Write the values of your declared secrets to a .env file or to stdout.\n\nThe output is redacted by default; pass --values to include real values.",
      "flags": [
        {
          "names": "--format string",
          "usage": "output format (env, json) (default \"env\")"
        },
        {
          "names": "-h, --help",
          "usage": "help for download"
        },
        {
          "names": "--values",
          "usage": "include real values instead of redacting"
        }
      ],
      "globalFlags": [
        {
          "names": "-c, --config string",
          "usage": "path to a directory containing codenv.json"
        },
        {
          "names": "-q, --quiet",
          "usage": "suppress logs"
        }
      ],
      "subs": []
    },
    "from": {
      "name": "codenv secrets from",
      "usage": [
        "  codenv secrets from <NAME> <ENV_VAR[,ENV_VAR...]> [flags]"
      ],
      "long": "Map a secret name to values taken from your environment.\n\nExample:\n  codenv secrets from DATABASE_URL DB_URL\n  codenv secrets from API_KEY API_KEY,API_KEY_FALLBACK",
      "flags": [
        {
          "names": "--allow-missing",
          "usage": ""
        },
        {
          "names": "-h, --help",
          "usage": "help for from"
        }
      ],
      "globalFlags": [
        {
          "names": "-c, --config string",
          "usage": "path to a directory containing codenv.json"
        },
        {
          "names": "-q, --quiet",
          "usage": "suppress logs"
        }
      ],
      "subs": []
    },
    "list": {
      "name": "codenv secrets list",
      "usage": [
        "  codenv secrets list [flags]"
      ],
      "long": "List declared secrets and whether their values are present",
      "flags": [
        {
          "names": "-h, --help",
          "usage": "help for list"
        }
      ],
      "globalFlags": [
        {
          "names": "-c, --config string",
          "usage": "path to a directory containing codenv.json"
        },
        {
          "names": "-q, --quiet",
          "usage": "suppress logs"
        }
      ],
      "subs": []
    },
    "rm": {
      "name": "codenv secrets rm",
      "usage": [
        "  codenv secrets rm <NAME>... [flags]"
      ],
      "long": "Remove names from the secret declaration in codenv.json.\n\nWith --stored, the values stored in the Windows Credential Manager under\ncodenv:secret:<NAME> are deleted as well.",
      "flags": [
        {
          "names": "-h, --help",
          "usage": "help for rm"
        },
        {
          "names": "--stored",
          "usage": "also delete values stored in the Windows Credential Manager"
        }
      ],
      "globalFlags": [
        {
          "names": "-c, --config string",
          "usage": "path to a directory containing codenv.json"
        },
        {
          "names": "-q, --quiet",
          "usage": "suppress logs"
        }
      ],
      "subs": []
    },
    "set": {
      "name": "codenv secrets set",
      "usage": [
        "  codenv secrets set <NAME> [VALUE] [flags]"
      ],
      "long": "Store a secret's value in the Windows Credential Manager (target\ncodenv:secret:<NAME>) and declare NAME as a required secret.\n\nThe value is never written to codenv.json or the project directory. When a\nshell or script resolves secrets, names not found in the environment fall\nback to the Credential Manager.\n\nPass the value on stdin with --stdin to keep it out of shell history:\n (Get-Content -Raw secret.txt) | codenv secrets set API_KEY --stdin",
      "flags": [
        {
          "names": "-h, --help",
          "usage": "help for set"
        },
        {
          "names": "--stdin",
          "usage": "read the value from stdin instead of an argument"
        }
      ],
      "globalFlags": [
        {
          "names": "-c, --config string",
          "usage": "path to a directory containing codenv.json"
        },
        {
          "names": "-q, --quiet",
          "usage": "suppress logs"
        }
      ],
      "subs": []
    }
  },
  "services": {
    "__root__": {
      "name": "codenv services",
      "usage": [
        "  codenv services [command]"
      ],
      "long": "Manage services declared in codenv-services.json.\n\ncodenv supervises these natively, so no extra process manager is required on Windows.\nEach service inherits the codenv environment, so packages from codenv.json are on PATH.",
      "flags": [
        {
          "names": "-h, --help",
          "usage": "help for services"
        }
      ],
      "globalFlags": [
        {
          "names": "Use \"codenv services [command] --help\" for more information about a command.",
          "usage": ""
        }
      ],
      "subs": [
        {
          "name": "clean",
          "short": "Stop every service and delete their logs"
        },
        {
          "name": "logs",
          "short": "Print service logs"
        },
        {
          "name": "ls",
          "short": "List services and their status"
        },
        {
          "name": "restart",
          "short": "Restart services"
        },
        {
          "name": "start",
          "short": "Start services in the background"
        },
        {
          "name": "stop",
          "short": "Stop running services"
        },
        {
          "name": "up",
          "short": "Start the services and stream their logs"
        }
      ]
    },
    "clean": {
      "name": "codenv services clean",
      "usage": [
        "  codenv services clean [flags]"
      ],
      "long": "Stop every service and delete their logs",
      "flags": [
        {
          "names": "-h, --help",
          "usage": "help for clean"
        }
      ],
      "globalFlags": [
        {
          "names": "-c, --config string",
          "usage": "path to a directory containing codenv.json"
        },
        {
          "names": "-q, --quiet",
          "usage": "suppress logs"
        }
      ],
      "subs": []
    },
    "logs": {
      "name": "codenv services logs",
      "usage": [
        "  codenv services logs [service...] [flags]"
      ],
      "long": "Print service logs",
      "flags": [
        {
          "names": "-h, --help",
          "usage": "help for logs"
        }
      ],
      "globalFlags": [
        {
          "names": "-c, --config string",
          "usage": "path to a directory containing codenv.json"
        },
        {
          "names": "-q, --quiet",
          "usage": "suppress logs"
        }
      ],
      "subs": []
    },
    "ls": {
      "name": "codenv services ls",
      "usage": [
        "  codenv services ls [flags]"
      ],
      "long": "List services and their status",
      "flags": [
        {
          "names": "-h, --help",
          "usage": "help for ls"
        }
      ],
      "globalFlags": [
        {
          "names": "-c, --config string",
          "usage": "path to a directory containing codenv.json"
        },
        {
          "names": "-q, --quiet",
          "usage": "suppress logs"
        }
      ],
      "subs": []
    },
    "restart": {
      "name": "codenv services restart",
      "usage": [
        "  codenv services restart [service...] [flags]"
      ],
      "long": "Restart services",
      "flags": [
        {
          "names": "-h, --help",
          "usage": "help for restart"
        }
      ],
      "globalFlags": [
        {
          "names": "-c, --config string",
          "usage": "path to a directory containing codenv.json"
        },
        {
          "names": "-q, --quiet",
          "usage": "suppress logs"
        }
      ],
      "subs": []
    },
    "start": {
      "name": "codenv services start",
      "usage": [
        "  codenv services start [service...] [flags]"
      ],
      "long": "Start services in the background",
      "flags": [
        {
          "names": "-h, --help",
          "usage": "help for start"
        }
      ],
      "globalFlags": [
        {
          "names": "-c, --config string",
          "usage": "path to a directory containing codenv.json"
        },
        {
          "names": "-q, --quiet",
          "usage": "suppress logs"
        }
      ],
      "subs": []
    },
    "stop": {
      "name": "codenv services stop",
      "usage": [
        "  codenv services stop [service...] [flags]"
      ],
      "long": "Stop running services",
      "flags": [
        {
          "names": "-h, --help",
          "usage": "help for stop"
        }
      ],
      "globalFlags": [
        {
          "names": "-c, --config string",
          "usage": "path to a directory containing codenv.json"
        },
        {
          "names": "-q, --quiet",
          "usage": "suppress logs"
        }
      ],
      "subs": []
    },
    "up": {
      "name": "codenv services up",
      "usage": [
        "  codenv services up [service...] [flags]"
      ],
      "long": "Start the services and stream their logs",
      "flags": [
        {
          "names": "-b, --background",
          "usage": "start in the background and return"
        },
        {
          "names": "-h, --help",
          "usage": "help for up"
        },
        {
          "names": "--purge",
          "usage": "discard previous logs first"
        }
      ],
      "globalFlags": [
        {
          "names": "-c, --config string",
          "usage": "path to a directory containing codenv.json"
        },
        {
          "names": "-q, --quiet",
          "usage": "suppress logs"
        }
      ],
      "subs": []
    }
  },
  "shell": {
    "name": "codenv shell",
    "usage": [
      "  codenv shell [command...] [flags]"
    ],
    "long": "Start an interactive shell, or run a single command, inside the codenv environment.\n\nPackages come from a shared store and are placed on PATH directly from their install\ndirectories. Scoop shims are never created and your system PATH is never modified.",
    "flags": [
      {
        "names": "-e, --env stringArray",
        "usage": "environment variable to set (KEY=VALUE)"
      },
      {
        "names": "--env-file string",
        "usage": ""
      },
      {
        "names": "--format string",
        "usage": "shell format for printed env (powershell, bash, cmd) (default \"auto\")"
      },
      {
        "names": "-h, --help",
        "usage": "help for shell"
      },
      {
        "names": "--no-banner",
        "usage": ""
      },
      {
        "names": "--no-install",
        "usage": ""
      },
      {
        "names": "--no-prompt",
        "usage": ""
      },
      {
        "names": "--prompt",
        "usage": "mark the shell prompt while inside codenv (default true)"
      },
      {
        "names": "--pure",
        "usage": "inherit almost nothing from the current environment"
      }
    ],
    "globalFlags": [
      {
        "names": "-c, --config string",
        "usage": "path to a directory containing codenv.json"
      },
      {
        "names": "-q, --quiet",
        "usage": "suppress logs"
      }
    ],
    "subs": []
  },
  "shellenv": {
    "name": "codenv shellenv",
    "usage": [
      "  codenv shellenv [flags]"
    ],
    "long": "Print shell commands that add this project's packages to PATH",
    "flags": [
      {
        "names": "--compact",
        "usage": "print a single-line PATH export"
      },
      {
        "names": "--format string",
        "usage": "shell format to print (powershell, bash, zsh, fish, cmd) (default \"auto\")"
      },
      {
        "names": "-h, --help",
        "usage": "help for shellenv"
      }
    ],
    "globalFlags": [
      {
        "names": "-c, --config string",
        "usage": "path to a directory containing codenv.json"
      },
      {
        "names": "-q, --quiet",
        "usage": "suppress logs"
      }
    ],
    "subs": []
  },
  "update": {
    "name": "codenv update",
    "usage": [
      "  codenv update [flags]"
    ],
    "long": "Update packages to the latest available version",
    "flags": [
      {
        "names": "--all",
        "usage": "re-resolve pinned versions as well"
      },
      {
        "names": "-h, --help",
        "usage": "help for update"
      },
      {
        "names": "--no-sync",
        "usage": ""
      }
    ],
    "globalFlags": [
      {
        "names": "-c, --config string",
        "usage": "path to a directory containing codenv.json"
      },
      {
        "names": "-q, --quiet",
        "usage": "suppress logs"
      }
    ],
    "subs": []
  },
  "version": {
    "name": "codenv version",
    "usage": [
      "  codenv version [flags]",
      "  codenv version [command]"
    ],
    "long": "Print version information",
    "flags": [
      {
        "names": "-h, --help",
        "usage": "help for version"
      }
    ],
    "globalFlags": [
      {
        "names": "Use \"codenv version [command] --help\" for more information about a command.",
        "usage": ""
      }
    ],
    "subs": [
      {
        "name": "update",
        "short": "Check how to update codenv itself"
      }
    ]
  }
}

