import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from 'primereact/dialog';
import styled from 'styled-components';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { warningNotification } from '../../utils/toast-notifications';
import { ToastContext } from '../../App';
import StyledButton, { StyledButtonType } from '../../styled-components/StyledButton';
import { useAppDispatch, useAppSelector } from '../../store';
import { addNewExample } from '../../slices/training.slice';
import { validationResult } from '../../utils/validation';

interface Input {
  isActive: boolean;
  selectedExample: string;
  setActive: (arg: boolean) => void;
}

interface DropDownIntentModel {
  name: string;
  code: string;
}

const AddExampleModal: React.FC<Input> = (props: Input): JSX.Element => {
  const { isActive, setActive, selectedExample } = props;
  const { t } = useTranslation();
  const [example, setExample] = useState(selectedExample);
  const dispatch = useAppDispatch();
  const toastContext = useContext(ToastContext);
  const [dropDownIntents, setDropDownIntents] = useState<DropDownIntentModel[]>();
  const [selectedDropDownIntent, setSelectedDropDownIntent] = useState<DropDownIntentModel>();
  const selectedIntentName = useAppSelector((state) => state.training.selectedIntentName);
  const intents = useAppSelector((state) => state.training.intents);

  useEffect(() => {
    if (intents) {
      const formattedIntents = intents.map((e) => ({ name: e.name, code: e.name }));
      setDropDownIntents(formattedIntents);
    }
  }, [intents]);

  const verifyUserInput = (): validationResult => {
    if (!example || example.trim() === '') {
      return { result: false, resultMessage: t('addIntent.missingInput') };
    }
    if (!!selectedExample && (!selectedDropDownIntent?.name || selectedDropDownIntent.name.trim() === '')) {
      return { result: false, resultMessage: t('addIntent.missingInput') };
    }
    return { result: true, resultMessage: t('addIntent.confirmation') };
  };

  const afterRequestAction = () => {
    const verifyInput = verifyUserInput();

    if (verifyInput.result) {
      dispatch(addNewExample({ intent: selectedDropDownIntent?.name || selectedIntentName, example }));
      setActive(false);
      setExample(selectedExample || '');
      setSelectedDropDownIntent({ name: '', code: '' });
    } else warningNotification(toastContext, verifyInput.resultMessage, t('toast.warning'));
  };

  const closeModal = () => {
    setActive(false);
    setExample(selectedExample || '');
    setSelectedDropDownIntent({ name: '', code: '' });
  };

  return (
    <Dialog
      header={t('addIntent.addExampleButton')}
      visible={isActive}
      onHide={() => {
        setActive(false);
        setExample('');
      }}
      draggable={false}
    >
      <AddExampleStyles>
        <div className="p-fluid">
          {!!selectedExample && (
            <span className="p-float-label">
              <Dropdown
                className="input-text"
                id="intentName"
                value={selectedDropDownIntent}
                options={dropDownIntents}
                onChange={(e) => setSelectedDropDownIntent(e.value)}
                optionLabel="name"
              />
              <label htmlFor="intentName">{t('addIntent.intentName')}</label>
            </span>
          )}
          <span className="p-float-label">
            <InputText className="input-text" id="example" value={example} onChange={(e) => setExample(e.target.value)} type="text" />
            <label htmlFor="example">{t('addIntent.example')}</label>
          </span>
          <StyledButton className="submit-button" styleType={StyledButtonType.DARK} onClick={() => afterRequestAction()}>
            {t('addIntent.submitButton')}
          </StyledButton>
          <StyledButton className="close-button" styleType={StyledButtonType.GRAY} onClick={() => closeModal()}>
            {t('addIntent.cancelButton')}
          </StyledButton>
        </div>
      </AddExampleStyles>
    </Dialog>
  );
};

const AddExampleStyles = styled.div`
  width: 50vw;

  .p-float-label {
    margin: 1.7rem 0 1rem 0;
  }

  .close-button,
  .submit-button {
    float: right;
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

  .p-float-label input:focus ~ label {
    color: #003cff;
  }
`;

export default AddExampleModal;
