import { MarkupContent, MarkupKind } from 'vscode-languageserver';
import { GloballyVariable } from './globally/common';
import { documents } from './text-documents';
export const markup = (markdown: string): MarkupContent => ({
  kind: MarkupKind.Markdown,
  value: markdown,
});

export const markupSolidity = (solContent: string): MarkupContent => ({
  kind: MarkupKind.Markdown,
  value: '```solidity\n' + solContent + '\n```',
});

export const markupGlobally = (globallyItem: GloballyVariable): MarkupContent => ({
  kind: MarkupKind.Markdown,
  value: `\`\`\`solidity\n(global) ${globallyItem.detail}\n\`\`\`  \n${globallyItem.documentation}${
    globallyItem.url ? ` [view document](${globallyItem.url})` : ''
  }`,
});

export const getRecursionUri = (uri: string) => {
  const document = documents.get(uri);
  if (!document) return [];
  const imports = document.getImportUris();
  const result = [uri];
  imports.forEach((importUri) => {
    result.push(...getRecursionUri(importUri));
  });
  return [...new Set(result)];
};
