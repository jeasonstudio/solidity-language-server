import { CompletionItemKind } from 'vscode-languageserver';
import { QueryFilter } from '../parser';

export interface GloballyVariable {
  label: string;
  kind: CompletionItemKind;
  detail: string;
  documentation: string;
  filter: QueryFilter | false; // undefined/false means cannot filtered
  url?: string; // document url or something
  parameters?: string[];
}

export type GloballyVariables = GloballyVariable[];

export type GloballyVariableMap = Record<string, GloballyVariable>;

export { CompletionItemKind };
