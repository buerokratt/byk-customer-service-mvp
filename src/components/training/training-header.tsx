import React, { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { getCustomerSupportStatus } from '../../slices/authentication.slice';
import { clearActiveChat, getEndedMessages, selectEndedSelectedChat } from '../../slices/chats.slice';
import { useAppDispatch, useAppSelector } from '../../store';
import ChatButton from '../chat-button/chat-button';
import { TRAINING_TABS } from '../../utils/constants';
import { clearSelectedIntent, selectSelectedIntent, setActiveTrainingTab } from '../../slices/training.slice';
import AddIntentModal from './add-intent-modal';

const TrainingHeader = (): ReactElement => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [displayAddIntentForm, setDisplayAddIntentForm] = useState(false);
  const selectedChat = useAppSelector((state) => selectEndedSelectedChat(state));
  const selectedIntent = useAppSelector((state) => selectSelectedIntent(state));
  const activeTab = useAppSelector((state) => state.training.activeTab);

  useEffect(() => {
    dispatch(getCustomerSupportStatus());
  }, [dispatch]);

  function changeTabAndCloseActiveChat(newActiveTab: string): void {
    dispatch(setActiveTrainingTab(newActiveTab));
    dispatch(clearActiveChat());
  }

  return (
    <ChatHeaderStyles>
      <div className="chat-tabs">
        <ChatButton active={activeTab === TRAINING_TABS.INTENTS} onClick={() => changeTabAndCloseActiveChat(TRAINING_TABS.INTENTS)}>
          {t('trainingHeader.intents')}
        </ChatButton>
        <ChatButton active={activeTab === TRAINING_TABS.ARCHIVE} onClick={() => changeTabAndCloseActiveChat(TRAINING_TABS.ARCHIVE)}>
          {t('trainingHeader.archive')}
        </ChatButton>
        <ChatButton active={activeTab === TRAINING_TABS.TRAINING} onClick={() => changeTabAndCloseActiveChat(TRAINING_TABS.TRAINING)}>
          {t('trainingHeader.training')}
        </ChatButton>
      </div>

      <div className="chat-controls">
        {selectedIntent && (
          <ChatButton onClick={() => dispatch(clearSelectedIntent())} disabled={!selectedIntent}>
            {t('trainingHeader.closeIntent')}
          </ChatButton>
        )}
        {activeTab === TRAINING_TABS.INTENTS && <ChatButton onClick={() => setDisplayAddIntentForm(true)}>{t('trainingHeader.addIntent')}</ChatButton>}
        {activeTab === TRAINING_TABS.ARCHIVE && <ChatButton onClick={() => dispatch(getEndedMessages(false))}>{t('chatArchive.refresh')}</ChatButton>}
        {selectedChat && (
          <ChatButton onClick={() => dispatch(clearActiveChat())} disabled={!selectedChat}>
            {t('trainingHeader.closeChat')}
          </ChatButton>
        )}
      </div>

      <AddIntentModal setActive={(e: boolean) => setDisplayAddIntentForm(e)} isActive={displayAddIntentForm} selectedExample="" />
    </ChatHeaderStyles>
  );
};

const ChatHeaderStyles = styled.div`
  align-items: center;
  background-color: #fff;
  border-bottom: 2px solid #f0f1f2;
  display: flex;
  flex-flow: row nowrap;
  height: 50px;
  position: sticky;
  top: 0;
  z-index: 890;

  .chat-tabs {
    display: flex;
    flex-basis: 400px;
  }

  .chat-controls {
    display: flex;
    margin: 0 0 0 auto;
  }
`;

export default TrainingHeader;
