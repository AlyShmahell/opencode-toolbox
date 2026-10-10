# opencode-toolbox

a container toolbox for opencode with a compatible vscode extension.

> [!CAUTION]
> This project is not built by the OpenCode team and is not affiliated with OpenCode / anomalyco in any way.



## Prerequisites
- Any x86 Linux that supports the other two requirements (modern Fedora has builtin support)
- [Podman](https://podman.io/)
- [Toolbox](https://containertoolbx.org/)

## opencode-toolbox

```bash
toolbox create --image ghcr.io/alyshmahell/opencode-toolbox:latest --container opencode
toolbox enter opencode
```

## opencode-toolbox-vscode-extension

1. Download the VSIX from the [latest release](https://github.com/AlyShmahell/toolboxai/releases/latest)
2. in **vscode**: Extensions → `…` → **Install from VSIX…**
    - in **vscodium**: Command Palette → **Extensions: Install from VSIX…** (or drag the `.vsix` onto the Extensions view).
3. in both **vscode** and **vscodium**: Command Palette → **OpenCode Toolbox: Open**