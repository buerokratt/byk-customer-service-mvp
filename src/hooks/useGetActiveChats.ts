import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { setActiveChats } from '../slices/chats.slice';
import chatService from '../services/chat.service';
import sse from '../services/sse.service';
import { Chat } from '../model/chat.model';

const useGetActiveChats = (): void => {
  const { customerSupportId } = useAppSelector((state) => state.authentication);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let events: EventSource | undefined;
    if (customerSupportId) {  
      const onMessage = async () => {    
       const chats: Chat[] = await chatService.getAllActiveChats();
        if (chats !== undefined) {
        dispatch(setActiveChats({ customerSupportId, data: chats, checkNewMessages: true }));
      }
      };

      events = sse('/chat-list', onMessage);
    }
    return () => {
      events?.close();
    };
  }, [customerSupportId, dispatch]);

  useEffect(() => {
    chatService.getActiveChats()
      .then(chats => {
        dispatch(setActiveChats({ 
          customerSupportId,
          data: chats,
          checkNewMessages: false,
        }));
      });      
  }, []);
};

export default useGetActiveChats;
