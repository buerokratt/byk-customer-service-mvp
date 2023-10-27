import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import ChatToolbox from '../chat-toolbox';
import chatsReducer, { ChatsState } from '../../../../slices/chats.slice';
import authenticationReducer from '../../../../slices/authentication.slice';
import adminsReducer from '../../../../slices/admins.slice';
import { CHAT_TABS } from '../../../../utils/constants';
import { initialAdminState, initialAuthenticationState, initialChatsState, initialMessages, initialSingleChatState } from '../../../../test-cs-initial-states';
import ChatService from '../../../../services/chat.service';

let testStore: EnhancedStore;

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const chatsState: ChatsState = {
  ...initialChatsState,
  activeTab: CHAT_TABS.TAB_UNANSWERED,
  selectedChatId: '1',
  selectedChatMessages: initialMessages,
  activeChats: [initialSingleChatState],
};

const modalSetup = () => {
  ChatService.postForwardRequest = jest.fn(() => Promise.resolve());
  window._env_.INSTITUTION_FORWARDING_ENABLED = true;

  render(
    <Provider store={testStore}>
      <ChatToolbox />
    </Provider>,
  );
  fireEvent.click(screen.getByText(/chatToolbox.action.forwardInstitution/));
  const { parentElement } = screen.getByText('chatToolbox.modal.institutionsToForwardLabel');
  fireEvent.click(within(parentElement as HTMLElement).getByRole('button'));
};

describe('Forward chat to institution modal component', () => {
  testStore = configureStore({
    reducer: {
      chats: chatsReducer,
      authentication: authenticationReducer,
      admins: adminsReducer,
    },
    preloadedState: {
      chats: chatsState,
      authentication: initialAuthenticationState,
      admins: initialAdminState,
    },
  });

  it('should render modal', () => {
    window._env_.INSTITUTION_FORWARDING_ENABLED = true;
    render(
      <Provider store={testStore}>
        <ChatToolbox />
      </Provider>,
    );
    fireEvent.click(screen.getByText(/chatToolbox.action.forwardInstitution/));
    screen.getByText(/chatToolbox.modal.forwardButtonLabel/);
    screen.getByText(/chatToolbox.modal.cancelButtonLabel/);
    screen.getByText(/chatToolbox.modal.messagesToForwardLabel/);
  });

  it('selecting messages and endpoint should send forward request', () => {
    modalSetup();
    fireEvent.click(screen.getByText('connection 1'));
    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    fireEvent.click(screen.getByText('chatToolbox.modal.forwardButtonLabel'));

    expect(ChatService.postForwardRequest).toHaveBeenCalled();
  });

  it('not selecting messages should not send forward request', () => {
    modalSetup();
    fireEvent.click(screen.getByText('connection 1'));
    fireEvent.click(screen.getByText('chatToolbox.modal.forwardButtonLabel'));

    expect(ChatService.postForwardRequest).not.toHaveBeenCalled();
  });

  it('not selecting endpoint should not send forward request', () => {
    modalSetup();
    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    fireEvent.click(screen.getByText('chatToolbox.modal.forwardButtonLabel'));

    expect(ChatService.postForwardRequest).not.toHaveBeenCalled();
  });
});
