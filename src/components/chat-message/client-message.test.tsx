import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import ClientMessage from './client-message';
import { TRAINING_TABS } from '../../utils/constants';
import trainingReducer, { TrainingState } from '../../slices/training.slice';

const mockMessage = {
  est: 'Hello World',
};

let store: EnhancedStore;

describe('Client message component', () => {
  const trainingState: TrainingState = {
    areLatestTestResultsPositive: false,
    assignedTrainingDate: '',
    blacklistedIntentNames: [],
    fetchingIsBotTraining: false,
    intentResponseUpdating: false,
    isTraining: false,
    publishingModel: false,
    successToast: '',
    warningToast: '',
    intents: [],
    selectedIntentName: '',
    examples: [],
    selectedExample: '',
    activeTab: TRAINING_TABS.INTENTS,
    intentsLoading: false,
    examplesLoading: false,
  };

  store = configureStore({
    reducer: {
      training: trainingReducer,
    },
    preloadedState: {
      training: trainingState,
    },
  });

  it('renders message text', () => {
    render(
      <Provider store={store}>
        <ClientMessage message={mockMessage.est} />
      </Provider>,
    );
    const contentRegex = new RegExp(mockMessage.est, 'i');
    screen.getByText(contentRegex);
  });
});
