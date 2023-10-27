import React, { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { ReactComponent as BuerokrattLogo } from '../static/buerokratt_logo.svg';
import EU_SF_logo_src from '../static/sf_logo_horizontal.jpg';
import StyledButton, { StyledButtonType } from '../styled-components/StyledButton';
import { RootState, useAppDispatch } from '../store';
import { loginUser } from '../slices/authentication.slice';
import './password-login.scss';
import { ROLE_MATRIX } from '../utils/constants';

const PasswordLogin = (): ReactElement => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [login, setLogin] = useState('');
  const { t, i18n } = useTranslation();
  const isAuthenticated = useSelector((state: RootState) => state.authentication.isAuthenticated);
  const roles = useSelector((state: RootState) => state.authentication.userAuthorities);
  const [pass, setPass] = useState('');

  const [roleMatrix] = useState(ROLE_MATRIX);

  useEffect(() => {
    const getRolePath = (): string => {
      const priorityRole = roleMatrix.find((MatrixRole) => roles.filter((userRole) => userRole === MatrixRole.Role).length !== 0);
      return priorityRole ? priorityRole.url : '';
    };

    if (roles.length === 0) return;
    const path = getRolePath();
    history.push(`/${i18n.language}${path}`);
  }, [history, roleMatrix, i18n, roles]);

  const submitForm = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    dispatch(loginUser({ login, pass }));
  };

  return (
    <>
      {!isAuthenticated && (
        <div className="byk-login">
          <div className="login">
            <BuerokrattLogo className="byk-logo" />
            <h1 className="byk-title">{window._env_.AUTHORITY_NAME}</h1>
            <form>
              <div className="byk-login-form">
                <InputText placeholder="user name" value={login} onChange={(e) => setLogin(e.target.value)} />
                <Password placeholder="password" value={pass} onChange={(e) => setPass(e.target.value)} feedback={false} />
              </div>
            </form>
            <StyledButton className="login-button" styleType={StyledButtonType.LIGHT} onClick={submitForm}>
              {t('routes.loginWithPassword')}
            </StyledButton>
          </div>

          <div className="footer">
            <img src={EU_SF_logo_src} alt={t('legal.EU_SF')} height="112" width="194" />
          </div>
        </div>
      )}
    </>
  );
};

export default PasswordLogin;
