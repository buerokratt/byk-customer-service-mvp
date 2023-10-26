import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useSound from 'use-sound';
import { RootState, useAppDispatch } from '../store';
import { resetNewMessagesAmount } from '../slices/chats.slice';
import dingMp3 from '../static/ding.mp3';

const useNewMessageNotification = (): void => {
  const newMessagesAmount = useSelector((state: RootState) => state.chats.newMessagesAmount);
  const [ding] = useSound(dingMp3);
  const dispatch = useAppDispatch();
  const title = 'Bürokratt';
  
  useEffect(() => {
    const onVisibilityChange = () => {
      document.title = title;
      dispatch(resetNewMessagesAmount());
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  });

  useEffect(() => {
    if (newMessagesAmount === 0) return;
    document.title = `(${newMessagesAmount}) uus sõnum! - ${title}`;
    ding();
  }, [newMessagesAmount]);
};

export default useNewMessageNotification;
