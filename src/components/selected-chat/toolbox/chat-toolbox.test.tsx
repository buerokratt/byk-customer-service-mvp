import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, screen, waitForElementToBeRemoved } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import ChatService from '../../../services/chat.service';
import adminsReducer from '../../../slices/admins.slice';
import authenticationReducer, { AuthenticationState } from '../../../slices/authentication.slice';
import chatsReducer, { ChatsState } from '../../../slices/chats.slice';
import { AUTHOR_ROLES, CHAT_STATUS, CHAT_TABS } from '../../../utils/constants';
import { render } from '../../../utils/test.utils';
import ChatToolbox from './chat-toolbox';
import { MessageModel } from '../../../model/message.model';
import { initialAuthenticationState, initialChatsState, initialSingleChatState } from '../../../test-cs-initial-states';

jest.mock('../../../services/chat.service');
jest.mock('../../../services/user.service');

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const selectedChat = initialSingleChatState;

const endChatInput: MessageModel = {
  chatId: '1',
  authorFirstName: 'admin',
  authorTimestamp: '2000-01-01T00:00:00.000Z',
  authorId: '1',
  authorRole: AUTHOR_ROLES.BACKOFFICE_USER,
};

const authenticationInitialState: AuthenticationState = initialAuthenticationState;

const chatsState: ChatsState = { ...initialChatsState, activeChats: [selectedChat], selectedChatId: '1', activeTab: CHAT_TABS.TAB_UNANSWERED };

let testStore: EnhancedStore;

describe('SelectedChatToolbox component', () => {
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
      },
    });
  });

  it('should render selected chat toolbox', () => {
    render(
      <Provider store={testStore}>
        <ChatToolbox />
      </Provider>,
    );
  });

  describe('terminate chat', () => {
    // NOTE: Tests uses same strings for two buttons; second index is for dialog display

    it('should open a modal when terminate chat button is pressed', async () => {
      render(
        <Provider store={testStore}>
          <ChatToolbox />
        </Provider>,
      );
      fireEvent.click(await screen.findByText('chatToolbox.action.terminate'));
      screen.getByText('chatToolbox.event.answered');
      screen.getByText('chatToolbox.event.terminated');
    });

    it('should terminate the chat successfully when the corresponding button is pressed', async () => {
      const endChatResponse = { id: '1', status: CHAT_STATUS.ENDED, created: '', updated: '', ended: '', lastMessage: '' };
      ChatService.endChat = jest.fn(() => Promise.resolve(endChatResponse));
      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2000-01-01T00:00:00.000Z');
      render(
        <Provider store={testStore}>
          <ChatToolbox />
        </Provider>,
      );

      fireEvent.click(await screen.findByText('chatToolbox.action.terminate'));
      fireEvent.click(screen.getByText('chatToolbox.event.answered'));

      await waitForElementToBeRemoved(() => screen.getAllByText('chatToolbox.action.terminate')[1]);
      const expectedQueryBody: MessageModel = { ...endChatInput, event: 'answered' };
      expect(ChatService.endChat).toHaveBeenCalledWith(expectedQueryBody);
      jest.restoreAllMocks();
    });

    it('should terminate the chat unsuccessfully when the corresponding button is pressed', async () => {
      const endChatResponse = { id: '1', status: CHAT_STATUS.OPEN, created: '', updated: '', ended: '', lastMessage: '' };
      ChatService.endChat = jest.fn(() => Promise.resolve(endChatResponse));
      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2000-01-01T00:00:00.000Z');

      render(
        <Provider store={testStore}>
          <ChatToolbox />
        </Provider>,
      );
      fireEvent.click(await screen.findByText('chatToolbox.action.terminate'));
      fireEvent.click(screen.getByText('chatToolbox.event.terminated'));

      await waitForElementToBeRemoved(() => screen.getAllByText('chatToolbox.action.terminate')[1]);
      const expectedQueryBody = { ...endChatInput, event: 'terminated' };

      expect(ChatService.endChat).toHaveBeenCalledWith(expectedQueryBody);
      jest.restoreAllMocks();
    });

    it('should send event message when the force authentication button is pressed', async () => {
      ChatService.postEventMessage = jest.fn(() => Promise.resolve());
      render(
        <Provider store={testStore}>
          <ChatToolbox />
        </Provider>,
      );
      fireEvent.click(await screen.findByText('chatToolbox.action.forceAuthenticate'));

      expect(ChatService.postEventMessage).toHaveBeenCalledTimes(1);
    });

    it('should send event message when the ask contacts information button is pressed', async () => {
      ChatService.postEventMessage = jest.fn(() => Promise.resolve());
      render(
        <Provider store={testStore}>
          <ChatToolbox />
        </Provider>,
      );
      fireEvent.click(await screen.findByText('chatToolbox.action.askContactInformation'));

      expect(ChatService.postEventMessage).toHaveBeenCalledTimes(1);
    });
  });
});
