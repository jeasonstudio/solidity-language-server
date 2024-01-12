import * as vscode from 'vscode';
import type { SolidityFileWatcher } from './file-watcher';
import type {
  LanguageClientOptions,
  ServerOptions,
  LanguageClient as LanguageClientNode,
} from 'vscode-languageclient/node';
import type { LanguageClient as LanguageClientBrowser } from 'vscode-languageclient/browser';

type LanguageClient = LanguageClientNode | LanguageClientBrowser;

export const createClientOptions = <T extends object>(
  fileWatcher: SolidityFileWatcher,
  initializationOptions: T = {} as T,
) => {
  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ /*scheme: 'file',*/ language: 'solidity', pattern: `**/*.sol` }],
    synchronize: { fileEvents: [fileWatcher.fileEvent] },
    diagnosticCollectionName: 'solidity',
    initializationOptions,
  };
  return clientOptions;
};

export const createServerOptions = (serverMain: string) => {
  const serverOptions: ServerOptions = {
    module: serverMain,
    transport: 1, // TransportKind.ipc,
  };
  return serverOptions;
};

export const tryStopClient = async (client: LanguageClient | null) => {
  if (client && client?.state === 2 /*State.Running*/) {
    await client.stop();
    // eslint-disable-next-line no-param-reassign
    client = null;
  }
};

export const createStatusItem = (clients: LanguageClient[]) => {
  const statusItem = vscode.window.createStatusBarItem(
    'solidity-status',
    vscode.StatusBarAlignment.Left,
  );

  for (let index = 0; index < clients.length; index += 1) {
    const client = clients[index];
    client.onDidChangeState(({ newState }) => {
      if (newState === 3 /*State.Starting*/) {
        statusItem.text = `$(sync~spin) Initializing ${client.name}`;
        statusItem.show();
      } else {
        statusItem.text = ``;
        statusItem.hide();
      }
    });
  }
  return statusItem;
};
