import { InputNumber } from 'primereact/inputnumber';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { ToastContext } from '../../App';
import { getSessionLengthMinutes, setLoginSessionLength, setSessionLength } from '../../slices/configuration.slice';
import { RootState, useAppDispatch } from '../../store';
import StyledButton, { StyledButtonType } from '../../styled-components/StyledButton';
import { AGENT_SESSION_LENGTH_MAX, AGENT_SESSION_LENGTH_MIN } from '../../utils/constants';
import { successNotification, warningNotification } from '../../utils/toast-notifications';

const SessionLength = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const sessionLengthMinutes: number = useSelector((state: RootState) => state.configuration.sessionLengthMinutes);
  const { t } = useTranslation();
  const toastContext = useContext(ToastContext);

  useEffect(() => {
    if (sessionLengthMinutes === 0) dispatch(getSessionLengthMinutes());
  }, [sessionLengthMinutes, dispatch]);

  return (
    <SessionViewStyle>
      <div className="p-grid p-fluid">
        <div className="greeting-header">
          <label className="greeting-label" htmlFor="greeting">
            {t('administrate.sessionLengthTitle')}
          </label>
          {/* <div className="greeting-spacing" /> */}
        </div>

        <div>
          <InputNumber
            placeholder={t('administrate.sessionLengthPlaceholder')}
            value={sessionLengthMinutes}
            onValueChange={(e) => dispatch(setSessionLength(e.value || AGENT_SESSION_LENGTH_MIN))}
            min={AGENT_SESSION_LENGTH_MIN}
            max={AGENT_SESSION_LENGTH_MAX}
            allowEmpty={false}
            suffix=" min"
          />
          <small className="greeting-message" id="greeting-message">
            {t('administrate.sessionLengthHelperText')}
          </small>

          <div className="submit-button">
            <StyledButton
              onClick={() => {
                dispatch(setLoginSessionLength())
                  .then(() => {
                    successNotification(toastContext, t('administrate.sessionLengthConfirmation'), t('toast.success'));
                  })
                  .catch(() => {
                    warningNotification(toastContext, t('administrate.sessionLengthServerError'), t('toast.error'));
                  });
              }}
              styleType={StyledButtonType.GRAY}
            >
              {t('actions.save')}
            </StyledButton>
          </div>
        </div>
      </div>
    </SessionViewStyle>
  );
};

const SessionViewStyle = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 3rem auto 0 auto;

  .greeting-header {
    margin: 0 0 1rem 0;
  }

  .submit-button {
    display: flex;
    justify-content: flex-end;
    color: #a7a9ab;
    margin: 1.5rem 0 0 0;
  }

  .greeting-message {
    color: #a7a9ab;
  }
`;
export default SessionLength;
