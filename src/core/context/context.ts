import { Connection } from 'vscode-languageserver';
import { TextDocuments } from '../common/text-documents';
import { SolidityTextDocument } from '../text-document';

export class Context {
  public constructor(
    // VSCode Language Server Connection
    public readonly connection: Connection,
    // VSCode Text Documents
    public readonly documents: TextDocuments<SolidityTextDocument>,
  ) {}
}
