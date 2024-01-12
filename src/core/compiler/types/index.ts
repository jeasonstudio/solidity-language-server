export * from './compile-error';
export * from './compile-input';
export * from './compile-output';

export type CompileImport = (uri: string) => { contents: string } | { error: string };
export type CompileOption = { import: CompileImport };
