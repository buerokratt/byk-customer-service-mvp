import React, { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { InputText } from 'primereact/inputtext';
import { Chat } from '../../model/chat.model';
import { getCustomerSupportStatus, setCustomerSupportStatus } from '../../slices/authentication.slice';
import {
  claimChat,
  clearActiveChat,
  getEndedMessages,
  removeSupportFromChat,
  selectActiveSelectedChat,
  selectEndedSelectedChat,
  setActiveChatTab,
  setSearchKey,
} from '../../slices/chats.slice';
import { useAppDispatch, useAppSelector } from '../../store';
import { CHAT_TABS } from '../../utils/constants';
import ActivityToggle from '../activity-toggle/activity-toggle';
import ChatButton from '../chat-button/chat-button';

const ChatHeader = (): ReactElement => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const searchKey = useAppSelector((state) => state.chats.searchKey);
  const allChats = useAppSelector((state) => state.chats.activeChats);
  const selectedChat = useAppSelector((state) => selectActiveSelectedChat(state));
  const selectedEndedChat = useAppSelector((state) => selectEndedSelectedChat(state));
  const activeTab = useAppSelector((state) => state.chats.activeTab);
  const userLogin = useAppSelector((state) => state.authentication.userLogin);
  const customerSupportId: string = useAppSelector((state) => state.authentication.customerSupportId);
  const isCustomerSupportActive: boolean = useAppSelector((state) => state.authentication.isCustomerSupportActive);

  const options = [
    { label: t('chatHeader.agentOnlineLabel'), value: true },
    { label: t('chatHeader.agentAwayLabel'), value: false },
  ];

  useEffect(() => {
    dispatch(getCustomerSupportStatus());
  }, [dispatch]);

  const changeCustomerSupportStatus = (newStatus: boolean) => {
    dispatch(setCustomerSupportStatus(newStatus.toString()));
    if (!newStatus) {
      dispatch(removeSupportFromChat(customerSupportId));
    }
  };

  const claimChatAsCurrentUser = () => {
    if (selectedChat?.id) dispatch(claimChat({ id: selectedChat.id, customerSupportDisplayName: userLogin, customerSupportId, openClaimedChat: true }));
  };

  const clearSearchKey = () => {
    dispatch(setSearchKey(''));
  };

  function changeTabAndCloseActiveChat(newActiveTab: string): void {
    dispatch(clearActiveChat());
    dispatch(setActiveChatTab(newActiveTab));
  }

  return (
    <ChatHeaderStyles>
      <div className="header-left">
        <div className="chat-tabs">
          <ChatButton active={activeTab === CHAT_TABS.TAB_UNANSWERED} onClick={() => changeTabAndCloseActiveChat(CHAT_TABS.TAB_UNANSWERED)}>
            {t('chatHeader.unanswered')}&nbsp;
            <strong>
              (
              <small>
                {allChats
                  .filter((chat: Chat) => chat.status === 'OPEN' || chat.status === 'REDIRECTED')
                  .reduce(
                    (count: number, chat: Chat) => (chat.customerSupportDisplayName === null || chat.customerSupportDisplayName === '' ? count + 1 : count),
                    0,
                  )}
              </small>
              )
            </strong>
          </ChatButton>

          <ChatButton active={activeTab === CHAT_TABS.TAB_ANSWERED} onClick={() => changeTabAndCloseActiveChat(CHAT_TABS.TAB_ANSWERED)}>
            {t('chatHeader.answered')}&nbsp;
            <strong>
              (
              <small>
                {allChats
                  .filter((chat: Chat) => chat.status === 'OPEN' || chat.status === 'REDIRECTED')
                  .reduce((count: number, chat: Chat) => (chat.customerSupportDisplayName !== '' ? count + 1 : count), 0)}
              </small>
              )
            </strong>
          </ChatButton>

          <ChatButton active={activeTab === CHAT_TABS.TAB_ARCHIVE} onClick={() => changeTabAndCloseActiveChat(CHAT_TABS.TAB_ARCHIVE)}>
            {t('chatHeader.archive')}
          </ChatButton>
        </div>
        <ActivityToggle value={isCustomerSupportActive} options={options} togglePresence={(isActive: boolean) => changeCustomerSupportStatus(isActive)} />
      </div>
      {activeTab === CHAT_TABS.TAB_ARCHIVE && (
        <>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              className="search-input"
              value={searchKey}
              onChange={(e) => dispatch(setSearchKey(e.target.value))}
              placeholder={t('chatArchive.search')}
            />
          </span>
          {searchKey && (
            <ChatButton onClick={clearSearchKey} onKeyPress={clearSearchKey}>
              {t('chatArchive.clear')}
            </ChatButton>
          )}
          <div className="refresh-data">
            <ChatButton onClick={() => dispatch(getEndedMessages(false))}>{t('chatArchive.refresh')}</ChatButton>
          </div>
        </>
      )}

      {(selectedChat || selectedEndedChat) && (
        <div className="chat-controls">
          {activeTab !== CHAT_TABS.TAB_ARCHIVE && (
            <ChatButton disabled={selectedChat?.customerSupportDisplayName || !isCustomerSupportActive} onClick={claimChatAsCurrentUser}>
              {t('chatHeader.claimChat')}
            </ChatButton>
          )}
          <ChatButton onClick={() => dispatch(clearActiveChat())} disabled={!selectedChat && !selectedEndedChat}>
            {t('chatHeader.endChat')}
          </ChatButton>
        </div>
      )}
    </ChatHeaderStyles>
  );
};

const ChatHeaderStyles = styled.div`
  align-items: center;
  background-color: #fff;
  border-bottom: 2px solid #f0f1f2;
  display: flex;
  justify-content: space-between;
  flex-flow: row nowrap;
  height: 50px;
  position: sticky;
  top: 0;
  z-index: 890;

  .header-left {
    display: flex;
  }

  .chat-tabs {
    display: flex;
    flex-basis: 400px;
  }

  .refresh-data {
    display: flex;
    margin: 0 0 0 auto;
  }

  .chat-controls {
    display: flex;
    margin: 0;
  }

  span {
    margin-left: 1rem;
  }

  .search-input {
    align-self: center;
    border: 0;
    border-bottom: 2px solid #a7a9ab;
    border-radius: 0;
    color: #000;
    margin: 0.5rem 0.5rem 0.5rem 0;

    :enabled:focus {
      box-shadow: unset;
      outline: 0;
    }

    :focus,
    :hover {
      border-bottom-color: #003cff;
    }

    ::placeholder {
      color: #a7a9ab;
    }

    :disabled {
      background-color: transparent;
      border-bottom-color: #f0f1f2;
      cursor: not-allowed;
    }
  }
`;

export default ChatHeader;
