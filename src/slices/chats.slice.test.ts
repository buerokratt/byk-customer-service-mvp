import { Chat } from '../model/chat.model';
import reducer, {
  addChat,
  addMessage,
  ChatsState,
  clearActiveChat,
  clearMessages,
  getChatIdsMatchingMessageSearch,
  getMessages,
  removeSupportFromActiveChats,
  removeSupportFromChat,
  resetNewMessagesAmount,
  setActiveChat,
  setActiveChatTab,
  setLastReadTimestamp,
  setSearchKey,
  updateActiveChatMessage,
} from './chats.slice';
import { MessageModel } from '../model/message.model';
import { AUTHOR_ROLES, CHAT_EVENTS, CHAT_STATUS, CHAT_TABS } from '../utils/constants';

jest.mock('../services/chat.service');

const initialState: ChatsState = {
  activeChats: [],
  endedChats: [],
  chatListLastUpdate: '',
  selectedChatId: '',
  selectedChatMessages: [],
  matchingChatIds: [],
  searchKey: '',
  lastReadMessageDate: '',
  activeTab: CHAT_TABS.TAB_UNANSWERED,
  askPermissionTimeouts: [],
  newMessagesAmount: 0,
  successToast: '',
  archiveSuccessToast: '',
  errorToast: '',
};

const initialChat: Chat = {
  id: '300',
  endUserOs: 'Android',
  endUserUrl: 'https://www.ttja.ee/',
  lastMessage: 'mingi sõnum',
  status: CHAT_STATUS.OPEN,
  created: '2022-01-05T14:04:30.610Z',
  ended: '',
  customerSupportId: 'EE60001019906',
  updated: '',
};

const activeChatState: ChatsState = {
  ...initialState,
  activeChats: [initialChat],
  selectedChatId: '300',
  selectedChatMessages: [{ chatId: '300', authorTimestamp: '123', authorFirstName: 'Inquisitive Person', authorRole: AUTHOR_ROLES.BACKOFFICE_USER }],
};

const addableChat: Chat = { ...initialChat, id: '100', lastMessage: 'Eelviimane tähtis sõnum' };
const addedChat: Chat = { ...initialChat, id: '202', lastMessage: 'Viimane' };

describe('All chats slice', () => {
  describe('Chats', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, { type: undefined })).toEqual(initialState);
    });

    it('should handle a chat being added to an empty list', () => {
      const previousState = { ...initialState };
      expect(reducer(previousState, addChat(addableChat))).toEqual({
        ...initialState,
        activeChats: [addableChat],
      });
    });

    it('should handle a chat being added to an existing list', () => {
      const previousState = { ...initialState, activeChats: [addedChat] };
      expect(reducer(previousState, addChat(addableChat))).toEqual({
        ...initialState,
        activeChats: [addedChat, addableChat],
      });
    });

    it('should select a chat', () => {
      expect(reducer(initialState, setActiveChat(addableChat))).toEqual({
        ...initialState,
        selectedChatId: '100',
      });
    });

    it('should clear selected chat', () => {
      expect(reducer(activeChatState, clearActiveChat())).toEqual({
        ...activeChatState,
        selectedChatId: '',
      });
    });

    it('should set last read timestamp', () => {
      const activeChatId = '300';
      const lastRead = 'eile';

      expect(reducer(activeChatState, setLastReadTimestamp({ chatId: activeChatId, lastRead }))).toEqual({
        ...activeChatState,
        activeChats: [{ ...initialChat, lastRead }],
      });
    });

    it('should filter chats with customer support', () => {
      const list = reducer(activeChatState, removeSupportFromActiveChats('EE60001019906'));
      expect(list.activeChats[0].customerSupportId).toEqual('');
    });

    it('should set active chat', () => {
      const previousState = { ...initialState };
      expect(reducer(previousState, setActiveChatTab('TAB_ARCHIVE'))).toEqual({
        ...initialState,
        activeTab: 'TAB_ARCHIVE',
      });
    });

    it('should set search key', () => {
      expect(reducer({ ...initialState, searchKey: '1' }, setSearchKey('2'))).toEqual({
        ...initialState,
        searchKey: '2',
      });
    });
  });

  describe('Messages', () => {
    it('should handle a message being added to an empty chat', () => {
      const newMessage: MessageModel = {
        chatId: '',
        authorFirstName: '',
        authorTimestamp: '',
        authorRole: AUTHOR_ROLES.BACKOFFICE_USER,
        id: '5',
        content: 'Tervitus!',
      };

      expect(reducer(initialState, addMessage(newMessage))).toEqual({
        ...initialState,
        selectedChatMessages: [newMessage],
      });
    });

    it('should handle a message being added to an ongoing chat', () => {
      const existingMessage: MessageModel = {
        chatId: '',
        authorFirstName: '',
        authorTimestamp: '',
        authorRole: AUTHOR_ROLES.BACKOFFICE_USER,
        id: '1',
        content: 'Tervitus!',
      };
      const newMessage: MessageModel = {
        chatId: '',
        authorFirstName: '',
        authorTimestamp: '',
        authorRole: AUTHOR_ROLES.BACKOFFICE_USER,
        id: '2',
        content: 'Vastus!',
      };

      const state = { ...initialState, selectedChatMessages: [...initialState.selectedChatMessages, existingMessage] };
      expect(reducer(state, addMessage(newMessage))).toEqual({
        ...initialState,
        selectedChatMessages: [existingMessage, newMessage],
      });
    });

    it('should clear selected chat messages', () => {
      expect(reducer(activeChatState, clearMessages())).toEqual({
        ...activeChatState,
        selectedChatMessages: [],
      });
    });

    it('should reset newMessageAmount', () => {
      const previousState = { ...initialState, newMessagesAmount: 2 };
      expect(reducer(previousState, resetNewMessagesAmount())).toEqual({
        ...initialState,
        newMessagesAmount: 0,
      });
    });

    it('should update active chat message', () => {
      const message = {
        id: '1',
        chatId: '2',
        content: 'hei',
        event: CHAT_EVENTS.ASK_PERMISSION,
        authorTimestamp: '',
        authorFirstName: '',
        authorRole: AUTHOR_ROLES.BACKOFFICE_USER,
      };
      const previousState = { ...initialState, selectedChatMessages: [message] };
      const updatedMessage = { ...message, event: CHAT_EVENTS.ASK_PERMISSION_ACCEPTED };
      expect(reducer(previousState, updateActiveChatMessage(updatedMessage))).toEqual({
        ...initialState,
        selectedChatMessages: [updatedMessage],
      });
    });
  });

  describe('extra reducers', () => {
    it('should set active tab unanswered when removeSupportFromChat is fulfilled', () => {
      const action = { type: removeSupportFromChat.fulfilled.type };
      const state = reducer({ ...initialState, selectedChatId: '1', activeTab: CHAT_TABS.TAB_ANSWERED }, action);
      expect(state).toEqual({ ...initialState, selectedChatId: '', activeTab: CHAT_TABS.TAB_UNANSWERED });
    });

    it('should set selected chat messages when getMessages is fulfilled', () => {
      const message = { id: '1', chatId: '3', authorTimestamp: '', authorFirstName: '', authorRole: '', updated: '10' };
      const action = { type: getMessages.fulfilled.type, payload: [message] };
      const state = reducer(initialState, action);
      expect(state).toEqual({ ...initialState, lastReadMessageDate: message.updated, selectedChatMessages: [message] });
    });

    it('should set matching chat ids when getChatIdsMatchingMessageSearch is fulfilled', () => {
      const message = { id: '1', chatId: '3', authorTimestamp: '', authorFirstName: '', authorRole: '' };
      const action = { type: getChatIdsMatchingMessageSearch.fulfilled.type, payload: [message] };
      const state = reducer(initialState, action);
      expect(state).toEqual({ ...initialState, matchingChatIds: [message.chatId] });
    });
  });
});
