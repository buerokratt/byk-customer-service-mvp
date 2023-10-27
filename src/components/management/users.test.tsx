import React from 'react';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { fireEvent, screen } from '@testing-library/react';
import Users from './users';
import { render } from '../../utils/test.utils';
import adminsReducer, { AdminsState } from '../../slices/admins.slice';
import { User } from '../../model/user.model';
import { ROLES } from '../../utils/constants';

import UserService from '../../services/user.service';

const existingAmin: User = {
  login: 'login',
  firstName: 'firstName',
  lastName: 'lastName',
  idCode: 'idCode',
  displayName: 'displayName',
  authorities: [ROLES.ROLE_CHATBOT_TRAINER],
};
let createdStore: EnhancedStore;

const initialState: AdminsState = {
  admins: [existingAmin],
  selectedUser: null,
  availableConnections: [],
};

function createStore() {
  return configureStore({
    reducer: {
      admins: adminsReducer,
    },
    preloadedState: {
      admins: initialState,
    },
  });
}

describe('Users component', () => {
  beforeEach(() => {
    createdStore = createStore();
  });
  it('should render Users component', () => {
    render(<Users />);
  });

  it('should render a populated list', () => {
    render(
      <Provider store={createdStore}>
        <Users />
      </Provider>,
    );
    screen.getByText(existingAmin.displayName);
    screen.getByText(existingAmin.idCode);
    screen.getByText('vestlusroboti treener');
  });

  it('should send delete request, when deleting existing user', () => {
    UserService.deleteUser = jest.fn(() => Promise.resolve());
    render(
      <Provider store={createdStore}>
        <Users />
      </Provider>,
    );

    fireEvent.click(screen.getByTitle('kustuta kasutaja'));
    screen.getByText('jah');
    fireEvent.click(
      screen.getByRole('button', {
        name: /jah/i,
      }),
    );
    expect(UserService.deleteUser).toHaveBeenCalled();
  });
});
