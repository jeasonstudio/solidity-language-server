import type { Context } from './context';
import type { Connection } from 'vscode-languageserver';

export type OnDefinition = (ctx: Context) => Parameters<Connection['onDefinition']>[0];
export type OnHover = Parameters<Connection['onHover']>[0];
export type OnDocumentFormatting = Parameters<Connection['onDocumentFormatting']>[0];
export type OnExit = Parameters<Connection['onExit']>[0];
export type OnInitialize = Parameters<Connection['onInitialize']>[0];
export type OnInitialized = Parameters<Connection['onInitialized']>[0];
export type OnDocumentSymbol = Parameters<Connection['onDocumentSymbol']>[0];
