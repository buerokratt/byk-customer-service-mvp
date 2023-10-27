import http from './http.service';
import { MessageModel } from '../model/message.model';

class MessagesService {
  getMessages(chatId: string): Promise<MessageModel[]> {
    return http.post('/cs-get-messages-by-chat-id', { chatId });
  }

  getNewMessages(chatId: string, lastRead: string): Promise<MessageModel[]> {
    return http.post('/cs-get-new-messages', { chatId, lastRead });
  }

  getChatIdsMatchingMessageSearch(searchKey: string): Promise<[{ chatId: string }]> {
    return http.post('/cs-get-chat-ids-matching-message-search', { searchKey });
  }
}

export default new MessagesService();
