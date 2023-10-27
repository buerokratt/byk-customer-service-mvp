/* eslint-disable */
import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import chatsReducer from '../slices/chats.slice';
import configurationReducer from '../slices/configuration.slice';
import authenticationReducer from '../slices/authentication.slice';
import adminsReducer from '../slices/admins.slice';

function render(
  ui,
  {
    preloadedState,
    store = configureStore({
      reducer: {
        chats: chatsReducer,
        authentication: authenticationReducer,
        admins: adminsReducer,
        configuration: configurationReducer,
      },
      preloadedState,
    }),
    ...renderOptions
  } = {},
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from '@testing-library/react';
export { render };
