import { GloballyVariableMap, CompletionItemKind } from './common';

const url = 'https://docs.soliditylang.org/en/v0.8.23/units-and-global-variables.html';

// mapping(keyword => GloballyVariableMap)
const completions: GloballyVariableMap = {
  addmod: {
    label: 'addmod',
    kind: CompletionItemKind.Function,
    detail: 'addmod(uint x, uint y, uint k) returns (uint)',
    url,
    documentation:
      'compute `(x + y) % k` where the addition is performed with arbitrary precision and does not wrap around at `2**256`. Assert that `k != 0` starting from version 0.5.0.',
    filter: {
      type: 'Identifier',
      name: 'addmod',
    },
  },
  mulmod: {
    label: 'mulmod',
    kind: CompletionItemKind.Function,
    detail: 'mulmod(uint x, uint y, uint k) returns (uint)',
    url,
    documentation:
      'compute `(x * y) % k` where the multiplication is performed with arbitrary precision and does not wrap around at `2**256`. Assert that `k != 0` starting from version 0.5.0.',
    filter: {
      type: 'Identifier',
      name: 'mulmod',
    },
  },
  keccak256: {
    label: 'keccak256',
    kind: CompletionItemKind.Function,
    detail: 'keccak256(bytes memory) returns (bytes32)',
    url,
    documentation: 'compute the Keccak-256 hash of the input',
    filter: {
      type: 'Identifier',
      name: 'keccak256',
    },
  },
  sha256: {
    label: 'sha256',
    kind: CompletionItemKind.Function,
    detail: 'sha256(bytes memory) returns (bytes32)',
    url,
    documentation: 'compute the SHA-256 hash of the input',
    filter: {
      type: 'Identifier',
      name: 'sha256',
    },
  },
  ripemd160: {
    label: 'ripemd160',
    kind: CompletionItemKind.Function,
    detail: 'ripemd160(bytes memory) returns (bytes20)',
    url,
    documentation: 'compute the RIPEMD-160 hash of the input',
    filter: {
      type: 'Identifier',
      name: 'ripemd160',
    },
  },
  ecrecover: {
    label: 'ecrecover',
    kind: CompletionItemKind.Function,
    detail: 'ecrecover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) returns (address)',
    url,
    documentation: `recover the address associated with the public key from elliptic curve signature or return zero on error. The function parameters correspond to ECDSA values of the signature:

* \`r\` = first 32 bytes of signature
* \`s\` = second 32 bytes of signature
* \`v\` = final 1 byte of signature

\`ecrecover\` returns an \`address\`, and not an \`address payable\`. See [address payable](https://docs.soliditylang.org/en/v0.8.23/types.html#address) for conversion, in case you need to transfer funds to the recovered address.

For further details, read [example usage](https://ethereum.stackexchange.com/questions/1777/workflow-on-signing-a-string-with-private-key-followed-by-signature-verificatio).

`,
    filter: {
      type: 'Identifier',
      name: 'ecrecover',
    },
  },
};

export default completions;
