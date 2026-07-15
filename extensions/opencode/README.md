# OpenCode Toolbox extension

**Note:** This project is not built by the OpenCode team and is not affiliated with OpenCode / anomalyco in any way.

Minimal VS Code / Cursor extension that launches [OpenCode](https://opencode.ai/) inside the localai-toolbox Podman Toolbx container.

## Prerequisites

1. Build and create the toolbox (from the repo root):

```bash
podman compose -f toolboxes/compose.yaml build opencode
toolbox create --image localhost/opencode --container opencode
```

2. `toolbox` available on the host `PATH`.

## Install

**From VSIX** (no build required):

1. Cursor / VS Code → Extensions → `…` → **Install from VSIX…**
2. Select `extensions/opencode/opencode-toolbox-0.0.1.vsix`

**Rebuild the VSIX** after changing source:

```bash
cd extensions/opencode
npm install
npm run package
```

## Commands (Command Palette)

| Command | Default keybinding |
|---|---|
| OpenCode Toolbox: Open | `Ctrl+Esc` / `Cmd+Esc` |
| OpenCode Toolbox: Open in New Terminal | `Ctrl+Shift+Esc` / `Cmd+Shift+Esc` |
| OpenCode Toolbox: Insert File Reference | `Ctrl+Alt+K` / `Cmd+Alt+K` |

If the official `sst-dev.opencode` extension is also installed, unbind its conflicting keys or disable it.

## Settings

| Setting | Default | Description |
|---|---|---|
| `localaiOpencode.container` | `opencode` | Toolbx container name |
| `localaiOpencode.binary` | `/usr/local/bin/opencode` | OpenCode path inside the toolbox |

## How it works

The extension opens an IDE terminal and runs:

```bash
toolbox run --container opencode -- env OPENCODE_BINARY=/usr/local/bin/opencode \
  /usr/local/bin/opencode-session --port <port>
```

`opencode-session` starts OpenCode and watches `~/.cache/opencode-toolbox/heartbeat`. While a session terminal is open, the extension refreshes that file every 2s. If the heartbeat is missing past a short grace period or older than **10s**, the container-side wrapper kills OpenCode — so closing the IDE (when `deactivate` may not run) still tears the session down.

It uses the same local HTTP prompt API as the official OpenCode extension (`/tui/append-prompt`) for `@file` references.

Only one OpenCode Toolbox terminal is kept. Closing that terminal (or deactivating the extension) also kills OpenCode immediately when the host can still run `toolbox`.

### Keyboard

The extension sets a default so **Ctrl+P** reaches the focused integrated terminal (OpenCode’s command palette) instead of VS Code Quick Open. This applies whenever any terminal has focus. To restore IDE Quick Open while a terminal is focused, remove `-workbench.action.quickOpen` from `terminal.integrated.commandsToSkipShell` in your settings.

## Resource usage

Each OpenCode process uses roughly **0.5–0.7 GB** RSS. Prefer **Open** (reuse the existing session) over spawning many sessions.

If something is left running outside the extension lifecycle:

```bash
toolbox run --container opencode -- pkill -x opencode || true
```
