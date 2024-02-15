import { useEffect, useState } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '../store';
import sse from '../services/sse.service';
import { addNewMessages, getMessages, selectActiveSelectedChat, selectEndedSelectedChat } from '../slices/chats.slice';
import { MessageModel } from '../model/message.model';
import chatService from '../services/chat.service';
import { useSelector } from 'react-redux';

const useGetNewMessages = (chatId: string | undefined): void => {
  const selectedActiveChat = useAppSelector(state => selectActiveSelectedChat(state));
  const { lastReadMessageDate } = useAppSelector((state) => state.chats);
  const dispatch = useAppDispatch();
  const [sseUrl, setSseUrl] = useState('');
  const [lastReadMessageTimestampValue, setLastReadMessageTimestampValue] = useState('');
  const isAuthenticated = useSelector((state: RootState) => state.authentication.isAuthenticated);
  
  useEffect(() => {
    if(lastReadMessageDate && !lastReadMessageTimestampValue){
      setLastReadMessageTimestampValue(lastReadMessageDate);
    }
  }, [lastReadMessageDate]);

  useEffect(() => {
    if(!chatId || chatId === '-1') {
      setSseUrl('');
    } else if (chatId) {
      setSseUrl(`/${chatId}`);
    }
  }, [chatId, lastReadMessageTimestampValue, selectedActiveChat]);

  useEffect(() => {
    let events: EventSource | undefined;
    if (chatId) {  
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
  }, [chatId]);

  useEffect(() => {
    if (chatId && isAuthenticated)
      dispatch(getMessages(chatId));
  }, [chatId, isAuthenticated]);
};

export default useGetNewMessages;
