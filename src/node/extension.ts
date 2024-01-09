import * as vscode from 'vscode';
import { SolidityFileWatcher } from '../core/common/file-watcher';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';

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

  const serverMain = vscode.Uri.joinPath(context.extensionUri, 'dist/node/server.js').fsPath;

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
    run: { module: serverMain, transport: TransportKind.ipc },
    debug: {
      module: serverMain,
      transport: TransportKind.ipc,
    },
  };
  const client = new LanguageClient('solidity', 'Solidity', serverOptions, clientOptions);
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
