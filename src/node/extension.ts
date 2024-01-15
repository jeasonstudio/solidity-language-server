import * as vscode from 'vscode';
import { LanguageClient } from 'vscode-languageclient/node';
import {
  createClientOptions,
  createServerOptions,
  createStatusItem,
  startClient,
  stopClient,
} from '../core/common/client';

let languageServerClient: LanguageClient | null = null;
let languageCompilerClient: LanguageClient | null = null;

export async function activate(context: vscode.ExtensionContext) {
  languageServerClient = new LanguageClient(
    'solidity',
    'Solidity',
    createServerOptions(vscode.Uri.joinPath(context.extensionUri, 'dist/node/server.js').fsPath),
    createClientOptions(),
  );

  languageCompilerClient = new LanguageClient(
    'solidity-compiler',
    'Solidity Compiler',
    createServerOptions(vscode.Uri.joinPath(context.extensionUri, 'dist/node/compiler.js').fsPath),
    createClientOptions(),
  );

  context.subscriptions.push(createStatusItem([languageCompilerClient]));

  startClient(languageServerClient);
  startClient(languageCompilerClient);
}

export async function deactivate() {
  await stopClient(languageServerClient);
  await stopClient(languageCompilerClient);
}
