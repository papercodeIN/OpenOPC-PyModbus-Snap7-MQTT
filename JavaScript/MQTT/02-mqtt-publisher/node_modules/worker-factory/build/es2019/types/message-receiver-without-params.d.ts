import { TMessage } from './message';
export type TMessageReceiverWithoutParams<Message extends TMessage['response']> = () => Message | Promise<Message>;
//# sourceMappingURL=message-receiver-without-params.d.ts.map