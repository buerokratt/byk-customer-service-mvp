import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render } from '../../utils/test.utils';
import Training from './training';
import chatsReducer from '../../slices/chats.slice';
import authenticationReducer from '../../slices/authentication.slice';
import adminsReducer from '../../slices/admins.slice';
import intentsReducer, { TrainingState } from '../../slices/training.slice';
import { TRAINING_TABS } from '../../utils/constants';

jest.mock('../../services/sse.service', () => ({
  __esModule: true,
  default: () => ({
    onMessage: () => null,
  }),
}));

let testStore: EnhancedStore;

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

describe('Training view', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer: {
        chats: chatsReducer,
        authentication: authenticationReducer,
        admins: adminsReducer,
        training: intentsReducer,
      },
      preloadedState: {
        training: trainingState,
      },
    });
  });

  it('renders training', () => {
    render(
      <Provider store={testStore}>
        <Training />
      </Provider>,
    );
  });

  it('renders tab button and table headers', async () => {
    render(
      <Provider store={testStore}>
        <Training />
      </Provider>,
    );
    await screen.findByText('ajalugu');
    fireEvent.click(screen.getByText('ajalugu'));
    screen.getByRole('columnheader', {
      name: /algusaeg/i,
    });
    screen.getByRole('columnheader', {
      name: /lõppaeg/i,
    });
    screen.getByRole('columnheader', {
      name: /nõustaja nimi/i,
    });
    screen.getByRole('columnheader', {
      name: /tulemus/i,
    });
  });
});
