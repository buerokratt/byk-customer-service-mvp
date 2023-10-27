import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import ConfigurationService from '../services/greeting.service';
import AuthenticationService from '../services/authentication.service';
import EstimatedWaitingTimeService from '../services/estimated-waiting-time.service';

export interface GreetingMessage {
  isActive: boolean;
  eng: string;
  est: string;
}

export interface EstimatedWaiting {
  isActive: boolean;
  time: number;
}

export interface BotConfig {
  isActive: boolean;
  fetchingIsActive: boolean;
}

export interface ConfigurationState {
  greetingMessage: GreetingMessage;
  estimatedWaiting: EstimatedWaiting;
  isInitialGreetingMessage: boolean;
  needsUpdate: boolean;
  sessionLengthMinutes: number;
  botConfig: BotConfig;
}

const initialState: ConfigurationState = {
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

export const getSessionLengthMinutes = createAsyncThunk('auth/getSessionLength', async () => AuthenticationService.getSessionLength());

export const setLoginSessionLength = createAsyncThunk('auth/setSessionLength', async (args, thunkAPI) => {
  const {
    configuration: { sessionLengthMinutes },
  } = thunkAPI.getState() as { configuration: ConfigurationState };

  return AuthenticationService.setSessionLength(sessionLengthMinutes);
});

export const getEstimatedWaitingTime = createAsyncThunk('auth/getEstimatedWaitingTime', async () => EstimatedWaitingTimeService.getEstimatedWaitingTime());

export const setEstimatedWaitingTime = createAsyncThunk('auth/setEstimatedWaitingTime', async (args: { time: number }) =>
  EstimatedWaitingTimeService.setEstimatedWaitingTime(args.time),
);

export const setEstimateWaitingTimeActivityToggle = createAsyncThunk('time/setEstimateWaitingTimeActivityToggle', async (args: { newStatusValue: boolean }) =>
  EstimatedWaitingTimeService.setIsEstimatedWaitingTimeActive(args.newStatusValue),
);

export const getGreetingMessage = createAsyncThunk('greeting/getGreeting', async () => ConfigurationService.getGreetingMessage());

export const setActiveToggle = createAsyncThunk('greeting/setActiveToggle', async (args: { newStatusValue: boolean }) =>
  ConfigurationService.setIsGreetingActive(args.newStatusValue),
);

export const getIsBotActive = createAsyncThunk('greeting/getIsBotActive', async () => ConfigurationService.getIsBotActive());

export const setIsBotActive = createAsyncThunk('greeting/setIsBotActive', async (args: { isActive: boolean }) =>
  ConfigurationService.setIsBotActive(args.isActive),
);

export const setGreetingMessage = createAsyncThunk('greeting/setGreeting', async (args: { est: string; eng: string; isActive: boolean }) => ({
  response: await ConfigurationService.setGreetingMessage(args.est, args.eng),
  est: args.est,
}));

export const configurationSlice = createSlice({
  name: 'configuration',
  initialState,
  reducers: {
    setGreetingEst: (state, action: PayloadAction<string>) => {
      state.greetingMessage.est = action.payload;
    },
    setSessionLength: (state, action: PayloadAction<number>) => {
      state.sessionLengthMinutes = action.payload;
    },
    setEstimatedWaitingTimeLength: (state, action: PayloadAction<number>) => {
      state.estimatedWaiting.time = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getGreetingMessage.fulfilled, (state, action) => {
      if (action.payload) {
        state.greetingMessage = action.payload;
        state.isInitialGreetingMessage = false;
      }
    });
    builder.addCase(setActiveToggle.fulfilled, (state) => {
      state.greetingMessage.isActive = !state.greetingMessage.isActive;
    });
    builder.addCase(setEstimateWaitingTimeActivityToggle.fulfilled, (state) => {
      state.estimatedWaiting.isActive = !state.estimatedWaiting.isActive;
    });
    builder.addCase(setGreetingMessage.fulfilled, (state, action) => {
      state.greetingMessage.est = action.payload.est;
      state.isInitialGreetingMessage = false;
      state.needsUpdate = !state.needsUpdate;
    });
    builder.addCase(getSessionLengthMinutes.fulfilled, (state, action) => {
      if (action.payload.length === 0 || action.payload[0] === undefined) return;
      state.sessionLengthMinutes = parseInt(action.payload[0].value, 10);
    });
    builder.addCase(getEstimatedWaitingTime.fulfilled, (state, action) => {
      if (action.payload) {
        state.estimatedWaiting = action.payload;
      }
    });
    builder.addCase(getIsBotActive.pending, (state) => {
      state.botConfig.fetchingIsActive = true;
    });
    builder.addCase(getIsBotActive.fulfilled, (state, action) => {
      state.botConfig.fetchingIsActive = false;
      state.botConfig.isActive = action.payload.value === 'true';
    });
    builder.addCase(getIsBotActive.rejected, (state) => {
      state.botConfig.fetchingIsActive = false;
    });
    builder.addCase(setIsBotActive.pending, (state) => {
      state.botConfig.fetchingIsActive = true;
    });
    builder.addCase(setIsBotActive.fulfilled, (state, action) => {
      state.botConfig.fetchingIsActive = false;
      state.botConfig.isActive = action.payload.value === 'true';
    });
  },
});

export const { setGreetingEst, setSessionLength, setEstimatedWaitingTimeLength } = configurationSlice.actions;

export default configurationSlice.reducer;
