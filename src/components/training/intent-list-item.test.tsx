import React from 'react';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../utils/test.utils';
import IntentListItem from './intent-list-item';
import { IntentModel } from '../../model/intent.model';
import intentsReducer, { TrainingState } from '../../slices/training.slice';
import { initialIntent, initialTrainingState } from '../../test-cs-initial-states';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

let testStore: EnhancedStore;

const intent: IntentModel = initialIntent;

const trainingState: TrainingState = initialTrainingState;

describe('Intent list item component', () => {
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

  it('should render intent list item', () => {
    render(
      <Provider store={testStore}>
        <IntentListItem intent={intent} />
      </Provider>,
    );
    screen.getByRole('button', { name: /intentListItem.openIntent/i });
    screen.getByText(intent.name);
  });

  it('should not display open intent button after it has been clicked', () => {
    render(
      <Provider store={testStore}>
        <IntentListItem intent={intent} />
      </Provider>,
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /intentListItem.openIntent/i,
      }),
    );
    expect(testStore.getState().training.selectedIntentName).toEqual(intent.name);
  });
});
