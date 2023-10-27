/* eslint-disable */
export const SESSION_STORAGE_JWT_VERIFY = 'byk-verify-auth';
export const MESSAGE_MAX_CHAR_LIMIT = 3000;
export const MESSAGE_WARNING_CHAR_LIMIT = 2900;
export const MESSAGE_VISIBILITY_LIMIT = 500;
export const AGENT_SESSION_LENGTH_MIN = 30;
export const AGENT_SESSION_LENGTH_MAX = 480;
export const DISPLAY_NAME_MAX_CHAR_LIMIT = 60;
export const DISPLAY_NAME_WARNING_CHAR_LIMIT = 50;
export const DISPLAY_NAME_VISIBILITY_LIMIT = 20;
export const DEFAULT_WAITING_TIME_LENGTH = 10;
export const INTENT_EXAMPLES_AMOUNT_TO_BE_IN_MODEL = 49;
export const ESTIMATED_WAITING_TIME_MAX = 60;
export const ESTIMATED_WAITING_TIME_MIN = 1;
export const EMAIL_REGEX = /[\w!#$%&’*+/=?`{|}~^-]+(?:\.[\w!#$%&’*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}/;
export const PHONE_NUMBER_REGEX = /[+]*[0-9]{1,4}[-\s.0-9]*/;
export const ASK_PERMISSION_BUTTON_TIMEOUT_MS = 60000;
export const GET_IS_TRAINING_INTERVAL = 60000;

export enum TRAINING_STATUSES {
  BOT_IS_TRAINING = 'TRAINING_IN_PROGRESS',
  MODEL_TESTS_FAILED = 'MODEL_TESTS_FAILED',
  MODEL_PUBLISHED = 'MODEL_PUBLISHED',
}

export enum AUTHOR_ROLES {
  END_USER = 'end-user',
  BACKOFFICE_USER = 'backoffice-user',
}

export enum CHAT_STATUS {
  ENDED = 'ENDED',
  OPEN = 'OPEN',
  REDIRECTED = 'REDIRECTED',
}

export enum CHAT_EVENTS {
  ANSWERED = 'answered',
  TERMINATED = 'terminated',
  CLIENT_LEFT = 'client-left',
  GREETING = 'greeting',
  REQUESTED_AUTHENTICATION = 'requested-authentication',
  ASK_PERMISSION = 'ask-permission',
  ASK_PERMISSION_ACCEPTED = 'ask-permission-accepted',
  ASK_PERMISSION_REJECTED = 'ask-permission-rejected',
  ASK_PERMISSION_IGNORED = 'ask-permission-ignored',
  RATING = 'rating',
  REDIRECTED = 'redirected',
  CONTACT_INFORMATION = 'contact-information',
  CONTACT_INFORMATION_REJECTED = 'contact-information-rejected',
  CONTACT_INFORMATION_FULFILLED = 'contact-information-fulfilled',
  REQUESTED_CHAT_FORWARD = 'requested-chat-forward',
  REQUESTED_CHAT_FORWARD_ACCEPTED = 'requested-chat-forward-accepted',
  REQUESTED_CHAT_FORWARD_REJECTED = 'requested-chat-forward-rejected',
}

export enum ROLES {
  ROLE_ADMINISTRATOR = 'ROLE_ADMINISTRATOR',
  ROLE_SERVICE_MANAGER = 'ROLE_SERVICE_MANAGER',
  ROLE_CUSTOMER_SUPPORT_AGENT = 'ROLE_CUSTOMER_SUPPORT_AGENT',
  ROLE_CHATBOT_TRAINER = 'ROLE_CHATBOT_TRAINER',
  ROLE_ANALYST = 'ROLE_ANALYST',
  ROLE_UNAUTHENTICATED = 'ROLE_UNAUTHENTICATED',
}

export enum RUUTER_ENDPOINTS {
  GET_ALL_ACTIVE_CHATS = '/cs-get-all-active-chats',
  GET_ALL_ENDED_CHATS = '/cs-get-all-ended-chats',
  CLAIM_CHAT = '/cs-claim-chat',
  REDIRECT_CHAT = '/cs-redirect-chat',
  END_CHAT = '/cs-end-chat',
  POST_MESSAGE = '/cs-post-message',
  POST_EVENT_MESSAGE = '/cs-post-event-message',
  POST_FORWARD_REQUEST = '/cs-post-redirect-request-message',
  REMOVE_ATTACHED_CHATS = '/cs-remove-attached-chats',
  POST_MESSAGE_WITH_NEW_EVENT = '/cs-post-message-with-new-event',
}

export enum ADMINISTRATION_TABS {
  BOT = 'BOT',
  USERS = 'USERS',
  GREETING = 'GREETING',
  SESSION = 'SESSION',
  WAITING_TIME = 'WAITING_TIME',
}

export enum CHAT_TABS {
  TAB_ANSWERED = 'TAB_ANSWERED',
  TAB_UNANSWERED = 'TAB_UNANSWERED',
  TAB_ARCHIVE = 'TAB_ARCHIVE',
}

export enum TRAINING_TABS {
  ARCHIVE = 'ARCHIVE',
  INTENTS = 'INTENTS',
  TRAINING = 'TRAINING',
}

export const ROLE_MATRIX = [
  {
    Role: ROLES.ROLE_ADMINISTRATOR,
    url: '/administration',
  },
  {
    Role: ROLES.ROLE_SERVICE_MANAGER,
    url: '/chats',
  },
  {
    Role: ROLES.ROLE_CUSTOMER_SUPPORT_AGENT,
    url: '/chats',
  },
  {
    Role: ROLES.ROLE_CHATBOT_TRAINER,
    url: '/',
  },
  {
    Role: ROLES.ROLE_ANALYST,
    url: '/',
  },
  {
    Role: ROLES.ROLE_UNAUTHENTICATED,
    url: '/',
  },
];
