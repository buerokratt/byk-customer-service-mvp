import { screen } from '@testing-library/react';
import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { render } from '../utils/test.utils';
import Login from './password-login';

describe('Login component', () => {
  it('should render login fields and submit button', () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <Login />
      </Router>,
    );
    screen.getByPlaceholderText('user name');
    screen.getByPlaceholderText('password');
    screen.getByText('sisene');
  });
});
