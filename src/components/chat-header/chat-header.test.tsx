import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import AuthenticationService from '../../services/authentication.service';
import ChatService from '../../services/chat.service';
import adminsReducer from '../../slices/admins.slice';
import authenticationReducer, { AuthenticationState } from '../../slices/authentication.slice';
import chatsReducer, { ChatsState } from '../../slices/chats.slice';
import { CHAT_STATUS, CHAT_TABS } from '../../utils/constants';
import { render } from '../../utils/test.utils';
import ChatHeader from './chat-header';
import { initialAuthenticationState, initialChatsState, initialSingleChatState } from '../../test-cs-initial-states';
import { Chat } from '../../model/chat.model';

const selectedChat: Chat = initialSingleChatState;

const chatsState: ChatsState = { ...initialChatsState, endedChats: [selectedChat], selectedChatId: '1', activeTab: CHAT_TABS.TAB_UNANSWERED };

const authenticationState: AuthenticationState = {
  ...initialAuthenticationState,
  userLogin: 'Mihkel Maasikas',
  customerSupportId: '123456789',
};

const chatStateWithSelectedChat: ChatsState = { ...chatsState, activeChats: [selectedChat] };

let testStore: EnhancedStore;
let selectedChatStore: EnhancedStore;

describe('Chat header component', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer: {
        chats: chatsReducer,
        authentication: authenticationReducer,
        admins: adminsReducer,
      },
      preloadedState: {
        chats: chatsState,
      },
    });

    selectedChatStore = configureStore({
      reducer: {
        chats: chatsReducer,
        authentication: authenticationReducer,
        admins: adminsReducer,
      },
      preloadedState: {
        chats: chatStateWithSelectedChat,
        authentication: authenticationState,
      },
    });
  });
  it('should render', () => {
    render(
      <Provider store={testStore}>
        <ChatHeader />
      </Provider>,
    );

    screen.getByRole('button', { name: /vastamata/i });
    screen.getByRole('button', { name: /aktiivsed/i });
    screen.getByRole('button', { name: /ajalugu/i });
    screen.getByRole('button', {
      name: /eemal/i,
    });
  });

  it('should render claim & end buttons when a chat is selected', () => {
    render(
      <Provider store={selectedChatStore}>
        <ChatHeader />
      </Provider>,
    );
    screen.getByRole('button', { name: /võta üle/i });
    screen.getByRole('button', { name: /sulge vestlus/i });
  });

  it('should change agent status', () => {
    AuthenticationService.setCustomerSupportStatus = jest.fn(() => Promise.resolve([]));

    render(
      <Provider store={testStore}>
        <ChatHeader />
      </Provider>,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /eemal/i,
      }),
    );

    expect(AuthenticationService.setCustomerSupportStatus).toHaveBeenCalled();
  });

  it('claiming chat should call claimChat func', () => {
    ChatService.claimChat = jest.fn(() =>
      Promise.resolve({
        id: 'string',
        customerSupportDisplayName: '',
        customerSupportId: '',
        status: CHAT_STATUS.OPEN,
        created: '',
        updated: '',
        ended: '',
        lastMessage: '',
      }),
    );

    render(
      <Provider store={selectedChatStore}>
        <ChatHeader />
      </Provider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /võta üle/i }));
    expect(ChatService.claimChat).toHaveBeenCalled();
  });
});
