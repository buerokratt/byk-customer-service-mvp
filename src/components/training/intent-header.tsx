import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { IntentModel } from '../../model/intent.model';
import { INTENT_EXAMPLES_AMOUNT_TO_BE_IN_MODEL } from '../../utils/constants';

type IntentContentProps = {
  selectedIntent: IntentModel;
  displayMetaData: boolean;
} & HTMLAttributes<HTMLElement>;

const IntentHeader = (props: IntentContentProps): JSX.Element => {
  const { selectedIntent, displayMetaData } = props;
  const { t } = useTranslation();

  return (
    <IntentHeaderStyles>
      <div className="intent-content-header">
        <div className="header-left">
          <div>
            <strong>{t('intentListItem.name')}:</strong>
            &nbsp;{selectedIntent.name}
          </div>
        </div>
        <div className="header-right">
          {displayMetaData && (
            <>
              <div>
                <strong>{t('intentListItem.examples')}: </strong>
                {selectedIntent.examples.length > INTENT_EXAMPLES_AMOUNT_TO_BE_IN_MODEL
                  ? selectedIntent.examples.length
                  : `${selectedIntent.examples.length}/${INTENT_EXAMPLES_AMOUNT_TO_BE_IN_MODEL + 1}`}
              </div>
              <div className="in-model">
                <strong>{t('intentListItem.inModel')}:</strong>
                <div className={selectedIntent.inModel === '.yml' ? 'in-model-green' : 'in-model-red'}>
                  &nbsp;{selectedIntent.inModel === '.yml' ? t('intents.inModel') : t('intents.notInModel')}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="border" />
    </IntentHeaderStyles>
  );
};

const IntentHeaderStyles = styled.div`
  .intent-content-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 80px;
    margin: 0 15px 0 15px;
  }

  .header-left,
  .header-right {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }

  .in-model {
    display: flex;
    flex-direction: row;
  }

  .in-model-green {
    color: #4d9460;
  }

  .in-model-red {
    color: #eb3f3f;
  }

  .border {
    border-bottom: 2px solid #f0f1f2;
  }
`;

export default IntentHeader;
