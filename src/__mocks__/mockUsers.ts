import { UserData } from '../components/management/users';
import { ROLES } from '../utils/constants';

const mockUsers: UserData[] = [
  {
    name: 'Mari Tamm',
    pic: '00000000000',
    authorities: [ROLES.ROLE_CUSTOMER_SUPPORT_AGENT],
  },
  {
    name: 'Taavi Kask',
    pic: '00000000001',
    authorities: [ROLES.ROLE_CUSTOMER_SUPPORT_AGENT],
  },
  {
    name: 'Vambola Kuusk',
    pic: '00000000002',
    authorities: [ROLES.ROLE_CUSTOMER_SUPPORT_AGENT, ROLES.ROLE_CHATBOT_TRAINER],
  },
  {
    name: 'Jana Lepp',
    pic: '00000000003',
    authorities: [ROLES.ROLE_ADMINISTRATOR, ROLES.ROLE_ANALYST, ROLES.ROLE_CHATBOT_TRAINER, ROLES.ROLE_CUSTOMER_SUPPORT_AGENT, ROLES.ROLE_SERVICE_MANAGER],
  },
];

export default mockUsers;
