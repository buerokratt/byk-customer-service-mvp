import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import TaraLogin from './tara-login';
import { render } from '../utils/test.utils';

describe('TaraLogin component', () => {
  it('should render TaraLogin component', async () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <TaraLogin />
      </Router>,
    );
  });
});
