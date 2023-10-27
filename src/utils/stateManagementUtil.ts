import { DateTime } from 'luxon';
import { MessageModel } from '../model/message.model';
import { ChatsState } from '../slices/chats.slice';
import { Chat } from '../model/chat.model';

export const findExistingMessageFromNewMessages = (existingMessage: MessageModel, newMessages: MessageModel[]): MessageModel | undefined =>
  newMessages.find(
    (newMessage) =>
      newMessage.authorTimestamp?.trim() !== '' &&
      DateTime.fromISO(newMessage.authorTimestamp).toString() === DateTime.fromISO(existingMessage.authorTimestamp).toString() &&
      newMessage.authorRole === existingMessage.authorRole,
  );

export const getNewMessagesAmount = (state: ChatsState, chats: Chat[], customerSupportId: string): number => {
  let { newMessagesAmount } = state;
  chats.forEach((chat) => {
    const existingChat = state.activeChats.find((newChat) => newChat.id === chat.id);
    if (!existingChat) newMessagesAmount += 1;
    else if (
      existingChat.lastMessage !== chat.lastMessage &&
      existingChat.lastMessageTimestamp !== chat.lastMessageTimestamp &&
      existingChat.customerSupportId === customerSupportId
    ) {
      newMessagesAmount += 1;
    }
  });
  return newMessagesAmount;
};
