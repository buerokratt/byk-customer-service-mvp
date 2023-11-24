import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import { resetNewMessagesAmount } from '../slices/chats.slice';
import { useDing } from './useSound';

const useNewMessageNotification = (): void => {
  const newMessagesAmount = useSelector((state: RootState) => state.chats.newMessagesAmount);
  const [ding] = useDing();
  const dispatch = useAppDispatch();
  const title = 'Bürokratt';

  useEffect(() => {
    const onVisibilityChange = () => {
      document.title = title;
      dispatch(resetNewMessagesAmount());
    };

    document.addEventListener('visibilitychange', onVisibilityChange, false);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  });

  useEffect(() => {
    if (newMessagesAmount === 0) return;
    ding?.play();
    document.title = `(${newMessagesAmount}) uus sõnum! - ${title}`;
  }, [newMessagesAmount]);
};

export default useNewMessageNotification;
