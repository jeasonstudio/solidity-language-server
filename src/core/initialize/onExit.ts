import { createDebug } from '../common/debug';
import { Context, OnExit } from '../context';

const debug = createDebug('core:onExit');

export const onExit =
  (_ctx: Context): OnExit =>
  () => {
    debug('exited');
  };
