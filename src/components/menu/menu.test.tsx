import { createMemoryHistory } from 'history';
import React from 'react';
import { screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { render } from '../../utils/test.utils';
import Menu from './menu';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'et' },
  }),
}));

describe('Menu component', () => {
  it('should not be displayed when not logged in', () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <Menu />
      </Router>,
    );

    const activeChatButton = screen.queryByText('menu.activeChats');
    expect(activeChatButton).toBeNull();
  });
});
