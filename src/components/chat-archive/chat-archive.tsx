import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import ChatContent from '../selected-chat/content/chat-content';
import ChatArchiveTable from './chat-archive-table';
import { clearActiveChat, getEndedMessages, selectEndedSelectedChat, setArchiveSuccessToast } from '../../slices/chats.slice';
import { useAppDispatch, useAppSelector } from '../../store';
import ChatContentHeader from '../selected-chat/content/header/chat-content-header';
import { successNotification } from '../../utils/toast-notifications';
import { ToastContext } from '../../App';

const ChatArchive = (): JSX.Element => {
  const selectedChat = useAppSelector((state) => selectEndedSelectedChat(state));
  const archiveSuccessToast = useAppSelector((state) => state.chats.archiveSuccessToast);
  const toastContext = useContext(ToastContext);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (archiveSuccessToast !== '') {
      successNotification(toastContext, t(archiveSuccessToast), t('toast.success'));
      dispatch(setArchiveSuccessToast(''));
    }
  }, [t, toastContext, archiveSuccessToast, dispatch]);

  useEffect(() => {
    dispatch(clearActiveChat());
    dispatch(getEndedMessages(true));
  }, [dispatch]);

  return (
    <>
      <ChatArchiveTable isOpen={Boolean(selectedChat)} />
      {selectedChat && (
        <SelectedChatStyles>
          <ChatContentHeader />
          <ChatContent />
        </SelectedChatStyles>
      )}
    </>
  );
};

const SelectedChatStyles = styled.div`
  background-color: #fff;
  border-left: 2px solid #f0f1f2;
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  width: 40vw;
`;

export default ChatArchive;
