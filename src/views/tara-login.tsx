import React, { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { ReactComponent as BuerokrattLogo } from '../static/buerokratt_logo.svg';
import EU_SF_logo_src from '../static/sf_logo_horizontal.jpg';
import NEXT_GEN_FLAGS from '../static/NextGen_Rahastanud_EL_NextGeneration.jpg';
import StyledButton, { StyledButtonType } from '../styled-components/StyledButton';
import { RootState } from '../store';
import { ROLE_MATRIX } from '../utils/constants';

const TaraLogin = (): ReactElement => {
  const { t, i18n } = useTranslation();
  const isAuthenticated = useSelector((state: RootState) => state.authentication.isAuthenticated);
  const roles = useSelector((state: RootState) => state.authentication.userAuthorities);
  const history = useHistory();

  const [roleMatrix] = useState(ROLE_MATRIX);

  useEffect(() => {
    const getRolePath = (): string => {
      const priorityRole = roleMatrix.find((MatrixRole) => {
        const filterResult = roles.filter((userRole) => userRole === MatrixRole.Role);
        return filterResult.length !== 0;
      });
      if (priorityRole === undefined) return '';
      return priorityRole.url;
    };
    const path = isAuthenticated ? getRolePath() : '/log-in';
    history.push(`/${i18n.language}${path}`);
  }, [isAuthenticated, roleMatrix, i18n, roles, history]);

  const navigateToTARA = () => {
    window.location.href = window._env_.TARA_REDIRECT_URL;
  };

  return (
    <>
      {!isAuthenticated && (
        <LoginStyles>
          <div className="login">
            <BuerokrattLogo className="byk-logo" />
            <h1 className="byk-title">{window._env_.AUTHORITY_NAME}</h1>
            <StyledButton className="login-button" styleType={StyledButtonType.LIGHT} onClick={navigateToTARA}>
              {t('routes.loginWithTara')}
            </StyledButton>
          </div>

          <div className="footer">
            <img className="eu-sf-logo" src={EU_SF_logo_src} alt={t('legal.EU_SF')} height="112" width="194" />
            <img className="next-gen-flags" src={NEXT_GEN_FLAGS} alt={t('legal.NEXT_GEN')} height="112" width="247" />
          </div>
        </LoginStyles>
      )}
    </>
  );
};

const LoginStyles = styled.div`
  background-color: #003cff;
  display: flex;
  flex-flow: column wrap;
  height: 100vh;
  width: 100vw;

  .eu-sf-logo {
    margin-top: 3px;
    margin-right: 0.5rem;
  }

  .next-gen-flags {
    margin-left: 0.5rem;
  }

  .byk-logo {
    max-width: 400px;
  }

  .byk-title {
    font-size: 22px;
    color: #fff;
    margin: 0 0 20px 0;
  }

  .login {
    align-items: center;
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;
    justify-content: center;
  }

  .login-button {
    min-width: 200px;
  }

  .footer {
    align-items: center;
    background-color: #fff;
    display: flex;
    justify-content: center;
    padding: 16px 0;
  }
`;

export default TaraLogin;
