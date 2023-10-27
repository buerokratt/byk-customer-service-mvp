import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';
import IntentListItem from './intent-list-item';
import { IntentModel } from '../../model/intent.model';
import { useAppSelector } from '../../store';

const IntentList = (props: HTMLAttributes<HTMLElement>): JSX.Element => {
  const intents = useAppSelector((state) => state.training.intents);

  return (
    <IntentListStyles {...props}>
      {intents.map((intent: IntentModel) => (
        <IntentListItem key={intent.name} intent={intent} />
      ))}
    </IntentListStyles>
  );
};

const IntentListStyles = styled.div`
  overflow-y: auto;
`;

export default IntentList;
