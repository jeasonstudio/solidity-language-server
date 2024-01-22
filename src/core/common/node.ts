import { SyntaxNode } from './parser';

export const n2s = (node?: SyntaxNode | null) => {
  if (!node) return '';

  const toString = <T extends SyntaxNode>(n: T): string => {
    return `${n.type}`;
  };
  const join = (...args: any[]) => args.filter((item) => item ?? false).join(' ');
  const joinWithComma = (...args: any[]) => args.filter((item) => item ?? false).join(', ');
  const joinWithParen = (n: string, ...args: any[]) => `${n} (${joinWithComma(...args)})`;

  switch (node.type) {
    /* declaration */
    case 'ContractDefinition':
      return join(
        node.abstract ? 'abstract' : null,
        node.contractKind,
        n2s(node.name),
        node.baseContracts.length
          ? join('is', joinWithComma(...node.baseContracts.map(n2s)))
          : null,
      );
    case 'EnumDefinition':
      return toString(node);
    case 'ErrorDefinition':
      return toString(node);
    case 'EventDefinition':
      return toString(node);
    case 'FunctionDefinition':
      return toString(node);
    case 'ModifierDefinition':
      return toString(node);
    case 'StateMutability':
      return toString(node);
    case 'StructDefinition':
      return toString(node);
    case 'StructMember':
      return toString(node);
    case 'UserDefinedValueTypeDefinition':
      return toString(node);
    case 'VariableDeclaration':
      return toString(node);
    case 'Visibility':
      return toString(node);

    /* expression */
    case 'AssignOp':
      return toString(node);
    case 'Assignment':
      return toString(node);
    case 'BinaryOperation':
      return toString(node);
    case 'BooleanLiteral':
      return toString(node);
    case 'Conditional':
      return toString(node);
    case 'FunctionCallOptions':
      return toString(node);
    case 'FunctionCall':
      return toString(node);
    case 'HexStringLiteral':
      return toString(node);
    case 'Identifier':
      return node.name;
    case 'IndexAccess':
      return toString(node);
    case 'IndexRangeAccess':
      return toString(node);
    case 'MemberAccess':
      return toString(node);
    case 'NamedArgument':
      return toString(node);
    case 'NewExpr':
      return toString(node);
    case 'NumberLiteral':
      return toString(node);
    case 'PayableConversion':
      return toString(node);
    case 'StringLiteral':
      return toString(node);
    case 'UnaryOperation':
      return toString(node);
    case 'UnicodeStringLiteral':
      return toString(node);
    case 'UserDefinableOperator':
      return toString(node);

    /* meta */
    case 'DataLocation':
      return toString(node);
    case 'IdentifierPath':
      return node.name;
    case 'ImportAliases':
      return toString(node);
    case 'ImportDirective':
      return toString(node);
    case 'InheritanceSpecifier':
      return joinWithParen(n2s(node.baseName), ...node.arguments.map(n2s));
    case 'ModifierInvocation':
      return toString(node);
    case 'Path':
      return toString(node);
    case 'PragmaDirective':
      return toString(node);
    case 'SourceUnit':
      return toString(node);
    case 'UsingDirective':
      return toString(node);

    /* statement */
    case 'AssemblyStatement':
      return toString(node);
    case 'Block':
      return toString(node);
    case 'BreakStatement':
      return toString(node);
    case 'CatchClause':
      return toString(node);
    case 'ContinueStatement':
      return toString(node);
    case 'DoWhileStatement':
      return toString(node);
    case 'EmitStatement':
      return toString(node);
    case 'ForStatement':
      return toString(node);
    case 'IfStatement':
      return toString(node);
    case 'ReturnStatement':
      return toString(node);
    case 'RevertStatement':
      return toString(node);
    case 'TryStatement':
      return toString(node);
    case 'VariableDeclarationStatement':
      return toString(node);
    case 'WhileStatement':
      return toString(node);

    /* type */
    case 'ElementaryTypeName':
      return toString(node);
    case 'FunctionTypeName':
      return toString(node);
    case 'MappingKeyType':
      return toString(node);
    case 'MappingType':
      return toString(node);
    case 'MetaType':
      return toString(node);
    case 'TypeName':
      return toString(node);

    /* TODO: yul */
    default:
      return '';
  }
};
