import wrapper from 'solc/wrapper';
import { CompileInput, CompileOutput } from './types';
import { createDebug } from '../common/debug';
const fallbackCompilerUrl = `https://binaries.soliditylang.org/wasm/soljson-v0.8.23+commit.f704f362.js`;

let compiler: any = null;
let compilerUrl: string = fallbackCompilerUrl;
const debug = createDebug('core:compiler');

export const importCompiler = (url: string = fallbackCompilerUrl) => {
  compilerUrl = url;
  importScripts(compilerUrl);
  debug('compiler imported from', compilerUrl);
  compiler = wrapper((<any>globalThis).Module);
  return compiler;
};

export const getCompiler = () => {
  if (!compiler) importCompiler(compilerUrl);
  return compiler;
};

/**
 * Low-level function to compile a Solidity source code string.
 */
export const compile = (input: CompileInput): CompileOutput => {
  try {
    const inputString = JSON.stringify(input);
    const outputString = compiler.compile(inputString);
    const output: CompileOutput = JSON.parse(outputString);
    return output;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
