import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { InputNumber } from 'primereact/inputnumber';
import { useSelector } from 'react-redux';
import { SelectButton } from 'primereact/selectbutton';
import StyledButton, { StyledButtonType } from '../../styled-components/StyledButton';
import {
  setEstimatedWaitingTimeLength,
  getEstimatedWaitingTime,
  EstimatedWaiting,
  setEstimateWaitingTimeActivityToggle,
  setEstimatedWaitingTime,
} from '../../slices/configuration.slice';
import { successNotification, warningNotification } from '../../utils/toast-notifications';
import { RootState, useAppDispatch } from '../../store';
import { ToastContext } from '../../App';
import { DEFAULT_WAITING_TIME_LENGTH, ESTIMATED_WAITING_TIME_MAX, ESTIMATED_WAITING_TIME_MIN } from '../../utils/constants';

const EstimatedWaitingTime = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const estimatedWaiting: EstimatedWaiting = useSelector((state: RootState) => state.configuration.estimatedWaiting);
  const { t } = useTranslation();
  const toastContext = useContext(ToastContext);

  useEffect(() => {
    if (estimatedWaiting.time === 0) dispatch(getEstimatedWaitingTime());
  }, [estimatedWaiting.time, dispatch]);

  const isActiveHandler = async () => {
    const result = await dispatch(setEstimateWaitingTimeActivityToggle({ newStatusValue: !estimatedWaiting.isActive }));
    if (result.meta.requestStatus === 'fulfilled') {
      successNotification(toastContext, t('administrate.estimatedWaitingStatusConfirmation'), t('toast.success'));
    } else warningNotification(toastContext, t('administrate.estimatedWaitingStatusServerError'), t('toast.error'));
  };

  const setWaitingTime = async () => {
    const result = await dispatch(setEstimatedWaitingTime({ time: estimatedWaiting.time }));
    if (result.meta.requestStatus === 'fulfilled') {
      successNotification(toastContext, t('administrate.estimatedWaitingTimeConfirmation'), t('toast.success'));
    } else warningNotification(toastContext, t('administrate.estimatedWaitingTimeServerError'), t('toast.error'));
  };

  return (
    <WaitingTimeViewStyle>
      <div className="p-grid p-fluid">
        <div className="greeting-header">
          <label className="greeting-label" htmlFor="greeting">
            {t('administrate.estimatedWaitingTimeTitle')}
          </label>
          <div className="greeting-toggle-button">
            <SelectButton
              value={estimatedWaiting.isActive}
              optionLabel="label"
              options={[
                { label: t('administrate.enabledLabel'), value: true, disabled: estimatedWaiting.isActive },
                { label: t('administrate.disabledLabel'), value: false, disabled: !estimatedWaiting.isActive },
              ]}
              onChange={() => isActiveHandler()}
            />
          </div>
        </div>

        <div>
          <InputNumber
            placeholder={t('administrate.estimatedWaitingTimePlaceholder')}
            value={estimatedWaiting.time}
            onValueChange={(e) => dispatch(setEstimatedWaitingTimeLength(e.value || DEFAULT_WAITING_TIME_LENGTH))}
            allowEmpty={false}
            min={ESTIMATED_WAITING_TIME_MIN}
            max={ESTIMATED_WAITING_TIME_MAX}
            suffix=" min"
          />
          <small className="greeting-message" id="greeting-message">
            {t('administrate.estimatedWaitingTimeHelperText')}
          </small>

          <div className="submit-button">
            <StyledButton onClick={() => setWaitingTime()} styleType={StyledButtonType.GRAY}>
              {t('actions.save')}
            </StyledButton>
          </div>
        </div>
      </div>
    </WaitingTimeViewStyle>
  );
};

const WaitingTimeViewStyle = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 3rem auto 0 auto;

  .greeting-header {
    margin: 0 0 1rem 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
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
export default EstimatedWaitingTime;
