# OpenCode Toolbox extension (development)

## Local package

```bash
cd extensions/opencode
npm install
npm run package
```

Produces `opencode-toolbox-extension-<version>.vsix` (gitignored). Install via Command Palette → **Extensions: Install from VSIX…** (or drag onto the Extensions view). Extension ID: `alyshmahell.opencode-toolbox-extension`.

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

Manual cleanup:

```bash
toolbox run --container opencode -- pkill -x opencode || true
```

If the official `sst-dev.opencode` extension is also installed, unbind conflicting keys or disable it.
