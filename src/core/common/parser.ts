import { createTraverse, SyntaxNode, TraverseHandlers } from 'solidity-antlr4';

export * from 'solidity-antlr4';
export const visit = (ast: SyntaxNode, visitor: TraverseHandlers) => createTraverse(visitor)(ast);
export const visitEnter = (ast: SyntaxNode, enter: TraverseHandlers['enter']) =>
  visit(ast, { enter });
export const visitExit = (ast: SyntaxNode, exit: TraverseHandlers['exit']) => visit(ast, { exit });
