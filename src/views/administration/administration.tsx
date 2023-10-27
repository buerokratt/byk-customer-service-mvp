import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Greetings from '../../components/management/greetings';
import SessionLength from '../../components/management/session-length';
import EstimatedWaitingTime from '../../components/management/estimated-waiting-time';
import UserDetailModal from '../../components/management/user-detail-modal';
import Users from '../../components/management/users';
import { ADMINISTRATION_TABS } from '../../utils/constants';
import BotAdministration from '../../components/management/bot-administration';
import ChatButton from '../../components/chat-button/chat-button';

const Administration = (): JSX.Element => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(ADMINISTRATION_TABS.USERS);
  const [displayAddUserForm, setDisplayAddUserForm] = useState(false);
  const isUsersView = activeTab === ADMINISTRATION_TABS.USERS;
  const isBotView = activeTab === ADMINISTRATION_TABS.BOT;
  const isGreetingView = activeTab === ADMINISTRATION_TABS.GREETING;
  const isSessionView = activeTab === ADMINISTRATION_TABS.SESSION;
  const isWaitingTimeView = activeTab === ADMINISTRATION_TABS.WAITING_TIME;

  return (
    <AdministrationStyles>
      <div className="chat-header">
        <div className="chat-tabs">
          <ChatButton active={isBotView} onClick={() => setActiveTab(ADMINISTRATION_TABS.BOT)}>
            {t('administrate.bot.menuLabel')}
          </ChatButton>

          <ChatButton active={isUsersView} onClick={() => setActiveTab(ADMINISTRATION_TABS.USERS)}>
            {t('administrate.users')}
          </ChatButton>

          <ChatButton active={isGreetingView} onClick={() => setActiveTab(ADMINISTRATION_TABS.GREETING)}>
            {t('administrate.greeting')}
          </ChatButton>

          <ChatButton active={isSessionView} onClick={() => setActiveTab(ADMINISTRATION_TABS.SESSION)}>
            {t('administrate.sessionLength')}
          </ChatButton>

          <ChatButton active={isWaitingTimeView} onClick={() => setActiveTab(ADMINISTRATION_TABS.WAITING_TIME)}>
            {t('administrate.estimatedWaitingTime')}
          </ChatButton>
        </div>

        <div className="header-actions">
          {isUsersView && <ChatButton onClick={() => setDisplayAddUserForm(true)}>{t('addUser.modalTitle')}</ChatButton>}

          <UserDetailModal
            userIdCode=""
            userDisplayName=""
            setActive={(e: boolean) => setDisplayAddUserForm(e)}
            userSelectedRoles={[]}
            isActive={displayAddUserForm}
            enableUserIdCodeField
            addNewUser
          />
        </div>
      </div>

      {isUsersView && <Users />}
      {isGreetingView && <Greetings />}
      {isSessionView && <SessionLength />}
      {isWaitingTimeView && <EstimatedWaitingTime />}
      {isBotView && <BotAdministration />}
    </AdministrationStyles>
  );
};

const AdministrationStyles = styled.div`
  height: 100%;
  overflow: auto;

  .chat-header {
    align-items: center;
    background-color: #fff;
    border-bottom: 2px solid #f0f1f2;
    display: flex;
    flex-flow: row nowrap;
    height: 50px;
    position: sticky;
    top: 0;
    z-index: 890;
  }

  .chat-tabs {
    align-items: center;
    display: flex;
    flex-basis: 400px;
    flex-grow: 1;
    flex-shrink: 1;
    padding: 0.5rem 0;
  }

  .chat-tabs,
  .header-actions {
    padding: 0.5rem 0;
  }

  .header-actions {
    display: flex;
    flex-grow: 1;
    justify-content: flex-end;
  }
`;

export default Administration;
