import React, { HTMLAttributes, useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Chat } from '../../model/chat.model';
import { RootState } from '../../store';
import { CHAT_TABS } from '../../utils/constants';
import ChatListItem from './chat-list-item';

const ChatList = (props: HTMLAttributes<HTMLElement>): JSX.Element => {
  const chats = useSelector((state: RootState) => state.chats.activeChats);
  const activeTab = useSelector((state: RootState) => state.chats.activeTab);

  const chatTypeFilter = (chat: Chat) => {
    if (CHAT_TABS.TAB_ANSWERED === activeTab)
      return !!chat.customerSupportId;
    if (CHAT_TABS.TAB_UNANSWERED === activeTab)
      return !chat.customerSupportId;
    return chat;
  };

  const buildChatItem = (chat: Chat) => <ChatListItem key={chat.id} chat={chat} />;

  const filteredChats = useMemo(() => 
    chats.filter(chatTypeFilter).map(buildChatItem),
    [chats, activeTab]
  );

  return (
    <ChatListStyles {...props}>
      {filteredChats}
    </ChatListStyles>
  );
};

const ChatListStyles = styled.div`
  overflow-y: auto;
`;

export default ChatList;
