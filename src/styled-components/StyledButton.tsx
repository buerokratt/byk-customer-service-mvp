/* eslint-disable react/require-default-props */
/* eslint-disable no-shadow */
import React, { HTMLAttributes, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { ASK_PERMISSION_BUTTON_TIMEOUT_MS } from '../utils/constants';

export enum StyledButtonType {
  LIGHT = 'LIGHT',
  GRAY = 'GRAY',
  DARK = 'DARK',
  GREEN = 'GREEN',
}

type StyledButtonProps = {
  active?: boolean;
  children?: ReactNode;
  disabled?: boolean; // NOTE: Does not exist in HTMLButtonElement
  styleType: StyledButtonType;
  timeout?: number; // NOTE: Does not exist in HTMLButtonElement
} & HTMLAttributes<HTMLButtonElement>;

export default function StyledButton(props: StyledButtonProps): JSX.Element {
  const { children, disabled, timeout } = props;

  return children ? (
    <StyledButtonStyles {...props} disabled={disabled} timeout={timeout}>
      {children}
    </StyledButtonStyles>
  ) : (
    <></>
  );
}

const activeStyles = css`
  background-color: #003cff;
  color: #fff;
`;

const lightStyles = css`
  background-color: #fff;
  color: #003cff;

  :hover {
    background-color: #f0f1f2;
  }
`;
const grayStyles = css`
  background-color: #f0f1f2;
  color: #003cff;

  :hover {
    background-color: #003cff;
    color: #fff;
  }
`;
const darkStyles = css`
  background-color: #003cff;
  color: #f0f1f2;

  :hover {
    background-color: #003cff;
    color: #fff;
  }
`;

const greenStyles = css`
  background-color: #65a580;
  color: #f0f1f2;

  :hover {
    background-color: #1d4432;
  }
`;

const StyledButtonStyles = styled.button<StyledButtonProps>`
  border: 0;
  cursor: pointer;
  font-family: 'Aino Regular';
  font-size: 1em;
  margin: 0 0.5rem;
  position: relative;
  padding: 0.5rem 1.5rem;
  transition: 250ms color, 250ms background-color;
  white-space: nowrap;

  &[disabled] {
    background-color: #f0f1f2;
    color: #a7a9ab;
    cursor: not-allowed;

    :hover,
    :focus {
      background-color: #f0f1f2;
      color: #a7a9ab;
    }
  }

  &[disabled] > .bg {
    animation: scroll ${(props) => (props.timeout || ASK_PERMISSION_BUTTON_TIMEOUT_MS) / 1000}s linear forwards;
    background-color: #e82c35;

    opacity: 0.6;
    left: 0;
    bottom: 0;
    right: 0;
    top: 0;
    position: absolute;
  }

  @keyframes scroll {
    0% {
      right: ${(props) => 100 - ((props.timeout || ASK_PERMISSION_BUTTON_TIMEOUT_MS) / ASK_PERMISSION_BUTTON_TIMEOUT_MS) * 100}%;
    }

    100% {
      right: 100%;
    }
  }

  ${(props) => props.styleType === StyledButtonType.LIGHT && lightStyles}
  ${(props) => props.styleType === StyledButtonType.GRAY && grayStyles}
  ${(props) => props.styleType === StyledButtonType.DARK && darkStyles}
  ${(props) => props.styleType === StyledButtonType.GREEN && greenStyles}
  ${(props) => props.active && activeStyles}
`;
