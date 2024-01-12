import * as vscode from 'vscode';
import { SolidityFileWatcher } from '../core/common/file-watcher';
import { LanguageClient } from 'vscode-languageclient/node';
import {
  createClientOptions,
  createServerOptions,
  createStatusItem,
  tryStopClient,
} from '../core/common/client';

let languageServerClient: LanguageClient | null = null;
let languageCompilerClient: LanguageClient | null = null;

export async function activate(context: vscode.ExtensionContext) {
  const fileWatcher = new SolidityFileWatcher();

  languageServerClient = new LanguageClient(
    'solidity',
    'Solidity',
    createServerOptions(vscode.Uri.joinPath(context.extensionUri, 'dist/node/server.js').fsPath),
    createClientOptions(fileWatcher),
  );
  fileWatcher.listen(languageServerClient);

  languageCompilerClient = new LanguageClient(
    'solidity-compiler',
    'Solidity Compiler',
    createServerOptions(vscode.Uri.joinPath(context.extensionUri, 'dist/node/compiler.js').fsPath),
    createClientOptions(fileWatcher),
  );
  fileWatcher.listen(languageCompilerClient);

  const statusItem = createStatusItem([languageServerClient, languageCompilerClient]);
  context.subscriptions.push(statusItem);

  languageServerClient.start();
  languageCompilerClient.start();
}

export async function deactivate() {
  await tryStopClient(languageServerClient);
  await tryStopClient(languageCompilerClient);
}
