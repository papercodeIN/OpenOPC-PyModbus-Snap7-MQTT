import { TMessage } from './message';
export type TMessageReceiverWithParams<Params extends TMessage['params'], Response extends TMessage['response']> = (params: Params) => Response | Promise<Response>;
//# sourceMappingURL=message-receiver-with-params.d.ts.map