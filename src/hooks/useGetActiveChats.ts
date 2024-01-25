import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { setActiveChats } from '../slices/chats.slice';
import chatService from '../services/chat.service';

const useGetActiveChats = (): void => {
  const { customerSupportId } = useAppSelector((state) => state.authentication);
  const dispatch = useAppDispatch();

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
