import { Connection } from 'vscode-languageserver';
import { Context } from './context';
import { documents } from './common/text-documents';
import { onExit, onInitialize, onInitialized } from './initialize';
import { enableDebug } from './common/debug';
import { onHover, onDefinition, onDocumentLinks } from './definition';
import { onDocumentSymbol } from './symbol';
import { onDocumentFormatting } from './format';
import { onSignatureHelp } from './completion';

enableDebug('*');

export const listen = (connection: Connection) => {
  const context = new Context(connection, documents);
  globalThis.connection = connection;
  globalThis.documents = documents;

  // Lifecycle hooks
  connection.onInitialize(onInitialize(context));
  connection.onInitialized(onInitialized(context));
  connection.onExit(onExit(context));

  // Command hooks
  // connection.onCompletion(onCompletion(context));
  connection.onSignatureHelp(onSignatureHelp(context));
  connection.onDefinition(onDefinition(context));
  connection.onHover(onHover(context));
  connection.onDocumentLinks(onDocumentLinks(context));
  // connection.onCodeLens(onCodeLens(context));
  connection.onDocumentSymbol(onDocumentSymbol(context));
  // connection.onTypeDefinition(onTypeDefinition(serverState));
  // connection.onReferences(onReferences(serverState));
  // connection.onImplementation(onImplementation(serverState));
  // connection.onRenameRequest(onRename(serverState));
  // connection.onCodeAction(onCodeAction(serverState));
  connection.onDocumentFormatting(onDocumentFormatting(context));
  // connection.onDocumentRangeFormatting(); // 部分选中格式化
  // connection.onDocumentOnTypeFormatting(); // 特定字符触发，自动格式化当前行

  documents.listen(connection);
  // documents.onDidOpen(onDidOpen(context));
  // documents.onDidChangeContent(onDidChangeContent(context));

  // Listen on the connection
  connection.listen();
};
