import { GloballyVariableMap, GloballyVariables } from './common';
import abi from './abi';
import cryptographic from './cryptographic';
import statements from './statements';
import uints from './uints';
import variables from './variables';

// Mapping(keyword => GloballyVariable)
export const globallyMap: GloballyVariableMap = {
  ...abi,
  ...cryptographic,
  ...statements,
  ...uints,
  ...variables,
};

// List(GloballyVariable)
export const globallyList: GloballyVariables = Object.values(globallyMap);
