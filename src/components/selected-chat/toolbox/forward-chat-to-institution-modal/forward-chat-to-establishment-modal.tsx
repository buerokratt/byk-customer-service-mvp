import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { RootState } from '../../../../store';
import { MessageModel } from '../../../../model/message.model';
import { ForwardChatMessage } from './forward-chat-message';
import StyledButton, { StyledButtonType } from '../../../../styled-components/StyledButton';
import { postForwardRequest, setErrorToastMessage } from '../../../../slices/chats.slice';
import { AUTHOR_ROLES, CHAT_EVENTS } from '../../../../utils/constants';
import { Chat } from '../../../../model/chat.model';
import { ForwardRequestMessageModel } from '../../../../model/forward-request-message.model';
import { findAllEstablishments } from '../../../../slices/admins.slice';

type ForwardInstitutionChatModalProps = {
  displayModal: boolean;
  afterForwardAction: () => void;
  userLogin: string;
  customerSupportId: string;
  selectedChat: Chat;
};

interface InstitutionMultiSelectModel {
  name: string;
  code: string;
}

const ForwardChatToEstablishmentModal = (props: ForwardInstitutionChatModalProps): JSX.Element => {
  const { displayModal, selectedChat, afterForwardAction, userLogin, customerSupportId } = props;
  const [selectedInstitution, setSelectedInstitution] = useState<InstitutionMultiSelectModel>({ name: '', code: '' });
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const [formattedConnectionList, setFormattedConnectionList] = useState<InstitutionMultiSelectModel[]>([]);
  const { t } = useTranslation();
  const institutions = useSelector((state: RootState) => state.admins.availableConnections);
  const allMessages = useSelector((state: RootState) => state.chats.selectedChatMessages);
  const dispatch = useDispatch();

  useEffect(() => {
    if (institutions) {
      const res = institutions.map((e) => ({ name: e, code: e }));
      setFormattedConnectionList(res);
    }
  }, [institutions]);

  const sendForwardRequest = () => {
    if (selectedInstitution.name === '') {
      dispatch(setErrorToastMessage(t('chatToolbox.modal.selectInstitutionWarningInstitution')));
    } else if (selectedMessageIds.length < 1) {
      dispatch(setErrorToastMessage(t('chatToolbox.modal.selectInstitutionWarningMessage')));
    } else {
      const forwardRequestMessage: ForwardRequestMessageModel = {
        chatId: selectedChat ? selectedChat.id : '',
        event: CHAT_EVENTS.REQUESTED_CHAT_FORWARD,
        authorTimestamp: new Date().toISOString(),
        authorFirstName: userLogin,
        authorId: customerSupportId,
        authorRole: AUTHOR_ROLES.BACKOFFICE_USER,
        content: {
          selectedMessageIds,
          institution: selectedInstitution.code,
        },
      };
      dispatch(postForwardRequest(forwardRequestMessage));
      afterForwardAction();
    }
  };

  useEffect(() => {
    if (displayModal) {
      dispatch(findAllEstablishments());
    }
  }, [displayModal, dispatch]);

  return (
    <ForwardModalStyles
      header={t('chatToolbox.modal.header')}
      visible={displayModal}
      className="active-chat-toolbox-dialog"
      onHide={() => afterForwardAction()}
      draggable={false}
    >
      <div>
        <h4>{t('chatToolbox.modal.institutionsToForwardLabel')}</h4>
        <Dropdown
          value={selectedInstitution}
          options={formattedConnectionList}
          onChange={(e) => setSelectedInstitution(e.value)}
          optionLabel="name"
          placeholder={t('chatToolbox.modal.selectInstitutionPlaceholder')}
        />
      </div>
      <div>
        <h4>{t('chatToolbox.modal.messagesToForwardLabel')}</h4>
        {allMessages.map((message: MessageModel) => (
          <ForwardChatMessage
            selectMessageHandler={(id) => setSelectedMessageIds([...selectedMessageIds, id])}
            deselectMessageHandler={(id) => setSelectedMessageIds(selectedMessageIds.filter((messageId) => messageId !== id))}
            key={message.id}
            message={message}
            checked={selectedMessageIds.includes(message.id || '')}
          />
        ))}
      </div>
      <div className="button-grp">
        <StyledButton tabIndex={0} styleType={StyledButtonType.DARK} className="cancel-button" onClick={() => afterForwardAction()}>
          {t('chatToolbox.modal.cancelButtonLabel')}
        </StyledButton>

        <StyledButton tabIndex={0} styleType={StyledButtonType.DARK} className="save-button" onClick={() => sendForwardRequest()}>
          {t('chatToolbox.modal.forwardButtonLabel')}
        </StyledButton>
      </div>
    </ForwardModalStyles>
  );
};

const ForwardModalStyles = styled(Dialog)`
  width: 50rem;

  .button-grp {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .column {
    display: flex;
    flex-flow: column wrap;

    > button {
      margin: 0.5rem 0;
    }
  }

  .forward-user {
    min-width: 2rem;
    width: 6rem;
  }

  td > .forward-icon {
    border-radius: 50%;
    height: 3rem;
    width: 3rem;
    background-color: transparent;
    transition: fill 250ms, background-color 250ms;

    path,
    line {
      stroke: #003cff;
    }

    :hover {
      background-color: #003cff;

      path {
        stroke: #fff;
      }

      line {
        stroke: #fff;
      }
    }
  }
`;

export default ForwardChatToEstablishmentModal;
