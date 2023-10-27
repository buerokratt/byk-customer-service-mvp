import React from 'react';
import { Message } from './message';
import { render, screen } from '../../../../utils/test.utils';
import { MessageModel } from '../../../../model/message.model';
import { AUTHOR_ROLES, CHAT_EVENTS } from '../../../../utils/constants';

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

describe('Message component', () => {
  const message: MessageModel = {
    chatId: '',
    authorFirstName: '',
    authorTimestamp: '',
    authorRole: AUTHOR_ROLES.BACKOFFICE_USER,
    id: '0',
    content: 'Tervitus',
    event: CHAT_EVENTS.REQUESTED_AUTHENTICATION,
  };

  it('should render message content', () => {
    render(<Message message={message} />);
  });

  it('should render authentication message', () => {
    render(<Message message={message} />);
    screen.getByText(/chatMessage.event.authenticate/i);
  });
});
