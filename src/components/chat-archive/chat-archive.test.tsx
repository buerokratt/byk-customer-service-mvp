import { screen } from '@testing-library/react';
import React from 'react';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { Chat } from '../../model/chat.model';
import { render } from '../../utils/test.utils';
import ChatArchive from './chat-archive';
import { CHAT_STATUS, CHAT_TABS } from '../../utils/constants';
import chatsReducer, { ChatsState } from '../../slices/chats.slice';
import { initialChatsState, initialSingleChatState } from '../../test-cs-initial-states';

jest.mock('../../services/sse.service', () => ({
  __esModule: true,
  default: () => ({
    onMessage: () => null,
  }),
}));

let store: EnhancedStore;
const singleChat: Chat = {
  ...initialSingleChatState,
  id: 'chatId',
  customerSupportId: '',
  created: new Date().toISOString(),
  updated: new Date().toISOString(),
  ended: new Date().toISOString(),
  status: CHAT_STATUS.ENDED,
  lastMessage: 'tere päevast!',
  endUserFirstName: 'test',
  endUserLastName: 'one',
  endUserId: 'endUserId',
};

const chatsState: ChatsState = { ...initialChatsState, endedChats: [singleChat], activeTab: CHAT_TABS.TAB_UNANSWERED };

describe('Chat archive', () => {
  store = configureStore({
    reducer: {
      chats: chatsReducer,
    },
    preloadedState: {
      chats: chatsState,
    },
  });

  it('should render table with a few headers', () => {
    render(<ChatArchive />);

    screen.getByRole('columnheader', {
      name: /algusaeg/i,
    });
    screen.getByRole('columnheader', {
      name: /lõppaeg/i,
    });
    screen.getByRole('columnheader', {
      name: /nõustaja nimi/i,
    });
    screen.getByRole('columnheader', {
      name: /tulemus/i,
    });
    screen.getByRole('columnheader', {
      name: 'nimi',
    });
    screen.getByRole('columnheader', {
      name: /isikukood/i,
    });
  });

  it('should render table with ended chat', async () => {
    render(
      <Provider store={store}>
        <ChatArchive />
      </Provider>,
    );
    screen.getByRole('cell', {
      name: /test one/i,
    });
    screen.getByRole('cell', {
      name: /endUserId/i,
    });
    screen.getByRole('cell', {
      name: /lõpetatud/i,
    });
    screen.getByRole('cell', {
      name: /chatId/i,
    });
  });
});
