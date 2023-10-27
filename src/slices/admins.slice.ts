import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import UserService from '../services/user.service';
import { User, UserInDetailModal } from '../model/user.model';

export interface AdminsState {
  admins: User[];
  selectedUser: User | null;
  availableConnections: string[];
}

const initialState: AdminsState = {
  admins: [],
  selectedUser: null,
  availableConnections: [],
};

export const deleteUser = createAsyncThunk('admins/deleteUser', async (_args, thunkApi) => {
  const {
    admins: { selectedUser },
  } = thunkApi.getState() as { admins: AdminsState };

  return selectedUser ? UserService.deleteUser(selectedUser.idCode) : null;
});

export const findAllUsers = createAsyncThunk('admins/findAllUsers', async () => UserService.findAllUsers());

export const findAllCustomerSupportAgents = createAsyncThunk('admins/findAllCustomerSupportAgents', async () => UserService.findAllCustomerSupportAgents());

export const findAllEstablishments = createAsyncThunk('admins/findAllEstablishments', async () => UserService.findAllEstablishments());

export const editSelectedUser = createAsyncThunk('admins/editUser', async (user: UserInDetailModal) => UserService.editUser(user));

export const adminsSlice = createSlice({
  name: 'admins',
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    setSelectedUser: (state, action: PayloadAction<User>) => {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(findAllUsers.fulfilled, (state, action) => {
      state.admins = action.payload;
    });
    builder.addCase(findAllCustomerSupportAgents.fulfilled, (state, action) => {
      state.admins = action.payload;
    });
    builder.addCase(deleteUser.fulfilled, (state) => {
      state.selectedUser = null;
    });
    builder.addCase(findAllEstablishments.fulfilled, (state, action: PayloadAction<any>) => {
      state.availableConnections = action.payload.establishments;
    });
  },
});

export const { clearSelectedUser, setSelectedUser } = adminsSlice.actions;

export default adminsSlice.reducer;
