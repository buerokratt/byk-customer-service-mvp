import React from 'react';
import styled from 'styled-components';
import StyledButton, { StyledButtonType } from '../../styled-components/StyledButton';

type ActivityToggleProps = {
  value: boolean;
  options: { label: string; value: boolean }[];
  // eslint-disable-next-line no-unused-vars
  togglePresence: (value: boolean) => void;
};

const ActivityToggle = (props: ActivityToggleProps): JSX.Element => {
  const { value, options, togglePresence } = props;
  const { label } = options.filter((option) => option.value === value)[0];

  return (
    <ActivityToggleStyles onClick={() => togglePresence(!value)} styleType={StyledButtonType.GRAY} aria-label={label}>
      {label}
    </ActivityToggleStyles>
  );
};

const ActivityToggleStyles = styled(StyledButton)`
  align-self: center;
  color: #fff;
  margin: 0;

  /* TODO: Find a way to unbind from translation string */
  &[aria-label='eemal'] {
    background-color: #ff4800;

    :hover {
      background-color: #003cff;
    }
  }

  &[aria-label='kohal'] {
    background-color: #65a580;

    :hover {
      background-color: #003cff;
    }
  }
`;

export default ActivityToggle;
