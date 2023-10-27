import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AuthenticationService from '../services/authentication.service';
import CustomJwtService from '../services/custom-jwt.service';
import { ROLES, SESSION_STORAGE_JWT_VERIFY } from '../utils/constants';

export interface AuthenticationState {
  isAuthenticated: boolean;
  jwtExpirationTimestamp: string | null;
  authenticationFailed: boolean;
  userAuthorities: ROLES[];
  userLogin: string;
  isCustomerSupportActive: boolean;
  customerSupportId: string;
}

const initialState: AuthenticationState = {
  isAuthenticated: false,
  jwtExpirationTimestamp: null,
  authenticationFailed: false,
  userAuthorities: [],
  userLogin: '',
  isCustomerSupportActive: false,
  customerSupportId: '',
};

export const loginUser = createAsyncThunk('auth/loginUser', async (args: { login: string; pass: string }) =>
  AuthenticationService.login(args.login, args.pass),
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => AuthenticationService.logout());

export const loginAnalytics = createAsyncThunk('auth/loginAnalytics', async () => AuthenticationService.loginAnalytics());

export const loginWithTaraJwt = createAsyncThunk('auth/loginWithTaraJwt', async (arg, thunkApi) => {
  await AuthenticationService.loginWithTaraJwt();
  thunkApi.dispatch(getUserinfo());
});

export const verifyAuthentication = createAsyncThunk('auth/verifyAuthentication', async () => {
  const response = await CustomJwtService.customJwtVerify();
  return response.status;
});

export const customJwtExtend = createAsyncThunk('auth/customJwtExtend', (arg, thunkApi) => {
  CustomJwtService.customJwtExtend().finally(() => thunkApi.dispatch(getUserinfo()));
});

export const getUserinfo = createAsyncThunk('auth/getUserinfo', () => CustomJwtService.customJwtUserinfo());

export const getCustomerSupportStatus = createAsyncThunk('admins/getCustomerSupportStatus', async (arg, thunkAPI) => {
  const {
    authentication: { customerSupportId },
  } = thunkAPI.getState() as { authentication: AuthenticationState };

  return AuthenticationService.getCustomerSupportStatus(customerSupportId);
});

export const setCustomerSupportStatus = createAsyncThunk('admins/setCustomerSupportStatus', async (isCustomerSupportActive: string, thunkApi) => {
  const {
    authentication: { customerSupportId },
  } = thunkApi.getState() as { authentication: AuthenticationState };

  return AuthenticationService.setCustomerSupportStatus(isCustomerSupportActive, customerSupportId);
});

export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setIsAuthenticated: (state) => {
      state.isAuthenticated = true;
    },
    setIsNotAuthenticated: (state) => {
      state.isAuthenticated = false;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getUserinfo.fulfilled, (state, action) => {
      state.jwtExpirationTimestamp = action.payload?.JWTExpirationTimestamp;
      state.userAuthorities = action.payload?.authorities as ROLES[];
      state.userLogin = action.payload?.displayName;
      state.customerSupportId = action.payload?.idCode;
    });
    builder.addCase(verifyAuthentication.fulfilled, (state) => {
      if (!state.isAuthenticated) state.isAuthenticated = true;
    });
    builder.addCase(verifyAuthentication.rejected, (state) => {
      state.isAuthenticated = false;
      window.sessionStorage.removeItem(SESSION_STORAGE_JWT_VERIFY);
    });
    builder.addCase(loginUser.rejected, (state) => {
      state.isAuthenticated = false;
    });
    builder.addCase(loginUser.fulfilled, (state) => {
      state.isAuthenticated = true;
    });
    builder.addCase(loginWithTaraJwt.rejected, (state) => {
      state.isAuthenticated = false;
      state.authenticationFailed = true;
    });
    builder.addCase(loginWithTaraJwt.fulfilled, (state) => {
      state.isAuthenticated = true;
      state.authenticationFailed = false;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.userAuthorities = [];
      window.sessionStorage.removeItem(SESSION_STORAGE_JWT_VERIFY);
    });
    builder.addCase(logoutUser.rejected, (state) => {
      state.isAuthenticated = false;
      state.userAuthorities = [];
      window.sessionStorage.removeItem(SESSION_STORAGE_JWT_VERIFY);
    });
    builder.addCase(getCustomerSupportStatus.fulfilled, (state, action) => {
      if (action.payload.length === 0) return;
      state.isCustomerSupportActive = action.payload[0].active === 'true';
    });
    builder.addCase(setCustomerSupportStatus.fulfilled, (state) => {
      state.isCustomerSupportActive = !state.isCustomerSupportActive;
    });
  },
});

export const { setIsAuthenticated, setIsNotAuthenticated } = authenticationSlice.actions;

export default authenticationSlice.reducer;
