import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { IntentModel } from '../../model/intent.model';
import StyledButton, { StyledButtonType } from '../../styled-components/StyledButton';
import { useAppDispatch, useAppSelector } from '../../store';
import { clearSelectedIntentExample, getIntent, selectSelectedIntent, setSelectedIntent } from '../../slices/training.slice';
import { isLobaIntent } from '../../utils/validation';

interface IntentListItemProps {
  intent: IntentModel;
}

const IntentListItem = (props: IntentListItemProps): JSX.Element => {
  const { intent } = props;
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const selectedIntent = useAppSelector((state) => selectSelectedIntent(state));
  const isSelectedIntent = Boolean(selectedIntent && selectedIntent.name === intent.name);
  const examplesLoading = useAppSelector((state) => state.training.examplesLoading);
  const blacklistedIntentNames = useAppSelector((state) => state.training.blacklistedIntentNames);

  const changeSelectedIntentAndClearSelectedIntentExample = (intentId: string) => {
    dispatch(clearSelectedIntentExample());
    dispatch(setSelectedIntent(intentId));
    dispatch(getIntent(intentId));
  };

  const isBlacklistedIntent = (intentName: string) => !!blacklistedIntentNames.find((blIntent) => blIntent === intentName);

  return (
    <IntentListItemStyles isSelected={isSelectedIntent} isLobaIntent={isLobaIntent(intent.name)} isBlacklisted={isBlacklistedIntent(intent.name)}>
      <div>
        <div className="top">
          <p className="top-info">
            <div className="intent-name">
              <strong>{t('intentListItem.name')}:</strong>
            </div>
          </p>
        </div>
        <div className="middle">{intent.name}</div>
      </div>
      <div className="bottom">
        {!isSelectedIntent && (
          <StyledButton
            tabIndex={0}
            role="button"
            styleType={StyledButtonType.GRAY}
            className="open-intent"
            disabled={examplesLoading}
            onClick={() => changeSelectedIntentAndClearSelectedIntentExample(intent.name)}
          >
            {t('intentListItem.openIntent')}
          </StyledButton>
        )}
      </div>
    </IntentListItemStyles>
  );
};

const selectedIntentListStyles = css`
  background-color: #f0f1f2;
  border-left-color: #003cff;
  border-right-color: transparent;

  .bottom {
    color: #000;
  }
`;

const IntentListItemStyles = styled.div<{ isSelected: boolean; isLobaIntent: boolean; isBlacklisted: boolean }>`
  background-color: #fff;
  display: flex;
  flex-flow: column wrap;
  border: 0;
  border-left: 4px solid transparent;
  border-right: 6px solid
    ${(props) => {
      if (props.isLobaIntent) return '#8b7883';
      if (props.isBlacklisted) return '#3c0078';
      return 'transparent';
    }};
  padding: 0.5rem;
  position: relative;
  transition: background-color 250ms, border-left-color 250ms, color 250ms;
  margin: 0 0 2px 0;
  justify-content: space-between;
  height: 117px;

  ::after {
    background-color: #f0f1f2;
    bottom: -2px;
    content: '';
    display: block;
    height: 2px;
    left: -4px;
    position: absolute;
    right: 0;
    width: calc(100% + 4px);
  }

  .top-info {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  p {
    margin: 0.25rem 0;
  }

  .top,
  .bottom {
    display: flex;
    font-size: 0.8em;
    justify-content: flex-end;
  }

  .middle {
    font-size: 0.8em;
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

  .open-intent {
    margin: 0;
  }

  ${(props) => props.isSelected && selectedIntentListStyles}
`;

export default IntentListItem;
