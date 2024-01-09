import { createDebug } from '../common/debug';
import { Connection, Hover, MarkupContent, MarkupKind } from 'vscode-languageserver/browser';
import { Context } from '../context';
import { SyntaxNode, TraverseFilter } from '../common/parser';
import { node2string } from '../common/formatter';
import { globallyList } from '../globally';

const debug = createDebug('core:onHover');

type OnHover = Parameters<Connection['onHover']>[0];

export const onHover =
  (ctx: Context): OnHover =>
  async ({ textDocument, position }) => {
    // 1. 获取 documents
    const document = ctx.documents.get(textDocument.uri);
    if (!document) return null;

    // 2. 根据 position 获取 target node 和 parent node
    const path = document.getNodeAt(position);
    const { node: target, parent } = path;
    const range = document.getNodeRange(target);
    debug(
      // `target@L${range.start.line}:${range.start.character}-L${range.end.line}:${range.end.character}`,
      target,
      parent,
    );

    // 3. 判断是否为全局变量或方法
    const globallyItem = globallyList.find((item) =>
      item.filter ? path.matches(item.filter, item.parentFilter) : false,
    );

    if (globallyItem) {
      return {
        range,
        contents: {
          kind: MarkupKind.Markdown,
          value: `\`\`\`solidity\n(global) ${globallyItem.detail}\n\`\`\`  \n${
            globallyItem.documentation
          }${globallyItem.url ? ` [view document](${globallyItem.url})` : ''}`,
        },
      };
    }

    // 4. 其他情况
    const getHover = (n: SyntaxNode, c: string[]): Hover => ({
      range: document.getNodeRange(n),
      contents: {
        kind: MarkupKind.Markdown,
        value: ['```solidity', ...c, '```'].join('\n'),
      },
    });

    let hover: Hover | null = null;

    if (path.matches({ type: 'ImportDirective' })) {
      hover = getHover(target, [node2string(target)]);
    } else if (path.matches({ type: 'Path' }, { type: 'ImportDirective' })) {
      hover = getHover(parent!, [node2string(parent!)]);
    } else if (path.matches({}, { type: 'VariableDeclaration' })) {
      hover = getHover(parent!, [node2string(parent!)]);
    } else if (path.matches({}, { type: 'ContractDefinition' })) {
      hover = getHover(parent!, [node2string(parent!)]);
    } else if (path.matches({}, { type: 'EnumDefinition' })) {
      hover = getHover(parent!, [node2string(parent!)]);
    } else if (path.matches({}, { type: 'UserDefinedValueTypeDefinition' })) {
      hover = getHover(parent!, [node2string(parent!)]);
    } else if (path.matches({}, { type: 'ErrorDefinition' })) {
      hover = getHover(parent!, [node2string(parent!)]);
    } else if (path.matches({}, { type: 'EventDefinition' })) {
      hover = getHover(parent!, [node2string(parent!)]);
    } else if (path.matches({}, { type: 'StructDefinition' })) {
      hover = getHover(parent!, [node2string(parent!)]);
    } else if (path.matches({ type: 'Identifier' }, { type: 'FunctionDefinition' })) {
      hover = getHover(parent!, [node2string(parent!)]);
    }

    return hover;
  };
