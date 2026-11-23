import { TMessage } from './message';
import { TMessageReceiverWithParams } from './message-receiver-with-params';
import { TMessageReceiverWithoutParams } from './message-receiver-without-params';
export type TMessageReceiver<Message extends TMessage> = Message['params'] extends undefined ? TMessageReceiverWithoutParams<Message['response']> : TMessageReceiverWithParams<Message['params'], Message['response']>;
//# sourceMappingURL=message-receiver.d.ts.map