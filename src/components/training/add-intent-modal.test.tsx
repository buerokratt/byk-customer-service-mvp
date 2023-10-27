import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { render } from '../../utils/test.utils';
import Training from '../../views/training/training';
import intentsReducer, { TrainingState } from '../../slices/training.slice';
import { CHAT_TABS, TRAINING_TABS } from '../../utils/constants';
import chatsReducer, { ChatsState } from '../../slices/chats.slice';
import { initialChatsState, initialTrainingState } from '../../test-cs-initial-states';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const intentName = 'test';
const response = '54321';
const example = 'example test';
let testStore: EnhancedStore;

const trainingState: TrainingState = {
  ...initialTrainingState,
  activeTab: TRAINING_TABS.INTENTS,
};

const chatsState: ChatsState = {
  ...initialChatsState,
  activeTab: CHAT_TABS.TAB_UNANSWERED,
  selectedChatId: '1',
};

describe('Add intent modal component', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer: {
        chats: chatsReducer,
        training: intentsReducer,
      },
      preloadedState: {
        chats: chatsState,
        training: trainingState,
      },
    });
  });

  it('should render modal with input values', () => {
    render(
      <Provider store={testStore}>
        <Training />
      </Provider>,
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /trainingHeader.addIntent/i,
      }),
    );
    screen.getByText(/addIntent.intentName/i);
    screen.getByText(/addIntent.response/i);
    screen.getByText(/addIntent.examples/i);
  });

  it('should minimize modal after clicking minimize button', () => {
    render(
      <Provider store={testStore}>
        <Training />
      </Provider>,
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /trainingHeader.addIntent/i,
      }),
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /close/i,
      }),
    );
    screen.getByRole('button', {
      name: /trainingHeader.addIntent/i,
    });
  });

  it('should not close modal when value is missing', () => {
    render(
      <Provider store={testStore}>
        <Training />
      </Provider>,
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /trainingHeader.addIntent/i,
      }),
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /addIntent.submitButton/i,
      }),
    );
    screen.getByRole('button', { name: /addIntent.submitButton/i });
  });

  it('should close modal when all values are present', () => {
    render(
      <Provider store={testStore}>
        <Training />
      </Provider>,
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /trainingHeader.addIntent/i,
      }),
    );
    fireEvent.change(screen.getByLabelText('addIntent.intentName'), { target: { value: intentName } });
    fireEvent.change(screen.getByLabelText('addIntent.response'), { target: { value: response } });
    fireEvent.change(screen.getByLabelText('addIntent.examples'), { target: { value: example } });
    fireEvent.click(
      screen.getByRole('button', {
        name: /addIntent.submitButton/i,
      }),
    );
    screen.getByRole('button', { name: /trainingHeader.addIntent/i });
  });

  it('should close modal when cancel button is clicked', () => {
    render(
      <Provider store={testStore}>
        <Training />
      </Provider>,
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /trainingHeader.addIntent/i,
      }),
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /addIntent.cancelButton/i,
      }),
    );
    screen.getByRole('button', { name: /trainingHeader.addIntent/i });
  });
});
