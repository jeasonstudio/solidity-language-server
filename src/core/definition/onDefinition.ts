import { createDebug } from '@remax-ide/common/debug';
import { Connection, Location } from 'vscode-languageserver/browser';
import { astTypes, visitFilter } from '../utils/parser';
import { Context } from '../context';

const debug = createDebug('extension:language-server:onDefinition');

type OnDefinition = Parameters<Connection['onDefinition']>[0];

export const onDefinition =
  (ctx: Context): OnDefinition =>
  async ({ textDocument, position }) => {
    const document = ctx.documents.get(textDocument.uri);
    if (!document) return null;

    const locations: Location[] = [];

    // 2. 根据 position 获取 target node 和 parent node
    const [target, parent] = document.getNodeAt(position);
    debug(`target(parent)`, { _parent: parent, ...target });

    if (parent?.type === 'ImportDirective' && target.type === 'StringLiteral') {
      const targetDocument = ctx.documents.resolve(document.uri, parent.path);
      if (!targetDocument?.uri) return null;

      return Location.create(targetDocument.uri, {
        start: document.positionAt(0),
        end: document.positionAt(0),
      });
    }
    const callback = (current: astTypes.ASTNode) => {
      const start = document.positionAt(current.range[0]);
      const end = document.positionAt(current.range[1] + 1);
      if (start.line > position.line) return;
      locations.push(Location.create(document.uri, { start, end }));
    };

    if (target.type === 'Identifier' && parent?.type !== 'VariableDeclaration') {
      const name = target.name;

      visitFilter(document.ast, { type: 'EnumDefinition', name }, callback);
      visitFilter(document.ast, { type: 'TypeDefinition', name }, callback);
      visitFilter(document.ast, { type: 'UserDefinedTypeName', namePath: name }, callback);
      visitFilter(document.ast, { type: 'EventDefinition', name }, callback);
      visitFilter(document.ast, { type: 'LabelDefinition', name }, callback);
      visitFilter(document.ast, { type: 'StructDefinition', name }, callback);
      visitFilter(document.ast, { type: 'ContractDefinition', name }, callback);
      visitFilter(document.ast, { type: 'FunctionDefinition', name }, callback);
      visitFilter(document.ast, { type: 'ModifierDefinition', name }, callback);
      visitFilter(document.ast, { type: 'CustomErrorDefinition', name }, callback);
      // TODO: AssemblyLocalDefinition and AssemblyFunctionDefinition
      visitFilter(document.ast, { type: 'VariableDeclaration', name }, callback);
    }

    if (target.type === 'UserDefinedTypeName' && target.namePath) {
      visitFilter(document.ast, { type: 'StructDefinition', name: target.namePath }, callback);
      visitFilter(document.ast, { type: 'ContractDefinition', name: target.namePath }, callback);
    }

    return locations;
  };
