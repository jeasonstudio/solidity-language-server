import * as vscode from 'vscode';
import { LanguageClient } from 'vscode-languageclient/browser';
import {
  createClientOptions,
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
    createClientOptions(),
    new Worker(vscode.Uri.joinPath(context.extensionUri, 'dist/web/server.js').toString(true)),
  );

  languageCompilerClient = new LanguageClient(
    'solidity-compiler',
    'Solidity Compiler',
    createClientOptions(),
    new Worker(vscode.Uri.joinPath(context.extensionUri, 'dist/web/compiler.js').toString(true)),
  );

  context.subscriptions.push(createStatusItem([languageCompilerClient]));

  startClient(languageServerClient);
  startClient(languageCompilerClient);
}

export async function deactivate() {
  await stopClient(languageServerClient);
  await stopClient(languageCompilerClient);
}
