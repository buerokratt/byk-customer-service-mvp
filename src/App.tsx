import React, { ReactElement, RefObject, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { addLocale } from 'primereact/api';
import { Menu } from './components/menu/menu';
import Routes from './components/routes';
import { getUserinfo, verifyAuthentication } from './slices/authentication.slice';
import { useAppDispatch, useAppSelector } from './store';
import { SESSION_STORAGE_JWT_VERIFY } from './utils/constants';
import AuthenticationExpirationModal from './components/authentication-expiration-modal';

declare global {
  interface Window {
    _env_: {
      RUUTER_API_URL: string;
      TIM_API_URL: string;
      TARA_REDIRECT_URL: string;
      ANALYTICS_URL: string;
      MONITORING_URL: string;
      AUTHORITY_NAME: string;
      PASSWORD_AUTH_ENABLED: boolean;
      INSTITUTION_FORWARDING_ENABLED: boolean;
    };
  }
}
export const ToastContext = React.createContext<RefObject<Toast> | null>(null);

const App = (): ReactElement => {
  const dispatch = useAppDispatch();
  const toast = useRef<Toast>(null);
  const isAuthenticated = useAppSelector((state) => state.authentication.isAuthenticated);

  addLocale('et', {
    firstDayOfWeek: 1,
    dayNames: ['esmaspäev', 'teisipäev', 'kolmapäev', 'neljapäev', 'reede', 'laupäev', 'pühapäev'],
    dayNamesShort: ['es', 'te', 'ko', 'ne', 're', 'la', 'pü'],
    dayNamesMin: ['E', 'T', 'K', 'N', 'R', 'L', 'P'],
    monthNames: ['jaanuar', 'veebruar', 'märts', 'aprill', 'mai', 'juuni', 'juuli', 'august', 'september', 'oktoober', 'november', 'detsember'],
    monthNamesShort: ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'det'],
    today: 'Täna',
    clear: 'Tühjenda',
  });

  useEffect(() => {
    if (window.sessionStorage.getItem(SESSION_STORAGE_JWT_VERIFY)) dispatch(verifyAuthentication());
    if (!isAuthenticated) return;

    dispatch(getUserinfo());
    window.sessionStorage.setItem(SESSION_STORAGE_JWT_VERIFY, 'true');
  }, [isAuthenticated, dispatch]);

  return (
    <>
      <ToastContext.Provider value={toast}>
        <Toast ref={toast} />
        {isAuthenticated && <AuthenticationExpirationModal />}
        {isAuthenticated && <Menu />}
        <Routes />
      </ToastContext.Provider>
    </>
  );
};

export default App;
