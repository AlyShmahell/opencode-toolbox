# opencode-toolbox-vscode

> [!CAUTION]
> This project is not built by the OpenCode team and is not affiliated with OpenCode / anomalyco in any way.

Launches [OpenCode](https://opencode.ai/) inside the [opencode-toolbox](../../docs/opencode-toolbox.md) Podman Toolbx container from VS Code / VSCodium.

Extension ID: `alyshmahell.opencode-toolbox-vscode`

## Prerequisites

1. [Toolbx](https://containertoolbx.org/) on your `PATH`
2. Toolbox container created from GHCR:

```bash
toolbox create --image ghcr.io/alyshmahell/opencode-toolbox:1.18.2 --container opencode
```

## Install in VSCodium / VS Code

1. Download the VSIX from the [latest release](https://github.com/AlyShmahell/toolboxai/releases/latest)  
   (`opencode-toolbox-vscode-0.1.1.vsix`)
2. Command Palette → **Extensions: Install from VSIX…**
3. Select the downloaded `.vsix` file
4. Reload the window if prompted

Direct asset:

https://github.com/AlyShmahell/toolboxai/releases/download/v0.1.1/opencode-toolbox-vscode-0.1.1.vsix

You can also drag the `.vsix` onto the Extensions view.

## Commands

- OpenCode Toolbox: Open
- OpenCode Toolbox: Open in New Terminal
- OpenCode Toolbox: Insert File Reference

Local packaging, settings, and lifecycle details: [docs/extension-development.md](../../docs/extension-development.md).
