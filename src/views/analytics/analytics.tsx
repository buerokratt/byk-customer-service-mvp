import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useAppDispatch } from '../../store';
import { loginAnalytics } from '../../slices/authentication.slice';

const Analytics = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(loginAnalytics()).then(() => {
      window.open(window._env_.ANALYTICS_URL, 'Analytics');
      history.goBack();
    });
  }, [dispatch, history]);

  return <></>;
};
export default Analytics;
