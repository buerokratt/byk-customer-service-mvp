import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Dialog } from 'primereact/dialog';
import StyledButton, { StyledButtonType } from '../../styled-components/StyledButton';

interface ConfirmationModalProps {
  isActive: boolean;
  setActive: (arg: boolean) => void;
  affirmativeAction: (arg: React.MouseEvent<HTMLButtonElement>) => void;
  negativeAction: (arg: React.MouseEvent<HTMLButtonElement>) => void;
  headerText: string;
}

export default function ConfirmationModal(props: ConfirmationModalProps): JSX.Element {
  const { t } = useTranslation();
  const { setActive, isActive, affirmativeAction, negativeAction, headerText } = props;

  return (
    <Dialog header={headerText} visible={isActive} onHide={() => setActive(false)} draggable={false}>
      <ConfirmationModalStyles>
        <div className="content" role="dialog" aria-modal="true" aria-labelledby="confirmation_modal_title">
          <div className="actions">
            <StyledButton className="submit-button" styleType={StyledButtonType.DARK} onClick={(e) => affirmativeAction(e)}>
              {t('intents.deleteIntentModal.accept')}
            </StyledButton>
            <StyledButton className="submit-button" styleType={StyledButtonType.DARK} onClick={(e) => negativeAction(e)}>
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
