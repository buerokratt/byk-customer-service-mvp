import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';
import * as timeago from 'timeago.js';
import { Chat } from '../../model/chat.model';
import { selectActiveSelectedChat, setActiveChat } from '../../slices/chats.slice';
import { useAppSelector } from '../../store';
import StyledButton, { StyledButtonType } from '../../styled-components/StyledButton';

type ChatListItemProps = {
  chat: Chat;
};

const ChatListItem = (props: ChatListItemProps): JSX.Element => {
  const { chat } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedChat = useAppSelector((state) => selectActiveSelectedChat(state));
  const isSelectedChat = Boolean(selectedChat && selectedChat.id === chat.id);

  const truncateTo120 = (originalMessage: string): string => {
    const messageWithoutSpaces = originalMessage.replace(/ /g, '');
    if (messageWithoutSpaces.length > 120) return `${originalMessage.substring(0, 120)} ...`;
    if (originalMessage.length > 120) {
      let truncatedMessage = '';
      let message = originalMessage;
      if (message.length > 125) message = message.substring(0, 122);
      const messageArray = message.split(' ');
      messageArray[messageArray.length - 1] = '...';
      messageArray.forEach((word) => {
        truncatedMessage += `${word} `;
      });
      return truncatedMessage;
    }
    return originalMessage;
  };

  return (
    <ChatListItemStyles isSelected={isSelectedChat}>
      <div className="top">
        <p>
          <strong>{t('chatListItem.clientName')}</strong>
          :&nbsp;{chat.endUserFirstName === '' ? t('chatListItem.anonymous') : chat.endUserFirstName}
          <br />
          <strong>{t('chatListItem.agentName')}</strong>
          :&nbsp;{chat.customerSupportDisplayName}
        </p>
        <p className="timeago">{timeago.format(chat.updated, 'et_EE')}</p>
      </div>
      <p className="last-message">
        <span className="symbol">&#10149;</span>
        {truncateTo120(chat.lastMessage)}
      </p>
      <div className="bottom">
        <p>
          <strong>{t('chatListItem.created')}</strong>
          :&nbsp;
          <span>{timeago.format(chat.created, 'et_EE')}</span>
        </p>
        {!isSelectedChat && (
          <StyledButton tabIndex={0} role="button" styleType={StyledButtonType.GRAY} onClick={() => dispatch(setActiveChat(chat))} className="open-chat">
            {t('chatArchive.openChat')}
          </StyledButton>
        )}
      </div>
    </ChatListItemStyles>
  );
};

const selectedChatListStyles = css`
  background-color: #f0f1f2;
  border-left-color: #003cff;

  .timeago,
  .bottom {
    color: #000;
  }
`;
const ChatListItemStyles = styled.div<{ isSelected: boolean }>`
  background-color: #fff;
  display: flex;
  flex-flow: column wrap;
  border: 0;
  border-left: 4px solid transparent;
  padding: 0.5rem;
  position: relative;
  transition: background-color 250ms, border-left-color 250ms, color 250ms;
  margin: 0 0 2px 0;

  ::after {
    background-color: #f0f1f2;
    bottom: -2px;
    content: '';
    display: block;
    height: 2px;
    left: -4px;
    position: absolute;
    right: 0;
    width: calc(100% + 4px);
  }

  p {
    margin: 0.25rem 0;
  }

  .top,
  .bottom {
    display: flex;
    font-size: 0.8em;
    justify-content: space-between;
  }

  .symbol {
    color: #a7a9ab;
    font-size: 0.8em;
    margin: 0 0.25rem;
  }

  .last-message {
    font-size: 0.9rem;
    margin: 0 0 1rem 0;
  }

  .bottom {
    align-items: flex-end;
    color: #a7a9ab;
  }

  .timeago {
    color: #a7a9ab;
  }

  .open-chat {
    margin: 0;
  }

  ${(props) => props.isSelected && selectedChatListStyles}
`;

export default ChatListItem;
