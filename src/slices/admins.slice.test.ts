import reducer, { AdminsState, clearSelectedUser, setSelectedUser } from './admins.slice';
import { User } from '../model/user.model';

jest.mock('../services/chat.service');

const initialState: AdminsState = {
  admins: [],
  selectedUser: null,
  availableConnections: [],
};

const user: User = {
  login: 'string',
  firstName: 'string',
  lastName: 'string',
  idCode: 'string',
  displayName: 'string',
  authorities: [],
};

const selectedState: AdminsState = {
  admins: [],
  availableConnections: [],
  selectedUser: user,
};

describe('Chats', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle a user being selected', () => {
    const previousState = { ...initialState };
    expect(reducer(previousState, setSelectedUser(user))).toEqual({
      ...initialState,
      selectedUser: user,
    });
  });

  it('should handle a user being cleared from selected state', () => {
    expect(reducer(selectedState, clearSelectedUser())).toEqual({
      ...initialState,
      selectedUser: null,
    });
  });
});
