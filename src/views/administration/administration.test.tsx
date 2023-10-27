import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, screen } from '@testing-library/react';
import UserService from '../../services/user.service';
import adminsReducer from '../../slices/admins.slice';
import authenticationReducer from '../../slices/authentication.slice';
import chatsReducer from '../../slices/chats.slice';
import configurationReducer, { ConfigurationState } from '../../slices/configuration.slice';
import { ROLES } from '../../utils/constants';
import { render } from '../../utils/test.utils';
import Administration from './administration';

jest.mock('../../services/chat.service');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

let store: EnhancedStore;

const configurationState: ConfigurationState = {
  greetingMessage: {
    isActive: false,
    eng: '',
    est: '',
  },
  isInitialGreetingMessage: true,
  needsUpdate: true,
  sessionLengthMinutes: 0,
  estimatedWaiting: {
    isActive: false,
    time: 0,
  },
  botConfig: {
    isActive: false,
    fetchingIsActive: true,
  },
};

function createTestStore() {
  return configureStore({
    reducer: {
      chats: chatsReducer,
      authentication: authenticationReducer,
      admins: adminsReducer,
      configuration: configurationReducer,
    },
    preloadedState: {
      configuration: configurationState,
    },
  });
}

describe('Administrator view', () => {
  beforeEach(() => {
    store = createTestStore();
  });

  it('should render administrators', () => {
    const admins = [{ login: 'Test', firstName: 'first', lastName: 'null', idCode: '1', displayName: 'Test', authorities: [ROLES.ROLE_CHATBOT_TRAINER] }];
    UserService.findAllUsers = jest.fn(() => Promise.resolve(admins));
    render(
      <Provider store={store}>
        <Administration />
      </Provider>,
    );
  });

  it('should set active tab BOT and back to USERS', () => {
    render(
      <Provider store={store}>
        <Administration />
      </Provider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'administrate.bot.menuLabel' }));
    screen.getByText('administrate.bot.isActiveDescription');

    fireEvent.click(screen.getByRole('button', { name: 'administrate.users' }));
    screen.getByRole('button', { name: 'addUser.modalTitle' });
  });

  it('should set active tab GREETING', () => {
    render(
      <Provider store={store}>
        <Administration />
      </Provider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'administrate.greeting' }));
    screen.getByText('administrate.greetingMessage');
  });

  it('should set active tab SESSION', () => {
    render(
      <Provider store={store}>
        <Administration />
      </Provider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'administrate.sessionLength' }));
    screen.getByText('administrate.sessionLengthTitle');
  });

  it('should set active tab WAITING_TIME', () => {
    render(
      <Provider store={store}>
        <Administration />
      </Provider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'administrate.estimatedWaitingTime' }));
    screen.getByText('administrate.estimatedWaitingTimeTitle');
  });
});
