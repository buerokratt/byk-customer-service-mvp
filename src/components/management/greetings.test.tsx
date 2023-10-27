import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../utils/test.utils';
import Greetings from './greetings';
import chatsReducer from '../../slices/chats.slice';
import authenticationReducer from '../../slices/authentication.slice';
import adminsReducer from '../../slices/admins.slice';
import GreetingService from '../../services/greeting.service';
import configurationReducer, { ConfigurationState } from '../../slices/configuration.slice';
import { initialConfiguration } from '../../test-cs-initial-states';

jest.mock('../../services/greeting.service');
jest.mock('../../services/chat.service');
jest.mock('../../services/http.service');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));
let emptyStore: EnhancedStore;
let createdStore: EnhancedStore;

const createdGreeting: ConfigurationState = {
  ...initialConfiguration,
  greetingMessage: {
    isActive: false,
    eng: 'eng',
    est: 'est',
  },
  isInitialGreetingMessage: false,
};

function createEmptyStore() {
  return configureStore({
    reducer: {
      chats: chatsReducer,
      authentication: authenticationReducer,
      admins: adminsReducer,
      configuration: configurationReducer,
    },
  });
}

function createStore() {
  return configureStore({
    reducer: {
      chats: chatsReducer,
      authentication: authenticationReducer,
      admins: adminsReducer,
      configuration: configurationReducer,
    },
    preloadedState: {
      configuration: createdGreeting,
    },
  });
}

describe('greeting component', () => {
  beforeEach(() => {
    emptyStore = createEmptyStore();
    createdStore = createStore();
    GreetingService.getGreetingMessage = jest.fn(() => Promise.resolve({ isActive: false, est: '', eng: '' }));
  });
  it('renders input field and buttons', () => {
    render(
      <Provider store={emptyStore}>
        <Greetings />
      </Provider>,
    );
  });

  it('displays already entered input', () => {
    render(
      <Provider store={emptyStore}>
        <Greetings />
      </Provider>,
    );
    fireEvent.change(screen.getByPlaceholderText('administrate.estGreetingInputPlaceholder'), { target: { value: 'tere' } });
    screen.getByDisplayValue('tere');
  });

  it('clicking change state calls http request', () => {
    GreetingService.setIsGreetingActive = jest.fn(() => Promise.resolve('tere'));
    render(
      <Provider store={createdStore}>
        <Greetings />
      </Provider>,
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /administrate.enabledLabel/i,
      }),
    );
    expect(GreetingService.setIsGreetingActive).toHaveBeenCalled();
  });

  it('submitting new value calls http request', () => {
    GreetingService.setGreetingMessage = jest.fn(() => Promise.resolve('tere'));
    render(
      <Provider store={emptyStore}>
        <Greetings />
      </Provider>,
    );
    fireEvent.change(screen.getByPlaceholderText('administrate.estGreetingInputPlaceholder'), { target: { value: 'tere' } });
    fireEvent.click(screen.getByText('actions.save'));
    expect(GreetingService.setGreetingMessage).toHaveBeenCalled();
  });
});
