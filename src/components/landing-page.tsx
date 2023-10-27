import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import { ROLE_MATRIX } from '../utils/constants';
import { RootState } from '../store';

const LandingPage = (): JSX.Element => {
  const [roleMatrix] = useState(ROLE_MATRIX);
  const { i18n } = useTranslation();
  const isAuthenticated = useSelector((state: RootState) => state.authentication.isAuthenticated);
  const roles = useSelector((state: RootState) => state.authentication.userAuthorities);

  const getRolePath = (): string => {
    const priorityRole = roleMatrix.find((MatrixRole) => roles.filter((userRole) => userRole === MatrixRole.Role).length !== 0);
    return priorityRole ? priorityRole.url : '';
  };

  const path = isAuthenticated ? getRolePath() : '/log-in';
  return <Redirect exact to={`/${i18n.language}${path}`} />;
};

export default LandingPage;
