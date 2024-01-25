import http from './http.service';
import { Chat } from '../model/chat.model';
import { MessageModel } from '../model/message.model';
import { RUUTER_ENDPOINTS } from '../utils/constants';
import { ForwardRequestMessageModel } from '../model/forward-request-message.model';

class ChatService {
  getAllActiveChats(): Promise<Chat[]> {
    return http.post(RUUTER_ENDPOINTS.GET_ALL_ACTIVE_CHATS);
  }

  getActiveChats(): Promise<Chat[]> {
    return http.get(RUUTER_ENDPOINTS.GET_ACTIVE_CHATS);
  }
  
  getAllEndedChats(): Promise<Chat[]> {
    return http.post(RUUTER_ENDPOINTS.GET_ALL_ENDED_CHATS);
  }

  claimChat(id: string, customerSupportDisplayName: string | undefined, customerSupportId: string | undefined): Promise<Chat> {
    return http.post(RUUTER_ENDPOINTS.CLAIM_CHAT, { id, customerSupportDisplayName, customerSupportId });
  }

  redirectChat(id: string, customerSupportDisplayName: string | undefined, customerSupportId: string | undefined): Promise<Chat> {
    return http.post(RUUTER_ENDPOINTS.REDIRECT_CHAT, { id, customerSupportDisplayName, customerSupportId });
  }

  endChat(message: MessageModel): Promise<Chat> {
    return http.post(RUUTER_ENDPOINTS.END_CHAT, message);
  }

  sendMessage(message: MessageModel): Promise<Chat> {
    return http.post(RUUTER_ENDPOINTS.POST_MESSAGE, message);
  }

  postEventMessage(message: MessageModel): Promise<void> {
    return http.post(RUUTER_ENDPOINTS.POST_EVENT_MESSAGE, message);
  }

  postForwardRequest(message: ForwardRequestMessageModel): Promise<void> {
    return http.post(RUUTER_ENDPOINTS.POST_FORWARD_REQUEST, message);
  }

  removeSupportFromChat(customerSupportId: string): Promise<Chat> {
    return http.post(RUUTER_ENDPOINTS.REMOVE_ATTACHED_CHATS, { customerSupportId });
  }

  sendMessageWithNewEvent(message: MessageModel): Promise<void> {
    return http.post(RUUTER_ENDPOINTS.POST_MESSAGE_WITH_NEW_EVENT, message);
  }
}

export default new ChatService();
