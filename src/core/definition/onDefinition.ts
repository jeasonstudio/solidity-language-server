import { createDebug } from '../common/debug';
// import { Location } from 'vscode-languageserver';
import { OnDefinition } from '../context';
import { findDefinition } from './findDefinition';

const debug = createDebug('server:onDefinition');

export const onDefinition: OnDefinition = (ctx) => async (params) => {
  const { textDocument, position } = params;
  const document = ctx.documents.get(textDocument.uri);
  if (!document) return null;

  console.log(document.getPathAt(document.createPositionSelector(position)('*')));

  const definitions = findDefinition(textDocument.uri, position);
  return definitions.map((definition) => definition.location);
};
