import { Connection, DiagnosticSeverity, Range, TextDocumentSyncKind } from 'vscode-languageserver';
import { debounce } from 'lodash-es';
import { SolidityTextDocument } from './text-document';
import { TextDocuments, documents } from './common/text-documents';
import { createDebug, enableDebug } from './common/debug';
import { importCompiler, validateDocument } from './compiler/compiler';

const debug = createDebug('core:compiler');
enableDebug('*');

export const listen = (connection: Connection): TextDocuments<SolidityTextDocument> => {
  // Lifecycle hooks
  connection.onInitialize(async ({ initializationOptions, workspaceFolders }) => {
    debug('compiler initialize', initializationOptions, workspaceFolders);
    // if (!initializationOptions?.compilerUrl) {
    //   connection.window.showWarningMessage(
    //     "`compilerUrl` not found, please check your extension's configuration.",
    //   );
    // }
    await importCompiler(initializationOptions?.compilerUrl);

    return {
      capabilities: {
        textDocumentSync: TextDocumentSyncKind.Full,
        workspace: {},
      },
    };
  });

  const validate = (document: SolidityTextDocument) => {
    const uri = document.uri;
    const errors = validateDocument(uri);
    const currentErrors = errors.filter(({ sourceLocation }) => sourceLocation?.file === uri);
    if (!currentErrors.length) return;

    connection.sendDiagnostics({
      uri,
      diagnostics: currentErrors.map((error) => {
        let severity: DiagnosticSeverity = DiagnosticSeverity.Error;
        switch (error.severity) {
          case 'warning':
            severity = DiagnosticSeverity.Warning;
            break;
          case 'info':
            severity = DiagnosticSeverity.Information;
            break;
          case 'error':
          default:
            severity = DiagnosticSeverity.Error;
            break;
        }

        const range = Range.create(
          document.positionAt(error?.sourceLocation?.start ?? 0),
          document.positionAt(error?.sourceLocation?.end ?? Number.MAX_SAFE_INTEGER),
        );

        return {
          message: error.message,
          code: error.errorCode,
          source: error.type,
          severity,
          range,
        };
      }),
    });
  };

  const validateDebounced = (timestamp: number = 1000) =>
    debounce((document: SolidityTextDocument) => validate(document), timestamp);

  documents.listen(connection);
  documents.onDidOpen(({ document }) => validate(document));
  documents.onDidSave(({ document }) => validate(document));
  documents.onDidChangeContent(({ document }) => validateDebounced(600)(document));
  documents.onSync(({ documents: documentList }) => {
    documentList.forEach((document) => validate(document));
  });
  // Listen on the connection
  connection.listen();

  return documents;
};
