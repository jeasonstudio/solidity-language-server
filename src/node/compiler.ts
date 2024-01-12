import { ProposedFeatures, createConnection } from 'vscode-languageserver/node';
import { listen } from '../core/language-compiler';

const connection = createConnection(ProposedFeatures.all);
listen(connection);
