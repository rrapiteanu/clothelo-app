import {Platform} from 'react-native';

const API_DEV =
  Platform.OS === 'ios' ? 'http://localhost:4000' : 'http://10.0.2.2:4000';

const WS_DEV =
  Platform.OS === 'ios'
    ? 'ws://localhost:4000/subscriptions'
    : 'ws://10.0.2.2:4000/subscriptions';

const API_PROD = 'http://localhost:4000';
const WS_PROD = 'ws://localhost:4000/subscriptions';

export const API_URL = __DEV__ ? API_DEV : API_PROD;
export const WS_URL = __DEV__ ? WS_DEV : WS_PROD;

// export const API_URL = API_PROD;
// export const WS_URL = WS_PROD;
