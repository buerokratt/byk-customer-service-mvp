import { MessageModel } from './message.model';

export interface ForwardRequestMessageModel extends Omit<MessageModel, 'content'> {
  content: {
    selectedMessageIds: string[];
    institution: string;
  };
}
