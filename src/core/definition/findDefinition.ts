import { Location, Position } from 'vscode-languageserver';
import { documents } from '../common/text-documents';
import {
  Identifier,
  MemberAccess,
  SyntaxNode,
  declarationNodeTypes,
  traverse,
} from '../common/parser';
import { getRecursionUri } from '../common/utils';

export interface DefinitionItem {
  uri: string;
  location: Location;
  node: SyntaxNode;
}

export const findDefinition = (_uri: string, position: Position): DefinitionItem[] => {
  const result: DefinitionItem[] = [];
  const document = documents.get(_uri);
  if (!document) return result;

  const createSelector = document.createPositionSelector(position);
  const path = document.getPathAt<Identifier | MemberAccess>(
    createSelector('Identifier'),
    createSelector('MemberAccess'),
  );

  if (path) {
    const imports: string[] = getRecursionUri(_uri);
    let name: string | null;

    switch (path.node.type) {
      case 'MemberAccess':
        name = path.node.memberName;
        break;
      case 'Identifier':
      default:
        name = (path.node as any)?.name;
        break;
    }

    if (!name) return result;
    // if in declaration node, return null
    if (declarationNodeTypes.includes(path.parentPath?.node.type as any)) return result;

    for (let index = 0; index < imports.length; index += 1) {
      const uri = imports[index];
      if (uri.startsWith('http')) continue;
      const current = documents.get(uri);
      if (!current?.ast) continue;

      traverse(current.ast, ({ node }) => {
        // is definition node and name matched
        if (declarationNodeTypes.includes(node.type as any) && (node as any)?.name?.name === name) {
          const location = Location.create(uri, documents.get(uri)!.getNodeRange(node));
          result.push({ uri, location, node });
        }
      });
    }
  }

  return result;
};
