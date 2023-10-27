import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../../../utils/test.utils';
import ForwardChatModal from './forward-chat-modal';
import { CHAT_TABS, ROLES } from '../../../../utils/constants';
import authenticationReducer, { AuthenticationState } from '../../../../slices/authentication.slice';
import chatsReducer, { ChatsState } from '../../../../slices/chats.slice';
import adminsReducer, { AdminsState } from '../../../../slices/admins.slice';
import { Chat } from '../../../../model/chat.model';
import { User } from '../../../../model/user.model';
import UserService from '../../../../services/user.service';
import ChatService from '../../../../services/chat.service';
import { initialAdminState, initialAuthenticationState, initialChatsState, initialSingleChatState, initialUsers } from '../../../../test-cs-initial-states';

jest.mock('../../../../services/chat.service');
jest.mock('../../../../services/user.service');

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

let testStore: EnhancedStore;

const selectedChat: Chat = initialSingleChatState;

const authenticationInitialState: AuthenticationState = {
  ...initialAuthenticationState,
  jwtExpirationTimestamp: '2023-01-27T09:39:26.922Z',
  userAuthorities: [ROLES.ROLE_CUSTOMER_SUPPORT_AGENT, ROLES.ROLE_ADMINISTRATOR],
  userLogin: 'traitor',
};

const supportAgents: User[] = initialUsers;

const adminsInitialState: AdminsState = {
  ...initialAdminState,
  admins: [...supportAgents, { idCode: '4321', displayName: 'manager', authorities: [ROLES.ROLE_SERVICE_MANAGER] }],
};

const chatsState: ChatsState = { ...initialChatsState, activeTab: CHAT_TABS.TAB_UNANSWERED, activeChats: [selectedChat] };

describe('ForwardChatModal', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer: {
        chats: chatsReducer,
        authentication: authenticationReducer,
        admins: adminsReducer,
      },
      preloadedState: {
        chats: chatsState,
        authentication: authenticationInitialState,
        admins: adminsInitialState,
      },
    });

    UserService.findAllCustomerSupportAgents = jest.fn(() => Promise.resolve(supportAgents));
  });

  it('should render forward chat modal', () => {
    render(
      <Provider store={testStore}>
        <ForwardChatModal chat={selectedChat} afterForwardAction={() => null} displayModal clearSelectedChatAfterForward={false} />
      </Provider>,
    );
  });

  it('should forward chat to selected user', () => {
    render(
      <Provider store={testStore}>
        <ForwardChatModal chat={selectedChat} afterForwardAction={() => ChatService.getAllActiveChats()} displayModal clearSelectedChatAfterForward={false} />
      </Provider>,
    );

    fireEvent.click(screen.getAllByTitle('forwardUser.buttonTitle')[0]);
    expect(ChatService.redirectChat).toHaveBeenCalledWith(selectedChat.id, 'user_1', 'userId1');
    expect(ChatService.getAllActiveChats).toHaveBeenCalled();
  });
});
