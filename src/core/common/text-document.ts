import * as vscodeUri from 'vscode-uri';
import { Connection, Position, Range, TextDocumentContentChangeEvent } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { createDebug } from './debug';
import {
  SyntaxNode,
  SyntaxToken,
  parse,
  tokenizer,
  TraversePath,
  traverse,
  SourceUnit,
  ImportDirective,
  QueryFilter,
  checkNode,
} from './parser';
import { documents } from './text-documents';
import { EVENT_TEXT_DOCUMENTS_READ_CONTENT } from './constants';

const debug = createDebug('core:text-document');

export class SolidityTextDocument implements TextDocument {
  public static create(
    uri: string,
    languageId: string,
    version: number,
    content: string,
  ): SolidityTextDocument {
    return new SolidityTextDocument(uri, languageId, version, content);
  }
  public static update(
    document: SolidityTextDocument,
    changes: TextDocumentContentChangeEvent[],
    version: number,
  ): SolidityTextDocument {
    if (document instanceof SolidityTextDocument) {
      document.update(changes, version);
      return document;
    } else {
      throw new Error(
        'SolidityTextDocument.update: document must be created by SolidityTextDocument.create',
      );
    }
  }
  public static applyEdits = TextDocument.applyEdits;

  public _textDocument!: TextDocument;
  public get uri(): string {
    return this._textDocument.uri;
  }
  public get languageId(): string {
    return this._textDocument.languageId;
  }
  public get version(): number {
    return this._textDocument.version;
  }
  public get lineCount(): number {
    return this._textDocument.lineCount;
  }
  public get parsedUri(): vscodeUri.URI {
    return vscodeUri.URI.parse(this.uri);
  }

  public getText(range?: Range | undefined): string {
    return this._textDocument.getText(range);
  }
  public positionAt(offset: number): Position {
    return this._textDocument.positionAt(offset);
  }
  public offsetAt(position: Position): number {
    return this._textDocument.offsetAt(position);
  }

  public promiseReady: Promise<void>;

  // File AST parsed by `solidity-antlr4`
  public ast: SourceUnit | null = null;
  public tokens: SyntaxToken[] = [];

  public constructor(uri: string, languageId: string, version: number, content: string) {
    this._textDocument = TextDocument.create(uri, languageId, version, content);
    this.promiseReady = this.init();
  }

  public update(changes: TextDocumentContentChangeEvent[], version: number): void {
    (this._textDocument as any).update(changes, version); // trick
    this.promiseReady = this.init();
  }

  /**
   * sync ast to document
   */
  private async init() {
    try {
      const content = this.getText();
      if (!content) return;
      this.ast = parse<SourceUnit>(content, { tolerant: true });
      this.tokens = tokenizer(content, { tolerant: true });

      // resolve imports
      const importDirectives = this.ast.nodes.filter(
        (n) => n.type === 'ImportDirective',
      ) as ImportDirective[];
      await Promise.all(
        importDirectives.map(async (n) => {
          const importPath = this.resolvePath(n.path.name).toString(true);
          await this.resolveDocument(importPath);
        }),
      );
    } catch (error) {
      // ignore
      console.error(error);
      globalThis.connection?.sendDiagnostics({
        uri: this.uri,
        diagnostics: [
          {
            message: (error as any).message,
            severity: 1, // means `error`
            range: Range.create(this.positionAt(0), this.positionAt(0)),
          },
        ],
      });
    }
  }

  /**
   * 从 Tokens 中找到当前位置的 Token
   * @param position vscode position
   * @returns token
   */
  public getTokenAt(position: Position) {
    const offset = this.offsetAt(position);
    const token = this.tokens.find((t) => {
      const [start, end] = t.range;
      return offset >= start && offset <= end;
    });
    return token || null;
  }

  /**
   * 根据 ast node 获取在 document 中的位置
   * @param node ast
   * @returns range
   */
  public getNodeRange<T extends SyntaxNode>(n?: T): Range {
    return {
      start: this.positionAt(n?.range?.[0] ?? 0),
      end: this.positionAt((n?.range?.[1] ?? 0) + 1),
    };
  }

  /**
   * 从 AST Tree 中找到当前位置的所有 Node List
   * @param position vscode position
   * @returns Path[]
   */
  public getNodesAt<T extends SyntaxNode = SyntaxNode>(
    position: Position,
    filters: QueryFilter[] = [],
  ) {
    const offset = this.offsetAt(position);
    const paths: TraversePath<T>[] = [];
    traverse(this.ast!, (p) => {
      const [start, end] = p.node.range;
      if (offset >= start && offset <= end) {
        if (!filters.length || (filters.length && checkNode(p, filters))) {
          paths.push(p as any);
        }
      }
    });
    return paths;
  }

  /**
   * 从 AST Tree 中找到当前位置最近的 Node
   * @description visitors 不具有优先级，返回最后一个（最深的）
   * @param position vscode position
   * @returns [Node, ParentNode]
   */
  public getNodeAt<T extends SyntaxNode = SyntaxNode>(
    position: Position,
    filters: QueryFilter[] = [],
  ) {
    const paths = this.getNodesAt<T>(position, filters);
    const target = paths[paths.length - 1];
    return target ?? null;
  }

  // public getIdentifierReferenceNode(identifier: astTypes.Identifier) {
  //   const name = identifier.name;
  //   const variables: astTypes.VariableDeclaration[] = [];

  //   visit(this.ast, {
  //     VariableDeclaration: (n) => {
  //       if (n.name === name) {
  //         variables.push(n);
  //       }
  //     },
  //   });

  //   let offsetGap = Number.MAX_SAFE_INTEGER;
  //   const offset = identifier.range?.[0] ?? 0;
  //   let target: astTypes.ASTNode = null;

  //   // 找到最近的一个并返回
  //   variables.forEach((variable) => {
  //     const gap = Math.abs((variable.range?.[0] ?? 0) - offset);
  //     if (gap < offsetGap) {
  //       offsetGap = gap;
  //       target = variable;
  //     }
  //   });

  //   return target;
  // }

  public resolvePath = (target: string): vscodeUri.URI => {
    let resultUri: vscodeUri.URI;
    if (target.startsWith('.')) {
      // `./xxx` or `../xxx` etc. means relative path
      const dirUri = vscodeUri.Utils.dirname(this.parsedUri);
      resultUri = vscodeUri.Utils.resolvePath(dirUri, target);
    } else if (target.startsWith('http:') || target.startsWith('https:')) {
      // means online path
      resultUri = vscodeUri.URI.parse(target);
    } else if (target.startsWith('/')) {
      // means absolute path
      throw new Error('absolute path import is not supported yet');
    } else if (target.startsWith('file:/')) {
      resultUri = vscodeUri.URI.parse(target);
    } else {
      // means from module manager, such as `node_modules`
      throw new Error(`module manager is not supported yet for: ${target}`);
    }
    return resultUri;
  };

  public resolveDocument = async (target: string) => {
    const uri = this.resolvePath(target).toString(true);
    if (documents.has(uri)) return documents.get(uri);

    let content: string;
    if (uri.startsWith('https://')) {
      content = await fetch(uri)
        .then((res) => res.text())
        .catch((error) => {
          console.error(error);
          throw error;
        });
    } else if (uri.startsWith('file:///')) {
      const connection: Connection = globalThis.connection;
      content = await connection.sendRequest(EVENT_TEXT_DOCUMENTS_READ_CONTENT, uri);
    } else if (uri.startsWith('http://')) {
      throw new Error("only support 'https://'");
    } else {
      throw new Error(`invalid uri: ${uri}`);
    }
    return documents.patchDocument(uri, 'solidity', 1, content);
  };
}
