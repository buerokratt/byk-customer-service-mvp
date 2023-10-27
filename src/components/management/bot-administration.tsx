import { SelectButton } from 'primereact/selectbutton';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { getIsBotActive, setIsBotActive } from '../../slices/configuration.slice';
import { ToastContext } from '../../App';
import { warningNotification } from '../../utils/toast-notifications';

const BotAdministration = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const botConfig = useSelector((state: RootState) => state.configuration.botConfig);
  const toastContext = useContext(ToastContext);

  useEffect(() => {
    dispatch(getIsBotActive()).catch(() => {
      warningNotification(toastContext, t('administrate.greetingTextServerError'), t('toast.error'));
    });
  }, [dispatch, t, toastContext]);

  const dispatchIsBotActive = (isActive: boolean) => {
    dispatch(setIsBotActive({ isActive }));
  };

  return (
    <BotAdministrationStyle>
      <div className="p-grid p-fluid">
        <div className="bot-administration-header">
          <div className="bot-administration-label">{t('administrate.bot.isActiveLabel')}</div>
          <div className="bot-administration-spacing" />
          {botConfig.fetchingIsActive && <ProgressSpinner className="bot-administration-spinner" />}
          <div className="bot-administration-toggle-button">
            <SelectButton
              disabled={botConfig.fetchingIsActive}
              value={botConfig.isActive}
              optionLabel="label"
              options={[
                { label: t('administrate.enabledLabel'), value: true, disabled: botConfig.isActive },
                { label: t('administrate.disabledLabel'), value: false, disabled: !botConfig.isActive },
              ]}
              onChange={(e) => dispatchIsBotActive(e.value)}
            />
          </div>
        </div>
        <small className="bot-administration" id="bot-administration">
          {t('administrate.bot.isActiveDescription')}
        </small>
      </div>
    </BotAdministrationStyle>
  );
};

const BotAdministrationStyle = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 2rem auto 0 auto;

  .bot-administration-toggle-button {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 0.25rem;
  }

  .bot-administration-header {
    display: flex;
    margin-bottom: 1rem;

    .bot-administration-spacing {
      flex: 1;
    }
  }

  .bot-administration-label {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
  }

  .bot-administration-spinner {
    height: 2rem;
  }

  .input-area {
    margin-top: 1rem;
  }

  .bot-administration {
    color: #a7a9ab;
  }
`;

export default BotAdministration;
