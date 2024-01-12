import { Range, TextEdit } from 'vscode-languageserver';
import type { Options } from 'prettier';
import * as prettier from 'prettier/standalone';
import { createDebug } from '../common/debug';
import { Context, OnDocumentFormatting } from '../context';

const debug = createDebug('core:onDocumentFormatting');

export const onDocumentFormatting =
  (ctx: Context): OnDocumentFormatting =>
  async ({ textDocument, options }) => {
    const document = ctx.documents.get(textDocument.uri);
    if (!document) return null;

    const config = (await ctx.connection.workspace.getConfiguration(
      'solidity.formatter',
    )) as Partial<Options>;

    debug('formatting with options', config);

    const source = document.getText();
    const range = Range.create(document.positionAt(0), document.positionAt(source.length));

    const prettierOptions: Options = {
      parser: 'solidity-parse',
      plugins: [require('prettier-plugin-solidity')],
      singleQuote: config.singleQuote ?? false,
      bracketSpacing: config.bracketSpacing ?? false,
      tabWidth: config.tabWidth ?? 4,
      printWidth: config.printWidth ?? 80,
      useTabs: config.useTabs ?? false,
    };
    const formatted = await prettier.format(source, prettierOptions);
    return [TextEdit.replace(range, formatted)];
  };
