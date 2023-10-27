import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import chatsReducer from '../slices/chats.slice';
import authenticationReducer from '../slices/authentication.slice';
import adminsReducer from '../slices/admins.slice';
import configureReducer from '../slices/configuration.slice';
import trainingReducer from '../slices/training.slice';

export const store = configureStore({
  reducer: {
    chats: chatsReducer,
    authentication: authenticationReducer,
    admins: adminsReducer,
    configuration: configureReducer,
    training: trainingReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
