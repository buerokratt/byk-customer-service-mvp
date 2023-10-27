import { DateTime } from 'luxon';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { HTMLAttributes, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Chat } from '../../model/chat.model';
import { getChatIdsMatchingMessageSearch, selectEndedSelectedChat, setActiveChat } from '../../slices/chats.slice';
import { useAppDispatch, useAppSelector } from '../../store';
import StyledButton, { StyledButtonType } from '../../styled-components/StyledButton';
import { CHAT_STATUS } from '../../utils/constants';

type ChatArchiveTableProps = {
  isOpen: boolean;
} & HTMLAttributes<HTMLElement>;

const ChatArchiveTable = (props: ChatArchiveTableProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const chats = useAppSelector((state) => state.chats.endedChats);
  const selectedChat = useAppSelector((state) => selectEndedSelectedChat(state));
  const searchKey = useAppSelector((state) => state.chats.searchKey);
  const matchingChatIds = useAppSelector((state) => state.chats.matchingChatIds);

  const [filteredChats, setFilteredChats] = useState<Chat[]>(chats);

  function getHighlightedRowClassName(rowData: Chat): string {
    const selectedChatIsOpen = selectedChat?.id === rowData.id;
    return selectedChatIsOpen ? 'row-selected' : '';
  }

  const rowActions = (rowData: Chat): JSX.Element => {
    const selectedChatIsOpen = selectedChat?.id === rowData.id;

    return selectedChatIsOpen ? (
      <></>
    ) : (
      <StyledButton styleType={StyledButtonType.GRAY} onClick={() => dispatch(setActiveChat(rowData))}>
        {t('chatArchive.openChat')}
      </StyledButton>
    );
  };

  const returnChatStatus = (rowData: Chat): string => {
    switch (rowData.status) {
      case CHAT_STATUS.OPEN:
        return t('chatToolbox.status.open');
      case CHAT_STATUS.ENDED:
        return t('chatToolbox.status.ended');
      case CHAT_STATUS.REDIRECTED:
        return t('chatToolbox.status.redirected');
      default:
        return t('toast.error');
    }
  };

  useEffect(() => {
    let visibleChats: Chat[];
    visibleChats = chats.filter((chat: Chat) => chat.status === CHAT_STATUS.ENDED || chat.status === CHAT_STATUS.REDIRECTED);

    if (searchKey) {
      visibleChats = visibleChats.filter((chat) => matchingChatIds?.includes(chat.id));
    }

    setFilteredChats(visibleChats);
  }, [searchKey, matchingChatIds, chats]);

  useEffect(() => {
    if (searchKey) dispatch(getChatIdsMatchingMessageSearch(searchKey));
  }, [searchKey, dispatch]);

  const returnRedirectedStatus = (rowData: Chat): string =>
    rowData.status === CHAT_STATUS.REDIRECTED || rowData.receivedFrom ? t('generic.yes') : t('generic.no');

  return (
    <ChatArchiveTableStyles {...props}>
      <DataTable
        removableSort
        sortField="ended"
        sortOrder={-1}
        value={filteredChats}
        emptyMessage={t('chatArchive.emptyTableMessage')}
        paginator
        size="small"
        responsiveLayout="scroll"
        rows={10}
        rowClassName={(rowData: Chat) => getHighlightedRowClassName(rowData)}
        rowsPerPageOptions={[10, 20, 50]}
      >
        <Column
          sortable
          field="created"
          header={t('chatArchive.start')}
          body={(rowData: Chat) => DateTime.fromISO(rowData.created).setLocale('et').toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)}
        />
        <Column
          sortable
          field="ended"
          header={t('chatArchive.end')}
          body={(rowData: Chat) => DateTime.fromISO(rowData.ended).setLocale('et').toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)}
        />
        <Column sortable field="customerSupportDisplayName" header={t('chatArchive.agent')} body={(rowData: Chat) => rowData.customerSupportDisplayName} />
        <Column
          sortable
          field="endUserName"
          header={t('chatArchive.endUserName')}
          body={(rowData: Chat) => `${rowData.endUserFirstName} ${rowData.endUserLastName}`}
        />
        <Column sortable field="endUserId" header={t('chatArchive.endUserId')} body={(rowData: Chat) => rowData.endUserId} />
        <Column
          field="contactInformation"
          header={t('chatArchive.contactInformation')}
          body={(rowData: Chat) => (rowData.contactsMessage ? t('generic.yes') : t('generic.no'))}
        />
        <Column field="forwardedToName" header={t('chatArchive.redirected')} sortable body={(rowData: Chat) => returnRedirectedStatus(rowData)} />
        <Column field="status" header={t('chatArchive.resolution')} sortable body={returnChatStatus} />
        <Column field="id" header={t('chatArchive.chatId')} body={(rowData: Chat) => <small>{rowData.id}</small>} />
        <Column body={rowActions} />
      </DataTable>
    </ChatArchiveTableStyles>
  );
};

const ChatArchiveTableStyles = styled.div<ChatArchiveTableProps>`
  transition: 250ms width;
  overflow-y: auto;
  width: ${(props) => (props.isOpen ? '60vw' : '100vw')};

  /* NOTE: Weird styles due to overriding PrimeReact */

  .p-datatable-thead {
    height: 50px;
  }

  .p-datatable .p-datatable-thead > tr > th {
    background: #f0f1f2;
    border: 0;
    color: #000;
  }

  .p-datatable .p-sortable-column.p-highlight:not(.p-sortable-disabled):hover,
  .p-datatable .p-sortable-column.p-highlight .p-sortable-column-icon,
  .p-datatable .p-sortable-column.p-highlight:not(.p-sortable-disabled):hover .p-sortable-column-icon {
    color: #003cff;
  }

  .p-datatable-tbody > tr {
    border-left: 6px solid transparent;
    transition: 250ms border-left-color, 250ms background-color, 250ms color;
  }

  .p-datatable-tbody > tr.row-selected {
    background: transparent;
    background-color: #f0f1f2;
    border-left-color: #003cff;
  }
`;

export default ChatArchiveTable;
