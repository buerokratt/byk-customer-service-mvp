import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ReactComponent as BuerokrattLogo } from '../static/buerokratt_logo.svg';
import EU_SF_logo_src from '../static/sf_logo_horizontal.jpg';
import NEXT_GEN_FLAGS from '../static/NextGen_Rahastanud_EL_NextGeneration.jpg';
import { RootState, useAppSelector } from '../store';
import StyledButton, { StyledButtonType } from '../styled-components/StyledButton';

const UnauthorizedPage = (): JSX.Element => {
  const isAuthenticated = useAppSelector((state: RootState) => state.authentication.isAuthenticated);
  const { t, i18n } = useTranslation();

  const navigateToLoginPage = () => {
    window.location.href = `/${i18n.language}/log-in`;
  };

  return (
    <>
      {!isAuthenticated && (
        <UnauthorizedStyles>
          <div className="login">
            <BuerokrattLogo className="byk-logo" />
            <h1 className="byk-title">{window._env_.AUTHORITY_NAME}</h1>
            <h1 className="byk-title">{t('routes.unauthorized')}</h1>
            <StyledButton styleType={StyledButtonType.LIGHT} onClick={navigateToLoginPage}>
              {t('routes.goLoginPage')}
            </StyledButton>
          </div>
          <div className="footer">
            <img className="eu-sf-logo" src={EU_SF_logo_src} alt={t('legal.EU_SF')} height="112" width="194" />
            <img className="next-gen-flags" src={NEXT_GEN_FLAGS} alt={t('legal.NEXT_GEN')} height="112" width="247" />
          </div>
        </UnauthorizedStyles>
      )}
    </>
  );
};

const UnauthorizedStyles = styled.div`
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

export default UnauthorizedPage;
