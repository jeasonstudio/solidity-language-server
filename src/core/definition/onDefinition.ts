import { createDebug } from '../common/debug';
import { Location } from 'vscode-languageserver';
import { Path } from '../common/parser';
import { OnDefinition } from '../context';

const debug = createDebug('core:onDefinition');

export const onDefinition: OnDefinition =
  (ctx) =>
  async ({ textDocument, position }) => {
    const document = ctx.documents.get(textDocument.uri);
    if (!document) return null;

    const locations: Location[] = [];

    // 2. 根据 position 获取 target node 和 parent node
    const path = document.getNodeAt(position);
    const { node: target, parent } = path;
    debug(`onDefinition(${parent?.type}.${target.type})`, target, parent);

    if (path.matches({ type: 'Path' }, { type: 'ImportDirective' })) {
      const docPath = (<Path>target).name;
      const targetPath = document.resolvePath(docPath).toString(true);
      if (!targetPath.startsWith('file:/')) return null;
      return Location.create(targetPath, {
        start: document.positionAt(0),
        end: document.positionAt(0),
      });
    }

    // if (parent?.type === 'ImportDirective' && target.type === 'StringLiteral') {
    //   const targetDocument = ctx.documents.resolve(document.uri, parent.path);
    //   if (!targetDocument?.uri) return null;

    //   return Location.create(targetDocument.uri, {
    //     start: document.positionAt(0),
    //     end: document.positionAt(0),
    //   });
    // }
    // const callback = (current: astTypes.ASTNode) => {
    //   const start = document.positionAt(current.range[0]);
    //   const end = document.positionAt(current.range[1] + 1);
    //   if (start.line > position.line) return;
    //   locations.push(Location.create(document.uri, { start, end }));
    // };

    // if (target.type === 'Identifier' && parent?.type !== 'VariableDeclaration') {
    //   const name = target.name;

    //   visitFilter(document.ast, { type: 'EnumDefinition', name }, callback);
    //   visitFilter(document.ast, { type: 'TypeDefinition', name }, callback);
    //   visitFilter(document.ast, { type: 'UserDefinedTypeName', namePath: name }, callback);
    //   visitFilter(document.ast, { type: 'EventDefinition', name }, callback);
    //   visitFilter(document.ast, { type: 'LabelDefinition', name }, callback);
    //   visitFilter(document.ast, { type: 'StructDefinition', name }, callback);
    //   visitFilter(document.ast, { type: 'ContractDefinition', name }, callback);
    //   visitFilter(document.ast, { type: 'FunctionDefinition', name }, callback);
    //   visitFilter(document.ast, { type: 'ModifierDefinition', name }, callback);
    //   visitFilter(document.ast, { type: 'CustomErrorDefinition', name }, callback);
    //   // TODO: AssemblyLocalDefinition and AssemblyFunctionDefinition
    //   visitFilter(document.ast, { type: 'VariableDeclaration', name }, callback);
    // }

    // if (target.type === 'UserDefinedTypeName' && target.namePath) {
    //   visitFilter(document.ast, { type: 'StructDefinition', name: target.namePath }, callback);
    //   visitFilter(document.ast, { type: 'ContractDefinition', name: target.namePath }, callback);
    // }

    // return locations;
    return null;
  };
