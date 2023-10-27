import React from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROLES } from '../utils/constants';
import { RootState } from '../store';
import UnauthorizedPage from './unauthorized-page';

interface IOwnProps extends RouteProps {
  requiredRoles: ROLES[] | undefined;
}

const PrivateRoute = ({ component: Component, path, requiredRoles }: IOwnProps): JSX.Element => {
  const userAuthorities = useSelector((state: RootState) => state.authentication.userAuthorities);

  if (!requiredRoles) return <Route component={Component} path={path} />;
  const matches = requiredRoles.filter((requiredRole) => userAuthorities.find((authority) => authority === requiredRole));
  if (matches.length > 0) return <Route component={Component} path={path} />;

  return <UnauthorizedPage />;
};

export default PrivateRoute;
