import { DocumentLink } from 'vscode-languageserver';
import { createDebug } from '../common/debug';
import { OnDocumentLinks } from '../context';
import { visit } from '../common/parser';

const debug = createDebug('core:onDocumentLinks');

export const onDocumentLinks: OnDocumentLinks =
  (ctx) =>
  async ({ textDocument }) => {
    const document = ctx.documents.get(textDocument.uri);
    if (!document || !document.ast) return null;

    const links: DocumentLink[] = [];
    visit(document.ast, {
      ImportDirective: (p) => {
        try {
          const importPath = document.resolvePath(p.node.path.name).toString(true);
          links.push(DocumentLink.create(document.getNodeRange(p.node.path), importPath));
        } catch (error) {
          // Ignore errors: console.error(error);
        }
      },
    });

    debug(`onDocumentLinks:`, links);
    return links;
  };
