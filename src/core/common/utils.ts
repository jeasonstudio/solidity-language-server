import { MarkupContent, MarkupKind } from 'vscode-languageserver';

export const markup = (markdown: string): MarkupContent => ({
  kind: MarkupKind.Markdown,
  value: markdown,
});

export const markupSolidity = (solContent: string): MarkupContent => ({
  kind: MarkupKind.Markdown,
  value: '```solidity\n' + solContent + '\n```',
});
