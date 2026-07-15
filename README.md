# localai-toolbox

Podman Toolbox images for local AI development tools.

## Prerequisites

- [Podman](https://podman.io/) with Compose support (`podman compose`)
- [Toolbx](https://containertoolbx.org/) (`toolbox` command)

Install on Debian/Ubuntu:

```bash
sudo apt install podman toolbox
```

Install on Fedora:

```bash
sudo dnf install podman toolbox
```

## OpenCode toolbox

**Note:** This project is not built by the OpenCode team and is not affiliated with OpenCode / anomalyco in any way.

A minimal Toolbx image based on **Debian bookworm-slim**, built multi-stage so only the OpenCode binary is copied into the runtime. Packages are limited to Toolbx requirements plus CA certificates — no git, Mesa, or other convenience tooling.

Use cloud AI providers via `/connect`. Config persists on the host under `~/.config/opencode`. Expected image size is roughly **250–350 MB**.

### Quick start

```bash
# Build
podman compose -f toolboxes/compose.yaml build

# Create + enter
toolbox create --image localhost/opencode --container opencode
toolbox enter opencode
opencode
```

To build only the OpenCode image:

```bash
podman compose -f toolboxes/compose.yaml build opencode
```

### First-time setup

Inside the toolbox, run `/connect` in the OpenCode TUI to configure your AI provider API keys.

### Configuration

| Location | Purpose |
|---|---|
| `~/.config/opencode` | Global OpenCode config and credentials (persists on host) |
| `opencode.json` in project root | Project-specific settings |
| `/run/host` | Host filesystem inside the toolbox |

If you also have OpenCode installed on the host (for example via Volta or npm), the toolbox image prefers its own copy in interactive shells. For scripts, use `/usr/local/bin/opencode` explicitly.

### Updating OpenCode

1. Set `OPENCODE_VERSION` under `args` in [`toolboxes/compose.yaml`](toolboxes/compose.yaml).
2. Rebuild and recreate the container:

```bash
podman compose -f toolboxes/compose.yaml build opencode
toolbox rm --force opencode
toolbox create --image localhost/opencode --container opencode
```

Override the version for a one-off rebuild:

```bash
podman compose -f toolboxes/compose.yaml build --build-arg OPENCODE_VERSION=v1.18.2 opencode
```

### Terminal recommendation

OpenCode's TUI works best in modern terminal emulators (Kitty, Alacritty, WezTerm, Ghostty).

### VS Code / Cursor extension

A small extension launches OpenCode **inside the toolbox** from the Command Palette / keybindings.

Install from VSIX:

1. Extensions → `…` → **Install from VSIX…**
2. Choose [`extensions/opencode/opencode-toolbox-0.0.1.vsix`](extensions/opencode/opencode-toolbox-0.0.1.vsix)

Details and rebuild steps: [`extensions/opencode/README.md`](extensions/opencode/README.md).
