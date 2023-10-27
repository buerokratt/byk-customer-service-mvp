import { DateTime } from 'luxon';
import { Dialog } from 'primereact/dialog';
import React, { HTMLAttributes, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { MessageModel } from '../../../model/message.model';
import {
  addAskPermissionTimeout,
  addMessage,
  endChat,
  postEventMessage,
  removeAskPermissionTimeout,
  selectActiveSelectedChat,
  selectSelectedChatLastMessage,
  sendMessageWithNewEvent,
  updateActiveChatMessage,
} from '../../../slices/chats.slice';
import { useAppSelector } from '../../../store';
import StyledButton, { StyledButtonType } from '../../../styled-components/StyledButton';
import { ASK_PERMISSION_BUTTON_TIMEOUT_MS, AUTHOR_ROLES, CHAT_EVENTS, CHAT_STATUS, CHAT_TABS, EMAIL_REGEX, PHONE_NUMBER_REGEX } from '../../../utils/constants';
import ForwardChatModal from './forward-chat-modal/forward-chat-modal';
import { AskPermissionTimeoutModel } from '../../../model/ask-permission-timeout.model';
import ForwardChatToEstablishmentModal from './forward-chat-to-institution-modal/forward-chat-to-establishment-modal';

const ChatToolbox = (props: HTMLAttributes<HTMLElement>): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [showEndChatModal, setShowEndChatModal] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [showEstablishmentModal, setShowEstablishmentModal] = useState(false);
  const [askContactsButtonDisabled, setAskContactsButtonDisabled] = useState(false);
  const selectedChat = useAppSelector((state) => selectActiveSelectedChat(state));
  const endUserEmail = selectedChat?.contactsMessage?.match(EMAIL_REGEX);
  const endUserPhoneNumber = selectedChat?.contactsMessage?.match(PHONE_NUMBER_REGEX);
  const userLogin = useAppSelector((state) => state.authentication.userLogin);
  const isCustomerSupportActive = useAppSelector((state) => state.authentication.isCustomerSupportActive);
  const customerSupportId = useAppSelector((state) => state.authentication.customerSupportId);
  const selectedChatMessages = useAppSelector((state) => state.chats.selectedChatMessages);
  const activeTab = useAppSelector((state) => state.chats.activeTab);
  const selectedChatLastMessage = useAppSelector((state) => selectSelectedChatLastMessage(state));
  const askPermissionTimeouts = useAppSelector((state) => state.chats.askPermissionTimeouts);
  const askPermissionTimeoutIds = askPermissionTimeouts?.map((timeout) => timeout.chatId);
  const [currentAskPermissionTimeout, setCurrentAskPermissionTimeout] = useState(0);

  useEffect(() => {
    const currentAskPermissionModel = askPermissionTimeouts?.find((askPermissionTimeoutModel) => askPermissionTimeoutModel.chatId === selectedChat?.id);
    if (!currentAskPermissionModel?.timeout) return;
    setCurrentAskPermissionTimeout(currentAskPermissionModel.timeout + ASK_PERMISSION_BUTTON_TIMEOUT_MS - new Date().getTime());
  }, [askPermissionTimeouts, selectedChat?.id]);

  useEffect(() => {
    if (selectedChatLastMessage?.event !== CHAT_EVENTS.CONTACT_INFORMATION) {
      setAskContactsButtonDisabled(false);
    }
  }, [selectedChatLastMessage]);

  const terminateSession = (wasHappyEnding: boolean) => {
    setShowEndChatModal(false);
    if (selectedChat) {
      const terminationMessage: MessageModel = {
        chatId: selectedChat.id,
        event: wasHappyEnding ? CHAT_EVENTS.ANSWERED : CHAT_EVENTS.TERMINATED,
        authorTimestamp: new Date().toISOString(),
        authorFirstName: userLogin,
        authorId: customerSupportId,
        authorRole: AUTHOR_ROLES.BACKOFFICE_USER,
      };
      dispatch(addMessage(terminationMessage));
      dispatch(endChat(terminationMessage));
    }
  };

  const authenticate = () => {
    const authenticationMessage: MessageModel = {
      chatId: selectedChat ? selectedChat.id : '',
      event: CHAT_EVENTS.REQUESTED_AUTHENTICATION,
      authorTimestamp: new Date().toISOString(),
      authorFirstName: userLogin,
      authorId: customerSupportId,
      authorRole: AUTHOR_ROLES.BACKOFFICE_USER,
    };
    dispatch(postEventMessage(authenticationMessage));
  };

  const askContactInformation = () => {
    setAskContactsButtonDisabled(true);
    const contactInformationMessage: MessageModel = {
      chatId: selectedChat ? selectedChat.id : '',
      event: CHAT_EVENTS.CONTACT_INFORMATION,
      authorTimestamp: new Date().toISOString(),
      authorFirstName: userLogin,
      authorId: customerSupportId,
      authorRole: AUTHOR_ROLES.BACKOFFICE_USER,
    };
    dispatch(postEventMessage(contactInformationMessage));
  };

  const askPermission = () => {
    const askPermissionTimeout: AskPermissionTimeoutModel = {
      chatId: selectedChat?.id || '',
      timeout: new Date().getTime(),
    };
    dispatch(addAskPermissionTimeout(askPermissionTimeout));
    sendMessageWithIgnoredEvent();
    sendMessageWithPermissionEvent();
    setTimeout(() => {
      dispatch(removeAskPermissionTimeout(selectedChat?.id || ''));
    }, ASK_PERMISSION_BUTTON_TIMEOUT_MS);
  };

  const sendMessageWithIgnoredEvent = () => {
    const existingPermissionMessage = selectedChatMessages.find((message) => message.event === CHAT_EVENTS.ASK_PERMISSION);
    if (existingPermissionMessage) {
      const ignoredPermissionMessage: MessageModel = {
        ...existingPermissionMessage,
        event: CHAT_EVENTS.ASK_PERMISSION_IGNORED,
        authorTimestamp: new Date().toISOString(),
      };
      dispatch(updateActiveChatMessage(ignoredPermissionMessage));
      dispatch(sendMessageWithNewEvent(ignoredPermissionMessage));
    }
  };

  const sendMessageWithPermissionEvent = () => {
    const askPermissionMessage: MessageModel = {
      chatId: selectedChat ? selectedChat.id : '',
      event: CHAT_EVENTS.ASK_PERMISSION,
      authorTimestamp: new Date().toISOString(),
      authorFirstName: userLogin,
      authorId: customerSupportId,
      authorRole: AUTHOR_ROLES.BACKOFFICE_USER,
    };
    dispatch(postEventMessage(askPermissionMessage));
  };

  return (
    <ChatToolboxStyles {...props}>
      <div className="chat-controls">
        <h2 className="chat-controls-title">{t('chatToolbox.action.title')}</h2>

        {selectedChat && (
          <>
            {selectedChat?.status !== CHAT_STATUS.ENDED && (
              <div>
                <StyledButton
                  onClick={() => setShowEndChatModal(!showEndChatModal)}
                  styleType={StyledButtonType.GRAY}
                  className="chat-controls-action"
                  disabled={!isCustomerSupportActive}
                >
                  {t('chatToolbox.action.terminate')}
                </StyledButton>

                {selectedChat?.endUserId === '' && (
                  <StyledButton
                    disabled={!selectedChat?.customerSupportId}
                    onClick={() => authenticate()}
                    styleType={StyledButtonType.GRAY}
                    className="chat-controls-action"
                  >
                    {t('chatToolbox.action.forceAuthenticate')}
                  </StyledButton>
                )}

                <StyledButton
                  disabled={!selectedChat?.customerSupportId || selectedChatLastMessage?.event === CHAT_EVENTS.CONTACT_INFORMATION || askContactsButtonDisabled}
                  onClick={() => askContactInformation()}
                  styleType={StyledButtonType.GRAY}
                  className="chat-controls-action"
                >
                  {t('chatToolbox.action.askContactInformation')}
                </StyledButton>

                {selectedChat?.customerSupportId && (
                  <StyledButton
                    disabled={askPermissionTimeoutIds?.includes(selectedChat?.id)}
                    onClick={() => askPermission()}
                    styleType={StyledButtonType.GRAY}
                    className="chat-controls-action"
                    timeout={currentAskPermissionTimeout}
                  >
                    {t('chatToolbox.action.askPermission')}
                    <span className="bg" />
                  </StyledButton>
                )}
                <>
                  <StyledButton
                    disabled={!!selectedChat.customerSupportId && selectedChat.customerSupportId !== customerSupportId}
                    onClick={() => setShowForwardModal(true)}
                    styleType={StyledButtonType.GRAY}
                    className="chat-controls-action"
                  >
                    {t('chatToolbox.action.forward')}
                  </StyledButton>

                  {window._env_.INSTITUTION_FORWARDING_ENABLED && (
                    <StyledButton
                      disabled={
                        (!!selectedChat.customerSupportId && selectedChat.customerSupportId !== customerSupportId) || selectedChat.forwardedToName !== ''
                      }
                      onClick={() => setShowEstablishmentModal(true)}
                      styleType={StyledButtonType.GRAY}
                      className="chat-controls-action"
                    >
                      {t('chatToolbox.action.forwardInstitution')}
                    </StyledButton>
                  )}
                </>
              </div>
            )}
            <ForwardChatToEstablishmentModal
              selectedChat={selectedChat}
              userLogin={userLogin}
              customerSupportId={customerSupportId}
              displayModal={showEstablishmentModal}
              afterForwardAction={() => setShowEstablishmentModal(false)}
            />

            <ForwardChatModal
              chat={selectedChat}
              displayModal={showForwardModal}
              afterForwardAction={() => setShowForwardModal(false)}
              clearSelectedChatAfterForward={activeTab === CHAT_TABS.TAB_UNANSWERED}
            />
            <DialogStyles
              header={t('chatToolbox.action.terminate')}
              visible={showEndChatModal}
              className="active-chat-toolbox-dialog"
              onHide={() => setShowEndChatModal(false)}
              draggable={false}
            >
              <div className="column">
                <StyledButton onClick={() => terminateSession(true)} styleType={StyledButtonType.GRAY}>
                  {t('chatToolbox.event.answered')}
                </StyledButton>

                <StyledButton onClick={() => terminateSession(false)} styleType={StyledButtonType.GRAY}>
                  {t('chatToolbox.event.terminated')}
                </StyledButton>
              </div>
            </DialogStyles>
          </>
        )}
      </div>

      <div className="chat-info">
        <h2 className="chat-info-title">{t('chatToolbox.info.title')}</h2>

        <p className="chat-info-detail">
          <span>{t('chatListItem.clientChatId')}:</span>
          <span>{selectedChat?.id}</span>
        </p>

        <p className="chat-info-detail">
          <span>{t('chatListItem.clientName')}:</span>
          <span>
            {selectedChat?.endUserFirstName === '' || selectedChat?.endUserLastName === ''
              ? t('chatListItem.anonymous')
              : `${selectedChat?.endUserFirstName?.toUpperCase()} ${selectedChat?.endUserLastName?.toUpperCase()}`}
          </span>
        </p>

        {!!selectedChat?.endUserId && (
          <p className="chat-info-detail">
            <span>{t('chatListItem.socialSecurityNumber')}:</span>
            <span>{selectedChat.endUserId}</span>
          </p>
        )}

        {endUserEmail && (
          <p className="chat-info-detail">
            <span>{t('chatListItem.clientEmail')}:</span>
            <span>{endUserEmail}</span>
          </p>
        )}

        {endUserPhoneNumber && (
          <p className="chat-info-detail">
            <span>{t('chatListItem.clientPhoneNumber')}:</span>
            <span>{endUserPhoneNumber}</span>
          </p>
        )}

        {selectedChat?.customerSupportDisplayName && (
          <p className="chat-info-detail">
            <span>{t('chatArchive.agent')}:</span>
            <span>{selectedChat.customerSupportDisplayName.toUpperCase()}</span>
          </p>
        )}

        <p className="chat-info-detail">
          <span>{t('chatListItem.created')}:</span>
          <span>{selectedChat && DateTime.fromISO(selectedChat.created).setLocale('et').toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)}</span>
        </p>

        <p className="chat-info-detail">
          <span>{t('chatToolbox.info.endUserOs')}:</span>
          {selectedChat && <span>{selectedChat.endUserOs}</span>}
        </p>

        <p className="chat-info-detail">
          <span>{t('chatToolbox.info.endUserUrl')}:</span>
          {selectedChat && <span>{selectedChat.endUserUrl}</span>}
        </p>
      </div>
    </ChatToolboxStyles>
  );
};

const ChatToolboxStyles = styled.div`
  background-color: #fff;
  border-left: 2px solid #f0f1f2;
  display: flex;
  flex-flow: column nowrap;
  overflow-y: auto;

  .chat-controls {
    border-bottom: 2px solid #f0f1f2;
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 3;
    padding: 0.25rem;
  }

  .chat-controls-title,
  .chat-info-title {
    font-size: 0.8rem;
    margin: 0;
    padding: 0.25rem 0 0.5rem 0;
  }

  .chat-controls-action {
    margin: 0.5rem 0;
    width: 98%;

    :first-of-type {
      margin-top: 0;
    }

    :last-of-type {
      margin-bottom: 0;
    }
  }

  .chat-info {
    display: flex;
    flex-flow: column wrap;
    flex-grow: 1;
    padding: 0.25rem 0.5rem;
  }

  .chat-info-detail {
    align-items: flex-start;
    font-size: 0.8rem;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    margin: 0.25rem 0;

    :first-of-type {
      margin-top: 0;
    }

    :last-of-type {
      margin-bottom: 0;
    }

    > span:first-of-type {
      color: #a7a9ab;
    }
  }
`;

const DialogStyles = styled(Dialog)`
  .column {
    display: flex;
    flex-flow: column wrap;

    > button {
      margin: 0.5rem 0;
    }
  }
`;

export default ChatToolbox;
