import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import Training from '../../views/training/training';
import trainingReducer, { TrainingState } from '../../slices/training.slice';
import { AUTHOR_ROLES, CHAT_STATUS, CHAT_TABS, TRAINING_TABS } from '../../utils/constants';
import chatsReducer, { ChatsState } from '../../slices/chats.slice';
import authenticationReducer, { AuthenticationState } from '../../slices/authentication.slice';
import { initialAuthenticationState, initialChatsState, initialSingleChatState, initialTrainingState } from '../../test-cs-initial-states';

jest.mock('../../services/sse.service', () => ({
  __esModule: true,
  default: () => ({
    onMessage: () => null,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const chat = { ...initialSingleChatState, status: CHAT_STATUS.ENDED, lastMessage: 'Hello world' };

const message = {
  id: '2',
  chatId: '1',
  content: 'Hello world',
  authorTimestamp: '1',
  authorFirstName: 'author',
  authorRole: AUTHOR_ROLES.END_USER,
};

let store: EnhancedStore;
const authenticationState: AuthenticationState = { ...initialAuthenticationState };
const trainingState: TrainingState = {
  ...initialTrainingState,
  activeTab: TRAINING_TABS.ARCHIVE,
};
const chatsState: ChatsState = {
  ...initialChatsState,
  endedChats: [chat],
  selectedChatMessages: [message],
  activeTab: CHAT_TABS.TAB_UNANSWERED,
};
describe('Marking options component', () => {
  store = configureStore({
    reducer: {
      chats: chatsReducer,
      training: trainingReducer,
      authentication: authenticationReducer,
    },
    preloadedState: {
      chats: chatsState,
      training: trainingState,
      authentication: authenticationState,
    },
  });

  it('should render create intent and add example buttons when client message is clicked', () => {
    render(
      <Provider store={store}>
        <Training />
      </Provider>,
    );
    fireEvent.click(screen.getByText(/chatArchive.openChat/));
    fireEvent.click(screen.getByText(chat.lastMessage));
    screen.getByText(/intents.buttonLabel.createIntent/);
    screen.getByText(/intents.buttonLabel.addAsExample/);
  });
});
