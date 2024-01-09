import { CompletionItemKind } from 'vscode-languageserver/browser';
import { SyntaxNode } from '../common/parser';
import { PartialDeep } from 'type-fest';

export interface GloballyVariable {
  label: string;
  kind: CompletionItemKind;
  detail: string;
  documentation: string;
  filter?: PartialDeep<SyntaxNode>; // undefined/false means cannot filtered
  parentFilter?: PartialDeep<SyntaxNode>; // undefined/false means cannot filtered
  url?: string; // document url or something
}

export type GloballyVariables = GloballyVariable[];

export type GloballyVariableMap = Record<string, GloballyVariable>;

export { CompletionItemKind };
