import Linkify from 'linkify-react';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { MessageModel } from '../../../../model/message.model';
import { AUTHOR_ROLES, CHAT_EVENTS } from '../../../../utils/constants';
import AdminMessage from '../../../chat-message/admin-message';
import ClientMessage from '../../../chat-message/client-message';
import EventMessage from '../../../chat-message/event-message';
import whiteLinkIcon from '../../../../static/link-external-white.svg';

type MessageProps = {
  message: MessageModel;
};

export const Message = (props: MessageProps): JSX.Element => {
  const { message } = props;
  const { t } = useTranslation();
  const lastSentMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    lastSentMessageRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  }, []);

  return (
    <div ref={lastSentMessageRef}>
      {message.event && (
        <>
          {message.event === CHAT_EVENTS.ANSWERED && <EventMessage message={t('chatMessage.event.answered')} />}
          {message.event === CHAT_EVENTS.TERMINATED && <EventMessage message={t('chatMessage.event.terminated')} />}
          {message.event === CHAT_EVENTS.CLIENT_LEFT && <EventMessage message={t('chatMessage.event.client-left')} />}
          {message.event === CHAT_EVENTS.REQUESTED_AUTHENTICATION && <EventMessage message={t('chatMessage.event.authenticate')} />}
          {message.event === CHAT_EVENTS.CONTACT_INFORMATION && <EventMessage message={t('chatMessage.event.contact-information')} />}
          {message.event === CHAT_EVENTS.REQUESTED_CHAT_FORWARD && <EventMessage message={t('chatMessage.event.requested-chat-forward')} />}
          {message.event === CHAT_EVENTS.REQUESTED_CHAT_FORWARD_ACCEPTED && <EventMessage message={t('chatMessage.event.requested-chat-forward-accepted')} />}
          {message.event === CHAT_EVENTS.REQUESTED_CHAT_FORWARD_REJECTED && <EventMessage message={t('chatMessage.event.requested-chat-forward-rejected')} />}
          {message.event === CHAT_EVENTS.CONTACT_INFORMATION_FULFILLED && (
            <MessageStyles>
              <ClientMessage message={message.content || ''} />
            </MessageStyles>
          )}
          {message.event === CHAT_EVENTS.CONTACT_INFORMATION_REJECTED && <EventMessage message={t('chatMessage.event.contact-information-rejected')} />}
          {message.event === CHAT_EVENTS.ASK_PERMISSION && <EventMessage message={t('chatMessage.event.ask-permission')} />}
          {message.event === CHAT_EVENTS.ASK_PERMISSION_ACCEPTED && <EventMessage message={t('chatMessage.event.ask-permission-accepted')} />}
          {message.event === CHAT_EVENTS.ASK_PERMISSION_REJECTED && <EventMessage message={t('chatMessage.event.ask-permission-rejected')} />}
          {message.event === CHAT_EVENTS.ASK_PERMISSION_IGNORED && <EventMessage message={t('chatMessage.event.ask-permission-ignored')} />}
          {message.event === CHAT_EVENTS.REDIRECTED && <EventMessage message={t('chatMessage.event.redirected')} />}
        </>
      )}
      {(!message.event || message.event === CHAT_EVENTS.GREETING || message.event === CHAT_EVENTS.RATING) && (
        <MessageStyles>
          <Linkify options={{ attributes: { target: '_blank' }, defaultProtocol: 'https' }} tagName="div">
            {message.authorRole !== AUTHOR_ROLES.END_USER ? (
              <AdminMessage message={message.content?.replaceAll(/\\n/g, '\n') || ''} />
            ) : (
              <ClientMessage message={message.content || ''} />
            )}
          </Linkify>
        </MessageStyles>
      )}
    </div>
  );
};

const MessageStyles = styled.div`
  #buerokratt-icon {
    fill: #3c0078;
  }

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
      white-space: pre-wrap;

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
        margin-right: 0.5em;
        justify-content: center;
      }
    }

    &.client {
      margin-left: 4em;
      margin-right: 0.8em;
      margin-top: 0;
      display: flex;
      flex-direction: row-reverse;

      .content {
        text-align: right;
        border-radius: 48px 6px 29px 48px;
        background-color: #003cff;
        color: #fff;
        border: none;
        font-size: 17px;

        &.selected {
          filter: opacity(30%);
          border: 2px solid #f5cc7d;
        }

        &.training:hover {
          cursor: pointer;
        }
      }

      .icon {
        margin-left: 0.5em;
        justify-content: center;
      }

      a {
        background: url(${whiteLinkIcon}) no-repeat right center;
        padding-right: 1.25em;
      }
    }
  }

  &.event {
    background-color: #f0f1f2;
    text-align: center;
    color: #575a5d;
    border-radius: 6px;
    margin-right: 0.8em;
    margin-left: 0.8em;
  }

  .marking-options {
    display: flex;
    flex-direction: row;
    border: 2px solid #003cff;
    margin: 0.8rem 3rem 0 auto;
    width: 210px;
    justify-content: space-around;
    border-radius: 10px;
    box-shadow: 1px 2px 5px #003cff;
  }

  .pi-times {
    font-size: 10px;
    margin: 0.6rem 0.2rem 0 0;
  }

  .pi-times:hover {
    cursor: pointer;
  }

  .create-intent,
  .add-example {
    font-size: 12px;
    margin: 0.5rem 0.3rem;
    padding: 0.4rem 0.5rem;
  }

  .arrow-down {
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-top: 18px solid #003cff;
    margin: 0 5rem 0 auto;
  }

  .inner-arrow {
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 14px solid white;
    margin: -20px 84px 0 auto;
  }
`;

export default Message;
