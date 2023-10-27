import { screen } from '@testing-library/react';
import React from 'react';
import { Chat } from '../../model/chat.model';
import { render } from '../../utils/test.utils';
import ChatListItem from './chat-list-item';
import { CHAT_STATUS } from '../../utils/constants';

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

describe('Chat List Item component', () => {
  const singleWordChat: Chat = {
    id: '100',
    status: CHAT_STATUS.OPEN,
    lastMessage: 'Olgu',
    customerSupportId: '',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    ended: '',
  };

  const mediumChat: Chat = {
    id: '100',
    status: CHAT_STATUS.OPEN,
    lastMessage: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eleifend sit amet magna vel suscipit. Sed gravida nec.',
    customerSupportId: '',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    ended: '',
  };

  const longChat: Chat = {
    id: '100',
    status: CHAT_STATUS.OPEN,
    lastMessage: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur lacinia auctor massa, vitae hendrerit nulla feugiat morbi porttitor.',
    customerSupportId: '',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    ended: '',
  };

  const longSingleChat: Chat = {
    id: '100',
    status: CHAT_STATUS.OPEN,
    lastMessage: 'Loremipsumdolorsitamet,consecteturadipiscingelit.Quisqueaccumsannuncjusto,aconsequatduilaciniafinibus.Aeneannon.Quisque.123',
    customerSupportId: '',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    ended: '',
  };

  it('should render chat list item content', () => {
    render(<ChatListItem chat={singleWordChat} />);
  });

  it('should trim last message preview, when length is longer than 120 chars', () => {
    const lastMessagePreview = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur lacinia auctor massa, vitae hendrerit nulla feugiat ...';
    render(<ChatListItem chat={longChat} />);
    screen.getByText(lastMessagePreview);
  });

  it('should not trim message when length under 120 chars', () => {
    const lastMessagePreview = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eleifend sit amet magna vel suscipit. Sed gravida nec.';
    render(<ChatListItem chat={mediumChat} />);
    screen.getByText(lastMessagePreview);
  });

  it('should only show 120 chars with ellipsis when a single continues string is given', () => {
    const lastMessagePreview = 'Loremipsumdolorsitamet,consecteturadipiscingelit.Quisqueaccumsannuncjusto,aconsequatduilaciniafinibus.Aeneannon.Quisque. ...';
    render(<ChatListItem chat={longSingleChat} />);
    screen.getByText(lastMessagePreview);
  });
});
