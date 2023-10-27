import { InputTextarea } from 'primereact/inputtextarea';
import { SelectButton } from 'primereact/selectbutton';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import StyledButton, { StyledButtonType } from '../../styled-components/StyledButton';
import { RootState, useAppDispatch } from '../../store';
import { getGreetingMessage, GreetingMessage, setActiveToggle, setGreetingEst, setGreetingMessage } from '../../slices/configuration.slice';
import CharacterCounter from '../character-counter/character-counter';
import { CheckAgainstCharacterLimit } from '../../utils/validation';
import { ToastContext } from '../../App';
import { successNotification, warningNotification } from '../../utils/toast-notifications';
import { MESSAGE_MAX_CHAR_LIMIT, MESSAGE_VISIBILITY_LIMIT, MESSAGE_WARNING_CHAR_LIMIT } from '../../utils/constants';

const Greetings = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const greetingMessage: GreetingMessage = useSelector((state: RootState) => state.configuration.greetingMessage);
  const isInitialGreetingMessage = useSelector((state: RootState) => state.configuration.isInitialGreetingMessage);
  const needsUpdate: boolean = useSelector((state: RootState) => state.configuration.needsUpdate);
  const toastContext = useContext(ToastContext);

  useEffect(() => {
    dispatch(getGreetingMessage());
  }, [dispatch, needsUpdate]);

  const isActiveHandler = () => {
    dispatch(setActiveToggle({ newStatusValue: !greetingMessage.isActive }))
      .then(() => {
        successNotification(toastContext, t('administrate.greetingStatusConfirmation'), t('toast.success'));
      })
      .catch(() => {
        warningNotification(toastContext, t('administrate.greetingTextServerError'), t('toast.error'));
      });
  };

  const saveHandler = () => {
    if (CheckAgainstCharacterLimit(greetingMessage.est)) {
      dispatch(
        setGreetingMessage({
          est: greetingMessage.est.replaceAll(/\n/g, '\\n'),
          eng: '',
          isActive: greetingMessage.isActive,
        }),
      )
        .then(() => {
          successNotification(toastContext, t('administrate.greetingTextConfirmation'), t('toast.success'));
        })
        .catch(() => {
          warningNotification(toastContext, t('administrate.greetingTextServerError'), t('toast.error'));
        });
    }
  };

  return (
    <GreetingsStyle>
      <div className="p-grid p-fluid">
        <div className="greeting-header">
          <label className="greeting-label" htmlFor="greeting">
            {t('administrate.greetingLabel')}
          </label>
          <div className="greeting-spacing" />
          <div className="greeting-toggle-button">
            <SelectButton
              disabled={isInitialGreetingMessage}
              value={greetingMessage.isActive}
              optionLabel="label"
              options={[
                { label: t('administrate.enabledLabel'), value: true, disabled: greetingMessage.isActive },
                { label: t('administrate.disabledLabel'), value: false, disabled: !greetingMessage.isActive },
              ]}
              onChange={() => isActiveHandler()}
            />
          </div>
        </div>
        <div className="p-inputgroup input-area">
          <InputTextarea
            rows={5}
            autoResize
            placeholder={t('administrate.estGreetingInputPlaceholder')}
            value={greetingMessage.est.replaceAll(/\\n/g, '\n')}
            onChange={(e) => {
              dispatch(setGreetingEst(e.target.value));
            }}
            id="greeting"
            aria-describedby="greeting-message"
          />
        </div>
        <div className="word-counter">
          <CharacterCounter
            userInput={greetingMessage.est}
            maxCharLimit={MESSAGE_MAX_CHAR_LIMIT}
            visibilityLimit={MESSAGE_VISIBILITY_LIMIT}
            warningCharLimit={MESSAGE_WARNING_CHAR_LIMIT}
          />
        </div>
        <small className="greeting-message" id="greeting-message">
          {t('administrate.greetingMessage')}
        </small>
        <div className="submit-button">
          <StyledButton onClick={saveHandler} styleType={StyledButtonType.GRAY}>
            {t('actions.save')}
          </StyledButton>
        </div>
      </div>
    </GreetingsStyle>
  );
};

const GreetingsStyle = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 2rem auto 0 auto;

  .greeting-toggle-button {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 0.25rem;
  }

  .greeting-header {
    display: flex;

    .greeting-spacing {
      flex: 1;
    }
  }

  .greeting-label {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
  }

  .input-area {
    margin-top: 1rem;
  }

  .word-counter {
    display: flex;
    justify-content: flex-end;
    margin: 0.5rem 0 0 0;
  }

  .greeting-message {
    color: #a7a9ab;
  }

  .submit-button {
    display: flex;
    justify-content: flex-end;
    color: #a7a9ab;
    margin: 1.5rem 0 0 0;
  }
`;

export default Greetings;
