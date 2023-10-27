import React from 'react';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { DateTime } from 'luxon';
import { fireEvent, screen } from '@testing-library/react';
import { addLocale } from 'primereact/api';
import { render } from '../../utils/test.utils';
import intentsReducer, { TrainingState } from '../../slices/training.slice';
import { TRAINING_STATUSES } from '../../utils/constants';
import TrainingCommands from './training-commands';
import TrainingService from '../../services/training.service';
import { initialTrainingState } from '../../test-cs-initial-states';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

let testStore: EnhancedStore;

const trainingState: TrainingState = initialTrainingState;

describe('Training commands component', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer: {
        training: intentsReducer,
      },
      preloadedState: {
        training: trainingState,
      },
    });

    addLocale('et', {
      firstDayOfWeek: 1,
      dayNames: ['esmaspäev', 'teisipäev', 'kolmapäev', 'neljapäev', 'reede', 'laupäev', 'pühapäev'],
      dayNamesShort: ['es', 'te', 'ko', 'ne', 're', 'la', 'pü'],
      dayNamesMin: ['E', 'T', 'K', 'N', 'R', 'L', 'P'],
      monthNames: ['jaanuar', 'veebruar', 'märts', 'aprill', 'mai', 'juuni', 'juuli', 'august', 'september', 'oktoober', 'november', 'detsember'],
      monthNamesShort: ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'det'],
      today: 'Täna',
      clear: 'Tühjenda',
    });
  });

  it('should render training commands', async () => {
    TrainingService.getTrainingMetaData = jest.fn(() => Promise.resolve({ areTrainingResultsPositive: true, isBotTraining: false }));

    render(
      <Provider store={testStore}>
        <TrainingCommands />
      </Provider>,
    );

    await screen.findByText(/trainingCommands.label/);
    screen.getByRole('button', { name: /trainingCommands.publishButton/ });
  });

  it('should show that bot is training when train now button is clicked', async () => {
    TrainingService.getTrainingMetaData = jest.fn(() => Promise.resolve({ areTrainingResultsPositive: true, isBotTraining: false }));
    TrainingService.trainModel = jest.fn(() => Promise.resolve(TRAINING_STATUSES.BOT_IS_TRAINING));

    render(
      <Provider store={testStore}>
        <TrainingCommands />
      </Provider>,
    );
    await screen.findByText(/trainingCommands.label/);
    screen.getByRole('button', { name: /trainingCommands.publishButton/ });
    fireEvent.click(screen.getByRole('button', { name: /trainingCommands.trainNow/ }));

    const formattedDate = DateTime.fromISO(new Date().toISOString()).setLocale('et').toLocaleString(DateTime.DATETIME_MED);
    await screen.findByText(`trainingCommands.inTraining ${formattedDate}`);
  });
});
