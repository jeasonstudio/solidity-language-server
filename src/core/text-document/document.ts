import { Position, Range, TextDocumentContentChangeEvent } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { SolidityBaseTextDocument } from './base';
import { createDebug } from '../common/debug';
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
} from '../common/parser';

const debug = createDebug('core:text-document');
const ctx: Context = globalThis.GlobalContext;

export class SolidityTextDocument extends SolidityBaseTextDocument implements TextDocument {
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

  // File AST parsed by `solidity-antlr4`
  public ast: SourceUnit | null = null;
  public tokens: SyntaxToken[] = [];

  public constructor(uri: string, languageId: string, version: number, content: string) {
    super(uri, languageId, version, content);
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

  /**
   * 从当前文件 resolve 相对路径
   * @param relativePath string 相对当前文件的路径
   * @todo 支持 `node_modules` 等包管理
   */
  public resolve(...paths: string[]) {
    return ctx.documents.resolve(this.uri, ...paths);
  }
}
