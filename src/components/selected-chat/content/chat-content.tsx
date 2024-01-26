import React, { HTMLAttributes } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { MessageModel } from '../../../model/message.model';
import { RootState } from '../../../store';
import Message from './message/message';
import useGetNewMessages from '../../../hooks/useGetNewMessages';

const ChatContent = (props: HTMLAttributes<HTMLElement>): JSX.Element => {
  const allMessages = useSelector((state: RootState) => state.chats.selectedChatMessages);

  useGetNewMessages();

  return (
    <ChatContentStyles {...props}>
      {allMessages.map((message: MessageModel) => (
        <Message key={message.id} message={message} />
      ))}
    </ChatContentStyles>
  );
};

const ChatContentStyles = styled.div`
  align-self: center;
  flex: 1;
  overflow-y: auto;
  width: 100%;
`;

export default ChatContent;
