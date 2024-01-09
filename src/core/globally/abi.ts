import { GloballyVariableMap, CompletionItemKind } from './common';

const url = 'https://docs.soliditylang.org/en/v0.8.23/units-and-global-variables.html';

// mapping(keyword => GloballyVariableMap)
const completions: GloballyVariableMap = {
  abi: {
    label: 'abi',
    kind: CompletionItemKind.Interface,
    detail: 'abi',
    url,
    documentation: 'abi information',
    filter: { type: 'Identifier', name: 'abi' },
  },
  'abi.decode': {
    label: 'abi.decode',
    kind: CompletionItemKind.Method,
    detail: 'abi.decode(bytes memory encodedData, (...)) returns (...)',
    url,
    documentation:
      'ABI-decodes the given data, while the types are given in parentheses as second argument. Example: `(uint a, uint[2] memory b, bytes memory c) = abi.decode(data, (uint, uint[2], bytes))`',
    filter: {
      type: 'MemberAccess',
      expression: { type: 'Identifier', name: 'abi' },
      memberName: 'decode',
    },
  },
  'abi.encode': {
    label: 'abi.encode',
    kind: CompletionItemKind.Method,
    detail: 'abi.encode(...) returns (bytes memory)',
    url,
    documentation: 'ABI-encodes the given arguments',
    filter: {
      type: 'MemberAccess',
      expression: { type: 'Identifier', name: 'abi' },
      memberName: 'encode',
    },
  },
  'abi.encodePacked': {
    label: 'abi.encodePacked',
    kind: CompletionItemKind.Method,
    detail: 'abi.encodePacked(...) returns (bytes memory)',
    url,
    documentation:
      'Performs [packed encoding](https://docs.soliditylang.org/en/v0.8.23/abi-spec.html#abi-packed-mode) of the given arguments. Note that packed encoding can be ambiguous!',
    filter: {
      type: 'MemberAccess',
      expression: { type: 'Identifier', name: 'abi' },
      memberName: 'encodePacked',
    },
  },
  'abi.encodeWithSelector': {
    label: 'abi.encodeWithSelector',
    kind: CompletionItemKind.Method,
    detail: 'abi.encodeWithSelector(bytes4 selector, ...) returns (bytes memory)',
    url,
    documentation:
      'ABI-encodes the given arguments starting from the second and prepends the given four-byte selector',
    filter: {
      type: 'MemberAccess',
      expression: { type: 'Identifier', name: 'abi' },
      memberName: 'encodeWithSelector',
    },
  },
  'abi.encodeWithSignature': {
    label: 'abi.encodeWithSignature',
    kind: CompletionItemKind.Method,
    detail: 'abi.encodeWithSignature(string memory signature, ...) returns (bytes memory)',
    url,
    documentation:
      'Equivalent to `abi.encodeWithSelector(bytes4(keccak256(bytes(signature))), ...)`',
    filter: {
      type: 'MemberAccess',
      expression: { type: 'Identifier', name: 'abi' },
      memberName: 'encodeWithSignature',
    },
  },
  'abi.encodeCall': {
    label: 'abi.encodeCall',
    kind: CompletionItemKind.Method,
    detail: 'abi.encodeCall(function functionPointer, (...)) returns (bytes memory)',
    url,
    documentation:
      'ABI-encodes a call to `functionPointer` with the arguments found in the tuple. Performs a full type-check, ensuring the types match the function signature. Result equals `abi.encodeWithSelector(functionPointer.selector, (...))`',
    filter: {
      type: 'MemberAccess',
      expression: { type: 'Identifier', name: 'abi' },
      memberName: 'encodeCall',
    },
  },
};

export default completions;
