import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styled from "styled-components";
import ChatArchive from "../../components/chat-archive/chat-archive";
import ChatHeader from "../../components/chat-header/chat-header";
import ChatList from "../../components/chat-list/chat-list";
import ChatContent from "../../components/selected-chat/content/chat-content";
import ChatKeypad from "../../components/selected-chat/content/keypad/chat-keypad";
import ChatToolbox from "../../components/selected-chat/toolbox/chat-toolbox";
import useNewMessageNotification from "../../hooks/useNewMessageNotification";
import { RootState, useAppDispatch, useAppSelector } from "../../store";
import { CHAT_TABS } from "../../utils/constants";
import {
  selectActiveSelectedChat,
  setErrorToastMessage,
} from "../../slices/chats.slice";
import useGetActiveChats from "../../hooks/useGetActiveChats";
import {
  successNotification,
  warningNotification,
} from "../../utils/toast-notifications";
import { ToastContext } from "../../App";

const Chats = (): JSX.Element => {
  const selectedChat = useAppSelector((state) =>
    selectActiveSelectedChat(state)
  );
  const activeTab = useSelector((state: RootState) => state.chats.activeTab);
  const { t } = useTranslation();
  const { successToast, errorToast } = useAppSelector((state) => state.chats);
  const toastContext = useContext(ToastContext);
  const dispatch = useAppDispatch();

  useGetActiveChats();
  useNewMessageNotification();

  useEffect(() => {
    if (successToast !== "")
      successNotification(toastContext, t(successToast), t("toast.success"));
  }, [t, toastContext, successToast]);

  useEffect(() => {
    if (errorToast !== "") {
      warningNotification(toastContext, t(errorToast), t("toast.warning"));
      dispatch(setErrorToastMessage(""));
    }
  }, [t, toastContext, dispatch, errorToast]);

  return (
    <ChatStyles>
      <ChatHeader />

      <main className="chat-content">
        {activeTab === CHAT_TABS.TAB_ARCHIVE ? (
          <ChatArchive />
        ) : (
          <>
            <ChatList className="chat-list" />

            {selectedChat ? (
              <>
                <div className="chat-history">
                  <ChatContent selectedChat={selectedChat} />
                  <ChatKeypad />
                </div>

                <ChatToolbox className="chat-toolbox" />
              </>
            ) : (
              <h1 className="chat-unselected">{t("activeChats.unselected")}</h1>
            )}
          </>
        )}
      </main>
    </ChatStyles>
  );
};

const ChatStyles = styled.div`
  display: flex;
  flex-flow: column nowrap;
  flex: 1;
  overflow: hidden;

  /* TODO: Make layout improvements for responsive design:
  * 1. chat-list and chat-toolbox need specific rules
  */

  .chat-list {
    border-right: 2px solid #f0f1f2;
    flex-basis: calc(400px - 0.25rem);
    flex-shrink: 0;
  }

  .chat-toolbox {
    flex-basis: calc(264px - 0.25rem);
    flex-shrink: 0;
  }

  .chat-history {
    background-color: #fff;
    display: flex;
    flex-flow: column nowrap;
    flex: 1;
    margin: 0 2px;
  }

  .chat-content {
    display: flex;
    flex: 1;
    /* NOTE: Subtract header height of 50px */
    height: calc(100% - 50px);
    position: relative;
  }

  .chat-unselected {
    color: #a7a9ab;
    cursor: default;
    font-size: 1.5em;
    font-weight: bold;
    margin: auto;
  }
`;

export default Chats;
