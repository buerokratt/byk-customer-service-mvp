import React from 'react';
import { waitFor } from '@testing-library/react';
import { Action, createMemoryHistory, Update } from 'history';
import { Router } from 'react-router-dom';
import AuthenticationCallback from './authentication-callback';
import { render } from '../utils/test.utils';

describe('AuthenticationCallback', () => {
  it('should redirect to home after successful authentication', async () => {
    const history = createMemoryHistory();
    const historyUpdates: Array<Update> = [];
    history.listen((update) => historyUpdates.push(update));

    render(
      <Router history={history}>
        <AuthenticationCallback />
      </Router>,
    );

    await waitFor(() => expect(historyUpdates.length).toBe(1));
    expect(historyUpdates[0].location.pathname).toBe('/');
    expect(historyUpdates[0].action).toBe(Action.Replace);
  });
});
