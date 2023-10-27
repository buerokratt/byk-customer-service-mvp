import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { RootState } from '../store';
import { ROLES } from '../utils/constants';
import Administration from '../views/administration/administration';
import Training from '../views/training/training';
import AuthenticationCallback from '../views/authentication-callback';
import Chats from '../views/chats/chats';
import PasswordLogin from '../views/password-login';
import TaraLogin from '../views/tara-login';
import PrivateRoute from './private-route';
import LandingPage from './landing-page';
import Analytics from '../views/analytics/analytics';

const Routes = (): JSX.Element => {
  const { i18n } = useTranslation();
  const { supportedLngs } = i18n.options;
  const isAuthenticated = useSelector((state: RootState) => state.authentication.isAuthenticated);
  const langs = supportedLngs ? supportedLngs.join('|') : 'en|et|cimode';

  const languageSegment = `/:lang(${langs})`;

  const publicRouteComponents = [{ component: TaraLogin, route: '/log-in' }];
  if (window._env_.PASSWORD_AUTH_ENABLED) publicRouteComponents.push({ component: PasswordLogin, route: '/dev-auth' });

  const privateRouteComponents = [
    { component: Chats, route: '/chats', requiredRoles: [ROLES.ROLE_ADMINISTRATOR, ROLES.ROLE_SERVICE_MANAGER, ROLES.ROLE_CUSTOMER_SUPPORT_AGENT] },
    { component: Administration, route: '/administration', requiredRoles: [ROLES.ROLE_ADMINISTRATOR, ROLES.ROLE_SERVICE_MANAGER] },
    { component: Training, route: '/training', requiredRoles: [ROLES.ROLE_ADMINISTRATOR, ROLES.ROLE_CHATBOT_TRAINER] },
    { component: Analytics, route: '/analytics', requiredRoles: [ROLES.ROLE_ADMINISTRATOR, ROLES.ROLE_ANALYST, ROLES.ROLE_SERVICE_MANAGER] },
    {
      component: LandingPage,
      route: '',
      requiredRoles: [ROLES.ROLE_ADMINISTRATOR, ROLES.ROLE_CHATBOT_TRAINER, ROLES.ROLE_CUSTOMER_SUPPORT_AGENT, ROLES.ROLE_SERVICE_MANAGER, ROLES.ROLE_ANALYST],
    },
  ];

  const RoutePublic = ({ component: Component, path }: RouteProps) => <Route component={Component} path={path} />;

  return (
    <RouteStyles className="routes">
      <Switch>
        {publicRouteComponents.map(({ component, route }) => (
          <RoutePublic key={route} path={`${languageSegment}${route}`} exact component={component} />
        ))}
        {privateRouteComponents.map(({ component, route, requiredRoles }) => (
          <PrivateRoute exact key={route} path={`${languageSegment}${route}`} requiredRoles={requiredRoles} component={component} />
        ))}
        <Route path="/auth/callback" exact component={AuthenticationCallback} />
        {!isAuthenticated && <Redirect path="*" to={`/${i18n.language}/log-in`} />}
        <Redirect exact from="/" to={i18n.language} />
      </Switch>
    </RouteStyles>
  );
};

const RouteStyles = styled.div`
  display: flex;
  flex-flow: column wrap;
  flex: 1;
  overflow: hidden;
`;

export default Routes;
