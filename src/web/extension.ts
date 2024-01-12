import * as vscode from 'vscode';
import { LanguageClient, LanguageClientOptions } from 'vscode-languageclient/browser';
import { SolidityFileWatcher } from '../core/common/file-watcher';

let languageServerClient: LanguageClient | null = null;
let languageCompilerClient: LanguageClient | null = null;

export async function activate(context: vscode.ExtensionContext) {
  const fileWatcher = new SolidityFileWatcher();

  const serverClientOptions: LanguageClientOptions = {
    // Register the server for solidity text documents.
    documentSelector: [{ /*scheme: 'file',*/ language: 'solidity', pattern: `**/*.sol` }],
    synchronize: { fileEvents: [fileWatcher.fileEvent] },
    diagnosticCollectionName: 'solidity',
    initializationOptions: {},
  };

  const serverWorker = new Worker(
    vscode.Uri.joinPath(context.extensionUri, 'dist/web/server.js').toString(true),
  );
  languageServerClient = new LanguageClient(
    'solidity',
    'Solidity',
    serverClientOptions,
    serverWorker,
  );
  fileWatcher.listen(languageServerClient);

  const compilerClientOptions: LanguageClientOptions = {
    // Register the server for solidity text documents.
    documentSelector: [{ /*scheme: 'file',*/ language: 'solidity', pattern: `**/*.sol` }],
    synchronize: { fileEvents: [fileWatcher.fileEvent] },
    diagnosticCollectionName: 'solidity',
    initializationOptions: {},
  };

  const compilerWorker = new Worker(
    vscode.Uri.joinPath(context.extensionUri, 'dist/web/compiler.js').toString(true),
  );
  languageCompilerClient = new LanguageClient(
    'solidity-compiler',
    'Solidity Compiler',
    compilerClientOptions,
    compilerWorker,
  );
  fileWatcher.listen(languageCompilerClient);

  languageServerClient.start();
  languageCompilerClient.start();
}

export async function deactivate() {
  if (languageServerClient) {
    await languageServerClient.stop();
    languageServerClient = null;
  }

  if (languageCompilerClient) {
    await languageCompilerClient.stop();
    languageCompilerClient = null;
  }
}
