# localai-toolbox

Podman Toolbox images and IDE extensions for local AI tools.

**Note:** This project is not built by the OpenCode team and is not affiliated with OpenCode / anomalyco in any way.

## Prerequisites

- [Podman](https://podman.io/)
- [Toolbx](https://containertoolbx.org/) (`toolbox`)

Host install notes: [docs/opencode-toolbox.md](docs/opencode-toolbox.md).

## OpenCode toolbox (GHCR)

```bash
toolbox create --image ghcr.io/alyshmahell/opencode-toolbox:1.18.2 --container opencode
toolbox enter opencode
```

Prefer `/usr/local/bin/opencode` if a host install (e.g. Volta) shadows `opencode` on `PATH`.

Package: [ghcr.io/alyshmahell/opencode-toolbox](https://github.com/users/AlyShmahell/packages/container/package/opencode-toolbox)

Building from source, updating OpenCode, and more: [docs/opencode-toolbox.md](docs/opencode-toolbox.md).

## VS Code / Cursor extension

1. Download the VSIX from the [latest release](https://github.com/AlyShmahell/localai-toolbox/releases/latest)
2. Extensions → `…` → **Install from VSIX…**
3. Open Command Palette → **OpenCode Toolbox: Open**

Direct asset (v0.1.0):

https://github.com/AlyShmahell/localai-toolbox/releases/download/v0.1.0/opencode-toolbox-extension-0.1.0.vsix

In Cursor: Command Palette → **Extensions: Install from VSIX…** (or drag the `.vsix` onto the Extensions view).

Extension details and local development: [extensions/opencode/README.md](extensions/opencode/README.md) and [docs/extension-development.md](docs/extension-development.md).
