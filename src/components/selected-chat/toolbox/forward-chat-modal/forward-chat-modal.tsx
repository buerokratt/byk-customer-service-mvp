import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { findAllCustomerSupportAgents } from '../../../../slices/admins.slice';
import { useAppSelector } from '../../../../store';
import { ReactComponent as ArrowSVG } from '../../../../static/arrow_icon.svg';
import { User } from '../../../../model/user.model';
import { redirectChat } from '../../../../slices/chats.slice';
import { Chat } from '../../../../model/chat.model';

type ForwardChatModalProps = {
  displayModal: boolean;
  afterForwardAction: () => void;
  chat: Chat;
  clearSelectedChatAfterForward: boolean;
};

const ForwardChatModal = (props: ForwardChatModalProps): JSX.Element => {
  const { chat, displayModal, afterForwardAction, clearSelectedChatAfterForward } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const loggedInUserId = useAppSelector((state) => state.authentication.customerSupportId);
  const users = useAppSelector((state) => state.admins.admins);
  const [searchKey, setSearchKey] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);

  useEffect(() => {
    let visibleUsers: User[];
    visibleUsers = users.filter((user) => user.idCode !== loggedInUserId);
    if (searchKey) {
      visibleUsers = users.filter((user) => user.displayName.toLowerCase().includes(searchKey.toLowerCase()) && user.idCode !== loggedInUserId);
    }
    setFilteredUsers(visibleUsers);
  }, [users, searchKey, loggedInUserId]);

  useEffect(() => {
    if (displayModal) dispatch(findAllCustomerSupportAgents());
  }, [displayModal, dispatch]);

  const forwardChatToAgent = (user: User) => {
    dispatch(
      redirectChat({
        id: chat.id,
        customerSupportDisplayName: user.displayName,
        customerSupportId: user.idCode,
        openRedirectedChat: !clearSelectedChatAfterForward,
      }),
    );
    afterForwardAction();
  };

  const forwardButton = (user: User) => (
    <ArrowSVG title={t('forwardUser.buttonTitle')} role="button" className="forward-icon" onClick={() => forwardChatToAgent(user)} />
  );

  const renderHeader = () => (
    <div className="search">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText value={searchKey} onChange={(e) => setSearchKey(e.target.value)} placeholder={t('forwardUser.searchByName')} />
      </span>
    </div>
  );

  const closeModal = () => {
    afterForwardAction();
    setSearchKey('');
  };

  return (
    <ForwardModalStyles
      header={t('forwardUser.modalHeader')}
      visible={displayModal}
      className="active-chat-toolbox-dialog"
      onHide={() => closeModal()}
      draggable={false}
    >
      <DataTable paginator rowHover value={filteredUsers} emptyMessage={t('addUser.noUsers')} rows={5} header={renderHeader}>
        <Column field="displayName" header={t('addUser.userName')} />
        <Column field="idCode" header={t('addUser.userPic')} />
        <Column header={t('forwardUser.columnHeader')} body={forwardButton} className="forward-user" />
      </DataTable>
    </ForwardModalStyles>
  );
};

const ForwardModalStyles = styled(Dialog)`
  width: 50rem;

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

  .search {
    display: flex;
    flex-direction: row;
    justify-content: right;
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
      cursor: pointer;

      path {
        stroke: #fff;
      }

      line {
        stroke: #fff;
      }
    }
  }
`;

export default ForwardChatModal;
