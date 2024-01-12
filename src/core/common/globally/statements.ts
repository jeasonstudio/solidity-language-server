import { GloballyVariableMap, CompletionItemKind } from './common';

const url =
  'https://docs.soliditylang.org/en/v0.8.23/units-and-global-variables.html#error-handling';

// mapping(keyword => GloballyVariableMap)
const completions: GloballyVariableMap = {
  assert: {
    label: 'assert',
    kind: CompletionItemKind.Function,
    detail: 'assert(bool condition)',
    url,
    documentation:
      'causes a Panic error and thus state change reversion if the condition is not met - to be used for internal errors.',
    filter: {
      type: 'Identifier',
      name: 'assert',
    },
  },
  require: {
    label: 'require',
    kind: CompletionItemKind.Function,
    detail: 'require(bool condition, string memory message)',
    url,
    documentation:
      'reverts if the condition is not met - to be used for errors in inputs or external components.',
    filter: {
      type: 'Identifier',
      name: 'require',
    },
  },
  revert: {
    label: 'revert',
    kind: CompletionItemKind.Function,
    detail: 'revert(string memory reason)',
    url,
    documentation: 'abort execution and revert state changes, providing an explanatory string',
    filter: {
      type: 'Identifier',
      name: 'revert',
    },
  },
};

export default completions;
