import http from './http.service';
import ChatService from './chat.service';
import { MessageModel } from '../model/message.model';
import { AUTHOR_ROLES, RUUTER_ENDPOINTS } from '../utils/constants';

jest.mock('../services/http.service');

const message: MessageModel = {
  id: '1',
  chatId: '2',
  authorFirstName: '3',
  authorTimestamp: '4',
  authorRole: AUTHOR_ROLES.BACKOFFICE_USER,
};

describe('Chat Service', () => {
  it('should make a request to /cs-get-all-active-chats', () => {
    ChatService.getAllActiveChats();
    expect(http.post).toHaveBeenCalledWith(RUUTER_ENDPOINTS.GET_ALL_ACTIVE_CHATS);
  });

  it('should make a request to /cs-get-all-ended-chats', () => {
    ChatService.getAllEndedChats();
    expect(http.post).toHaveBeenCalledWith(RUUTER_ENDPOINTS.GET_ALL_ENDED_CHATS);
  });

  it('should make a request to /cs-claim-chat', () => {
    ChatService.claimChat('100', 'Tegelane', '123');
    expect(http.post).toHaveBeenCalledWith(RUUTER_ENDPOINTS.CLAIM_CHAT, { id: '100', customerSupportDisplayName: 'Tegelane', customerSupportId: '123' });
  });

  it('should make a request to /cs-redirect-chat', () => {
    ChatService.redirectChat('100', 'admin', '1');
    expect(http.post).toHaveBeenCalledWith(RUUTER_ENDPOINTS.REDIRECT_CHAT, { id: '100', customerSupportDisplayName: 'admin', customerSupportId: '1' });
  });

  it('should make make a request to /cs-end-chat', () => {
    const answeredMessage = { ...message, event: 'answered' };
    ChatService.endChat(answeredMessage);
    expect(http.post).toHaveBeenCalledWith(RUUTER_ENDPOINTS.END_CHAT, answeredMessage);
  });

  it('should make make a request to /cs-post-message', () => {
    ChatService.sendMessage(message);
    expect(http.post).toHaveBeenCalledWith(RUUTER_ENDPOINTS.POST_MESSAGE, message);
  });

  it('should make a request to /cs-post-event-message', () => {
    ChatService.postEventMessage(message);
    expect(http.post).toHaveBeenCalledWith(RUUTER_ENDPOINTS.POST_EVENT_MESSAGE, message);
  });

  it('should make a request to /cs-remove-attached-chats', () => {
    ChatService.removeSupportFromChat('10');
    expect(http.post).toHaveBeenCalledWith(RUUTER_ENDPOINTS.REMOVE_ATTACHED_CHATS, { customerSupportId: '10' });
  });

  it('should make a request to /cs-post-message-with-new-event', () => {
    ChatService.sendMessageWithNewEvent(message);
    expect(http.post).toHaveBeenCalledWith(RUUTER_ENDPOINTS.POST_MESSAGE_WITH_NEW_EVENT, message);
  });
});
