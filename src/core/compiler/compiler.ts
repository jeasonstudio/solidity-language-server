import wrapper from 'solc/wrapper';
import { CompileError, CompileInput, CompileOption, CompileOutput } from './types';
import { createDebug } from '../common/debug';
import { documents } from '../common/text-documents';
const fallbackCompilerUrl = `https://binaries.soliditylang.org/wasm/soljson-v0.8.23+commit.f704f362.js`;

let compiler: any = null;
let compilerUrl: string = fallbackCompilerUrl;
const debug = createDebug('core:compiler');

export const importCompiler = async (url: string = fallbackCompilerUrl) => {
  compilerUrl = url;
  if (globalThis.importScripts !== undefined) {
    // WebWorker
    importScripts(compilerUrl);
    compiler = wrapper((<any>globalThis).Module);
  } else {
    // NodeWorker
    const compilerCode = await fetch(compilerUrl).then((res) => res.text());
    const soljson = require('require-from-string')(compilerCode);
    compiler = wrapper(soljson);
  }

  debug('compiler imported from', compilerUrl);
  return compiler;
};

export const getCompiler = async () => {
  if (!compiler) await importCompiler(compilerUrl);
  return compiler;
};

/**
 * Low-level function to compile a Solidity source code string.
 */
export const compile = (input: CompileInput, options?: CompileOption): CompileOutput => {
  try {
    const inputString = JSON.stringify(input);
    const outputString = compiler.compile(inputString, options);
    const output: CompileOutput = JSON.parse(outputString);
    return output;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const compileDocument = (uri: string, settings: CompileInput['settings']): CompileOutput => {
  if (!documents.has(uri)) throw new Error(`document ${uri} not found`);
  const document = documents.get(uri)!;
  const resolve = (toPath: string) => {
    try {
      const targetPath = document.resolvePath(toPath).toString(true);
      const contents = documents.get(targetPath)?.getText();
      if (!contents) throw new Error(`cannot load file from: ${targetPath}`);
      return { contents };
    } catch (error) {
      return { error: (error as any).message };
    }
  };
  return compile(
    {
      language: 'Solidity',
      sources: {
        [uri]: { content: document.getText() },
      },
      settings,
    },
    { import: resolve },
  );
};

export const validateDocument = (uri: string): CompileError[] => {
  const result = compileDocument(uri, {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
    optimizer: {
      enabled: false,
      runs: 200,
    },
  });
  return result?.errors || [];
};
