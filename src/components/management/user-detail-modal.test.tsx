import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import UserService from '../../services/user.service';
import adminsReducer from '../../slices/admins.slice';
import { render } from '../../utils/test.utils';
import Administration from '../../views/administration/administration';

jest.mock('../../services/http.service');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const displayName = 'Mari Maasikas';
const tooLongDisplayName = 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
const userIdCode = 'EE60001019906';
const genericResponse: unknown[] = [];
let emptyStore: EnhancedStore;

function createEmptyStore() {
  return configureStore({
    reducer: {
      admins: adminsReducer,
    },
  });
}

describe('Add user component', () => {
  it('should render Add user button', () => {
    render(<Administration />);
    screen.getByRole('button', {
      name: /addUser.modalTitle/i,
    });
  });

  it('should render modal with input values', () => {
    render(<Administration />);
    fireEvent.click(
      screen.getByRole('button', {
        name: /addUser.modalTitle/i,
      }),
    );
    screen.getByLabelText('addUser.displayNamePlaceholder');
    screen.getByLabelText('addUser.idCodePlaceholder');
    screen.getByText('addUser.rolePlaceholder');
  });

  it('should minimize modal after clicking minimize button', () => {
    UserService.addUser = jest.fn(() => Promise.resolve(genericResponse));

    render(<Administration />);
    fireEvent.click(
      screen.getByRole('button', {
        name: /addUser.modalTitle/i,
      }),
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: /close/i,
      }),
    );
    screen.getByRole('button', {
      name: /addUser.modalTitle/i,
    });
  });
  it('should not send a http request when a value is missing', () => {
    const addUserResponse: unknown[] = [];
    UserService.addUser = jest.fn(() => Promise.resolve(addUserResponse));
    render(<Administration />);
    fireEvent.click(
      screen.getByRole('button', {
        name: /addUser.modalTitle/i,
      }),
    );

    fireEvent.change(screen.getByLabelText('addUser.displayNamePlaceholder'), { target: { value: displayName } });
    fireEvent.change(screen.getByLabelText('addUser.idCodePlaceholder'), { target: { value: userIdCode } });

    expect(screen.getByLabelText('addUser.displayNamePlaceholder')).toHaveProperty('value', displayName);
    expect(screen.getByLabelText('addUser.idCodePlaceholder')).toHaveProperty('value', userIdCode);

    fireEvent.click(screen.getByRole('button', { name: /addUser.submitButton/i }));
    expect(UserService.addUser).not.toBeCalled();
  });

  it('should not send a http request when displayName is too long', () => {
    UserService.addUser = jest.fn(() => Promise.resolve(genericResponse));
    render(<Administration />);

    fireEvent.click(screen.getByRole('button', { name: /addUser.modalTitle/i }));
    fireEvent.change(screen.getByLabelText('addUser.displayNamePlaceholder'), { target: { value: tooLongDisplayName } });
    fireEvent.change(screen.getByLabelText('addUser.idCodePlaceholder'), { target: { value: 'EE60001019906' } });
    fireEvent.click(screen.getByRole('listbox', { name: '' }));
    fireEvent.click(screen.getByText('roles.chatbotTrainer'));
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(UserService.addUser).not.toHaveBeenCalled();
  });

  it('should not send a http request when prefix is missing from id code', () => {
    UserService.addUser = jest.fn(() => Promise.resolve(genericResponse));
    render(<Administration />);

    fireEvent.click(screen.getByRole('button', { name: /addUser.modalTitle/i }));
    fireEvent.change(screen.getByLabelText('addUser.displayNamePlaceholder'), { target: { value: displayName } });
    fireEvent.change(screen.getByLabelText('addUser.idCodePlaceholder'), { target: { value: '60001019906' } });
    fireEvent.click(screen.getByRole('listbox', { name: '' }));
    fireEvent.click(screen.getByText('roles.chatbotTrainer'));
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(UserService.addUser).not.toHaveBeenCalled();
  });

  it('should not send a http request when the id code length is wrong', () => {
    UserService.addUser = jest.fn(() => Promise.resolve(genericResponse));
    render(<Administration />);

    fireEvent.click(screen.getByRole('button', { name: /addUser.modalTitle/i }));
    fireEvent.change(screen.getByLabelText('addUser.displayNamePlaceholder'), { target: { value: displayName } });
    fireEvent.change(screen.getByLabelText('addUser.idCodePlaceholder'), { target: { value: 'EE6000101990' } });
    fireEvent.click(screen.getByRole('listbox', { name: '' }));
    fireEvent.click(screen.getByText('roles.chatbotTrainer'));
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(UserService.addUser).not.toHaveBeenCalled();
  });

  it('should not send a http request when the id code has other characters than numbers', () => {
    UserService.addUser = jest.fn(() => Promise.resolve(genericResponse));
    render(<Administration />);

    fireEvent.click(screen.getByRole('button', { name: /addUser.modalTitle/i }));
    fireEvent.change(screen.getByLabelText('addUser.displayNamePlaceholder'), { target: { value: displayName } });
    fireEvent.change(screen.getByLabelText('addUser.idCodePlaceholder'), { target: { value: 'EE60001s19906' } });
    fireEvent.click(screen.getByRole('listbox', { name: '' }));
    fireEvent.click(screen.getByText('roles.chatbotTrainer'));
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(UserService.addUser).not.toHaveBeenCalled();
  });

  it('should not send a http request with wrong sex number', () => {
    UserService.addUser = jest.fn(() => Promise.resolve(genericResponse));
    render(<Administration />);

    fireEvent.click(screen.getByRole('button', { name: /addUser.modalTitle/i }));
    fireEvent.change(screen.getByLabelText('addUser.displayNamePlaceholder'), { target: { value: displayName } });
    fireEvent.change(screen.getByLabelText('addUser.idCodePlaceholder'), { target: { value: 'EE70001019906' } });
    fireEvent.click(screen.getByRole('listbox', { name: '' }));
    fireEvent.click(screen.getByText('roles.chatbotTrainer'));
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(UserService.addUser).not.toHaveBeenCalled();
  });

  it('should not send a http request with wrong day number', () => {
    UserService.addUser = jest.fn(() => Promise.resolve(genericResponse));
    render(<Administration />);

    fireEvent.click(screen.getByRole('button', { name: /addUser.modalTitle/i }));
    fireEvent.change(screen.getByLabelText('addUser.displayNamePlaceholder'), { target: { value: displayName } });
    fireEvent.change(screen.getByLabelText('addUser.idCodePlaceholder'), { target: { value: 'EE60001329906' } });
    fireEvent.click(screen.getByRole('listbox', { name: '' }));
    fireEvent.click(screen.getByText('roles.chatbotTrainer'));
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(UserService.addUser).not.toHaveBeenCalled();
  });

  it('should not send a http request with wrong month number', () => {
    UserService.addUser = jest.fn(() => Promise.resolve(genericResponse));
    render(<Administration />);

    fireEvent.click(screen.getByRole('button', { name: /addUser.modalTitle/i }));
    fireEvent.change(screen.getByLabelText('addUser.displayNamePlaceholder'), { target: { value: displayName } });
    fireEvent.change(screen.getByLabelText('addUser.idCodePlaceholder'), { target: { value: 'EE60013019906' } });
    fireEvent.click(screen.getByRole('listbox', { name: '' }));
    fireEvent.click(screen.getByText('roles.chatbotTrainer'));
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(UserService.addUser).not.toHaveBeenCalled();
  });

  it('should not send a http request with wrong control number', () => {
    UserService.addUser = jest.fn(() => Promise.resolve(genericResponse));
    render(<Administration />);

    fireEvent.click(screen.getByRole('button', { name: /addUser.modalTitle/i }));
    fireEvent.change(screen.getByLabelText('addUser.displayNamePlaceholder'), { target: { value: displayName } });
    fireEvent.change(screen.getByLabelText('addUser.idCodePlaceholder'), { target: { value: 'EE60001019907' } });
    fireEvent.click(screen.getByRole('listbox', { name: '' }));
    fireEvent.click(screen.getByText('roles.chatbotTrainer'));
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(UserService.addUser).not.toHaveBeenCalled();
  });

  it('should send a http request when all values are present', () => {
    emptyStore = createEmptyStore();
    UserService.addUser = jest.fn(() => Promise.resolve(genericResponse));

    render(
      <Provider store={emptyStore}>
        <Administration />
      </Provider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /addUser.modalTitle/i }));
    fireEvent.change(screen.getByLabelText('addUser.displayNamePlaceholder'), { target: { value: displayName } });
    fireEvent.change(screen.getByLabelText('addUser.idCodePlaceholder'), { target: { value: userIdCode } });
    fireEvent.click(screen.getByRole('listbox', { name: '' }));
    fireEvent.click(screen.getByText('roles.chatbotTrainer'));
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(UserService.addUser).toHaveBeenCalled();
  });
});
