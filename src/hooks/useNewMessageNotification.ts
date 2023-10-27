import { useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import { resetNewMessagesAmount } from '../slices/chats.slice';

const useNewMessageNotification = (): void => {
  const newMessagesAmount = useSelector((state: RootState) => state.chats.newMessagesAmount);
  const dingEffect = useMemo(() => new Audio(`${process.env.PUBLIC_URL}/ding.mp3`), []);
  const dispatch = useAppDispatch();
  const title = 'Bürokratt';

  const playDingEffect = useCallback(() => {
    dingEffect.play();
  }, [dingEffect]);

  useEffect(() => {
    const onVisibilityChange = () => {
      document.title = title;
      dispatch(resetNewMessagesAmount());
    };

    const onCanPlayThrough = () => {
      if (newMessagesAmount === 0) return;
      playDingEffect();
    };

    document.addEventListener('visibilitychange', onVisibilityChange, false);
    dingEffect.addEventListener('canplaythrough', onCanPlayThrough);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      document.removeEventListener('canplaythrough', onVisibilityChange);
    };
  });

  useEffect(() => {
    if (newMessagesAmount === 0) return;
    playDingEffect();
    document.title = `(${newMessagesAmount}) uus sõnum! - ${title}`;
  }, [newMessagesAmount, playDingEffect]);
};

export default useNewMessageNotification;
