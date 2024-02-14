import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { Chat } from "../../model/chat.model";
import adminsReducer from "../../slices/admins.slice";
import authenticationReducer from "../../slices/authentication.slice";
import chatsReducer from "../../slices/chats.slice";
import { render } from "../../utils/test.utils";
import Chats from "./chats";
import { CHAT_STATUS } from "../../utils/constants";
import * as sse from "../../services/sse.service";

jest.mock("../../services/chat.service");
jest.mock("../../services/user.service");

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));
let store: EnhancedStore;

function createTestStore() {
  return configureStore({
    reducer: {
      chats: chatsReducer,
      authentication: authenticationReducer,
      admins: adminsReducer,
    },
  });
}

describe("Chats view", () => {
  beforeEach(() => {
    store = createTestStore();
  });

  const singleChat: Chat = {
    id: "",
    customerSupportDisplayName: "",
    customerSupportId: "",
    created: new Date().toISOString(),
    ended: new Date(new Date().getDate() + 1).toISOString(),
    updated: "string",
    status: CHAT_STATUS.OPEN,
    lastMessage: "tere päevast!",
  };

  it("should render chats view", () => {
    // jest.spyOn(sse, 'default').mockReturnValue({
    //   onMessage: (input: any) => {
    //     input([]);
    //   },
    //   close: () => null,
    // });
    render(
      <Provider store={store}>
        <Chats />
      </Provider>
    );
  });

  it("should not show chats with customerSupportId in unanswered tab", async () => {
    const chats: Chat[] = [
      {
        ...singleChat,
        id: "100",
        lastMessage: "Hey",
        customerSupportDisplayName: "Example",
        customerSupportId: "1",
      },
      { ...singleChat, id: "101", lastMessage: "Bye", customerSupportId: "" },
    ];
    // jest.spyOn(sse, "default").mockReturnValue({
    //   onMessage: (input: any) => {
    //     input(chats);
    //   },
    //   close: () => null,
    // });

    render(
      <Provider store={store}>
        <Chats />
      </Provider>
    );

    await screen.findByText(/Bye/);
    expect(screen.queryByText("Hey")).toBeNull();
  });
});
