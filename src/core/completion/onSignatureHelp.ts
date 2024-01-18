import { FunctionCall } from '../common/parser';
import { createDebug } from '../common/debug';
import { OnSignatureHelp } from '../context';
import { globallyList } from '../common/globally';
import { markup, markupSolidity } from '../common/utils';
import { CompletionItemKind, SignatureHelp } from 'vscode-languageserver';
import { matches } from 'lodash-es';

const debug = createDebug('server:onSignatureHelp');

export const onSignatureHelp: OnSignatureHelp =
  (ctx) =>
  async ({ textDocument, position, context: signatureCtx }) => {
    const document = ctx.documents.get(textDocument.uri);
    if (!document) return null;
    debug('onSignatureHelp:', textDocument.uri, signatureCtx);

    // TODO: Trigger by command not supported yet
    // if (signatureCtx?.triggerKind === SignatureHelpTriggerKind.Invoked) return null;

    if (signatureCtx?.isRetrigger && signatureCtx?.activeSignatureHelp) {
      const activeParameter = signatureCtx?.activeSignatureHelp?.activeParameter ?? 0;
      const parametersLength =
        signatureCtx?.activeSignatureHelp?.signatures[
          signatureCtx?.activeSignatureHelp?.activeSignature ?? 0
        ]?.parameters?.length ?? 0;
      const signatureHelp = {
        ...signatureCtx.activeSignatureHelp,
        activeSignature: 0,
        activeParameter: Math.min(
          parametersLength,
          signatureCtx.triggerCharacter === ',' ? activeParameter + 1 : activeParameter,
        ),
      };
      return signatureHelp;
    }

    const offset = document.offsetAt(position);
    const path = document.getNodeAt<FunctionCall>(position, ['FunctionCall']);
    if (!path) return null;

    // get current parameter active index
    let argumentIndex = 0;
    path.node.arguments?.forEach((arg, index) => {
      if (offset >= arg.range[0]) argumentIndex = index;
    });

    const globallyItem = globallyList.find((item) => {
      if (item.kind !== CompletionItemKind.Method && item.kind !== CompletionItemKind.Function)
        return false; // should be method or Function
      if (!item.filter || !item.parameters?.length) return false; // should have signatures
      return matches(item.filter)(path.node.expression);
    });

    if (globallyItem) {
      const signatureHelp: SignatureHelp = {
        activeSignature: 0,
        activeParameter: argumentIndex >= 0 ? argumentIndex : 0,
        signatures: [
          {
            label: globallyItem.detail,
            documentation: markup(globallyItem.documentation),
            parameters: globallyItem.parameters!.map((param) => ({
              label: param,
              documentation: markupSolidity(param),
            })),
          },
        ],
      };
      return signatureHelp;
    }
    return null;
  };
