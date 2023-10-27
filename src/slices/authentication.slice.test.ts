import reducer, {
  AuthenticationState,
  getCustomerSupportStatus,
  loginUser,
  loginWithTaraJwt,
  logoutUser,
  setCustomerSupportStatus,
  setIsAuthenticated,
  setIsNotAuthenticated,
  verifyAuthentication,
} from './authentication.slice';

jest.mock('../services/chat.service');

const initialState: AuthenticationState = {
  isAuthenticated: false,
  jwtExpirationTimestamp: null,
  authenticationFailed: false,
  userAuthorities: [],
  userLogin: '',
  isCustomerSupportActive: false,
  customerSupportId: '',
};

describe('Authentication Slice', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('set isAuthenticated to true', () => {
    const previousState = { ...initialState };
    expect(reducer(previousState, setIsAuthenticated())).toEqual({
      ...initialState,
      isAuthenticated: true,
    });
  });

  it('set isAuthenticated to false', () => {
    const previousState = { ...initialState };
    expect(reducer(previousState, setIsNotAuthenticated())).toEqual({
      ...initialState,
      isAuthenticated: false,
    });
  });

  describe('extra reducers', () => {
    it('should set is authenticated true when verifyAuthentication is fulfilled', () => {
      const action = { type: verifyAuthentication.fulfilled.type };
      const state = reducer({ ...initialState, isAuthenticated: false }, action);
      expect(state).toEqual({ ...initialState, isAuthenticated: true });
    });

    it('should set is authenticated false when verifyAuthentication is rejected', () => {
      const action = { type: verifyAuthentication.rejected.type };
      const state = reducer({ ...initialState, isAuthenticated: true }, action);
      expect(state).toEqual({ ...initialState, isAuthenticated: false });
    });

    it('should set is authenticated false when loginUser is rejected', () => {
      const action = { type: loginUser.rejected.type };
      const state = reducer({ ...initialState, isAuthenticated: true }, action);
      expect(state).toEqual({ ...initialState, isAuthenticated: false });
    });

    it('should set is authenticated true when loginUser is fulfilled', () => {
      const action = { type: loginUser.fulfilled.type };
      const state = reducer({ ...initialState, isAuthenticated: false }, action);
      expect(state).toEqual({ ...initialState, isAuthenticated: true });
    });

    it('should set is authenticated false and authentication failed true when loginWithTaraJwt is rejected', () => {
      const action = { type: loginWithTaraJwt.rejected.type };
      const state = reducer({ ...initialState, isAuthenticated: true, authenticationFailed: false }, action);
      expect(state).toEqual({ ...initialState, isAuthenticated: false, authenticationFailed: true });
    });

    it('should set is authenticated true and authentication failed false when loginWithTaraJwt is fulfilled', () => {
      const action = { type: loginWithTaraJwt.fulfilled.type };
      const state = reducer({ ...initialState, isAuthenticated: false, authenticationFailed: true }, action);
      expect(state).toEqual({ ...initialState, isAuthenticated: true, authenticationFailed: false });
    });

    it('should set is authenticated false when logoutUser is fulfilled', () => {
      const action = { type: logoutUser.fulfilled.type };
      const state = reducer({ ...initialState, isAuthenticated: true }, action);
      expect(state).toEqual({ ...initialState, isAuthenticated: false });
    });

    it('should set is authenticated false when logoutUser is rejected', () => {
      const action = { type: logoutUser.rejected.type };
      const state = reducer({ ...initialState, isAuthenticated: true }, action);
      expect(state).toEqual({ ...initialState, isAuthenticated: false });
    });

    it('should set customer support active true when getCustomerSupportStatus is fulfilled', () => {
      const action = { type: getCustomerSupportStatus.fulfilled.type, payload: [{ active: 'true' }] };
      const state = reducer({ ...initialState, isCustomerSupportActive: false }, action);
      expect(state).toEqual({ ...initialState, isCustomerSupportActive: true });
    });

    it('should set customer support active false when getCustomerSupportStatus is fulfilled', () => {
      const action = { type: getCustomerSupportStatus.fulfilled.type, payload: [{ active: 'false' }] };
      const state = reducer({ ...initialState, isCustomerSupportActive: true }, action);
      expect(state).toEqual({ ...initialState, isCustomerSupportActive: false });
    });

    it('should set opposite customer support active status when setCustomerSupportStatus is fulfilled', () => {
      const action = { type: setCustomerSupportStatus.fulfilled };
      const state = reducer({ ...initialState, isCustomerSupportActive: true }, action);
      expect(state).toEqual({ ...initialState, isCustomerSupportActive: false });
    });
  });
});
