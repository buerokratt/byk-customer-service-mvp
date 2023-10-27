import Linkify from 'linkify-react';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Checkbox } from 'primereact/checkbox';
import { MessageModel } from '../../../../model/message.model';
import { AUTHOR_ROLES, CHAT_EVENTS } from '../../../../utils/constants';
import whiteLinkIcon from '../../../../static/link-external-white.svg';
import Linkifier from '../../../chat-message/linkifier';

type MessageProps = {
  message: MessageModel;
  checked: boolean;
  selectMessageHandler: (id: string) => void;
  deselectMessageHandler: (id: string) => void;
};

export const ForwardChatMessage = (props: MessageProps): JSX.Element => {
  const { message, checked, selectMessageHandler, deselectMessageHandler } = props;
  const lastSentMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    lastSentMessageRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  }, []);

  const onChange = (selectedMessage: boolean) => {
    if (selectedMessage) selectMessageHandler(message.id || '');
    else deselectMessageHandler(message.id || '');
  };

  const ChatMessages = ({ sender }: { sender: string }) => (
    <div className={`message ${sender}`}>
      <div className="icon">
        <Checkbox inputId="binary" checked={checked} onChange={(e) => onChange(e.checked)} />
      </div>
      <div className="content">
        <Linkifier message={message.content} />
      </div>
    </div>
  );

  return (
    <div ref={lastSentMessageRef}>
      {(!message.event || message.event === CHAT_EVENTS.GREETING || message.event === CHAT_EVENTS.RATING) && (
        <MessageStyles>
          <Linkify options={{ attributes: { target: '_blank' }, defaultProtocol: 'https' }} tagName="div">
            {message.authorRole !== AUTHOR_ROLES.END_USER ? <ChatMessages sender="admin" /> : <ChatMessages sender="client" />}
          </Linkify>
        </MessageStyles>
      )}
    </div>
  );
};

const MessageStyles = styled.div`
  .message {
    margin: 0.4em;
    margin-bottom: 0;

    :last-of-type {
      margin-bottom: 0.4em;
    }

    border: 1px solid transparent;
    color: white;
    align-items: flex-start;

    .content {
      padding: 0.4em 1em;
      word-break: break-word;

      a {
        background: url(${whiteLinkIcon}) no-repeat right center;
        padding-right: 1.25em;
        color: white;
      }
    }

    .icon {
      display: flex;
      width: 2.8em;
      height: 2.8em;
      flex-shrink: 0;
    }

    &.event {
      background-color: #f0f1f2;
      text-align: center;
      color: #575a5d;
      border-radius: 6px;
      margin-right: 0.8em;
      margin-left: 0.8em;
    }

    &.admin {
      margin-left: 0.8em;
      display: flex;
      flex-direction: row;

      align-items: flex-start;

      .content {
        border-radius: 6px 48px 48px 29px;
        background-color: #3c0078;
      }

      .icon {
        justify-content: center;
      }
    }

    &.client {
      margin-left: 4em;
      margin-right: 0.8em;
      display: flex;
      flex-direction: row-reverse;

      .content {
        text-align: right;
        border-radius: 48px 6px 29px 48px;
        background-color: #003cff;
      }

      .icon {
        justify-content: center;
      }

      a {
        background: url(${whiteLinkIcon}) no-repeat right center;
        padding-right: 1.25em;
      }
    }
  }
`;

export default ForwardChatMessage;
