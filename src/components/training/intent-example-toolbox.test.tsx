import React from 'react';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { fireEvent, screen } from '@testing-library/react';
import { IntentModel } from '../../model/intent.model';
import intentsReducer, { TrainingState } from '../../slices/training.slice';
import { render } from '../../utils/test.utils';
import IntentExampleToolbox from './intent-example-toolbox';
import { initialIntent, initialTrainingState } from '../../test-cs-initial-states';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const newResp = 'newResp';
let testStore: EnhancedStore;

const intent: IntentModel = { ...initialIntent };

const trainingState: TrainingState = initialTrainingState;

describe('Intent example toolbox component', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer: {
        training: intentsReducer,
      },
      preloadedState: {
        training: trainingState,
      },
    });
  });

  it('should render intent example toolbox', () => {
    render(
      <Provider store={testStore}>
        <IntentExampleToolbox selectedIntent={intent} />
      </Provider>,
    );
    screen.getByRole('button', { name: /intents.buttonLabel.addExample/i });
    screen.getByRole('button', { name: /intents.buttonLabel.removeIntent/i });
    screen.getByText(/intents.buttonLabel.changeResponse/i);
  });

  it('should render save response button when change response button is clicked and vice versa', () => {
    render(
      <Provider store={testStore}>
        <IntentExampleToolbox selectedIntent={intent} />
      </Provider>,
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /intents.buttonLabel.changeResponse/i,
      }),
    );
    screen.getByRole('button', { name: /intents.buttonLabel.saveResponse/i });
    fireEvent.change(screen.getByText(intent.response), { target: { value: newResp } });
    screen.getByText(newResp);
    fireEvent.click(
      screen.getByRole('button', {
        name: /intents.buttonLabel.saveResponse/i,
      }),
    );
    screen.getByRole('button', { name: /intents.buttonLabel.changeResponse/i });
  });
});
