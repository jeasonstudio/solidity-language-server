import { createDebug } from '../common/debug';
import { Context, OnInitialized } from '../context';

const debug = createDebug('core:onInitialized');

export const onInitialized =
  (_ctx: Context): OnInitialized =>
  async () => {
    debug('successfully initialized');
  };
