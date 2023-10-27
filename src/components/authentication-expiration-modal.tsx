import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch, useAppSelector } from '../store';
import { customJwtExtend, logoutUser } from '../slices/authentication.slice';
import { removeSupportFromChat } from '../slices/chats.slice';

const AuthenticationExpirationModal = (): JSX.Element => {
  const { i18n, t } = useTranslation();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const [visibility, setVisibility] = useState(false);
  const customerSupportId = useAppSelector((state) => state.authentication.customerSupportId);
  const JWTExpirationTimestamp: string | null = useSelector((state: RootState) => state.authentication.jwtExpirationTimestamp);

  useEffect(() => {
    const checkAuthenticationVerification = () => {
      if (JWTExpirationTimestamp === null) return;
      const timeLeftUntilExpiry = Number(JWTExpirationTimestamp) - Date.now();
      setVisibility(timeLeftUntilExpiry < 5 * 60 * 1000);
      if (timeLeftUntilExpiry <= 0) {
        dispatch(removeSupportFromChat(customerSupportId)).then(() => {
          dispatch(logoutUser());
          history.push(`/${i18n.language}/log-in`);
        });
      }
    };

    checkAuthenticationVerification();
    const expirationInterval: NodeJS.Timer = setInterval(() => checkAuthenticationVerification(), 10000);

    return () => clearInterval(expirationInterval);
  }, [JWTExpirationTimestamp, customerSupportId, dispatch, history, i18n.language]);

  const footer = () => (
    <div>
      <Button label={t('authentication.expirationModule.extend')} icon="pi pi-check" onClick={() => dispatch(customJwtExtend())} />
      <Button
        label={t('authentication.expirationModule.end')}
        icon="pi pi-times"
        onClick={() => {
          dispatch(removeSupportFromChat(customerSupportId)).then(() => {
            dispatch(logoutUser());
            history.push(`/${i18n.language}/log-in`);
          });
        }}
      />
    </div>
  );

  return (
    <Dialog
      header={t('authentication.expirationModule.header')}
      footer={footer}
      onHide={() => visibility}
      visible={visibility}
      position="top"
      blockScroll
      closable={false}
      draggable={false}
      resizable={false}
      closeOnEscape={false}
    >
      {t('authentication.expirationModule.description')}
    </Dialog>
  );
};

export default AuthenticationExpirationModal;
