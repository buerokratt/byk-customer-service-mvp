import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render } from '../../utils/test.utils';
import adminsReducer from '../../slices/admins.slice';
import authReducer, { AuthenticationState } from '../../slices/authentication.slice';
import configurationReducer, { ConfigurationState } from '../../slices/configuration.slice';

import SessionLength from './session-length';
import AuthenticationService, { ConfigurationResult } from '../../services/authentication.service';

jest.mock('../../services/http.service');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const authenticationInitializedState: AuthenticationState = {
  isAuthenticated: false,
  authenticationFailed: false,
  userAuthorities: [],
  userLogin: '',
  isCustomerSupportActive: false,
  jwtExpirationTimestamp: '',
  customerSupportId: '',
};

const configurationInitializedState: ConfigurationState = {
  botConfig: { isActive: false, fetchingIsActive: false },
  greetingMessage: {
    isActive: false,
    eng: 'string',
    est: 'string',
  },
  isInitialGreetingMessage: false,
  needsUpdate: false,
  sessionLengthMinutes: 45,
  estimatedWaiting: {
    time: 10,
    isActive: true,
  },
};

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

function createStore() {
  return configureStore({
    reducer: {
      admins: adminsReducer,
      authentication: authReducer,
      configuration: configurationReducer,
    },
    preloadedState: {
      authentication: authenticationInitializedState,
      configuration: configurationInitializedState,
    },
  });
}

describe('Session length', () => {
  beforeEach(() => {
    emptyStore = createEmptyStore();
  });
  it('should render and call get request', () => {
    const result: ConfigurationResult[] = [{ id: 1, name: 'string', value: 'string', deleted: false }];
    AuthenticationService.getSessionLength = jest.fn(() => Promise.resolve(result));
    render(
      <Provider store={emptyStore}>
        <SessionLength />
      </Provider>,
    );
    expect(AuthenticationService.getSessionLength).toHaveBeenCalled();
  });

  it('pressing submit will call setSessionLength', () => {
    const result: ConfigurationResult[] = [{ id: 1, name: 'string', value: 'string', deleted: false }];
    AuthenticationService.getSessionLength = jest.fn(() => Promise.resolve(result));
    AuthenticationService.setSessionLength = jest.fn();
    render(
      <Provider store={emptyStore}>
        <SessionLength />
      </Provider>,
    );

    expect(AuthenticationService.getSessionLength).toHaveBeenCalled();
    fireEvent.click(
      screen.getByRole('button', {
        name: 'actions.save',
      }),
    );
    expect(AuthenticationService.setSessionLength).toHaveBeenCalled();
  });

  it('should not call get request, if session length value exists', () => {
    AuthenticationService.getSessionLength = jest.fn();
    const store = createStore();
    render(
      <Provider store={store}>
        <SessionLength />
      </Provider>,
    );
    expect(AuthenticationService.getSessionLength).not.toHaveBeenCalled();
  });
});
