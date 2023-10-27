import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from 'primereact/dialog';
import styled from 'styled-components';
import { InputText } from 'primereact/inputtext';
import { warningNotification } from '../../utils/toast-notifications';
import { ToastContext } from '../../App';
import StyledButton, { StyledButtonType } from '../../styled-components/StyledButton';
import { IntentModel } from '../../model/intent.model';
import { useAppDispatch, useAppSelector } from '../../store';
import { addNewIntent } from '../../slices/training.slice';
import { validationResult } from '../../utils/validation';

type Input = {
  isActive: boolean;
  selectedExample: string;
  setActive: (arg: boolean) => void;
};

const AddIntentModal: React.FC<Input> = (props: Input): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isActive, setActive, selectedExample } = props;
  const [intentName, setIntentName] = useState('');
  const [response, setResponse] = useState('');
  const [examples, setExamples] = useState([selectedExample]);
  const toastContext = useContext(ToastContext);
  const intents = useAppSelector((state) => state.training.intents);

  const clearFields = (): void => {
    setIntentName('');
    setResponse('');
    setExamples([selectedExample || '']);
  };

  const verifyUserInput = (): validationResult => {
    if (!intentName || intentName.trim() === '' || !response || response.trim() === '' || examples.find((example) => example.trim() === '')) {
      return { result: false, resultMessage: t('addIntent.missingInput') };
    }
    if (intents.find((intent) => intent.name === intentName)) {
      return { result: false, resultMessage: t('addIntent.existingIntent') };
    }
    return { result: true, resultMessage: t('addIntent.confirmation') };
  };

  const afterRequestAction = () => {
    const verifyInput = verifyUserInput();

    if (verifyInput.result) {
      const intent: IntentModel = {
        name: intentName.toLowerCase().trim().replaceAll(' ', '_'),
        response: response.trim(),
        inModel: '.tmp',
        examples: examples.map((example) => example.trim()),
      };
      dispatch(addNewIntent(intent));
      setActive(false);
      clearFields();
    } else warningNotification(toastContext, verifyInput.resultMessage, t('toast.warning'));
  };

  const closeModal = () => {
    setActive(false);
    clearFields();
  };

  const addExampleInputField = () => {
    setExamples([...examples, '']);
  };

  const removeExampleInputField = (index: number) => {
    const examplesArray = [...examples];
    examplesArray.splice(index, 1);
    setExamples(examplesArray);
  };

  const setExample = (exampleText: string, index: number) => {
    const examplesArray = [...examples];
    examplesArray[index] = exampleText;
    setExamples(examplesArray);
  };

  return (
    <Dialog
      header={t('addIntent.modalTitle')}
      visible={isActive}
      style={{ width: '50vw' }}
      onHide={() => {
        setActive(false);
        clearFields();
      }}
      draggable={false}
    >
      <AddIntentStyles>
        <div className="p-fluid">
          <span className="p-float-label">
            <InputText id="intentName" className="input-text" value={intentName} onChange={(e) => setIntentName(e.target.value)} type="text" />
            <label htmlFor="intentName">{t('addIntent.intentName')}</label>
          </span>
          <span className="p-float-label">
            <InputText id="response" className="input-text" value={response} onChange={(e) => setResponse(e.target.value)} type="text" />
            <label htmlFor="response">{t('addIntent.response')}</label>
          </span>
          <div className="p-field">
            {examples.map((example, index) => (
              <span className="p-input-icon-right">
                {index === 0 ? (
                  <span className="p-float-label">
                    <InputText id="examples" className="input-text" value={example} onChange={(e) => setExample(e.target.value, index)} type="text" />
                    <label htmlFor="examples">{t('addIntent.examples')}</label>
                  </span>
                ) : (
                  <>
                    <InputText className="input-text without-label" value={example} onChange={(e) => setExample(e.target.value, index)} type="text" />
                    <i
                      role="button"
                      tabIndex={0}
                      className="pi pi-times"
                      onKeyDown={(e) => {
                        if (e.key !== 'Enter') return;
                        e.preventDefault();
                        removeExampleInputField(index);
                      }}
                      onClick={() => removeExampleInputField(index)}
                      aria-label={t('intents.buttonLabel.removeExampleField')}
                    />
                  </>
                )}
              </span>
            ))}
          </div>
          <StyledButton className="submit-button" styleType={StyledButtonType.DARK} onClick={() => afterRequestAction()}>
            {t('addIntent.submitButton')}
          </StyledButton>
          <StyledButton className="close-button" styleType={StyledButtonType.GRAY} onClick={() => closeModal()}>
            {t('addIntent.cancelButton')}
          </StyledButton>
          <StyledButton className="add-example-button" styleType={StyledButtonType.GRAY} onClick={() => addExampleInputField()}>
            {t('addIntent.addExampleButton')}
          </StyledButton>
        </div>
      </AddIntentStyles>
    </Dialog>
  );
};

const AddIntentStyles = styled.div`
  .p-field {
    margin-bottom: 1rem;
  }

  .close-button,
  .submit-button {
    float: right;
  }

  .add-example-button {
    float: left;
  }

  .p-float-label {
    margin: 1.8rem 0 1rem 0;
  }

  .without-label {
    margin: 0.8rem 0 1rem 0;
  }

  .input-text {
    border: 0;
    border-bottom: 2px solid #a7a9ab;
    border-radius: 0;
    color: #000;
    font-size: 1.1em;
    max-height: 30vh;
    transition: 250ms border-bottom-color;

    :enabled:focus {
      box-shadow: unset;
      outline: 0;
    }

    :focus,
    :hover {
      border-bottom-color: #003cff;
    }
  }

  .pi-times:hover {
    cursor: pointer;
    color: #003cff;
  }

  .p-float-label input:focus ~ label {
    color: #003cff;
  }
`;

export default AddIntentModal;
