import { Connection, TextDocumentSyncKind } from 'vscode-languageserver';
import { SolidityTextDocument } from './text-document';
import { TextDocuments } from './common/text-documents';
import { createDebug, enableDebug } from './common/debug';
import { importCompiler } from './compiler/compiler';

const debug = createDebug('core:compiler');
enableDebug('*');

export const listen = (connection: Connection): TextDocuments<SolidityTextDocument> => {
  const documents = new TextDocuments(SolidityTextDocument);

  // Lifecycle hooks
  connection.onInitialize(({ initializationOptions, workspaceFolders }) => {
    debug('initialize', initializationOptions, workspaceFolders);
    if (!initializationOptions?.compilerUrl) {
      connection.window.showWarningMessage(
        "`compilerUrl` not found, please check your extension's configuration.",
      );
    }

    importCompiler(initializationOptions?.compilerUrl);

    return {
      capabilities: {
        textDocumentSync: TextDocumentSyncKind.Full,
        workspace: {},
      },
    };
  });

  documents.listen(connection);
  // Listen on the connection
  connection.listen();

  return documents;
};
