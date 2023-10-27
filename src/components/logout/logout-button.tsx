import React, { ReactElement } from 'react';
import { Button } from 'primereact/button';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { logoutUser } from '../../slices/authentication.slice';
import { useAppDispatch, useAppSelector } from '../../store';
import { removeSupportFromChat } from '../../slices/chats.slice';

const LogoutButton = (): ReactElement => {
  const customerSupportId = useAppSelector((state) => state.authentication.customerSupportId);
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

  const logout = () => {
    dispatch(removeSupportFromChat(customerSupportId)).then(() => {
      dispatch(logoutUser());
      history.push(`/${i18n.language}/log-in`);
    });
  };

  return <Button onClick={logout}>{t('routes.logout')}</Button>;
};

export default LogoutButton;
