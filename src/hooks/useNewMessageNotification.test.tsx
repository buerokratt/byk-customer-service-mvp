import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { Chat } from "../model/chat.model";
import adminsReducer from "../slices/admins.slice";
import authenticationReducer from "../slices/authentication.slice";
import chatsReducer from "../slices/chats.slice";
import { render } from "../utils/test.utils";
import Chats from "../views/chats/chats";
import { CHAT_STATUS } from "../utils/constants";
import * as sse from "../services/sse.service";

jest.mock("../services/chat.service");
jest.mock("../services/user.service");
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

let store: EnhancedStore;

const setDocumentHidden = (isHidden: boolean): void => {
  Object.defineProperty(document, "hidden", {
    configurable: true,
    get() {
      return isHidden;
    },
  });
};

const chat: Chat = {
  id: "",
  customerSupportId: "",
  created: new Date().toISOString(),
  updated: new Date(new Date().getDate() + 1).toISOString(),
  ended: new Date(new Date().getDate() + 2).toISOString(),
  status: CHAT_STATUS.OPEN,
  lastMessage: "",
  lastMessageTimestamp: new Date(new Date().getDate() + 2).toISOString(),
};

const chats = [
  { ...chat, id: "100", lastMessage: "Hey" },
  { ...chat, id: "101", lastMessage: "Bye" },
];

const mockSseResponsesWithInterval = (
  responses: Array<Array<Chat>>,
  ms: number
) =>
  // jest.spyOn(sse, 'default').mockReturnValue({
  //   onMessage: (input: any) => {
  //     responses.forEach((response, index) => {
  //       setTimeout(() => {
  //         input(response);
  //       }, index * ms);
  //     });
  //   },
  //   close: () => null,
  // });

  describe("New message notifications", () => {
    beforeEach(() => {
      document.title = "Bürokratt";
      jest.useFakeTimers();
      setDocumentHidden(false);

      store = configureStore({
        reducer: {
          chats: chatsReducer,
          authentication: authenticationReducer,
          admins: adminsReducer,
        },
        preloadedState: {
          authentication: {
            isAuthenticated: true,
            jwtExpirationTimestamp: "",
            authenticationFailed: false,
            userAuthorities: [],
            userLogin: "JohnDoe",
            isCustomerSupportActive: true,
            customerSupportId: "EE60001019906",
          },
        },
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.useRealTimers();
    });

    it("should not update document title, when a new chat is added to the state and window is active", async () => {
      mockSseResponsesWithInterval([[], chats], 5000);

      render(
        <Provider store={store}>
          <Chats />
        </Provider>
      );
      expect(document.title).toBe("Bürokratt");

      jest.advanceTimersByTime(6000);

      await screen.findByText(/Hey/, {}, { timeout: 5000 });
      expect(document.title).toBe("Bürokratt");
    });

    it("should update document title, when a new chat is added to the state and window is not active", async () => {
      mockSseResponsesWithInterval([[], chats], 5000);

      render(
        <Provider store={store}>
          <Chats />
        </Provider>
      );
      expect(document.title).toBe("Bürokratt");

      setDocumentHidden(true);
      jest.advanceTimersByTime(6000);

      await screen.findByText(/Hey/, {}, { timeout: 5000 });
      expect(document.title).toBe("(2) uus sõnum! - Bürokratt");
    });
  });
