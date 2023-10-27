import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, screen } from '@testing-library/react';
import adminsReducer from '../../slices/admins.slice';
import authenticationReducer from '../../slices/authentication.slice';
import chatsReducer, { ChatsState } from '../../slices/chats.slice';
import { TRAINING_TABS } from '../../utils/constants';
import { render } from '../../utils/test.utils';
import TrainingHeader from './training-header';
import intentsReducer, { TrainingState } from '../../slices/training.slice';
import { IntentModel } from '../../model/intent.model';
import { Chat } from '../../model/chat.model';
import { initialChatsState, initialIntent, initialSingleChatState, initialTrainingState } from '../../test-cs-initial-states';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const intent: IntentModel = initialIntent;

const chat: Chat = { ...initialSingleChatState, id: '2' };

const chatsState: ChatsState = { ...initialChatsState, endedChats: [chat], selectedChatId: '2' };

const trainingState: TrainingState = { ...initialTrainingState, activeTab: TRAINING_TABS.ARCHIVE, intents: [intent], selectedIntentName: '1' };

let testStore: EnhancedStore;

describe('Training header component', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer: {
        chats: chatsReducer,
        authentication: authenticationReducer,
        admins: adminsReducer,
        training: intentsReducer,
      },
      preloadedState: {
        chats: chatsState,
        training: trainingState,
      },
    });
  });

  it('should clear current selected intent id', () => {
    render(
      <Provider store={testStore}>
        <TrainingHeader />
      </Provider>,
    );
    expect(testStore.getState().training.selectedIntentName).toEqual('1');
    fireEvent.click(screen.getByRole('button', { name: /trainingHeader.closeIntent/i }));
    expect(testStore.getState().training.selectedIntentName).toEqual('');
  });

  it('should set new active tab', () => {
    render(
      <Provider store={testStore}>
        <TrainingHeader />
      </Provider>,
    );
    expect(testStore.getState().training.activeTab).toEqual(TRAINING_TABS.ARCHIVE);
    fireEvent.click(screen.getByRole('button', { name: /trainingHeader.intents/i }));
    expect(testStore.getState().training.activeTab).toEqual(TRAINING_TABS.INTENTS);
  });

  it('should clear current selected chat id', () => {
    render(
      <Provider store={testStore}>
        <TrainingHeader />
      </Provider>,
    );
    expect(testStore.getState().chats.selectedChatId).toEqual('2');
    fireEvent.click(screen.getByRole('button', { name: /trainingHeader.closeChat/i }));
    expect(testStore.getState().chats.selectedChatId).toEqual('');
  });
});
