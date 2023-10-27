import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Dialog } from 'primereact/dialog';
import StyledButton, { StyledButtonType } from '../../../styled-components/StyledButton';
import { useAppDispatch, useAppSelector } from '../../../store';
import { deleteIntent } from '../../../slices/training.slice';

interface DeleteIntentModalProps {
  isActive: boolean;
  setActive: (arg: boolean) => void;
}

export default function DeleteIntentModal(props: DeleteIntentModalProps): JSX.Element {
  const { t } = useTranslation();
  const { setActive, isActive } = props;
  const dispatch = useAppDispatch();
  const selectedIntentName = useAppSelector((state) => state.training.selectedIntentName);

  const affirmativeAction = () => {
    dispatch(deleteIntent(selectedIntentName));
    setActive(false);
  };

  return (
    <Dialog header={t('intents.deleteIntentModal.header')} visible={isActive} onHide={() => setActive(false)} draggable={false}>
      <ConfirmationModalStyles>
        <div className="content" role="dialog" aria-modal="true" aria-labelledby="delete_intent_modal_title">
          <div className="actions">
            <StyledButton className="submit-button" styleType={StyledButtonType.DARK} onClick={() => affirmativeAction()}>
              {t('intents.deleteIntentModal.accept')}
            </StyledButton>
            <StyledButton className="submit-button" styleType={StyledButtonType.DARK} onClick={() => setActive(false)}>
              {t('intents.deleteIntentModal.decline')}
            </StyledButton>
          </div>
        </div>
      </ConfirmationModalStyles>
    </Dialog>
  );
}

const ConfirmationModalStyles = styled.div`
  width: 20vw;

  .p-field {
    margin: 0.5rem 0 1rem 0;
  }

  .block {
    font-weight: bold;
  }

  .close-button,
  .submit-button {
    float: right;
  }

  .add-example-button {
    float: left;
  }

  .input-text {
    margin-top: 0.2rem;
  }

  .pi-times-circle:hover {
    cursor: pointer;
    color: #003cff;
  }
`;
