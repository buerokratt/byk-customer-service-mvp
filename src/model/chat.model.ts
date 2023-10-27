import { CHAT_STATUS } from '../utils/constants';

export interface Chat {
  id: string;
  customerSupportId?: string;
  customerSupportDisplayName?: string;
  endUserId?: string;
  endUserFirstName?: string;
  endUserLastName?: string;
  contactsMessage?: string;
  status: CHAT_STATUS;
  created: string;
  updated: string;
  ended: string;
  lastMessage: string;
  endUserUrl?: string;
  endUserOs?: string;
  lastMessageTimestamp?: string;
  forwardedToName?: string;
  receivedFrom?: string;
}
