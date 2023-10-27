import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { PayloadAction } from '@reduxjs/toolkit';
import { RolesWithReadableNames } from '../../model/role.model';
import { User } from '../../model/user.model';
import { clearSelectedUser, deleteUser, findAllUsers, setSelectedUser } from '../../slices/admins.slice';
import { ReactComponent as SettingsSVG } from '../../static/settings.svg';
import { ReactComponent as TrashSVG } from '../../static/trash.svg';
import { RootState, useAppDispatch } from '../../store';
import { ROLES } from '../../utils/constants';
import { AdminUsers } from '../../utils/validation';
import UserDetailModal from './user-detail-modal';
import { successNotification, warningNotification } from '../../utils/toast-notifications';
import { ToastContext } from '../../App';

export interface UserData {
  name: string;
  pic: string | number;
  authorities: ROLES[];
}

const Users = (): JSX.Element => {
  const toastContext = useContext(ToastContext);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const users = useSelector((state: RootState) => state.admins.admins);
  const selectedUser = useSelector((state: RootState) => state.admins.selectedUser);
  const [displayUserDetailModal, setDisplayUserDetailModal] = useState(false);
  const [displayDeleteUserDialog, setDisplayDeleteDialog] = useState(false);

  useEffect(() => {
    if (!selectedUser) dispatch(findAllUsers());
  }, [dispatch, selectedUser]);

  const renderRoles = (rowData: UserData) => rowData.authorities?.map((role: string, key: number) => (role ? (key ? ', ' : '') + t(`roles.${role}`) : ''));
  const formatRoles = (user: User): RolesWithReadableNames[] =>
    [
      { name: t('roles.administrator'), code: ROLES.ROLE_ADMINISTRATOR },
      { name: t('roles.serviceManager'), code: ROLES.ROLE_SERVICE_MANAGER },
      { name: t('roles.customerSupportAgent'), code: ROLES.ROLE_CUSTOMER_SUPPORT_AGENT },
      { name: t('roles.chatbotTrainer'), code: ROLES.ROLE_CHATBOT_TRAINER },
      { name: t('roles.analyst'), code: ROLES.ROLE_ANALYST },
    ].filter((role) => !!user.authorities.find((authority) => authority === role.code));

  const dispatchAfterAction = (res: PayloadAction<unknown>) => {
    if (res.payload === undefined) warningNotification(toastContext, t('deleteUser.serverError'), t('toast.error'));
    else successNotification(toastContext, t('deleteUser.deleteConfirmation'), t('toast.success'));
  };

  const deleteUserDialogFooter = (
    <>
      <Button
        label={t('generic.yes')}
        icon="pi pi-check"
        className="p-button-text"
        onClick={() => {
          dispatch(deleteUser()).then((res) => dispatchAfterAction(res));
          setDisplayDeleteDialog(false);
        }}
      />
      <Button
        label={t('generic.no')}
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => {
          dispatch(clearSelectedUser());
          setDisplayDeleteDialog(false);
        }}
      />
    </>
  );

  const showDeleteButton = (user: User): string =>
    AdminUsers(users).length <= 1 && user.authorities.includes(ROLES.ROLE_ADMINISTRATOR) ? 'hidden' : 'visible';

  const deleteButton = (user: User) => (
    <TrashSVG
      visibility={showDeleteButton(user)}
      title={t('deleteUser.buttonTitle')}
      role="button"
      className="delete-icon"
      onClick={() => dispatch(setSelectedUser(user)) && setDisplayDeleteDialog(true)}
      aria-label={t('deleteUser.buttonTitle')}
    />
  );

  const editButton = (user: User) => (
    <SettingsSVG
      title={t('editUser.buttonTitle')}
      role="button"
      className="edit-icon"
      onClick={() => dispatch(setSelectedUser(user)) && setDisplayUserDetailModal(true)}
      aria-label={t('editUser.buttonTitle')}
    />
  );

  return (
    <>
      <UsersStyle>
        <DataTable paginator rowHover value={users} emptyMessage={t('addUser.noUsers')} rows={10} rowsPerPageOptions={[10, 20, 50]}>
          <Column sortable field="displayName" header={t('addUser.userName')} />
          <Column sortable field="idCode" header={t('addUser.userPic')} />
          <Column sortable field="authorities" header={t('addUser.userRoles')} body={renderRoles} />
          <Column header={t('editUser.columnHeader')} body={editButton} className="edit-user" />
          <Column header={t('deleteUser.columnHeader')} body={deleteButton} className="remove-user" />
        </DataTable>
      </UsersStyle>
      {!!selectedUser && displayUserDetailModal && (
        <UserDetailModal
          userIdCode={selectedUser.idCode}
          userDisplayName={selectedUser.displayName}
          setActive={() => dispatch(clearSelectedUser()) && setDisplayUserDetailModal(false)}
          userSelectedRoles={formatRoles(selectedUser)}
          isActive={displayUserDetailModal}
          enableUserIdCodeField={false}
          addNewUser={false}
        />
      )}
      {!!selectedUser && displayDeleteUserDialog && (
        <Dialog
          modal
          visible
          header={t('deleteUser.confirm')}
          footer={deleteUserDialogFooter}
          onHide={() => dispatch(clearSelectedUser()) && setDisplayDeleteDialog(false)}
        >
          <div className="confirmation-content">
            {t('deleteUser.confirmationContent')} {selectedUser.displayName}?
          </div>
        </Dialog>
      )}
    </>
  );
};

const UsersStyle = styled.div`
  .edit-user,
  .remove-user {
    min-width: 2rem;
    width: 6rem;
  }

  .edit-user,
  .remove-user:hover {
    cursor: pointer;
  }

  td > .edit-icon {
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
        stroke: transparent;
      }

      line {
        stroke: #fff;
      }
    }
  }

  td > .delete-icon {
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

      path,
      polyline,
      stroke,
      line {
        stroke: #fff;
      }
    }
  }
`;

export default Users;
