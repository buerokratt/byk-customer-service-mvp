import reducer, { ConfigurationState, getIsBotActive, setEstimateWaitingTimeActivityToggle, setIsBotActive } from './configuration.slice';

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

describe('Configuration Slice', () => {
  describe('extra reducers', () => {
    it('should set estimated waiting is active when setEstimatedWaitingTimeActivityToggle is fulfilled', () => {
      const action = { type: setEstimateWaitingTimeActivityToggle.fulfilled.type };
      const state = reducer({ ...initialState, estimatedWaiting: { ...initialState.estimatedWaiting, isActive: false } }, action);
      expect(state).toEqual({ ...initialState, estimatedWaiting: { isActive: true, time: 0 } });
    });

    it('should set fetching is active false when getIsActiveBotActive is rejected', () => {
      const action = { type: getIsBotActive.rejected.type };
      const state = reducer({ ...initialState, botConfig: { ...initialState.botConfig, fetchingIsActive: true } }, action);
      expect(state).toEqual({ ...initialState, botConfig: { ...initialState.botConfig, fetchingIsActive: false } });
    });

    it('should set fetching is active true when setIsActiveBotActive is pending', () => {
      const action = { type: setIsBotActive.pending.type };
      const state = reducer({ ...initialState, botConfig: { ...initialState.botConfig, fetchingIsActive: false } }, action);
      expect(state).toEqual({ ...initialState, botConfig: { ...initialState.botConfig, fetchingIsActive: true } });
    });

    it('should set fetching is active false when setIsActiveBotActive is fulfilled', () => {
      const action = { type: setIsBotActive.fulfilled.type, payload: { value: 'true' } };
      const state = reducer({ ...initialState, botConfig: { ...initialState.botConfig, fetchingIsActive: true, isActive: false } }, action);
      expect(state).toEqual({ ...initialState, botConfig: { ...initialState.botConfig, fetchingIsActive: false, isActive: true } });
    });
  });
});
