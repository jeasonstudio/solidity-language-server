import { createDebug } from '../common/debug';
import { Connection } from 'vscode-languageserver';
import { Context } from '../context';

const debug = createDebug('core:onExit');
type OnExit = Parameters<Connection['onExit']>[0];

export const onExit =
  (_ctx: Context): OnExit =>
  () => {
    debug('exited');
  };
