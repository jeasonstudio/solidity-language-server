import { GloballyVariableMap, CompletionItemKind, GloballyVariable } from './common';

// mapping(keyword => GloballyVariableMap)
const completions: GloballyVariableMap = Object.fromEntries(
  ['wei', 'gwei', 'ether', 'seconds', 'minutes', 'hours', 'days', 'weeks'].map((label) => [
    label,
    {
      label,
      kind: CompletionItemKind.Keyword,
      detail: label,
      documentation: label,
      url: 'https://docs.soliditylang.org/en/v0.8.23/units-and-global-variables.html',
      filter: { type: 'NumberLiteral', subDenomination: label },
    } as GloballyVariable,
  ]),
);

export default completions;
