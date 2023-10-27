import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputTextarea } from 'primereact/inputtextarea';
import styled, { css } from 'styled-components';
import StyledButton, { StyledButtonType } from '../../styled-components/StyledButton';
import {
  clearSelectedIntentExample,
  deleteIntentExample,
  setSelectedIntentExample,
  setSelectedIntentExampleValue,
  updateIntentExample,
} from '../../slices/training.slice';
import { useAppDispatch, useAppSelector } from '../../store';
import ConfirmationModal from '../confirmation-modal/confirmation-modal';

type IntentExampleListItemProps = {
  example: string;
};

const IntentExampleListItem = (props: IntentExampleListItemProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { example } = props;
  const [userInput, setUserInput] = useState('');
  const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
  const selectedInstantExample = useAppSelector((state) => state.training.selectedExample);
  const selectedIntentName = useAppSelector((state) => state.training.selectedIntentName);
  const isSelectedIntentExample = Boolean(selectedInstantExample && selectedInstantExample === example);

  const changeExampleValue = (intentExample: string) => {
    setUserInput(intentExample);
    dispatch(setSelectedIntentExample(intentExample));
  };

  const deleteExample = (intentExample: string) => {
    dispatch(deleteIntentExample({ intent: selectedIntentName, example: intentExample }));
  };

  const setIntentExampleNewValue = () => {
    dispatch(setSelectedIntentExampleValue(userInput));
    dispatch(updateIntentExample({ intent: selectedIntentName, oldExample: selectedInstantExample, newExample: userInput }));
    dispatch(clearSelectedIntentExample());
  };

  return (
    <IntentExampleListItemStyles isSelected={isSelectedIntentExample}>
      <div className="example-box">
        {example === selectedInstantExample && (
          <>
            <InputTextarea className="example-value-textarea" value={userInput} autoResize onChange={(event) => setUserInput(event.target.value)} />
            <div className="active-example-buttons">
              <StyledButton tabIndex={0} styleType={StyledButtonType.DARK} className="save-button" onClick={() => setIntentExampleNewValue()}>
                {t('intents.buttonLabel.save')}
              </StyledButton>
              <StyledButton tabIndex={0} styleType={StyledButtonType.GRAY} className="cancel-button" onClick={() => dispatch(clearSelectedIntentExample())}>
                {t('intents.buttonLabel.cancel')}
              </StyledButton>
            </div>
          </>
        )}
        {example !== selectedInstantExample && (
          <>
            <div className="example-text">{example}</div>
            <div className="example-actions">
              <StyledButton tabIndex={0} styleType={StyledButtonType.GRAY} className="change-button" onClick={() => setDisplayConfirmationModal(true)}>
                {t('intents.buttonLabel.deleteExample')}
              </StyledButton>
              <StyledButton tabIndex={0} styleType={StyledButtonType.GRAY} className="change-button" onClick={() => changeExampleValue(example)}>
                {t('intents.buttonLabel.change')}
              </StyledButton>
            </div>
          </>
        )}
      </div>
      <ConfirmationModal
        isActive={displayConfirmationModal}
        setActive={(e) => setDisplayConfirmationModal(e)}
        affirmativeAction={() => {
          deleteExample(example);
          setDisplayConfirmationModal(false);
        }}
        negativeAction={() => setDisplayConfirmationModal(false)}
        headerText={t('trainingCommands.deleteExampleConfirmation')}
      />
    </IntentExampleListItemStyles>
  );
};

const SelectedExampleIntentListStyles = css`
  border-left-color: #003cff;
  box-shadow: 2px 4px 6px #adc0ff;

  .example-box {
    border: 1.5px solid #003cff;
  }
`;

const IntentExampleListItemStyles = styled.div<{ isSelected: boolean }>`
  border-left: 4px solid transparent;
  transition: background-color 250ms, border-left-color 250ms, color 250ms;

  .example-text {
    margin: 1rem;
  }

  .example-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 0.3rem;
    border: 1.5px solid #969696;
    box-shadow: ${(props) => (props.isSelected ? '' : '2px 4px 4px #d9d9d9')};
    align-items: center;
  }

  .change-button {
    margin: 1rem;
    max-height: 35px;
  }

  .save-button {
    margin: 1rem 1rem 0 1rem;
  }

  .cancel-button {
    margin: 0.5rem 1rem 1rem 1rem;
  }

  .active-example-buttons {
    display: flex;
    flex-direction: column;
  }

  .example-value-textarea {
    width: 100%;
    margin: 1rem;
  }

  .example-actions {
    display: flex;
  }

  ${(props) => props.isSelected && SelectedExampleIntentListStyles}
`;

export default IntentExampleListItem;
