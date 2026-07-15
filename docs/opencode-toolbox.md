# OpenCode toolbox (build & ops)

**Note:** This project is not built by the OpenCode team and is not affiliated with OpenCode / anomalyco in any way.

## Host install

Debian/Ubuntu:

```bash
sudo apt install podman toolbox
```

Fedora:

```bash
sudo dnf install podman toolbox
```

## Published image (preferred)

```bash
toolbox create --image ghcr.io/alyshmahell/opencode-toolbox:1.18.2 --container opencode
toolbox enter opencode
```

Image tags track the bundled OpenCode version (`1.18.2`) plus `latest`.

## Build from source

```bash
podman compose -f toolboxes/compose.yaml build opencode
toolbox create --image localhost/opencode --container opencode
toolbox enter opencode
```

Override OpenCode version for a one-off build:

```bash
podman compose -f toolboxes/compose.yaml build --build-arg OPENCODE_VERSION=v1.18.2 opencode
```

Or set `OPENCODE_VERSION` under `args` in [`toolboxes/compose.yaml`](../toolboxes/compose.yaml), then rebuild.

### Recreate after rebuild

```bash
podman compose -f toolboxes/compose.yaml build opencode
toolbox rm --force opencode
toolbox create --image localhost/opencode --container opencode
# or from GHCR after push:
# toolbox create --image ghcr.io/alyshmahell/opencode-toolbox:1.18.2 --container opencode
```

## First-time setup

Inside the toolbox TUI, run `/connect` to configure provider API keys. Config persists on the host under `~/.config/opencode`.

## Configuration

| Location | Purpose |
|---|---|
| `~/.config/opencode` | Global OpenCode config and credentials (host) |
| `opencode.json` in project root | Project-specific settings |
| `/run/host` | Host filesystem inside the toolbox |

## Host OpenCode on PATH

If Volta/npm OpenCode is on your host `PATH`, bare `opencode` under `toolbox run` (non-login) may resolve to the host binary. Use:

```bash
/usr/local/bin/opencode --version
```

Interactive `toolbox enter` loads [`profile.d-opencode-toolbox`](../toolboxes/opencode/profile.d-opencode-toolbox), which prefers the toolbox binary.

## Session wrapper

[`opencode-session`](../toolboxes/opencode/opencode-session) starts OpenCode in the foreground and kills it if `~/.cache/opencode-toolbox/heartbeat` goes stale (used by the IDE extension).

## Terminal recommendation

OpenCode's TUI works best in modern terminal emulators (Kitty, Alacritty, WezTerm, Ghostty).
