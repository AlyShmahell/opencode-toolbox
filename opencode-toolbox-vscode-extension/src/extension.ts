import { execFile } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import * as vscode from "vscode";

const TERMINAL_NAME = "opencode-toolbox";
const SESSION_WRAPPER = "/usr/local/bin/opencode-session";
const HEARTBEAT_MS = 2000;
const HEARTBEAT_DIR = path.join(os.homedir(), ".cache", "opencode-toolbox");
const HEARTBEAT_PATH = path.join(HEARTBEAT_DIR, "heartbeat");

type TerminalCreationOptionsWithEnv = vscode.TerminalOptions & {
  env?: { [key: string]: string | null | undefined };
};

let extensionUri: vscode.Uri;
let activeTerminal: vscode.Terminal | undefined;
let activePort: number | undefined;
let heartbeatTimer: ReturnType<typeof setInterval> | undefined;
/** Suppress close kills while replacing the session (openNew). */
let replacingSession = false;

function pickPort(): number {
  return Math.floor(Math.random() * 49152) + 16384;
}

function shellQuote(value: string): string {
  if (/^[A-Za-z0-9_./+-]+$/.test(value)) {
    return value;
  }
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

function getContainer(): string {
  return vscode.workspace.getConfiguration("opencodeToolbox").get<string>("container", "opencode");
}

function getBinary(): string {
  return vscode.workspace
    .getConfiguration("opencodeToolbox")
    .get<string>("binary", "/usr/local/bin/opencode");
}

function getLaunchCommand(port: number): string {
  const container = getContainer();
  const binary = getBinary();
  return (
    `toolbox run --container ${shellQuote(container)} -- ` +
    `env OPENCODE_BINARY=${shellQuote(binary)} ${shellQuote(SESSION_WRAPPER)} --port ${port}`
  );
}

function toolboxPkill(args: string[]): Promise<void> {
  return new Promise((resolve) => {
    execFile("toolbox", ["run", "--container", getContainer(), "--", "pkill", ...args], () => {
      resolve();
    });
  });
}

function killOpencodeByPort(port: number): Promise<void> {
  return toolboxPkill(["-f", `opencode --port ${port}`]);
}

function killAllOpencode(): Promise<void> {
  return toolboxPkill(["-x", "opencode"]);
}

function listSessionTerminals(): vscode.Terminal[] {
  return vscode.window.terminals.filter((t) => t.name === TERMINAL_NAME);
}

function writeHeartbeat(): void {
  try {
    fs.mkdirSync(HEARTBEAT_DIR, { recursive: true });
    fs.writeFileSync(HEARTBEAT_PATH, `${Date.now()}\n`);
  } catch {
    // best-effort; container watchdog will time out if writes fail
  }
}

function startHeartbeat(): void {
  if (heartbeatTimer !== undefined) {
    return;
  }
  writeHeartbeat();
  heartbeatTimer = setInterval(() => {
    if (listSessionTerminals().length === 0) {
      stopHeartbeat();
      return;
    }
    writeHeartbeat();
  }, HEARTBEAT_MS);
  heartbeatTimer.unref?.();
}

function stopHeartbeat(): void {
  if (heartbeatTimer !== undefined) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = undefined;
  }
}

function disposeSessionTerminals(): void {
  for (const terminal of listSessionTerminals()) {
    terminal.dispose();
  }
  activeTerminal = undefined;
  activePort = undefined;
}

function getActiveFileRef(): string | undefined {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return undefined;
  }
  const doc = editor.document;
  if (!vscode.workspace.getWorkspaceFolder(doc.uri)) {
    return undefined;
  }
  let ref = `@${vscode.workspace.asRelativePath(doc.uri)}`;
  const selection = editor.selection;
  if (!selection.isEmpty) {
    const start = selection.start.line + 1;
    const end = selection.end.line + 1;
    ref += start === end ? `#L${start}` : `#L${start}-${end}`;
  }
  return ref;
}

async function appendPrompt(port: number, text: string): Promise<void> {
  await fetch(`http://localhost:${port}/tui/append-prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
}

async function waitForApp(port: number, attempts = 10): Promise<boolean> {
  for (let i = 0; i < attempts; i++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      await fetch(`http://localhost:${port}/app`);
      return true;
    } catch {
      // retry
    }
  }
  return false;
}

function getTerminalPort(terminal: vscode.Terminal): number | undefined {
  const options = terminal.creationOptions as TerminalCreationOptionsWithEnv;
  const raw = options.env?._EXTENSION_OPENCODE_PORT;
  if (!raw) {
    return undefined;
  }
  const port = parseInt(raw, 10);
  return Number.isFinite(port) ? port : undefined;
}

async function openTerminal(forceNew: boolean): Promise<void> {
  if (!forceNew) {
    const existing =
      activeTerminal && listSessionTerminals().includes(activeTerminal)
        ? activeTerminal
        : listSessionTerminals()[0];
    if (existing) {
      activeTerminal = existing;
      activePort = getTerminalPort(existing) ?? activePort;
      startHeartbeat();
      existing.show();
      return;
    }
  } else {
    replacingSession = true;
    stopHeartbeat();
    try {
      disposeSessionTerminals();
      await killAllOpencode();
    } finally {
      replacingSession = false;
    }
  }

  const port = pickPort();
  const terminal = vscode.window.createTerminal({
    name: TERMINAL_NAME,
    iconPath: {
      light: vscode.Uri.joinPath(extensionUri, "images", "button-light.png"),
      dark: vscode.Uri.joinPath(extensionUri, "images", "button-dark.png"),
    },
    location: { viewColumn: vscode.ViewColumn.Beside, preserveFocus: false },
    env: {
      _EXTENSION_OPENCODE_PORT: port.toString(),
      OPENCODE_CALLER: "vscode",
    },
  });

  activeTerminal = terminal;
  activePort = port;
  startHeartbeat();
  terminal.show();
  terminal.sendText(getLaunchCommand(port));

  const fileRef = getActiveFileRef();
  if (!fileRef) {
    return;
  }
  const ready = await waitForApp(port);
  if (ready) {
    await appendPrompt(port, `In ${fileRef}`);
    terminal.show();
  }
}

async function insertFileRef(): Promise<void> {
  const fileRef = getActiveFileRef();
  if (!fileRef) {
    return;
  }

  let terminal =
    activeTerminal && listSessionTerminals().includes(activeTerminal)
      ? activeTerminal
      : listSessionTerminals()[0];
  if (!terminal) {
    await openTerminal(true);
    terminal = activeTerminal ?? listSessionTerminals()[0];
    if (!terminal) {
      return;
    }
  }

  const port = getTerminalPort(terminal) ?? activePort;
  if (port !== undefined) {
    try {
      await appendPrompt(port, fileRef);
      terminal.show();
      return;
    } catch {
      // fall through to sendText
    }
  }

  terminal.sendText(fileRef, false);
  terminal.show();
}

function onDidCloseTerminal(terminal: vscode.Terminal): void {
  if (terminal.name !== TERMINAL_NAME) {
    return;
  }
  const port = getTerminalPort(terminal) ?? (terminal === activeTerminal ? activePort : undefined);
  if (terminal === activeTerminal) {
    activeTerminal = undefined;
    activePort = undefined;
  }
  if (replacingSession) {
    return;
  }
  if (port !== undefined) {
    void killOpencodeByPort(port);
  }
  if (listSessionTerminals().length === 0) {
    stopHeartbeat();
    void killAllOpencode();
  }
}

export function activate(context: vscode.ExtensionContext): void {
  extensionUri = context.extensionUri;

  context.subscriptions.push(
    vscode.commands.registerCommand("opencodeToolbox.open", () => openTerminal(false)),
    vscode.commands.registerCommand("opencodeToolbox.openNew", () => openTerminal(true)),
    vscode.commands.registerCommand("opencodeToolbox.insertFileRef", () => insertFileRef()),
    vscode.window.onDidCloseTerminal(onDidCloseTerminal),
    {
      dispose: () => {
        stopHeartbeat();
      },
    },
  );
}

export function deactivate(): void {
  stopHeartbeat();
  disposeSessionTerminals();
  void killAllOpencode();
}
