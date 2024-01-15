import * as vscodeUri from 'vscode-uri';
import { Connection, Position, Range, TextDocumentContentChangeEvent } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { createDebug } from './debug';
import { Context } from '../context';
import {
  SyntaxNode,
  SyntaxToken,
  parse,
  tokenizer,
  TraverseFilter,
  TraversePath,
  traverse,
  SourceUnit,
  ImportDirective,
} from './parser';
import { documents } from './text-documents';
import { EVENT_TEXT_DOCUMENTS_READ_CONTENT } from './constants';

const debug = createDebug('core:text-document');
const ctx: Context = globalThis.GlobalContext;

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

  // File AST parsed by `solidity-antlr4`
  public ast: SourceUnit | null = null;
  public tokens: SyntaxToken[] = [];

  public constructor(uri: string, languageId: string, version: number, content: string) {
    this._textDocument = TextDocument.create(uri, languageId, version, content);
    this.init();
  }

  public update(changes: TextDocumentContentChangeEvent[], version: number): void {
    (this._textDocument as any).update(changes, version); // trick
    this.init();
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

      const importDirectives = this.ast.nodes.filter(
        (n) => n.type === 'ImportDirective',
      ) as ImportDirective[];
      importDirectives.forEach((n) => {
        const importPath = this.resolvePath(n.path.name).toString(true);
        console.log('from:', this.uri, 'to:', importPath);
        this.resolveDocument(importPath);
      });
    } catch (error) {
      // ignore
      console.warn(error);
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
  public getNodesAt(position: Position, filter?: TraverseFilter, parentFilter?: TraverseFilter) {
    const offset = this.offsetAt(position);
    const paths: TraversePath[] = [];
    const enter = (p: TraversePath) => {
      const [start, end] = p.node.range ?? [0, 0];
      if (offset >= start && offset <= end) {
        if (!filter || (filter && p.matches(filter, parentFilter))) paths.push(p);
      }
    };
    traverse(this.ast!, { enter });
    return paths;
  }

  /**
   * 从 AST Tree 中找到当前位置最近的 Node
   * @description visitors 不具有优先级，返回最后一个（最深的）
   * @param position vscode position
   * @param visitors ASTNodeTypeString[]
   * @returns [Node, ParentNode]
   */
  public getNodeAt(position: Position, filter?: TraverseFilter, parentFilter?: TraverseFilter) {
    const paths = this.getNodesAt(position, filter, parentFilter);
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

  /**
   * 从当前文件 resolve 相对路径
   * @param relativePath string 相对当前文件的路径
   * @todo 支持 `node_modules` 等包管理
   * @deprecated
   */
  public resolve(...paths: string[]) {
    return documents.resolve(this.uri, ...paths);
  }
}
