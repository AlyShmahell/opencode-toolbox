# toolboxai

Podman Toolbox images and IDE extensions for local AI tools.



### Prerequisites

- [Podman](https://podman.io/)
- [Toolbx](https://containertoolbx.org/) (`toolbox`)

## Toolboxes

### opencode-toolbox

> [!CAUTION]
> This project is not built by the OpenCode team and is not affiliated with OpenCode / anomalyco in any way.

```bash
toolbox create --image ghcr.io/alyshmahell/opencode-toolbox:1.18.2 --container opencode
toolbox enter opencode
```

Prefer `/usr/local/bin/opencode` if a host install (e.g. Volta) shadows `opencode` on `PATH`.

Package: [ghcr.io/alyshmahell/opencode-toolbox](https://github.com/users/AlyShmahell/packages/container/package/opencode-toolbox)

Ops and build details: [docs/opencode-toolbox.md](docs/opencode-toolbox.md).

## Extensions

### opencode-toolbox-extension

> [!CAUTION]
> This project is not built by the OpenCode team and is not affiliated with OpenCode / anomalyco in any way.

1. Download the VSIX from the [latest release](https://github.com/AlyShmahell/toolboxai/releases/latest)
2. Extensions → `…` → **Install from VSIX…**
3. Open Command Palette → **OpenCode Toolbox: Open**

Direct asset (v0.1.1):

https://github.com/AlyShmahell/toolboxai/releases/download/v0.1.1/opencode-toolbox-extension-0.1.1.vsix

In VSCodium: Command Palette → **Extensions: Install from VSIX…** (or drag the `.vsix` onto the Extensions view).

Details and local packaging: [extensions/opencode/README.md](extensions/opencode/README.md) and [docs/extension-development.md](docs/extension-development.md).
