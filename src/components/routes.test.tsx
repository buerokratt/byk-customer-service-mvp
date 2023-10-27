import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Routes from './routes';
import { render } from '../utils/test.utils';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: {
      language: 'et',
      options: {
        supportedLngs: ['et'],
      },
    },
  }),
}));

describe('Router component', () => {
  it('should be rendered', () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <Routes />
      </Router>,
    );
  });
});
