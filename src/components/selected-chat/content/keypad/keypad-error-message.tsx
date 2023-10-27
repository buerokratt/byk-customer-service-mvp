import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

type KeypadErrorMessageType = {
  children: string;
} & HTMLAttributes<HTMLElement>;

const KeypadErrorMessage = (props: KeypadErrorMessageType): JSX.Element => {
  const { children } = props;
  return children ? <ErrorMessageComponentStyles>{children}</ErrorMessageComponentStyles> : <></>;
};

const ErrorMessageComponentStyles = styled.div`
  background-color: #fcedc5;
  color: #3c0078;
  display: flex;
  font-size: 0.9em;
  justify-content: center;
  padding: 0.5rem 0;
`;

export default KeypadErrorMessage;
