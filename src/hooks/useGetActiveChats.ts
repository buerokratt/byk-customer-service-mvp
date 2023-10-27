import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import sse from '../services/sse.service';
import { Chat } from '../model/chat.model';
import { setActiveChats } from '../slices/chats.slice';

const useGetActiveChats = (): void => {
  const { customerSupportId } = useAppSelector((state) => state.authentication);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const sseInstance = sse('cs-get-all-active-chats');

    sseInstance.onMessage((data: Chat[]) => {
      if (data !== undefined) {
        dispatch(setActiveChats({ customerSupportId, data, checkNewMessages: true }));
      }
    });

    return () => {
      sseInstance.close();
    };
  }, [customerSupportId, dispatch]);
};

export default useGetActiveChats;
