import classNames from 'classnames';
import React from 'react';
import './chat-button.scss';

// TODO: Consolidate with styled button
const ChatButton = (props: any): JSX.Element => {
  const { children, onClick, active, disabled, visible = true } = props;
  const buttonClasses = ['chat-button', { active }, { disabled }];

  return (
    <button className={classNames(buttonClasses)} type="button" onClick={onClick} style={{ visibility: visible ? 'visible' : 'hidden' }}>
      {children}
    </button>
  );
};

export default ChatButton;
