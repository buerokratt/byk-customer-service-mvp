import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

type CharacterCounterProps = {
  userInput: string;
  maxCharLimit: number;
  warningCharLimit: number;
  visibilityLimit: number;
} & HTMLAttributes<HTMLElement>;

const CharacterCounter = (props: CharacterCounterProps): JSX.Element => {
  const { className, userInput = '', maxCharLimit, warningCharLimit, visibilityLimit } = props;
  const currentCount = userInput.length;
  const warning = currentCount >= warningCharLimit;
  const isVisible = currentCount >= visibilityLimit;

  return (
    <CharacterCounterStyles warning={warning} isVisible={isVisible} className={className}>
      {currentCount}/{maxCharLimit}
    </CharacterCounterStyles>
  );
};

const CharacterCounterStyles = styled.div<{ warning: boolean; isVisible: boolean }>`
  color: ${(props) => (props.warning ? '#ff4800' : '#a7a9ab')};
  visibility: ${(props) => (props.isVisible ? 'visible' : 'hidden')};
  font-size: 0.7rem;
  margin-top: 2px;
`;

export default CharacterCounter;
