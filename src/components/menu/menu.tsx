import { Menubar } from 'primereact/menubar';
import { MenuItem, MenuItemCommandParams } from 'primereact/menuitem';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import logo from '../../static/buerokratt.svg';
import { RootState, useAppDispatch } from '../../store';
import { ROLES, TRAINING_TABS } from '../../utils/constants';
import LogoutButton from '../logout/logout-button';
import { setActiveTrainingTab } from '../../slices/training.slice';

export const Menu = (): JSX.Element => {
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const authentication = useSelector((state: RootState) => state.authentication);
  const dispatch = useAppDispatch();
  const [tabMenuModel, setTabMenuModel] = useState<MenuItem[]>([]);
  const navigateToUrl = (event: MenuItemCommandParams) => {
    event.originalEvent.preventDefault();
    dispatch(setActiveTrainingTab(TRAINING_TABS.INTENTS));

    if (event.item.linkType === 'external' && event.item.url) window.open(event.item.url);
    else if (event.item.url) history.push(`/${i18n.language}${event.item.url}`);
  };
  const [menuBase] = useState([
    {
      requiredRoles: [ROLES.ROLE_ADMINISTRATOR, ROLES.ROLE_SERVICE_MANAGER, ROLES.ROLE_CUSTOMER_SUPPORT_AGENT],
      label: t('menu.chat'),
      url: '/chats',
      security: 'private',
      linkType: 'local',
      command: navigateToUrl,
    },
    {
      requiredRoles: [ROLES.ROLE_ADMINISTRATOR, ROLES.ROLE_CHATBOT_TRAINER],
      label: t('menu.training'),
      url: '/training',
      security: 'private',
      linkType: 'local',
      command: navigateToUrl,
    },
    {
      requiredRoles: [ROLES.ROLE_ADMINISTRATOR, ROLES.ROLE_ANALYST, ROLES.ROLE_SERVICE_MANAGER],
      label: t('menu.analytics'),
      url: '/analytics',
      security: 'private',
      linkType: 'local',
      command: navigateToUrl,
    },
    {
      requiredRoles: [ROLES.ROLE_ADMINISTRATOR, ROLES.ROLE_SERVICE_MANAGER],
      label: t('menu.administration'),
      url: '/administration',
      security: 'private',
      linkType: 'local',
      command: navigateToUrl,
    },
    {
      requiredRoles: [ROLES.ROLE_ADMINISTRATOR, ROLES.ROLE_SERVICE_MANAGER],
      label: t('menu.monitoring'),
      url: window._env_.MONITORING_URL,
      security: 'private',
      linkType: 'external',
      command: navigateToUrl,
    },
  ]);

  const userHasRequiredRole = useCallback(
    (requiredRoles) => {
      if (!authentication.userAuthorities) return false;
      const match = requiredRoles.filter((requiredRole: ROLES) => authentication.userAuthorities.includes(requiredRole));
      return match.length > 0;
    },
    [authentication.userAuthorities],
  );

  useEffect(() => {
    const updateMenu = () =>
      menuBase
        .filter((item) => !(item.security === 'private' && !authentication.isAuthenticated))
        .filter((item) => !(item.requiredRoles !== undefined && !userHasRequiredRole(item.requiredRoles)))
        .map((item) => (`/${i18n.language}${item.url}` === history.location.pathname ? { ...item, className: 'active' } : item));

    setTabMenuModel(updateMenu());
    return history.listen(() => setTabMenuModel(updateMenu()));
  }, [history, history.location.pathname, i18n.language, authentication.isAuthenticated, menuBase, userHasRequiredRole]);

  const start = <img className="logo" alt="logo" src={logo} width="40px" />;
  return <MenubarStyles start={start} model={tabMenuModel} end={<LogoutButton />} />;
};

// TODO: Whole component could use a proper refactoring, currently it's an uphill battle against PrimeReact
const MenubarStyles = styled(Menubar)`
  background-color: #003cff;
  border: 0;
  border-radius: 0;
  min-height: 50px;
  max-height: 50px;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 900;

  .p-menubar-start {
    display: flex;
  }

  .p-menubar-end {
    .p-button {
      background: transparent;
      border: 0;
      padding-right: 16px;

      :focus {
        box-shadow: unset;
      }
    }
  }

  .logo {
    padding: 0.25em;
    margin-left: 1em;
    margin-right: 1em;
  }

  .p-menuitem-link {
    :hover {
      background-color: #003cff !important;
    }

    :focus {
      box-shadow: unset !important;
    }

    .p-menuitem-text {
      color: #fff !important;
    }
  }

  .p-menubar-root-list {
    background-color: #003cff;

    .p-menuitem {
      border-top: 3px solid transparent;
      border-bottom: 3px solid transparent;

      &.active {
        border-top: 3px solid #fff;
      }
    }
  }
`;

export default Menu;
