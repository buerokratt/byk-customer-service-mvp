import React from 'react';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { fireEvent, screen } from '@testing-library/react';
import { IntentModel } from '../../model/intent.model';
import intentsReducer, { TrainingState } from '../../slices/training.slice';
import { TRAINING_TABS } from '../../utils/constants';
import { render } from '../../utils/test.utils';
import IntentExampleListItem from './intent-example-list-item';
import { initialIntent, initialTrainingState } from '../../test-cs-initial-states';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const newExampleValue = 'newExampleValue';
let testStore: EnhancedStore;

const intent: IntentModel = initialIntent;

const example = 'exampleValue';

const trainingState: TrainingState = { ...initialTrainingState, examples: [example], intents: [intent], activeTab: TRAINING_TABS.INTENTS };

describe('Intent example list item component', () => {
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

  it('should render intent example list item', () => {
    render(
      <Provider store={testStore}>
        <IntentExampleListItem example={example} />
      </Provider>,
    );
    screen.getByRole('button', { name: /intents.buttonLabel.change/i });
    screen.getByText(example);
  });

  it('should render save and cancel buttons when change button is pressed', () => {
    render(
      <Provider store={testStore}>
        <IntentExampleListItem example={example} />
      </Provider>,
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /intents.buttonLabel.change/i,
      }),
    );
    screen.getByRole('button', { name: /intents.buttonLabel.save/i });
    screen.getByRole('button', { name: /intents.buttonLabel.cancel/i });
  });

  it('should render change button again when cancel button is clicked', () => {
    render(
      <Provider store={testStore}>
        <IntentExampleListItem example={example} />
      </Provider>,
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /intents.buttonLabel.change/i,
      }),
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /intents.buttonLabel.cancel/i,
      }),
    );
    screen.getByRole('button', {
      name: /intents.buttonLabel.change/i,
    });
  });

  it('should render change button again when save button is clicked', () => {
    render(
      <Provider store={testStore}>
        <IntentExampleListItem example={example} />
      </Provider>,
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /intents.buttonLabel.change/i,
      }),
    );
    fireEvent.change(screen.getByText(example), { target: { value: newExampleValue } });
    fireEvent.click(screen.getByText(newExampleValue));
    fireEvent.click(screen.getByRole('button', { name: /intents.buttonLabel.save/i }));
    screen.getByRole('button', { name: /intents.buttonLabel.change/i });
  });
});
