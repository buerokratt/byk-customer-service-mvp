import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../../../../utils/test.utils';
import ChatContentHeader from './chat-content-header';
import { CHAT_STATUS } from '../../../../utils/constants';

const selectedChat = {
  id: '1',
  status: CHAT_STATUS.OPEN,
  lastMessage: 'string',
  created: 'string',
  ended: 'string',
  updated: 'string',
  endUserFirstName: 'test',
  endUserLastName: 'one',
  endUserId: '60001019906',
  contactsMessage: 'Minu e-posti aadress on email@gmail.com ja telefon 1234567',
};

describe('Chat content header', () => {
  it('should render', () => {
    render(<ChatContentHeader selectedChat={selectedChat} />);
    screen.getByText(`${selectedChat.endUserFirstName} ${selectedChat.endUserLastName}`);
    screen.getByText(selectedChat.endUserId);
    screen.getByText('email@gmail.com');
    screen.getByText('1234567');
  });
});
