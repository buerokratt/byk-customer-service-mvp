import MessagesService from './messages.service';
import http from './http.service';

jest.mock('../services/http.service');

describe('Messages Service', () => {
  it('should make a request to /cs-get-messages-by-chat-id', () => {
    MessagesService.getMessages('123');
    expect(http.post).toHaveBeenCalledWith('/cs-get-messages-by-chat-id', { chatId: '123' });
  });

  it('should make a request to /cs-get-new-messages', () => {
    const lastRead = new Date().toISOString();
    MessagesService.getNewMessages('200', lastRead);
    expect(http.post).toHaveBeenCalledWith('/cs-get-new-messages', { chatId: '200', lastRead });
  });

  it('should make a request to /cs-get-chat-ids-matching-message-search', () => {
    MessagesService.getChatIdsMatchingMessageSearch('10');
    expect(http.post).toHaveBeenCalledWith('/cs-get-chat-ids-matching-message-search', { searchKey: '10' });
  });
});
