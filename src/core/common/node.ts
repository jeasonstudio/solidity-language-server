import { SyntaxNode } from './parser';

export const n2s = (node?: SyntaxNode | null) => {
  if (!node) return '';

  const toString = <T extends SyntaxNode>(_n: T): string => '';
  const toName = (n: any) => n?.name ?? '';
  const join = (...args: any[]) => args.filter((item) => item ?? false).join(' ');
  const joinWithComma = (...args: any[]) => args.filter((item) => item ?? false).join(', ');
  const joinWithParen = (n: string, args: any[] | null) =>
    args === null ? n : `${n}(${joinWithComma(...args)})`;

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
      return join('enum', n2s(node.name));
    case 'ErrorDefinition':
      return join('error', joinWithParen(n2s(node.name), node.parameters.map(n2s)));
    case 'EventDefinition':
      return join('event', joinWithParen(n2s(node.name), node.parameters.map(n2s)));
    case 'FunctionDefinition':
      const params = (node.parameters ?? []).map(n2s);
      const returns = (node.returnParameters ?? []).map(n2s);
      const items = [
        n2s(node.visibility),
        n2s(node.stateMutability),
        node.virtual ? 'virtual' : null,
        ...(node.override ?? []).map(n2s),
        ...node.modifiers.map(n2s),
        returns.length ? joinWithParen('returns', returns) : null,
      ];

      switch (node.functionKind) {
        case 'constructor':
          return join(joinWithParen('constructor', params), ...items);
        case 'fallback':
        case 'receive':
          return join(`(${node.functionKind})`, joinWithParen('function', params), ...items);
        case 'function':
        default:
          return join(joinWithParen(join('function', n2s(node.name)), params), ...items);
      }
    case 'ModifierDefinition':
      return join(
        'modifier',
        joinWithParen(n2s(node.name), (node.parameters ?? []).map(n2s)),
        node.virtual ? 'virtual' : null,
        ...(node.override ?? []).map(n2s),
      );
    case 'StateMutability':
      return toName(node);
    case 'StructDefinition':
      return join('struct', n2s(node.name));
    case 'StructMember':
      return join(n2s(node.typeName), n2s(node.name));
    case 'UserDefinedValueTypeDefinition':
      return join(n2s(node.typeName), node.name);
    case 'VariableDeclaration':
      return join(
        n2s(node.typeName),
        node.public ? 'public' : null,
        node.private ? 'private' : null,
        node.internal ? 'internal' : null,
        node.immutable ? 'immutable' : null,
        node.constant ? 'constant' : null,
        node.indexed ? 'indexed' : null,
        n2s(node.dataLocation),
        n2s(node.name),
      );
    case 'Visibility':
      return toName(node);

    /* expression */
    case 'AssignOp':
      return toName(node);
    case 'Assignment':
      return join(n2s(node.left), node.operator, n2s(node.right));
    case 'BinaryOperation':
      return join(n2s(node.left), node.operator, n2s(node.right));
    case 'BooleanLiteral':
      return node.value ? 'true' : 'false';
    case 'Conditional':
      return '';
    case 'FunctionCallOptions':
      return '';
    case 'FunctionCall':
      return '';
    case 'HexStringLiteral':
      return `'${node.value}'`;
    case 'Identifier':
      return toName(node);
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
      return toName(node);
    case 'ImportAliases':
      return toString(node);
    case 'ImportDirective':
      return toString(node);
    case 'InheritanceSpecifier':
      return joinWithParen(n2s(node.baseName), node.arguments.map(n2s));
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
      return join(node.name, node.payable ? 'payable' : null);
    case 'FunctionTypeName':
      return n2s({ ...node, type: 'FunctionDefinition' });
    case 'MappingKeyType':
      return toName(node);
    case 'MappingType':
      return `mapping(${n2s(node.keyType)} => ${n2s(node.valueType)})`;
    case 'MetaType':
      return n2s(node.typeName);
    case 'TypeName':
      return node.name ?? '';

    /* TODO: yul */
    default:
      return '';
  }
};
