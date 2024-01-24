import { ChatsState } from './slices/chats.slice';
import { AUTHOR_ROLES, CHAT_STATUS, CHAT_TABS, ROLES, TRAINING_TABS } from './utils/constants';
import { TrainingState } from './slices/training.slice';
import { Chat } from './model/chat.model';
import { AuthenticationState } from './slices/authentication.slice';
import { AdminsState } from './slices/admins.slice';
import { MessageModel } from './model/message.model';
import { IntentModel } from './model/intent.model';
import { User } from './model/user.model';
import { ConfigurationState } from './slices/configuration.slice';

export const initialChatsState: ChatsState = {
  activeChats: [],
  endedChats: [],
  chatListLastUpdate: '',
  selectedChatId: '',
  selectedChatMessages: [],
  matchingChatIds: [],
  searchKey: '',
  activeTab: CHAT_TABS.TAB_UNANSWERED,
  askPermissionTimeouts: [],
  newMessagesAmount: 0,
  successToast: '',
  archiveSuccessToast: '',
  errorToast: '',
};

export const initialSingleChatState: Chat = {
  id: '1',
  status: CHAT_STATUS.OPEN,
  lastMessage: 'string',
  created: '2022-01-27T09:24:26.558Z',
  endUserId: '',
  ended: '',
  updated: '',
  customerSupportId: '1',
  forwardedToName: '',
};

export const initialAuthenticationState: AuthenticationState = {
  isAuthenticated: true,
  jwtExpirationTimestamp: '2023-01-27T09:39:26.922Z',
  authenticationFailed: false,
  userAuthorities: [ROLES.ROLE_ADMINISTRATOR],
  userLogin: 'admin',
  isCustomerSupportActive: true,
  customerSupportId: '1',
};

export const initialAdminState: AdminsState = {
  admins: [],
  selectedUser: null,
  availableConnections: ['connection 1', 'connection 2'],
};

export const initialMessages: MessageModel[] = [
  {
    id: '0',
    chatId: 'chatId1',
    created: '2021-12-16T15:39:02.000Z',
    authorTimestamp: '2021-12-16T15:39:02.000Z',
    authorId: 'General Kenobi',
    content: 'Hello, there!',
    authorRole: AUTHOR_ROLES.END_USER,
    authorFirstName: 'admin',
    event: '',
  },
  {
    id: '1',
    chatId: 'chatId1',
    created: '2021-12-16T15:39:05.000Z',
    authorTimestamp: '2021-12-16T15:39:19.000Z',
    authorId: 'General Grievous',
    content: 'General Kenobi!',
    authorRole: AUTHOR_ROLES.END_USER,
    authorFirstName: 'admin',
    event: '',
  },
];

export const initialIntent: IntentModel = {
  name: '1',
  description: 'nice',
  response: 'great',
  inModel: '.yml',
  examples: [],
};

export const initialTrainingState: TrainingState = {
  intents: [],
  selectedIntentName: '',
  examples: [],
  selectedExample: '',
  activeTab: TRAINING_TABS.INTENTS,
  intentsLoading: false,
  examplesLoading: false,
  intentResponseUpdating: false,
  successToast: '',
  warningToast: '',
  assignedTrainingDate: '',
  isTraining: false,
  areLatestTestResultsPositive: true,
  fetchingIsBotTraining: false,
  publishingModel: false,
  blacklistedIntentNames: [],
};

export const initialUsers: User[] = [
  { idCode: 'userId1', displayName: 'user_1', authorities: [ROLES.ROLE_ADMINISTRATOR] },
  { idCode: 'userId2', displayName: 'user_2', authorities: [ROLES.ROLE_CUSTOMER_SUPPORT_AGENT] },
];

export const initialConfiguration: ConfigurationState = {
  greetingMessage: {
    isActive: false,
    eng: '',
    est: '',
  },
  isInitialGreetingMessage: true,
  needsUpdate: true,
  sessionLengthMinutes: 0,
  estimatedWaiting: {
    isActive: false,
    time: 0,
  },
  botConfig: {
    isActive: false,
    fetchingIsActive: true,
  },
};
