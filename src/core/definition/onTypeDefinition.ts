import { createDebug } from '../common/debug';
import { Location } from 'vscode-languageserver';
import { OnTypeDefinition } from '../context';
import { TypeNode } from '../common/parser';

const debug = createDebug('server:onTypeDefinition');

export const onTypeDefinition: OnTypeDefinition =
  (ctx) =>
  async ({ textDocument, position }) => {
    const document = ctx.documents.get(textDocument.uri);
    if (!document) return null;

    const path = document.getNodeAt<TypeNode>(position);
    if (!path) return null;
    debug('onTypeDefinition:', textDocument.uri, position);

    switch (path.node.type) {
      case 'FunctionTypeName':
        return null;
      case 'MappingKeyType':
        return null;
      case 'MappingType':
        return null;
      case 'MetaType':
        return null;
      case 'TypeName':
        return null;
      case 'ElementaryTypeName':
      default:
        return null; // basic type
    }
  };
