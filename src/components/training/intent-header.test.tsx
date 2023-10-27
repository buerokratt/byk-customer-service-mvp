import React from 'react';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { screen } from '@testing-library/react';
import { IntentModel } from '../../model/intent.model';
import intentsReducer, { TrainingState } from '../../slices/training.slice';
import { render } from '../../utils/test.utils';
import IntentHeader from './intent-header';
import { initialIntent, initialTrainingState } from '../../test-cs-initial-states';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

let testStore: EnhancedStore;

const intent: IntentModel = initialIntent;
const trainingState: TrainingState = initialTrainingState;

describe('Intent header component', () => {
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

  it('should render intent header', () => {
    render(
      <Provider store={testStore}>
        <IntentHeader selectedIntent={intent} displayMetaData />
      </Provider>,
    );
    screen.getByText(intent.name);
    screen.getByText(/intentListItem.name/i);
    screen.getByText(/intentListItem.examples/i);
    screen.getByText(/intentListItem.inModel/i);
  });
});
