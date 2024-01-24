import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import sse from '../services/sse.service';
import { addNewMessages, getMessages, selectActiveSelectedChat, selectEndedSelectedChat } from '../slices/chats.slice';
import { MessageModel } from '../model/message.model';

const useGetNewMessages = (): void => {
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const selectedActiveChat = useAppSelector(state => selectActiveSelectedChat(state));
  const dispatch = useAppDispatch();
  const chatId = useAppSelector((state) => selectEndedSelectedChat(state)?.id);

  useEffect(() => {
    if (!chatId || chatId === '-1' || !isAuthenticated || !selectedActiveChat)
      return;

    const sseInstance = sse(`/${chatId}`);

    sseInstance.onMessage((data: MessageModel[]) => {
      dispatch(addNewMessages(data));
    });

    return () => {
      sseInstance.close();
    }
  }, [chatId, isAuthenticated, selectedActiveChat]);


  useEffect(() => {
    if (chatId && isAuthenticated)
      dispatch(getMessages(chatId));
  }, [chatId, isAuthenticated]);
};

export default useGetNewMessages;
