import { createDebug } from '../common/debug';
// import { Location } from 'vscode-languageserver';
import { OnTypeDefinition } from '../context';

const debug = createDebug('server:onTypeDefinition');

export const onTypeDefinition: OnTypeDefinition =
  (ctx) =>
  async ({ textDocument, position }) => {
    const document = ctx.documents.get(textDocument.uri);
    if (!document) return null;

    const createSelector = document.createPositionSelector(position);
    // const path = document.getPathAt<TypeNode>(
    //   createSelector('FunctionTypeName'),
    //   createSelector('MemberAccess'),
    // );

    return null;
  };
