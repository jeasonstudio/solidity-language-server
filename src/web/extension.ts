import * as vscode from 'vscode';
import { LanguageClient } from 'vscode-languageclient/browser';
import { SolidityFileWatcher } from '../core/common/file-watcher';
import { createClientOptions, createStatusItem, tryStopClient } from '../core/common/client';

let languageServerClient: LanguageClient | null = null;
let languageCompilerClient: LanguageClient | null = null;

export async function activate(context: vscode.ExtensionContext) {
  const fileWatcher = new SolidityFileWatcher();

  languageServerClient = new LanguageClient(
    'solidity',
    'Solidity',
    createClientOptions(fileWatcher),
    new Worker(vscode.Uri.joinPath(context.extensionUri, 'dist/web/server.js').toString(true)),
  );
  fileWatcher.listen(languageServerClient);

  languageCompilerClient = new LanguageClient(
    'solidity-compiler',
    'Solidity Compiler',
    createClientOptions(fileWatcher),
    new Worker(vscode.Uri.joinPath(context.extensionUri, 'dist/web/compiler.js').toString(true)),
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
