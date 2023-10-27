import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Checkbox } from 'primereact/checkbox';
import { User } from '../../model/user.model';
import UserService from '../../services/user.service';
import { editSelectedUser, findAllUsers } from '../../slices/admins.slice';
import { ROLES, DISPLAY_NAME_MAX_CHAR_LIMIT, DISPLAY_NAME_VISIBILITY_LIMIT, DISPLAY_NAME_WARNING_CHAR_LIMIT } from '../../utils/constants';
import { RootState, useAppDispatch } from '../../store';
import { RolesWithReadableNames } from '../../model/role.model';
import { successNotification, warningNotification } from '../../utils/toast-notifications';
import { ToastContext } from '../../App';
import { validateExistingAdmins, validationResult } from '../../utils/validation';
import { validateUserIdCode } from '../../utils/idCodeValidation';
import CharacterCounter from '../character-counter/character-counter';

interface input {
  userSelectedRoles: RolesWithReadableNames[];
  userDisplayName: string;
  isActive: boolean;
  enableUserIdCodeField: boolean;
  userIdCode: string;
  // eslint-disable-next-line no-unused-vars
  setActive: (arg: boolean) => void;
  addNewUser: boolean;
}

const UserDetailModal: React.FC<input> = (props: input): JSX.Element => {
  const dispatch = useAppDispatch();
  const toastContext = useContext(ToastContext);

  const { t } = useTranslation();
  const [userId, setUserId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<RolesWithReadableNames[]>([]);
  const [selectAllRoles, setSelectAllRoles] = useState(false);
  const { userSelectedRoles, userIdCode, userDisplayName, isActive, setActive, enableUserIdCodeField, addNewUser } = props;
  const currentUsers: User[] = useSelector((state: RootState) => state.admins.admins);
  const resultMessageTypeNoChange = 'NO_CHANGE';
  const userActionTypeCreate = 'CREATE';
  const userActionTypeUpdate = 'UPDATE';

  useEffect(() => {
    setDisplayName(userDisplayName);
    setUserId(userIdCode);
    setSelectedRoles(userSelectedRoles);

    return () => {
      setDisplayName('');
      setUserId('');
      setSelectedRoles([]);
    };
  }, [userDisplayName, userIdCode, userSelectedRoles]);

  const roles: RolesWithReadableNames[] = [
    { name: t('roles.administrator'), code: ROLES.ROLE_ADMINISTRATOR },
    { name: t('roles.serviceManager'), code: ROLES.ROLE_SERVICE_MANAGER },
    { name: t('roles.customerSupportAgent'), code: ROLES.ROLE_CUSTOMER_SUPPORT_AGENT },
    { name: t('roles.chatbotTrainer'), code: ROLES.ROLE_CHATBOT_TRAINER },
    { name: t('roles.analyst'), code: ROLES.ROLE_ANALYST },
  ];

  const clearFields = (): void => {
    setUserId('');
    setDisplayName('');
    setSelectedRoles([]);
    setSelectAllRoles(false);
  };

  const verifyUserInput = (action: string): validationResult => {
    if (displayName.length > DISPLAY_NAME_MAX_CHAR_LIMIT) return { result: false, resultMessage: t('addUser.tooLongDisplayName') };
    const validation = validateUserIdCode(userId);
    if (!validation.result) return { result: false, resultMessage: t(validation.resultMessage) };

    if (selectedRoles.length === 0 || !userId || !displayName) {
      return { result: false, resultMessage: t('addUser.missingInput') };
    }

    if (action === userActionTypeCreate) {
      return { result: true, resultMessage: '' };
    }

    if (userDisplayName === displayName && userIdCode === userId && selectedRoles === userSelectedRoles) {
      return { result: true, resultMessage: resultMessageTypeNoChange };
    }

    return validateExistingAdmins(currentUsers, selectedRoles, userId, t);
  };

  const mapSelectedRoleValues = () => selectedRoles.map((roleWithReadableName) => roleWithReadableName.code);

  const createUser = () => {
    const verifyInput = verifyUserInput(userActionTypeCreate);

    if (verifyInput.result) {
      UserService.addUser({ userIdCode: userId, displayName, roles: mapSelectedRoleValues() })
        .then((response) => {
          if (response) {
            afterRequestAction(t('addUser.confirmation'), false);
          } else {
            warningNotification(toastContext, t('addUser.duplicateUser'), t('toast.error'));
          }
        })
        .catch(() => warningNotification(toastContext, t('addUser.serverError'), t('toast.error')));
    } else {
      warningNotification(toastContext, verifyInput.resultMessage, t('toast.warning'));
    }
  };

  const editUser = () => {
    const verifyInput = verifyUserInput(userActionTypeUpdate);

    if (verifyInput.resultMessage === resultMessageTypeNoChange) {
      afterRequestAction('', true);
      return;
    }

    if (verifyInput.result) {
      dispatch(editSelectedUser({ userIdCode: userId, roles: mapSelectedRoleValues(), displayName }))
        .then(() => {
          afterRequestAction(t('editUser.confirmation'), false);
        })
        .catch(() => warningNotification(toastContext, t('addUser.serverError'), t('toast.error')));
    } else {
      warningNotification(toastContext, verifyInput.resultMessage, t('toast.warning'));
    }
  };

  const afterRequestAction = (notificationMessage: string, emptyRequest: boolean) => {
    setActive(false);
    clearFields();

    if (!emptyRequest) {
      successNotification(toastContext, notificationMessage, t('toast.success'));
      dispatch(findAllUsers());
    }
  };

  const panelHeaderTemplate = () => (
    <>
      <div style={{ padding: '1rem 1rem 0 1rem' }}>
        <label htmlFor="select-all">
          <Checkbox
            inputId="select-all"
            checked={selectAllRoles}
            onChange={(e) => {
              setSelectAllRoles(!selectAllRoles);
              setSelectedRoles(!e.checked ? [] : roles.map((role) => role));
            }}
          />
          &ensp;{t('addUser.selectAll')}
        </label>
      </div>
      <div style={{ borderBottom: '2px solid #f0f1f2', marginTop: '1rem' }} />
    </>
  );

  return (
    <Dialog
      header={addNewUser ? t('addUser.modalTitle') : t('addUser.modifyUserTitle')}
      visible={isActive}
      style={{ width: '50vw' }}
      onHide={() => {
        setActive(false);
        clearFields();
      }}
      draggable={false}
    >
      <UserDetailStyles>
        <div className="p-fluid">
          <span className="p-float-label form-element-display-name">
            <InputText className="user-input-text" id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} type="text" />
            <label htmlFor="displayName">{t('addUser.displayNamePlaceholder')}</label>
          </span>
          <CharacterCounter
            userInput={displayName}
            maxCharLimit={DISPLAY_NAME_MAX_CHAR_LIMIT}
            warningCharLimit={DISPLAY_NAME_WARNING_CHAR_LIMIT}
            visibilityLimit={DISPLAY_NAME_VISIBILITY_LIMIT}
          />
          <span className="p-float-label form-elements">
            <InputText
              className="user-input-text"
              id="userIdCode"
              disabled={!enableUserIdCodeField}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              type="text"
            />
            <label htmlFor="userIdCode">{t('addUser.idCodePlaceholder')}</label>
          </span>
          <small className="small-text">{t('addUser.idCodePlaceholderHelpText')}</small>
          <span className="p-float-label form-elements">
            <MultiSelect
              className="user-input-text"
              id="userRoles"
              value={selectedRoles}
              options={roles}
              onChange={(e) => setSelectedRoles(e.value)}
              panelHeaderTemplate={panelHeaderTemplate}
              optionLabel="name"
              maxSelectedLabels={5}
            />
            <label htmlFor="userRoles">{t('addUser.rolePlaceholder')}</label>
          </span>
          <Button className="form-elements" onClick={() => (userIdCode ? editUser() : createUser())} label={t('addUser.submitButton')} />
        </div>
      </UserDetailStyles>
    </Dialog>
  );
};

const UserDetailStyles = styled.div`
  small.small-text {
    color: #a7a9ab;
  }

  .form-elements {
    margin-top: 1.8rem;
  }

  .form-element-display-name {
    margin-top: 1.5rem;
  }

  .user-input-text {
    border: 0;
    border-bottom: 2px solid #a7a9ab;
    border-radius: 0;
    color: #000;
    font-size: 1.1em;
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
  }

  .p-float-label input:focus ~ label {
    color: #003cff;
  }
`;

export default UserDetailModal;
