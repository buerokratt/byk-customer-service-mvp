import React from 'react';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render } from '../../utils/test.utils';
import IntentList from './intent-list';
import intentsReducer, { TrainingState } from '../../slices/training.slice';
import { initialTrainingState } from '../../test-cs-initial-states';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

let testStore: EnhancedStore;

const trainingState: TrainingState = initialTrainingState;

describe('Intent list component', () => {
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

  it('should render intentList', () => {
    render(
      <Provider store={testStore}>
        <IntentList />
      </Provider>,
    );
  });
});
