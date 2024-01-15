import * as vscode from 'vscode';
import type {
  LanguageClientOptions,
  ServerOptions,
  LanguageClient as LanguageClientNode,
} from 'vscode-languageclient/node';
import type { LanguageClient as LanguageClientBrowser } from 'vscode-languageclient/browser';
import { EVENT_TEXT_DOCUMENTS_READ_CONTENT } from './constants';

type LanguageClient = LanguageClientNode | LanguageClientBrowser;

export const createClientOptions = <T extends object>(initializationOptions: T = {} as T) => {
  const fileEvent = vscode.workspace.createFileSystemWatcher('**/*.sol');
  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ /*scheme: 'file',*/ language: 'solidity', pattern: `**/*.sol` }],
    synchronize: { fileEvents: [fileEvent] },
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

export const startClient = async (client: LanguageClient) => {
  // TickTip: server and compiler needs this event to read file content
  // from worker(especially in browser/webworker)
  client.onRequest(EVENT_TEXT_DOCUMENTS_READ_CONTENT, async (uri: string) => {
    const contentBuffer = await vscode.workspace.fs.readFile(vscode.Uri.parse(uri));
    const content = new TextDecoder().decode(contentBuffer);
    return content;
  });

  if (client && client.state !== 2) {
    await client.start();
  }
};

export const stopClient = async (client: LanguageClient | null) => {
  if (client && client.state === 2 /*State.Running*/) {
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
