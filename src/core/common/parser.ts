import {
  visit,
  SyntaxNode,
  VisitHandlers,
  TraversePath,
  SyntaxNodeType,
  TypeNode,
  TypeNodeType,
} from 'solidity-antlr4';
import { PartialDeep } from 'type-fest';

export * from 'solidity-antlr4';

// visit nodes
export const visitEnter = (ast: SyntaxNode, enter: VisitHandlers['enter']) => visit(ast, { enter });

// visit nodes when exit
export const visitExit = (ast: SyntaxNode, exit: VisitHandlers['exit']) => visit(ast, { exit });

export type QueryFilter = PartialDeep<SyntaxNode> | SyntaxNodeType;

export const getNodes = <T extends SyntaxNode = SyntaxNode>(
  ast: SyntaxNode,
  callback: (p: TraversePath) => boolean,
): T[] => {
  const nodes: T[] = [];
  visit(ast, {
    enter(path) {
      if (callback(path)) nodes.push(path.node as any);
    },
  });
  return nodes;
};

/**
 * Check if the node matches the filters
 * @param path traverse path
 * @param filters from parent to child
 */
export const checkNode = <T extends SyntaxNode>(
  _path: TraversePath<T>,
  _filters: QueryFilter[],
) => {
  const filters = _filters.map((filter) =>
    typeof filter === 'string' ? { type: filter } : filter,
  ) as PartialDeep<SyntaxNode>[];

  if (!filters.length) return true;
  let path: TraversePath | null = _path as any;

  for (let index = filters.length - 1; index >= 0; index -= 1) {
    const filter = filters[index];
    if (!path) return false;
    if (!path.matches(filter)) return false;
    path = path.parentPath;
  }
  return true;
};

export const isTypeNode = <T extends TypeNode>(node: any): node is T => {
  const types: TypeNodeType[] = [
    'ElementaryTypeName',
    'FunctionTypeName',
    'MappingKeyType',
    'MappingType',
    'MetaType',
    'TypeName',
  ];
  return types.includes(node.type);
};
