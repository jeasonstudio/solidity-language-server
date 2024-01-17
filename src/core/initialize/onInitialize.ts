import { createDebug } from '../common/debug';
import { TextDocumentSyncKind } from 'vscode-languageserver';
import { Context, OnInitialize } from '../context';

const debug = createDebug('core:onInitialize');

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
        documentLinkProvider: { resolveProvider: false },
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
        documentFormattingProvider: true,
      },
    };

    debug(`initializing result:`, result);
    return result;
  };
