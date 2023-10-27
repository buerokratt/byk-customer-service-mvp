import React from 'react';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { screen } from '@testing-library/react';
import { IntentModel } from '../../model/intent.model';
import intentsReducer, { TrainingState } from '../../slices/training.slice';
import { TRAINING_TABS } from '../../utils/constants';
import { render } from '../../utils/test.utils';
import IntentExampleList from './intent-example-list';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

let testStore: EnhancedStore;

const intent: IntentModel = {
  name: 'test',
  description: 'desc',
  response: '',
  examples: [],
  inModel: '.yml',
};

const trainingState: TrainingState = {
  areLatestTestResultsPositive: false,
  assignedTrainingDate: '',
  blacklistedIntentNames: [],
  fetchingIsBotTraining: false,
  isTraining: false,
  publishingModel: false,
  warningToast: '',
  intents: [intent],
  selectedIntentName: 'test',
  examples: ['exampleValue'],
  selectedExample: '',
  activeTab: TRAINING_TABS.INTENTS,
  intentsLoading: false,
  examplesLoading: false,
  successToast: '',
  intentResponseUpdating: false,
};

describe('Intent example list component', () => {
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
  it('should render intent example list', () => {
    render(
      <Provider store={testStore}>
        <IntentExampleList examples={['exampleValue']} />
      </Provider>,
    );
    screen.getByRole('button', { name: /intents.buttonLabel.change/i });
    screen.getByText('exampleValue');
  });
});
