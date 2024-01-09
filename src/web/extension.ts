import * as vscode from 'vscode';
import { LanguageClient, LanguageClientOptions } from 'vscode-languageclient/browser';
import { SolidityFileWatcher } from '../core/common/file-watcher';

// This method is called when your extension is activated
export function createClient(context: vscode.ExtensionContext) {
  const fileWatcher = new SolidityFileWatcher();

  // Options to control the language client.
  const clientOptions: LanguageClientOptions = {
    // Register the server for solidity text documents.
    documentSelector: [{ /*scheme: 'file',*/ language: 'solidity', pattern: `**/*.sol` }],
    synchronize: {
      fileEvents: [fileWatcher.fileEvent],
    },
    diagnosticCollectionName: 'solidity',
    initializationOptions: {
      // extensionName: 'solidity-language-server',
      // extensionVersion: '1.0.0',
      // env: 'development',
    },
  };

  const serverMain = vscode.Uri.joinPath(context.extensionUri, 'dist/web/server.js');
  const worker = new Worker(serverMain.toString(true));
  const client = new LanguageClient('solidity', 'Solidity', clientOptions, worker);
  fileWatcher.listen(client);

  return client;
}

let languageServerClient: LanguageClient | null = null;

export async function activate(context: vscode.ExtensionContext) {
  languageServerClient = createClient(context);
  languageServerClient.start();
}

export async function deactivate() {
  if (languageServerClient) {
    await languageServerClient.stop();
    languageServerClient = null;
  }
}
