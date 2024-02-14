import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat } from '../model/chat.model';
import { MessageModel } from '../model/message.model';
import { AskPermissionTimeoutModel } from '../model/ask-permission-timeout.model';
import ChatService from '../services/chat.service';
import MessagesService from '../services/messages.service';
import { CHAT_EVENTS, CHAT_STATUS, CHAT_TABS } from '../utils/constants';
import { findExistingMessageFromNewMessages, getNewMessagesAmount } from '../utils/stateManagementUtil';
import { RootState } from '../store';
import { ForwardRequestMessageModel } from '../model/forward-request-message.model';

export interface ChatsState {
  activeChats: Chat[];
  endedChats: Chat[];
  chatListLastUpdate: string;
  selectedChatId: string;
  selectedChatMessages: MessageModel[];
  matchingChatIds: string[];
  searchKey: string;
  lastReadMessageDate: string;
  activeTab: string;
  askPermissionTimeouts: AskPermissionTimeoutModel[];
  newMessagesAmount: number;
  successToast: string;
  archiveSuccessToast: string;
  errorToast: string;
}

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

const selectActiveChats = (state: RootState) => state.chats.activeChats;
const selectEndedChats = (state: RootState) => state.chats.endedChats;
const selectSelectedChatId = (state: RootState) => state.chats.selectedChatId;
const selectSelectedChatMessages = (state: RootState) => state.chats.selectedChatMessages;

let isActiveWindow = true;

const toggleIsActiveWindow = (): void => {
  isActiveWindow = !isActiveWindow;
};

window.addEventListener('blur', () => toggleIsActiveWindow());
window.addEventListener('focus', () => toggleIsActiveWindow());

export const selectActiveSelectedChat = createSelector([selectSelectedChatId, selectActiveChats], (selectedChatId, activeChats): Chat | undefined =>
  activeChats.find((chat: Chat) => chat.id === selectedChatId),
);

export const selectEndedSelectedChat = createSelector([selectSelectedChatId, selectEndedChats], (selectedChatId, endedChats): Chat | undefined =>
  endedChats.find((chat: Chat) => chat.id === selectedChatId),
);

export const selectSelectedChatLastMessage = createSelector(
  [selectSelectedChatMessages],
  (selectedChatMessages): MessageModel | undefined => selectedChatMessages.slice(-1)[0],
);

export const claimChat = createAsyncThunk(
  'chats/claimChat',
  async (args: { id: string; customerSupportDisplayName: string; customerSupportId: string; openClaimedChat: boolean }) => {
    const response = await ChatService.claimChat(args.id, args.customerSupportDisplayName, args.customerSupportId);
    return {
      chatId: response.id,
      csDisplayName: args.customerSupportDisplayName,
      customerSupportId: args.customerSupportId,
      openClaimedChat: args.openClaimedChat,
    };
  },
);

export const redirectChat = createAsyncThunk(
  'chats/redirectChat',
  async (args: { id: string; customerSupportDisplayName: string; customerSupportId: string; openRedirectedChat: boolean }) => {
    const response = await ChatService.redirectChat(args.id, args.customerSupportDisplayName, args.customerSupportId);
    return {
      chatId: response.id,
      csDisplayName: args.customerSupportDisplayName,
      customerSupportId: args.customerSupportId,
      openRedirectedChat: args.openRedirectedChat,
    };
  },
);

export const endChat = createAsyncThunk('chats/terminateChat', async (message: MessageModel) => ChatService.endChat(message));

export const postEventMessage = createAsyncThunk('chats/postEventMessage', async (message: MessageModel) => ChatService.postEventMessage(message));

export const postForwardRequest = createAsyncThunk('chats/postForwardRequest', async (message: ForwardRequestMessageModel) =>
  ChatService.postForwardRequest(message),
);

export const getMessages = createAsyncThunk('chats/getMessages', async (chatId: string) => MessagesService.getMessages(chatId));

export const getChatIdsMatchingMessageSearch = createAsyncThunk('chats/getChatIdsMatchingMessageSearch', async (searchKey: string) =>
  MessagesService.getChatIdsMatchingMessageSearch(searchKey),
);

export const sendMessage = createAsyncThunk('chats/sendMessage', async (message: MessageModel) => ChatService.sendMessage(message));

export const removeSupportFromChat = createAsyncThunk('chats/removeSupportFromChat', async (customerSupportId: string, thunkApi) => {
  const response = await ChatService.removeSupportFromChat(customerSupportId);
  thunkApi.dispatch(removeSupportFromActiveChats(customerSupportId));
  return response;
});

export const sendMessageWithNewEvent = createAsyncThunk('chats/sendMessageWithNewEvent', (message: MessageModel) =>
  ChatService.sendMessageWithNewEvent(message),
);

export const getEndedMessages = createAsyncThunk('chats/getAllEndedChats', async (isInitialLoad: boolean) => ChatService.getAllEndedChats());

export const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    addChat: (state, action: PayloadAction<Chat>) => {
      state.activeChats.push(action.payload);
    },
    addMessage: (state, action: PayloadAction<MessageModel>) => {
      state.selectedChatMessages.push(action.payload);
    },
    setArchiveSuccessToast: (state, action: PayloadAction<string>) => {
      state.archiveSuccessToast = action.payload;
    },
    clearActiveChat: (state) => {
      state.selectedChatId = '';
    },
    clearMessages: (state) => {
      state.selectedChatMessages = [];
    },
    resetNewMessagesAmount: (state) => {
      state.newMessagesAmount = 0;
    },
    removeSupportFromActiveChats: (state, action: PayloadAction<string>) => {
      state.activeChats = state.activeChats.map((chat: Chat) =>
        chat.customerSupportId === action.payload ? { ...chat, customerSupport: '', customerSupportId: '' } : chat,
      );
    },
    setSearchKey: (state, action: PayloadAction<string>) => {
      state.searchKey = action.payload;
    },
    setActiveChat: (state, action: PayloadAction<Chat>) => {
      state.selectedChatId = action.payload.id;
    },
    setLastReadTimestamp: (state, action: PayloadAction<{ chatId: string; lastRead: string }>) => {
      state.activeChats = state.activeChats.map((chat) => (chat.id === action.payload.chatId ? { ...chat, lastRead: action.payload.lastRead } : chat));
    },
    setActiveChatTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setActiveChats: (state, action: PayloadAction<{ customerSupportId: string; data: Chat[]; checkNewMessages: boolean }>) => {
      if ((!isActiveWindow || document.hidden) && action.payload.checkNewMessages) {
        state.newMessagesAmount = getNewMessagesAmount(state, action.payload.data, action.payload.customerSupportId);
      }
      state.activeChats = action.payload.data;
    },
    setEndedChats: (state, action: PayloadAction<Chat[]>) => {
      state.endedChats = action.payload;
    },
    addAskPermissionTimeout: (state, action: PayloadAction<AskPermissionTimeoutModel>) => {
      state.askPermissionTimeouts.push(action.payload);
    },
    removeAskPermissionTimeout: (state, action: PayloadAction<string>) => {
      state.askPermissionTimeouts = state.askPermissionTimeouts.filter((timeout) => timeout.chatId !== action.payload);
    },
    addNewMessages: (state, action: PayloadAction<MessageModel[]>) => {
      let receivedMessages = action.payload;
      const selectedChat = state.activeChats.find((chat: Chat) => chat.id === state.selectedChatId);
      if (receivedMessages) {
        state.selectedChatMessages = state.selectedChatMessages.map((existingMessage) => {
          const syncMessage = findExistingMessageFromNewMessages(existingMessage, receivedMessages);

          if (!syncMessage) return existingMessage;
          receivedMessages = receivedMessages.filter((rMsg) => rMsg.id !== syncMessage.id);

          return { ...existingMessage, id: syncMessage.id, created: syncMessage.created, updated: syncMessage.updated };
        });

        const terminationMsg = receivedMessages.find((msg) => msg.event === CHAT_EVENTS.CLIENT_LEFT);
        if (terminationMsg && selectedChat) {
          state.activeChats = state.activeChats.map((chat) => (chat.id === terminationMsg.chatId ? { ...chat, status: CHAT_STATUS.ENDED } : chat));
        }
        const askPermissionResponse = receivedMessages.find(
          (msg) => msg.event === CHAT_EVENTS.ASK_PERMISSION_ACCEPTED || msg.event === CHAT_EVENTS.ASK_PERMISSION_REJECTED,
        );
        if (askPermissionResponse) {
          state.selectedChatMessages = state.selectedChatMessages.map((msg) => (msg.id === askPermissionResponse.id ? askPermissionResponse : msg));
          receivedMessages = receivedMessages.filter((msg) => msg.id !== askPermissionResponse.id);
        }
        const contactInformationRejected = receivedMessages.find((msg) => msg.event === CHAT_EVENTS.CONTACT_INFORMATION_REJECTED);
        if (contactInformationRejected) {
          state.selectedChatMessages = state.selectedChatMessages.map((msg) =>
            msg.id === contactInformationRejected.id ? { ...msg, event: contactInformationRejected.event } : msg,
          );
          receivedMessages = receivedMessages.filter((msg) => msg.id !== contactInformationRejected.id);
        }

        state.selectedChatMessages.push(...receivedMessages);
      }
      state.lastReadMessageDate = state.selectedChatMessages[state.selectedChatMessages.length - 1]?.updated || state.lastReadMessageDate;
    },
    updateActiveChatMessage: (state, action: PayloadAction<MessageModel>) => {
      state.selectedChatMessages = state.selectedChatMessages.map((message) => (message.id === action.payload.id ? action.payload : message));
    },
    setErrorToastMessage: (state, action: PayloadAction<string>) => {
      state.errorToast = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(endChat.fulfilled, (state, action) => {
      state.activeChats = state.activeChats.filter((chat) => chat.id !== action.payload.id);
      state.endedChats.push(action.payload);
    });
    builder.addCase(claimChat.fulfilled, (state, action) => {
      const { chatId } = action.payload;

      state.activeChats = state.activeChats.map((chat) =>
        chat.id === chatId ? { ...chat, customerSupportDisplayName: action.payload.csDisplayName, customerSupportId: action.payload.customerSupportId } : chat,
      );
      if (action.payload.openClaimedChat) state.activeTab = CHAT_TABS.TAB_ANSWERED;
      else state.selectedChatId = '';
    });
    builder.addCase(redirectChat.fulfilled, (state, action) => {
      const { chatId } = action.payload;

      if (state.selectedChatId === chatId) {
        state.activeChats = state.activeChats.map((chat: Chat) =>
          chatId === state.selectedChatId
            ? {
                ...chat,
                customerSupportDisplayName: action.payload.csDisplayName,
                customerSupportId: action.payload.customerSupportId,
              }
            : chat,
        );
      }

      state.activeChats = state.activeChats.map((chat) =>
        chat.id === chatId ? { ...chat, customerSupportDisplayName: action.payload.csDisplayName, customerSupportId: action.payload.customerSupportId } : chat,
      );
      if (action.payload.openRedirectedChat) state.activeTab = CHAT_TABS.TAB_ANSWERED;
      else state.selectedChatId = '';
    });
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.selectedChatMessages = state.selectedChatMessages.map((msg) => (msg.id === action.payload.id ? { ...msg, id: action.payload.id } : msg));
    });
    builder.addCase(removeSupportFromChat.fulfilled, (state) => {
      state.selectedChatId = '';
      state.activeTab = CHAT_TABS.TAB_UNANSWERED;
    });
    builder.addCase(getMessages.fulfilled, (state, action) => {
      state.selectedChatMessages = action.payload;
      state.lastReadMessageDate = state.selectedChatMessages[state.selectedChatMessages.length - 1].updated || '';
    });
    builder.addCase(getChatIdsMatchingMessageSearch.fulfilled, (state, action) => {
      state.matchingChatIds = action.payload.map((result) => result.chatId);
    });
    builder.addCase(postForwardRequest.pending, (state) => {
      state.successToast = '';
    });
    builder.addCase(postForwardRequest.fulfilled, (state) => {
      state.successToast = 'chatToolbox.modal.forwardRequestSuccess';
    });
    builder.addCase(getEndedMessages.pending, (state) => {
      state.archiveSuccessToast = '';
      state.errorToast = '';
    });
    builder.addCase(getEndedMessages.fulfilled, (state, action) => {
      state.endedChats = action.payload;
      if (!action.meta.arg) {
        state.archiveSuccessToast = 'chatArchive.refreshSuccess';
      }
    });
  },
});

export const {
  addChat,
  addMessage,
  clearActiveChat,
  clearMessages,
  setSearchKey,
  setActiveChat,
  setLastReadTimestamp,
  setActiveChatTab,
  removeSupportFromActiveChats,
  resetNewMessagesAmount,
  setActiveChats,
  setEndedChats,
  addNewMessages,
  updateActiveChatMessage,
  addAskPermissionTimeout,
  setArchiveSuccessToast,
  removeAskPermissionTimeout,
  setErrorToastMessage,
} = chatsSlice.actions;

export default chatsSlice.reducer;
