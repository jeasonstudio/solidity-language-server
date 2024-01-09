export const enterVisitors: any[] = [
  'SourceUnit',
  'PragmaDirective',
  'ImportDirective',
  'ContractDefinition',
  'InheritanceSpecifier',
  'StateVariableDeclaration',
  'UsingForDeclaration',
  'StructDefinition',
  'ModifierDefinition',
  'ModifierInvocation',
  'FunctionDefinition',
  'EventDefinition',
  'CustomErrorDefinition',
  'RevertStatement',
  'EnumValue',
  'EnumDefinition',
  'VariableDeclaration',
  'UserDefinedTypeName',
  'Mapping',
  'ArrayTypeName',
  'FunctionTypeName',
  'Block',
  'ExpressionStatement',
  'IfStatement',
  'WhileStatement',
  'ForStatement',
  'InlineAssemblyStatement',
  'DoWhileStatement',
  'ContinueStatement',
  'Break',
  'Continue',
  'BreakStatement',
  'ReturnStatement',
  'EmitStatement',
  'ThrowStatement',
  'VariableDeclarationStatement',
  'ElementaryTypeName',
  'FunctionCall',
  'AssemblyBlock',
  'AssemblyCall',
  'AssemblyLocalDefinition',
  'AssemblyAssignment',
  'AssemblyStackAssignment',
  'LabelDefinition',
  'AssemblySwitch',
  'AssemblyCase',
  'AssemblyFunctionDefinition',
  'AssemblyFor',
  'AssemblyIf',
  'TupleExpression',
  'NameValueExpression',
  'BooleanLiteral',
  'NumberLiteral',
  'Identifier',
  'BinaryOperation',
  'UnaryOperation',
  'NewExpression',
  'Conditional',
  'StringLiteral',
  'HexLiteral',
  'HexNumber',
  'DecimalNumber',
  'MemberAccess',
  'IndexAccess',
  'IndexRangeAccess',
  'NameValueList',
  'UncheckedStatement',
  'TryStatement',
  'CatchClause',
  'FileLevelConstant',
  'AssemblyMemberAccess',
  'TypeDefinition',
];

export const exitVisitors = enterVisitors.map((enter) => `${enter}:exit`);

export const visitors = [...enterVisitors, ...exitVisitors];

export const definitionVisitors = [
  'ContractDefinition',
  'StructDefinition',
  'ModifierDefinition',
  'FunctionDefinition',
  'EventDefinition',
  'CustomErrorDefinition',
  'EnumDefinition',
  'AssemblyLocalDefinition',
  'LabelDefinition',
  'AssemblyFunctionDefinition',
  'TypeDefinition',
];

// SourceUnit
// PragmaDirective
// ImportDirective
// ContractDefinition
// InheritanceSpecifier
// StateVariableDeclaration
// UsingForDeclaration
// StructDefinition
// ModifierDefinition
// ModifierInvocation
// FunctionDefinition
// EventDefinition
// CustomErrorDefinition
// EnumValue
// EnumDefinition
// VariableDeclaration
// TypeName
// UserDefinedTypeName
// Mapping
// FunctionTypeName
// Block
// Statement
// ElementaryTypeName
// AssemblyBlock
// AssemblyCall
// AssemblyLocalDefinition
// AssemblyAssignment
// AssemblyStackAssignment
// LabelDefinition
// AssemblySwitch
// AssemblyCase
// AssemblyFunctionDefinition
// AssemblyFor
// AssemblyIf
// AssemblyLiteral
// TupleExpression
// BinaryOperation
// Conditional
// IndexAccess
// IndexRangeAccess
// AssemblyItem
// Expression
// NameValueList
// AssemblyMemberAccess
// CatchClause
// FileLevelConstant
// TypeDefinition
