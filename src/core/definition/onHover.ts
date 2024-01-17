import { createDebug } from '../common/debug';
import { Hover, MarkupKind } from 'vscode-languageserver';
import { Context, OnHover } from '../context';
import { SyntaxNode, checkNode } from '../common/parser';
import { node2string } from '../common/formatter';
import { globallyList } from '../common/globally';

const debug = createDebug('core:onHover');

export const onHover =
  (ctx: Context): OnHover =>
  async ({ textDocument, position }) => {
    // 1. 获取 documents
    const document = ctx.documents.get(textDocument.uri);
    if (!document) return null;

    // 2. 根据 position 获取 target node 和 parent node
    const path = document.getNodeAt(position);
    if (!path) return null;

    // const { node: target, parent } = path;
    const range = document.getNodeRange(path.node);
    // debug(target, parent);

    // 3. 判断是否为全局变量或方法
    const globallyItem = globallyList.find((item) =>
      !item.filters || !item.filters?.length ? false : checkNode(path, item.filters),
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
    const target = path.node;
    const parent = path.parentPath?.node;

    if (checkNode(path, ['ImportDirective', 'Path'])) {
      hover = getHover(parent!, [node2string(parent!)]);
    } else if (checkNode(path, ['VariableDeclaration', 'Identifier'])) {
      hover = getHover(parent!, [node2string(parent!)]);
    } else if (checkNode(path, ['ContractDefinition', 'Identifier'])) {
      hover = getHover(parent!, [node2string(parent!)]);
    } else if (checkNode(path, ['EnumDefinition', 'Identifier'])) {
      hover = getHover(parent!, [node2string(parent!)]);
    } else if (checkNode(path, ['UserDefinedValueTypeDefinition', 'Identifier'])) {
      hover = getHover(parent!, [node2string(parent!)]);
    } else if (checkNode(path, ['ErrorDefinition', 'Identifier'])) {
      hover = getHover(parent!, [node2string(parent!)]);
    } else if (checkNode(path, ['EventDefinition', 'Identifier'])) {
      hover = getHover(parent!, [node2string(parent!)]);
    } else if (checkNode(path, ['StructDefinition', 'Identifier'])) {
      hover = getHover(parent!, [node2string(parent!)]);
    } else if (checkNode(path, ['FunctionDefinition', 'Identifier'])) {
      hover = getHover(parent!, [node2string(parent!)]);
    } else if (checkNode(path, ['ModifierDefinition', 'Identifier'])) {
      hover = getHover(parent!, [node2string(parent!)]);
    }

    return hover;
  };
