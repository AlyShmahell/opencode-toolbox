# OpenCode Toolbox extension

**Note:** This project is not built by the OpenCode team and is not affiliated with OpenCode / anomalyco in any way.

Launches [OpenCode](https://opencode.ai/) inside the Podman Toolbx container from VS Code / Cursor.

Extension ID: `alyshmahell.opencode-toolbox-extension`

## Prerequisites

1. [Toolbx](https://containertoolbx.org/) on your `PATH`
2. Toolbox container created from GHCR:

```bash
toolbox create --image ghcr.io/alyshmahell/opencode-toolbox:1.18.2 --container opencode
```

## Install in Cursor / VS Code

1. Download the VSIX from the [latest release](https://github.com/AlyShmahell/localai-toolbox/releases/latest)  
   (`opencode-toolbox-extension-0.1.0.vsix`)
2. Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) → **Extensions: Install from VSIX…**
3. Select the downloaded `.vsix` file
4. Reload the window if prompted

Direct asset:

https://github.com/AlyShmahell/localai-toolbox/releases/download/v0.1.0/opencode-toolbox-extension-0.1.0.vsix

You can also drag the `.vsix` onto the Extensions view.

## Commands

| Command | Default keybinding |
|---|---|
| OpenCode Toolbox: Open | `Ctrl+Esc` / `Cmd+Esc` |
| OpenCode Toolbox: Open in New Terminal | `Ctrl+Shift+Esc` / `Cmd+Shift+Esc` |
| OpenCode Toolbox: Insert File Reference | `Ctrl+Alt+K` / `Cmd+Alt+K` |

Local packaging, settings, and lifecycle details: [docs/extension-development.md](../../docs/extension-development.md).
