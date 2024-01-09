import cd from 'debug';

export const createDebug = (namespace?: string) => cd(`remax:${namespace ?? 'default'}`);

export const enableDebug = (namespace?: string) => cd.enable(`remax:${namespace ?? 'default'}`);
