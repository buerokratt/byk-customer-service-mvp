import { useEffect, useState } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '../store';
import sse from '../services/sse.service';
import { addNewMessages, getMessages, selectActiveSelectedChat } from '../slices/chats.slice';
import { MessageModel } from '../model/message.model';
import chatService from '../services/chat.service';
import { useSelector } from 'react-redux';

const useGetNewMessages = (chatId: string | undefined): void => {
  const selectedActiveChat = useAppSelector(state => selectActiveSelectedChat(state));
  const { lastReadMessageDate } = useAppSelector((state) => state.chats);
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.authentication.isAuthenticated);
  const [lastReadMessageTimestampValue, setLastReadMessageTimestampValue] = useState('');

  useEffect(() => { 
     setLastReadMessageTimestampValue(lastReadMessageDate);
  }, [lastReadMessageDate]);

  useEffect(() => {
    if (!chatId || chatId === '-1' || !isAuthenticated || !selectedActiveChat) return undefined;
    let events: EventSource | undefined;
    if (chatId) {  
      const onMessage = async () => {    
        const messages: MessageModel[] = await chatService.getNewMessages(chatId ?? "",lastReadMessageTimestampValue.split('+')[0]);
        if (messages.length != 0) {
         dispatch(addNewMessages(messages));
        }
      };

      events = sse(`/${chatId}`, onMessage);
    }
    return () => {
      events?.close();
    };
  }, [isAuthenticated, dispatch, lastReadMessageDate, chatId, selectedActiveChat]);

  useEffect(() => {
    if (chatId && isAuthenticated) dispatch(getMessages(chatId));
  }, [dispatch, chatId, isAuthenticated]);
};

export default useGetNewMessages;
