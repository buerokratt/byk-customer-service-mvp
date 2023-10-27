import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { render } from '../utils/test.utils';
import PrivateRoute from './private-route';
import { ROLES } from '../utils/constants';

describe('Private route component', () => {
  it('should be rendered', () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <PrivateRoute requiredRoles={[ROLES.ROLE_CHATBOT_TRAINER]} />
      </Router>,
    );
  });
});
