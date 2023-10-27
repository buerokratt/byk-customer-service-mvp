import React, { HTMLAttributes, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Chat } from '../../../model/chat.model';
import { MessageModel } from '../../../model/message.model';
import { getMessages } from '../../../slices/chats.slice';
import { RootState, useAppDispatch } from '../../../store';
import Message from './message/message';
import useGetNewMessages from '../../../hooks/useGetNewMessages';

type ChatContentProps = {
  selectedChat: Chat | null;
} & HTMLAttributes<HTMLElement>;

const ChatContent = (props: ChatContentProps): JSX.Element => {
  const { selectedChat } = props;
  const dispatch = useAppDispatch();
  const allMessages = useSelector((state: RootState) => state.chats.selectedChatMessages);
  const isAuthenticated = useSelector((state: RootState) => state.authentication.isAuthenticated);

  useGetNewMessages(selectedChat?.id);

  useEffect(() => {
    if (selectedChat?.id != null && isAuthenticated) dispatch(getMessages(selectedChat.id));
  }, [dispatch, selectedChat?.id, isAuthenticated]);

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
