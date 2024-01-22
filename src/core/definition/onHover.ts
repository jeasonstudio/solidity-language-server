import { createDebug } from '../common/debug';
import { Hover, MarkupKind } from 'vscode-languageserver';
import { Context, OnHover } from '../context';
import { Path, SyntaxNode } from '../common/parser';
import { n2s } from '../common/node';
import { globallyList } from '../common/globally';
import { markupGlobally, markupSolidity } from '../common/utils';

const debug = createDebug('server:onHover');

export const onHover =
  (ctx: Context): OnHover =>
  async ({ textDocument, position }) => {
    // 1. 获取 documents
    const document = ctx.documents.get(textDocument.uri);
    if (!document?.ast) return null;

    const createSelector = document.createPositionSelector(position);
    const path = document.getPathAt(createSelector('*'));
    if (!path) return null;

    const range = document.getNodeRange(path.node);

    // hover as global variable or function
    const globallyItem = globallyList.find((item) => !!item.filter && path.matches(item.filter));
    if (globallyItem) {
      return { range, contents: markupGlobally(globallyItem) };
    }

    const getHover = (n: SyntaxNode, c: string[]): Hover => ({
      range: document.getNodeRange(n),
      contents: {
        kind: MarkupKind.Markdown,
        value: ['```solidity', ...c, '```'].join('\n'),
      },
    });

    // module import
    if (path.path.endsWith('.ImportDirective.Path')) {
      const importPath = document.resolvePath((path.node as Path).name);
      return { range, contents: markupSolidity(`import "${importPath.toString(true)}"`) };
    }

    // definitions
    const definitionPath: string[] = [
      '.ContractDefinition.Identifier', // contract/interface/library
      '.VariableDeclaration.Identifier', // variable
      '.FunctionDefinition.Identifier', // function
      '.EnumDefinition.Identifier', // enum
      '.ErrorDefinition.Identifier', // error
      '.EventDefinition.Identifier', // event
      '.StructDefinition.Identifier', // struct
      '.UserDefinedValueTypeDefinition.Identifier', // user defined type
      '.ModifierDefinition.Identifier', // modifier
    ];

    if (definitionPath.some((p) => path.path.endsWith(p))) {
      return getHover(path.parentPath!.node, [n2s(path.parentPath!.node)]);
    }

    return null;
  };
