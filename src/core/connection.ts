import { Connection } from 'vscode-languageserver';
import { Context } from './context';
import { SolidityTextDocument } from './text-document';
import { TextDocuments } from './common/text-documents';
import { onExit, onInitialize, onInitialized } from './initialize';
import { enableDebug } from './common/debug';
import { onHover } from './definition';

enableDebug('*');

export const listen = (connection: Connection): Context => {
  const documents = new TextDocuments(SolidityTextDocument);
  const context = new Context(connection, documents);
  globalThis.GlobalContext = context;

  // Lifecycle hooks
  connection.onInitialize(onInitialize(context));
  connection.onInitialized(onInitialized(context));
  connection.onExit(onExit(context));

  // Command hooks
  // connection.onCompletion(onCompletion(context));
  // connection.onSignatureHelp(onSignatureHelp(context));
  // connection.onDefinition(onDefinition(context));
  connection.onHover(onHover(context));
  // connection.onCodeLens(onCodeLens(context));
  // connection.onDocumentSymbol(onDocumentSymbol(context));
  // connection.onTypeDefinition(onTypeDefinition(serverState));
  // connection.onReferences(onReferences(serverState));
  // connection.onImplementation(onImplementation(serverState));
  // connection.onRenameRequest(onRename(serverState));
  // connection.onCodeAction(onCodeAction(serverState));

  documents.listen(connection);
  // documents.onDidOpen(onDidOpen(context));
  // documents.onDidChangeContent(onDidChangeContent(context));

  // Listen on the connection
  connection.listen();

  return context;
};
