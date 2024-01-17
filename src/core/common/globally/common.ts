import { CompletionItemKind } from 'vscode-languageserver';
import { QueryFilter } from '../parser';

export interface GloballyVariable {
  label: string;
  kind: CompletionItemKind;
  detail: string;
  documentation: string;
  filters: QueryFilter[] | false; // undefined/false means cannot filtered
  url?: string; // document url or something
}

export type GloballyVariables = GloballyVariable[];

export type GloballyVariableMap = Record<string, GloballyVariable>;

export { CompletionItemKind };
