import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import sse from '../services/sse.service';
import { addNewMessages, getMessages, selectActiveSelectedChat, selectEndedSelectedChat } from '../slices/chats.slice';
import { MessageModel } from '../model/message.model';
import chatService from '../services/chat.service';

const useGetNewMessages = (): void => {
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const selectedActiveChat = useAppSelector(state => selectActiveSelectedChat(state));
  const { lastReadMessageDate } = useAppSelector((state) => state.chats);
  const dispatch = useAppDispatch();
  const [sseUrl, setSseUrl] = useState('');
  const chatId = useAppSelector((state) => selectEndedSelectedChat(state)?.id);
  const [lastReadMessageTimestampValue, setLastReadMessageTimestampValue] = useState('');
  
  useEffect(() => {
    if(lastReadMessageDate && !lastReadMessageTimestampValue){
      setLastReadMessageTimestampValue(lastReadMessageDate);
    }
  }, [lastReadMessageDate]);

  useEffect(() => {
    if(!chatId) {
      setSseUrl('');
    }
    else if (chatId && lastReadMessageTimestampValue) {
      setSseUrl(`/${chatId}`);
    }
  }, [chatId, lastReadMessageTimestampValue, isAuthenticated, selectedActiveChat]);

  useEffect(() => {
    let events: EventSource | undefined;
    if (sseUrl) {  
      const onMessage = async () => {    
        const messages: MessageModel[] = await chatService.getNewMessages(chatId ?? "",lastReadMessageTimestampValue.split('+')[0]);
        if (messages.length != 0) {
         setLastReadMessageTimestampValue(messages[messages.length - 1].created ?? `${lastReadMessageDate}`);
         dispatch(addNewMessages(messages));
        }
      };

      events = sse(sseUrl, onMessage);
    }
    return () => {
      events?.close();
    };
  }, [sseUrl]);

  useEffect(() => {
    if (chatId && isAuthenticated)
      dispatch(getMessages(chatId));
  }, [chatId, isAuthenticated]);
};

export default useGetNewMessages;
