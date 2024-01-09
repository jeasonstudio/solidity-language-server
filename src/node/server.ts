import { ProposedFeatures, createConnection } from 'vscode-languageserver/node';
import { listen } from '../core/connection';

const connection = createConnection(ProposedFeatures.all);
listen(connection);
