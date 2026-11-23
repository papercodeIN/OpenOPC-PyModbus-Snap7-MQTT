import { TMessage } from './message';

export type TMessageReceiverWithoutParams<Message extends TMessage['response']> = () => Message | Promise<Message>;
