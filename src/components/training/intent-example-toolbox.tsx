import React, { HTMLAttributes, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { InputTextarea } from 'primereact/inputtextarea';
import StyledButton, { StyledButtonType } from '../../styled-components/StyledButton';
import { addIntentToModel, removeIntentFromModel, saveIntentResponse } from '../../slices/training.slice';
import { IntentModel } from '../../model/intent.model';
import { useAppDispatch, useAppSelector } from '../../store';
import AddExampleModal from './add-example-modal';
import DeleteIntentModal from './delete-intent-modal/delete-intent-modal';
import { isLobaIntent } from '../../utils/validation';

type IntentContentProps = {
  selectedIntent: IntentModel;
} & HTMLAttributes<HTMLElement>;

const IntentExampleToolbox = (props: IntentContentProps): JSX.Element => {
  const { t } = useTranslation();
  const { selectedIntent } = props;
  const [responseUserInput, setResponseUserInput] = useState(selectedIntent.response);
  const [displayAddExampleForm, setDisplayAddExampleForm] = useState(false);
  const [displayDeleteIntentForm, setDisplayDeleteIntentForm] = useState(false);
  const [disableResponseTextarea, setDisableResponseTextarea] = useState(true);
  const examplesLoading = useAppSelector((state) => state.training.examplesLoading);
  const intentResponseUpdating = useAppSelector((state) => state.training.intentResponseUpdating);
  const blacklistedIntentNames = useAppSelector((state) => state.training.blacklistedIntentNames);
  const lobaIntent = isLobaIntent(selectedIntent.name);
  const isBlacklistedIntent = !!blacklistedIntentNames.find((blIntent) => blIntent === selectedIntent.name);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setResponseUserInput(selectedIntent.response);
  }, [selectedIntent]);

  const saveResponseAndDisableTextarea = () => {
    dispatch(saveIntentResponse({ intent: selectedIntent.name, response: responseUserInput }));
    setDisableResponseTextarea(true);
  };

  const addToModel = () => {
    dispatch(addIntentToModel(selectedIntent.name));
  };

  const removeFromModel = () => {
    dispatch(removeIntentFromModel(selectedIntent.name));
  };

  return (
    <IntentExampleToolboxStyles>
      <div className="intent-activities">
        <strong className="activities-text">{t('intents.toolbox.activities')}</strong>
        <StyledButton
          tabIndex={0}
          role="button"
          styleType={StyledButtonType.GRAY}
          className="activity-button"
          onClick={() => setDisplayAddExampleForm(true)}
          disabled={examplesLoading}
        >
          {t('intents.buttonLabel.addExample')}
        </StyledButton>
        <StyledButton
          tabIndex={0}
          role="button"
          styleType={StyledButtonType.GRAY}
          className="activity-button"
          onClick={() => setDisplayDeleteIntentForm(true)}
          disabled={examplesLoading || isLobaIntent(selectedIntent.name) || isBlacklistedIntent}
        >
          {t('intents.buttonLabel.deleteIntent')}
        </StyledButton>
        {selectedIntent.inModel === '.yml' && (
          <StyledButton
            tabIndex={0}
            role="button"
            styleType={StyledButtonType.GRAY}
            className="activity-button"
            onClick={() => removeFromModel()}
            disabled={examplesLoading || intentResponseUpdating || lobaIntent || isBlacklistedIntent}
          >
            {t('intents.buttonLabel.removeIntent')}
          </StyledButton>
        )}
        {selectedIntent.inModel === '.tmp' && (
          <StyledButton
            tabIndex={0}
            role="button"
            styleType={StyledButtonType.GRAY}
            className="activity-button"
            onClick={() => addToModel()}
            disabled={examplesLoading || intentResponseUpdating || lobaIntent || isBlacklistedIntent}
          >
            {t('intents.buttonLabel.addIntent')}
          </StyledButton>
        )}
      </div>
      <div className="border" />
      <div className="response">
        <strong className="response-title">{t('intents.toolbox.response')}</strong>
        <InputTextarea
          className="response-textarea"
          aria-label={t('intents.response.label')}
          value={responseUserInput}
          rows={12}
          autoResize
          disabled={disableResponseTextarea}
          onChange={(event) => setResponseUserInput(event.target.value)}
        />
        <div className="bottom">
          {disableResponseTextarea ? (
            <StyledButton
              tabIndex={0}
              role="button"
              styleType={StyledButtonType.GRAY}
              className="change-response-button"
              onClick={() => setDisableResponseTextarea(false)}
              disabled={examplesLoading || intentResponseUpdating || lobaIntent || isBlacklistedIntent}
            >
              {t('intents.buttonLabel.changeResponse')}
            </StyledButton>
          ) : (
            <StyledButton
              tabIndex={0}
              role="button"
              styleType={StyledButtonType.GRAY}
              className="change-response-button"
              onClick={() => saveResponseAndDisableTextarea()}
              disabled={examplesLoading || intentResponseUpdating || lobaIntent || isBlacklistedIntent}
            >
              {t('intents.buttonLabel.saveResponse')}
            </StyledButton>
          )}
        </div>
      </div>

      <AddExampleModal setActive={(e: boolean) => setDisplayAddExampleForm(e)} isActive={displayAddExampleForm} selectedExample="" />
      <DeleteIntentModal setActive={(e: boolean) => setDisplayDeleteIntentForm(e)} isActive={displayDeleteIntentForm} />
    </IntentExampleToolboxStyles>
  );
};

const IntentExampleToolboxStyles = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 25%;

  .activities-text {
    margin: 1rem;
  }

  .intent-activities {
    display: flex;
    flex-direction: column;
  }

  .activity-button {
    margin: 0 1rem 1rem 1rem;
    height: 45px;
  }

  .border {
    margin-top: 10px;
    border-bottom: 2px solid #f0f1f2;
  }

  .request-example,
  .response {
    display: flex;
    flex-direction: column;
    margin: 1rem;
  }

  .request-example-title,
  .response-title {
    margin-bottom: 1.5rem;
    font-size: 18px;
  }

  .bottom {
    display: flex;
    justify-content: flex-end;
  }

  .change-request-example-button,
  .change-response-button {
    height: 45px;
    margin: 1rem 0 0 0;
  }
`;

export default IntentExampleToolbox;
