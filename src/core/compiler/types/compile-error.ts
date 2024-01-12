export interface CompileError {
  // Optional: Location within the source file.
  sourceLocation?: {
    file: string;
    start: number;
    end: number;
  };
  // Optional: Further locations (e.g. places of conflicting declarations)
  secondarySourceLocations?: {
    file: string;
    start: number;
    end: number;
    message: string;
  }[];
  // Mandatory: Error type, such as "TypeError", "InternalCompilerError", "Exception", etc.
  // See below for complete list of types.
  type:
    | 'JSONError'
    | 'IOError'
    | 'ParserError'
    | 'DocstringParsingError'
    | 'SyntaxError'
    | 'DeclarationError'
    | 'TypeError'
    | 'UnimplementedFeatureError'
    | 'InternalCompilerError'
    | 'Exception'
    | 'CompilerError'
    | 'FatalError'
    | 'YulException'
    | 'Warning'
    | 'Info';
  // Mandatory: Component where the error originated, such as "general", "ewasm", etc.
  component: 'general' | 'ewasm' | string;
  // Mandatory ("error", "warning" or "info", but please note that this may be extended in the future)
  severity: 'error' | 'warning' | 'info' | string;
  // Optional: unique code for the cause of the error
  errorCode: string;
  // Mandatory
  message: string;
  // Optional: the message formatted with source location
  formattedMessage?: string;
}
