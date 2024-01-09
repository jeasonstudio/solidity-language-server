import { GloballyVariableMap, CompletionItemKind } from './common';

const url = 'https://docs.soliditylang.org/en/v0.8.23/units-and-global-variables.html';

// mapping(keyword => GloballyVariableMap)
const completions: GloballyVariableMap = {
  blockhash: {
    label: 'blockhash',
    kind: CompletionItemKind.Function,
    detail: 'blockhash(uint blockNumber) returns (bytes32)',
    url,
    documentation:
      'hash of the given block when `blocknumber` is one of the 256 most recent blocks; otherwise returns zero',
    filter: {
      type: 'Identifier',
      name: 'blockhash',
    },
  },
  block: {
    label: 'block',
    kind: CompletionItemKind.Interface,
    detail: 'block',
    url,
    documentation: 'block information',
    filter: {
      type: 'Identifier',
      name: 'block',
    },
  },
  'block.basefee': {
    label: 'block.basefee',
    kind: CompletionItemKind.Property,
    detail: 'block.basefee (uint)',
    url,
    documentation:
      'current block’s base fee ([EIP-3198](https://eips.ethereum.org/EIPS/eip-3198) and [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559))',
    filter: {
      type: 'MemberAccess',
      expression: { type: 'Identifier', name: 'block' },
      memberName: 'basefee',
    },
  },
  'block.chainid': {
    label: 'block.chainid',
    kind: CompletionItemKind.Property,
    detail: 'block.chainid (uint)',
    url,
    documentation: 'current chain id',
    filter: {
      type: 'MemberAccess',
      expression: { type: 'Identifier', name: 'block' },
      memberName: 'chainid',
    },
  },
  'block.coinbase': {
    label: 'block.coinbase',
    kind: CompletionItemKind.Property,
    detail: 'block.coinbase (address payable)',
    url,
    documentation: 'current block miner’s address',
    filter: {
      type: 'MemberAccess',
      expression: { type: 'Identifier', name: 'block' },
      memberName: 'coinbase',
    },
  },
  'block.difficulty': {
    label: 'block.difficulty',
    kind: CompletionItemKind.Property,
    detail: 'block.difficulty (uint)',
    url,
    documentation:
      'current block difficulty (`EVM < Paris`). For other EVM versions it behaves as a deprecated alias for `block.prevrandao` ([EIP-4399](https://eips.ethereum.org/EIPS/eip-4399))',
    filter: {
      type: 'MemberAccess',
      expression: { type: 'Identifier', name: 'block' },
      memberName: 'difficulty',
    },
  },
  'block.gaslimit': {
    label: 'block.gaslimit',
    kind: CompletionItemKind.Property,
    detail: 'block.gaslimit (uint)',
    url,
    documentation: 'current block gaslimit',
    filter: {
      type: 'MemberAccess',
      expression: { type: 'Identifier', name: 'block' },
      memberName: 'gaslimit',
    },
  },
  'block.number': {
    label: 'block.number',
    kind: CompletionItemKind.Property,
    detail: 'block.number (uint)',
    url,
    documentation: 'current block number',
    filter: {
      type: 'MemberAccess',
      expression: { type: 'Identifier', name: 'block' },
      memberName: 'number',
    },
  },
  'block.prevrandao': {
    label: 'block.prevrandao',
    kind: CompletionItemKind.Property,
    detail: 'block.prevrandao (uint)',
    url,
    documentation: 'random number provided by the beacon chain (`EVM >= Paris`)',
    filter: {
      type: 'MemberAccess',
      expression: { type: 'Identifier', name: 'block' },
      memberName: 'prevrandao',
    },
  },
  'block.timestamp': {
    label: 'block.timestamp',
    kind: CompletionItemKind.Property,
    detail: 'block.timestamp (uint)',
    url,
    documentation: 'current block timestamp as seconds since unix epoch',
    filter: {
      type: 'MemberAccess',
      expression: { type: 'Identifier', name: 'block' },
      memberName: 'timestamp',
    },
  },
  gasleft: {
    label: 'gasleft',
    kind: CompletionItemKind.Function,
    detail: 'gasleft() returns (uint256)',
    url,
    documentation: 'remaining gas',
    filter: {
      type: 'Identifier',
      name: 'gasleft',
    },
  },
  msg: {
    label: 'msg',
    kind: CompletionItemKind.Interface,
    detail: 'msg',
    documentation: 'message information',
    url,
    filter: { type: 'Identifier', name: 'msg' },
  },
  'msg.data': {
    label: 'msg.data',
    kind: CompletionItemKind.Property,
    detail: 'msg.data (bytes calldata)',
    documentation: 'complete calldata',
    url,
    filter: {
      type: 'MemberAccess',
      expression: { type: 'Identifier', name: 'msg' },
      memberName: 'data',
    },
  },
  'msg.sender': {
    label: 'msg.sender',
    kind: CompletionItemKind.Property,
    detail: 'msg.sender (address)',
    documentation: 'sender of the message (current call)',
    url,
    filter: {
      type: 'MemberAccess',
      expression: { type: 'Identifier', name: 'msg' },
      memberName: 'sender',
    },
  },
  'msg.sig': {
    label: 'msg.sig',
    kind: CompletionItemKind.Property,
    detail: 'msg.sig (bytes4)',
    documentation: 'first four bytes of the calldata (i.e. function identifier)',
    url,
    filter: {
      type: 'MemberAccess',
      expression: { type: 'Identifier', name: 'msg' },
      memberName: 'sig',
    },
  },
  'msg.value': {
    label: 'msg.value',
    kind: CompletionItemKind.Property,
    detail: 'msg.value (uint)',
    documentation: 'number of wei sent with the message (1 Ether = 10^18 wei)',
    url,
    filter: {
      type: 'MemberAccess',
      expression: { type: 'Identifier', name: 'msg' },
      memberName: 'value',
    },
  },

  tx: {
    label: 'tx',
    kind: CompletionItemKind.Interface,
    detail: 'tx',
    documentation: 'transaction information',
    url,
    filter: { type: 'Identifier', name: 'tx' },
  },
  'tx.gasprice': {
    label: 'tx.gasprice',
    kind: CompletionItemKind.Property,
    detail: 'tx.gasprice (uint)',
    documentation: 'gas price of the transaction',
    url,
    filter: {
      type: 'MemberAccess',
      expression: { type: 'Identifier', name: 'tx' },
      memberName: 'gasprice',
    },
  },
  'tx.origin': {
    label: 'tx.origin',
    kind: CompletionItemKind.Property,
    detail: 'tx.origin (address)',
    documentation: 'sender of the transaction (full call chain)',
    url,
    filter: {
      type: 'MemberAccess',
      expression: { type: 'Identifier', name: 'tx' },
      memberName: 'origin',
    },
  },
};

export default completions;
