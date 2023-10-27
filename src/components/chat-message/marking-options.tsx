import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import StyledButton, { StyledButtonType } from '../../styled-components/StyledButton';
import AddIntentModal from '../training/add-intent-modal';
import AddExampleModal from '../training/add-example-modal';

interface input {
  message: string;
  setShowMarkingOptionsModal: (arg: boolean) => void;
}

const MarkingOptions = (props: input): JSX.Element => {
  const { t } = useTranslation();
  const { setShowMarkingOptionsModal, message } = props;
  const [displayAddIntentForm, setDisplayAddIntentForm] = useState(false);
  const [displayAddExampleForm, setDisplayAddExampleForm] = useState(false);

  return (
    <>
      <div className="marking-options">
        <StyledButton className="create-intent" styleType={StyledButtonType.GRAY} onClick={() => setDisplayAddIntentForm(true)}>
          {t('intents.buttonLabel.createIntent')}
        </StyledButton>

        <StyledButton className="add-example" styleType={StyledButtonType.GRAY} onClick={() => setDisplayAddExampleForm(true)}>
          {t('intents.buttonLabel.addAsExample')}
        </StyledButton>

        <i
          role="button"
          tabIndex={0}
          className="pi pi-times"
          onKeyDown={() => setShowMarkingOptionsModal(false)}
          onClick={() => setShowMarkingOptionsModal(false)}
          aria-label={t('intents.buttonLabel.closeMarkingOptions')}
        />
      </div>
      <div className="arrow-down" />
      <div className="inner-arrow" />
      <AddIntentModal setActive={(e: boolean) => setDisplayAddIntentForm(e)} isActive={displayAddIntentForm} selectedExample={message} />
      <AddExampleModal setActive={(e: boolean) => setDisplayAddExampleForm(e)} isActive={displayAddExampleForm} selectedExample={message} />
    </>
  );
};

export default MarkingOptions;
