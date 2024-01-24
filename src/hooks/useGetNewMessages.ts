import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import sse from '../services/sse.service';
import { addNewMessages, selectActiveSelectedChat } from '../slices/chats.slice';
import { MessageModel } from '../model/message.model';

const useGetNewMessages = (chatId: string | undefined): void => {
  const { isAuthenticated } = useAppSelector((state) => state.authentication);
  const selectedActiveChat = useAppSelector((state) => selectActiveSelectedChat(state));
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!chatId || chatId === '-1' || !isAuthenticated || !selectedActiveChat) return undefined;
    const sseInstance = sse(`cs-get-new-messages?chatId=${chatId}`);

    sseInstance.onMessage((data: MessageModel[]) => {
      dispatch(addNewMessages(data));
    });

    return () => {
      sseInstance.close();
    };
  }, [isAuthenticated, chatId, selectedActiveChat]);
};

export default useGetNewMessages;
