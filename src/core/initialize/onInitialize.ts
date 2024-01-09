import { createDebug } from '../common/debug';
import { TextDocumentSyncKind, Connection } from 'vscode-languageserver';
import { Context } from '../context';

const debug = createDebug('core:onInitialize');
type OnInitialize = Parameters<Connection['onInitialize']>[0];

export const onInitialize =
  (_ctx: Context): OnInitialize =>
  async ({ initializationOptions }) => {
    debug(`initializing with options:`, initializationOptions);

    const result: ReturnType<OnInitialize> = {
      serverInfo: {
        name: 'Solidity',
      },
      capabilities: {
        textDocumentSync: {
          save: true,
          openClose: true,
          change: TextDocumentSyncKind.Full,
          willSave: false,
          willSaveWaitUntil: false,
        },
        // Tell the client that this server supports code completion.
        // completionProvider: {
        //   triggerCharacters: ['.', '"', `'`, '*', ' '],
        // },
        // signatureHelpProvider: {
        //   triggerCharacters: ['('],
        // },
        definitionProvider: true,
        hoverProvider: true,
        // codeLensProvider: {
        //   resolveProvider: false,
        //   workDoneProgress: false,
        // },
        documentSymbolProvider: true,
        // typeDefinitionProvider: true,
        // referencesProvider: true,
        // implementationProvider: true,
        // renameProvider: true,
        // codeActionProvider: true,
      },
    };

    debug(`initializing result:`, result);
    return result;
  };
