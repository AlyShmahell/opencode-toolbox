# opencode-toolbox

**Note:** This project is not built by the OpenCode team and is not affiliated with OpenCode / anomalyco in any way.

## Use

### Prerequisite Installation on Host (Ubuntu/Debian)

```bash
sudo apt install podman podman-compose podman-toolbox
```

### Create and enter (GHCR)

```bash
toolbox create --image ghcr.io/alyshmahell/opencode-toolbox:1.18.2 --container opencode
toolbox enter opencode
```


### First-time setup

Inside the toolbox TUI, run `/connect` to configure provider API keys. Config persists on the host under `~/.config/opencode`.

### Configuration

| Location | Purpose |
|---|---|
| `~/.config/opencode` | Global OpenCode config and credentials (host) |
| `opencode.json` in project root | Project-specific settings |
| `/run/host` | Host filesystem inside the toolbox |

### How it works (reference)

These run automatically — nothing extra to configure for normal use.

- #### PATH preference

Interactive `toolbox enter` loads [`profile.d-opencode-toolbox`](../toolboxes/opencode/profile.d-opencode-toolbox), which prefers the toolbox OpenCode binary over a host install on `PATH`.

- #### Session wrapper

When started via the IDE extension, [`opencode-session`](../toolboxes/opencode/opencode-session) runs OpenCode in the foreground and stops it if `~/.cache/opencode-toolbox/heartbeat` goes stale. The extension refreshes that heartbeat while the session terminal is open.


## Build

### Build from source

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
