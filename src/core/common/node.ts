import { astTypes } from './parser';

const getDefaultNodeString = (node: astTypes.ASTNode) => {
  return (node as any)?.name || `unknown(${node?.type || 'unknown'})`;
};

export const node2string = (node: astTypes.ASTNode) => {
  if (!node) return '';

  switch (node.type) {
    // case 'SourceUnit': // ignore
    case 'PragmaDirective':
      return `pragma ${node.name} ${node.value}`;
    case 'ImportDirective':
      return `import "${node.path}";`;
    case 'ContractDefinition':
      return `${node.kind} ${node.name} {}`;
    case 'InheritanceSpecifier':
      return getDefaultNodeString(node);
    case 'StateVariableDeclaration':
      return (node?.variables || []).map(node2string).join('\n');
    case 'UsingForDeclaration':
      return getDefaultNodeString(node);
    case 'StructDefinition':
      return getDefaultNodeString(node);
    case 'ModifierDefinition':
      return getDefaultNodeString(node);
    case 'ModifierInvocation':
      return node.arguments?.length
        ? `${node.name}(${node.arguments.map(node2string).join(', ')})`
        : node.name;
    case 'FunctionDefinition':
      const params = (node.parameters || []).map(node2string);
      const returns = (node.returnParameters || []).map(node2string);
      const modifiers = (node.modifiers || []).map(node2string);
      return `function ${node.name || ''}(${params.join(', ')}) ${[
        node.visibility,
        node.stateMutability,
        modifiers.join(' '),
      ]
        .filter(Boolean)
        .join(' ')} returns (${returns.join(', ') || 'void'})`;
    case 'EventDefinition':
      return `event ${node.name}(${(node.parameters || []).map(node2string).join(', ')})`;
    case 'CustomErrorDefinition':
      return getDefaultNodeString(node);
    case 'RevertStatement':
      return getDefaultNodeString(node);
    case 'EnumValue':
      return getDefaultNodeString(node);
    case 'EnumDefinition':
      return getDefaultNodeString(node);
    case 'VariableDeclaration':
      const typeName = node2string(node.typeName);
      return [
        typeName,
        node.visibility,
        node.storageLocation,
        node.isIndexed ? 'indexed' : null,
        node.name,
      ]
        .filter(Boolean)
        .join(' ');
    case 'UserDefinedTypeName':
      return node.namePath;
    case 'Mapping':
      return `mapping(${node2string(node.keyType)} => ${node2string(node.valueType)})`;
    case 'ArrayTypeName':
      return node2string(node.baseTypeName) + '[]';
    case 'FunctionTypeName':
      return getDefaultNodeString(node);
    case 'Block':
      return getDefaultNodeString(node);
    case 'ExpressionStatement':
      return getDefaultNodeString(node);
    case 'IfStatement':
      return getDefaultNodeString(node);
    case 'WhileStatement':
      return getDefaultNodeString(node);
    case 'ForStatement':
      return getDefaultNodeString(node);
    case 'InlineAssemblyStatement':
      return getDefaultNodeString(node);
    case 'DoWhileStatement':
      return getDefaultNodeString(node);
    case 'ContinueStatement':
      return getDefaultNodeString(node);
    case 'Break':
      return getDefaultNodeString(node);
    case 'Continue':
      return getDefaultNodeString(node);
    case 'BreakStatement':
      return getDefaultNodeString(node);
    case 'ReturnStatement':
      return getDefaultNodeString(node);
    case 'EmitStatement':
      return `emit ${node2string(node.eventCall)}`;
    case 'ThrowStatement':
      return getDefaultNodeString(node);
    case 'VariableDeclarationStatement':
      return getDefaultNodeString(node);
    case 'ElementaryTypeName':
      return [node.stateMutability, node.name].filter(Boolean).join(' ');
    case 'FunctionCall':
      return getDefaultNodeString(node);
    case 'AssemblyBlock':
      return getDefaultNodeString(node);
    case 'AssemblyCall':
      return getDefaultNodeString(node);
    case 'AssemblyLocalDefinition':
      return getDefaultNodeString(node);
    case 'AssemblyAssignment':
      return getDefaultNodeString(node);
    case 'AssemblyStackAssignment':
      return getDefaultNodeString(node);
    case 'LabelDefinition':
      return getDefaultNodeString(node);
    case 'AssemblySwitch':
      return getDefaultNodeString(node);
    case 'AssemblyCase':
      return getDefaultNodeString(node);
    case 'AssemblyFunctionDefinition':
      return getDefaultNodeString(node);
    case 'AssemblyFor':
      return getDefaultNodeString(node);
    case 'AssemblyIf':
      return getDefaultNodeString(node);
    case 'TupleExpression':
      return getDefaultNodeString(node);
    case 'NameValueExpression':
      return getDefaultNodeString(node);
    case 'BooleanLiteral':
      return getDefaultNodeString(node);
    case 'NumberLiteral':
      return getDefaultNodeString(node);
    case 'Identifier':
      return node.name;
    case 'BinaryOperation':
      return getDefaultNodeString(node);
    case 'UnaryOperation':
      return getDefaultNodeString(node);
    case 'NewExpression':
      return getDefaultNodeString(node);
    case 'Conditional':
      return getDefaultNodeString(node);
    case 'StringLiteral':
      return getDefaultNodeString(node);
    case 'HexLiteral':
      return getDefaultNodeString(node);
    case 'HexNumber':
      return getDefaultNodeString(node);
    case 'DecimalNumber':
      return getDefaultNodeString(node);
    case 'MemberAccess':
      return getDefaultNodeString(node);
    case 'IndexAccess':
      return getDefaultNodeString(node);
    case 'IndexRangeAccess':
      return getDefaultNodeString(node);
    case 'NameValueList':
      return getDefaultNodeString(node);
    case 'UncheckedStatement':
      return getDefaultNodeString(node);
    case 'TryStatement':
      return getDefaultNodeString(node);
    case 'CatchClause':
      return getDefaultNodeString(node);
    case 'FileLevelConstant':
      return getDefaultNodeString(node);
    case 'AssemblyMemberAccess':
      return getDefaultNodeString(node);
    case 'TypeDefinition':
      return getDefaultNodeString(node);
    default:
      return '';
  }
};
