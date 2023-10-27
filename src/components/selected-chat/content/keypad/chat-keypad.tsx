import { InputTextarea } from 'primereact/inputtextarea';
import React, { HTMLAttributes, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { MessageModel } from '../../../../model/message.model';
import { addMessage, selectActiveSelectedChat, sendMessage } from '../../../../slices/chats.slice';
import { useAppDispatch, useAppSelector } from '../../../../store';
import StyledButton, { StyledButtonType } from '../../../../styled-components/StyledButton';
import { AUTHOR_ROLES, CHAT_STATUS, MESSAGE_MAX_CHAR_LIMIT, MESSAGE_WARNING_CHAR_LIMIT, MESSAGE_VISIBILITY_LIMIT } from '../../../../utils/constants';
import CharacterCounter from '../../../character-counter/character-counter';
import KeypadErrorMessage from './keypad-error-message';

const ChatKeypad = (props: HTMLAttributes<HTMLElement>): JSX.Element => {
  const { className } = props;
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const inputTextAreaRef = useRef(null);

  const selectedChat = useAppSelector((state) => selectActiveSelectedChat(state));
  const { userLogin } = useAppSelector((state) => state.authentication);
  const isKeypadDisabled = selectedChat?.status === CHAT_STATUS.ENDED;
  const customerSupportId = useAppSelector((state) => state.authentication.customerSupportId);

  const [userInput, setUserInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isInputValid = () => {
    if (!userInput.trim()) return false;
    if (userInput.length >= MESSAGE_MAX_CHAR_LIMIT) {
      setErrorMessage(t('keypad.longMessageWarning'));
      return false;
    }
    return true;
  };

  const addNewMessageToState = (): void => {
    if (!selectedChat || !isInputValid()) return;
    const message: MessageModel = {
      chatId: selectedChat.id,
      content: userInput,
      authorTimestamp: new Date().toISOString(),
      authorFirstName: userLogin,
      authorId: customerSupportId,
      authorRole: AUTHOR_ROLES.BACKOFFICE_USER,
    };
    setUserInput('');
    dispatch(addMessage(message));
    dispatch(sendMessage(message));
  };

  return (
    <>
      {selectedChat && selectedChat.customerSupportId === customerSupportId && selectedChat.status !== CHAT_STATUS.ENDED && (
        <ChatKeypadStyles className={className}>
          <KeypadErrorMessage>{errorMessage}</KeypadErrorMessage>

          <div className="keypad-input">
            <div className="keypad-input-form">
              <InputTextarea
                className="keypad-textarea"
                placeholder={t('keypad.input.placeholder')}
                value={userInput}
                aria-label={t('keypad.input.label')}
                ref={inputTextAreaRef}
                disabled={isKeypadDisabled}
                rows={1}
                autoResize
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addNewMessageToState();
                  }
                }}
                onChange={(event) => {
                  setUserInput(event.target.value);
                  setErrorMessage('');
                }}
              />

              <CharacterCounter
                className="keypad-counter"
                userInput={userInput}
                maxCharLimit={MESSAGE_MAX_CHAR_LIMIT}
                visibilityLimit={MESSAGE_VISIBILITY_LIMIT}
                warningCharLimit={MESSAGE_WARNING_CHAR_LIMIT}
              />
            </div>

            <StyledButton
              styleType={StyledButtonType.GRAY}
              onKeyPress={addNewMessageToState}
              onClick={addNewMessageToState}
              tabIndex={0}
              className="keypad-input-send"
              disabled={isKeypadDisabled}
            >
              {t('keypad.button.label')}
            </StyledButton>
          </div>
        </ChatKeypadStyles>
      )}
    </>
  );
};

const ChatKeypadStyles = styled.div`
  border-top: 2px solid #f0f1f2;
  display: flex;
  flex-flow: column nowrap;

  .keypad-input {
    align-items: center;
    display: flex;
  }

  .keypad-input-form {
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
  }

  .keypad-input-send {
    margin: 0 0.5rem 0 0;
  }

  .keypad-counter {
    margin: 0 0.5rem 0 0;
  }

  .keypad-textarea {
    align-items: center;
    border: 0;
    border-bottom: 2px solid #a7a9ab;
    border-radius: 0;
    color: #000;
    font-size: 1.1em;
    margin: 1rem 0.5rem 1rem 1rem;
    max-height: 30vh;
    transition: 250ms border-bottom-color;

    :enabled:focus {
      box-shadow: unset;
      outline: 0;
    }

    :focus,
    :hover {
      border-bottom-color: #003cff;
    }

    ::placeholder {
      color: #a7a9ab;
    }

    :disabled {
      background-color: transparent;
      border-bottom-color: #f0f1f2;
      cursor: not-allowed;
    }
  }
`;

export default ChatKeypad;
