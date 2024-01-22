import { createDebug } from '../common/debug';
import { Location } from 'vscode-languageserver';
import { Identifier, declarationNodeTypes, traverse } from '../common/parser';
import { OnDefinition } from '../context';
import { documents } from '../common/text-documents';
import { getRecursionUri } from '../common/utils';

const debug = createDebug('core:onDefinition');

export const onDefinition: OnDefinition = (ctx) => async (params) => {
  const { textDocument, position } = params;
  const document = ctx.documents.get(textDocument.uri);
  if (!document) return null;

  const createSelector = document.createPositionSelector(position);

  const identifierPath = document.getPathAt<Identifier>(createSelector('Identifier'));
  if (identifierPath) {
    const locations: Location[] = [];
    debug(`onDefinition:`, identifierPath.path);
    const imports: string[] = getRecursionUri(document.uri);
    const name = identifierPath.node.name;

    // if in declaration node, return null
    if (declarationNodeTypes.includes(identifierPath.parentPath?.node.type as any)) return null;

    for (let index = 0; index < imports.length; index += 1) {
      const uri = imports[index];
      const current = documents.get(uri);
      if (!current?.ast) continue;

      traverse(current.ast, ({ node }) => {
        // is definition node and name matched
        if (declarationNodeTypes.includes(node.type as any) && (node as any)?.name?.name === name) {
          locations.push(Location.create(uri, documents.get(uri)!.getNodeRange(node)));
        }
      });
    }

    return locations;
  }

  return null;
};
