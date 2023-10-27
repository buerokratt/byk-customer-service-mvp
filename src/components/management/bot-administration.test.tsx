import React from 'react';
import { render } from '../../utils/test.utils';
import BotAdministration from './bot-administration';

jest.mock('../../services/http.service');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('Estimated waiting time', () => {
  it('should render BotAdministration', () => {
    render(<BotAdministration />);
  });
});
