import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { RootState, useAppDispatch } from '../store';
import { loginWithTaraJwt } from '../slices/authentication.slice';
import { ToastContext } from '../App';

const AuthenticationCallback = (): JSX.Element => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.authentication.isAuthenticated);
  const authenticationFailed = useSelector((state: RootState) => state.authentication.authenticationFailed);
  const { t } = useTranslation();
  const toastContext = useContext(ToastContext);

  useEffect(() => {
    if (isAuthenticated) {
      history.replace('/');
    } else if (authenticationFailed) {
      toastContext?.current?.show({ severity: 'error', summary: t('toast.error'), detail: t('authentication.error') });
      history.replace('/');
    } else {
      dispatch(loginWithTaraJwt());
    }
  }, [dispatch, isAuthenticated, authenticationFailed, history, t, toastContext]);

  return <></>;
};

export default AuthenticationCallback;
