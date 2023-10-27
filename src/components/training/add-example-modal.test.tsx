import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { render } from '../../utils/test.utils';
import trainingReducer, { TrainingState } from '../../slices/training.slice';
import chatsReducer, { ChatsState } from '../../slices/chats.slice';
import IntentExampleToolbox from './intent-example-toolbox';
import { initialChatsState, initialIntent, initialTrainingState } from '../../test-cs-initial-states';
import { IntentModel } from '../../model/intent.model';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

let testStore: EnhancedStore;

const intent: IntentModel = initialIntent;

const trainingState: TrainingState = { ...initialTrainingState, intents: [intent] };

const chatsState: ChatsState = initialChatsState;

describe('Add example modal component', () => {
  testStore = configureStore({
    reducer: {
      chats: chatsReducer,
      training: trainingReducer,
    },
    preloadedState: {
      chats: chatsState,
      training: trainingState,
    },
  });

  it('should render add example modal when add example button is clicked', () => {
    render(
      <Provider store={testStore}>
        <IntentExampleToolbox selectedIntent={intent} />
      </Provider>,
    );
    fireEvent.click(screen.getByText(/intents.buttonLabel.addExample/));
    screen.getByText(/addIntent.submitButton/);
    screen.getByText(/addIntent.cancelButton/);
  });

  it('should close modal when close button is clicked', () => {
    render(
      <Provider store={testStore}>
        <IntentExampleToolbox selectedIntent={intent} />
      </Provider>,
    );
    fireEvent.click(screen.getByRole('button', { name: /intents.buttonLabel.addExample/ }));
    screen.getByText(/addIntent.submitButton/);
    screen.getByText(/addIntent.cancelButton/);
    fireEvent.click(
      screen.getByRole('button', {
        name: /addIntent.cancelButton/i,
      }),
    );
    screen.getByRole('button', { name: /intents.buttonLabel.addExample/ });
  });

  it('should close modal when example value is present', () => {
    render(
      <Provider store={testStore}>
        <IntentExampleToolbox selectedIntent={intent} />
      </Provider>,
    );
    fireEvent.click(screen.getByRole('button', { name: /intents.buttonLabel.addExample/ }));
    fireEvent.change(screen.getByLabelText('addIntent.example'), { target: { value: 'example' } });
    fireEvent.click(
      screen.getByRole('button', {
        name: /addIntent.submitButton/i,
      }),
    );
    screen.getByRole('button', { name: /intents.buttonLabel.addExample/ });
  });
});
