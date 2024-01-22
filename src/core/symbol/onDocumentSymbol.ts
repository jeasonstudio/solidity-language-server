import { DocumentSymbol, SymbolKind } from 'vscode-languageserver';
import { OnDocumentSymbol } from '../context';
import {
  ContractDefinition,
  EnumDefinition,
  ErrorDefinition,
  EventDefinition,
  FunctionDefinition,
  ImportDirective,
  ModifierDefinition,
  StructDefinition,
  UserDefinedValueTypeDefinition,
  UsingDirective,
  VariableDeclaration,
} from '../common/parser';

export const onDocumentSymbol: OnDocumentSymbol =
  (ctx) =>
  async ({ textDocument }) => {
    const document = ctx.documents.get(textDocument.uri);
    if (!document || !document.ast) return null;

    const getEnumSymbol = (ast: EnumDefinition): DocumentSymbol | null => {
      const range = document.getNodeRange(ast);
      return {
        name: ast.name.name,
        kind: SymbolKind.Enum,
        range,
        selectionRange: range,
        children: ast.members.map((member) => {
          const newRange = document.getNodeRange(member);
          return {
            name: member.name,
            kind: SymbolKind.EnumMember,
            range: newRange,
            selectionRange: newRange,
          };
        }),
      };
    };
    const getErrorSymbol = (ast: ErrorDefinition): DocumentSymbol | null => {
      const range = document.getNodeRange(ast);
      return {
        name: ast.name.name,
        kind: SymbolKind.Key,
        range,
        selectionRange: range,
      };
    };
    const getEventSymbol = (ast: EventDefinition): DocumentSymbol | null => {
      const range = document.getNodeRange(ast);
      return {
        name: ast.name.name,
        kind: SymbolKind.Event,
        range,
        selectionRange: range,
      };
    };
    const getFunctionSymbol = (ast: FunctionDefinition): DocumentSymbol | null => {
      const range = document.getNodeRange(ast);
      let funcName: string;
      if (ast.functionKind === 'constructor') {
        funcName = 'constructor';
      } else if (ast.functionKind === 'fallback') {
        funcName = 'fallback';
      } else if (ast.functionKind === 'receive') {
        funcName = 'receive';
      } else {
        funcName = ast.name?.name || 'anonymous';
      }

      return {
        name: funcName,
        kind: ast.functionKind === 'constructor' ? SymbolKind.Constructor : SymbolKind.Function,
        range,
        selectionRange: range,
      };
    };
    const getImportSymbol = (ast: ImportDirective): DocumentSymbol | null => {
      const range = document.getNodeRange(ast);
      return {
        name: ast.path.name,
        kind: SymbolKind.Module,
        range,
        selectionRange: range,
      };
    };
    const getStructSymbol = (ast: StructDefinition): DocumentSymbol | null => {
      const range = document.getNodeRange(ast);
      return {
        name: ast.name.name,
        kind: SymbolKind.Struct,
        range,
        selectionRange: range,
      };
    };
    const getUsingSymbol = (ast: UsingDirective): DocumentSymbol | null => {
      const range = document.getNodeRange(ast);
      return {
        name: 'using directive',
        kind: SymbolKind.Method,
        range,
        selectionRange: range,
      };
    };
    const getModifierSymbol = (ast: ModifierDefinition): DocumentSymbol | null => {
      const range = document.getNodeRange(ast);
      return {
        name: ast.name.name,
        kind: SymbolKind.Method,
        range,
        selectionRange: range,
      };
    };
    const getUserTypeSymbol = (ast: UserDefinedValueTypeDefinition): DocumentSymbol | null => {
      const range = document.getNodeRange(ast);
      return {
        name: ast.name,
        kind: SymbolKind.TypeParameter,
        range,
        selectionRange: range,
      };
    };
    const getVarSymbol = (ast: VariableDeclaration): DocumentSymbol | null => {
      const range = document.getNodeRange(ast);
      return {
        name: ast.name?.name ?? 'variable',
        kind: ast.constant || ast.immutable ? SymbolKind.Constant : SymbolKind.Variable,
        range,
        selectionRange: range,
      };
    };
    const getContractSymbols = (ast: ContractDefinition): DocumentSymbol[] => {
      const symbols = ast.nodes
        .map((node) => {
          switch (node.type) {
            case 'EnumDefinition':
              return getEnumSymbol(node);
            case 'ErrorDefinition':
              return getErrorSymbol(node);
            case 'FunctionDefinition':
              return getFunctionSymbol(node);
            case 'EventDefinition':
              return getEventSymbol(node);
            case 'ModifierDefinition':
              return getModifierSymbol(node);
            case 'StructDefinition':
              return getStructSymbol(node);
            case 'UsingDirective':
              return getUsingSymbol(node);
            case 'UserDefinedValueTypeDefinition':
              return getUserTypeSymbol(node);
            case 'VariableDeclaration':
              return getVarSymbol(node);
            default:
              return null;
          }
        })
        .filter(Boolean) as DocumentSymbol[];
      return symbols;
    };

    const symbols = document.ast.nodes
      .map((sourceUnitNode) => {
        const range = document.getNodeRange(sourceUnitNode);
        switch (sourceUnitNode.type) {
          case 'PragmaDirective':
            return {
              name: sourceUnitNode.literals.join(' '),
              kind: SymbolKind.Package,
              range,
              selectionRange: range,
            };
          case 'ContractDefinition':
            const kind =
              sourceUnitNode.contractKind === 'library'
                ? SymbolKind.Module
                : sourceUnitNode.contractKind === 'interface'
                  ? SymbolKind.Interface
                  : SymbolKind.Class;
            return {
              name: sourceUnitNode.name.name,
              kind,
              range,
              selectionRange: range,
              children: getContractSymbols(sourceUnitNode),
            };
          case 'EnumDefinition':
            return getEnumSymbol(sourceUnitNode);
          case 'ErrorDefinition':
            return getErrorSymbol(sourceUnitNode);
          case 'FunctionDefinition':
            return getFunctionSymbol(sourceUnitNode);
          case 'ImportDirective':
            return getImportSymbol(sourceUnitNode);
          case 'StructDefinition':
            return getStructSymbol(sourceUnitNode);
          case 'UsingDirective':
            return getUsingSymbol(sourceUnitNode);
          case 'UserDefinedValueTypeDefinition':
            return getUserTypeSymbol(sourceUnitNode);
          case 'VariableDeclaration':
            return getVarSymbol(sourceUnitNode);
          default:
            return null;
        }
      })
      .filter(Boolean) as DocumentSymbol[];

    return symbols;
  };
