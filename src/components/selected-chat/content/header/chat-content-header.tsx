import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Chat } from '../../../../model/chat.model';
import { EMAIL_REGEX, PHONE_NUMBER_REGEX } from '../../../../utils/constants';

type ChatContentProps = {
  selectedChat: Chat;
} & HTMLAttributes<HTMLElement>;

const ChatContentHeader = (props: ChatContentProps): JSX.Element => {
  const { selectedChat } = props;
  const endUserEmail = selectedChat?.contactsMessage?.match(EMAIL_REGEX);
  const endUserPhoneNumber = selectedChat?.contactsMessage?.match(PHONE_NUMBER_REGEX);
  const { t } = useTranslation();

  return (
    <ChatContentHeaderStyles>
      <div className="header-left">
        <div>
          <strong>{t('chatListItem.clientName')}:</strong>
          &nbsp;{`${selectedChat?.endUserFirstName} ${selectedChat?.endUserLastName}`}
        </div>
        <div>
          <strong>{t('chatListItem.socialSecurityNumber')}:</strong>
          &nbsp;{selectedChat?.endUserId}
        </div>
        {selectedChat?.forwardedToName && (
          <div>
            <strong>{t('chatListItem.forwardedTo')}:</strong>
            &nbsp;{selectedChat?.forwardedToName}
          </div>
        )}
        {selectedChat?.receivedFrom && (
          <div>
            <strong>{t('chatListItem.receivedFrom')}:</strong>
            &nbsp;{selectedChat?.receivedFrom}
          </div>
        )}
      </div>
      <div className="header-right">
        <div>
          <strong>{t('chatListItem.clientEmail')}:</strong>
          &nbsp;{endUserEmail}
        </div>
        <div>
          <strong>{t('chatListItem.clientPhoneNumber')}:</strong>
          &nbsp;{endUserPhoneNumber}
        </div>
      </div>
    </ChatContentHeaderStyles>
  );
};

const ChatContentHeaderStyles = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.8rem;
  border-bottom: 2px solid #f0f1f2;
  height: 90px;

  .header-left,
  .header-right {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
`;

export default ChatContentHeader;
