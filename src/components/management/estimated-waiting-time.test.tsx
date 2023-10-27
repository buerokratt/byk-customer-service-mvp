import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render } from '../../utils/test.utils';
import adminsReducer from '../../slices/admins.slice';
import authReducer from '../../slices/authentication.slice';
import configurationReducer, { EstimatedWaiting } from '../../slices/configuration.slice';
import EstimatedWaitingTime from './estimated-waiting-time';
import EstimatedWaitingTimeService from '../../services/estimated-waiting-time.service';

jest.mock('../../services/http.service');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

let emptyStore: EnhancedStore;

function createEmptyStore() {
  return configureStore({
    reducer: {
      admins: adminsReducer,
      authentication: authReducer,
      configuration: configurationReducer,
    },
  });
}

describe('Estimated waiting time', () => {
  beforeEach(() => {
    emptyStore = createEmptyStore();
  });
  it('should render and call get request', () => {
    const result: EstimatedWaiting = { isActive: true, time: 10 };
    EstimatedWaitingTimeService.getEstimatedWaitingTime = jest.fn(() => Promise.resolve(result));
    render(
      <Provider store={emptyStore}>
        <EstimatedWaitingTime />
      </Provider>,
    );
    expect(EstimatedWaitingTimeService.getEstimatedWaitingTime).toHaveBeenCalled();
  });

  it('pressing submit will call setEstimatedWaitingTime', () => {
    const result: EstimatedWaiting = { isActive: true, time: 10 };
    EstimatedWaitingTimeService.getEstimatedWaitingTime = jest.fn(() => Promise.resolve(result));
    EstimatedWaitingTimeService.setEstimatedWaitingTime = jest.fn();
    render(
      <Provider store={emptyStore}>
        <EstimatedWaitingTime />
      </Provider>,
    );

    expect(EstimatedWaitingTimeService.getEstimatedWaitingTime).toHaveBeenCalled();
    fireEvent.click(
      screen.getByRole('button', {
        name: 'actions.save',
      }),
    );
    expect(EstimatedWaitingTimeService.setEstimatedWaitingTime).toHaveBeenCalled();
  });
});
